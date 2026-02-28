import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// OCEAN / Big Five Model
// Each trait scored 1–10 with a confidence percentage (0–100).
// Scores shift by ≤ 0.5 per interaction to prevent wild swings.
// ─────────────────────────────────────────────────────────────────────────────
export const BigFiveProfileSchema = z.object({
  openness: z.number().min(1).max(10),
  conscientiousness: z.number().min(1).max(10),
  extraversion: z.number().min(1).max(10),
  agreeableness: z.number().min(1).max(10),
  neuroticism: z.number().min(1).max(10),
  confidence: z.number().min(0).max(100), // overall confidence in the profile
});
export type BigFiveProfile = z.infer<typeof BigFiveProfileSchema>;

export const DEFAULT_BIG_FIVE: BigFiveProfile = {
  openness: 5,
  conscientiousness: 5,
  extraversion: 5,
  agreeableness: 5,
  neuroticism: 5,
  confidence: 0,
};

// ─────────────────────────────────────────────────────────────────────────────
// CBT Cognitive Distortion Patterns
// ─────────────────────────────────────────────────────────────────────────────
export const CognitiveDistortionSchema = z.enum([
  'all_or_nothing',
  'overgeneralisation',
  'mental_filter',
  'disqualifying_positive',
  'mind_reading',
  'fortune_telling',
  'catastrophising',
  'emotional_reasoning',
  'should_statements',
  'labelling',
]);
export type CognitiveDistortion = z.infer<typeof CognitiveDistortionSchema>;

export const CognitivePatternSchema = z.object({
  detectedPatterns: z.array(CognitiveDistortionSchema),
  dominantPattern: CognitiveDistortionSchema.nullable(),
  reframingEffectiveness: z.number().min(0).max(100), // % success of past reframes
});
export type CognitivePattern = z.infer<typeof CognitivePatternSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Self-Determination Theory (SDT) + Motivational Interviewing Stage
// ─────────────────────────────────────────────────────────────────────────────
export const ChangeStageSchema = z.enum([
  'precontemplation',
  'contemplation',
  'preparation',
  'action',
  'maintenance',
]);
export type ChangeStage = z.infer<typeof ChangeStageSchema>;

export const MotivationalProfileSchema = z.object({
  autonomyNeed: z.number().min(1).max(10),       // needs to feel in control
  competenceNeed: z.number().min(1).max(10),     // needs to feel capable
  relatednessNeed: z.number().min(1).max(10),    // needs connection/accountability
  changeStage: ChangeStageSchema,
  intrinsicMotivation: z.number().min(1).max(10),
  extrinsicMotivation: z.number().min(1).max(10),
});
export type MotivationalProfile = z.infer<typeof MotivationalProfileSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Behavioural Patterns derived from interaction history
// ─────────────────────────────────────────────────────────────────────────────
export const BehavioralPatternsSchema = z.object({
  preferredTaskSize: z.enum(['micro', 'standard', 'large']),
  procrastinationTendency: z.number().min(0).max(10),
  preferredFeedbackStyle: z.enum(['direct', 'gentle', 'analytical', 'celebratory']),
  bestEngagementTime: z.enum(['morning', 'afternoon', 'evening', 'unknown']).optional(),
  streakBreakPattern: z.string().optional(), // e.g. "often breaks on Mondays"
  avoidanceBehaviours: z.array(z.string()).max(8).optional(), // recurring avoidance patterns
});
export type BehavioralPatterns = z.infer<typeof BehavioralPatternsSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Emotional Arc — tracks session-level and cross-session emotional momentum.
// Updated every session (unlike Big Five which updates every 5 interactions).
// ─────────────────────────────────────────────────────────────────────────────
export const EmotionalArcSchema = z.object({
  sessionTrajectory: z.enum(['improving', 'declining', 'stable', 'volatile']).default('stable'),
  rollingMoodAvg: z.number().min(1).max(10).default(5),       // weighted rolling avg
  consecutivePositive: z.number().min(0).default(0),          // sessions in positive arc
  consecutiveNegative: z.number().min(0).default(0),          // sessions in negative arc
  lastSignificantShiftAt: z.number().default(0),              // Unix ms
  emotionalVelocity: z.number().min(-5).max(5).default(0),    // rate of change per session
});
export type EmotionalArc = z.infer<typeof EmotionalArcSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Trigger Map — contextual patterns that reliably predict distress or energy.
// Built incrementally from conversation analysis.
// ─────────────────────────────────────────────────────────────────────────────
export const TriggerMapSchema = z.object({
  stressTriggers:     z.array(z.string()).max(10).default([]),  // phrases/contexts that raise distress
  motivationTriggers: z.array(z.string()).max(10).default([]), // contexts that unlock energy
  avoidanceTopics:    z.array(z.string()).max(10).default([]), // subjects the user consistently deflects
  peakPerformanceContext: z.string().optional(),              // when they're at their best
});
export type TriggerMap = z.infer<typeof TriggerMapSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Resilience Score — derived composite. Not AI-set directly; computed from
// Big Five (inverse neuroticism, openness), motivational (changeStage), and
// cognitive (reframingEffectiveness). Updated each profile cycle.
// ─────────────────────────────────────────────────────────────────────────────
export const ResilienceScoreSchema = z.object({
  overall:      z.number().min(1).max(10).default(5),
  adaptability: z.number().min(1).max(10).default(5),   // openness + changeStage proxy
  stressRecovery: z.number().min(1).max(10).default(5), // inverse neuroticism
  growthMindset: z.number().min(1).max(10).default(5),  // conscientiousness + intrinsic motivation
});
export type ResilienceScore = z.infer<typeof ResilienceScoreSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Top-level Psychological Profile
// ─────────────────────────────────────────────────────────────────────────────
export const PsychologicalProfileSchema = z.object({
  version: z.literal(1),
  bigFive: BigFiveProfileSchema,
  cognitive: CognitivePatternSchema,
  motivational: MotivationalProfileSchema,
  behavioral: BehavioralPatternsSchema,
  // — New composite fields —
  emotionalArc: EmotionalArcSchema.optional(),
  triggerMap: TriggerMapSchema.optional(),
  resilience: ResilienceScoreSchema.optional(),
  safetyFlag: z.boolean().default(false), // true → disable profile-adaptive coaching
  lastProfiledAt: z.number(),
  interactionCount: z.number(),
});
export type PsychologicalProfile = z.infer<typeof PsychologicalProfileSchema>;

