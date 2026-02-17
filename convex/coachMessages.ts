// ═══════════════════════════════════════════════════════════════════════════════
// ASCENDIFY — Coach Messages Engine (Convex)
// AI Coach interaction history — Module 9
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

const coachMessageDoc = v.object({
  _id: v.id('coachMessages'),
  _creationTime: v.number(),
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
});

// ─────────────────────────────────────────────────────────────────────────────
// SEND MESSAGE (user or coach)
// ─────────────────────────────────────────────────────────────────────────────
export const send = mutation({
  args: {
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
  },
  returns: v.id('coachMessages'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    return await ctx.db.insert('coachMessages', {
      userId: user._id,
      role: args.role,
      content: args.content,
      touchpoint: args.touchpoint,
      context: args.context,
      createdAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET CONVERSATION HISTORY
// ─────────────────────────────────────────────────────────────────────────────
export const getHistory = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(coachMessageDoc),
  handler: async (ctx, { limit }) => {
    const user = await getAuthUser(ctx);

    const messages = await ctx.db
      .query('coachMessages')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();

    const result = limit ? messages.slice(0, limit) : messages;
    return result.reverse(); // Return in chronological order
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET LATEST BY TOUCHPOINT
// ─────────────────────────────────────────────────────────────────────────────
export const getLatestByTouchpoint = query({
  args: {
    touchpoint: v.union(
      v.literal('morning'),
      v.literal('midday'),
      v.literal('evening'),
      v.literal('on_demand'),
      v.literal('intervention'),
      v.literal('celebration')
    ),
  },
  returns: v.union(coachMessageDoc, v.null()),
  handler: async (ctx, { touchpoint }) => {
    const user = await getAuthUser(ctx);

    const messages = await ctx.db
      .query('coachMessages')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();

    return messages.find((m) => m.touchpoint === touchpoint) ?? null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// CLEAR CONVERSATION
// ─────────────────────────────────────────────────────────────────────────────
export const clearHistory = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    const messages = await ctx.db
      .query('coachMessages')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();

    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }

    return null;
  },
});
