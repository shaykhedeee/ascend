import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// ─────────────────────────────────────────────────────────────────────────────
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
// SAVE — Deactivates previous board then inserts the new one
// ─────────────────────────────────────────────────────────────────────────────
export const save = mutation({
  args: {
    config: v.string(), // JSON string of VisionBoardConfig (with images)
    version: v.number(),
  },
  returns: v.id('visionBoards'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    // Deactivate all existing boards for this user
    const existing = await ctx.db
      .query('visionBoards')
      .withIndex('by_user_active', (q: any) =>
        q.eq('userId', user._id).eq('isActive', true)
      )
      .collect();

    for (const board of existing) {
      await ctx.db.patch(board._id, { isActive: false, updatedAt: Date.now() });
    }

    // Insert the new active board
    return await ctx.db.insert('visionBoards', {
      userId: user._id,
      config: args.config,
      version: args.version,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET ACTIVE BOARD for the authenticated user
// ─────────────────────────────────────────────────────────────────────────────
export const getActive = query({
  args: {},
  returns: v.union(v.null(), v.any()),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    return await ctx.db
      .query('visionBoards')
      .withIndex('by_user_active', (q: any) =>
        q.eq('userId', user._id).eq('isActive', true)
      )
      .first() ?? null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST ALL BOARDS for the authenticated user (history)
// ─────────────────────────────────────────────────────────────────────────────
export const list = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    return await ctx.db
      .query('visionBoards')
      .withIndex('by_user', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE — Hard delete a board (GDPR)
// ─────────────────────────────────────────────────────────────────────────────
export const remove = mutation({
  args: { boardId: v.id('visionBoards') },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const board = await ctx.db.get(args.boardId);
    if (!board || board.userId !== user._id) return false;
    await ctx.db.delete(args.boardId);
    return true;
  },
});
