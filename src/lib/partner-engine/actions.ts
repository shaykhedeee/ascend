/**
 * RESURGO — Partner Engine Action Schemas
 * Every feature mutation the AI is allowed to propose.
 *
 * src/lib/partner-engine/actions.ts
 *
 * Idempotency: all state-changing actions carry a `clientRef`.
 * Use pattern `${eventId}:${index}` so retries don't duplicate records.
 */
import { z } from "zod";
import {
  ISODate,
  ISODateTime,
  Id,
  TaskCategory,
  TaskPriority,
  EnergyLevel,
  HabitSchedule,
  CoachingTone,
  ReminderIntensity,
  ReminderChannel,
  CoachingStyleVector,
  UserSegment,
  MoodboardAesthetic,
  MoodboardTile,
} from "./domain";

// ─── Base ─────────────────────────────────────────────────────────────────────

const ClientRef = z.string().min(6).max(96);

export const ActionBase = z.object({
  clientRef: ClientRef,
}).strict();

// ─── TASK actions ─────────────────────────────────────────────────────────────

export const ActionTaskUpsert = ActionBase.extend({
  type: z.literal("task.upsert"),
  task: z
    .object({
      id: Id.nullable().default(null),       // null → create new
      title: z.string().min(2).max(200),
      category: TaskCategory,
      priority: TaskPriority,
      energy: EnergyLevel,
      dueDate: ISODate.nullable().default(null),
      estimateMin: z.number().int().min(5).max(480).nullable().default(null),
      notes: z.string().max(2000).nullable().default(null),
    })
    .strict(),
}).strict();

export const ActionTaskComplete = ActionBase.extend({
  type: z.literal("task.complete"),
  taskId: Id,
  completedAt: ISODateTime.optional(),
}).strict();

export const ActionTaskArchive = ActionBase.extend({
  type: z.literal("task.archive"),
  taskId: Id,
}).strict();

// ─── HABIT actions ────────────────────────────────────────────────────────────

export const ActionHabitUpsert = ActionBase.extend({
  type: z.literal("habit.upsert"),
  habit: z
    .object({
      id: Id.nullable().default(null),
      name: z.string().min(2).max(80),
      schedule: HabitSchedule,
      notes: z.string().max(2000).nullable().default(null),
      status: z.enum(["active", "paused", "archived"]).default("active"),
    })
    .strict(),
}).strict();

export const ActionHabitLog = ActionBase.extend({
  type: z.literal("habit.log"),
  habitId: Id,
  date: ISODate,
  value: z.number().nullable().default(1), // supports quantified habits later
}).strict();

// ─── GOAL actions ─────────────────────────────────────────────────────────────

export const ActionGoalUpsert = ActionBase.extend({
  type: z.literal("goal.upsert"),
  goal: z
    .object({
      id: Id.nullable().default(null),
      title: z.string().min(2).max(120),
      why: z.string().max(500).nullable().default(null),
      status: z.enum(["active", "paused", "completed", "archived"]).default("active"),
      horizon: z
        .enum(["today", "week", "month", "quarter", "year", "someday"])
        .default("month"),
    })
    .strict(),
}).strict();

// ─── USER PROFILE + PREFS actions ────────────────────────────────────────────

export const ActionPrefSet = ActionBase.extend({
  type: z.literal("pref.set"),
  pref: z
    .object({
      tone: CoachingTone.optional(),
      reminderIntensity: ReminderIntensity.optional(),
      preferredChannels: z.array(ReminderChannel).max(3).optional(),
      timezone: z.string().min(3).max(64).optional(),
    })
    .strict(),
}).strict();

export const ActionSegmentSet = ActionBase.extend({
  type: z.literal("user.segment.set"),
  segment: UserSegment,
  confidence: z.number().min(0).max(1),
  reason: z.string().min(5).max(240),
}).strict();

export const ActionCoachingVectorPatch = ActionBase.extend({
  type: z.literal("user.coachingVector.patch"),
  patch: CoachingStyleVector.partial().refine(
    (obj) => Object.keys(obj).length > 0,
    "Patch must include at least one field"
  ),
  reason: z.string().min(5).max(240),
}).strict();

