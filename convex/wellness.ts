// ═══════════════════════════════════════════════════════════════════════════════
// VANTAGE — Wellness (Convex)
// Mood tracking, journal entries
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
// LOG MOOD
// ─────────────────────────────────────────────────────────────────────────────
export const logMood = mutation({
  args: {
    date: v.string(),
    score: v.number(),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    // Check for existing entry on same date
    const existing = await ctx.db
      .query('moodEntries')
      .withIndex('by_userId_date', (q: any) =>
        q.eq('userId', user._id).eq('date', args.date)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        score: args.score,
        notes: args.notes,
        tags: args.tags,
      });
      return existing._id;
    }

    return await ctx.db.insert('moodEntries', {
      userId: user._id,
      date: args.date,
      score: args.score,
      notes: args.notes,
      tags: args.tags,
      createdAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET MOOD HISTORY
// ─────────────────────────────────────────────────────────────────────────────
export const getMoodHistory = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, { days }) => {
    const user = await getAuthUser(ctx);

    const entries = await ctx.db
      .query('moodEntries')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();

    if (days) {
      return entries.slice(0, days);
    }
    return entries;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// CREATE JOURNAL ENTRY
// ─────────────────────────────────────────────────────────────────────────────
export const createJournalEntry = mutation({
  args: {
    date: v.string(),
    content: v.string(),
    habitLogId: v.optional(v.id('habitLogs')),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    return await ctx.db.insert('journal', {
      userId: user._id,
      date: args.date,
      content: args.content,
      habitLogId: args.habitLogId,
      createdAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET JOURNAL ENTRIES
// ─────────────────────────────────────────────────────────────────────────────
export const getJournalEntries = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const user = await getAuthUser(ctx);

    const entries = await ctx.db
      .query('journal')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();

    return limit ? entries.slice(0, limit) : entries;
  },
});
