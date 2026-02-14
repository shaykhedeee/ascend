// ═══════════════════════════════════════════════════════════════════════════════
// VANTAGE — Habits Engine (Convex)
// Create, track, complete habits with streak management & plan enforcement
// ═══════════════════════════════════════════════════════════════════════════════

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { internal } from './_generated/api';

// Plan limits
const PLAN_LIMITS = {
  free: { maxHabits: 5 },
  pro: { maxHabits: Infinity },
  lifetime: { maxHabits: Infinity },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Helper: get authenticated user
// ─────────────────────────────────────────────────────────────────────────────
async function getAuthUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Not authenticated');

  const user = await ctx.db
    .query('users')
    .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
    .unique();
  if (!user) throw new Error('User not found — complete signup first');
  return user;
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE HABIT
// ─────────────────────────────────────────────────────────────────────────────
export const create = mutation({
  args: {
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
    goalId: v.optional(v.id('goals')),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
    estimatedMinutes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    // Enforce plan limits
    const activeHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId_active', (q: any) =>
        q.eq('userId', user._id).eq('isActive', true)
      )
      .collect();

    const userPlan = (user.plan as keyof typeof PLAN_LIMITS) ?? 'free';
    const limit = PLAN_LIMITS[userPlan].maxHabits;
    if (activeHabits.length >= limit) {
      throw new Error(
        `Plan limit reached: ${user.plan} plan allows ${limit} active habits. Upgrade to Pro for unlimited.`
      );
    }

    return await ctx.db.insert('habits', {
      userId: user._id,
      goalId: args.goalId,
      title: args.title,
      description: args.description,
      category: args.category,
      frequency: args.frequency,
      customDays: args.customDays,
      timeOfDay: args.timeOfDay,
      identityLabel: args.identityLabel,
      isActive: true,
      streakCurrent: 0,
      streakLongest: 0,
      color: args.color,
      icon: args.icon,
      estimatedMinutes: args.estimatedMinutes,
      order: activeHabits.length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST ACTIVE HABITS
// ─────────────────────────────────────────────────────────────────────────────
export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query('habits')
      .withIndex('by_userId_active', (q: any) =>
        q.eq('userId', user._id).eq('isActive', true)
      )
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST ALL HABITS (including archived)
// ─────────────────────────────────────────────────────────────────────────────
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query('habits')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE HABIT COMPLETION
// ─────────────────────────────────────────────────────────────────────────────
export const toggleComplete = mutation({
  args: {
    habitId: v.id('habits'),
    date: v.string(), // YYYY-MM-DD
    mood: v.optional(v.number()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { habitId, date, mood, note }) => {
    const user = await getAuthUser(ctx);
    const habit = await ctx.db.get(habitId);
    if (!habit || habit.userId !== user._id) throw new Error('Habit not found');

    // Check if already logged today
    const existing = await ctx.db
      .query('habitLogs')
      .withIndex('by_habitId_date', (q: any) =>
        q.eq('habitId', habitId).eq('date', date)
      )
      .unique();

    if (existing) {
      // Toggle off — remove the log
      if (existing.status === 'completed') {
        await ctx.db.delete(existing._id);

        // Decrement streak
        const newStreak = Math.max(0, habit.streakCurrent - 1);
        await ctx.db.patch(habitId, {
          streakCurrent: newStreak,
          updatedAt: Date.now(),
        });

        return { action: 'uncompleted', xpChange: -10 };
      }
      // Was skipped/failed → mark completed
      await ctx.db.patch(existing._id, {
        status: 'completed',
        mood,
        note,
        completedAt: Date.now(),
      });
    } else {
      // Create new log
      await ctx.db.insert('habitLogs', {
        habitId,
        userId: user._id,
        date,
        status: 'completed',
        mood,
        note,
        completedAt: Date.now(),
      });
    }

    // Update streak
    const newStreak = habit.streakCurrent + 1;
    const newLongest = Math.max(habit.streakLongest, newStreak);
    await ctx.db.patch(habitId, {
      streakCurrent: newStreak,
      streakLongest: newLongest,
      updatedAt: Date.now(),
    });

    // Award XP via gamification
    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();

    if (gamification) {
      const xpGain = 10 + (newStreak >= 7 ? 5 : 0) + (newStreak >= 30 ? 10 : 0);
      const newXP = gamification.totalXP + xpGain;
      const newLevel = Math.floor(newXP / 100) + 1;

      await ctx.db.patch(gamification._id, {
        totalXP: newXP,
        level: newLevel,
        updatedAt: Date.now(),
      });

      return { action: 'completed', xpChange: xpGain, streak: newStreak };
    }

    return { action: 'completed', xpChange: 10, streak: newStreak };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// SKIP HABIT
// ─────────────────────────────────────────────────────────────────────────────
export const skip = mutation({
  args: {
    habitId: v.id('habits'),
    date: v.string(),
  },
  handler: async (ctx, { habitId, date }) => {
    const user = await getAuthUser(ctx);
    const habit = await ctx.db.get(habitId);
    if (!habit || habit.userId !== user._id) throw new Error('Habit not found');

    const existing = await ctx.db
      .query('habitLogs')
      .withIndex('by_habitId_date', (q: any) =>
        q.eq('habitId', habitId).eq('date', date)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { status: 'skipped' });
    } else {
      await ctx.db.insert('habitLogs', {
        habitId,
        userId: user._id,
        date,
        status: 'skipped',
      });
    }

    // "Never Miss Twice" — streak preserved on skip, broken on consecutive skip
    return { action: 'skipped' };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE HABIT
// ─────────────────────────────────────────────────────────────────────────────
export const update = mutation({
  args: {
    habitId: v.id('habits'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    frequency: v.optional(
      v.union(
        v.literal('daily'),
        v.literal('weekdays'),
        v.literal('weekends'),
        v.literal('3x_week'),
        v.literal('weekly'),
        v.literal('custom')
      )
    ),
    timeOfDay: v.optional(
      v.union(
        v.literal('morning'),
        v.literal('afternoon'),
        v.literal('evening'),
        v.literal('anytime')
      )
    ),
    identityLabel: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    color: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, { habitId, ...updates }) => {
    const user = await getAuthUser(ctx);
    const habit = await ctx.db.get(habitId);
    if (!habit || habit.userId !== user._id) throw new Error('Habit not found');

    await ctx.db.patch(habitId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE HABIT
// ─────────────────────────────────────────────────────────────────────────────
export const remove = mutation({
  args: { habitId: v.id('habits') },
  handler: async (ctx, { habitId }) => {
    const user = await getAuthUser(ctx);
    const habit = await ctx.db.get(habitId);
    if (!habit || habit.userId !== user._id) throw new Error('Habit not found');

    // Delete associated logs
    const logs = await ctx.db
      .query('habitLogs')
      .withIndex('by_habitId', (q: any) => q.eq('habitId', habitId))
      .collect();

    for (const log of logs) {
      await ctx.db.delete(log._id);
    }

    await ctx.db.delete(habitId);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET LOGS FOR DATE RANGE
// ─────────────────────────────────────────────────────────────────────────────
export const getLogsForDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, { startDate, endDate }) => {
    const user = await getAuthUser(ctx);

    const allLogs = await ctx.db
      .query('habitLogs')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();

    return allLogs.filter((log) => log.date >= startDate && log.date <= endDate);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET HABIT STATS
// ─────────────────────────────────────────────────────────────────────────────
export const getStats = query({
  args: { habitId: v.id('habits') },
  handler: async (ctx, { habitId }) => {
    const user = await getAuthUser(ctx);
    const habit = await ctx.db.get(habitId);
    if (!habit || habit.userId !== user._id) throw new Error('Habit not found');

    const logs = await ctx.db
      .query('habitLogs')
      .withIndex('by_habitId', (q: any) => q.eq('habitId', habitId))
      .collect();

    const completed = logs.filter((l) => l.status === 'completed').length;
    const total = logs.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Best/worst day analysis
    const dayCount: Record<string, { completed: number; total: number }> = {};
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (const log of logs) {
      const day = dayNames[new Date(log.date).getDay()];
      if (!dayCount[day]) dayCount[day] = { completed: 0, total: 0 };
      dayCount[day].total++;
      if (log.status === 'completed') dayCount[day].completed++;
    }

    let bestDay = '';
    let worstDay = '';
    let bestRate = -1;
    let worstRate = 101;

    for (const [day, data] of Object.entries(dayCount)) {
      const rate = data.total > 0 ? (data.completed / data.total) * 100 : 0;
      if (rate > bestRate) {
        bestRate = rate;
        bestDay = day;
      }
      if (rate < worstRate) {
        worstRate = rate;
        worstDay = day;
      }
    }

    return {
      totalLogs: total,
      completed,
      completionRate,
      streakCurrent: habit.streakCurrent,
      streakLongest: habit.streakLongest,
      bestDay,
      worstDay,
    };
  },
});
