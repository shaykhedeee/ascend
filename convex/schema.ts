// ═══════════════════════════════════════════════════════════════════════════════
// VANTAGE — Convex Database Schema
// Identity-Based Growth OS — Real-time, Type-safe, Serverless
// ═══════════════════════════════════════════════════════════════════════════════

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // ─────────────────────────────────────────────────────────────────────────────
  // USERS — Synced with Clerk
  // ─────────────────────────────────────────────────────────────────────────────
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    plan: v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime')),
    timezone: v.optional(v.string()),
    theme: v.optional(v.union(v.literal('light'), v.literal('dark'), v.literal('system'))),
    onboardingComplete: v.boolean(),
    streakFreezeCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_clerkId', ['clerkId'])
    .index('by_email', ['email']),

  // ─────────────────────────────────────────────────────────────────────────────
  // GOALS — The "North Star" objectives
  // ─────────────────────────────────────────────────────────────────────────────
  goals: defineTable({
    userId: v.id('users'),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    status: v.union(
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('paused'),
      v.literal('abandoned')
    ),
    progress: v.number(), // 0-100
    targetDate: v.optional(v.string()), // ISO date
    identityLabel: v.optional(v.string()), // "I am becoming a Runner"
    aiPlan: v.optional(v.any()), // AI-generated decomposition JSON
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_status', ['userId', 'status']),

  // ─────────────────────────────────────────────────────────────────────────────
  // HABITS — Daily actions tied to goals
  // ─────────────────────────────────────────────────────────────────────────────
  habits: defineTable({
    userId: v.id('users'),
    goalId: v.optional(v.id('goals')),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    frequency: v.union(
      v.literal('daily'),
      v.literal('weekdays'),
      v.literal('weekends'),
      v.literal('3x_week'),
      v.literal('weekly'),
      v.literal('custom')
    ),
    customDays: v.optional(v.array(v.number())), // 0=Sun, 6=Sat
    timeOfDay: v.union(
      v.literal('morning'),
      v.literal('afternoon'),
      v.literal('evening'),
      v.literal('anytime')
    ),
    identityLabel: v.optional(v.string()), // "Runner", "Writer"
    isActive: v.boolean(),
    streakCurrent: v.number(),
    streakLongest: v.number(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    order: v.optional(v.number()), // for sorting
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_active', ['userId', 'isActive'])
    .index('by_goalId', ['goalId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // HABIT LOGS — Individual completion records
  // ─────────────────────────────────────────────────────────────────────────────
  habitLogs: defineTable({
    habitId: v.id('habits'),
    userId: v.id('users'),
    date: v.string(), // ISO date string YYYY-MM-DD
    status: v.union(
      v.literal('completed'),
      v.literal('skipped'),
      v.literal('failed')
    ),
    mood: v.optional(v.number()), // 1-5
    note: v.optional(v.string()),
    completedAt: v.optional(v.number()), // timestamp
  })
    .index('by_habitId', ['habitId'])
    .index('by_habitId_date', ['habitId', 'date'])
    .index('by_userId_date', ['userId', 'date'])
    .index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // TASKS — Standalone tasks (TickTick-style)
  // ─────────────────────────────────────────────────────────────────────────────
  tasks: defineTable({
    userId: v.id('users'),
    listId: v.optional(v.id('taskLists')),
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high'),
      v.literal('urgent')
    ),
    status: v.union(v.literal('todo'), v.literal('in_progress'), v.literal('done')),
    dueDate: v.optional(v.string()),
    dueTime: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    subtasks: v.optional(
      v.array(
        v.object({
          id: v.string(),
          title: v.string(),
          completed: v.boolean(),
        })
      )
    ),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_status', ['userId', 'status'])
    .index('by_listId', ['listId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // TASK LISTS — Group tasks (Personal, Work, etc.)
  // ─────────────────────────────────────────────────────────────────────────────
  taskLists: defineTable({
    userId: v.id('users'),
    name: v.string(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    order: v.optional(v.number()),
    createdAt: v.number(),
  }).index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // GAMIFICATION — XP, levels, achievements
  // ─────────────────────────────────────────────────────────────────────────────
  gamification: defineTable({
    userId: v.id('users'),
    totalXP: v.number(),
    level: v.number(),
    achievements: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        description: v.string(),
        icon: v.string(),
        unlockedAt: v.number(),
      })
    ),
    badges: v.optional(
      v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          icon: v.string(),
        })
      )
    ),
    updatedAt: v.number(),
  }).index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // MOOD / WELLNESS
  // ─────────────────────────────────────────────────────────────────────────────
  moodEntries: defineTable({
    userId: v.id('users'),
    date: v.string(),
    score: v.number(), // 1-5
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_date', ['userId', 'date']),

  // ─────────────────────────────────────────────────────────────────────────────
  // JOURNAL — Reflection entries
  // ─────────────────────────────────────────────────────────────────────────────
  journal: defineTable({
    userId: v.id('users'),
    habitLogId: v.optional(v.id('habitLogs')),
    date: v.string(),
    content: v.string(),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_date', ['userId', 'date']),

  // ─────────────────────────────────────────────────────────────────────────────
  // IDENTITIES — Atomic Habits identity tracking
  // ─────────────────────────────────────────────────────────────────────────────
  identities: defineTable({
    userId: v.id('users'),
    label: v.string(), // "Runner", "Writer", etc.
    description: v.optional(v.string()),
    evidence: v.array(
      v.object({
        id: v.string(),
        action: v.string(),
        date: v.string(),
        createdAt: v.number(),
      })
    ),
    habitIds: v.optional(v.array(v.id('habits'))),
    createdAt: v.number(),
  }).index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // AI INSIGHTS — Cached AI-generated analyses
  // ─────────────────────────────────────────────────────────────────────────────
  insights: defineTable({
    userId: v.id('users'),
    type: v.union(
      v.literal('coaching'),
      v.literal('pattern'),
      v.literal('suggestion'),
      v.literal('weekly_summary')
    ),
    content: v.string(),
    metadata: v.optional(v.any()),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_type', ['userId', 'type']),

  // ─────────────────────────────────────────────────────────────────────────────
  // POMODORO / FOCUS SESSIONS
  // ─────────────────────────────────────────────────────────────────────────────
  focusSessions: defineTable({
    userId: v.id('users'),
    taskId: v.optional(v.id('tasks')),
    habitId: v.optional(v.id('habits')),
    duration: v.number(), // minutes
    completedAt: v.number(),
    type: v.union(v.literal('pomodoro'), v.literal('deep_work'), v.literal('custom')),
  })
    .index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // HABIT STACKS — Chain habits together
  // ─────────────────────────────────────────────────────────────────────────────
  habitStacks: defineTable({
    userId: v.id('users'),
    name: v.string(),
    habitIds: v.array(v.id('habits')), // ordered
    createdAt: v.number(),
  }).index('by_userId', ['userId']),
});