export const ActionMemoryPatch = ActionBase.extend({
  type: z.literal("user.memory.patch"),
  /**
   * Not raw journaling. Short summary injected into prompts.
   * Keep compact and stable — not a diary.
   */
  memorySummary: z.string().min(0).max(800),
}).strict();

// ─── NUDGES / reminders ───────────────────────────────────────────────────────

export const ActionNudgeSchedule = ActionBase.extend({
  type: z.literal("nudge.schedule"),
  channel: ReminderChannel,
  when: ISODateTime,
  message: z.string().min(1).max(240),
  purpose: z
    .enum([
      "morning_checkin",
      "midday_nudge",
      "evening_review",
      "deadline_alert",
      "habit_prompt",
      "custom",
    ])
    .default("custom"),
}).strict();

export const ActionNudgeCancel = ActionBase.extend({
  type: z.literal("nudge.cancel"),
  nudgeId: Id,
}).strict();

// ─── JOURNAL entry ────────────────────────────────────────────────────────────

export const ActionJournalAdd = ActionBase.extend({
  type: z.literal("journal.add"),
  date: ISODate,
  mood: z.enum(["very_low", "low", "neutral", "good", "great"]).optional(),
  text: z.string().min(1).max(1200),
}).strict();

// ─── MOODBOARD actions ────────────────────────────────────────────────────────

export const ActionMoodboardCreate = ActionBase.extend({
  type: z.literal("moodboard.create"),
  board: z
    .object({
      id: Id.optional(),
      title: z.string().min(2).max(80).optional(),
      aesthetic: MoodboardAesthetic.optional(),
      palette: z
        .array(z.string().regex(/^#([0-9a-fA-F]{6})$/))
        .min(3)
        .max(8)
        .optional(),
      tiles: z.array(MoodboardTile).max(40).optional(),
    })
    .strict(),
}).strict();

/**
 * moodboard.update — patch-like but simple. No JSON Patch complexity.
 * Supports: palette changes, aesthetic changes, tile add/update/remove.
 */
export const ActionMoodboardUpdate = ActionBase.extend({
  type: z.literal("moodboard.update"),
  boardId: Id,
  update: z
    .object({
      title: z.string().min(2).max(80).optional(),
      aesthetic: MoodboardAesthetic.optional(),
      palette: z
        .array(z.string().regex(/^#([0-9a-fA-F]{6})$/))
        .min(3)
        .max(8)
        .optional(),

      addTiles: z.array(MoodboardTile).max(30).optional(),
      updateTiles: z.array(MoodboardTile).max(30).optional(), // full tile replacement by id
      removeTileIds: z.array(Id).max(30).optional(),

      layoutHint: z
        .enum(["grid", "collage", "grouped_by_theme", "timeline"])
        .optional(),
      rationale: z.string().min(5).max(240).optional(),
    })
    .strict()
    .refine(
      (u) => Object.keys(u).length > 0,
      "Update must include at least one change"
    ),
}).strict();

// ─── Union: all actions the AI can propose ────────────────────────────────────

export const PartnerAction = z.discriminatedUnion("type", [
  ActionTaskUpsert,
  ActionTaskComplete,
  ActionTaskArchive,
  ActionHabitUpsert,
  ActionHabitLog,
  ActionGoalUpsert,
  ActionPrefSet,
  ActionSegmentSet,
  ActionCoachingVectorPatch,
  ActionMemoryPatch,
  ActionNudgeSchedule,
  ActionNudgeCancel,
  ActionJournalAdd,
  ActionMoodboardCreate,
  ActionMoodboardUpdate,
]);

export type PartnerActionT = z.infer<typeof PartnerAction>;

// ─── Action type literal helpers (for executor switches) ─────────────────────

export type ActionType = PartnerActionT["type"];

export type ActionByType<T extends ActionType> = Extract<PartnerActionT, { type: T }>;
