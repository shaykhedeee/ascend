import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// Helper — throws if not authenticated
async function getAuthUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Not authenticated');
  const user = await ctx.db
    .query('users')
    .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
    .first();
  if (!user) throw new Error('User record not found');
  return user;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET PSYCHOLOGICAL PROFILE
// ─────────────────────────────────────────────────────────────────────────────
export const getProfile = query({
  args: {},
  returns: v.union(v.null(), v.any()),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    const profile = await ctx.db
      .query('psychProfiles')
      .withIndex('by_user', (q: any) => q.eq('userId', user._id))
      .first();
    return profile ?? null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPSERT PSYCHOLOGICAL PROFILE
// ─────────────────────────────────────────────────────────────────────────────
export const upsertProfile = mutation({
  args: {
    profileData: v.string(), // JSON-serialised PsychologicalProfile
  },
  returns: v.id('psychProfiles'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const existing = await ctx.db
      .query('psychProfiles')
      .withIndex('by_user', (q: any) => q.eq('userId', user._id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        profileData: args.profileData,
        interactionCount: (existing.interactionCount ?? 0) + 1,
        lastUpdated: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert('psychProfiles', {
      userId: user._id,
      profileData: args.profileData,
      interactionCount: 1,
      lastUpdated: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE PROFILE — GDPR right to erasure
// ─────────────────────────────────────────────────────────────────────────────
export const deleteProfile = mutation({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    const profile = await ctx.db
      .query('psychProfiles')
      .withIndex('by_user', (q: any) => q.eq('userId', user._id))
      .first();
    if (!profile) return false;
    await ctx.db.delete(profile._id);
    return true;
  },
});
