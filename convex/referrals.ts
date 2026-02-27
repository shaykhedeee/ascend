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
