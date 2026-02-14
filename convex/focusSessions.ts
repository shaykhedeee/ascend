// ═══════════════════════════════════════════════════════════════════════════════
// VANTAGE — Focus Sessions (Convex)
// Pomodoro/Deep-focus timer tracking
// ═══════════════════════════════════════════════════════════════════════════════

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

async function getAuthUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Not authenticated');

  const user = await ctx.db
    .query('users')
    .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
    .unique();
  if (!user) throw new Error('User not found');
  return user;
}

// ─────────────────────────────────────────────────────────────────────────────
// START SESSION
// ─────────────────────────────────────────────────────────────────────────────
export const start = mutation({
  args: {
    type: v.union(v.literal('pomodoro'), v.literal('deep_work'), v.literal('custom')),
    durationMinutes: v.number(),
    habitId: v.optional(v.id('habits')),
    taskId: v.optional(v.id('tasks')),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    return await ctx.db.insert('focusSessions', {
      userId: user._id,
      type: args.type,
      duration: args.durationMinutes,
      habitId: args.habitId,
      taskId: args.taskId,
      completedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETE SESSION
// ─────────────────────────────────────────────────────────────────────────────
export const complete = mutation({
  args: {
    sessionId: v.id('focusSessions'),
    actualMinutes: v.optional(v.number()),
  },
  handler: async (ctx, { sessionId, actualMinutes }) => {
    const user = await getAuthUser(ctx);
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== user._id) throw new Error('Session not found');

    await ctx.db.patch(sessionId, {
      duration: actualMinutes ?? session.duration,
      completedAt: Date.now(),
    });

    // Award XP for focus sessions
    const minutes = actualMinutes ?? session.duration;
    const xpGain = Math.round(minutes * 0.5) + 5; // 0.5 XP per minute + 5 bonus

    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();

    if (gamification) {
      const newXP = gamification.totalXP + xpGain;
      await ctx.db.patch(gamification._id, {
        totalXP: newXP,
        level: Math.floor(newXP / 100) + 1,
        updatedAt: Date.now(),
      });
    }

    return { xpGain };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// CANCEL SESSION
// ─────────────────────────────────────────────────────────────────────────────
export const cancel = mutation({
  args: {
    sessionId: v.id('focusSessions'),
    actualMinutes: v.optional(v.number()),
  },
  handler: async (ctx, { sessionId, actualMinutes }) => {
    const user = await getAuthUser(ctx);
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== user._id) throw new Error('Session not found');

    await ctx.db.patch(sessionId, {
      duration: actualMinutes ?? session.duration,
      completedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET TODAY'S SESSIONS
// ─────────────────────────────────────────────────────────────────────────────
export const today = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const sessions = await ctx.db
      .query('focusSessions')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();

    return sessions.filter((s) => s.completedAt >= startOfDay.getTime());
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET FOCUS STATS
// ─────────────────────────────────────────────────────────────────────────────
export const getStats = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, { days }) => {
    const user = await getAuthUser(ctx);

    const sessions = await ctx.db
      .query('focusSessions')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();

    const cutoff = days ? Date.now() - days * 24 * 60 * 60 * 1000 : 0;
    const filtered = sessions.filter((s) => s.completedAt >= cutoff);

    const totalMinutes = filtered.reduce((sum, s) => sum + s.duration, 0);
    const totalSessions = filtered.length;
    const avgMinutes = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

    return {
      totalMinutes,
      totalSessions,
      avgMinutes,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
    };
  },
});
