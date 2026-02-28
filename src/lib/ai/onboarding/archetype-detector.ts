// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — AI Archetype Detector
// Analyses onboarding answers and assigns a UserArchetype.
// Called once during onboarding, result saved to Convex users table.
// ═══════════════════════════════════════════════════════════════════════════════

import { callAIJson } from '../provider-router';
import type { UserArchetype } from './archetypes';

// ─────────────────────────────────────────────────────────────────────────────
const DETECTION_SYSTEM_PROMPT = `You are RESURGO's User Archetype Detector. Based on onboarding data, 
determine which archetype best matches this user. Output only valid JSON.

ARCHETYPES:
1. the_rebuilder — Returning from burnout, life crisis, major setback.
   SIGNALS: "starting over", "getting back on track", past failures, loss, recovery, difficult period.

2. the_optimizer — Already has systems, wants improvement.  
   SIGNALS: mentions existing tools, specific metrics, "efficiency", "optimize", tech-savvy, already has defined goals.

3. the_scattered — ADHD, executive function challenges, chronic disorganization.
   SIGNALS: mentions ADHD, "I start but never finish", "I forget", "brain is chaos", multiple tangents, overwhelming task lists.

4. the_seeker — Doesn't know what they want yet.
   SIGNALS: "I don't know", "figuring things out", "lost", "searching for purpose", no specific goals, philosophical.

5. the_ambitious — Clear goals, high drive, needs accountability.
   SIGNALS: specific goals with deadlines, competitive language, lists of achievements, business/career advancement focus.

6. the_overwhelmed — Drowning, needs radical simplification.
   SIGNALS: "everything is too much", "I can't handle", very long problem dumps, mentions anxiety/stress, "where do I even start".

RULES:
- Choose the SINGLE best match. Pick the dominant archetype.
- If truly ambiguous, default to "the_seeker".
- Confidence: be honest, don't overclaim.

OUTPUT (JSON only, no markdown):
{
  "archetype": "the_rebuilder|the_optimizer|the_scattered|the_seeker|the_ambitious|the_overwhelmed",
  "confidence": <number 0-100>,
  "reasoning": "<brief explanation>",
  "secondary_archetype": "<string or null>",
  "detected_signals": ["<signal1>", "<signal2>"]
}`;

// ─────────────────────────────────────────────────────────────────────────────
// Input data from the onboarding conversation
// ─────────────────────────────────────────────────────────────────────────────
export interface OnboardingData {
  brainDump?: string;
  lifeSituation?: string;
  schedule?: string;
  energyPattern?: string;
  goalsAnswer?: string;
  communicationStyle?: string;
  stressResponse?: string;
  previousToolsUsed?: string;
  biggestChallenge?: string;
}

export interface ArchetypeDetectionResult {
  archetype: UserArchetype;
  confidence: number;
  reasoning: string;
  secondaryArchetype: UserArchetype | null;
  detectedSignals: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// DETECT ARCHETYPE
// ─────────────────────────────────────────────────────────────────────────────
export async function detectArchetype(
  data: OnboardingData
): Promise<ArchetypeDetectionResult> {
  const userContent = `Onboarding data:\n${JSON.stringify(data, null, 2)}`;

  try {
    const { data: raw } = await callAIJson<{
      archetype: string;
      confidence: number;
      reasoning: string;
      secondary_archetype: string | null;
      detected_signals: string[];
    }>(
      [
        { role: 'system', content: DETECTION_SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
      { taskType: 'quick', temperature: 0.2, maxTokens: 500 }
    );

    const VALID_ARCHETYPES: UserArchetype[] = [
      'the_rebuilder', 'the_optimizer', 'the_scattered',
      'the_seeker', 'the_ambitious', 'the_overwhelmed',
    ];

    const archetype = VALID_ARCHETYPES.includes(raw.archetype as UserArchetype)
      ? (raw.archetype as UserArchetype)
      : 'the_seeker';

    const secondary = raw.secondary_archetype &&
      VALID_ARCHETYPES.includes(raw.secondary_archetype as UserArchetype)
      ? (raw.secondary_archetype as UserArchetype)
      : null;

    return {
      archetype,
      confidence: Math.min(100, Math.max(0, raw.confidence ?? 50)),
      reasoning: raw.reasoning ?? '',
      secondaryArchetype: secondary,
      detectedSignals: Array.isArray(raw.detected_signals) ? raw.detected_signals : [],
    };
  } catch (err) {
    console.error('[ArchetypeDetector] Detection failed:', err);
    return {
      archetype: 'the_seeker',
      confidence: 20,
      reasoning: 'Detection failed — defaulting to seeker',
      secondaryArchetype: null,
      detectedSignals: [],
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Quick heuristic fallback (no AI call — for offline/rate-limit scenarios)
// ─────────────────────────────────────────────────────────────────────────────
export function heuristicArchetypeDetect(data: OnboardingData): UserArchetype {
  const text = Object.values(data).filter(Boolean).join(' ').toLowerCase();

  const scores: Record<UserArchetype, number> = {
    the_rebuilder: 0,
    the_optimizer: 0,
    the_scattered: 0,
    the_seeker: 0,
    the_ambitious: 0,
    the_overwhelmed: 0,
  };

  // Rebuilder signals
  if (/start(?:ing)? over|back on track|recovery|burnout|setback|difficult (?:time|period)|lost (?:my )?job|divorce/.test(text)) scores.the_rebuilder += 3;

  // Optimizer signals
  if (/optim|efficien|system|metrics?|productivity|notion|obsidian|already use|data/.test(text)) scores.the_optimizer += 3;

  // Scattered signals
  if (/adhd|scatter|focus|forget|distract|tab|procrastinat|chaos|overwhelm.*brain|brain.*fog/.test(text)) scores.the_scattered += 3;

  // Seeker signals
  if (/don'?t know|not sure|figur|purpose|meaning|direction|lost|search/.test(text)) scores.the_seeker += 3;

  // Ambitious signals
  if (/goal|target|deadline|milestone|launch|business|revenue|achieve|success|build/.test(text)) scores.the_ambitious += 2;

  // Overwhelmed signals
  if (/too much|can'?t cope|overwhelm|stress|anxiety|everything|where (?:do )?i (?:even )?start/.test(text)) scores.the_overwhelmed += 3;

  return (Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0]) as UserArchetype ?? 'the_seeker';
}
