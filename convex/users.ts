// ═══════════════════════════════════════════════════════════════════════════════
// ASCENDIFY — User Sync & Management (Convex)
// Syncs Clerk users to Convex DB, manages plan status
// ═══════════════════════════════════════════════════════════════════════════════

import { mutation, query, internalMutation } from './_generated/server';
import { v } from 'convex/values';

// ─────────────────────────────────────────────────────────────────────────────
// STORE USER — Called after Clerk sign-in to upsert user record
// ─────────────────────────────────────────────────────────────────────────────
export const store = mutation({
  args: {},
  returns: v.id('users'),
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
  returns: v.union(
    v.object({
      _id: v.id('users'),
      _creationTime: v.number(),
      clerkId: v.string(),
      email: v.string(),
      name: v.string(),
      imageUrl: v.optional(v.string()),
      plan: v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime')),
      timezone: v.optional(v.string()),
      theme: v.optional(v.union(v.literal('light'), v.literal('dark'), v.literal('system'))),
      onboardingComplete: v.boolean(),
      streakFreezeCount: v.number(),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
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
  returns: v.null(),
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
// COMPLETE ONBOARDING (enhanced with life design data)
// ─────────────────────────────────────────────────────────────────────────────
export const completeOnboarding = mutation({
  args: {
    lifeWheelScores: v.optional(v.object({
      health: v.number(),
      career: v.number(),
      finance: v.number(),
      learning: v.number(),
      relationships: v.number(),
      creativity: v.number(),
      mindfulness: v.number(),
      personal_growth: v.number(),
    })),
    coreValues: v.optional(v.array(v.string())),
    lifeVision: v.optional(v.string()),
    wakeTime: v.optional(v.string()),
    sleepTime: v.optional(v.string()),
    peakProductivityTime: v.optional(v.string()),
    coachPersonality: v.optional(v.union(
      v.literal('supportive'),
      v.literal('challenging'),
      v.literal('analytical'),
      v.literal('humorous')
    )),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    const updates: any = {
      onboardingComplete: true,
      updatedAt: Date.now(),
    };

    if (args.lifeWheelScores) updates.lifeWheelScores = args.lifeWheelScores;
    if (args.coreValues) updates.coreValues = args.coreValues;
    if (args.lifeVision) updates.lifeVision = args.lifeVision;
    if (args.wakeTime) updates.wakeTime = args.wakeTime;
    if (args.sleepTime) updates.sleepTime = args.sleepTime;
    if (args.peakProductivityTime) updates.peakProductivityTime = args.peakProductivityTime;
    if (args.coachPersonality) updates.coachPersonality = args.coachPersonality;

    await ctx.db.patch(user._id, updates);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE LIFE WHEEL (Module 1 — Vision & Life Design)
// ─────────────────────────────────────────────────────────────────────────────
export const updateLifeWheel = mutation({
  args: {
    scores: v.object({
      health: v.number(),
      career: v.number(),
      finance: v.number(),
      learning: v.number(),
      relationships: v.number(),
      creativity: v.number(),
      mindfulness: v.number(),
      personal_growth: v.number(),
    }),
  },
  returns: v.null(),
  handler: async (ctx, { scores }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, {
      lifeWheelScores: scores,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE CORE VALUES
// ─────────────────────────────────────────────────────────────────────────────
export const updateCoreValues = mutation({
  args: { values: v.array(v.string()) },
  returns: v.null(),
  handler: async (ctx, { values }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, {
      coreValues: values,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE LIFE VISION
// ─────────────────────────────────────────────────────────────────────────────
export const updateLifeVision = mutation({
  args: { vision: v.string() },
  returns: v.null(),
  handler: async (ctx, { vision }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, {
      lifeVision: vision,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE SCHEDULE PREFERENCES
// ─────────────────────────────────────────────────────────────────────────────
export const updateSchedule = mutation({
  args: {
    wakeTime: v.optional(v.string()),
    sleepTime: v.optional(v.string()),
    peakProductivityTime: v.optional(v.string()),
    workSchedule: v.optional(v.object({
      startTime: v.string(),
      endTime: v.string(),
      lunchStart: v.optional(v.string()),
      lunchEnd: v.optional(v.string()),
      workDays: v.array(v.number()),
    })),
  },
  returns: v.null(),
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
// UPDATE NOTIFICATION PREFERENCES
// ─────────────────────────────────────────────────────────────────────────────
export const updateNotificationPrefs = mutation({
  args: {
    prefs: v.object({
      morningMotivation: v.boolean(),
      middayCheckin: v.boolean(),
      eveningWinddown: v.boolean(),
      reminderStyle: v.union(
        v.literal('gentle'),
        v.literal('supportive'),
        v.literal('persistent'),
        v.literal('minimal')
      ),
      coachingFrequency: v.union(
        v.literal('daily'),
        v.literal('weekly'),
        v.literal('struggling_only'),
        v.literal('manual')
      ),
    }),
  },
  returns: v.null(),
  handler: async (ctx, { prefs }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    await ctx.db.patch(user._id, {
      notificationPrefs: prefs,
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE PLAN FROM WEBHOOK — Secure public mutation for server webhooks
// ─────────────────────────────────────────────────────────────────────────────
export const updatePlanFromWebhook = mutation({
  args: {
    clerkId: v.string(),
    plan: v.union(v.literal('free'), v.literal('pro'), v.literal('lifetime')),
    webhookSecret: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { clerkId, plan, webhookSecret }) => {
    const expected = process.env.BILLING_WEBHOOK_SYNC_SECRET;
    if (!expected) {
      throw new Error('BILLING_WEBHOOK_SYNC_SECRET is not configured');
    }

    // Use timing-safe comparison to prevent timing attacks
    const expectedBuffer = Buffer.from(expected);
    const receivedBuffer = Buffer.from(webhookSecret);
    
    try {
      const crypto = require('crypto');
      if (expectedBuffer.length !== receivedBuffer.length || 
          !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
        throw new Error('Unauthorized webhook plan update');
      }
    } catch (err: any) {
      // timingSafeEqual throws if lengths don't match
      if (err.message === 'Unauthorized webhook plan update') throw err;
      throw new Error('Unauthorized webhook plan update');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', clerkId))
      .unique();

    // Webhook may arrive before first signed-in sync; no-op safely.
    if (!user) {
      console.warn(`[users.updatePlanFromWebhook] User not found for clerkId=${clerkId}`);
      return null;
    }

    await ctx.db.patch(user._id, {
      plan,
      updatedAt: Date.now(),
    });

    return null;
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
  returns: v.null(),
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
