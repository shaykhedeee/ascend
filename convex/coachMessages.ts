// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Coach Messages Engine (Convex)
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
    role: v.optional(v.literal('user')), // Only users can send via public mutation; coach messages are created by AI actions
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
      role: 'user',
      content: args.content,
      touchpoint: args.touchpoint,
      context: args.context,
      createdAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// SEND + AUTO REPLY (templated personal coach response)
// ─────────────────────────────────────────────────────────────────────────────
export const sendWithAutoReply = mutation({
  args: {
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
  returns: v.object({
    userMessageId: v.id('coachMessages'),
    coachMessageId: v.id('coachMessages'),
  }),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    const userMessageId = await ctx.db.insert('coachMessages', {
      userId: user._id,
      role: 'user',
      content: args.content,
      touchpoint: args.touchpoint,
      context: args.context,
      createdAt: Date.now(),
    });

    const lower = args.content.toLowerCase();
    const isStruggle = /stuck|overwhelm|overwhelmed|anxious|tired|burnout|can't|cannot/.test(lower);
    const isPlanning = /plan|today|week|schedule|priorit|focus/.test(lower);
    const isHabit = /habit|streak|routine/.test(lower);

    const profileFocus = user.focusAreas?.slice(0, 2).join(', ');
    const profileGoal = user.primaryGoal;
    const peakTime = user.peakProductivityTime;

    let coachReply = 'Great check-in. Let\'s pick one meaningful action you can complete in the next 15 minutes.';

    if (isStruggle) {
      coachReply = 'You\'re not behind — you\'re human. Let\'s reduce scope: pick one tiny win now, then we\'ll reassess momentum after that.';
    } else if (isPlanning) {
      coachReply = 'Solid planning instinct. Pick your top 3 priorities: one must-do, one progress task, and one quick win. Time-block the must-do first.';
    } else if (isHabit) {
      coachReply = 'Consistency beats intensity. Keep today\'s habit version small enough that skipping feels harder than doing it.';
    }

    if (profileGoal && /goal|plan|priority|focus/.test(lower)) {
      coachReply += ` Keep your main objective in sight: ${profileGoal}.`;
    }

    if (peakTime && /schedule|time|today|week/.test(lower)) {
      coachReply += ` Try to place your hardest task in your ${peakTime.replace('_', ' ')} window.`;
    }

    if (profileFocus) {
      coachReply += ` We\'ll optimize around your focus areas: ${profileFocus}.`;
    }

    if (user.plan === 'free') {
      coachReply += ' Pro tip: keep habits focused and measurable so your weekly review is easier.';
    }

    const coachMessageId = await ctx.db.insert('coachMessages', {
      userId: user._id,
      role: 'coach',
      content: coachReply,
      touchpoint: args.touchpoint ?? 'on_demand',
      context: args.context,
      createdAt: Date.now(),
    });

    return { userMessageId, coachMessageId };
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
