import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const chatbotEventNameValidator = v.union(
  v.literal('intent_detected'),
  v.literal('cta_shown'),
  v.literal('cta_clicked'),
  v.literal('resolution_confirmed')
);

const userIntentValidator = v.union(
  v.literal('greeting'),
  v.literal('help_feature'),
  v.literal('troubleshooting'),
  v.literal('pricing_question'),
  v.literal('upgrade_interest'),
  v.literal('habit_advice'),
  v.literal('motivation_needed'),
  v.literal('feedback'),
  v.literal('cancel_subscription'),
  v.literal('unknown')
);

type ChatbotEventName =
  | 'intent_detected'
  | 'cta_shown'
  | 'cta_clicked'
  | 'resolution_confirmed';

type UserIntent =
  | 'greeting'
  | 'help_feature'
  | 'troubleshooting'
  | 'pricing_question'
  | 'upgrade_interest'
  | 'habit_advice'
  | 'motivation_needed'
  | 'feedback'
  | 'cancel_subscription'
  | 'unknown';

type EventCounters = {
  intent_detected: number;
  cta_shown: number;
  cta_clicked: number;
  resolution_confirmed: number;
};

function verifySyncSecret(providedSecret: string) {
  const expected = process.env.BILLING_WEBHOOK_SYNC_SECRET;
  if (!expected) {
    throw new Error('BILLING_WEBHOOK_SYNC_SECRET is not configured');
  }

  if (expected.length !== providedSecret.length) {
    throw new Error('Unauthorized chatbot analytics write');
  }

  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ providedSecret.charCodeAt(i);
  }

  if (mismatch !== 0) {
    throw new Error('Unauthorized chatbot analytics write');
  }
}

