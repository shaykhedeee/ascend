// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Telegram Integration Functions
// Handles OTP auth flow, account linking, context, and queries for bot commands
// ═══════════════════════════════════════════════════════════════════════════════

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// ─── Helper: generate 6-char alphanumeric OTP ────────────────────────────────
function generateOtp(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// createOtp — Called by webhook when a NEW user sends /start
// Returns the OTP token so the webhook can embed it in the auth link
// ─────────────────────────────────────────────────────────────────────────────
export const createOtp = mutation({
  args: {
    telegramChatId: v.string(),
    telegramUsername: v.optional(v.string()),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    const token = generateOtp();
    const now = Date.now();
    const expiresAt = now + 15 * 60 * 1000; // 15 minutes

    // Delete any existing OTP for this chat ID to prevent spam
    const existing = await ctx.db
      .query('telegramOtps')
      .filter((q) => q.eq(q.field('telegramChatId'), args.telegramChatId))
      .collect();
    for (const otp of existing) {
      await ctx.db.delete(otp._id);
    }

    await ctx.db.insert('telegramOtps', {
      clerkId: '', // placeholder — OTPs are looked up by token, not clerkId
      token,
      telegramChatId: args.telegramChatId,
      telegramUsername: args.telegramUsername,
      used: false,
      expiresAt,
      createdAt: now,
    });

    return token;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// linkAccount — Called by /link-telegram page after user clicks auth link
// Associates the Telegram chat ID with the authenticated Clerk user
// ─────────────────────────────────────────────────────────────────────────────
export const linkAccount = mutation({
  args: {
    clerkId: v.string(),
    token: v.string(),
  },
  returns: v.union(
    v.object({ success: v.literal(true), telegramChatId: v.string() }),
    v.object({ success: v.literal(false), error: v.string() })
  ),
  handler: async (ctx, args) => {
    const now = Date.now();

    // Find the OTP
    const otp = await ctx.db
      .query('telegramOtps')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .first();

    if (!otp) {
      return { success: false as const, error: 'Invalid or expired link. Please send /start again in Telegram.' };
    }
    if (otp.used) {
      return { success: false as const, error: 'This link has already been used. Please send /start again.' };
    }
    if (otp.expiresAt < now) {
      await ctx.db.delete(otp._id);
      return { success: false as const, error: 'Link expired. Please send /start again in Telegram.' };
    }

    // Find the user by clerkId
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();

    if (!user) {
      return { success: false as const, error: 'Account not found. Please ensure you are logged into Resurgo.' };
    }

    // Check if another user already has this chat ID
    const existing = await ctx.db
      .query('users')
      .withIndex('by_telegramChatId', (q) => q.eq('telegramChatId', otp.telegramChatId))
      .first();
    if (existing && existing._id !== user._id) {
      return { success: false as const, error: 'This Telegram account is already linked to another Resurgo account.' };
    }

    // Link the account
    await ctx.db.patch(user._id, {
      telegramChatId: otp.telegramChatId,
      telegramLinked: true,
      updatedAt: now,
    });

    // Mark OTP as used
    await ctx.db.patch(otp._id, { used: true, clerkId: args.clerkId });

    return { success: true as const, telegramChatId: otp.telegramChatId };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// getUserByTelegramChatId — Look up a Resurgo user from Telegram chat ID
// Used by webhook to authenticate all incoming commands
// ─────────────────────────────────────────────────────────────────────────────
export const getUserByTelegramChatId = query({
  args: { telegramChatId: v.string() },
  returns: v.union(
    v.object({
      _id: v.id('users'),
      clerkId: v.string(),
      name: v.string(),
      email: v.string(),
      plan: v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime')),
      telegramChatId: v.optional(v.string()),
      telegramLinked: v.optional(v.boolean()),
      preferredTime: v.optional(v.string()),
      timezone: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_telegramChatId', (q) => q.eq('telegramChatId', args.telegramChatId))
      .first();
    if (!user) return null;
    return {
      _id: user._id,
      clerkId: user.clerkId,
      name: user.name,
      email: user.email,
      plan: user.plan,
      telegramChatId: user.telegramChatId,
      telegramLinked: user.telegramLinked,
      preferredTime: user.preferredTime,
      timezone: user.timezone,
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// getOrCreateContext — Retrieve or initialise a user's Telegram message context
// ─────────────────────────────────────────────────────────────────────────────
export const getOrCreateContext = mutation({
  args: { userId: v.id('users'), telegramChatId: v.string() },
  returns: v.array(v.object({
    role: v.union(v.literal('user'), v.literal('assistant')),
    content: v.string(),
    timestamp: v.number(),
  })),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('telegramContext')
      .withIndex('by_telegramChatId', (q) => q.eq('telegramChatId', args.telegramChatId))
      .first();
    if (existing) return existing.messages;

    await ctx.db.insert('telegramContext', {
      userId: args.userId,
      telegramChatId: args.telegramChatId,
      messages: [],
      updatedAt: Date.now(),
    });
    return [];
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// appendToContext — Add a message to context, trimming to last 10
// ─────────────────────────────────────────────────────────────────────────────
export const appendToContext = mutation({
  args: {
    telegramChatId: v.string(),
    role: v.union(v.literal('user'), v.literal('assistant')),
    content: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query('telegramContext')
      .withIndex('by_telegramChatId', (q) => q.eq('telegramChatId', args.telegramChatId))
      .first();

    const newMessage = { role: args.role, content: args.content, timestamp: now };
    const messages = existing
      ? [...existing.messages, newMessage].slice(-10)
      : [newMessage];

    if (existing) {
      await ctx.db.patch(existing._id, { messages, updatedAt: now });
    }
    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// getUserSummary — Returns a compact data snapshot for bot commands like /digest
// ─────────────────────────────────────────────────────────────────────────────
export const getUserSummary = query({
  args: { userId: v.id('users') },
  returns: v.object({
    topTasks: v.array(v.object({ _id: v.id('tasks'), title: v.string(), priority: v.optional(v.string()) })),
    habitsToday: v.array(v.object({ _id: v.id('habits'), title: v.string(), completedToday: v.boolean() })),
    activeGoals: v.array(v.object({ _id: v.id('goals'), title: v.string(), progress: v.number() })),
  }),
  handler: async (ctx, args) => {
    const todayStr = new Date().toISOString().slice(0, 10);

    // Top 5 incomplete tasks
    const tasks = await ctx.db
      .query('tasks')
      .withIndex('by_userId_status', (q) => q.eq('userId', args.userId).eq('status', 'todo'))
      .order('desc')
      .take(5);

    // Active habits
    const habits = await ctx.db
      .query('habits')
      .withIndex('by_userId_active', (q) => q.eq('userId', args.userId).eq('isActive', true))
      .take(10);

    // Check which habits have a completed log today
    const todayLogs = await ctx.db
      .query('habitLogs')
      .withIndex('by_userId_date', (q) => q.eq('userId', args.userId).eq('date', todayStr))
      .filter((q) => q.eq(q.field('status'), 'completed'))
      .collect();
    const loggedToday = new Set(todayLogs.map((l) => l.habitId.toString()));

    // Active goals
    const goals = await ctx.db
      .query('goals')
      .withIndex('by_userId_status', (q) => q.eq('userId', args.userId).eq('status', 'in_progress'))
      .take(5);

    return {
      topTasks: tasks.map((t) => ({ _id: t._id, title: t.title, priority: t.priority })),
      habitsToday: habits.map((h) => ({ _id: h._id, title: h.title, completedToday: loggedToday.has(h._id.toString()) })),
      activeGoals: goals.map((g) => ({ _id: g._id, title: g.title, progress: g.progress })),
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// createTaskFromTelegram — Creates a task from a Telegram /task command
// ─────────────────────────────────────────────────────────────────────────────
export const createTaskFromTelegram = mutation({
  args: {
    userId: v.id('users'),
    title: v.string(),
  },
  returns: v.id('tasks'),
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert('tasks', {
      userId: args.userId,
      title: args.title,
      status: 'todo',
      priority: 'medium',
      source: 'telegram',
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// getUsersWithTelegram — Internal query for morning digest cron
// Returns users who have Telegram linked and have a preferredTime set
// ─────────────────────────────────────────────────────────────────────────────
export const getUsersWithTelegram = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id('users'),
    telegramChatId: v.string(),
    name: v.string(),
    preferredTime: v.optional(v.string()),
    timezone: v.optional(v.string()),
  })),
  handler: async (ctx) => {
    const users = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('telegramLinked'), true))
      .collect();
    return users
      .filter((u) => u.telegramChatId)
      .map((u) => ({
        _id: u._id,
        telegramChatId: u.telegramChatId!,
        name: u.name,
        preferredTime: u.preferredTime,
        timezone: u.timezone,
      }));
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// unlinkTelegram — Unlinks Telegram from a user account (from Settings page)
// ─────────────────────────────────────────────────────────────────────────────
export const unlinkTelegram = mutation({
  args: { clerkId: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
      .first();
    if (!user) return null;
    await ctx.db.patch(user._id, {
      telegramChatId: undefined,
      telegramLinked: false,
      updatedAt: Date.now(),
    });
    return null;
  },
});
