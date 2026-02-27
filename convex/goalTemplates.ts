// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Goal Templates Library (Convex)
// Pre-built goal plans with milestones & suggested habits
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

const lifeDomainValidator = v.union(
  v.literal('health'),
  v.literal('career'),
  v.literal('finance'),
  v.literal('learning'),
  v.literal('relationships'),
  v.literal('creativity'),
  v.literal('mindfulness'),
  v.literal('personal_growth')
);

const goalTypeValidator = v.union(
  v.literal('achievement'),
  v.literal('transformation'),
  v.literal('skill'),
  v.literal('project'),
  v.literal('quantitative'),
  v.literal('maintenance'),
  v.literal('elimination'),
  v.literal('relationship')
);

const templateDoc = v.object({
  _id: v.id('goalTemplates'),
  _creationTime: v.number(),
  title: v.string(),
  description: v.string(),
  category: v.string(),
  lifeDomain: lifeDomainValidator,
  goalType: goalTypeValidator,
  estimatedWeeks: v.number(),
  difficultyLevel: v.number(),
  milestones: v.array(v.object({
    title: v.string(),
    description: v.optional(v.string()),
    weekNumber: v.number(),
  })),
  suggestedHabits: v.optional(v.array(v.object({
    title: v.string(),
    frequency: v.string(),
    estimatedMinutes: v.number(),
  }))),
  icon: v.optional(v.string()),
  color: v.optional(v.string()),
  isPublic: v.boolean(),
  createdBy: v.optional(v.id('users')),
  usageCount: v.optional(v.number()),
  createdAt: v.number(),
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST PUBLIC TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────
export const listPublic = query({
  args: {
    category: v.optional(v.string()),
    lifeDomain: v.optional(lifeDomainValidator),
  },
  returns: v.array(templateDoc),
  handler: async (ctx, { category, lifeDomain }) => {
    let templates;

    if (lifeDomain) {
      templates = await ctx.db
        .query('goalTemplates')
        .withIndex('by_lifeDomain', (q: any) => q.eq('lifeDomain', lifeDomain))
        .collect();
    } else if (category) {
      templates = await ctx.db
        .query('goalTemplates')
        .withIndex('by_category', (q: any) => q.eq('category', category))
        .collect();
    } else {
      templates = await ctx.db.query('goalTemplates').collect();
    }

    return templates.filter((t) => t.isPublic);
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET TEMPLATE BY ID
// ─────────────────────────────────────────────────────────────────────────────
export const getById = query({
  args: { templateId: v.id('goalTemplates') },
  returns: v.union(templateDoc, v.null()),
  handler: async (ctx, { templateId }) => {
    const template = await ctx.db.get(templateId);
    if (!template) return null;

    // Public templates are visible to everyone
    if (template.isPublic) return template;

    // Private templates require auth and ownership
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user || template.createdBy !== user._id) return null;

    return template;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// USE TEMPLATE (create goal + milestones + habits from template)
// ─────────────────────────────────────────────────────────────────────────────
export const useTemplate = mutation({
  args: {
    templateId: v.id('goalTemplates'),
    targetDate: v.optional(v.string()),
  },
  returns: v.object({
    goalId: v.id('goals'),
    milestoneIds: v.array(v.id('milestones')),
    habitIds: v.array(v.id('habits')),
  }),
  handler: async (ctx, { templateId, targetDate }) => {
    const user = await getAuthUser(ctx);
    const template = await ctx.db.get(templateId);
    if (!template) throw new Error('Template not found');

    // Create goal from template
    const goalId = await ctx.db.insert('goals', {
      userId: user._id,
      title: template.title,
      description: template.description,
      category: template.category,
      status: 'in_progress',
      progress: 0,
      targetDate,
      goalType: template.goalType,
      lifeDomain: template.lifeDomain,
      difficultyLevel: template.difficultyLevel,
      estimatedHours: template.estimatedWeeks * 5, // rough estimate
      decompositionStatus: 'completed',
      progressType: 'milestones',
      icon: template.icon,
      color: template.color,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create milestones from template
    const milestoneIds = [];
    for (const ms of template.milestones) {
      const msTargetDate = targetDate
        ? new Date(
            new Date(targetDate).getTime() -
            (template.estimatedWeeks - ms.weekNumber) * 7 * 24 * 60 * 60 * 1000
          ).toISOString().split('T')[0]
        : undefined;

      const msId = await ctx.db.insert('milestones', {
        userId: user._id,
        goalId,
        title: ms.title,
        description: ms.description,
        sequenceOrder: ms.weekNumber,
        targetDate: msTargetDate,
        status: 'not_started',
        progressPercentage: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      milestoneIds.push(msId);
    }

    // Create habits from template
    const habitIds = [];
    if (template.suggestedHabits) {
      for (const h of template.suggestedHabits) {
        const freqMap: Record<string, 'daily' | 'weekdays' | 'weekly' | '3x_week'> = {
          'daily': 'daily',
          'weekdays': 'weekdays',
          'weekly': 'weekly',
          '3x per week': '3x_week',
          '3x_week': '3x_week',
        };

        const habitId = await ctx.db.insert('habits', {
          userId: user._id,
          goalId,
          title: h.title,
          category: template.category,
          frequency: freqMap[h.frequency] ?? 'daily',
          timeOfDay: 'anytime',
          isActive: true,
          streakCurrent: 0,
          streakLongest: 0,
          estimatedMinutes: h.estimatedMinutes,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        habitIds.push(habitId);
      }
    }

    // Increment usage count
    await ctx.db.patch(templateId, {
      usageCount: (template.usageCount ?? 0) + 1,
    });

    return { goalId, milestoneIds, habitIds };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// CREATE CUSTOM TEMPLATE (pro feature)
// ─────────────────────────────────────────────────────────────────────────────
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    lifeDomain: lifeDomainValidator,
    goalType: goalTypeValidator,
    estimatedWeeks: v.number(),
    difficultyLevel: v.number(),
    milestones: v.array(v.object({
      title: v.string(),
      description: v.optional(v.string()),
      weekNumber: v.number(),
    })),
    suggestedHabits: v.optional(v.array(v.object({
      title: v.string(),
      frequency: v.string(),
      estimatedMinutes: v.number(),
    }))),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
  },
  returns: v.id('goalTemplates'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    return await ctx.db.insert('goalTemplates', {
      title: args.title,
      description: args.description,
      category: args.category,
      lifeDomain: args.lifeDomain,
      goalType: args.goalType,
      estimatedWeeks: args.estimatedWeeks,
      difficultyLevel: args.difficultyLevel,
      milestones: args.milestones,
      suggestedHabits: args.suggestedHabits,
      icon: args.icon,
      color: args.color,
      isPublic: args.isPublic ?? false,
      createdBy: user._id,
      usageCount: 0,
      createdAt: Date.now(),
    });
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// SEED BUSINESS TEMPLATE PACK
// ─────────────────────────────────────────────────────────────────────────────
export const seedBusinessTemplates = mutation({
  args: {},
  returns: v.object({ created: v.number() }),
  handler: async (ctx) => {
    await getAuthUser(ctx);

    const existing = await ctx.db
      .query('goalTemplates')
      .withIndex('by_category', (q: any) => q.eq('category', 'business'))
      .collect();

    const seedTemplates = [
      {
        title: 'Launch MVP in 12 Weeks',
        description: 'Build and launch a minimum viable product with clear weekly milestones.',
        category: 'business',
        lifeDomain: 'career' as const,
        goalType: 'project' as const,
        estimatedWeeks: 12,
        difficultyLevel: 7,
        milestones: [
          { title: 'Define problem and ICP', weekNumber: 2 },
          { title: 'Design and scope MVP', weekNumber: 4 },
          { title: 'Build core flows', weekNumber: 8 },
          { title: 'Beta test and launch', weekNumber: 12 },
        ],
      },
      {
        title: 'Build Sales Pipeline Foundation',
        description: 'Set up consistent lead generation and follow-up cadence.',
        category: 'business',
        lifeDomain: 'career' as const,
        goalType: 'quantitative' as const,
        estimatedWeeks: 8,
        difficultyLevel: 6,
        milestones: [
          { title: 'Define offer and target segment', weekNumber: 2 },
          { title: 'Create outreach system', weekNumber: 4 },
          { title: 'Run weekly pipeline reviews', weekNumber: 6 },
          { title: 'Close first repeatable deals', weekNumber: 8 },
        ],
      },
      {
        title: 'Content Engine for Growth',
        description: 'Create and sustain a weekly content cadence for audience growth.',
        category: 'business',
        lifeDomain: 'career' as const,
        goalType: 'maintenance' as const,
        estimatedWeeks: 10,
        difficultyLevel: 5,
        milestones: [
          { title: 'Define content pillars', weekNumber: 2 },
          { title: 'Build publishing workflow', weekNumber: 4 },
          { title: 'Publish consistently each week', weekNumber: 8 },
          { title: 'Analyze and optimize channels', weekNumber: 10 },
        ],
      },
      {
        title: 'Hiring Readiness Sprint',
        description: 'Prepare systems, scorecards, and process to hire first key teammate.',
        category: 'business',
        lifeDomain: 'career' as const,
        goalType: 'project' as const,
        estimatedWeeks: 6,
        difficultyLevel: 6,
        milestones: [
          { title: 'Define role outcomes', weekNumber: 1 },
          { title: 'Create hiring scorecard', weekNumber: 2 },
          { title: 'Set interview workflow', weekNumber: 4 },
          { title: 'Run final candidate loop', weekNumber: 6 },
        ],
      },
    ];

    let created = 0;
    for (const t of seedTemplates) {
      const duplicate = existing.find((e) => e.title === t.title);
      if (duplicate) continue;
      await ctx.db.insert('goalTemplates', {
        ...t,
        suggestedHabits: [
          { title: 'Daily strategic planning', frequency: 'daily', estimatedMinutes: 20 },
          { title: 'Weekly review and planning', frequency: 'weekly', estimatedMinutes: 45 },
        ],
        icon: 'BR',
        color: '#F59E0B',
        isPublic: true,
        usageCount: 0,
        createdAt: Date.now(),
      });
      created += 1;
    }

    return { created };
  },
});
