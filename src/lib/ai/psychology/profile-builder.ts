import { callAIJson } from '../provider-router';
import {
  PsychologicalProfileSchema,
  PsychologicalProfile,
  DEFAULT_PROFILE,
  BigFiveProfile,
  EmotionalArc,
  TriggerMap,
  computeResilience,
} from './profile-schema';

const MAX_TRAIT_DELTA = 0.5; // Max Big Five shift per interaction

// ─────────────────────────────────────────────────────────────────────────────
// Safety keyword detection — triggers *immediate* profile update regardless of
// interaction count. Checked BEFORE the every-5th throttle gate.
// ─────────────────────────────────────────────────────────────────────────────
const SAFETY_KEYWORDS = [
  'suicid', 'self-harm', 'want to die', 'end it all', 'kill myself',
  'no reason to live', 'worthless', 'hopeless', 'can\'t go on', 'give up',
];

function containsSafetyKeyword(text: string): boolean {
  const lower = text.toLowerCase();
  return SAFETY_KEYWORDS.some((kw) => lower.includes(kw));
}

// ─────────────────────────────────────────────────────────────────────────────
// Clamp a trait change to ± MAX_TRAIT_DELTA to prevent wild swings
// ─────────────────────────────────────────────────────────────────────────────
function clampDelta(current: number, proposed: number): number {
  const delta = proposed - current;
  const clamped = Math.max(-MAX_TRAIT_DELTA, Math.min(MAX_TRAIT_DELTA, delta));
  return Math.round((current + clamped) * 10) / 10;
}

