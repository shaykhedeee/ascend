// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND — User Sync & Management (Convex)
// Syncs Clerk users to Convex DB, manages plan status
// ═══════════════════════════════════════════════════════════════════════════════

import { mutation, query, internalMutation } from './_generated/server';
import { v } from 'convex/values';

// ─────────────────────────────────────────────────────────────────────────────
// STORE USER — Called after Clerk sign-in to upsert user record
// ─────────────────────────────────────────────────────────────────────────────
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const clerkId = identity.subject;

    // Check if user already exists
    const existing = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .unique();

    if (existing) {
      // Update name/email/image if changed
      await ctx.db.patch(existing._id, {
        name: identity.name ?? existing.name,
        email: identity.email ?? existing.email,
        imageUrl: identity.pictureUrl ?? existing.imageUrl,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    // Create new user
    const userId = await ctx.db.insert('users', {
      clerkId,
      email: identity.email ?? '',
      name: identity.name ?? 'User',
      imageUrl: identity.pictureUrl,
      plan: 'free',
      onboardingComplete: false,
      streakFreezeCount: 1, // Start with 1 free freeze
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Initialize gamification profile
    await ctx.db.insert('gamification', {
      userId,
      totalXP: 0,
      level: 1,
      achievements: [],
      badges: [],
      updatedAt: Date.now(),
    });

    return userId;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET CURRENT USER
// ─────────────────────────────────────────────────────────────────────────────
export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE USER PROFILE
// ─────────────────────────────────────────────────────────────────────────────
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    timezone: v.optional(v.string()),
    theme: v.optional(v.union(v.literal('light'), v.literal('dark'), v.literal('system'))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETE ONBOARDING
// ─────────────────────────────────────────────────────────────────────────────
export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, {
      onboardingComplete: true,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE PLAN — Called by billing webhooks
// ─────────────────────────────────────────────────────────────────────────────
export const updatePlan = internalMutation({
  args: {
    clerkId: v.string(),
    plan: v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime')),
  },
  handler: async (ctx, { clerkId, plan }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .unique();
    if (!user) throw new Error(`User not found for clerkId: ${clerkId}`);

    await ctx.db.patch(user._id, {
      plan,
      updatedAt: Date.now(),
    });
  },
});
