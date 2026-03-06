// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Daily Plans Engine (Convex)
// Morning intentions, time blocking, evening reflections — Module 5
// ═══════════════════════════════════════════════════════════════════════════════

import { action, internalQuery, mutation, query } from './_generated/server';
import { internal } from './_generated/api';
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

const dailyPlanDoc = v.object({
  _id: v.id('dailyPlans'),
  _creationTime: v.number(),
  userId: v.id('users'),
  date: v.string(),
  intention: v.optional(v.string()),
  topPriorities: v.optional(v.array(v.string())),
  timeBlocks: v.optional(v.array(v.object({
    id: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    title: v.string(),
    type: v.union(
      v.literal('deep_work'),
      v.literal('shallow_work'),
      v.literal('meeting'),
      v.literal('break'),
      v.literal('personal'),
      v.literal('exercise'),
      v.literal('routine')
    ),
    taskId: v.optional(v.id('tasks')),
    completed: v.optional(v.boolean()),
  }))),
  dailyScore: v.optional(v.number()),
  tasksCompletedCount: v.optional(v.number()),
  tasksTotalCount: v.optional(v.number()),
  habitsCompletedCount: v.optional(v.number()),
  habitsTotalCount: v.optional(v.number()),
  focusMinutes: v.optional(v.number()),
  reflection: v.optional(v.string()),
  gratitude: v.optional(v.array(v.string())),
  tomorrowPlan: v.optional(v.string()),
  dayRating: v.optional(v.number()),
  morningCompletedAt: v.optional(v.number()),
  eveningCompletedAt: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

// ─────────────────────────────────────────────────────────────────────────────
// GET OR CREATE TODAY'S PLAN
// ─────────────────────────────────────────────────────────────────────────────
export const getOrCreateToday = mutation({
  args: { date: v.string() },
  returns: dailyPlanDoc,
  handler: async (ctx, { date }) => {
    const user = await getAuthUser(ctx);

    const existing = await ctx.db
      .query('dailyPlans')
      .withIndex('by_userId_date', (q: any) =>
        q.eq('userId', user._id).eq('date', date)
      )
      .unique();

    if (existing) return existing;

    const id = await ctx.db.insert('dailyPlans', {
      userId: user._id,
      date,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const created = await ctx.db.get(id);
    return created!;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET PLAN BY DATE
// ─────────────────────────────────────────────────────────────────────────────
export const getByDate = query({
  args: { date: v.string() },
  returns: v.union(dailyPlanDoc, v.null()),
  handler: async (ctx, { date }) => {
    const user = await getAuthUser(ctx);

    return await ctx.db
      .query('dailyPlans')
      .withIndex('by_userId_date', (q: any) =>
        q.eq('userId', user._id).eq('date', date)
      )
      .unique();
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// SET MORNING INTENTION
// ─────────────────────────────────────────────────────────────────────────────
export const setMorningIntention = mutation({
  args: {
    planId: v.id('dailyPlans'),
    intention: v.string(),
    topPriorities: v.optional(v.array(v.string())),
  },
  returns: v.null(),
  handler: async (ctx, { planId, intention, topPriorities }) => {
    const user = await getAuthUser(ctx);
    const plan = await ctx.db.get(planId);
    if (!plan || plan.userId !== user._id) throw new Error('Plan not found');

    await ctx.db.patch(planId, {
      intention,
      topPriorities,
      morningCompletedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE TIME BLOCKS
// ─────────────────────────────────────────────────────────────────────────────
export const updateTimeBlocks = mutation({
  args: {
    planId: v.id('dailyPlans'),
    timeBlocks: v.array(v.object({
      id: v.string(),
      startTime: v.string(),
      endTime: v.string(),
      title: v.string(),
      type: v.union(
        v.literal('deep_work'),
        v.literal('shallow_work'),
        v.literal('meeting'),
        v.literal('break'),
        v.literal('personal'),
        v.literal('exercise'),
        v.literal('routine')
      ),
      taskId: v.optional(v.id('tasks')),
      completed: v.optional(v.boolean()),
    })),
  },
  returns: v.null(),
  handler: async (ctx, { planId, timeBlocks }) => {
    const user = await getAuthUser(ctx);
    const plan = await ctx.db.get(planId);
    if (!plan || plan.userId !== user._id) throw new Error('Plan not found');

    await ctx.db.patch(planId, {
      timeBlocks,
      updatedAt: Date.now(),
    });

    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// SET EVENING REFLECTION
// ─────────────────────────────────────────────────────────────────────────────
export const setEveningReflection = mutation({
  args: {
    planId: v.id('dailyPlans'),
    reflection: v.optional(v.string()),
    gratitude: v.optional(v.array(v.string())),
    tomorrowPlan: v.optional(v.string()),
    dayRating: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, { planId, ...fields }) => {
    const user = await getAuthUser(ctx);
    const plan = await ctx.db.get(planId);
    if (!plan || plan.userId !== user._id) throw new Error('Plan not found');

    await ctx.db.patch(planId, {
      ...fields,
      eveningCompletedAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Award XP for completing evening reflection
    const gamification = await ctx.db
      .query('gamification')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .unique();

    if (gamification) {
      const xpGain = 15;
      await ctx.db.patch(gamification._id, {
        totalXP: gamification.totalXP + xpGain,
        updatedAt: Date.now(),
      });

      await ctx.db.insert('xpHistory', {
        userId: user._id,
        amount: xpGain,
        source: 'other',
        description: 'Completed evening reflection',
        createdAt: Date.now(),
      });
    }

    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE DAILY SCORE
// ─────────────────────────────────────────────────────────────────────────────
export const updateDailyScore = mutation({
  args: {
    planId: v.id('dailyPlans'),
    dailyScore: v.number(),
    tasksCompletedCount: v.optional(v.number()),
    tasksTotalCount: v.optional(v.number()),
    habitsCompletedCount: v.optional(v.number()),
    habitsTotalCount: v.optional(v.number()),
    focusMinutes: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, { planId, ...scores }) => {
    const user = await getAuthUser(ctx);
    const plan = await ctx.db.get(planId);
    if (!plan || plan.userId !== user._id) throw new Error('Plan not found');

    await ctx.db.patch(planId, {
      ...scores,
      updatedAt: Date.now(),
    });

    // Check for Perfect Day achievement
    if (scores.dailyScore && scores.dailyScore >= 95) {
      const gamification = await ctx.db
        .query('gamification')
        .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
        .unique();

      if (gamification) {
        await ctx.db.patch(gamification._id, {
          totalXP: gamification.totalXP + 25,
          updatedAt: Date.now(),
        });

        await ctx.db.insert('xpHistory', {
          userId: user._id,
          amount: 25,
          source: 'perfect_day',
          description: 'Perfect Day! Score 95%+',
          createdAt: Date.now(),
        });
      }
    }

    return null;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// LIST RECENT PLANS
// ─────────────────────────────────────────────────────────────────────────────
export const listRecent = query({
  args: { days: v.optional(v.number()) },
  returns: v.array(dailyPlanDoc),
  handler: async (ctx, { days }) => {
    const user = await getAuthUser(ctx);

    const plans = await ctx.db
      .query('dailyPlans')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .order('desc')
      .collect();

    return days ? plans.slice(0, days) : plans;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// AI-POWERED DAILY PLAN GENERATION
// Uses multi-provider cascade: Groq 70B → Cerebras 70B → Gemini → Groq 8B
// ─────────────────────────────────────────────────────────────────────────────

export const generateAIPlan = action({
  args: {
    date: v.string(),
    wakeUpTime: v.optional(v.string()),
    sleepTime: v.optional(v.string()),
    energyLevel: v.optional(v.number()),
    focusPreference: v.optional(v.string()),
  },
  returns: v.object({
    intention: v.string(),
    topPriorities: v.array(v.string()),
    timeBlocks: v.array(v.object({
      id: v.string(),
      startTime: v.string(),
      endTime: v.string(),
      title: v.string(),
      type: v.string(),
    })),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    // Fetch user context: goals, tasks, habits, yesterday's plan
    const userCtx = await ctx.runQuery(internal.coachAI.getUserContext, {}).catch(() => null);

    // Fetch yesterday's reflection
    const yesterday = new Date(args.date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yesterdayPlan = await ctx.runQuery(internal.dailyPlans.getByDateInternal, {
      date: yesterdayStr,
    }).catch(() => null);

    const wakeUp = args.wakeUpTime || '07:00';
    const sleep = args.sleepTime || '23:00';
    const energy = args.energyLevel ?? 3;

    const energyDesc = energy <= 2 ? 'LOW energy — schedule gentle tasks, more breaks, keep high-demand work short'
      : energy >= 4 ? 'HIGH energy — front-load deep work, ambitious scheduling is fine'
      : 'MODERATE energy — balanced schedule with regular breaks';

    let contextInfo = '';
    if (userCtx) {
      contextInfo = `
USER PROFILE:
- Name: ${userCtx.userName}
- Plan: ${userCtx.userPlan}
- Primary Goal: ${userCtx.primaryGoal}
- Focus Areas: ${userCtx.focusAreas}
- Active Goals: ${userCtx.goalsSummary}
- Pending Tasks (${userCtx.taskCount}): ${userCtx.tasksSummary}
- Active Habits (${userCtx.habitCount}): ${userCtx.habitsSummary}
- Best Streak: ${userCtx.streak} days`;
    }

    if (yesterdayPlan) {
      const reflection = (yesterdayPlan as any).reflection;
      const rating = (yesterdayPlan as any).dayRating;
      const tomorrowPlan = (yesterdayPlan as any).tomorrowPlan;
      if (reflection || rating || tomorrowPlan) {
        contextInfo += `\n\nYESTERDAY'S REFLECTION:`;
        if (rating) contextInfo += `\n- Day Rating: ${rating}/5`;
        if (reflection) contextInfo += `\n- Reflection: ${reflection}`;
        if (tomorrowPlan) contextInfo += `\n- What they wanted to do today: ${tomorrowPlan}`;
      }
    }

    const prompt = `Generate a highly personalized daily plan for ${args.date}.

SCHEDULE PARAMETERS:
- Wake up: ${wakeUp}
- Sleep: ${sleep}
- Energy: ${energyDesc}
${args.focusPreference ? `- Focus preference: ${args.focusPreference}` : ''}
${contextInfo}

RULES:
1. Start with a morning routine block (15-30 min after wake up)
2. Schedule deep work during peak hours (usually morning for most people)
3. Include breaks every 90 minutes
4. Schedule habits at their preferred times
5. Include pending tasks prioritized by urgency
6. End with an evening wind-down routine
7. Be SPECIFIC — use real task names, real habit names, real goal context
8. Maximum 8-12 time blocks
9. Each block should have a clear, actionable title

Respond ONLY in this exact JSON format:
{
  "intention": "A powerful 1-sentence intention for the day based on their goals",
  "topPriorities": ["Priority 1", "Priority 2", "Priority 3"],
  "timeBlocks": [
    {"id": "1", "startTime": "07:00", "endTime": "07:30", "title": "Morning Routine: Hydrate + 5-min meditation", "type": "routine"},
    {"id": "2", "startTime": "07:30", "endTime": "09:30", "title": "Deep Work: [specific task]", "type": "deep_work"}
  ]
}

Valid types: deep_work, shallow_work, meeting, break, personal, exercise, routine`;

    const messages: Array<{ role: 'system' | 'user'; content: string }> = [
      { role: 'system', content: 'You are an expert daily planning AI. Generate personalized, realistic daily schedules. Output only valid JSON.' },
      { role: 'user', content: prompt },
    ];

    // Use the same cascade as coach AI
    const raw = await callAICascadeForDailyPlans(messages, { max_tokens: 1500, temperature: 0.6 });

    if (raw) {
      try {
        const jsonStr = raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr) as {
          intention?: string;
          topPriorities?: string[];
          timeBlocks?: Array<{ id?: string; startTime: string; endTime: string; title: string; type: string }>;
        };

        return {
          intention: parsed.intention || 'Make today count.',
          topPriorities: (parsed.topPriorities || ['Complete top task', 'Maintain habits', 'Rest well']).slice(0, 5),
          timeBlocks: (parsed.timeBlocks || []).map((b, i) => ({
            id: b.id || String(i + 1),
            startTime: b.startTime,
            endTime: b.endTime,
            title: b.title,
            type: b.type || 'shallow_work',
          })).slice(0, 12),
        };
      } catch {
        // JSON parse failed, return default
      }
    }

    // Fallback: generate a sensible default plan
    return {
      intention: 'Focus on what matters most. Progress over perfection.',
      topPriorities: ['Complete highest priority task', 'Maintain daily habits', 'Evening reflection'],
      timeBlocks: [
        { id: '1', startTime: wakeUp, endTime: addMinutes(wakeUp, 30), title: 'Morning Routine: Hydrate, stretch, review plan', type: 'routine' },
        { id: '2', startTime: addMinutes(wakeUp, 30), endTime: addMinutes(wakeUp, 150), title: 'Deep Work: Top priority task', type: 'deep_work' },
        { id: '3', startTime: addMinutes(wakeUp, 150), endTime: addMinutes(wakeUp, 165), title: 'Break: Walk + water', type: 'break' },
        { id: '4', startTime: addMinutes(wakeUp, 165), endTime: addMinutes(wakeUp, 285), title: 'Focused Work: Secondary tasks', type: 'shallow_work' },
        { id: '5', startTime: addMinutes(wakeUp, 285), endTime: addMinutes(wakeUp, 345), title: 'Lunch + Recharge', type: 'break' },
        { id: '6', startTime: addMinutes(wakeUp, 345), endTime: addMinutes(wakeUp, 465), title: 'Afternoon Work: Meetings & collaborative tasks', type: 'shallow_work' },
        { id: '7', startTime: addMinutes(wakeUp, 465), endTime: addMinutes(wakeUp, 525), title: 'Exercise / Movement', type: 'exercise' },
        { id: '8', startTime: addMinutes(wakeUp, 525), endTime: addMinutes(wakeUp, 555), title: 'Evening Wind-down: Reflect & plan tomorrow', type: 'routine' },
      ],
    };
  },
});

// Helper: add minutes to a time string
function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

// Multi-provider AI cascade (same as coachAI but defined here for action context)
interface DPCascadeOptions { max_tokens: number; temperature: number; }
async function callAICascadeForDailyPlans(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  opts: DPCascadeOptions
): Promise<string> {
  const providers = [
    { key: 'GROQ_API_KEY', url: 'https://api.groq.com/openai/v1/chat/completions', model: 'llama-3.3-70b-versatile' },
    { key: 'CEREBRAS_API_KEY', url: 'https://api.cerebras.ai/v1/chat/completions', model: 'llama-3.3-70b' },
    { key: 'GROQ_API_KEY', url: 'https://api.groq.com/openai/v1/chat/completions', model: 'llama-3.1-8b-instant' },
  ];

  for (const provider of providers) {
    const apiKey = process.env[provider.key];
    if (!apiKey) continue;
    try {
      const res = await fetch(provider.url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: provider.model, messages, max_tokens: opts.max_tokens, temperature: opts.temperature }),
      });
      if (res.ok) {
        const json = await res.json() as Record<string, any>;
        const content = json?.choices?.[0]?.message?.content ?? '';
        if (content) return content;
      }
    } catch {
      continue;
    }
  }

  // Gemini fallback
  const geminiKey = process.env.GOOGLE_AI_STUDIO_KEY;
  if (geminiKey) {
    try {
      const systemInstruction = messages.find(m => m.role === 'system')?.content || '';
      const geminiContents = messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: geminiContents,
            generationConfig: { maxOutputTokens: opts.max_tokens, temperature: opts.temperature },
          }),
        }
      );
      if (res.ok) {
        const json = await res.json() as Record<string, any>;
        return json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      }
    } catch { /* all failed */ }
  }

  return '';
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL: Get plan by date (for AI context)
// ─────────────────────────────────────────────────────────────────────────────

export const getByDateInternal = internalQuery({
  args: { date: v.string() },
  returns: v.union(dailyPlanDoc, v.null()),
  handler: async (ctx, { date }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) return null;

    return await ctx.db
      .query('dailyPlans')
      .withIndex('by_userId_date', (q: any) =>
        q.eq('userId', user._id).eq('date', date)
      )
      .unique();
  },
});
