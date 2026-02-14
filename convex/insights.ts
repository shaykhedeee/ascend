// ═══════════════════════════════════════════════════════════════════════════════
// VANTAGE — AI Insights Cache (Convex)
// Cache AI-generated insights server-side
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
// STORE INSIGHT
// ─────────────────────────────────────────────────────────────────────────────
export const store = mutation({
  args: {
    type: v.union(
      v.literal('coaching'),
      v.literal('pattern'),
      v.literal('suggestion'),
      v.literal('weekly_summary')
    ),
    content: v.string(),
    metadata: v.optional(v.any()),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    return await ctx.db.insert('insights', {
      userId: user._id,
      type: args.type,
      content: args.content,
      metadata: args.metadata,
      expiresAt: args.expiresAt ?? Date.now() + 7 * 24 * 60 * 60 * 1000,
      createdAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET LATEST INSIGHT BY TYPE
// ─────────────────────────────────────────────────────────────────────────────
export const getLatest = query({
  args: {
    type: v.union(
      v.literal('coaching'),
      v.literal('pattern'),
      v.literal('suggestion'),
      v.literal('weekly_summary')
    ),
  },
  handler: async (ctx, { type }) => {
    const user = await getAuthUser(ctx);

    const insights = await ctx.db
      .query('insights')
      .withIndex('by_userId_type', (q: any) =>
        q.eq('userId', user._id).eq('type', type)
      )
      .order('desc')
      .take(1);

    const insight = insights[0];
    if (!insight) return null;

    // Check expiry
    if (insight.expiresAt && insight.expiresAt < Date.now()) return null;

    return insight;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET ALL INSIGHTS
// ─────────────────────────────────────────────────────────────────────────────
export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const user = await getAuthUser(ctx);

    const insights = await ctx.db
      .query('insights')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();

    const valid = insights.filter(
      (i) => !i.expiresAt || i.expiresAt >= Date.now()
    );

    return limit ? valid.slice(0, limit) : valid;
  },
});
