import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

async function requireUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Unauthenticated');
  const user = await ctx.db.query('users').withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject)).first();
  if (!user) throw new Error('User not found');
  return user;
}

export const SUPPORTED_EVENTS = [
  'task.created',
  'task.completed',
  'habit.logged',
  'habit.streak_broken',
  'goal.completed',
  'focus.completed',
  'budget.expense_logged',
  'sleep.logged',
] as const;

export const listWebhooks = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    return ctx.db.query('webhooks').withIndex('by_userId', (q: any) => q.eq('userId', user._id)).collect();
  },
});

export const createWebhook = mutation({
  args: {
    url: v.string(),
    events: v.array(v.string()),
    name: v.optional(v.string()),
    secret: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    return ctx.db.insert('webhooks', {
      userId: user._id,
      url: args.url,
      events: args.events,
      name: args.name,
      secret: args.secret,
      active: true,
      createdAt: Date.now(),
    });
  },
});

export const toggleWebhook = mutation({
  args: { id: v.id('webhooks') },
  handler: async (ctx, { id }) => {
    const user = await requireUser(ctx);
    const wh = await ctx.db.get(id);
    if (!wh || wh.userId !== user._id) throw new Error('Access denied');
    await ctx.db.patch(id, { active: !wh.active });
  },
});

export const deleteWebhook = mutation({
  args: { id: v.id('webhooks') },
  handler: async (ctx, { id }) => {
    const user = await requireUser(ctx);
    const wh = await ctx.db.get(id);
    if (!wh || wh.userId !== user._id) throw new Error('Access denied');
    await ctx.db.delete(id);
  },
});
