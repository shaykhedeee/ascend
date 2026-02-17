// ═══════════════════════════════════════════════════════════════════════════════
// ASCENDIFY — Convex Database Schema
// AI-Powered Life Transformation System — Real-time, Type-safe, Serverless
// Complete schema per DETAILEDPLANASCEND.md Parts 3-9
// ═══════════════════════════════════════════════════════════════════════════════

import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// ─── Shared validators ──────────────────────────────────────────────────────
const lifeDomainValidator = v.union(
  v.literal('health'),
  v.literal('career'),
  v.literal('finance'),
  v.literal('learning'),
  v.literal('relationships'),
  v.literal('creativity'),
  v.literal('mindfulness'),
  v.literal('personal_growth')
);

const goalTypeValidator = v.union(
  v.literal('achievement'),
  v.literal('transformation'),
  v.literal('skill'),
  v.literal('project'),
  v.literal('quantitative'),
  v.literal('maintenance'),
  v.literal('elimination'),
  v.literal('relationship')
);

export default defineSchema({
  // ─────────────────────────────────────────────────────────────────────────────
  // USERS — Synced with Clerk (enhanced with vision & life design)
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
    // ── Vision & Life Design (Module 1) ──
    lifeWheelScores: v.optional(v.object({
      health: v.number(),
      career: v.number(),
      finance: v.number(),
      learning: v.number(),
      relationships: v.number(),
      creativity: v.number(),
      mindfulness: v.number(),
      personal_growth: v.number(),
    })),
    coreValues: v.optional(v.array(v.string())),
    lifeVision: v.optional(v.string()),
    visionBoard: v.optional(v.array(v.object({
      id: v.string(),
      imageUrl: v.string(),
      caption: v.optional(v.string()),
      domain: v.optional(v.string()),
    }))),
    // ── Schedule preferences (Onboarding) ──
    wakeTime: v.optional(v.string()),
    sleepTime: v.optional(v.string()),
    peakProductivityTime: v.optional(v.string()),
    workSchedule: v.optional(v.object({
      startTime: v.string(),
      endTime: v.string(),
      lunchStart: v.optional(v.string()),
      lunchEnd: v.optional(v.string()),
      workDays: v.array(v.number()),
    })),
    // ── Notification preferences ──
    notificationPrefs: v.optional(v.object({
      morningMotivation: v.boolean(),
      middayCheckin: v.boolean(),
      eveningWinddown: v.boolean(),
      reminderStyle: v.union(
        v.literal('gentle'),
        v.literal('supportive'),
        v.literal('persistent'),
        v.literal('minimal')
      ),
      coachingFrequency: v.union(
        v.literal('daily'),
        v.literal('weekly'),
        v.literal('struggling_only'),
        v.literal('manual')
      ),
    })),
    // ── Coach personality ──
    coachPersonality: v.optional(v.union(
      v.literal('supportive'),
      v.literal('challenging'),
      v.literal('analytical'),
      v.literal('humorous')
    )),
    // ── Recovery state ──
    lastActiveAt: v.optional(v.number()),
    recoveryStatus: v.optional(v.union(
      v.literal('active'),
      v.literal('at_risk'),
      v.literal('inactive'),
      v.literal('recovering')
    )),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_clerkId', ['clerkId'])
    .index('by_email', ['email']),

  // ─────────────────────────────────────────────────────────────────────────────
  // GOALS — Enhanced with decomposition engine (Module 2)
  // ─────────────────────────────────────────────────────────────────────────────
  goals: defineTable({
    userId: v.id('users'),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    status: v.union(
      v.literal('draft'),
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('paused'),
      v.literal('abandoned')
    ),
    progress: v.number(), // 0-100
    targetDate: v.optional(v.string()), // ISO date
    startDate: v.optional(v.string()),
    identityLabel: v.optional(v.string()),
    aiPlan: v.optional(v.any()),
    // ── Goal decomposition fields ──
    goalType: v.optional(goalTypeValidator),
    lifeDomain: v.optional(lifeDomainValidator),
    deadlineType: v.optional(v.union(
      v.literal('fixed'),
      v.literal('flexible'),
      v.literal('ongoing')
    )),
    progressType: v.optional(v.union(
      v.literal('percentage'),
      v.literal('milestones'),
      v.literal('numeric_target')
    )),
    targetValue: v.optional(v.number()),
    currentValue: v.optional(v.number()),
    unit: v.optional(v.string()),
    decompositionStatus: v.optional(v.union(
      v.literal('pending'),
      v.literal('completed')
    )),
    aiConfidenceScore: v.optional(v.number()),
    whyImportant: v.optional(v.string()),
    successCriteria: v.optional(v.array(v.string())),
    rewards: v.optional(v.array(v.string())),
    difficultyLevel: v.optional(v.number()), // 1-10
    estimatedHours: v.optional(v.number()),
    parentGoalId: v.optional(v.id('goals')),
    tags: v.optional(v.array(v.string())),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    visionConnection: v.optional(v.string()),
    completionDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_status', ['userId', 'status'])
    .index('by_parentGoalId', ['parentGoalId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // MILESTONES — Goal decomposition intermediate steps
  // ─────────────────────────────────────────────────────────────────────────────
  milestones: defineTable({
    userId: v.id('users'),
    goalId: v.id('goals'),
    title: v.string(),
    description: v.optional(v.string()),
    sequenceOrder: v.number(),
    targetDate: v.optional(v.string()),
    completedDate: v.optional(v.number()),
    status: v.union(
      v.literal('not_started'),
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('skipped')
    ),
    progressPercentage: v.number(), // 0-100
    completionCriteria: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_goalId', ['goalId'])
    .index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // HABITS — Enhanced with types, progression, and stacking (Module 4)
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
    customDays: v.optional(v.array(v.number())),
    timeOfDay: v.union(
      v.literal('morning'),
      v.literal('afternoon'),
      v.literal('evening'),
      v.literal('anytime')
    ),
    identityLabel: v.optional(v.string()),
    isActive: v.boolean(),
    streakCurrent: v.number(),
    streakLongest: v.number(),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    order: v.optional(v.number()),
    // ── Enhanced habit type system ──
    habitType: v.optional(v.union(
      v.literal('yes_no'),
      v.literal('quantity'),
      v.literal('duration'),
      v.literal('negative'),
      v.literal('range'),
      v.literal('checklist')
    )),
    targetValue: v.optional(v.number()),
    targetUnit: v.optional(v.string()),
    checklistItems: v.optional(v.array(v.string())),
    // ── Habit Stacking cue ──
    cueType: v.optional(v.union(
      v.literal('time'),
      v.literal('location'),
      v.literal('action'),
      v.literal('emotion'),
      v.literal('none')
    )),
    cueDescription: v.optional(v.string()),
    afterHabitId: v.optional(v.id('habits')),
    // ── Progression system ──
    difficultyLevel: v.optional(v.number()),
    autoProgressionEnabled: v.optional(v.boolean()),
    progressionIntervalDays: v.optional(v.number()),
    progressionIncreaseAmount: v.optional(v.number()),
    // ── Stats ──
    totalCompletions: v.optional(v.number()),
    completionRate7Day: v.optional(v.number()),
    completionRate30Day: v.optional(v.number()),
    lastCompletedAt: v.optional(v.number()),
    // ── Motivation ──
    whyImportant: v.optional(v.string()),
    immediateReward: v.optional(v.string()),
    // ── Specific time ──
    specificTime: v.optional(v.string()),
    reminderEnabled: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_active', ['userId', 'isActive'])
    .index('by_goalId', ['goalId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // HABIT LOGS — Enhanced with energy/difficulty tracking
  // ─────────────────────────────────────────────────────────────────────────────
  habitLogs: defineTable({
    habitId: v.id('habits'),
    userId: v.id('users'),
    date: v.string(),
    status: v.union(
      v.literal('completed'),
      v.literal('skipped'),
      v.literal('failed')
    ),
    mood: v.optional(v.number()),
    note: v.optional(v.string()),
    completedAt: v.optional(v.number()),
    // ── Enhanced tracking ──
    value: v.optional(v.number()),
    energyLevel: v.optional(v.union(
      v.literal('high'),
      v.literal('medium'),
      v.literal('low')
    )),
    difficulty: v.optional(v.union(
      v.literal('easy'),
      v.literal('medium'),
      v.literal('hard')
    )),
    loggedVia: v.optional(v.union(
      v.literal('manual'),
      v.literal('auto'),
      v.literal('reminder')
    )),
  })
    .index('by_habitId', ['habitId'])
    .index('by_habitId_date', ['habitId', 'date'])
    .index('by_userId_date', ['userId', 'date'])
    .index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // TASKS — Enhanced with goal/milestone linking, energy, Eisenhower (Module 3)
  // ─────────────────────────────────────────────────────────────────────────────
  tasks: defineTable({
    userId: v.id('users'),
    listId: v.optional(v.id('taskLists')),
    goalId: v.optional(v.id('goals')),
    milestoneId: v.optional(v.id('milestones')),
    parentTaskId: v.optional(v.id('tasks')),
    title: v.string(),
    description: v.optional(v.string()),
    notes: v.optional(v.string()),
    priority: v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high'),
      v.literal('urgent')
    ),
    status: v.union(v.literal('todo'), v.literal('in_progress'), v.literal('done')),
    dueDate: v.optional(v.string()),
    dueTime: v.optional(v.string()),
    scheduledDate: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
    actualMinutes: v.optional(v.number()),
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
    // ── Enhanced task fields ──
    eisenhowerQuadrant: v.optional(v.union(
      v.literal('urgent_important'),
      v.literal('important'),
      v.literal('urgent'),
      v.literal('neither')
    )),
    energyRequired: v.optional(v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high')
    )),
    isRecurring: v.optional(v.boolean()),
    recurrenceRule: v.optional(v.object({
      frequency: v.union(
        v.literal('daily'),
        v.literal('weekly'),
        v.literal('monthly')
      ),
      interval: v.number(),
      daysOfWeek: v.optional(v.array(v.number())),
    })),
    source: v.optional(v.union(
      v.literal('manual'),
      v.literal('ai_generated'),
      v.literal('recurring'),
      v.literal('decomposition'),
      v.literal('imported')
    )),
    xpValue: v.optional(v.number()),
    context: v.optional(v.array(v.string())),
    isPinned: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_status', ['userId', 'status'])
    .index('by_listId', ['listId'])
    .index('by_goalId', ['goalId'])
    .index('by_milestoneId', ['milestoneId']),

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
  // GAMIFICATION — Enhanced with coins, power-ups, XP history (Part 4)
  // ─────────────────────────────────────────────────────────────────────────────
  gamification: defineTable({
    userId: v.id('users'),
    totalXP: v.number(),
    level: v.number(),
    coins: v.optional(v.number()),
    currentLevelXP: v.optional(v.number()),
    xpToNextLevel: v.optional(v.number()),
    // ── Level tier system ──
    tier: v.optional(v.union(
      v.literal('beginner'),
      v.literal('explorer'),
      v.literal('achiever'),
      v.literal('master'),
      v.literal('legend')
    )),
    achievements: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        description: v.string(),
        icon: v.string(),
        unlockedAt: v.number(),
        category: v.optional(v.string()),
        rarity: v.optional(v.union(
          v.literal('common'),
          v.literal('rare'),
          v.literal('epic'),
          v.literal('legendary')
        )),
        xpReward: v.optional(v.number()),
        coinReward: v.optional(v.number()),
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
    // ── Power-ups owned ──
    powerUps: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      type: v.string(),
      quantity: v.number(),
    }))),
    // ── Streaks ──
    currentStreak: v.optional(v.number()),
    longestStreak: v.optional(v.number()),
    streakShieldsUsed: v.optional(v.number()),
    lastStreakDate: v.optional(v.string()),
    // ── Stats ──
    totalTasksCompleted: v.optional(v.number()),
    totalHabitsCompleted: v.optional(v.number()),
    totalGoalsCompleted: v.optional(v.number()),
    totalFocusMinutes: v.optional(v.number()),
    updatedAt: v.number(),
  }).index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // XP HISTORY — Track XP earning events
  // ─────────────────────────────────────────────────────────────────────────────
  xpHistory: defineTable({
    userId: v.id('users'),
    amount: v.number(),
    source: v.union(
      v.literal('task_complete'),
      v.literal('habit_complete'),
      v.literal('goal_complete'),
      v.literal('milestone_complete'),
      v.literal('focus_session'),
      v.literal('streak_bonus'),
      v.literal('achievement'),
      v.literal('daily_login'),
      v.literal('weekly_review'),
      v.literal('perfect_day'),
      v.literal('comeback'),
      v.literal('other')
    ),
    description: v.string(),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // MOOD / WELLNESS
  // ─────────────────────────────────────────────────────────────────────────────
  moodEntries: defineTable({
    userId: v.id('users'),
    date: v.string(),
    score: v.number(),
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
    type: v.optional(v.union(
      v.literal('reflection'),
      v.literal('gratitude'),
      v.literal('goal_note'),
      v.literal('freeform')
    )),
    goalId: v.optional(v.id('goals')),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_date', ['userId', 'date'])
    .index('by_goalId', ['goalId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // IDENTITIES — Atomic Habits identity tracking
  // ─────────────────────────────────────────────────────────────────────────────
  identities: defineTable({
    userId: v.id('users'),
    label: v.string(),
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
  // AI INSIGHTS — Enhanced with more types (Module 7)
  // ─────────────────────────────────────────────────────────────────────────────
  insights: defineTable({
    userId: v.id('users'),
    type: v.union(
      v.literal('coaching'),
      v.literal('pattern'),
      v.literal('suggestion'),
      v.literal('weekly_summary'),
      v.literal('correlation'),
      v.literal('prediction'),
      v.literal('celebration'),
      v.literal('prescription')
    ),
    content: v.string(),
    title: v.optional(v.string()),
    confidenceScore: v.optional(v.number()),
    metadata: v.optional(v.any()),
    viewed: v.optional(v.boolean()),
    viewedAt: v.optional(v.number()),
    dismissed: v.optional(v.boolean()),
    actionTaken: v.optional(v.boolean()),
    feedback: v.optional(v.number()),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_type', ['userId', 'type']),

  // ─────────────────────────────────────────────────────────────────────────────
  // FOCUS SESSIONS — Enhanced with methods & distraction tracking (Module 6)
  // ─────────────────────────────────────────────────────────────────────────────
  focusSessions: defineTable({
    userId: v.id('users'),
    taskId: v.optional(v.id('tasks')),
    habitId: v.optional(v.id('habits')),
    duration: v.number(), // minutes planned
    actualDuration: v.optional(v.number()), // minutes actual
    completedAt: v.number(),
    type: v.union(
      v.literal('pomodoro'),
      v.literal('deep_work'),
      v.literal('flowtime'),
      v.literal('time_box'),
      v.literal('custom')
    ),
    // ── Enhanced focus tracking ──
    focusScore: v.optional(v.number()), // 0-100
    productivityRating: v.optional(v.number()), // 1-5
    completionStatus: v.optional(v.union(
      v.literal('completed'),
      v.literal('abandoned'),
      v.literal('interrupted')
    )),
    distractionCount: v.optional(v.number()),
    distractions: v.optional(v.array(v.object({
      timestamp: v.number(),
      description: v.optional(v.string()),
      duration: v.optional(v.number()),
    }))),
    breaksTaken: v.optional(v.number()),
    notes: v.optional(v.string()),
    // ── Ambient/environment ──
    ambientSound: v.optional(v.string()),
  })
    .index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // HABIT STACKS — Chain habits together
  // ─────────────────────────────────────────────────────────────────────────────
  habitStacks: defineTable({
    userId: v.id('users'),
    name: v.string(),
    habitIds: v.array(v.id('habits')),
    createdAt: v.number(),
  }).index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // DAILY PLANS — Morning intentions & evening reflections (Module 5)
  // ─────────────────────────────────────────────────────────────────────────────
  dailyPlans: defineTable({
    userId: v.id('users'),
    date: v.string(), // YYYY-MM-DD
    // ── Morning intention ──
    intention: v.optional(v.string()),
    topPriorities: v.optional(v.array(v.string())),
    // ── Time blocks ──
    timeBlocks: v.optional(v.array(v.object({
      id: v.string(),
      startTime: v.string(),
      endTime: v.string(),
      title: v.string(),
      type: v.union(
        v.literal('deep_work'),
        v.literal('shallow_work'),
        v.literal('meeting'),
        v.literal('break'),
        v.literal('personal'),
        v.literal('exercise'),
        v.literal('routine')
      ),
      taskId: v.optional(v.id('tasks')),
      completed: v.optional(v.boolean()),
    }))),
    // ── Daily score ──
    dailyScore: v.optional(v.number()), // 0-100
    tasksCompletedCount: v.optional(v.number()),
    tasksTotalCount: v.optional(v.number()),
    habitsCompletedCount: v.optional(v.number()),
    habitsTotalCount: v.optional(v.number()),
    focusMinutes: v.optional(v.number()),
    // ── Evening reflection ──
    reflection: v.optional(v.string()),
    gratitude: v.optional(v.array(v.string())),
    tomorrowPlan: v.optional(v.string()),
    dayRating: v.optional(v.number()), // 1-5
    // ── Meta ──
    morningCompletedAt: v.optional(v.number()),
    eveningCompletedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_date', ['userId', 'date']),

  // ─────────────────────────────────────────────────────────────────────────────
  // WEEKLY REVIEWS — Auto-generated summaries (Module 7)
  // ─────────────────────────────────────────────────────────────────────────────
  weeklyReviews: defineTable({
    userId: v.id('users'),
    weekStartDate: v.string(), // ISO Monday date
    weekEndDate: v.string(),
    // ── Stats ──
    tasksCompleted: v.number(),
    tasksTotal: v.number(),
    habitsCompletionRate: v.number(), // 0-100
    focusTotalMinutes: v.number(),
    streakDays: v.number(),
    xpEarned: v.number(),
    goalsProgressed: v.optional(v.array(v.object({
      goalId: v.id('goals'),
      title: v.string(),
      progressChange: v.number(),
    }))),
    // ── Insights ──
    highlights: v.optional(v.array(v.string())),
    areasToImprove: v.optional(v.array(v.string())),
    aiSummary: v.optional(v.string()),
    // ── User input ──
    userReflection: v.optional(v.string()),
    nextWeekGoals: v.optional(v.array(v.string())),
    overallRating: v.optional(v.number()), // 1-5
    reviewed: v.boolean(),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_week', ['userId', 'weekStartDate']),

  // ─────────────────────────────────────────────────────────────────────────────
  // RECOVERY LOGS — Comeback/recovery tracking (Module 8)
  // ─────────────────────────────────────────────────────────────────────────────
  recoveryLogs: defineTable({
    userId: v.id('users'),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    status: v.union(
      v.literal('in_progress'),
      v.literal('completed'),
      v.literal('abandoned')
    ),
    // ── Detection ──
    triggerReason: v.union(
      v.literal('streak_break'),
      v.literal('long_absence'),
      v.literal('engagement_drop'),
      v.literal('user_initiated')
    ),
    daysInactive: v.number(),
    // ── Comeback protocol phase ──
    phase: v.union(
      v.literal('acknowledgement'),
      v.literal('assessment'),
      v.literal('minimal_restart'),
      v.literal('gradual_rebuild'),
      v.literal('full_momentum')
    ),
    // ── Recovery plan ──
    minimalRoutine: v.optional(v.array(v.string())),
    adjustedGoals: v.optional(v.array(v.string())),
    // ── Progress ──
    recoveryStreak: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId'])
    .index('by_userId_status', ['userId', 'status']),

  // ─────────────────────────────────────────────────────────────────────────────
  // COACHING MESSAGES — AI coach interactions (Module 9)
  // ─────────────────────────────────────────────────────────────────────────────
  coachMessages: defineTable({
    userId: v.id('users'),
    role: v.union(v.literal('coach'), v.literal('user')),
    content: v.string(),
    touchpoint: v.optional(v.union(
      v.literal('morning'),
      v.literal('midday'),
      v.literal('evening'),
      v.literal('on_demand'),
      v.literal('intervention'),
      v.literal('celebration')
    )),
    context: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_userId', ['userId']),

  // ─────────────────────────────────────────────────────────────────────────────
  // GOAL TEMPLATES — Reusable templates library
  // ─────────────────────────────────────────────────────────────────────────────
  goalTemplates: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    lifeDomain: lifeDomainValidator,
    goalType: goalTypeValidator,
    estimatedWeeks: v.number(),
    difficultyLevel: v.number(),
    milestones: v.array(v.object({
      title: v.string(),
      description: v.optional(v.string()),
      weekNumber: v.number(),
    })),
    suggestedHabits: v.optional(v.array(v.object({
      title: v.string(),
      frequency: v.string(),
      estimatedMinutes: v.number(),
    }))),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    isPublic: v.boolean(),
    createdBy: v.optional(v.id('users')),
    usageCount: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('by_category', ['category'])
    .index('by_lifeDomain', ['lifeDomain']),
});
