// ─────────────────────────────────────────────────────────────────────────────
// RESURGO — Fitness Workout Logs
// ─────────────────────────────────────────────────────────────────────────────

import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

async function getUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return ctx.db
    .query('users')
    .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
    .first();
}

const workoutTypeValidator = v.union(
  v.literal('cardio'),
  v.literal('strength'),
  v.literal('flexibility'),
  v.literal('sport'),
  v.literal('other'),
);

export const logWorkout = mutation({
  args: {
    date: v.string(),
    type: workoutTypeValidator,
    durationMinutes: v.number(),
    notes: v.optional(v.string()),
    caloriesBurned: v.optional(v.number()),
  },
  returns: v.id('workoutLogs'),
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) throw new Error('Not authenticated');
    return await ctx.db.insert('workoutLogs', {
      userId: user._id,
      date: args.date,
      type: args.type,
      durationMinutes: args.durationMinutes,
      notes: args.notes,
      caloriesBurned: args.caloriesBurned,
      createdAt: Date.now(),
    });
  },
});

export const listWorkouts = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) return [];
    const logs = await ctx.db
      .query('workoutLogs')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();
    return logs
      .filter((l) => {
        if (args.startDate && l.date < args.startDate) return false;
        if (args.endDate && l.date > args.endDate) return false;
        return true;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getWeekStats = query({
  args: {},
  returns: v.object({
    totalWorkouts: v.number(),
    totalMinutes: v.number(),
    totalCalories: v.number(),
  }),
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return { totalWorkouts: 0, totalMinutes: 0, totalCalories: 0 };

    // Get workouts from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const startDate = sevenDaysAgo.toISOString().split('T')[0];

    const logs = await ctx.db
      .query('workoutLogs')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();

    const recent = logs.filter((l) => l.date >= startDate);
    return {
      totalWorkouts: recent.length,
      totalMinutes: recent.reduce((sum, l) => sum + l.durationMinutes, 0),
      totalCalories: recent.reduce((sum, l) => sum + (l.caloriesBurned ?? 0), 0),
    };
  },
});
