// ═══════════════════════════════════════════════════════════════════════════════
// ASCENDIFY — Recovery & Comeback Engine (Convex)
// Anti-fragile streaks, recovery detection, comeback protocol — Module 8
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

const recoveryLogDoc = v.object({
  _id: v.id('recoveryLogs'),
  _creationTime: v.number(),
  userId: v.id('users'),
  startedAt: v.number(),
  completedAt: v.optional(v.number()),
  status: v.union(
    v.literal('in_progress'),
    v.literal('completed'),
    v.literal('abandoned')
  ),
  triggerReason: v.union(
    v.literal('streak_break'),
    v.literal('long_absence'),
    v.literal('engagement_drop'),
    v.literal('user_initiated')
  ),
  daysInactive: v.number(),
  phase: v.union(
    v.literal('acknowledgement'),
    v.literal('assessment'),
    v.literal('minimal_restart'),
    v.literal('gradual_rebuild'),
    v.literal('full_momentum')
  ),
  minimalRoutine: v.optional(v.array(v.string())),
  adjustedGoals: v.optional(v.array(v.string())),
  recoveryStreak: v.optional(v.number()),
  notes: v.optional(v.string()),
  createdAt: v.number(),
});

// ─────────────────────────────────────────────────────────────────────────────
// DETECT RECOVERY NEED (called on login)
// ─────────────────────────────────────────────────────────────────────────────
export const detectRecoveryNeed = mutation({
  args: {},
  returns: v.union(
    v.object({
      needsRecovery: v.boolean(),
      daysInactive: v.number(),
      suggestedPhase: v.union(
        v.literal('acknowledgement'),
        v.literal('assessment'),
        v.literal('minimal_restart'),
        v.literal('gradual_rebuild'),
        v.literal('full_momentum')
      ),
      existingRecoveryId: v.optional(v.id('recoveryLogs')),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    // Check for active recovery
    const activeRecovery = await ctx.db
      .query('recoveryLogs')
      .withIndex('by_userId_status', (q: any) =>
        q.eq('userId', user._id).eq('status', 'in_progress')
      )
      .first();

    if (activeRecovery) {
      return {
        needsRecovery: true,
        daysInactive: activeRecovery.daysInactive,
        suggestedPhase: activeRecovery.phase,
        existingRecoveryId: activeRecovery._id,
      };
    }

    // Calculate days since last activity
    const lastActive = user.lastActiveAt ?? user.createdAt;
    const daysSinceActive = Math.floor((Date.now() - lastActive) / (1000 * 60 * 60 * 24));

    // Update last active timestamp
    await ctx.db.patch(user._id, {
      lastActiveAt: Date.now(),
      updatedAt: Date.now(),
    });

    if (daysSinceActive < 3) {
      // No recovery needed
      await ctx.db.patch(user._id, {
        recoveryStatus: 'active',
        updatedAt: Date.now(),
      });
      return {
        needsRecovery: false,
        daysInactive: daysSinceActive,
        suggestedPhase: 'full_momentum' as const,
      };
    }

    // Determine recovery phase based on absence
    let phase: 'acknowledgement' | 'assessment' | 'minimal_restart' | 'gradual_rebuild' | 'full_momentum';
    if (daysSinceActive >= 14) {
      phase = 'acknowledgement';
    } else if (daysSinceActive >= 7) {
      phase = 'assessment';
    } else {
      phase = 'minimal_restart';
    }

    await ctx.db.patch(user._id, {
      recoveryStatus: 'recovering',
      updatedAt: Date.now(),
    });

    return {
      needsRecovery: true,
      daysInactive: daysSinceActive,
      suggestedPhase: phase,
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// START RECOVERY
// ─────────────────────────────────────────────────────────────────────────────
export const startRecovery = mutation({
  args: {
    triggerReason: v.union(
      v.literal('streak_break'),
      v.literal('long_absence'),
      v.literal('engagement_drop'),
      v.literal('user_initiated')
    ),
    daysInactive: v.number(),
    phase: v.union(
      v.literal('acknowledgement'),
      v.literal('assessment'),
      v.literal('minimal_restart'),
      v.literal('gradual_rebuild'),
      v.literal('full_momentum')
    ),
    minimalRoutine: v.optional(v.array(v.string())),
  },
  returns: v.id('recoveryLogs'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    return await ctx.db.insert('recoveryLogs', {
      userId: user._id,
      startedAt: Date.now(),
      status: 'in_progress',
      triggerReason: args.triggerReason,
      daysInactive: args.daysInactive,
      phase: args.phase,
      minimalRoutine: args.minimalRoutine,
      recoveryStreak: 0,
      createdAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// ADVANCE RECOVERY PHASE
// ─────────────────────────────────────────────────────────────────────────────
export const advancePhase = mutation({
  args: {
    recoveryId: v.id('recoveryLogs'),
  },
  returns: v.object({
    newPhase: v.string(),
    completed: v.boolean(),
  }),
  handler: async (ctx, { recoveryId }) => {
    const user = await getAuthUser(ctx);
    const recovery = await ctx.db.get(recoveryId);
    if (!recovery || recovery.userId !== user._id) throw new Error('Recovery not found');

    const phaseOrder = [
      'acknowledgement',
      'assessment',
      'minimal_restart',
      'gradual_rebuild',
      'full_momentum',
    ] as const;

    const currentIdx = phaseOrder.indexOf(recovery.phase);
    const isLast = currentIdx >= phaseOrder.length - 1;

    if (isLast) {
      // Recovery complete!
      await ctx.db.patch(recoveryId, {
        status: 'completed',
        completedAt: Date.now(),
        phase: 'full_momentum',
      });

      await ctx.db.patch(user._id, {
        recoveryStatus: 'active',
        updatedAt: Date.now(),
      });

      // Award comeback XP
      const gamification = await ctx.db
        .query('gamification')
        .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
        .unique();

      if (gamification) {
        const xpGain = 100; // Comeback bonus
        await ctx.db.patch(gamification._id, {
          totalXP: gamification.totalXP + xpGain,
          updatedAt: Date.now(),
        });

        await ctx.db.insert('xpHistory', {
          userId: user._id,
          amount: xpGain,
          source: 'comeback',
          description: 'Completed recovery protocol — Welcome back!',
          createdAt: Date.now(),
        });
      }

      return { newPhase: 'full_momentum', completed: true };
    }

    const nextPhase = phaseOrder[currentIdx + 1];
    await ctx.db.patch(recoveryId, {
      phase: nextPhase,
      recoveryStreak: (recovery.recoveryStreak ?? 0) + 1,
    });

    return { newPhase: nextPhase, completed: false };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET ACTIVE RECOVERY
// ─────────────────────────────────────────────────────────────────────────────
export const getActive = query({
  args: {},
  returns: v.union(recoveryLogDoc, v.null()),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query('recoveryLogs')
      .withIndex('by_userId_status', (q: any) =>
        q.eq('userId', user._id).eq('status', 'in_progress')
      )
      .first();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST RECOVERY HISTORY
// ─────────────────────────────────────────────────────────────────────────────
export const listHistory = query({
  args: {},
  returns: v.array(recoveryLogDoc),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query('recoveryLogs')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE RECOVERY NOTES
// ─────────────────────────────────────────────────────────────────────────────
export const updateNotes = mutation({
  args: {
    recoveryId: v.id('recoveryLogs'),
    notes: v.string(),
    adjustedGoals: v.optional(v.array(v.string())),
    minimalRoutine: v.optional(v.array(v.string())),
  },
  returns: v.null(),
  handler: async (ctx, { recoveryId, ...fields }) => {
    const user = await getAuthUser(ctx);
    const recovery = await ctx.db.get(recoveryId);
    if (!recovery || recovery.userId !== user._id) throw new Error('Recovery not found');

    await ctx.db.patch(recoveryId, fields);
    return null;
  },
});