function clampBigFive(current: BigFiveProfile, proposed: BigFiveProfile): BigFiveProfile {
  return {
    openness: clampDelta(current.openness, proposed.openness),
    conscientiousness: clampDelta(current.conscientiousness, proposed.conscientiousness),
    extraversion: clampDelta(current.extraversion, proposed.extraversion),
    agreeableness: clampDelta(current.agreeableness, proposed.agreeableness),
    neuroticism: clampDelta(current.neuroticism, proposed.neuroticism),
    confidence: Math.min(100, current.confidence + 5), // grows slowly
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Build the AI prompt for profile analysis
// ─────────────────────────────────────────────────────────────────────────────
function buildProfileAnalysisPrompt(
  conversationSnippet: string,
  currentProfile: PsychologicalProfile
): string {
  return `You are a clinical psychology researcher assistant. Analyse the conversation excerpt below and update the user's psychological profile.

CURRENT PROFILE (JSON):
${JSON.stringify(currentProfile, null, 2)}

CONVERSATION EXCERPT:
${conversationSnippet}

Rules:
1. Each Big Five trait is 1–10. Only suggest changes you are confident about.
2. You MUST output valid JSON matching the schema exactly.
3. Do NOT diagnose any mental health condition.
4. If the user expresses suicidal ideation, self-harm intent, or crisis language, set safetyFlag=true.
5. Be conservative — if unsure, keep existing values.
6. For triggerMap: extract any phrases/contexts that reliably predict stress or motivation.
7. For behavioral.avoidanceBehaviours: list patterns where the user deflects or procrastinates.

Output ONLY valid JSON (no markdown, no explanation):
{
  "bigFive": { "openness": n, "conscientiousness": n, "extraversion": n, "agreeableness": n, "neuroticism": n, "confidence": n },
  "cognitive": { "detectedPatterns": [], "dominantPattern": null, "reframingEffectiveness": n },
  "motivational": { "autonomyNeed": n, "competenceNeed": n, "relatednessNeed": n, "changeStage": "...", "intrinsicMotivation": n, "extrinsicMotivation": n },
  "behavioral": { "preferredTaskSize": "...", "procrastinationTendency": n, "preferredFeedbackStyle": "...", "bestEngagementTime": "...", "streakBreakPattern": "...", "avoidanceBehaviours": [] },
  "triggerMap": { "stressTriggers": [], "motivationTriggers": [], "avoidanceTopics": [], "peakPerformanceContext": "" },
  "safetyFlag": false
}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Update psychological profile — only runs every 3rd interaction
// Returns updated profile or null if skipped / failed
// ─────────────────────────────────────────────────────────────────────────────
export async function updatePsychProfile(params: {
  conversationSnippet: string;
  currentProfile: PsychologicalProfile | null;
  interactionCount: number;
}): Promise<PsychologicalProfile | null> {
  const current = params.currentProfile ?? DEFAULT_PROFILE;

  // ─ Safety-immediate gate: always analyse if crisis language detected ────────────────────
  const isSafetyTrigger = containsSafetyKeyword(params.conversationSnippet);

  // ─ Throttle: only run full AI analysis every 5th interaction (or on safety) ─
  if (!isSafetyTrigger && params.interactionCount % 5 !== 0) return null;

  const prompt = buildProfileAnalysisPrompt(params.conversationSnippet, current);

  try {
    const { data: raw } = await callAIJson<Partial<PsychologicalProfile>>(
      [{ role: 'user', content: prompt }],
      { taskType: 'quick', temperature: 0.2, maxTokens: 800 }
    );

    // Merge Big Five with clamping (prevents wild swings)
    const updatedBigFive = raw.bigFive
      ? clampBigFive(current.bigFive, { ...current.bigFive, ...raw.bigFive })
      : current.bigFive;

    // Merge trigger map — union new triggers with existing (deduplicated, no Set spread)
    const existingTriggers = current.triggerMap ?? { stressTriggers: [], motivationTriggers: [], avoidanceTopics: [] };
    const newTriggers = (raw as any).triggerMap as Partial<TriggerMap> | undefined ?? {};
    const dedupe = (a: string[], b: string[]) => Array.from(new Set(a.concat(b))).slice(0, 10);
    const updatedTriggerMap: TriggerMap = {
      stressTriggers:     dedupe(existingTriggers.stressTriggers,     newTriggers.stressTriggers     ?? []),
      motivationTriggers: dedupe(existingTriggers.motivationTriggers, newTriggers.motivationTriggers ?? []),
      avoidanceTopics:    dedupe(existingTriggers.avoidanceTopics,    newTriggers.avoidanceTopics    ?? []),
      peakPerformanceContext: newTriggers.peakPerformanceContext ?? existingTriggers.peakPerformanceContext,
    };

    const proposed: PsychologicalProfile = {
      version: 1,
      bigFive:      updatedBigFive,
      cognitive:    raw.cognitive    ?? current.cognitive,
      motivational: raw.motivational ?? current.motivational,
      behavioral:   raw.behavioral   ?? current.behavioral,
      emotionalArc: current.emotionalArc, // updated separately by coach route
      triggerMap:   updatedTriggerMap,
      resilience:   computeResilience({ ...current, bigFive: updatedBigFive, cognitive: raw.cognitive ?? current.cognitive, motivational: raw.motivational ?? current.motivational }),
      safetyFlag:   isSafetyTrigger ? true : (raw.safetyFlag ?? current.safetyFlag),
      lastProfiledAt: Date.now(),
      interactionCount: params.interactionCount,
    };

    // Validate with Zod
    const parsed = PsychologicalProfileSchema.safeParse(proposed);
    if (!parsed.success) {
      console.warn('[PsychProfile] Zod validation failed, keeping current profile', parsed.error.issues);
      return null;
    }

    return parsed.data;
  } catch (err) {
    console.error('[PsychProfile] Profile update failed:', err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Update emotional arc based on session mood signal.
// Call at the end of each coaching turn with the inferred mood (1-10).
// ─────────────────────────────────────────────────────────────────────────────
export function updateEmotionalArc(
  current: EmotionalArc | undefined,
  sessionMoodSignal: number  // 1-10, infer from log_mood action or AI tone detection
): EmotionalArc {
  const prev = current ?? {
    sessionTrajectory: 'stable' as const,
    rollingMoodAvg: 5,
    consecutivePositive: 0,
    consecutiveNegative: 0,
    lastSignificantShiftAt: 0,
    emotionalVelocity: 0,
  };

  // Weighted rolling average (80% previous, 20% new)
  const newAvg = Math.round((prev.rollingMoodAvg * 0.8 + sessionMoodSignal * 0.2) * 10) / 10;
  const velocity = Math.round((newAvg - prev.rollingMoodAvg) * 10) / 10;

  const wasPositive = sessionMoodSignal >= 6;
  const significantShift = Math.abs(velocity) >= 1.5;

  let trajectory: EmotionalArc['sessionTrajectory'] = 'stable';
  const newConsecPos = wasPositive  ? prev.consecutivePositive + 1 : 0;
  const newConsecNeg = !wasPositive ? prev.consecutiveNegative + 1 : 0;

  if (newConsecPos >= 3) trajectory = 'improving';
  else if (newConsecNeg >= 2) trajectory = 'declining';
  else if (Math.abs(velocity) >= 2) trajectory = 'volatile';
  else trajectory = 'stable';

  return {
    sessionTrajectory: trajectory,
    rollingMoodAvg: newAvg,
    consecutivePositive: newConsecPos,
    consecutiveNegative: newConsecNeg,
    lastSignificantShiftAt: significantShift ? Date.now() : prev.lastSignificantShiftAt,
    emotionalVelocity: velocity,
  };
}
