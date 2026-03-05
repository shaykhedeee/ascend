// ─────────────────────────────────────────────────────────────────────────────
// RESURGO — Coach Notifications (proactive AI coach nudges)
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

const actionValidator = v.object({ label: v.string(), action: v.string() });

export const create = mutation({
  args: {
    userId: v.id('users'),
    coachId: v.string(),
    type: v.string(),
    message: v.string(),
    actions: v.array(actionValidator),
    expiresInHours: v.optional(v.number()),
  },
  returns: v.id('coachNotifications'),
  handler: async (ctx, args) => {
    const expiresAt = Date.now() + (args.expiresInHours ?? 24) * 60 * 60 * 1000;
    return await ctx.db.insert('coachNotifications', {
      userId: args.userId,
      coachId: args.coachId,
      type: args.type,
      message: args.message,
      actions: args.actions,
      read: false,
      createdAt: Date.now(),
      expiresAt,
    });
  },
});

export const getUnread = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return [];
    const now = Date.now();
    const notifications = await ctx.db
      .query('coachNotifications')
      .withIndex('by_userId_read', (q: any) => q.eq('userId', user._id).eq('read', false))
      .collect();
    // Filter out expired notifications
    return notifications.filter((n) => n.expiresAt > now);
  },
});

export const markRead = mutation({
  args: { id: v.id('coachNotifications') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');
    await ctx.db.patch(args.id, { read: true });
    return null;
  },
});

export const dismiss = mutation({
  args: { id: v.id('coachNotifications') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');
    await ctx.db.delete(args.id);
    return null;
  },
});