function summarizeEvents(
  events: Array<{
    eventName: ChatbotEventName;
    intent?: UserIntent;
  }>
) {
  const counters: EventCounters = {
    intent_detected: 0,
    cta_shown: 0,
    cta_clicked: 0,
    resolution_confirmed: 0,
  };

  const intentCounts: Record<string, number> = {};
  const resolvedIntentCounts: Record<string, number> = {};

  for (const event of events) {
    counters[event.eventName] += 1;

    if (event.intent && event.eventName === 'intent_detected') {
      intentCounts[event.intent] = (intentCounts[event.intent] ?? 0) + 1;
    }

    if (event.intent && event.eventName === 'resolution_confirmed') {
      resolvedIntentCounts[event.intent] = (resolvedIntentCounts[event.intent] ?? 0) + 1;
    }
  }

  const conversionAssistRate =
    counters.cta_shown > 0
      ? Math.round((counters.cta_clicked / counters.cta_shown) * 10000) / 100
      : 0;

  const topIntents = Object.entries(intentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([intent, count]) => ({ intent, count }));

  const unresolvedIntents = Object.entries(intentCounts)
    .map(([intent, count]) => ({
      intent,
      count: Math.max(0, count - (resolvedIntentCounts[intent] ?? 0)),
    }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    counters,
    conversionAssistRate,
    unresolvedIntentCount: Math.max(0, counters.intent_detected - counters.resolution_confirmed),
    topIntents,
    unresolvedIntents,
  };
}

export const logChatbotEvent = mutation({
  args: {
    clerkId: v.string(),
    eventName: chatbotEventNameValidator,
    intent: v.optional(userIntentValidator),
    source: v.union(v.literal('api'), v.literal('client'), v.literal('system')),
    conversationId: v.optional(v.string()),
    messageLength: v.optional(v.number()),
    cta: v.optional(v.object({
      label: v.string(),
      href: v.string(),
    })),
    details: v.optional(v.any()),
    syncSecret: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    verifySyncSecret(args.syncSecret);

    await ctx.db.insert('chatbotEvents', {
      clerkId: args.clerkId,
      eventName: args.eventName,
      intent: args.intent,
      source: args.source,
      conversationId: args.conversationId,
      messageLength: args.messageLength,
      cta: args.cta,
      details: args.details,
      createdAt: Date.now(),
    });

    return null;
  },
});

export const scheduleResolutionFollowUps = mutation({
  args: {
    syncSecret: v.string(),
    clerkId: v.string(),
    intent: v.union(v.literal('troubleshooting'), v.literal('motivation_needed')),
    conversationId: v.optional(v.string()),
  },
  returns: v.object({
    scheduledCount: v.number(),
  }),
  handler: async (ctx, args) => {
    verifySyncSecret(args.syncSecret);

    const now = Date.now();
    const followUpOffsets = [24, 72];

    for (const hours of followUpOffsets) {
      const dueAt = now + hours * 60 * 60 * 1000;
      await ctx.db.insert('chatbotFollowUps', {
        clerkId: args.clerkId,
        intent: args.intent,
        reason: hours === 24 ? 'checkback_24h' : 'checkback_72h',
        status: 'pending',
        conversationId: args.conversationId,
        dueAt,
        createdAt: now,
      });
    }

    return { scheduledCount: 2 };
  },
});

export const getDueFollowUps = query({
  args: {
    syncSecret: v.string(),
    clerkId: v.string(),
    now: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.object({
    _id: v.id('chatbotFollowUps'),
    _creationTime: v.number(),
    clerkId: v.string(),
    intent: v.union(v.literal('troubleshooting'), v.literal('motivation_needed')),
    reason: v.union(v.literal('checkback_24h'), v.literal('checkback_72h')),
    status: v.union(v.literal('pending'), v.literal('sent'), v.literal('dismissed')),
    conversationId: v.optional(v.string()),
    dueAt: v.number(),
    sentAt: v.optional(v.number()),
    createdAt: v.number(),
  })),
  handler: async (ctx, args) => {
    verifySyncSecret(args.syncSecret);

    const queryNow = args.now ?? Date.now();
    const maxItems = Math.min(Math.max(args.limit ?? 3, 1), 10);

    const due = await ctx.db
      .query('chatbotFollowUps')
      .withIndex('by_clerkId_and_dueAt', (q) =>
        q.eq('clerkId', args.clerkId).lte('dueAt', queryNow)
      )
      .order('desc')
      .take(20);

    return due
      .filter((item) => item.status === 'pending')
      .slice(0, maxItems);
  },
});

export const markFollowUpsSent = mutation({
  args: {
    syncSecret: v.string(),
    followUpIds: v.array(v.id('chatbotFollowUps')),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    verifySyncSecret(args.syncSecret);

    const now = Date.now();
    for (const followUpId of args.followUpIds) {
      const row = await ctx.db.get(followUpId);
      if (!row) continue;
      if (row.status !== 'pending') continue;

      await ctx.db.patch(followUpId, {
        status: 'sent',
        sentAt: now,
      });
    }

    return null;
  },
});

export const getMyChatbotEventCounters = query({
  args: {
    days: v.optional(v.number()),
  },
  returns: v.object({
    counters: v.object({
      intent_detected: v.number(),
      cta_shown: v.number(),
      cta_clicked: v.number(),
      resolution_confirmed: v.number(),
    }),
    conversionAssistRate: v.number(),
    unresolvedIntentCount: v.number(),
    topIntents: v.array(v.object({
      intent: v.string(),
      count: v.number(),
    })),
    unresolvedIntents: v.array(v.object({
      intent: v.string(),
      count: v.number(),
    })),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return summarizeEvents([]);
    }

    const windowDays = Math.min(Math.max(args.days ?? 30, 1), 365);
    const since = Date.now() - windowDays * 24 * 60 * 60 * 1000;

    const events = await ctx.db
      .query('chatbotEvents')
      .withIndex('by_clerkId_and_createdAt', (q) =>
        q.eq('clerkId', identity.subject).gte('createdAt', since)
      )
      .collect();

    return summarizeEvents(events);
  },
});

export const getChatbotEventCounters = query({
  args: {
    syncSecret: v.string(),
    clerkId: v.optional(v.string()),
    days: v.optional(v.number()),
  },
  returns: v.object({
    counters: v.object({
      intent_detected: v.number(),
      cta_shown: v.number(),
      cta_clicked: v.number(),
      resolution_confirmed: v.number(),
    }),
    conversionAssistRate: v.number(),
    unresolvedIntentCount: v.number(),
    topIntents: v.array(v.object({
      intent: v.string(),
      count: v.number(),
    })),
    unresolvedIntents: v.array(v.object({
      intent: v.string(),
      count: v.number(),
    })),
  }),
  handler: async (ctx, args) => {
    verifySyncSecret(args.syncSecret);

    const windowDays = Math.min(Math.max(args.days ?? 30, 1), 365);
    const since = Date.now() - windowDays * 24 * 60 * 60 * 1000;

    const events = args.clerkId
      ? await ctx.db
          .query('chatbotEvents')
          .withIndex('by_clerkId_and_createdAt', (q) =>
            q.eq('clerkId', args.clerkId as string).gte('createdAt', since)
          )
          .collect()
      : await ctx.db
          .query('chatbotEvents')
          .withIndex('by_createdAt', (q) => q.gte('createdAt', since))
          .collect();

    return summarizeEvents(events);
  },
});