export const DEFAULT_PROFILE: PsychologicalProfile = {
  version: 1,
  bigFive: DEFAULT_BIG_FIVE,
  cognitive: {
    detectedPatterns: [],
    dominantPattern: null,
    reframingEffectiveness: 50,
  },
  motivational: {
    autonomyNeed: 5,
    competenceNeed: 5,
    relatednessNeed: 5,
    changeStage: 'contemplation',
    intrinsicMotivation: 5,
    extrinsicMotivation: 5,
  },
  behavioral: {
    preferredTaskSize: 'standard',
    procrastinationTendency: 5,
    preferredFeedbackStyle: 'gentle',
    bestEngagementTime: 'unknown',
    avoidanceBehaviours: [],
  },
  emotionalArc: {
    sessionTrajectory: 'stable',
    rollingMoodAvg: 5,
    consecutivePositive: 0,
    consecutiveNegative: 0,
    lastSignificantShiftAt: 0,
    emotionalVelocity: 0,
  },
  triggerMap: {
    stressTriggers: [],
    motivationTriggers: [],
    avoidanceTopics: [],
  },
  resilience: {
    overall: 5,
    adaptability: 5,
    stressRecovery: 5,
    growthMindset: 5,
  },
  safetyFlag: false,
  lastProfiledAt: 0,
  interactionCount: 0,
};

// ─────────────────────────────────────────────────────────────────────────────
// Compute resilience from existing Big Five + motivational + cognitive data.
// Pure function — no AI call needed.
// ─────────────────────────────────────────────────────────────────────────────
export function computeResilience(p: PsychologicalProfile): ResilienceScore {
  const stressRecovery = Math.round(((10 - p.bigFive.neuroticism) + p.cognitive.reframingEffectiveness / 10) / 2 * 10) / 10;
  const adaptability   = Math.round((p.bigFive.openness + p.bigFive.conscientiousness) / 2 * 10) / 10;
  const growthMindset  = Math.round((p.motivational.intrinsicMotivation + p.bigFive.conscientiousness) / 2 * 10) / 10;
  const overall        = Math.round((stressRecovery + adaptability + growthMindset) / 3 * 10) / 10;
  return {
    overall:   Math.min(10, Math.max(1, overall)),
    adaptability: Math.min(10, Math.max(1, adaptability)),
    stressRecovery: Math.min(10, Math.max(1, stressRecovery)),
    growthMindset: Math.min(10, Math.max(1, growthMindset)),
  };
}
