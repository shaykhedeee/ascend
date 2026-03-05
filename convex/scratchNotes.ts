// ─────────────────────────────────────────────────────────────────────────────
// RESURGO — Scratch Notes (Quick Note widget backend)
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

export const save = mutation({
  args: {
    text: v.string(),
    source: v.optional(v.string()),
  },
  returns: v.id('scratchNotes'),
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) throw new Error('Not authenticated');
    return await ctx.db.insert('scratchNotes', {
      userId: user._id,
      text: args.text,
      source: args.source ?? 'dashboard_quick',
      createdAt: Date.now(),
    });
  },
});

export const getLatest = query({
  args: {},
  returns: v.union(v.any(), v.null()),
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return null;
    return ctx.db
      .query('scratchNotes')
      .withIndex('by_userId_createdAt', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .first();
  },
});

export const list = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) return [];
    const notes = await ctx.db
      .query('scratchNotes')
      .withIndex('by_userId_createdAt', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();
    return notes.slice(0, args.limit ?? 20);
  },
});

export const remove = mutation({
  args: { id: v.id('scratchNotes') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');
    await ctx.db.delete(args.id);
    return null;
  },
});
