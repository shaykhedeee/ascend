// Transaction helpers for atomic habit/goal creation to avoid race conditions
export async function checkAndCreateHabit(ctx: any, userId: string, habitData: any) {
  const user = await ctx.db.get(userId);
  if (!user) throw new Error('User not found');

  const planLimits: Record<string, number> = {
    free: 10,
    pro: Infinity,
    lifetime: Infinity,
  };

  const limit = planLimits[user.plan as string] ?? planLimits.free;

  const activeHabits = await ctx.db
    .query('habits')
    .withIndex('by_userId_active', (q: any) => q.eq('userId', userId).eq('isActive', true))
    .collect();

  if (activeHabits.length >= limit) {
    throw new Error(
      `Plan limit reached: ${user.plan} plan allows ${limit} active habits. Upgrade to Pro for unlimited.`
    );
  }

  const insertId = await ctx.db.insert('habits', {
    ...habitData,
    userId,
    isActive: true,
    streakCurrent: 0,
    streakLongest: 0,
    totalCompletions: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  return insertId;
}

export async function checkAndCreateGoal(ctx: any, userId: string, goalData: any) {
  const user = await ctx.db.get(userId);
  if (!user) throw new Error('User not found');

  const planLimits: Record<string, number> = {
    free: 3,
    pro: Infinity,
    lifetime: Infinity,
  };

  const limit = planLimits[user.plan as string] ?? planLimits.free;

  const activeGoals = await ctx.db
    .query('goals')
    .withIndex('by_userId_status', (q: any) => q.eq('userId', userId).eq('status', 'in_progress'))
    .collect();

  if (activeGoals.length >= limit) {
    throw new Error(
      `Plan limit reached: ${user.plan} plan allows ${limit} active goals. Upgrade to Pro for unlimited.`
    );
  }

  const insertId = await ctx.db.insert('goals', {
    ...goalData,
    userId,
    status: 'in_progress',
    progress: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  return insertId;
}