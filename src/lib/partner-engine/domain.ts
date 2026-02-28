/**
 * RESURGO — Partner Engine Domain Schemas
 * "Truth objects" the app manages. Actions create/update these.
 *
 * src/lib/partner-engine/domain.ts
 */
import { z } from "zod";

// ─── Common primitives ───────────────────────────────────────────────────────

export const ISODate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD");
export const ISODateTime = z.string().datetime({ message: "Must be a full ISO timestamp" });
export const Id = z.string().min(8).max(80);

// ─── Core enums ──────────────────────────────────────────────────────────────

export const TaskCategory = z.enum([
  "WORK",
  "PERSONAL",
  "HEALTH",
  "FINANCE",
  "LEARNING",
  "SOCIAL",
  "HOME",
  "CREATIVE",
  "ADMIN",
  "URGENT_LIFE",
]);

export const TaskPriority = z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]);
export const EnergyLevel = z.enum(["low", "medium", "high"]);

export const HabitFrequency = z.enum([
  "daily",
  "weekdays",
  "weekly",
  "3x_week",
  "custom", // use schedule object
]);

export const ReminderChannel = z.enum(["inapp", "telegram", "email"]);
export const ReminderIntensity = z.enum(["minimal", "normal", "intense"]);

export const CoachingTone = z.enum([
  "gentle",
  "balanced",
  "direct",
  "tough_love",
  "analytical",
]);

export const UserSegment = z.enum([
  "overwhelmed_starter",
  "builder_mode",
  "burnout_recovery",
  "routine_seeker",
  "deadline_sprinter",
  "health_reset",
  "unknown",
]);

// ─── Coaching style vector ───────────────────────────────────────────────────
// Continuous scores computed/adjusted over time. NOT diagnosis.

export const CoachingStyleVector = z.object({
  directness: z.number().min(0).max(1),
  structureNeed: z.number().min(0).max(1),
  reminderTolerance: z.number().min(0).max(1),
  shameSensitivity: z.number().min(0).max(1),
  overwhelmRisk: z.number().min(0).max(1),
});

export type CoachingStyleVectorT = z.infer<typeof CoachingStyleVector>;

// ─── Task model ──────────────────────────────────────────────────────────────

export const TaskModel = z.object({
  id: Id.optional(),
  title: z.string().min(2).max(200),
  category: TaskCategory,
  priority: TaskPriority,
  energy: EnergyLevel,
  dueDate: ISODate.nullable().default(null),
  estimateMin: z.number().int().min(5).max(480).nullable().default(null),
  notes: z.string().max(2000).nullable().default(null),
  status: z.enum(["open", "done", "archived"]).default("open"),
  createdAt: ISODateTime.optional(),
  updatedAt: ISODateTime.optional(),
});

export type TaskModelT = z.infer<typeof TaskModel>;

// ─── Habit model ─────────────────────────────────────────────────────────────

export const HabitSchedule = z.object({
  type: HabitFrequency,
  /** Only used when type === "custom" */
  custom: z
    .object({
      timesPerPeriod: z.number().int().min(1).max(50).optional(),
      period: z.enum(["week", "month"]).optional(),
      daysOfWeek: z
        .array(z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]))
        .optional(),
    })
    .optional(),
}).strict();

export const HabitModel = z.object({
  id: Id.optional(),
  name: z.string().min(2).max(80),
  schedule: HabitSchedule,
  notes: z.string().max(2000).nullable().default(null),
  status: z.enum(["active", "paused", "archived"]).default("active"),
  createdAt: ISODateTime.optional(),
  updatedAt: ISODateTime.optional(),
});

export type HabitModelT = z.infer<typeof HabitModel>;

// ─── Goal model ──────────────────────────────────────────────────────────────

export const GoalModel = z.object({
  id: Id.optional(),
  title: z.string().min(2).max(120),
  why: z.string().max(500).nullable().default(null),
  status: z.enum(["active", "paused", "completed", "archived"]).default("active"),
  horizon: z
    .enum(["today", "week", "month", "quarter", "year", "someday"])
    .default("month"),
  createdAt: ISODateTime.optional(),
  updatedAt: ISODateTime.optional(),
});

export type GoalModelT = z.infer<typeof GoalModel>;

// ─── User profile / partner memory ──────────────────────────────────────────

export const UserProfileModel = z.object({
  userId: Id,
  timezone: z.string().min(3).max(64).default("UTC"),
  tone: CoachingTone.default("balanced"),
  reminderIntensity: ReminderIntensity.default("normal"),
  preferredChannels: z.array(ReminderChannel).default(["inapp"]),

  segment: UserSegment.default("unknown"),
  coachingVector: CoachingStyleVector.default({
    directness: 0.5,
    structureNeed: 0.5,
    reminderTolerance: 0.5,
    shameSensitivity: 0.6,
    overwhelmRisk: 0.5,
  }),

  /**
   * Short string injected into prompts.
   * Not a diary — keep compact and stable.
   */
  memorySummary: z.string().max(800).default(""),
  updatedAt: ISODateTime.optional(),
});

export type UserProfileModelT = z.infer<typeof UserProfileModel>;

// ─── Moodboard domain ────────────────────────────────────────────────────────

export const MoodboardAesthetic = z.enum([
  "calm_minimal",
  "dark_terminal",
  "cyberpunk",
  "nature_grounded",
  "soft_pastel",
  "luxury_clean",
  "gym_grind",
  "study_academic",
  "creative_studio",
  "custom",
]);

export const MoodboardTileType = z.enum([
  "image",
  "quote",
  "keyword",
  "goal",
  "affirmation",
]);

export const MoodboardTile = z.object({
  id: Id,
  type: MoodboardTileType,

  text: z.string().max(240).nullable().default(null),

  image: z
    .object({
      url: z.string().url(),
      thumbUrl: z.string().url().nullable().default(null),
      source: z
        .enum(["unsplash", "pexels", "user_upload", "generated", "other"])
        .default("other"),
      attribution: z.string().max(240).nullable().default(null),
      dominantColor: z
        .string()
        .regex(/^#([0-9a-fA-F]{6})$/, "Must be a hex color like #1A2B3C")
        .nullable()
        .default(null),
    })
    .nullable()
    .default(null),

  layout: z
    .object({
      x: z.number().min(0).max(1).default(0),
      y: z.number().min(0).max(1).default(0),
      w: z.number().min(0.05).max(1).default(0.25),
      h: z.number().min(0.05).max(1).default(0.25),
      z: z.number().int().min(0).max(999).default(0),
    })
    .default({ x: 0, y: 0, w: 0.25, h: 0.25, z: 0 }),

  tags: z.array(z.string().min(1).max(24)).max(20).default([]),
}).strict();

export const MoodboardModel = z.object({
  id: Id,
  title: z.string().min(2).max(80).default("My Resurgo Board"),
  aesthetic: MoodboardAesthetic.default("calm_minimal"),
  palette: z
    .array(z.string().regex(/^#([0-9a-fA-F]{6})$/))
    .min(3)
    .max(8)
    .default(["#111827", "#F9FAFB", "#22C55E"]),
  tiles: z.array(MoodboardTile).max(60).default([]),
  updatedAt: ISODateTime.optional(),
});

export type MoodboardTileT = z.infer<typeof MoodboardTile>;
export type MoodboardModelT = z.infer<typeof MoodboardModel>;
