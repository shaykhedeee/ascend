// ═══════════════════════════════════════════════════════════════════════════════
// VANTAGE — Gamification Engine (Convex)
// XP, levels, achievements — the dopamine loop
// ═══════════════════════════════════════════════════════════════════════════════

import { query, mutation, internalMutation } from './_generated/server';
import { v } from 'convex/values';

// Level thresholds
const LEVEL_THRESHOLDS = [
  { level: 1, xpRequired: 0, name: 'Seed' },
  { level: 2, xpRequired: 100, name: 'Sprout' },
  { level: 3, xpRequired: 250, name: 'Sapling' },
  { level: 4, xpRequired: 500, name: 'Growing' },
  { level: 5, xpRequired: 800, name: 'Blooming' },
  { level: 6, xpRequired: 1200, name: 'Flourishing' },
  { level: 7, xpRequired: 1800, name: 'Thriving' },
  { level: 8, xpRequired: 2500, name: 'Mighty Oak' },
  { level: 9, xpRequired: 3500, name: 'Ancient Tree' },
  { level: 10, xpRequired: 5000, name: 'Forest' },
  { level: 11, xpRequired: 7000, name: 'Mountain' },
  { level: 12, xpRequired: 10000, name: 'Summit' },
  { level: 13, xpRequired: 15000, name: 'Sky' },
  { level: 14, xpRequired: 20000, name: 'Star' },
  { level: 15, xpRequired: 30000, name: 'Constellation' },
];

function calculateLevel(xp: number) {
  let level = 1;
  for (const threshold of LEVEL_THRESHOLDS) {
    if (xp >= threshold.xpRequired) {
      level = threshold.level;
    } else {
      break;
    }
  }
  return level;
}

function getLevelName(level: number): string {
  const found = LEVEL_THRESHOLDS.find((t) => t.level === level);
  return found?.name ?? 'Legend';
}

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
// GET PROFILE
// ─────────────────────────────────────────────────────────────────────────────
export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);

    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();

    if (!gamification) {
      return {
        totalXP: 0,
        level: 1,
        levelName: 'Seed',
        achievements: [],
        badges: [],
        xpToNextLevel: 100,
        xpProgress: 0,
      };
    }

    const level = calculateLevel(gamification.totalXP);
    const currentThreshold = LEVEL_THRESHOLDS.find((t) => t.level === level);
    const nextThreshold = LEVEL_THRESHOLDS.find((t) => t.level === level + 1);

    const xpIntoLevel = gamification.totalXP - (currentThreshold?.xpRequired ?? 0);
    const xpForNextLevel = nextThreshold
      ? nextThreshold.xpRequired - (currentThreshold?.xpRequired ?? 0)
      : 0;

    return {
      totalXP: gamification.totalXP,
      level,
      levelName: getLevelName(level),
      achievements: gamification.achievements,
      badges: gamification.badges ?? [],
      xpToNextLevel: nextThreshold?.xpRequired ?? gamification.totalXP,
      xpProgress: xpForNextLevel > 0 ? Math.round((xpIntoLevel / xpForNextLevel) * 100) : 100,
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// AWARD XP (internal — called by habits/tasks)
// ─────────────────────────────────────────────────────────────────────────────
export const awardXP = internalMutation({
  args: {
    userId: v.id('users'),
    amount: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, { userId, amount, reason }) => {
    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', userId))
      .unique();

    if (!gamification) return;

    const newXP = gamification.totalXP + amount;
    const newLevel = calculateLevel(newXP);
    const oldLevel = gamification.level;

    const updates: any = {
      totalXP: newXP,
      level: newLevel,
      updatedAt: Date.now(),
    };

    // Check for level-up achievement
    if (newLevel > oldLevel) {
      const achievements = [...gamification.achievements];
      achievements.push({
        id: `level_${newLevel}_${Date.now()}`,
        name: `Reached ${getLevelName(newLevel)}`,
        description: `Leveled up to Level ${newLevel}!`,
        icon: '🎉',
        unlockedAt: Date.now(),
      });
      updates.achievements = achievements;
    }

    await ctx.db.patch(gamification._id, updates);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UNLOCK ACHIEVEMENT
// ─────────────────────────────────────────────────────────────────────────────
export const unlockAchievement = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    icon: v.string(),
  },
  handler: async (ctx, { name, description, icon }) => {
    const user = await getAuthUser(ctx);

    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();

    if (!gamification) return;

    // Don't duplicate
    if (gamification.achievements.some((a) => a.name === name)) return;

    const achievements = [...gamification.achievements];
    achievements.push({
      id: `ach_${Date.now()}`,
      name,
      description,
      icon,
      unlockedAt: Date.now(),
    });

    await ctx.db.patch(gamification._id, {
      achievements,
      updatedAt: Date.now(),
    });
  },
});
