/**
 * RESURGO — Partner Engine Output Schema
 * The single JSON object the LLM must return every turn.
 *
 * src/lib/partner-engine/output.ts
 */
import { z } from "zod";
import { PartnerAction } from "./actions";

// ─── Extracted signals (debug / telemetry only — no direct state mutation) ────

export const ExtractedSignals = z.object({
  /**
   * Emotional signals detected from user message.
   * Used for telemetry/analytics, NOT for driving UI directly.
   */
  emotions: z
    .array(
      z.enum([
        "overwhelmed",
        "anxious",
        "frustrated",
        "hopeful",
        "motivated",
        "exhausted",
        "confused",
        "guilty",
        "neutral",
        "excited",
      ])
    )
    .max(6)
    .optional(),

  /** High-level intent classification of the user message */
  intent: z
    .enum([
      "dump",
      "plan",
      "reflect",
      "vent",
      "crisis",
      "habit",
      "goal",
      "task_update",
      "other",
    ])
    .optional(),

  /** Urgency level the model inferred from the message */
  urgency: z.enum(["low", "medium", "high"]).optional(),

  /**
   * Model may suggest a tone shift.
   * Actual pref mutation must go through ActionPrefSet — not here.
   */
  suggestedTone: z
    .enum(["gentle", "balanced", "direct", "tough_love", "analytical"])
    .optional(),
}).strict();

export type ExtractedSignalsT = z.infer<typeof ExtractedSignals>;

// ─── Primary output schema ────────────────────────────────────────────────────

export const PartnerEngineOutput = z.object({
  /**
   * Schema version — bump when breaking changes land.
   * Validators can gate on this to reject stale model outputs.
   */
  schemaVersion: z.literal(1),

  /**
   * What the user sees. Human, short, 1 question max.
   * The "partner feel" lives largely here.
   */
  assistantMessage: z.string().min(1).max(1400),

  /**
   * Validated mutations to apply server-side.
   * Limit of 40 prevents model going wild on a single turn.
   */
  actions: z.array(PartnerAction).max(40),

  /**
   * Compact update to user memory summary — injected into future prompts.
   * Server may merge/replace. Keep it stable, not journaling.
   */
  memoryPatch: z.string().min(0).max(800),

  /**
   * Optional debug signals. Never trigger state changes directly.
   */
  signals: ExtractedSignals.optional(),
}).strict();

export type PartnerEngineOutputT = z.infer<typeof PartnerEngineOutput>;
