import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

async function requireUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Unauthenticated');
  const user = await ctx.db.query('users').withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject)).first();
  if (!user) throw new Error('User not found');
  return user;
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'RSG';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export const getMyReferrals = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const referrals = await ctx.db
      .query('referrals')
      .withIndex('by_referrerId', (q: any) => q.eq('referrerId', user._id))
      .collect();
    return {
      code: user.referralCode,
      total: referrals.length,
      completed: referrals.filter((r: any) => r.status === 'completed').length,
      referrals: referrals.sort((a: any, b: any) => b.createdAt - a.createdAt),
    };
  },
});

export const ensureReferralCode = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    if (user.referralCode) return user.referralCode;
    const code = generateCode();
    await ctx.db.patch(user._id, { referralCode: code, updatedAt: Date.now() });
    return code;
  },
});

export const trackReferralVisit = mutation({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const referrer = await ctx.db
      .query('users')
      .filter((q: any) => q.eq(q.field('referralCode'), code))
      .first();
    if (!referrer) return null;
    // Create pending referral (will be updated to completed after signup)
    return ctx.db.insert('referrals', {
      referrerId: referrer._id,
      code,
      status: 'pending',
      rewardGranted: false,
      createdAt: Date.now(),
    });
  },
});

// ─── Complete Referral — called when a referred user signs up and uses the app ──

export const completeReferral = mutation({
  args: { referralCode: v.string() },
  handler: async (ctx, { referralCode }) => {
    const referee = await requireUser(ctx);
    const now = Date.now();

    // Find the referrer by code
    const referrer = await ctx.db
      .query('users')
      .filter((q: any) => q.eq(q.field('referralCode'), referralCode))
      .first();
    if (!referrer) return { success: false, message: 'Invalid referral code' };

    // Don't allow self-referral
    if (referrer._id === referee._id) return { success: false, message: 'Cannot refer yourself' };

    // Check if this referee already completed a referral
    const existingReferrals = await ctx.db
      .query('referrals')
      .withIndex('by_referrerId', (q: any) => q.eq('referrerId', referrer._id))
      .collect();
    const alreadyReferred = existingReferrals.some((r: any) =>
      r.refereeId === referee._id && r.status === 'completed'
    );
    if (alreadyReferred) return { success: false, message: 'Already referred' };

    // Find any pending referral to complete, or create new one
    const pendingReferral = existingReferrals.find((r: any) =>
      r.code === referralCode && r.status === 'pending' && !r.refereeId
    );

    if (pendingReferral) {
      await ctx.db.patch(pendingReferral._id, {
        refereeId: referee._id,
        status: 'completed' as const,
      });
    } else {
      await ctx.db.insert('referrals', {
        referrerId: referrer._id,
        refereeId: referee._id,
        code: referralCode,
        status: 'completed',
        rewardGranted: false,
        createdAt: now,
      });
    }

    // Grant rewards: give referrer bonus XP and coins
    const REFERRAL_XP_REWARD = 200;
    const REFERRAL_COIN_REWARD = 100;

    const referrerGamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', referrer._id))
      .unique();

    if (referrerGamification) {
      await ctx.db.patch(referrerGamification._id, {
        totalXP: (referrerGamification.totalXP || 0) + REFERRAL_XP_REWARD,
        coins: (referrerGamification.coins || 0) + REFERRAL_COIN_REWARD,
      });
    }

    // Mark reward as granted
    const referralToUpdate = pendingReferral?._id
      ? pendingReferral._id
      : (await ctx.db.query('referrals')
          .withIndex('by_referrerId', (q: any) => q.eq('referrerId', referrer._id))
          .collect())
          .find((r: any) => r.refereeId === referee._id && r.status === 'completed')?._id;

    if (referralToUpdate) {
      await ctx.db.patch(referralToUpdate, { rewardGranted: true });
    }

    return { success: true, message: 'Referral completed! Referrer rewarded.' };
  },
});

// ─── Get Referral Stats (for marketing/social sharing) ──────────────────────

export const getReferralShareData = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const referrals = await ctx.db
      .query('referrals')
      .withIndex('by_referrerId', (q: any) => q.eq('referrerId', user._id))
      .collect();

    const completed = referrals.filter((r: any) => r.status === 'completed').length;
    const domain = 'https://resurgo.life';
    const shareUrl = user.referralCode ? `${domain}?ref=${user.referralCode}` : domain;
    const shareText = completed > 0
      ? `I've helped ${completed} people transform their lives with RESURGO! Join me on this journey 🚀`
      : `I'm building better habits with RESURGO — join me and we both earn rewards! 🚀`;

    return {
      code: user.referralCode || null,
      url: shareUrl,
      text: shareText,
      totalReferred: referrals.length,
      totalCompleted: completed,
      xpEarned: completed * 200,
      coinsEarned: completed * 100,
    };
  },
});