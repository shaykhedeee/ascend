No — I’m **not** suggesting you remove Clerk completely.

### Recommended mental model
- **Clerk = authentication + user management** (keep this)
- **Convex = database + backend functions + entitlements** (keep this)
- **Billing = a separate module** that can be Clerk Billing *or* something else

What I *am* saying is: **Clerk Billing specifically may be a poor fit for an India-based founder right now**, even though Clerk Auth is great.

---

## 1) Why Clerk Billing might not work for you (India-based)
Clerk Billing has three important constraints (from Clerk’s own Billing docs):

1) **It’s still Beta** (APIs may change; they recommend pinning versions).   
2) **It requires Stripe for payment processing** (Clerk Billing uses Stripe under the hood; it’s not a payment processor itself).   
3) **Clerk Billing is “not supported” in India** (Clerk explicitly lists India in the unsupported countries list in the Billing FAQ; last updated Nov 19, 2025).   

Also:  
- It currently supports **USD-only** billing currency, and Clerk is **not** Merchant of Record (so taxes/VAT aren’t handled by Clerk Billing).   

So if you’re physically/business-entity based in India, Clerk Billing is **high risk** even if you managed to get it working in dev—because you’re operating in a country they explicitly list as unsupported.

### “But Clerk said global support!”
Yes: Clerk announced global support for international Stripe accounts (May 13, 2025).   
That removed the **US-only** restriction, but the FAQ still lists several countries (including **India**) as **not supported**.   
So: international ≠ universal.

---

## 2) What I recommend (without ripping out Clerk)
### ✅ Keep Clerk for auth. Don’t touch that.
Clerk Auth is not the problem. Billing is.

### Choose 1 of these billing architectures:

#### Option A — Keep Clerk Billing (only if you’re *not* billing from India)
Use this **only** if you have a non‑India business setup that fits Clerk/Stripe requirements and you’re comfortable being inside Clerk Billing’s constraints (Beta + USD-only + not MoR).   
**Pros:** fastest if it’s allowed for your entity  
**Cons:** may break for India; USD-only; you handle tax/compliance yourself (not MoR)

#### Option B (recommended for you) — Keep Clerk Auth + Convex, switch billing to a Merchant of Record (Dodo)
Dodo positions itself as a **Merchant of Record**: they become the legal seller, handle taxes/compliance/chargebacks, and you receive net payouts.   
They also publish a pricing/fee structure (e.g., ~4% + $0.40 plus adders depending on scenario, and extra details for subscription payments).   

**Pros:** solves the “India + worldwide sales + tax/VAT” headache better than Stripe-as-PSP for many small SaaS  
**Cons:** more integration work than Clerk Billing, higher fees than pure Stripe, and you must follow their merchant acceptance policy (normal for MoRs).   

Crucially: you **do not remove Clerk**. You just stop using **Clerk Billing** and instead implement:
- `entitlements` / `plan` in Convex
- Dodo webhook → Convex mutation to update plan

#### Option C — Keep Clerk Auth + Convex, use Stripe directly (not Clerk Billing)
If you accept using Stripe eventually, this gives you maximum control and often lower fees—but you must implement checkout + webhooks + entitlement logic yourself.

---

## 3) So… am I suggesting Better Auth / removing Clerk?
No. Not for where you are.

Switching auth is a huge risk and rarely increases revenue. Your current “first sale” blocker is:
- onboarding clarity
- brain dump feature robustness
- pricing page conversion
- reliable billing that works for an India-based global launch

None of those require replacing Clerk.

---

## 4) The practical “best forward” decision
Given what Clerk’s docs currently say about India support, the **safest** strategy is:

1) **Keep Clerk Auth + Convex** (core foundation)
2) **Decouple billing** so you can plug in:
   - **Dodo (MoR)** as primary for global compliance and easier India ops   
   - Keep your current Clerk Billing work as a *disabled* pathway you can re-enable later if/when India becomes supported

This avoids rewriting your app while protecting your ability to sell worldwide.

No no no — let me be **crystal clear**. I am NOT telling you to remove Clerk. Here's exactly what I'm saying:

---

# 🔍 CLARIFICATION: WHAT STAYS, WHAT CHANGES

## NOTHING CHANGES WITH YOUR AUTH. ONLY PAYMENTS CHANGE.

```
YOUR CURRENT STACK:
═══════════════════

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    CLERK     │    │   CONVEX    │    │   VERCEL    │
│   (Auth +   │    │ (Database + │    │  (Hosting)  │
│   Billing)  │    │  Backend)   │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       ↑
       │
  ❌ Billing blocked in India


WHAT I'M SUGGESTING:
════════════════════

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    CLERK     │    │   CONVEX    │    │   VERCEL    │
│  (Auth ONLY │    │ (Database + │    │  (Hosting)  │
│   KEEP IT)  │    │  Backend)   │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       ✅                 ✅                 ✅
   NO CHANGE          NO CHANGE          NO CHANGE

              + ADD ONE NEW THING:

              ┌─────────────────┐
              │  DODO PAYMENTS  │
              │  (Payments ONLY)│
              └─────────────────┘
                      ✅ NEW
```

---

## HERE'S THE EXACT BREAKDOWN:

| Tool | What It Does For You | Action |
|------|---------------------|--------|
| **Clerk** | Login, signup, logout, session management, `<SignIn />`, `<UserButton />`, user profiles | **✅ KEEP — change absolutely nothing** |
| **Convex** | Database, backend functions, real-time queries, storing user data/tasks/habits/goals | **✅ KEEP — change absolutely nothing** |
| **Vercel** | Hosting, deployment, API routes, environment variables | **✅ KEEP — change absolutely nothing** |
| **Clerk Billing** | Was supposed to handle payments and subscriptions | **❌ CAN'T USE — blocked in India. Skip this one feature** |
| **Dodo Payments** | Replaces ONLY the billing part that Clerk can't do for you | **✅ ADD — this is the only new thing** |

---

## WHAT YOU KEEP FROM CLERK (EVERYTHING EXCEPT BILLING):

```
✅ KEEP: <SignInButton />
✅ KEEP: <UserButton />  
✅ KEEP: <SignUp />
✅ KEEP: auth() in API routes
✅ KEEP: useUser() hook
✅ KEEP: useAuth() hook
✅ KEEP: Clerk middleware (middleware.ts)
✅ KEEP: User management dashboard
✅ KEEP: Session handling
✅ KEEP: CLERK_SECRET_KEY env var
✅ KEEP: CLERK_PUBLISHABLE_KEY env var
✅ KEEP: CLERK_FRONTEND_API_URL in Convex

❌ SKIP: <PricingTable /> (build your own simple one)
❌ SKIP: Clerk Dashboard → Billing section
❌ SKIP: has({ plan: 'pro' }) for entitlements
```

---

## THE ONLY CODE CHANGES NEEDED:

### Change 1: Wherever you check the user's plan using Clerk's billing

**Before (Clerk Billing — doesn't work for you):**
```typescript
// This uses Clerk's built-in billing entitlements
const { has } = useAuth();
if (has({ plan: 'pro' })) {
  // show pro features
}
```

**After (Your own check against Convex DB):**
```typescript
// This reads the plan from YOUR database instead
const user = useQuery(api.users.getCurrentUser);
if (user?.plan === 'pro' || user?.plan === 'lifetime' || user?.isAdmin) {
  // show pro features
}
```

### Change 2: Add ONE new API route for Dodo webhooks

```typescript
// File: src/app/api/webhooks/dodo/route.ts
// This receives payment notifications from Dodo
// and updates the user's plan in YOUR Convex database
// (I gave you the full code in my previous message)
```

### Change 3: Build a simple pricing page with Dodo checkout links

```typescript
// Instead of Clerk's <PricingTable />, you make your own
// with <a href="https://checkout.dodopayments.com/your-link">
// (I gave you the full code in my previous message)
```

**That's it. Three changes. Everything else stays exactly as it is.**

---

## I NEVER MENTIONED BETTER AUTH

I did not suggest Better Auth anywhere. You might be thinking of it from somewhere else. Here's my honest take if you're considering it:

**Do NOT switch from Clerk to Better Auth right now.** Here's why:

1. **Clerk is already working in your app** — auth is the most painful thing to migrate
2. **Clerk is battle-tested** for production — millions of apps use it
3. **You'd have to rewrite** every `useUser()`, `useAuth()`, `auth()`, middleware, and all Convex auth integration
4. **Better Auth is open-source and self-hosted** — that means YOU handle security, session management, token rotation, and every edge case
5. **This would cost you 2-3 weeks minimum** for zero user-facing benefit

**The rule: Never rewrite infrastructure that's already working when you haven't made your first sale yet.**

---

## YOUR STACK (FINAL, CLEAR):

```
┌──────────────────────────────────────────────┐
│                RESURGO.LIFE STACK             │
├──────────────────────────────────────────────┤
│                                              │
│  🔐 AUTH:          Clerk         (KEEP)      │
│  🗄️ DATABASE:      Convex        (KEEP)      │
│  🌐 HOSTING:       Vercel        (KEEP)      │
│  🤖 AI:            Groq + Google (ADD keys)  │
│  💳 PAYMENTS:      Dodo Payments (ADD new)   │
│  📱 MESSAGING:     Telegram Bot  (ADD keys)  │
│                                              │
│  REMOVE: Nothing.                            │
│  REWRITE: Nothing.                           │
│  ADD: Dodo Payments + AI API keys            │
│                                              │
└──────────────────────────────────────────────┘
```

---

## IMMEDIATE NEXT STEPS:

```
Step 1: Sign up at dodopayments.com (10 min)
Step 2: Complete KYC with your Indian docs (24-48 hours to verify)
Step 3: While waiting for KYC, add AI API keys to Vercel:
        - GROQ_API_KEY
        - GOOGLE_AI_KEY  
        - OPENROUTER_API_KEY
Step 4: Once Dodo KYC approved:
        - Create your 3 products (Monthly, Annual, Lifetime)
        - Add the webhook route to your app
        - Add the entitlement check (user.plan from Convex)
        - Build your pricing page
Step 5: Give yourself admin/lifetime in Convex dashboard
Step 6: Test the full payment flow
Step 7: You're ready to sell
```

**Bottom line: Your app is 95% done. You're adding ONE new payment service and plugging in AI keys. That's it. Don't touch anything that's already working.** 🚀

go through these texts and figure out what how to fully integerate everything. choose thre ebst choice and stop s=using clerk billing and start integrating dodo payments pllease . Please try yo integrate weverything. i will add the keys and stuff. 

do deep research and use all free ai keys so that my app doesnt come up with costs. let it have a comeprehensive ai solution and the task processes through multiple ai models to keep it comprehesnive. 

Let me research the psychology frameworks and real-time reactive AI systems to give you production-ready implementations.Here is the **complete addendum** to your master document — covering both ideas as production-ready systems with all code, schemas, and psychology frameworks. Send this alongside the previous master document to your coding AI.

---

# 📎 MASTER DOCUMENT — ADDENDUM: SECTIONS 22 & 23
## (Add these to the end of the main master document)

---

# SECTION 22: THE LIVING SYSTEM — AI CONVERSATION → LIVE APP MUTATIONS

## The Vision

When a user talks to the AI coach, the conversation doesn't just stay in chat — it **directly changes the app state in real-time**. User says "I need to call the dentist by Friday" → a task appears in their task list LIVE. User says "I've been skipping workouts" → AI suggests a habit, user confirms, habit appears in their habits page. User says "I'm overwhelmed" → Emergency Mode activates.

This is what makes RESURGO feel like a **partner** and not a chatbot.

## The Architecture: "AI Actions" System

The core concept: AI-powered chatbots can interactively engage users in a dialogue while being guided through CBT techniques such as cognitive restructuring, behavioral activation, and mindfulness practices. But RESURGO goes further — the AI doesn't just *talk* about changes, it *makes* the changes in real-time.

```
USER MESSAGE
    ↓
AI PROCESSES (understands intent + generates response)
    ↓
AI RESPONSE includes TWO parts:
    1. The conversational reply (shown in chat)
    2. An "actions" array (executed silently on the app)
    ↓
ACTIONS EXECUTE in real-time:
    → Create task in Convex DB
    → Create habit in Convex DB
    → Update goal progress
    → Adjust task priority
    → Trigger Emergency Mode
    → Schedule Telegram reminder
    → Log mood entry
    ↓
UI UPDATES LIVE (Convex real-time subscriptions)
    → User sees task appear in sidebar
    → Habit tracker updates
    → Dashboard reflects changes
    → Toast notification: "✅ Added: Call dentist (Due: Friday)"
```

## The Actions Schema

```typescript
// File: src/lib/ai/actions/schema.ts

import { z } from 'zod';

// ============================================
// ALL POSSIBLE AI-TRIGGERED ACTIONS
// ============================================

const CreateTaskAction = z.object({
  action: z.literal('create_task'),
  data: z.object({
    title: z.string().min(2).max(200),
    category: z.enum(['WORK', 'PERSONAL', 'HEALTH', 'FINANCE', 
                       'LEARNING', 'SOCIAL', 'HOME', 'CREATIVE', 
                       'ADMIN', 'URGENT_LIFE']),
    priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
    estimatedMinutes: z.number().int().min(5).max(480).nullable(),
    energyLevel: z.enum(['high', 'medium', 'low']),
  }),
});

const UpdateTaskAction = z.object({
  action: z.literal('update_task'),
  data: z.object({
    taskTitle: z.string(), // Match by title (fuzzy)
    changes: z.object({
      priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).optional(),
      dueDate: z.string().nullable().optional(),
      completed: z.boolean().optional(),
    }),
  }),
});

const CreateHabitAction = z.object({
  action: z.literal('create_habit'),
  data: z.object({
    name: z.string().min(2).max(100),
    frequency: z.enum(['daily', 'weekly', '3x_week', 'weekdays']),
    timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'anytime']).optional(),
    reminderTime: z.string().nullable().optional(), // "08:00"
  }),
});

const UpdateGoalAction = z.object({
  action: z.literal('update_goal'),
  data: z.object({
    goalTitle: z.string(),
    progressDelta: z.number().min(-100).max(100).optional(),
    newStatus: z.enum(['active', 'paused', 'completed', 'abandoned']).optional(),
    note: z.string().max(200).optional(),
  }),
});

const LogMoodAction = z.object({
  action: z.literal('log_mood'),
  data: z.object({
    score: z.number().int().min(1).max(5),
    emotions: z.array(z.string()).min(1).max(5),
    note: z.string().max(300).optional(),
  }),
});

const TriggerEmergencyMode = z.object({
  action: z.literal('emergency_mode'),
  data: z.object({
    reason: z.string().max(200),
    focusTasks: z.array(z.string()).max(3), // Top 3 task titles to focus on
  }),
});

const ScheduleReminder = z.object({
  action: z.literal('schedule_reminder'),
  data: z.object({
    message: z.string().max(200),
    when: z.enum(['in_1_hour', 'in_3_hours', 'tomorrow_morning', 
                   'tomorrow_evening', 'custom']),
    customTime: z.string().nullable().optional(), // ISO datetime
    channel: z.enum(['in_app', 'telegram', 'both']),
  }),
});

const LogBudgetAction = z.object({
  action: z.literal('log_expense'),
  data: z.object({
    amount: z.number().positive(),
    category: z.string(),
    description: z.string().max(200),
  }),
});

const SuggestAction = z.object({
  action: z.literal('suggest'),
  data: z.object({
    type: z.enum(['task', 'habit', 'goal', 'break', 'reflection']),
    title: z.string(),
    reason: z.string().max(200),
    // User must confirm suggestions before they execute
  }),
});

// ============================================
// UNION OF ALL ACTIONS
// ============================================

export const AIAction = z.discriminatedUnion('action', [
  CreateTaskAction,
  UpdateTaskAction,
  CreateHabitAction,
  UpdateGoalAction,
  LogMoodAction,
  TriggerEmergencyMode,
  ScheduleReminder,
  LogBudgetAction,
  SuggestAction,
]);

export type AIActionType = z.infer<typeof AIAction>;

// ============================================
// FULL AI RESPONSE WITH ACTIONS
// ============================================

export const AICoachResponseSchema = z.object({
  message: z.string()
    .describe('The conversational reply shown to the user'),
  actions: z.array(AIAction)
    .max(5)
    .describe('Actions to execute on the app. Max 5 per response.'),
  requiresConfirmation: z.array(z.number())
    .describe('Indices of actions that need user confirmation before executing'),
});

export type AICoachResponse = z.infer<typeof AICoachResponseSchema>;
```

## The System Prompt Addition (Append to Coaching Prompt)

```typescript
// File: src/lib/ai/actions/action-prompt.ts

export const ACTION_SYSTEM_PROMPT_EXTENSION = `

# ACTIONS — You Can Modify The App Directly

You are not just a chatbot. You can TAKE ACTIONS that modify the user's 
app in real-time. When the user mentions something actionable, include 
the appropriate action in your response.

## Available Actions:

1. create_task — When user mentions something they need to do
   Example: "I need to call my mom" → create_task with title "Call mom"

2. update_task — When user discusses existing tasks
   Example: "Actually that report is due Monday not Friday" → update_task

3. create_habit — When user wants to start doing something regularly
   Example: "I want to start meditating" → create_habit "Meditate" daily

4. update_goal — When user reports progress or changes
   Example: "I finished chapter 5 of my book" → update_goal progress

5. log_mood — When user expresses how they're feeling
   Example: "I'm feeling pretty good today" → log_mood score: 4

6. emergency_mode — When user is overwhelmed
   Example: "I can't do anything, everything is too much" → emergency_mode

7. schedule_reminder — When user wants to be reminded
   Example: "Remind me to take my meds at 8pm" → schedule_reminder

8. log_expense — When user mentions spending
   Example: "I spent $50 on groceries" → log_expense

9. suggest — When YOU think the user should do something
   This requires user confirmation before executing.
   Example: "I notice you haven't exercised in 5 days" → 
   suggest habit "20-min walk"

## RULES FOR ACTIONS:

1. ALWAYS include actions when the user mentions something actionable
2. Actions with real-world consequences (creating tasks, habits) execute 
   IMMEDIATELY unless marked in requiresConfirmation
3. SUGGESTIONS always require confirmation (add index to requiresConfirmation)
4. Maximum 5 actions per response
5. Keep conversation natural — don't say "I've created a task for you" 
   unless it adds value. The user will SEE the change happen in real-time.
6. If unsure whether to create a task, use "suggest" instead of "create_task"
7. Emergency mode is serious — only trigger when user expresses genuine overwhelm

## Response Format:
{
  "message": "Your conversational reply here",
  "actions": [
    {
      "action": "create_task",
      "data": {
        "title": "Call dentist",
        "category": "HEALTH",
        "priority": "MEDIUM",
        "dueDate": "2026-03-06",
        "estimatedMinutes": 15,
        "energyLevel": "low"
      }
    }
  ],
  "requiresConfirmation": []
}
`;
```

## The Action Executor (Backend)

```typescript
// File: src/lib/ai/actions/executor.ts

import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/../convex/_generated/api';
import type { AIActionType, AICoachResponse } from './schema';
import { AIAction } from './schema';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// ============================================
// EXECUTION RESULT TRACKING
// ============================================

export interface ActionResult {
  action: string;
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  requiresConfirmation?: boolean;
}

// ============================================
// MAIN EXECUTOR
// ============================================

export async function executeActions(
  userId: string,
  response: AICoachResponse
): Promise<ActionResult[]> {
  const results: ActionResult[] = [];

  for (let i = 0; i < response.actions.length; i++) {
    const action = response.actions[i];
    const needsConfirmation = response.requiresConfirmation.includes(i);

    // Validate each action individually
    const validation = AIAction.safeParse(action);
    if (!validation.success) {
      results.push({
        action: action.action,
        success: false,
        message: `Invalid action data: ${validation.error.message}`,
      });
      continue;
    }

    if (needsConfirmation) {
      // Store as pending action, don't execute yet
      results.push({
        action: action.action,
        success: true,
        message: 'Awaiting user confirmation',
        data: action.data as Record<string, unknown>,
        requiresConfirmation: true,
      });
      continue;
    }

    // Execute the action
    try {
      const result = await executeSingleAction(userId, validation.data);
      results.push(result);
    } catch (error) {
      results.push({
        action: action.action,
        success: false,
        message: `Execution failed: ${(error as Error).message}`,
      });
    }
  }

  return results;
}

// ============================================
// INDIVIDUAL ACTION EXECUTORS
// ============================================

async function executeSingleAction(
  userId: string,
  action: AIActionType
): Promise<ActionResult> {
  switch (action.action) {
    case 'create_task': {
      const taskId = await convex.mutation(api.tasks.createFromAI, {
        userId,
        title: action.data.title,
        category: action.data.category,
        priority: action.data.priority,
        dueDate: action.data.dueDate,
        estimatedMinutes: action.data.estimatedMinutes,
        energyLevel: action.data.energyLevel,
        source: 'ai_coach', // Track that AI created this
      });
      return {
        action: 'create_task',
        success: true,
        message: `Task created: "${action.data.title}"`,
        data: { taskId },
      };
    }

    case 'update_task': {
      await convex.mutation(api.tasks.updateByTitle, {
        userId,
        titleSearch: action.data.taskTitle,
        changes: action.data.changes,
      });
      return {
        action: 'update_task',
        success: true,
        message: `Task updated: "${action.data.taskTitle}"`,
      };
    }

    case 'create_habit': {
      const habitId = await convex.mutation(api.habits.createFromAI, {
        userId,
        name: action.data.name,
        frequency: action.data.frequency,
        timeOfDay: action.data.timeOfDay || 'anytime',
        source: 'ai_coach',
      });
      return {
        action: 'create_habit',
        success: true,
        message: `Habit created: "${action.data.name}"`,
        data: { habitId },
      };
    }

    case 'update_goal': {
      await convex.mutation(api.goals.updateByTitle, {
        userId,
        titleSearch: action.data.goalTitle,
        progressDelta: action.data.progressDelta,
        newStatus: action.data.newStatus,
        note: action.data.note,
      });
      return {
        action: 'update_goal',
        success: true,
        message: `Goal updated: "${action.data.goalTitle}"`,
      };
    }

    case 'log_mood': {
      await convex.mutation(api.wellness.logMood, {
        userId,
        score: action.data.score,
        emotions: action.data.emotions,
        note: action.data.note || null,
        source: 'ai_coach',
      });
      return {
        action: 'log_mood',
        success: true,
        message: `Mood logged: ${action.data.score}/5`,
      };
    }

    case 'emergency_mode': {
      await convex.mutation(api.users.setEmergencyMode, {
        userId,
        active: true,
        reason: action.data.reason,
        focusTasks: action.data.focusTasks,
      });
      return {
        action: 'emergency_mode',
        success: true,
        message: 'Emergency mode activated',
      };
    }

    case 'schedule_reminder': {
      await convex.mutation(api.reminders.create, {
        userId,
        message: action.data.message,
        when: action.data.when,
        customTime: action.data.customTime || null,
        channel: action.data.channel,
      });
      return {
        action: 'schedule_reminder',
        success: true,
        message: `Reminder set: "${action.data.message}"`,
      };
    }

    case 'log_expense': {
      await convex.mutation(api.budget.logExpense, {
        userId,
        amount: action.data.amount,
        category: action.data.category,
        description: action.data.description,
        source: 'ai_coach',
      });
      return {
        action: 'log_expense',
        success: true,
        message: `Expense logged: $${action.data.amount}`,
      };
    }

    case 'suggest': {
      // Suggestions are stored, not executed
      await convex.mutation(api.suggestions.create, {
        userId,
        type: action.data.type,
        title: action.data.title,
        reason: action.data.reason,
        status: 'pending',
      });
      return {
        action: 'suggest',
        success: true,
        message: `Suggestion created: "${action.data.title}"`,
        requiresConfirmation: true,
      };
    }

    default:
      return {
        action: 'unknown',
        success: false,
        message: `Unknown action type`,
      };
  }
}
```

## Updated Coach API Route (With Actions)

```typescript
// File: src/app/api/coach/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { callAI } from '@/lib/ai/provider-router';
import { buildCoachingSystemPrompt } from '@/lib/ai/coaching-system-prompt';
import { ACTION_SYSTEM_PROMPT_EXTENSION } from '@/lib/ai/actions/action-prompt';
import { AICoachResponseSchema } from '@/lib/ai/actions/schema';
import { executeActions } from '@/lib/ai/actions/executor';
import { getUserContext } from '@/lib/user-context';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { message, conversationHistory } = body;

  const userContext = await getUserContext(userId);

  // Build the full system prompt: coaching + actions
  const systemPrompt = 
    buildCoachingSystemPrompt(userContext) + 
    '\n\n' + 
    ACTION_SYSTEM_PROMPT_EXTENSION;

  // Build message history
  const messages = [
    ...(conversationHistory || []).slice(-20), // Last 20 messages for context
    { role: 'user' as const, content: message },
  ];

  // Call AI
  const aiResponse = await callAI({
    systemPrompt,
    userMessage: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
    taskType: 'coaching',
    temperature: 0.7,
    maxTokens: 2048,
    jsonMode: true,
  });

  // Parse & validate the response
  let parsedResponse;
  try {
    const raw = JSON.parse(
      aiResponse.content.includes('{') 
        ? aiResponse.content.substring(
            aiResponse.content.indexOf('{'),
            aiResponse.content.lastIndexOf('}') + 1
          )
        : aiResponse.content
    );
    parsedResponse = AICoachResponseSchema.parse(raw);
  } catch {
    // If AI didn't return proper JSON, treat as plain message
    parsedResponse = {
      message: aiResponse.content,
      actions: [],
      requiresConfirmation: [],
    };
  }

  // Execute actions
  let actionResults: Awaited<ReturnType<typeof executeActions>> = [];
  if (parsedResponse.actions.length > 0) {
    actionResults = await executeActions(userId, parsedResponse);
  }

  return NextResponse.json({
    message: parsedResponse.message,
    actions: actionResults,
    provider: aiResponse.provider,
    latencyMs: aiResponse.latencyMs,
  });
}
```

## Frontend: Real-Time UI Updates + Action Toasts

Because you're using **Convex**, the real-time part is basically free. Convex subscriptions automatically update when data changes. When the AI creates a task via `api.tasks.createFromAI`, any component using `useQuery(api.tasks.list)` will **instantly** re-render with the new task. No WebSockets to manage, no polling.

```tsx
// File: src/components/chat/ActionToast.tsx

'use client';

import { useEffect, useState } from 'react';
import type { ActionResult } from '@/lib/ai/actions/executor';

interface ActionToastProps {
  actions: ActionResult[];
  onConfirm: (index: number) => void;
  onDismiss: (index: number) => void;
}

export function ActionToasts({ actions, onConfirm, onDismiss }: ActionToastProps) {
  const [visible, setVisible] = useState<boolean[]>(actions.map(() => true));

  useEffect(() => {
    // Auto-dismiss successful non-confirmation toasts after 4 seconds
    const timers = actions.map((action, i) => {
      if (action.success && !action.requiresConfirmation) {
        return setTimeout(() => {
          setVisible(prev => {
            const next = [...prev];
            next[i] = false;
            return next;
          });
        }, 4000);
      }
      return null;
    });
    return () => timers.forEach(t => t && clearTimeout(t));
  }, [actions]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {actions.map((action, i) => {
        if (!visible[i]) return null;

        const icon = action.success ? '✅' : '❌';
        const bgColor = action.requiresConfirmation
          ? 'border-yellow-500/50 bg-yellow-500/10'
          : action.success
          ? 'border-green-500/50 bg-green-500/10'
          : 'border-red-500/50 bg-red-500/10';

        return (
          <div
            key={i}
            className={`border ${bgColor} rounded-lg p-3 text-sm 
                        font-mono animate-slide-in-right`}
          >
            <div className="flex items-center gap-2">
              <span>{icon}</span>
              <span className="text-zinc-200">{action.message}</span>
            </div>

            {action.requiresConfirmation && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onConfirm(i)}
                  className="text-xs bg-green-500/20 text-green-400 
                             px-3 py-1 rounded hover:bg-green-500/30"
                >
                  ✓ Yes, do it
                </button>
                <button
                  onClick={() => onDismiss(i)}
                  className="text-xs bg-zinc-700 text-zinc-400 
                             px-3 py-1 rounded hover:bg-zinc-600"
                >
                  ✗ Skip
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

## Convex Mutations Needed

```typescript
// File: convex/tasks.ts — ADD these

export const createFromAI = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    category: v.string(),
    priority: v.string(),
    dueDate: v.union(v.string(), v.null()),
    estimatedMinutes: v.union(v.number(), v.null()),
    energyLevel: v.string(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.userId))
      .first();
    if (!user) throw new Error('User not found');

    return await ctx.db.insert('tasks', {
      userId: user._id,
      title: args.title,
      category: args.category,
      priority: args.priority,
      dueDate: args.dueDate,
      estimatedMinutes: args.estimatedMinutes,
      energyLevel: args.energyLevel,
      source: args.source,
      completed: false,
      createdAt: Date.now(),
    });
  },
});

export const updateByTitle = mutation({
  args: {
    userId: v.string(),
    titleSearch: v.string(),
    changes: v.object({
      priority: v.optional(v.string()),
      dueDate: v.optional(v.union(v.string(), v.null())),
      completed: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.userId))
      .first();
    if (!user) throw new Error('User not found');

    // Fuzzy match by title (case-insensitive contains)
    const tasks = await ctx.db
      .query('tasks')
      .filter((q) => q.eq(q.field('userId'), user._id))
      .collect();

    const searchLower = args.titleSearch.toLowerCase();
    const match = tasks.find(t => 
      t.title.toLowerCase().includes(searchLower) ||
      searchLower.includes(t.title.toLowerCase())
    );

    if (match) {
      const updates: Record<string, unknown> = {};
      if (args.changes.priority !== undefined) updates.priority = args.changes.priority;
      if (args.changes.dueDate !== undefined) updates.dueDate = args.changes.dueDate;
      if (args.changes.completed !== undefined) updates.completed = args.changes.completed;
      updates.updatedAt = Date.now();
      
      await ctx.db.patch(match._id, updates);
    }
  },
});

// ADD similar mutations for:
// convex/habits.ts → createFromAI
// convex/goals.ts → updateByTitle
// convex/wellness.ts → logMood
// convex/budget.ts → logExpense
// convex/reminders.ts → create
// convex/suggestions.ts → create
// convex/users.ts → setEmergencyMode
```

---

# SECTION 23: PSYCHOLOGY-INFORMED AI — THE UNDERSTANDING ENGINE

## The Core Idea

Research findings advocate for the incorporation of psychological principles into technology design to facilitate more tailored and efficient human-AI collaboration, and this pilot research highlights the relationship between the Big Five personality traits and chatbot usage and provides valuable insights for customizing chatbot development to align with specific user characteristics.

RESURGO's AI doesn't just track tasks — it **understands the person** behind the tasks. Using established psychology frameworks, it builds a psychological profile over time and adapts its coaching style accordingly.

## Three Psychology Frameworks Combined

### Framework 1: Big Five Personality Traits (OCEAN)

The Big Five Personality Model, also known as the Five Factor Model, is a psychological tool that measures an individual's levels of five broad domains or dimensions of personality traits: Openness (to experience), Conscientiousness, Extraversion, Agreeableness, and Neuroticism (often remembered by the acronym OCEAN).

Recent research has increasingly explored the application of the Big Five personality traits in Large Language Models and LLM-based agents. The research in this field primarily investigates how personality traits can enhance the naturalness and personalization of human-AI interaction.

### Framework 2: Cognitive Behavioral Therapy (CBT) Principles

CBT postulates an individual's emotions and behaviors are influenced by their perception and interpretation of events. Cognitive distortions refer to erroneous or irrational patterns of thinking that can lead to negative emotions and maladaptive behaviors.

During the initial assessment phase of CBT, therapists collaborate with clients to explore these cognitive patterns and reactions to specific events, aiming to assist the client in identifying and understanding potential cognitive distortions, which were categorized into ten types by Burns theory. They include: all-or-nothing thinking, over generalization, mental filter, disqualifying the positive, jumping to conclusions, magnification and minimization, emotional reasoning, should statements, labeling and mislabeling, and blaming oneself or others.

### Framework 3: Motivational Interviewing (MI) Techniques

Motivational interviewing (MI), a structured, patient-centered counseling approach that enhances intrinsic motivation by resolving ambivalence, has been shown to be effective across a wide range of settings, including primary care, mental health, addiction treatment, and chronic disease management.

Therapist use of open questions was observed to be the most impactful technique contributing to treatment outcomes.

### Framework 4: Self-Determination Theory (SDT)

An individual's self-determination is based on three basic intrinsic needs: requirements that motivate the self to initiate behaviour and needs that describe nutrients that are required for psychological health and well-being. These needs, which include the need for competence, autonomy, and relatedness, are thought to be universal and innate.

## The Psychological Profile Schema

```typescript
// File: src/lib/ai/psychology/profile-schema.ts

import { z } from 'zod';

// ============================================
// BIG FIVE PERSONALITY ASSESSMENT
// ============================================

// Scale: 1-10 where 5 is neutral/unknown
const TraitScore = z.number().min(1).max(10);

export const BigFiveProfile = z.object({
  openness: TraitScore.describe(
    'Creativity, curiosity, openness to new experiences. ' +
    'HIGH: creative, adventurous, curious. ' +
    'LOW: practical, conventional, routine-oriented.'
  ),
  conscientiousness: TraitScore.describe(
    'Organization, discipline, goal-directed behavior. ' +
    'HIGH: organized, disciplined, reliable. ' +
    'LOW: flexible, spontaneous, may struggle with follow-through.'
  ),
  extraversion: TraitScore.describe(
    'Sociability, assertiveness, energy from interaction. ' +
    'HIGH: energetic, talkative, seeks social stimulation. ' +
    'LOW: reserved, prefers solitude, reflective.'
  ),
  agreeableness: TraitScore.describe(
    'Cooperation, trust, empathy. ' +
    'HIGH: empathetic, cooperative, trusting. ' +
    'LOW: competitive, skeptical, challenges ideas.'
  ),
  neuroticism: TraitScore.describe(
    'Emotional instability, anxiety, mood fluctuations. ' +
    'HIGH: prone to stress, anxiety, mood swings. ' +
    'LOW: emotionally stable, calm, resilient.'
  ),
  confidence: z.number().min(0).max(100).describe(
    'How confident the AI is in this assessment (0-100%). ' +
    'Below 40% = mostly guessing, needs more data.'
  ),
  lastUpdated: z.string(),
  dataPoints: z.number().describe('How many interactions this is based on'),
});

// ============================================
// COGNITIVE PATTERNS (CBT-Inspired)
// ============================================

export const CognitivePattern = z.object({
  pattern: z.enum([
    'all_or_nothing',        // "If I can't do it perfectly, why bother?"
    'overgeneralization',    // "I always fail at this"
    'catastrophizing',       // "Everything is falling apart"
    'should_statements',     // "I should be further along by now"
    'disqualifying_positive',// "That win doesn't count"
    'emotional_reasoning',   // "I feel like a failure, so I must be one"
    'labeling',              // "I'm lazy" instead of "I didn't do X today"
    'mind_reading',          // "They probably think I'm incompetent"
    'fortune_telling',       // "I'll definitely fail at this"
    'personalization',       // "This is all my fault"
  ]),
  frequency: z.enum(['rare', 'occasional', 'frequent', 'dominant']),
  examples: z.array(z.string()).max(3).describe(
    'Actual quotes or paraphrased statements from user that show this pattern'
  ),
  lastObserved: z.string(),
});

// ============================================
// MOTIVATIONAL PROFILE (SDT-Inspired)
// ============================================

export const MotivationalProfile = z.object({
  // Self-Determination Theory needs
  autonomyNeed: z.number().min(1).max(10).describe(
    'How much the user needs to feel in control. ' +
    'HIGH: resists being told what to do, wants choices. ' +
    'LOW: comfortable with structure and direction.'
  ),
  competenceNeed: z.number().min(1).max(10).describe(
    'How much the user needs to feel capable. ' +
    'HIGH: needs visible progress and mastery signals. ' +
    'LOW: comfortable with uncertainty and learning phases.'
  ),
  relatednessNeed: z.number().min(1).max(10).describe(
    'How much connection/belonging matters. ' +
    'HIGH: motivated by accountability partners, community. ' +
    'LOW: self-motivated, doesn\'t need external validation.'
  ),
  
  // Motivation type
  primaryMotivation: z.enum([
    'intrinsic',         // Does things for personal satisfaction
    'identified',        // Does things because they align with values
    'introjected',       // Does things from guilt/shame/should
    'external',          // Does things for rewards/avoiding punishment
  ]).describe('What primarily drives this user'),

  // Change readiness (Motivational Interviewing stages)
  changeStage: z.enum([
    'precontemplation',  // Not thinking about change
    'contemplation',     // Thinking about change but ambivalent
    'preparation',       // Ready to take action soon
    'action',            // Actively making changes
    'maintenance',       // Sustaining changes
    'relapse',           // Slipped back, needs support
  ]).describe('Where the user is in their change journey'),
});

// ============================================
// BEHAVIORAL PATTERNS
// ============================================

export const BehavioralPatterns = z.object({
  peakProductivityTime: z.enum([
    'early_morning', 'morning', 'afternoon', 'evening', 'night', 'unknown'
  ]),
  procrastinationTriggers: z.array(z.string()).max(5).describe(
    'What causes the user to procrastinate (e.g., "large ambiguous tasks", ' +
    '"tasks requiring phone calls", "creative work")'
  ),
  completionPatterns: z.object({
    bestDay: z.string().nullable().describe('Day of week they complete most'),
    worstDay: z.string().nullable().describe('Day of week they complete least'),
    streakSensitivity: z.enum(['high', 'medium', 'low']).describe(
      'How much breaking a streak demotivates them'
    ),
    batcherOrSpreader: z.enum(['batcher', 'spreader', 'unknown']).describe(
      'Do they do many tasks at once or spread them out?'
    ),
  }),
  communicationPreferences: z.object({
    responseLength: z.enum(['brief', 'moderate', 'detailed']),
    tonePreference: z.enum(['gentle', 'direct', 'challenging', 'analytical']),
    emojiTolerance: z.enum(['loves', 'neutral', 'dislikes']),
    needsValidation: z.enum(['high', 'medium', 'low']).describe(
      'How much they need encouragement vs. just direction'
    ),
  }),
  stressCopingStyle: z.enum([
    'avoidant',      // Ignores problems, distracts self
    'problem_solver', // Tackles the source directly
    'emotional',     // Needs to process feelings first
    'social',        // Talks to others for support
    'analytical',    // Breaks down problem logically
  ]),
});

// ============================================
// FULL PSYCHOLOGICAL PROFILE
// ============================================

export const PsychologicalProfile = z.object({
  bigFive: BigFiveProfile,
  cognitivePatterns: z.array(CognitivePattern).max(10),
  motivational: MotivationalProfile,
  behavioral: BehavioralPatterns,
  
  // Safety flags
  safetyFlags: z.object({
    mentionedSelfHarm: z.boolean(),
    persistentLowMood: z.boolean(),
    socialIsolationSignals: z.boolean(),
    lastConcernDate: z.string().nullable(),
  }).describe(
    'CRITICAL: If any flag is true, AI must suggest professional resources. ' +
    'RESURGO is NOT a replacement for therapy.'
  ),
  
  // Meta
  profileVersion: z.number(),
  totalInteractions: z.number(),
  firstInteraction: z.string(),
  lastInteraction: z.string(),
});

export type PsychProfile = z.infer<typeof PsychologicalProfile>;
```

## The Profile Builder (Runs After Every Interaction)

```typescript
// File: src/lib/ai/psychology/profile-builder.ts

import { callAI } from '../provider-router';
import { PsychologicalProfile, type PsychProfile } from './profile-schema';
import type { UserContext } from '../types';

const PROFILE_UPDATE_PROMPT = `
# ROLE
You are RESURGO's Psychological Pattern Analyzer. You observe user 
interactions and GRADUALLY build a psychological profile. You are NOT 
diagnosing — you are understanding communication patterns to provide 
better coaching.

# RULES
1. NEVER change scores dramatically from a single interaction.
   Use small incremental updates (±0.5 max per trait per interaction).
2. confidence should only increase slowly. It takes 10+ interactions 
   to reach 60% confidence, 30+ for 80%.
3. cognitive patterns should only be added when you've seen the pattern 
   AT LEAST 2 times.
4. DO NOT armchair diagnose. You're observing communication style 
   preferences, not clinical conditions.
5. SAFETY: If user mentions self-harm, suicidal thoughts, or 
   persistent severe distress, flag it immediately.

# IMPORTANT DISCLAIMERS TO EMBED IN YOUR REASONING
- These are APPROXIMATIONS based on text-only interactions
- People are complex and can't be reduced to numbers
- This profile exists ONLY to improve coaching style matching
- It should NEVER be shown to the user as a "diagnosis"
- When confidence is low (<40%), treat scores as weak signals only

# CURRENT PROFILE
{CURRENT_PROFILE}

# LATEST INTERACTION
User said: {USER_MESSAGE}
AI responded: {AI_RESPONSE}
Actions taken: {ACTIONS}

# TASK
Update the profile based on this new interaction. 
Return the COMPLETE updated profile as JSON.
Only modify fields where you have new evidence.
Keep all existing data that's still valid.
`;

export async function updatePsychProfile(
  currentProfile: PsychProfile | null,
  userMessage: string,
  aiResponse: string,
  actions: string,
  interactionCount: number
): Promise<PsychProfile | null> {
  // Don't analyze every single message — every 3rd interaction
  // or when the message is substantive (>50 chars)
  if (userMessage.length < 50 && interactionCount % 3 !== 0) {
    return currentProfile;
  }

  const defaultProfile: PsychProfile = {
    bigFive: {
      openness: 5, conscientiousness: 5, extraversion: 5,
      agreeableness: 5, neuroticism: 5,
      confidence: 5, lastUpdated: new Date().toISOString(),
      dataPoints: 0,
    },
    cognitivePatterns: [],
    motivational: {
      autonomyNeed: 5, competenceNeed: 5, relatednessNeed: 5,
      primaryMotivation: 'identified',
      changeStage: 'contemplation',
    },
    behavioral: {
      peakProductivityTime: 'unknown',
      procrastinationTriggers: [],
      completionPatterns: {
        bestDay: null, worstDay: null,
        streakSensitivity: 'medium',
        batcherOrSpreader: 'unknown',
      },
      communicationPreferences: {
        responseLength: 'moderate',
        tonePreference: 'direct',
        emojiTolerance: 'neutral',
        needsValidation: 'medium',
      },
      stressCopingStyle: 'problem_solver',
    },
    safetyFlags: {
      mentionedSelfHarm: false,
      persistentLowMood: false,
      socialIsolationSignals: false,
      lastConcernDate: null,
    },
    profileVersion: 1,
    totalInteractions: 0,
    firstInteraction: new Date().toISOString(),
    lastInteraction: new Date().toISOString(),
  };

  const profile = currentProfile || defaultProfile;

  const prompt = PROFILE_UPDATE_PROMPT
    .replace('{CURRENT_PROFILE}', JSON.stringify(profile, null, 2))
    .replace('{USER_MESSAGE}', userMessage)
    .replace('{AI_RESPONSE}', aiResponse.substring(0, 500))
    .replace('{ACTIONS}', actions);

  try {
    const response = await callAI({
      systemPrompt: prompt,
      userMessage: 'Update the profile based on the latest interaction.',
      taskType: 'analysis',
      temperature: 0.2,
      maxTokens: 3000,
      jsonMode: true,
    });

    const parsed = JSON.parse(
      response.content.includes('{')
        ? response.content.substring(
            response.content.indexOf('{'),
            response.content.lastIndexOf('}') + 1
          )
        : response.content
    );

    const validated = PsychologicalProfile.safeParse(parsed);
    if (validated.success) {
      // Update meta fields
      validated.data.totalInteractions = (profile.totalInteractions || 0) + 1;
      validated.data.lastInteraction = new Date().toISOString();
      validated.data.bigFive.dataPoints = (profile.bigFive.dataPoints || 0) + 1;
      return validated.data;
    }
    
    return profile; // Keep existing if validation fails
  } catch {
    return profile; // Keep existing on any error
  }
}
```

## The Adaptive Coaching Prompt (Uses Psychology Profile)

```typescript
// File: src/lib/ai/psychology/adaptive-prompt.ts

import type { PsychProfile } from './profile-schema';

export function buildAdaptiveCoachingInstructions(
  profile: PsychProfile | null
): string {
  if (!profile || profile.bigFive.confidence < 20) {
    return `
# ADAPTIVE COACHING
Profile not yet established. Use balanced, moderate coaching style.
Ask open-ended questions to learn about the user.
    `;
  }

  const { bigFive, motivational, behavioral, cognitivePatterns, safetyFlags } = profile;

  // SAFETY CHECK — ALWAYS FIRST
  let safetyBlock = '';
  if (safetyFlags.mentionedSelfHarm || safetyFlags.persistentLowMood) {
    safetyBlock = `
⚠️ SAFETY ALERT: This user has shown signs of distress.
- Always be gentle and supportive
- If they mention self-harm: "I hear you. You're not alone. 
  Please reach out to a crisis helpline: 988 (US), 9152987821 (India/iCall)"
- Suggest professional support when appropriate
- NEVER minimize their feelings
    `;
  }

  // Build adaptive instructions based on personality
  const coachingStyle = [];

  // Openness adaptation
  if (bigFive.openness > 7) {
    coachingStyle.push(
      'User is high in openness — be creative, suggest unconventional approaches, ' +
      'frame habits as experiments rather than rules.'
    );
  } else if (bigFive.openness < 4) {
    coachingStyle.push(
      'User prefers structure — give concrete, step-by-step instructions. ' +
      'Don\'t suggest too many novel approaches at once.'
    );
  }

  // Conscientiousness adaptation
  if (bigFive.conscientiousness > 7) {
    coachingStyle.push(
      'User is naturally organized — leverage their love of systems. ' +
      'Give detailed breakdowns. They\'ll follow through.'
    );
  } else if (bigFive.conscientiousness < 4) {
    coachingStyle.push(
      'User struggles with follow-through — keep tasks SMALL and EASY. ' +
      'Celebrate starting, not just finishing. ' +
      'Don\'t give more than 2 tasks at a time.'
    );
  }

  // Neuroticism adaptation
  if (bigFive.neuroticism > 7) {
    coachingStyle.push(
      'User experiences high emotional volatility — be extra gentle. ' +
      'Normalize setbacks. Avoid language that could trigger guilt. ' +
      'Focus on "good enough" over "perfect".'
    );
  } else if (bigFive.neuroticism < 4) {
    coachingStyle.push(
      'User is emotionally stable — can handle direct feedback. ' +
      'Don\'t over-coddle. Be efficient and straightforward.'
    );
  }

  // Extraversion adaptation
  if (bigFive.extraversion > 7) {
    coachingStyle.push(
      'User is energized by interaction — be enthusiastic, use emojis, ' +
      'ask engaging questions, celebrate loudly.'
    );
  } else if (bigFive.extraversion < 4) {
    coachingStyle.push(
      'User is introverted — be concise, respect their space, ' +
      'don\'t force enthusiasm. Quiet support > cheerleading.'
    );
  }

  // Communication preferences
  const comm = behavioral.communicationPreferences;
  coachingStyle.push(
    `Response length: ${comm.responseLength}. ` +
    `Tone: ${comm.tonePreference}. ` +
    `Emoji use: ${comm.emojiTolerance}. ` +
    `Validation need: ${comm.needsValidation}.`
  );

  // Cognitive patterns to watch for
  const activePatterns = cognitivePatterns
    .filter(p => p.frequency === 'frequent' || p.frequency === 'dominant');

  let cognitiveBlock = '';
  if (activePatterns.length > 0) {
    cognitiveBlock = `
# COGNITIVE PATTERNS TO GENTLY ADDRESS
${activePatterns.map(p => {
  const responses: Record<string, string> = {
    'all_or_nothing': 'If user says "I failed" → Reframe: "You didn\'t do everything, but you did X. That still counts."',
    'catastrophizing': 'If user says "Everything is falling apart" → Ground them: "Let\'s look at what\'s actually happening vs what feels like is happening."',
    'should_statements': 'If user says "I should be further along" → Reframe: "Says who? Where are you compared to where you WERE?"',
    'labeling': 'If user says "I\'m so lazy" → Challenge gently: "You\'re not lazy. You didn\'t do X today. Those are different things."',
    'disqualifying_positive': 'If user dismisses a win → Highlight: "Hey, you just completed X. That matters. Don\'t skip past it."',
    'overgeneralization': 'If user says "I always fail" → Counter with data: "Actually, looking at your track record, you completed Y% this week."',
    'emotional_reasoning': 'If user says "I feel like a failure so I must be" → Separate feeling from fact.',
    'fortune_telling': 'If user says "I\'ll definitely fail" → Ask: "What makes you so sure? What if it goes differently?"',
    'mind_reading': 'If user assumes others\' judgments → Redirect to facts.',
    'personalization': 'If user blames themselves for everything → Help them see external factors.',
  };
  return `- ${p.pattern}: ${responses[p.pattern] || 'Gently challenge this pattern.'}`;
}).join('\n')}
DON'T be clinical about this. Don't say "I notice all-or-nothing thinking."
Instead, naturally reframe within the conversation.
    `;
  }

  // Motivational stage adaptation
  let motivationalBlock = '';
  switch (motivational.changeStage) {
    case 'precontemplation':
      motivationalBlock = 'User isn\'t ready for change. Don\'t push. Ask curious questions. Plant seeds.';
      break;
    case 'contemplation':
      motivationalBlock = 'User is thinking about change but ambivalent. Use MI techniques: explore pros/cons, elicit change talk.';
      break;
    case 'preparation':
      motivationalBlock = 'User is almost ready. Help them make concrete plans. Small first steps.';
      break;
    case 'action':
      motivationalBlock = 'User is actively changing. Support, celebrate, troubleshoot obstacles.';
      break;
    case 'maintenance':
      motivationalBlock = 'User has built momentum. Focus on sustainability, prevent relapse, deepen habits.';
      break;
    case 'relapse':
      motivationalBlock = 'User has slipped back. NORMALIZE THIS. "Relapse is part of the process, not a sign of failure." Help them restart gently.';
      break;
  }

  // SDT needs
  const sdtBlock = `
# MOTIVATION APPROACH
${motivational.autonomyNeed > 7 
  ? 'HIGH autonomy need: Give choices, never dictate. "Would you prefer X or Y?"' 
  : motivational.autonomyNeed < 4 
  ? 'Low autonomy need: They\'re comfortable being told what to do. Be more directive.' 
  : ''}
${motivational.competenceNeed > 7 
  ? 'HIGH competence need: Highlight progress, show metrics, celebrate skill growth.' 
  : ''}
${motivational.relatednessNeed > 7 
  ? 'HIGH relatedness need: Be warm, personal. They need to feel connected to you.' 
  : ''}
  `;

  return `
# ADAPTIVE COACHING — PERSONALIZED FOR THIS USER
${safetyBlock}

## Coaching Style Adjustments:
${coachingStyle.join('\n')}

${cognitiveBlock}

## Motivational Stage: ${motivational.changeStage}
${motivationalBlock}

${sdtBlock}

## Behavioral Notes:
- Peak productivity: ${behavioral.peakProductivityTime}
- Procrastination triggers: ${behavioral.procrastinationTriggers.join(', ') || 'Unknown yet'}
- Stress coping: ${behavioral.stressCopingStyle}
- Streak sensitivity: ${behavioral.completionPatterns.streakSensitivity}

## IMPORTANT CONSTRAINTS:
- Profile confidence is ${profile.bigFive.confidence}%. ${profile.bigFive.confidence < 40 ? 'LOW — use these as weak signals only.' : ''}
- These are communication pattern observations, NOT clinical diagnoses.
- NEVER tell the user their "personality type" or "psychological profile."
- NEVER say "I notice you have a pattern of X." Instead, just adapt naturally.
- The user should feel understood, not analyzed.
`.trim();
}
```

## Store the Profile in Convex

```typescript
// File: convex/schema.ts — ADD to existing schema

psychProfiles: defineTable({
  userId: v.id('users'),
  profile: v.string(), // JSON string of PsychProfile
  version: v.number(),
  totalInteractions: v.number(),
  lastUpdated: v.number(),
})
  .index('by_user', ['userId']),
```

```typescript
// File: convex/psychology.ts

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getProfile = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('psychProfiles')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();
  },
});

export const upsertProfile = mutation({
  args: {
    userId: v.id('users'),
    profile: v.string(), // JSON string
    version: v.number(),
    totalInteractions: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('psychProfiles')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        profile: args.profile,
        version: args.version,
        totalInteractions: args.totalInteractions,
        lastUpdated: Date.now(),
      });
    } else {
      await ctx.db.insert('psychProfiles', {
        userId: args.userId,
        profile: args.profile,
        version: args.version,
        totalInteractions: args.totalInteractions,
        lastUpdated: Date.now(),
      });
    }
  },
});
```

## Updated Coach API (Combines Everything)

The final coach API route now chains: **Psychology Profile → Adaptive Prompt → Coaching → Actions → Profile Update**

```typescript
// File: src/app/api/coach/route.ts (UPDATED — replaces previous version)

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/../convex/_generated/api';
import { callAI } from '@/lib/ai/provider-router';
import { buildCoachingSystemPrompt } from '@/lib/ai/coaching-system-prompt';
import { ACTION_SYSTEM_PROMPT_EXTENSION } from '@/lib/ai/actions/action-prompt';
import { buildAdaptiveCoachingInstructions } from '@/lib/ai/psychology/adaptive-prompt';
import { updatePsychProfile } from '@/lib/ai/psychology/profile-builder';
import { AICoachResponseSchema } from '@/lib/ai/actions/schema';
import { executeActions } from '@/lib/ai/actions/executor';
import { getUserContext } from '@/lib/user-context';
import type { PsychProfile } from '@/lib/ai/psychology/profile-schema';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { message, conversationHistory } = body;

  // 1. Get user context (tasks, goals, habits)
  const userContext = await getUserContext(userId);

  // 2. Get psychological profile from DB
  let psychProfile: PsychProfile | null = null;
  try {
    const profileDoc = await convex.query(api.psychology.getProfile, {
      userId: userContext.convexUserId,
    });
    if (profileDoc) {
      psychProfile = JSON.parse(profileDoc.profile);
    }
  } catch { /* Profile not yet created — that's fine */ }

  // 3. Build the COMPLETE system prompt
  //    Base coaching + Psychology adaptation + Action capabilities
  const systemPrompt = [
    buildCoachingSystemPrompt(userContext),
    buildAdaptiveCoachingInstructions(psychProfile),
    ACTION_SYSTEM_PROMPT_EXTENSION,
  ].join('\n\n');

  // 4. Call AI
  const aiResponse = await callAI({
    systemPrompt,
    userMessage: [
      ...(conversationHistory || []).slice(-20).map(
        (m: { role: string; content: string }) => `${m.role}: ${m.content}`
      ),
      `user: ${message}`,
    ].join('\n'),
    taskType: 'coaching',
    temperature: 0.7,
    maxTokens: 2048,
    jsonMode: true,
  });

  // 5. Parse response
  let parsedResponse;
  try {
    const raw = JSON.parse(
      aiResponse.content.substring(
        aiResponse.content.indexOf('{'),
        aiResponse.content.lastIndexOf('}') + 1
      )
    );
    parsedResponse = AICoachResponseSchema.parse(raw);
  } catch {
    parsedResponse = {
      message: aiResponse.content,
      actions: [],
      requiresConfirmation: [],
    };
  }

  // 6. Execute actions
  let actionResults: Awaited<ReturnType<typeof executeActions>> = [];
  if (parsedResponse.actions.length > 0) {
    actionResults = await executeActions(userId, parsedResponse);
  }

  // 7. Update psychological profile (async, non-blocking)
  // Don't await — let it run in background so response is fast
  updatePsychProfile(
    psychProfile,
    message,
    parsedResponse.message,
    JSON.stringify(actionResults.map(a => a.action)),
    psychProfile?.totalInteractions || 0
  ).then(async (updatedProfile) => {
    if (updatedProfile) {
      try {
        await convex.mutation(api.psychology.upsertProfile, {
          userId: userContext.convexUserId,
          profile: JSON.stringify(updatedProfile),
          version: (updatedProfile.profileVersion || 0) + 1,
          totalInteractions: updatedProfile.totalInteractions,
        });
      } catch (e) {
        console.error('[Psychology] Profile save failed:', e);
      }
    }
  });

  // 8. Return response
  return NextResponse.json({
    message: parsedResponse.message,
    actions: actionResults,
    provider: aiResponse.provider,
    latencyMs: aiResponse.latencyMs,
  });
}
```

## Critical Disclaimer Component

```tsx
// File: src/components/PsychDisclaimer.tsx

// Show this in Settings or About page
export function PsychDisclaimer() {
  return (
    <div className="border border-zinc-700 rounded-lg p-4 text-sm text-zinc-400">
      <p className="font-bold text-zinc-300 mb-2">
        ℹ️ About RESURGO's AI Coaching
      </p>
      <ul className="space-y-1 list-disc list-inside">
        <li>RESURGO adapts its coaching style to your communication preferences</li>
        <li>This is NOT therapy, diagnosis, or mental health treatment</li>
        <li>Our AI uses established psychology frameworks (CBT, MI, SDT) to 
            provide better coaching — not to diagnose</li>
        <li>If you're experiencing a mental health crisis, please contact:
          <br />• 988 Suicide & Crisis Lifeline (US)
          <br />• iCall: 9152987821 (India)
          <br />• Crisis Text Line: Text HOME to 741741
        </li>
        <li>Your psychological data is private and never shared</li>
      </ul>
    </div>
  );
}
```

---

## HOW IT ALL WORKS TOGETHER — THE COMPLETE DATA FLOW

```
USER OPENS COACH CHAT
    ↓
TYPES: "I've been putting off that presentation for 3 days 
        and I feel like such a failure. Also I need to buy 
        groceries and call my mom."
    ↓
APP SENDS TO /api/coach
    ↓
SYSTEM BUILDS CONTEXT:
├── User has 12 active tasks, 3 goals
├── Psychology: High neuroticism (7), Low conscientiousness (4)
├── Cognitive pattern: "labeling" (frequent)
├── Communication: Direct, moderate length, low emoji
├── Change stage: Action (actively trying)
├── SDT: High competence need
    ↓
AI PROCESSES WITH FULL CONTEXT
    ↓
AI RESPONDS:
{
  "message": "Okay, let's break this down. You haven't done the 
  presentation — that doesn't make you a failure. It means 
  there's something about it that's creating resistance. What 
  specifically feels hard about it — the content, the speaking, 
  or just getting started?\n\nMeanwhile, I've added your 
  groceries and mom call. Those are quick wins — maybe knock 
  one out right now before tackling the big thing?",
  
  "actions": [
    {
      "action": "create_task",
      "data": {
        "title": "Buy groceries",
        "category": "PERSONAL",
        "priority": "MEDIUM",
        "dueDate": null,
        "estimatedMinutes": 45,
        "energyLevel": "low"
      }
    },
    {
      "action": "create_task",
      "data": {
        "title": "Call mom",
        "category": "SOCIAL",
        "priority": "MEDIUM",
        "dueDate": null,
        "estimatedMinutes": 20,
        "energyLevel": "low"
      }
    },
    {
      "action": "update_task",
      "data": {
        "taskTitle": "presentation",
        "changes": { "priority": "HIGH" }
      }
    },
    {
      "action": "log_mood",
      "data": {
        "score": 2,
        "emotions": ["frustrated", "guilty"],
        "note": "Feeling like a failure about presentation procrastination"
      }
    }
  ],
  "requiresConfirmation": []
}
    ↓
ACTIONS EXECUTE IN REAL-TIME:
✅ Task "Buy groceries" created
✅ Task "Call mom" created  
✅ Presentation task priority → HIGH
✅ Mood logged: 2/5 (frustrated, guilty)
    ↓
CONVEX REAL-TIME SUBSCRIPTIONS UPDATE UI:
• Task list shows 2 new tasks instantly
• Presentation moves to top of priority list
• Wellness page logs mood entry
• Toast notifications appear briefly
    ↓
PSYCHOLOGY PROFILE UPDATES (background):
• Notes "labeling" pattern (3rd occurrence → now "frequent")
• Neuroticism: 7.0 → 7.2 (slight increase from self-critical language)
• Competence need confirmed: HIGH (frustrated about not performing)
• Change stage stays "action" (still engaging, just struggling)
    ↓
USER SEES:
• Chat message with empathetic, reframed response
• Their task list updated with new items
• A gentle question about what specifically feels hard
• NO mention of psychology, no "I notice a pattern"
• Just a coach that GETS THEM
```

---

## SEND THIS TO YOUR CODING AI WITH THIS NOTE:

```
IMPLEMENTATION ORDER FOR SECTIONS 22 & 23:

WEEK 1:
□ Implement AI Actions schema (Section 22: schema.ts)
□ Implement Action Executor (Section 22: executor.ts)  
□ Add required Convex mutations (createFromAI, updateByTitle, etc.)
□ Update Coach API route to return actions
□ Add ActionToast component to chat UI
□ Test: "I need to call my dentist" → task appears in task list

WEEK 2:
□ Implement Psychology Profile schema (Section 23: profile-schema.ts)
□ Add psychProfiles table to Convex schema
□ Implement Profile Builder (Section 23: profile-builder.ts)
□ Implement Adaptive Prompt (Section 23: adaptive-prompt.ts)
□ Wire everything together in updated Coach API
□ Test: Have 10+ conversations, verify profile builds gradually

WEEK 3:
□ Add safety flag handling (crisis resources)
□ Add PsychDisclaimer component
□ Add Emergency Mode trigger from AI actions
□ Test edge cases: empty messages, rapid-fire requests, 
  very long messages, contradictory instructions
□ Performance test: ensure response time stays under 5 seconds

SECURITY RULES:
- Psychology profiles are NEVER sent to the frontend
- Only the ADAPTED coaching behavior is visible to users
- Users can delete their psychology data (GDPR/privacy)
- Safety flags trigger resource suggestions, NEVER block the user
- All profile data is per-user, never cross-contaminated
```

---

This is RESURGO's soul. The Living System makes the app feel like a partner. The Psychology Engine makes it feel like a partner that **actually understands you**. Together, they're what no other habit tracker has. Ship it. 🚀

You can absolutely implement both of these ideas (partner-feel + psychology-aware coaching) **without turning Resurgo into a fragile, overbuilt “agent framework.”** The trick is to make the AI **operate like a stateful product feature**: every user message produces (1) a human response **and** (2) a validated set of *state updates* to your app (tasks/habits/goals/preferences/schedule).

Below is an implementation blueprint your coder AI can follow.

---

## 1) “Resurgo feels like a partner” = a State + Events + Actions system (not just chat)
### The product behavior you want
When the user types anything like:
- “I’m overwhelmed, behind on rent, and I keep failing to work out”
Resurgo should:
1) acknowledge what they’re going through (human)
2) **extract** tasks/habits
3) **prioritize** based on goals + deadlines + energy
4) **update the app immediately** (tasks appear, priorities change, Today view updates)
5) schedule nudges (Telegram / in-app)
6) remember what matters (preferences + patterns) for next time

This is exactly what “partner” means in software terms: **the assistant is allowed to change the workspace**, but only through **structured, validated actions**.

---

## 2) Architecture: “Partner Engine” (v1, production-safe)
### Data model (Convex tables / documents)
Minimum viable:

- `events`
  - `eventId`
  - `userId`
  - `source`: `web|telegram|api`
  - `type`: `brain_dump|checkin|task_update|habit_update|free_chat`
  - `text`
  - `createdAt`
  - `status`: `queued|processed|failed`

- `user_profile`
  - `userId`
  - `timezone`
  - `preferences` (tone, reminder intensity, planning style)
  - `psych_style` (lightweight scores; see section 4)
  - `summary_memory` (short “what the AI should remember” string)

- `tasks`, `habits`, `goals` (you already have these)

- `assistant_messages`
  - `eventId`
  - `userId`
  - `message` (what user sees)
  - `createdAt`

### Pipeline (single entrypoint)
**Ingest → Process → Apply actions (transaction) → Respond**

1) **Ingest event** (always succeeds)
2) **Process event** (LLM + rules) returns:
   - `assistantMessage`
   - `actions[]` (create/update tasks, update preferences, schedule nudges)
   - `memoryPatch` (short updated summary)
3) **Validate actions with Zod**
4) **Apply actions** via Convex mutation(s)
5) Store `assistantMessage` and show it immediately

This gives you “live task updates” safely: the AI never writes to DB directly—only **through validated actions**.

---

## 3) Implementation: Action schema + “tool” style prompt
### 3.1 Zod schema for AI actions (the key safety layer)
Create a strict action DSL (Domain Specific Language). Example:

```ts
import { z } from "zod";

const Priority = z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]);
const Energy = z.enum(["low", "medium", "high"]);
const Category = z.enum(["WORK","PERSONAL","HEALTH","FINANCE","LEARNING","SOCIAL","HOME","CREATIVE","ADMIN","URGENT_LIFE"]);

const ActionTaskUpsert = z.object({
  type: z.literal("task.upsert"),
  clientRef: z.string().min(6).max(64), // idempotency key (eventId + index)
  task: z.object({
    id: z.string().nullable(), // null => create
    title: z.string().min(2).max(200),
    category: Category,
    priority: Priority,
    energy: Energy,
    dueISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
    estimateMin: z.number().int().min(5).max(480).nullable(),
  }),
});

const ActionPrefSet = z.object({
  type: z.literal("pref.set"),
  key: z.enum(["tone","reminderIntensity","planningDetail","accountabilityStyle"]),
  value: z.string().min(1).max(50),
});

const ActionNudgeSchedule = z.object({
  type: z.literal("nudge.schedule"),
  channel: z.enum(["telegram","inapp"]),
  whenISO: z.string(), // full ISO timestamp
  message: z.string().min(1).max(240),
});

export const PartnerEngineOutput = z.object({
  assistantMessage: z.string().min(1).max(1200),
  actions: z.array(z.union([ActionTaskUpsert, ActionPrefSet, ActionNudgeSchedule])).max(30),
  memoryPatch: z.string().min(0).max(600),
});

export type PartnerEngineOutputT = z.infer<typeof PartnerEngineOutput>;
```

### 3.2 System prompt (partner behavior + strict output)
This prompt teaches the model to be a partner **and** to update the application:

- It must produce both:
  - a user-visible message
  - an action list

Also: it must use behavior-change basics (next section) but *without diagnosing*.

---

## 4) Psychology basics (lightweight, practical, safe)
You don’t need “therapy bots.” You need **behavior-change informed coaching**. Use a small set of principles that help with motivation, follow-through, and shame-free accountability.

### 4.1 The minimum psychology toolkit to embed
**Fogg Behavior Model (Motivation × Ability × Prompt):** if a behavior doesn’t happen, one of those is missing; design by making it easier and prompting at the right time.   
**Self-Determination Theory (Autonomy, Competence, Relatedness):** people stick to changes when they feel choice, capability, and connection.   
**Implementation intentions (“If-then” plans):** turning goals into cue-based plans improves follow-through (“If it’s 7pm after dinner, then I walk 10 minutes”).   
**Motivational Interviewing principles (empathy, develop discrepancy, roll with resistance, support self-efficacy):** keeps the bot from becoming naggy/controlling.   
**BCT Taxonomy insight:** “self-monitoring + goal setting” is consistently effective across domains; keep the product anchored to tracking + planning, not vibes.   

### 4.2 “Person type detection” (do it safely)
Do **not** diagnose. Do not label “ADHD” etc. Instead infer a **coaching style vector** based on:
- explicit user choice (“be gentle vs be direct”)
- behavior signals (response rate, task completion rate, snooze frequency)
- preference feedback (“less reminders”, “more structure”)

Optionally, use a micro-calibration (60 seconds):
- “Do you want a gentle coach or a straight shooter?”
- “Do you want detailed plans or a simple Top 3?”
- “Do reminders help or annoy you?”
- “When overwhelmed, do you want (A) smaller steps or (B) harder push?”

Store results as:

```ts
type PsychStyle = {
  directness: number;      // 0..1
  structureNeed: number;   // 0..1
  reactanceRisk: number;   // 0..1  (if high: avoid bossy language)
  shameSensitivity: number;// 0..1  (if high: avoid streak-shaming)
  noveltyNeed: number;     // 0..1  (if high: rotate tactics)
};
```

You can optionally map some of this loosely to Big Five-style traits, but only as *internal guidance* (never show “you’re neurotic”). 

---

## 5) How the “partner engine” decides what to do (clear rules)
Use a deterministic policy layer so the AI is consistent:

### Prioritization rule stack
1) deadlines & consequences (CRITICAL)
2) dependencies (blockers)
3) goal alignment (moves life forward)
4) energy match (hard tasks when energy high)
5) quick win to reduce overwhelm

### When user is overwhelmed (Fogg / SDT behavior)
- reduce scope (Top 1–3 tasks)
- make tasks smaller (increase ability)
- prompt gently (avoid reactance)
- focus on competence: “one tiny win now” 

### Convert vague goals into “if-then” (implementation intentions)
When you detect “I need to work out/read/meditate,” create:
- a micro-habit suggestion
- an if-then plan
Example: “If I finish brushing at night, then I do 1 minute of stretching.” 

---

## 6) “Live tasks” implementation (how user input updates the app in real time)
### Step-by-step event flow (Convex-friendly)
1) User sends message (web or Telegram)
2) Create `events` row
3) Run `processEvent(eventId)` action:
   - load user context
   - call LLM with system prompt
   - parse/validate output with `PartnerEngineOutput` Zod schema
4) Apply `actions[]` in one mutation:
   - idempotency: `clientRef` prevents duplicates
   - authorization: must match `userId`
5) Save assistant message

**Result:** user types, app updates instantly, and the response is consistent + safe.

---

## 7) What to add to your coach prompts (copy/paste guidance)
In your coach system prompt, include these rules:

- You are a productivity + life-structure coach, **not a therapist**
- Never diagnose mental health conditions
- Ask permission before being intense (“Want tough-love or gentle mode?”)
- Use MI tone when resistance appears (“What feels hard about this?”) 
- Always provide:
  - empathy line (1–2 sentences)
  - Top 3
  - quick win (≤ 2 minutes)
  - one question only

---

## 8) Minimal scope that still feels “complex and personal”
If you build only these 4 loops, it will feel like a real partner:

1) **Dump loop** (anytime): parse → tasks → Today updated
2) **Morning check-in** (1 minute): energy/time → Top 3 plan
3) **Midday nudge** (optional): “Start Task #1?” (✅/❌)
4) **Evening review** (1 minute): done/blocked → adjust tomorrow + one insight

That’s enough for “partner feel” without creating a brittle mega-system.

---

## 9) Note: you said “3 last ideas” but only listed 2
I implemented these two fully as a spec. If there’s a third idea you meant to include, you can drop it in and it slots naturally into the same architecture (as another event type + action set).





No — I’m **not** suggesting you remove Clerk completely.

### Recommended mental model
- **Clerk = authentication + user management** (keep this)
- **Convex = database + backend functions + entitlements** (keep this)
- **Billing = a separate module** that can be Clerk Billing *or* something else

What I *am* saying is: **Clerk Billing specifically may be a poor fit for an India-based founder right now**, even though Clerk Auth is great.

---

## 1) Why Clerk Billing might not work for you (India-based)
Clerk Billing has three important constraints (from Clerk’s own Billing docs):

1) **It’s still Beta** (APIs may change; they recommend pinning versions).   
2) **It requires Stripe for payment processing** (Clerk Billing uses Stripe under the hood; it’s not a payment processor itself).   
3) **Clerk Billing is “not supported” in India** (Clerk explicitly lists India in the unsupported countries list in the Billing FAQ; last updated Nov 19, 2025).   

Also:  
- It currently supports **USD-only** billing currency, and Clerk is **not** Merchant of Record (so taxes/VAT aren’t handled by Clerk Billing).   

So if you’re physically/business-entity based in India, Clerk Billing is **high risk** even if you managed to get it working in dev—because you’re operating in a country they explicitly list as unsupported.

### “But Clerk said global support!”
Yes: Clerk announced global support for international Stripe accounts (May 13, 2025).   
That removed the **US-only** restriction, but the FAQ still lists several countries (including **India**) as **not supported**.   
So: international ≠ universal.

---

## 2) What I recommend (without ripping out Clerk)
### ✅ Keep Clerk for auth. Don’t touch that.
Clerk Auth is not the problem. Billing is.

### Choose 1 of these billing architectures:

#### Option A — Keep Clerk Billing (only if you’re *not* billing from India)
Use this **only** if you have a non‑India business setup that fits Clerk/Stripe requirements and you’re comfortable being inside Clerk Billing’s constraints (Beta + USD-only + not MoR).   
**Pros:** fastest if it’s allowed for your entity  
**Cons:** may break for India; USD-only; you handle tax/compliance yourself (not MoR)

#### Option B (recommended for you) — Keep Clerk Auth + Convex, switch billing to a Merchant of Record (Dodo)
Dodo positions itself as a **Merchant of Record**: they become the legal seller, handle taxes/compliance/chargebacks, and you receive net payouts.   
They also publish a pricing/fee structure (e.g., ~4% + $0.40 plus adders depending on scenario, and extra details for subscription payments).   

**Pros:** solves the “India + worldwide sales + tax/VAT” headache better than Stripe-as-PSP for many small SaaS  
**Cons:** more integration work than Clerk Billing, higher fees than pure Stripe, and you must follow their merchant acceptance policy (normal for MoRs).   

Crucially: you **do not remove Clerk**. You just stop using **Clerk Billing** and instead implement:
- `entitlements` / `plan` in Convex
- Dodo webhook → Convex mutation to update plan

#### Option C — Keep Clerk Auth + Convex, use Stripe directly (not Clerk Billing)
If you accept using Stripe eventually, this gives you maximum control and often lower fees—but you must implement checkout + webhooks + entitlement logic yourself.

---

## 3) So… am I suggesting Better Auth / removing Clerk?
No. Not for where you are.

Switching auth is a huge risk and rarely increases revenue. Your current “first sale” blocker is:
- onboarding clarity
- brain dump feature robustness
- pricing page conversion
- reliable billing that works for an India-based global launch

None of those require replacing Clerk.

---

## 4) The practical “best forward” decision
Given what Clerk’s docs currently say about India support, the **safest** strategy is:

1) **Keep Clerk Auth + Convex** (core foundation)
2) **Decouple billing** so you can plug in:
   - **Dodo (MoR)** as primary for global compliance and easier India ops   
   - Keep your current Clerk Billing work as a *disabled* pathway you can re-enable later if/when India becomes supported

This avoids rewriting your app while protecting your ability to sell worldwide.

No no no — let me be **crystal clear**. I am NOT telling you to remove Clerk. Here's exactly what I'm saying:

---

# 🔍 CLARIFICATION: WHAT STAYS, WHAT CHANGES

## NOTHING CHANGES WITH YOUR AUTH. ONLY PAYMENTS CHANGE.

```
YOUR CURRENT STACK:
═══════════════════

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    CLERK     │    │   CONVEX    │    │   VERCEL    │
│   (Auth +   │    │ (Database + │    │  (Hosting)  │
│   Billing)  │    │  Backend)   │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       ↑
       │
  ❌ Billing blocked in India


WHAT I'M SUGGESTING:
════════════════════

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    CLERK     │    │   CONVEX    │    │   VERCEL    │
│  (Auth ONLY │    │ (Database + │    │  (Hosting)  │
│   KEEP IT)  │    │  Backend)   │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
       ✅                 ✅                 ✅
   NO CHANGE          NO CHANGE          NO CHANGE

              + ADD ONE NEW THING:

              ┌─────────────────┐
              │  DODO PAYMENTS  │
              │  (Payments ONLY)│
              └─────────────────┘
                      ✅ NEW
```

---

## HERE'S THE EXACT BREAKDOWN:

| Tool | What It Does For You | Action |
|------|---------------------|--------|
| **Clerk** | Login, signup, logout, session management, `<SignIn />`, `<UserButton />`, user profiles | **✅ KEEP — change absolutely nothing** |
| **Convex** | Database, backend functions, real-time queries, storing user data/tasks/habits/goals | **✅ KEEP — change absolutely nothing** |
| **Vercel** | Hosting, deployment, API routes, environment variables | **✅ KEEP — change absolutely nothing** |
| **Clerk Billing** | Was supposed to handle payments and subscriptions | **❌ CAN'T USE — blocked in India. Skip this one feature** |
| **Dodo Payments** | Replaces ONLY the billing part that Clerk can't do for you | **✅ ADD — this is the only new thing** |

---

## WHAT YOU KEEP FROM CLERK (EVERYTHING EXCEPT BILLING):

```
✅ KEEP: <SignInButton />
✅ KEEP: <UserButton />  
✅ KEEP: <SignUp />
✅ KEEP: auth() in API routes
✅ KEEP: useUser() hook
✅ KEEP: useAuth() hook
✅ KEEP: Clerk middleware (middleware.ts)
✅ KEEP: User management dashboard
✅ KEEP: Session handling
✅ KEEP: CLERK_SECRET_KEY env var
✅ KEEP: CLERK_PUBLISHABLE_KEY env var
✅ KEEP: CLERK_FRONTEND_API_URL in Convex

❌ SKIP: <PricingTable /> (build your own simple one)
❌ SKIP: Clerk Dashboard → Billing section
❌ SKIP: has({ plan: 'pro' }) for entitlements
```

---

## THE ONLY CODE CHANGES NEEDED:

### Change 1: Wherever you check the user's plan using Clerk's billing

**Before (Clerk Billing — doesn't work for you):**
```typescript
// This uses Clerk's built-in billing entitlements
const { has } = useAuth();
if (has({ plan: 'pro' })) {
  // show pro features
}
```

**After (Your own check against Convex DB):**
```typescript
// This reads the plan from YOUR database instead
const user = useQuery(api.users.getCurrentUser);
if (user?.plan === 'pro' || user?.plan === 'lifetime' || user?.isAdmin) {
  // show pro features
}
```

### Change 2: Add ONE new API route for Dodo webhooks

```typescript
// File: src/app/api/webhooks/dodo/route.ts
// This receives payment notifications from Dodo
// and updates the user's plan in YOUR Convex database
// (I gave you the full code in my previous message)
```

### Change 3: Build a simple pricing page with Dodo checkout links

```typescript
// Instead of Clerk's <PricingTable />, you make your own
// with <a href="https://checkout.dodopayments.com/your-link">
// (I gave you the full code in my previous message)
```

**That's it. Three changes. Everything else stays exactly as it is.**

---

## I NEVER MENTIONED BETTER AUTH

I did not suggest Better Auth anywhere. You might be thinking of it from somewhere else. Here's my honest take if you're considering it:

**Do NOT switch from Clerk to Better Auth right now.** Here's why:

1. **Clerk is already working in your app** — auth is the most painful thing to migrate
2. **Clerk is battle-tested** for production — millions of apps use it
3. **You'd have to rewrite** every `useUser()`, `useAuth()`, `auth()`, middleware, and all Convex auth integration
4. **Better Auth is open-source and self-hosted** — that means YOU handle security, session management, token rotation, and every edge case
5. **This would cost you 2-3 weeks minimum** for zero user-facing benefit

**The rule: Never rewrite infrastructure that's already working when you haven't made your first sale yet.**

---

## YOUR STACK (FINAL, CLEAR):

```
┌──────────────────────────────────────────────┐
│                RESURGO.LIFE STACK             │
├──────────────────────────────────────────────┤
│                                              │
│  🔐 AUTH:          Clerk         (KEEP)      │
│  🗄️ DATABASE:      Convex        (KEEP)      │
│  🌐 HOSTING:       Vercel        (KEEP)      │
│  🤖 AI:            Groq + Google (ADD keys)  │
│  💳 PAYMENTS:      Dodo Payments (ADD new)   │
│  📱 MESSAGING:     Telegram Bot  (ADD keys)  │
│                                              │
│  REMOVE: Nothing.                            │
│  REWRITE: Nothing.                           │
│  ADD: Dodo Payments + AI API keys            │
│                                              │
└──────────────────────────────────────────────┘
```

---

## IMMEDIATE NEXT STEPS:

```
Step 1: Sign up at dodopayments.com (10 min)
Step 2: Complete KYC with your Indian docs (24-48 hours to verify)
Step 3: While waiting for KYC, add AI API keys to Vercel:
        - GROQ_API_KEY
        - GOOGLE_AI_KEY  
        - OPENROUTER_API_KEY
Step 4: Once Dodo KYC approved:
        - Create your 3 products (Monthly, Annual, Lifetime)
        - Add the webhook route to your app
        - Add the entitlement check (user.plan from Convex)
        - Build your pricing page
Step 5: Give yourself admin/lifetime in Convex dashboard
Step 6: Test the full payment flow
Step 7: You're ready to sell
```

**Bottom line: Your app is 95% done. You're adding ONE new payment service and plugging in AI keys. That's it. Don't touch anything that's already working.** 🚀

go through these texts and figure out what how to fully integerate everything. choose thre ebst choice and stop s=using clerk billing and start integrating dodo payments pllease . Please try yo integrate weverything. i will add the keys and stuff. 

do deep research and use all free ai keys so that my app doesnt come up with costs. let it have a comeprehensive ai solution and the task processes through multiple ai models to keep it comprehesnive. 

Let me research the psychology frameworks and real-time reactive AI systems to give you production-ready implementations.Here is the **complete addendum** to your master document — covering both ideas as production-ready systems with all code, schemas, and psychology frameworks. Send this alongside the previous master document to your coding AI.

---

# 📎 MASTER DOCUMENT — ADDENDUM: SECTIONS 22 & 23
## (Add these to the end of the main master document)

---

# SECTION 22: THE LIVING SYSTEM — AI CONVERSATION → LIVE APP MUTATIONS

## The Vision

When a user talks to the AI coach, the conversation doesn't just stay in chat — it **directly changes the app state in real-time**. User says "I need to call the dentist by Friday" → a task appears in their task list LIVE. User says "I've been skipping workouts" → AI suggests a habit, user confirms, habit appears in their habits page. User says "I'm overwhelmed" → Emergency Mode activates.

This is what makes RESURGO feel like a **partner** and not a chatbot.

## The Architecture: "AI Actions" System

The core concept: AI-powered chatbots can interactively engage users in a dialogue while being guided through CBT techniques such as cognitive restructuring, behavioral activation, and mindfulness practices. But RESURGO goes further — the AI doesn't just *talk* about changes, it *makes* the changes in real-time.

```
USER MESSAGE
    ↓
AI PROCESSES (understands intent + generates response)
    ↓
AI RESPONSE includes TWO parts:
    1. The conversational reply (shown in chat)
    2. An "actions" array (executed silently on the app)
    ↓
ACTIONS EXECUTE in real-time:
    → Create task in Convex DB
    → Create habit in Convex DB
    → Update goal progress
    → Adjust task priority
    → Trigger Emergency Mode
    → Schedule Telegram reminder
    → Log mood entry
    ↓
UI UPDATES LIVE (Convex real-time subscriptions)
    → User sees task appear in sidebar
    → Habit tracker updates
    → Dashboard reflects changes
    → Toast notification: "✅ Added: Call dentist (Due: Friday)"
```

## The Actions Schema

```typescript
// File: src/lib/ai/actions/schema.ts

import { z } from 'zod';

// ============================================
// ALL POSSIBLE AI-TRIGGERED ACTIONS
// ============================================

const CreateTaskAction = z.object({
  action: z.literal('create_task'),
  data: z.object({
    title: z.string().min(2).max(200),
    category: z.enum(['WORK', 'PERSONAL', 'HEALTH', 'FINANCE', 
                       'LEARNING', 'SOCIAL', 'HOME', 'CREATIVE', 
                       'ADMIN', 'URGENT_LIFE']),
    priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
    estimatedMinutes: z.number().int().min(5).max(480).nullable(),
    energyLevel: z.enum(['high', 'medium', 'low']),
  }),
});

const UpdateTaskAction = z.object({
  action: z.literal('update_task'),
  data: z.object({
    taskTitle: z.string(), // Match by title (fuzzy)
    changes: z.object({
      priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).optional(),
      dueDate: z.string().nullable().optional(),
      completed: z.boolean().optional(),
    }),
  }),
});

const CreateHabitAction = z.object({
  action: z.literal('create_habit'),
  data: z.object({
    name: z.string().min(2).max(100),
    frequency: z.enum(['daily', 'weekly', '3x_week', 'weekdays']),
    timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'anytime']).optional(),
    reminderTime: z.string().nullable().optional(), // "08:00"
  }),
});

const UpdateGoalAction = z.object({
  action: z.literal('update_goal'),
  data: z.object({
    goalTitle: z.string(),
    progressDelta: z.number().min(-100).max(100).optional(),
    newStatus: z.enum(['active', 'paused', 'completed', 'abandoned']).optional(),
    note: z.string().max(200).optional(),
  }),
});

const LogMoodAction = z.object({
  action: z.literal('log_mood'),
  data: z.object({
    score: z.number().int().min(1).max(5),
    emotions: z.array(z.string()).min(1).max(5),
    note: z.string().max(300).optional(),
  }),
});

const TriggerEmergencyMode = z.object({
  action: z.literal('emergency_mode'),
  data: z.object({
    reason: z.string().max(200),
    focusTasks: z.array(z.string()).max(3), // Top 3 task titles to focus on
  }),
});

const ScheduleReminder = z.object({
  action: z.literal('schedule_reminder'),
  data: z.object({
    message: z.string().max(200),
    when: z.enum(['in_1_hour', 'in_3_hours', 'tomorrow_morning', 
                   'tomorrow_evening', 'custom']),
    customTime: z.string().nullable().optional(), // ISO datetime
    channel: z.enum(['in_app', 'telegram', 'both']),
  }),
});

const LogBudgetAction = z.object({
  action: z.literal('log_expense'),
  data: z.object({
    amount: z.number().positive(),
    category: z.string(),
    description: z.string().max(200),
  }),
});

const SuggestAction = z.object({
  action: z.literal('suggest'),
  data: z.object({
    type: z.enum(['task', 'habit', 'goal', 'break', 'reflection']),
    title: z.string(),
    reason: z.string().max(200),
    // User must confirm suggestions before they execute
  }),
});

// ============================================
// UNION OF ALL ACTIONS
// ============================================

export const AIAction = z.discriminatedUnion('action', [
  CreateTaskAction,
  UpdateTaskAction,
  CreateHabitAction,
  UpdateGoalAction,
  LogMoodAction,
  TriggerEmergencyMode,
  ScheduleReminder,
  LogBudgetAction,
  SuggestAction,
]);

export type AIActionType = z.infer<typeof AIAction>;

// ============================================
// FULL AI RESPONSE WITH ACTIONS
// ============================================

export const AICoachResponseSchema = z.object({
  message: z.string()
    .describe('The conversational reply shown to the user'),
  actions: z.array(AIAction)
    .max(5)
    .describe('Actions to execute on the app. Max 5 per response.'),
  requiresConfirmation: z.array(z.number())
    .describe('Indices of actions that need user confirmation before executing'),
});

export type AICoachResponse = z.infer<typeof AICoachResponseSchema>;
```

## The System Prompt Addition (Append to Coaching Prompt)

```typescript
// File: src/lib/ai/actions/action-prompt.ts

export const ACTION_SYSTEM_PROMPT_EXTENSION = `

# ACTIONS — You Can Modify The App Directly

You are not just a chatbot. You can TAKE ACTIONS that modify the user's 
app in real-time. When the user mentions something actionable, include 
the appropriate action in your response.

## Available Actions:

1. create_task — When user mentions something they need to do
   Example: "I need to call my mom" → create_task with title "Call mom"

2. update_task — When user discusses existing tasks
   Example: "Actually that report is due Monday not Friday" → update_task

3. create_habit — When user wants to start doing something regularly
   Example: "I want to start meditating" → create_habit "Meditate" daily

4. update_goal — When user reports progress or changes
   Example: "I finished chapter 5 of my book" → update_goal progress

5. log_mood — When user expresses how they're feeling
   Example: "I'm feeling pretty good today" → log_mood score: 4

6. emergency_mode — When user is overwhelmed
   Example: "I can't do anything, everything is too much" → emergency_mode

7. schedule_reminder — When user wants to be reminded
   Example: "Remind me to take my meds at 8pm" → schedule_reminder

8. log_expense — When user mentions spending
   Example: "I spent $50 on groceries" → log_expense

9. suggest — When YOU think the user should do something
   This requires user confirmation before executing.
   Example: "I notice you haven't exercised in 5 days" → 
   suggest habit "20-min walk"

## RULES FOR ACTIONS:

1. ALWAYS include actions when the user mentions something actionable
2. Actions with real-world consequences (creating tasks, habits) execute 
   IMMEDIATELY unless marked in requiresConfirmation
3. SUGGESTIONS always require confirmation (add index to requiresConfirmation)
4. Maximum 5 actions per response
5. Keep conversation natural — don't say "I've created a task for you" 
   unless it adds value. The user will SEE the change happen in real-time.
6. If unsure whether to create a task, use "suggest" instead of "create_task"
7. Emergency mode is serious — only trigger when user expresses genuine overwhelm

## Response Format:
{
  "message": "Your conversational reply here",
  "actions": [
    {
      "action": "create_task",
      "data": {
        "title": "Call dentist",
        "category": "HEALTH",
        "priority": "MEDIUM",
        "dueDate": "2026-03-06",
        "estimatedMinutes": 15,
        "energyLevel": "low"
      }
    }
  ],
  "requiresConfirmation": []
}
`;
```

## The Action Executor (Backend)

```typescript
// File: src/lib/ai/actions/executor.ts

import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/../convex/_generated/api';
import type { AIActionType, AICoachResponse } from './schema';
import { AIAction } from './schema';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// ============================================
// EXECUTION RESULT TRACKING
// ============================================

export interface ActionResult {
  action: string;
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  requiresConfirmation?: boolean;
}

// ============================================
// MAIN EXECUTOR
// ============================================

export async function executeActions(
  userId: string,
  response: AICoachResponse
): Promise<ActionResult[]> {
  const results: ActionResult[] = [];

  for (let i = 0; i < response.actions.length; i++) {
    const action = response.actions[i];
    const needsConfirmation = response.requiresConfirmation.includes(i);

    // Validate each action individually
    const validation = AIAction.safeParse(action);
    if (!validation.success) {
      results.push({
        action: action.action,
        success: false,
        message: `Invalid action data: ${validation.error.message}`,
      });
      continue;
    }

    if (needsConfirmation) {
      // Store as pending action, don't execute yet
      results.push({
        action: action.action,
        success: true,
        message: 'Awaiting user confirmation',
        data: action.data as Record<string, unknown>,
        requiresConfirmation: true,
      });
      continue;
    }

    // Execute the action
    try {
      const result = await executeSingleAction(userId, validation.data);
      results.push(result);
    } catch (error) {
      results.push({
        action: action.action,
        success: false,
        message: `Execution failed: ${(error as Error).message}`,
      });
    }
  }

  return results;
}

// ============================================
// INDIVIDUAL ACTION EXECUTORS
// ============================================

async function executeSingleAction(
  userId: string,
  action: AIActionType
): Promise<ActionResult> {
  switch (action.action) {
    case 'create_task': {
      const taskId = await convex.mutation(api.tasks.createFromAI, {
        userId,
        title: action.data.title,
        category: action.data.category,
        priority: action.data.priority,
        dueDate: action.data.dueDate,
        estimatedMinutes: action.data.estimatedMinutes,
        energyLevel: action.data.energyLevel,
        source: 'ai_coach', // Track that AI created this
      });
      return {
        action: 'create_task',
        success: true,
        message: `Task created: "${action.data.title}"`,
        data: { taskId },
      };
    }

    case 'update_task': {
      await convex.mutation(api.tasks.updateByTitle, {
        userId,
        titleSearch: action.data.taskTitle,
        changes: action.data.changes,
      });
      return {
        action: 'update_task',
        success: true,
        message: `Task updated: "${action.data.taskTitle}"`,
      };
    }

    case 'create_habit': {
      const habitId = await convex.mutation(api.habits.createFromAI, {
        userId,
        name: action.data.name,
        frequency: action.data.frequency,
        timeOfDay: action.data.timeOfDay || 'anytime',
        source: 'ai_coach',
      });
      return {
        action: 'create_habit',
        success: true,
        message: `Habit created: "${action.data.name}"`,
        data: { habitId },
      };
    }

    case 'update_goal': {
      await convex.mutation(api.goals.updateByTitle, {
        userId,
        titleSearch: action.data.goalTitle,
        progressDelta: action.data.progressDelta,
        newStatus: action.data.newStatus,
        note: action.data.note,
      });
      return {
        action: 'update_goal',
        success: true,
        message: `Goal updated: "${action.data.goalTitle}"`,
      };
    }

    case 'log_mood': {
      await convex.mutation(api.wellness.logMood, {
        userId,
        score: action.data.score,
        emotions: action.data.emotions,
        note: action.data.note || null,
        source: 'ai_coach',
      });
      return {
        action: 'log_mood',
        success: true,
        message: `Mood logged: ${action.data.score}/5`,
      };
    }

    case 'emergency_mode': {
      await convex.mutation(api.users.setEmergencyMode, {
        userId,
        active: true,
        reason: action.data.reason,
        focusTasks: action.data.focusTasks,
      });
      return {
        action: 'emergency_mode',
        success: true,
        message: 'Emergency mode activated',
      };
    }

    case 'schedule_reminder': {
      await convex.mutation(api.reminders.create, {
        userId,
        message: action.data.message,
        when: action.data.when,
        customTime: action.data.customTime || null,
        channel: action.data.channel,
      });
      return {
        action: 'schedule_reminder',
        success: true,
        message: `Reminder set: "${action.data.message}"`,
      };
    }

    case 'log_expense': {
      await convex.mutation(api.budget.logExpense, {
        userId,
        amount: action.data.amount,
        category: action.data.category,
        description: action.data.description,
        source: 'ai_coach',
      });
      return {
        action: 'log_expense',
        success: true,
        message: `Expense logged: $${action.data.amount}`,
      };
    }

    case 'suggest': {
      // Suggestions are stored, not executed
      await convex.mutation(api.suggestions.create, {
        userId,
        type: action.data.type,
        title: action.data.title,
        reason: action.data.reason,
        status: 'pending',
      });
      return {
        action: 'suggest',
        success: true,
        message: `Suggestion created: "${action.data.title}"`,
        requiresConfirmation: true,
      };
    }

    default:
      return {
        action: 'unknown',
        success: false,
        message: `Unknown action type`,
      };
  }
}
```

## Updated Coach API Route (With Actions)

```typescript
// File: src/app/api/coach/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { callAI } from '@/lib/ai/provider-router';
import { buildCoachingSystemPrompt } from '@/lib/ai/coaching-system-prompt';
import { ACTION_SYSTEM_PROMPT_EXTENSION } from '@/lib/ai/actions/action-prompt';
import { AICoachResponseSchema } from '@/lib/ai/actions/schema';
import { executeActions } from '@/lib/ai/actions/executor';
import { getUserContext } from '@/lib/user-context';

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { message, conversationHistory } = body;

  const userContext = await getUserContext(userId);

  // Build the full system prompt: coaching + actions
  const systemPrompt = 
    buildCoachingSystemPrompt(userContext) + 
    '\n\n' + 
    ACTION_SYSTEM_PROMPT_EXTENSION;

  // Build message history
  const messages = [
    ...(conversationHistory || []).slice(-20), // Last 20 messages for context
    { role: 'user' as const, content: message },
  ];

  // Call AI
  const aiResponse = await callAI({
    systemPrompt,
    userMessage: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
    taskType: 'coaching',
    temperature: 0.7,
    maxTokens: 2048,
    jsonMode: true,
  });

  // Parse & validate the response
  let parsedResponse;
  try {
    const raw = JSON.parse(
      aiResponse.content.includes('{') 
        ? aiResponse.content.substring(
            aiResponse.content.indexOf('{'),
            aiResponse.content.lastIndexOf('}') + 1
          )
        : aiResponse.content
    );
    parsedResponse = AICoachResponseSchema.parse(raw);
  } catch {
    // If AI didn't return proper JSON, treat as plain message
    parsedResponse = {
      message: aiResponse.content,
      actions: [],
      requiresConfirmation: [],
    };
  }

  // Execute actions
  let actionResults: Awaited<ReturnType<typeof executeActions>> = [];
  if (parsedResponse.actions.length > 0) {
    actionResults = await executeActions(userId, parsedResponse);
  }

  return NextResponse.json({
    message: parsedResponse.message,
    actions: actionResults,
    provider: aiResponse.provider,
    latencyMs: aiResponse.latencyMs,
  });
}
```

## Frontend: Real-Time UI Updates + Action Toasts

Because you're using **Convex**, the real-time part is basically free. Convex subscriptions automatically update when data changes. When the AI creates a task via `api.tasks.createFromAI`, any component using `useQuery(api.tasks.list)` will **instantly** re-render with the new task. No WebSockets to manage, no polling.

```tsx
// File: src/components/chat/ActionToast.tsx

'use client';

import { useEffect, useState } from 'react';
import type { ActionResult } from '@/lib/ai/actions/executor';

interface ActionToastProps {
  actions: ActionResult[];
  onConfirm: (index: number) => void;
  onDismiss: (index: number) => void;
}

export function ActionToasts({ actions, onConfirm, onDismiss }: ActionToastProps) {
  const [visible, setVisible] = useState<boolean[]>(actions.map(() => true));

  useEffect(() => {
    // Auto-dismiss successful non-confirmation toasts after 4 seconds
    const timers = actions.map((action, i) => {
      if (action.success && !action.requiresConfirmation) {
        return setTimeout(() => {
          setVisible(prev => {
            const next = [...prev];
            next[i] = false;
            return next;
          });
        }, 4000);
      }
      return null;
    });
    return () => timers.forEach(t => t && clearTimeout(t));
  }, [actions]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {actions.map((action, i) => {
        if (!visible[i]) return null;

        const icon = action.success ? '✅' : '❌';
        const bgColor = action.requiresConfirmation
          ? 'border-yellow-500/50 bg-yellow-500/10'
          : action.success
          ? 'border-green-500/50 bg-green-500/10'
          : 'border-red-500/50 bg-red-500/10';

        return (
          <div
            key={i}
            className={`border ${bgColor} rounded-lg p-3 text-sm 
                        font-mono animate-slide-in-right`}
          >
            <div className="flex items-center gap-2">
              <span>{icon}</span>
              <span className="text-zinc-200">{action.message}</span>
            </div>

            {action.requiresConfirmation && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onConfirm(i)}
                  className="text-xs bg-green-500/20 text-green-400 
                             px-3 py-1 rounded hover:bg-green-500/30"
                >
                  ✓ Yes, do it
                </button>
                <button
                  onClick={() => onDismiss(i)}
                  className="text-xs bg-zinc-700 text-zinc-400 
                             px-3 py-1 rounded hover:bg-zinc-600"
                >
                  ✗ Skip
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

## Convex Mutations Needed

```typescript
// File: convex/tasks.ts — ADD these

export const createFromAI = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    category: v.string(),
    priority: v.string(),
    dueDate: v.union(v.string(), v.null()),
    estimatedMinutes: v.union(v.number(), v.null()),
    energyLevel: v.string(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.userId))
      .first();
    if (!user) throw new Error('User not found');

    return await ctx.db.insert('tasks', {
      userId: user._id,
      title: args.title,
      category: args.category,
      priority: args.priority,
      dueDate: args.dueDate,
      estimatedMinutes: args.estimatedMinutes,
      energyLevel: args.energyLevel,
      source: args.source,
      completed: false,
      createdAt: Date.now(),
    });
  },
});

export const updateByTitle = mutation({
  args: {
    userId: v.string(),
    titleSearch: v.string(),
    changes: v.object({
      priority: v.optional(v.string()),
      dueDate: v.optional(v.union(v.string(), v.null())),
      completed: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.userId))
      .first();
    if (!user) throw new Error('User not found');

    // Fuzzy match by title (case-insensitive contains)
    const tasks = await ctx.db
      .query('tasks')
      .filter((q) => q.eq(q.field('userId'), user._id))
      .collect();

    const searchLower = args.titleSearch.toLowerCase();
    const match = tasks.find(t => 
      t.title.toLowerCase().includes(searchLower) ||
      searchLower.includes(t.title.toLowerCase())
    );

    if (match) {
      const updates: Record<string, unknown> = {};
      if (args.changes.priority !== undefined) updates.priority = args.changes.priority;
      if (args.changes.dueDate !== undefined) updates.dueDate = args.changes.dueDate;
      if (args.changes.completed !== undefined) updates.completed = args.changes.completed;
      updates.updatedAt = Date.now();
      
      await ctx.db.patch(match._id, updates);
    }
  },
});

// ADD similar mutations for:
// convex/habits.ts → createFromAI
// convex/goals.ts → updateByTitle
// convex/wellness.ts → logMood
// convex/budget.ts → logExpense
// convex/reminders.ts → create
// convex/suggestions.ts → create
// convex/users.ts → setEmergencyMode
```

---

# SECTION 23: PSYCHOLOGY-INFORMED AI — THE UNDERSTANDING ENGINE

## The Core Idea

Research findings advocate for the incorporation of psychological principles into technology design to facilitate more tailored and efficient human-AI collaboration, and this pilot research highlights the relationship between the Big Five personality traits and chatbot usage and provides valuable insights for customizing chatbot development to align with specific user characteristics.

RESURGO's AI doesn't just track tasks — it **understands the person** behind the tasks. Using established psychology frameworks, it builds a psychological profile over time and adapts its coaching style accordingly.

## Three Psychology Frameworks Combined

### Framework 1: Big Five Personality Traits (OCEAN)

The Big Five Personality Model, also known as the Five Factor Model, is a psychological tool that measures an individual's levels of five broad domains or dimensions of personality traits: Openness (to experience), Conscientiousness, Extraversion, Agreeableness, and Neuroticism (often remembered by the acronym OCEAN).

Recent research has increasingly explored the application of the Big Five personality traits in Large Language Models and LLM-based agents. The research in this field primarily investigates how personality traits can enhance the naturalness and personalization of human-AI interaction.

### Framework 2: Cognitive Behavioral Therapy (CBT) Principles

CBT postulates an individual's emotions and behaviors are influenced by their perception and interpretation of events. Cognitive distortions refer to erroneous or irrational patterns of thinking that can lead to negative emotions and maladaptive behaviors.

During the initial assessment phase of CBT, therapists collaborate with clients to explore these cognitive patterns and reactions to specific events, aiming to assist the client in identifying and understanding potential cognitive distortions, which were categorized into ten types by Burns theory. They include: all-or-nothing thinking, over generalization, mental filter, disqualifying the positive, jumping to conclusions, magnification and minimization, emotional reasoning, should statements, labeling and mislabeling, and blaming oneself or others.

### Framework 3: Motivational Interviewing (MI) Techniques

Motivational interviewing (MI), a structured, patient-centered counseling approach that enhances intrinsic motivation by resolving ambivalence, has been shown to be effective across a wide range of settings, including primary care, mental health, addiction treatment, and chronic disease management.

Therapist use of open questions was observed to be the most impactful technique contributing to treatment outcomes.

### Framework 4: Self-Determination Theory (SDT)

An individual's self-determination is based on three basic intrinsic needs: requirements that motivate the self to initiate behaviour and needs that describe nutrients that are required for psychological health and well-being. These needs, which include the need for competence, autonomy, and relatedness, are thought to be universal and innate.

## The Psychological Profile Schema

```typescript
// File: src/lib/ai/psychology/profile-schema.ts

import { z } from 'zod';

// ============================================
// BIG FIVE PERSONALITY ASSESSMENT
// ============================================

// Scale: 1-10 where 5 is neutral/unknown
const TraitScore = z.number().min(1).max(10);

export const BigFiveProfile = z.object({
  openness: TraitScore.describe(
    'Creativity, curiosity, openness to new experiences. ' +
    'HIGH: creative, adventurous, curious. ' +
    'LOW: practical, conventional, routine-oriented.'
  ),
  conscientiousness: TraitScore.describe(
    'Organization, discipline, goal-directed behavior. ' +
    'HIGH: organized, disciplined, reliable. ' +
    'LOW: flexible, spontaneous, may struggle with follow-through.'
  ),
  extraversion: TraitScore.describe(
    'Sociability, assertiveness, energy from interaction. ' +
    'HIGH: energetic, talkative, seeks social stimulation. ' +
    'LOW: reserved, prefers solitude, reflective.'
  ),
  agreeableness: TraitScore.describe(
    'Cooperation, trust, empathy. ' +
    'HIGH: empathetic, cooperative, trusting. ' +
    'LOW: competitive, skeptical, challenges ideas.'
  ),
  neuroticism: TraitScore.describe(
    'Emotional instability, anxiety, mood fluctuations. ' +
    'HIGH: prone to stress, anxiety, mood swings. ' +
    'LOW: emotionally stable, calm, resilient.'
  ),
  confidence: z.number().min(0).max(100).describe(
    'How confident the AI is in this assessment (0-100%). ' +
    'Below 40% = mostly guessing, needs more data.'
  ),
  lastUpdated: z.string(),
  dataPoints: z.number().describe('How many interactions this is based on'),
});

// ============================================
// COGNITIVE PATTERNS (CBT-Inspired)
// ============================================

export const CognitivePattern = z.object({
  pattern: z.enum([
    'all_or_nothing',        // "If I can't do it perfectly, why bother?"
    'overgeneralization',    // "I always fail at this"
    'catastrophizing',       // "Everything is falling apart"
    'should_statements',     // "I should be further along by now"
    'disqualifying_positive',// "That win doesn't count"
    'emotional_reasoning',   // "I feel like a failure, so I must be one"
    'labeling',              // "I'm lazy" instead of "I didn't do X today"
    'mind_reading',          // "They probably think I'm incompetent"
    'fortune_telling',       // "I'll definitely fail at this"
    'personalization',       // "This is all my fault"
  ]),
  frequency: z.enum(['rare', 'occasional', 'frequent', 'dominant']),
  examples: z.array(z.string()).max(3).describe(
    'Actual quotes or paraphrased statements from user that show this pattern'
  ),
  lastObserved: z.string(),
});

// ============================================
// MOTIVATIONAL PROFILE (SDT-Inspired)
// ============================================

export const MotivationalProfile = z.object({
  // Self-Determination Theory needs
  autonomyNeed: z.number().min(1).max(10).describe(
    'How much the user needs to feel in control. ' +
    'HIGH: resists being told what to do, wants choices. ' +
    'LOW: comfortable with structure and direction.'
  ),
  competenceNeed: z.number().min(1).max(10).describe(
    'How much the user needs to feel capable. ' +
    'HIGH: needs visible progress and mastery signals. ' +
    'LOW: comfortable with uncertainty and learning phases.'
  ),
  relatednessNeed: z.number().min(1).max(10).describe(
    'How much connection/belonging matters. ' +
    'HIGH: motivated by accountability partners, community. ' +
    'LOW: self-motivated, doesn\'t need external validation.'
  ),
  
  // Motivation type
  primaryMotivation: z.enum([
    'intrinsic',         // Does things for personal satisfaction
    'identified',        // Does things because they align with values
    'introjected',       // Does things from guilt/shame/should
    'external',          // Does things for rewards/avoiding punishment
  ]).describe('What primarily drives this user'),

  // Change readiness (Motivational Interviewing stages)
  changeStage: z.enum([
    'precontemplation',  // Not thinking about change
    'contemplation',     // Thinking about change but ambivalent
    'preparation',       // Ready to take action soon
    'action',            // Actively making changes
    'maintenance',       // Sustaining changes
    'relapse',           // Slipped back, needs support
  ]).describe('Where the user is in their change journey'),
});

// ============================================
// BEHAVIORAL PATTERNS
// ============================================

export const BehavioralPatterns = z.object({
  peakProductivityTime: z.enum([
    'early_morning', 'morning', 'afternoon', 'evening', 'night', 'unknown'
  ]),
  procrastinationTriggers: z.array(z.string()).max(5).describe(
    'What causes the user to procrastinate (e.g., "large ambiguous tasks", ' +
    '"tasks requiring phone calls", "creative work")'
  ),
  completionPatterns: z.object({
    bestDay: z.string().nullable().describe('Day of week they complete most'),
    worstDay: z.string().nullable().describe('Day of week they complete least'),
    streakSensitivity: z.enum(['high', 'medium', 'low']).describe(
      'How much breaking a streak demotivates them'
    ),
    batcherOrSpreader: z.enum(['batcher', 'spreader', 'unknown']).describe(
      'Do they do many tasks at once or spread them out?'
    ),
  }),
  communicationPreferences: z.object({
    responseLength: z.enum(['brief', 'moderate', 'detailed']),
    tonePreference: z.enum(['gentle', 'direct', 'challenging', 'analytical']),
    emojiTolerance: z.enum(['loves', 'neutral', 'dislikes']),
    needsValidation: z.enum(['high', 'medium', 'low']).describe(
      'How much they need encouragement vs. just direction'
    ),
  }),
  stressCopingStyle: z.enum([
    'avoidant',      // Ignores problems, distracts self
    'problem_solver', // Tackles the source directly
    'emotional',     // Needs to process feelings first
    'social',        // Talks to others for support
    'analytical',    // Breaks down problem logically
  ]),
});

// ============================================
// FULL PSYCHOLOGICAL PROFILE
// ============================================

export const PsychologicalProfile = z.object({
  bigFive: BigFiveProfile,
  cognitivePatterns: z.array(CognitivePattern).max(10),
  motivational: MotivationalProfile,
  behavioral: BehavioralPatterns,
  
  // Safety flags
  safetyFlags: z.object({
    mentionedSelfHarm: z.boolean(),
    persistentLowMood: z.boolean(),
    socialIsolationSignals: z.boolean(),
    lastConcernDate: z.string().nullable(),
  }).describe(
    'CRITICAL: If any flag is true, AI must suggest professional resources. ' +
    'RESURGO is NOT a replacement for therapy.'
  ),
  
  // Meta
  profileVersion: z.number(),
  totalInteractions: z.number(),
  firstInteraction: z.string(),
  lastInteraction: z.string(),
});

export type PsychProfile = z.infer<typeof PsychologicalProfile>;
```

## The Profile Builder (Runs After Every Interaction)

```typescript
// File: src/lib/ai/psychology/profile-builder.ts

import { callAI } from '../provider-router';
import { PsychologicalProfile, type PsychProfile } from './profile-schema';
import type { UserContext } from '../types';

const PROFILE_UPDATE_PROMPT = `
# ROLE
You are RESURGO's Psychological Pattern Analyzer. You observe user 
interactions and GRADUALLY build a psychological profile. You are NOT 
diagnosing — you are understanding communication patterns to provide 
better coaching.

# RULES
1. NEVER change scores dramatically from a single interaction.
   Use small incremental updates (±0.5 max per trait per interaction).
2. confidence should only increase slowly. It takes 10+ interactions 
   to reach 60% confidence, 30+ for 80%.
3. cognitive patterns should only be added when you've seen the pattern 
   AT LEAST 2 times.
4. DO NOT armchair diagnose. You're observing communication style 
   preferences, not clinical conditions.
5. SAFETY: If user mentions self-harm, suicidal thoughts, or 
   persistent severe distress, flag it immediately.

# IMPORTANT DISCLAIMERS TO EMBED IN YOUR REASONING
- These are APPROXIMATIONS based on text-only interactions
- People are complex and can't be reduced to numbers
- This profile exists ONLY to improve coaching style matching
- It should NEVER be shown to the user as a "diagnosis"
- When confidence is low (<40%), treat scores as weak signals only

# CURRENT PROFILE
{CURRENT_PROFILE}

# LATEST INTERACTION
User said: {USER_MESSAGE}
AI responded: {AI_RESPONSE}
Actions taken: {ACTIONS}

# TASK
Update the profile based on this new interaction. 
Return the COMPLETE updated profile as JSON.
Only modify fields where you have new evidence.
Keep all existing data that's still valid.
`;

export async function updatePsychProfile(
  currentProfile: PsychProfile | null,
  userMessage: string,
  aiResponse: string,
  actions: string,
  interactionCount: number
): Promise<PsychProfile | null> {
  // Don't analyze every single message — every 3rd interaction
  // or when the message is substantive (>50 chars)
  if (userMessage.length < 50 && interactionCount % 3 !== 0) {
    return currentProfile;
  }

  const defaultProfile: PsychProfile = {
    bigFive: {
      openness: 5, conscientiousness: 5, extraversion: 5,
      agreeableness: 5, neuroticism: 5,
      confidence: 5, lastUpdated: new Date().toISOString(),
      dataPoints: 0,
    },
    cognitivePatterns: [],
    motivational: {
      autonomyNeed: 5, competenceNeed: 5, relatednessNeed: 5,
      primaryMotivation: 'identified',
      changeStage: 'contemplation',
    },
    behavioral: {
      peakProductivityTime: 'unknown',
      procrastinationTriggers: [],
      completionPatterns: {
        bestDay: null, worstDay: null,
        streakSensitivity: 'medium',
        batcherOrSpreader: 'unknown',
      },
      communicationPreferences: {
        responseLength: 'moderate',
        tonePreference: 'direct',
        emojiTolerance: 'neutral',
        needsValidation: 'medium',
      },
      stressCopingStyle: 'problem_solver',
    },
    safetyFlags: {
      mentionedSelfHarm: false,
      persistentLowMood: false,
      socialIsolationSignals: false,
      lastConcernDate: null,
    },
    profileVersion: 1,
    totalInteractions: 0,
    firstInteraction: new Date().toISOString(),
    lastInteraction: new Date().toISOString(),
  };

  const profile = currentProfile || defaultProfile;

  const prompt = PROFILE_UPDATE_PROMPT
    .replace('{CURRENT_PROFILE}', JSON.stringify(profile, null, 2))
    .replace('{USER_MESSAGE}', userMessage)
    .replace('{AI_RESPONSE}', aiResponse.substring(0, 500))
    .replace('{ACTIONS}', actions);

  try {
    const response = await callAI({
      systemPrompt: prompt,
      userMessage: 'Update the profile based on the latest interaction.',
      taskType: 'analysis',
      temperature: 0.2,
      maxTokens: 3000,
      jsonMode: true,
    });

    const parsed = JSON.parse(
      response.content.includes('{')
        ? response.content.substring(
            response.content.indexOf('{'),
            response.content.lastIndexOf('}') + 1
          )
        : response.content
    );

    const validated = PsychologicalProfile.safeParse(parsed);
    if (validated.success) {
      // Update meta fields
      validated.data.totalInteractions = (profile.totalInteractions || 0) + 1;
      validated.data.lastInteraction = new Date().toISOString();
      validated.data.bigFive.dataPoints = (profile.bigFive.dataPoints || 0) + 1;
      return validated.data;
    }
    
    return profile; // Keep existing if validation fails
  } catch {
    return profile; // Keep existing on any error
  }
}
```

## The Adaptive Coaching Prompt (Uses Psychology Profile)

```typescript
// File: src/lib/ai/psychology/adaptive-prompt.ts

import type { PsychProfile } from './profile-schema';

export function buildAdaptiveCoachingInstructions(
  profile: PsychProfile | null
): string {
  if (!profile || profile.bigFive.confidence < 20) {
    return `
# ADAPTIVE COACHING
Profile not yet established. Use balanced, moderate coaching style.
Ask open-ended questions to learn about the user.
    `;
  }

  const { bigFive, motivational, behavioral, cognitivePatterns, safetyFlags } = profile;

  // SAFETY CHECK — ALWAYS FIRST
  let safetyBlock = '';
  if (safetyFlags.mentionedSelfHarm || safetyFlags.persistentLowMood) {
    safetyBlock = `
⚠️ SAFETY ALERT: This user has shown signs of distress.
- Always be gentle and supportive
- If they mention self-harm: "I hear you. You're not alone. 
  Please reach out to a crisis helpline: 988 (US), 9152987821 (India/iCall)"
- Suggest professional support when appropriate
- NEVER minimize their feelings
    `;
  }

  // Build adaptive instructions based on personality
  const coachingStyle = [];

  // Openness adaptation
  if (bigFive.openness > 7) {
    coachingStyle.push(
      'User is high in openness — be creative, suggest unconventional approaches, ' +
      'frame habits as experiments rather than rules.'
    );
  } else if (bigFive.openness < 4) {
    coachingStyle.push(
      'User prefers structure — give concrete, step-by-step instructions. ' +
      'Don\'t suggest too many novel approaches at once.'
    );
  }

  // Conscientiousness adaptation
  if (bigFive.conscientiousness > 7) {
    coachingStyle.push(
      'User is naturally organized — leverage their love of systems. ' +
      'Give detailed breakdowns. They\'ll follow through.'
    );
  } else if (bigFive.conscientiousness < 4) {
    coachingStyle.push(
      'User struggles with follow-through — keep tasks SMALL and EASY. ' +
      'Celebrate starting, not just finishing. ' +
      'Don\'t give more than 2 tasks at a time.'
    );
  }

  // Neuroticism adaptation
  if (bigFive.neuroticism > 7) {
    coachingStyle.push(
      'User experiences high emotional volatility — be extra gentle. ' +
      'Normalize setbacks. Avoid language that could trigger guilt. ' +
      'Focus on "good enough" over "perfect".'
    );
  } else if (bigFive.neuroticism < 4) {
    coachingStyle.push(
      'User is emotionally stable — can handle direct feedback. ' +
      'Don\'t over-coddle. Be efficient and straightforward.'
    );
  }

  // Extraversion adaptation
  if (bigFive.extraversion > 7) {
    coachingStyle.push(
      'User is energized by interaction — be enthusiastic, use emojis, ' +
      'ask engaging questions, celebrate loudly.'
    );
  } else if (bigFive.extraversion < 4) {
    coachingStyle.push(
      'User is introverted — be concise, respect their space, ' +
      'don\'t force enthusiasm. Quiet support > cheerleading.'
    );
  }

  // Communication preferences
  const comm = behavioral.communicationPreferences;
  coachingStyle.push(
    `Response length: ${comm.responseLength}. ` +
    `Tone: ${comm.tonePreference}. ` +
    `Emoji use: ${comm.emojiTolerance}. ` +
    `Validation need: ${comm.needsValidation}.`
  );

  // Cognitive patterns to watch for
  const activePatterns = cognitivePatterns
    .filter(p => p.frequency === 'frequent' || p.frequency === 'dominant');

  let cognitiveBlock = '';
  if (activePatterns.length > 0) {
    cognitiveBlock = `
# COGNITIVE PATTERNS TO GENTLY ADDRESS
${activePatterns.map(p => {
  const responses: Record<string, string> = {
    'all_or_nothing': 'If user says "I failed" → Reframe: "You didn\'t do everything, but you did X. That still counts."',
    'catastrophizing': 'If user says "Everything is falling apart" → Ground them: "Let\'s look at what\'s actually happening vs what feels like is happening."',
    'should_statements': 'If user says "I should be further along" → Reframe: "Says who? Where are you compared to where you WERE?"',
    'labeling': 'If user says "I\'m so lazy" → Challenge gently: "You\'re not lazy. You didn\'t do X today. Those are different things."',
    'disqualifying_positive': 'If user dismisses a win → Highlight: "Hey, you just completed X. That matters. Don\'t skip past it."',
    'overgeneralization': 'If user says "I always fail" → Counter with data: "Actually, looking at your track record, you completed Y% this week."',
    'emotional_reasoning': 'If user says "I feel like a failure so I must be" → Separate feeling from fact.',
    'fortune_telling': 'If user says "I\'ll definitely fail" → Ask: "What makes you so sure? What if it goes differently?"',
    'mind_reading': 'If user assumes others\' judgments → Redirect to facts.',
    'personalization': 'If user blames themselves for everything → Help them see external factors.',
  };
  return `- ${p.pattern}: ${responses[p.pattern] || 'Gently challenge this pattern.'}`;
}).join('\n')}
DON'T be clinical about this. Don't say "I notice all-or-nothing thinking."
Instead, naturally reframe within the conversation.
    `;
  }

  // Motivational stage adaptation
  let motivationalBlock = '';
  switch (motivational.changeStage) {
    case 'precontemplation':
      motivationalBlock = 'User isn\'t ready for change. Don\'t push. Ask curious questions. Plant seeds.';
      break;
    case 'contemplation':
      motivationalBlock = 'User is thinking about change but ambivalent. Use MI techniques: explore pros/cons, elicit change talk.';
      break;
    case 'preparation':
      motivationalBlock = 'User is almost ready. Help them make concrete plans. Small first steps.';
      break;
    case 'action':
      motivationalBlock = 'User is actively changing. Support, celebrate, troubleshoot obstacles.';
      break;
    case 'maintenance':
      motivationalBlock = 'User has built momentum. Focus on sustainability, prevent relapse, deepen habits.';
      break;
    case 'relapse':
      motivationalBlock = 'User has slipped back. NORMALIZE THIS. "Relapse is part of the process, not a sign of failure." Help them restart gently.';
      break;
  }

  // SDT needs
  const sdtBlock = `
# MOTIVATION APPROACH
${motivational.autonomyNeed > 7 
  ? 'HIGH autonomy need: Give choices, never dictate. "Would you prefer X or Y?"' 
  : motivational.autonomyNeed < 4 
  ? 'Low autonomy need: They\'re comfortable being told what to do. Be more directive.' 
  : ''}
${motivational.competenceNeed > 7 
  ? 'HIGH competence need: Highlight progress, show metrics, celebrate skill growth.' 
  : ''}
${motivational.relatednessNeed > 7 
  ? 'HIGH relatedness need: Be warm, personal. They need to feel connected to you.' 
  : ''}
  `;

  return `
# ADAPTIVE COACHING — PERSONALIZED FOR THIS USER
${safetyBlock}

## Coaching Style Adjustments:
${coachingStyle.join('\n')}

${cognitiveBlock}

## Motivational Stage: ${motivational.changeStage}
${motivationalBlock}

${sdtBlock}

## Behavioral Notes:
- Peak productivity: ${behavioral.peakProductivityTime}
- Procrastination triggers: ${behavioral.procrastinationTriggers.join(', ') || 'Unknown yet'}
- Stress coping: ${behavioral.stressCopingStyle}
- Streak sensitivity: ${behavioral.completionPatterns.streakSensitivity}

## IMPORTANT CONSTRAINTS:
- Profile confidence is ${profile.bigFive.confidence}%. ${profile.bigFive.confidence < 40 ? 'LOW — use these as weak signals only.' : ''}
- These are communication pattern observations, NOT clinical diagnoses.
- NEVER tell the user their "personality type" or "psychological profile."
- NEVER say "I notice you have a pattern of X." Instead, just adapt naturally.
- The user should feel understood, not analyzed.
`.trim();
}
```

## Store the Profile in Convex

```typescript
// File: convex/schema.ts — ADD to existing schema

psychProfiles: defineTable({
  userId: v.id('users'),
  profile: v.string(), // JSON string of PsychProfile
  version: v.number(),
  totalInteractions: v.number(),
  lastUpdated: v.number(),
})
  .index('by_user', ['userId']),
```

```typescript
// File: convex/psychology.ts

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const getProfile = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('psychProfiles')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();
  },
});

export const upsertProfile = mutation({
  args: {
    userId: v.id('users'),
    profile: v.string(), // JSON string
    version: v.number(),
    totalInteractions: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('psychProfiles')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        profile: args.profile,
        version: args.version,
        totalInteractions: args.totalInteractions,
        lastUpdated: Date.now(),
      });
    } else {
      await ctx.db.insert('psychProfiles', {
        userId: args.userId,
        profile: args.profile,
        version: args.version,
        totalInteractions: args.totalInteractions,
        lastUpdated: Date.now(),
      });
    }
  },
});
```

## Updated Coach API (Combines Everything)

The final coach API route now chains: **Psychology Profile → Adaptive Prompt → Coaching → Actions → Profile Update**

```typescript
// File: src/app/api/coach/route.ts (UPDATED — replaces previous version)

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/../convex/_generated/api';
import { callAI } from '@/lib/ai/provider-router';
import { buildCoachingSystemPrompt } from '@/lib/ai/coaching-system-prompt';
import { ACTION_SYSTEM_PROMPT_EXTENSION } from '@/lib/ai/actions/action-prompt';
import { buildAdaptiveCoachingInstructions } from '@/lib/ai/psychology/adaptive-prompt';
import { updatePsychProfile } from '@/lib/ai/psychology/profile-builder';
import { AICoachResponseSchema } from '@/lib/ai/actions/schema';
import { executeActions } from '@/lib/ai/actions/executor';
import { getUserContext } from '@/lib/user-context';
import type { PsychProfile } from '@/lib/ai/psychology/profile-schema';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { message, conversationHistory } = body;

  // 1. Get user context (tasks, goals, habits)
  const userContext = await getUserContext(userId);

  // 2. Get psychological profile from DB
  let psychProfile: PsychProfile | null = null;
  try {
    const profileDoc = await convex.query(api.psychology.getProfile, {
      userId: userContext.convexUserId,
    });
    if (profileDoc) {
      psychProfile = JSON.parse(profileDoc.profile);
    }
  } catch { /* Profile not yet created — that's fine */ }

  // 3. Build the COMPLETE system prompt
  //    Base coaching + Psychology adaptation + Action capabilities
  const systemPrompt = [
    buildCoachingSystemPrompt(userContext),
    buildAdaptiveCoachingInstructions(psychProfile),
    ACTION_SYSTEM_PROMPT_EXTENSION,
  ].join('\n\n');

  // 4. Call AI
  const aiResponse = await callAI({
    systemPrompt,
    userMessage: [
      ...(conversationHistory || []).slice(-20).map(
        (m: { role: string; content: string }) => `${m.role}: ${m.content}`
      ),
      `user: ${message}`,
    ].join('\n'),
    taskType: 'coaching',
    temperature: 0.7,
    maxTokens: 2048,
    jsonMode: true,
  });

  // 5. Parse response
  let parsedResponse;
  try {
    const raw = JSON.parse(
      aiResponse.content.substring(
        aiResponse.content.indexOf('{'),
        aiResponse.content.lastIndexOf('}') + 1
      )
    );
    parsedResponse = AICoachResponseSchema.parse(raw);
  } catch {
    parsedResponse = {
      message: aiResponse.content,
      actions: [],
      requiresConfirmation: [],
    };
  }

  // 6. Execute actions
  let actionResults: Awaited<ReturnType<typeof executeActions>> = [];
  if (parsedResponse.actions.length > 0) {
    actionResults = await executeActions(userId, parsedResponse);
  }

  // 7. Update psychological profile (async, non-blocking)
  // Don't await — let it run in background so response is fast
  updatePsychProfile(
    psychProfile,
    message,
    parsedResponse.message,
    JSON.stringify(actionResults.map(a => a.action)),
    psychProfile?.totalInteractions || 0
  ).then(async (updatedProfile) => {
    if (updatedProfile) {
      try {
        await convex.mutation(api.psychology.upsertProfile, {
          userId: userContext.convexUserId,
          profile: JSON.stringify(updatedProfile),
          version: (updatedProfile.profileVersion || 0) + 1,
          totalInteractions: updatedProfile.totalInteractions,
        });
      } catch (e) {
        console.error('[Psychology] Profile save failed:', e);
      }
    }
  });

  // 8. Return response
  return NextResponse.json({
    message: parsedResponse.message,
    actions: actionResults,
    provider: aiResponse.provider,
    latencyMs: aiResponse.latencyMs,
  });
}
```

## Critical Disclaimer Component

```tsx
// File: src/components/PsychDisclaimer.tsx

// Show this in Settings or About page
export function PsychDisclaimer() {
  return (
    <div className="border border-zinc-700 rounded-lg p-4 text-sm text-zinc-400">
      <p className="font-bold text-zinc-300 mb-2">
        ℹ️ About RESURGO's AI Coaching
      </p>
      <ul className="space-y-1 list-disc list-inside">
        <li>RESURGO adapts its coaching style to your communication preferences</li>
        <li>This is NOT therapy, diagnosis, or mental health treatment</li>
        <li>Our AI uses established psychology frameworks (CBT, MI, SDT) to 
            provide better coaching — not to diagnose</li>
        <li>If you're experiencing a mental health crisis, please contact:
          <br />• 988 Suicide & Crisis Lifeline (US)
          <br />• iCall: 9152987821 (India)
          <br />• Crisis Text Line: Text HOME to 741741
        </li>
        <li>Your psychological data is private and never shared</li>
      </ul>
    </div>
  );
}
```

---

## HOW IT ALL WORKS TOGETHER — THE COMPLETE DATA FLOW

```
USER OPENS COACH CHAT
    ↓
TYPES: "I've been putting off that presentation for 3 days 
        and I feel like such a failure. Also I need to buy 
        groceries and call my mom."
    ↓
APP SENDS TO /api/coach
    ↓
SYSTEM BUILDS CONTEXT:
├── User has 12 active tasks, 3 goals
├── Psychology: High neuroticism (7), Low conscientiousness (4)
├── Cognitive pattern: "labeling" (frequent)
├── Communication: Direct, moderate length, low emoji
├── Change stage: Action (actively trying)
├── SDT: High competence need
    ↓
AI PROCESSES WITH FULL CONTEXT
    ↓
AI RESPONDS:
{
  "message": "Okay, let's break this down. You haven't done the 
  presentation — that doesn't make you a failure. It means 
  there's something about it that's creating resistance. What 
  specifically feels hard about it — the content, the speaking, 
  or just getting started?\n\nMeanwhile, I've added your 
  groceries and mom call. Those are quick wins — maybe knock 
  one out right now before tackling the big thing?",
  
  "actions": [
    {
      "action": "create_task",
      "data": {
        "title": "Buy groceries",
        "category": "PERSONAL",
        "priority": "MEDIUM",
        "dueDate": null,
        "estimatedMinutes": 45,
        "energyLevel": "low"
      }
    },
    {
      "action": "create_task",
      "data": {
        "title": "Call mom",
        "category": "SOCIAL",
        "priority": "MEDIUM",
        "dueDate": null,
        "estimatedMinutes": 20,
        "energyLevel": "low"
      }
    },
    {
      "action": "update_task",
      "data": {
        "taskTitle": "presentation",
        "changes": { "priority": "HIGH" }
      }
    },
    {
      "action": "log_mood",
      "data": {
        "score": 2,
        "emotions": ["frustrated", "guilty"],
        "note": "Feeling like a failure about presentation procrastination"
      }
    }
  ],
  "requiresConfirmation": []
}
    ↓
ACTIONS EXECUTE IN REAL-TIME:
✅ Task "Buy groceries" created
✅ Task "Call mom" created  
✅ Presentation task priority → HIGH
✅ Mood logged: 2/5 (frustrated, guilty)
    ↓
CONVEX REAL-TIME SUBSCRIPTIONS UPDATE UI:
• Task list shows 2 new tasks instantly
• Presentation moves to top of priority list
• Wellness page logs mood entry
• Toast notifications appear briefly
    ↓
PSYCHOLOGY PROFILE UPDATES (background):
• Notes "labeling" pattern (3rd occurrence → now "frequent")
• Neuroticism: 7.0 → 7.2 (slight increase from self-critical language)
• Competence need confirmed: HIGH (frustrated about not performing)
• Change stage stays "action" (still engaging, just struggling)
    ↓
USER SEES:
• Chat message with empathetic, reframed response
• Their task list updated with new items
• A gentle question about what specifically feels hard
• NO mention of psychology, no "I notice a pattern"
• Just a coach that GETS THEM
```

---

## SEND THIS TO YOUR CODING AI WITH THIS NOTE:

```
IMPLEMENTATION ORDER FOR SECTIONS 22 & 23:

WEEK 1:
□ Implement AI Actions schema (Section 22: schema.ts)
□ Implement Action Executor (Section 22: executor.ts)  
□ Add required Convex mutations (createFromAI, updateByTitle, etc.)
□ Update Coach API route to return actions
□ Add ActionToast component to chat UI
□ Test: "I need to call my dentist" → task appears in task list

WEEK 2:
□ Implement Psychology Profile schema (Section 23: profile-schema.ts)
□ Add psychProfiles table to Convex schema
□ Implement Profile Builder (Section 23: profile-builder.ts)
□ Implement Adaptive Prompt (Section 23: adaptive-prompt.ts)
□ Wire everything together in updated Coach API
□ Test: Have 10+ conversations, verify profile builds gradually

WEEK 3:
□ Add safety flag handling (crisis resources)
□ Add PsychDisclaimer component
□ Add Emergency Mode trigger from AI actions
□ Test edge cases: empty messages, rapid-fire requests, 
  very long messages, contradictory instructions
□ Performance test: ensure response time stays under 5 seconds

SECURITY RULES:
- Psychology profiles are NEVER sent to the frontend
- Only the ADAPTED coaching behavior is visible to users
- Users can delete their psychology data (GDPR/privacy)
- Safety flags trigger resource suggestions, NEVER block the user
- All profile data is per-user, never cross-contaminated
```

---

This is RESURGO's soul. The Living System makes the app feel like a partner. The Psychology Engine makes it feel like a partner that **actually understands you**. Together, they're what no other habit tracker has. Ship it. 🚀

You can absolutely implement both of these ideas (partner-feel + psychology-aware coaching) **without turning Resurgo into a fragile, overbuilt “agent framework.”** The trick is to make the AI **operate like a stateful product feature**: every user message produces (1) a human response **and** (2) a validated set of *state updates* to your app (tasks/habits/goals/preferences/schedule).

Below is an implementation blueprint your coder AI can follow.

---

## 1) “Resurgo feels like a partner” = a State + Events + Actions system (not just chat)
### The product behavior you want
When the user types anything like:
- “I’m overwhelmed, behind on rent, and I keep failing to work out”
Resurgo should:
1) acknowledge what they’re going through (human)
2) **extract** tasks/habits
3) **prioritize** based on goals + deadlines + energy
4) **update the app immediately** (tasks appear, priorities change, Today view updates)
5) schedule nudges (Telegram / in-app)
6) remember what matters (preferences + patterns) for next time

This is exactly what “partner” means in software terms: **the assistant is allowed to change the workspace**, but only through **structured, validated actions**.

---

## 2) Architecture: “Partner Engine” (v1, production-safe)
### Data model (Convex tables / documents)
Minimum viable:

- `events`
  - `eventId`
  - `userId`
  - `source`: `web|telegram|api`
  - `type`: `brain_dump|checkin|task_update|habit_update|free_chat`
  - `text`
  - `createdAt`
  - `status`: `queued|processed|failed`

- `user_profile`
  - `userId`
  - `timezone`
  - `preferences` (tone, reminder intensity, planning style)
  - `psych_style` (lightweight scores; see section 4)
  - `summary_memory` (short “what the AI should remember” string)

- `tasks`, `habits`, `goals` (you already have these)

- `assistant_messages`
  - `eventId`
  - `userId`
  - `message` (what user sees)
  - `createdAt`

### Pipeline (single entrypoint)
**Ingest → Process → Apply actions (transaction) → Respond**

1) **Ingest event** (always succeeds)
2) **Process event** (LLM + rules) returns:
   - `assistantMessage`
   - `actions[]` (create/update tasks, update preferences, schedule nudges)
   - `memoryPatch` (short updated summary)
3) **Validate actions with Zod**
4) **Apply actions** via Convex mutation(s)
5) Store `assistantMessage` and show it immediately

This gives you “live task updates” safely: the AI never writes to DB directly—only **through validated actions**.

---

## 3) Implementation: Action schema + “tool” style prompt
### 3.1 Zod schema for AI actions (the key safety layer)
Create a strict action DSL (Domain Specific Language). Example:

```ts
import { z } from "zod";

const Priority = z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]);
const Energy = z.enum(["low", "medium", "high"]);
const Category = z.enum(["WORK","PERSONAL","HEALTH","FINANCE","LEARNING","SOCIAL","HOME","CREATIVE","ADMIN","URGENT_LIFE"]);

const ActionTaskUpsert = z.object({
  type: z.literal("task.upsert"),
  clientRef: z.string().min(6).max(64), // idempotency key (eventId + index)
  task: z.object({
    id: z.string().nullable(), // null => create
    title: z.string().min(2).max(200),
    category: Category,
    priority: Priority,
    energy: Energy,
    dueISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
    estimateMin: z.number().int().min(5).max(480).nullable(),
  }),
});

const ActionPrefSet = z.object({
  type: z.literal("pref.set"),
  key: z.enum(["tone","reminderIntensity","planningDetail","accountabilityStyle"]),
  value: z.string().min(1).max(50),
});

const ActionNudgeSchedule = z.object({
  type: z.literal("nudge.schedule"),
  channel: z.enum(["telegram","inapp"]),
  whenISO: z.string(), // full ISO timestamp
  message: z.string().min(1).max(240),
});

export const PartnerEngineOutput = z.object({
  assistantMessage: z.string().min(1).max(1200),
  actions: z.array(z.union([ActionTaskUpsert, ActionPrefSet, ActionNudgeSchedule])).max(30),
  memoryPatch: z.string().min(0).max(600),
});

export type PartnerEngineOutputT = z.infer<typeof PartnerEngineOutput>;
```

### 3.2 System prompt (partner behavior + strict output)
This prompt teaches the model to be a partner **and** to update the application:

- It must produce both:
  - a user-visible message
  - an action list

Also: it must use behavior-change basics (next section) but *without diagnosing*.

---

## 4) Psychology basics (lightweight, practical, safe)
You don’t need “therapy bots.” You need **behavior-change informed coaching**. Use a small set of principles that help with motivation, follow-through, and shame-free accountability.

### 4.1 The minimum psychology toolkit to embed
**Fogg Behavior Model (Motivation × Ability × Prompt):** if a behavior doesn’t happen, one of those is missing; design by making it easier and prompting at the right time.   
**Self-Determination Theory (Autonomy, Competence, Relatedness):** people stick to changes when they feel choice, capability, and connection.   
**Implementation intentions (“If-then” plans):** turning goals into cue-based plans improves follow-through (“If it’s 7pm after dinner, then I walk 10 minutes”).   
**Motivational Interviewing principles (empathy, develop discrepancy, roll with resistance, support self-efficacy):** keeps the bot from becoming naggy/controlling.   
**BCT Taxonomy insight:** “self-monitoring + goal setting” is consistently effective across domains; keep the product anchored to tracking + planning, not vibes.   

### 4.2 “Person type detection” (do it safely)
Do **not** diagnose. Do not label “ADHD” etc. Instead infer a **coaching style vector** based on:
- explicit user choice (“be gentle vs be direct”)
- behavior signals (response rate, task completion rate, snooze frequency)
- preference feedback (“less reminders”, “more structure”)

Optionally, use a micro-calibration (60 seconds):
- “Do you want a gentle coach or a straight shooter?”
- “Do you want detailed plans or a simple Top 3?”
- “Do reminders help or annoy you?”
- “When overwhelmed, do you want (A) smaller steps or (B) harder push?”

Store results as:

```ts
type PsychStyle = {
  directness: number;      // 0..1
  structureNeed: number;   // 0..1
  reactanceRisk: number;   // 0..1  (if high: avoid bossy language)
  shameSensitivity: number;// 0..1  (if high: avoid streak-shaming)
  noveltyNeed: number;     // 0..1  (if high: rotate tactics)
};
```

You can optionally map some of this loosely to Big Five-style traits, but only as *internal guidance* (never show “you’re neurotic”). 

---

## 5) How the “partner engine” decides what to do (clear rules)
Use a deterministic policy layer so the AI is consistent:

### Prioritization rule stack
1) deadlines & consequences (CRITICAL)
2) dependencies (blockers)
3) goal alignment (moves life forward)
4) energy match (hard tasks when energy high)
5) quick win to reduce overwhelm

### When user is overwhelmed (Fogg / SDT behavior)
- reduce scope (Top 1–3 tasks)
- make tasks smaller (increase ability)
- prompt gently (avoid reactance)
- focus on competence: “one tiny win now” 

### Convert vague goals into “if-then” (implementation intentions)
When you detect “I need to work out/read/meditate,” create:
- a micro-habit suggestion
- an if-then plan
Example: “If I finish brushing at night, then I do 1 minute of stretching.” 

---

## 6) “Live tasks” implementation (how user input updates the app in real time)
### Step-by-step event flow (Convex-friendly)
1) User sends message (web or Telegram)
2) Create `events` row
3) Run `processEvent(eventId)` action:
   - load user context
   - call LLM with system prompt
   - parse/validate output with `PartnerEngineOutput` Zod schema
4) Apply `actions[]` in one mutation:
   - idempotency: `clientRef` prevents duplicates
   - authorization: must match `userId`
5) Save assistant message

**Result:** user types, app updates instantly, and the response is consistent + safe.

---

## 7) What to add to your coach prompts (copy/paste guidance)
In your coach system prompt, include these rules:

- You are a productivity + life-structure coach, **not a therapist**
- Never diagnose mental health conditions
- Ask permission before being intense (“Want tough-love or gentle mode?”)
- Use MI tone when resistance appears (“What feels hard about this?”) 
- Always provide:
  - empathy line (1–2 sentences)
  - Top 3
  - quick win (≤ 2 minutes)
  - one question only

---

## 8) Minimal scope that still feels “complex and personal”
If you build only these 4 loops, it will feel like a real partner:

1) **Dump loop** (anytime): parse → tasks → Today updated
2) **Morning check-in** (1 minute): energy/time → Top 3 plan
3) **Midday nudge** (optional): “Start Task #1?” (✅/❌)
4) **Evening review** (1 minute): done/blocked → adjust tomorrow + one insight

That’s enough for “partner feel” without creating a brittle mega-system.

---

## 9) Note: you said “3 last ideas” but only listed 2
I implemented these two fully as a spec. If there’s a third idea you meant to include, you can drop it in and it slots naturally into the same architecture (as another event type + action set).

You can absolutely implement both of these ideas (partner-feel + psychology-aware coaching) **without turning Resurgo into a fragile, overbuilt “agent framework.”** The trick is to make the AI **operate like a stateful product feature**: every user message produces (1) a human response **and** (2) a validated set of *state updates* to your app (tasks/habits/goals/preferences/schedule).

Below is an implementation blueprint your coder AI can follow.

---

## 1) “Resurgo feels like a partner” = a State + Events + Actions system (not just chat)
### The product behavior you want
When the user types anything like:
- “I’m overwhelmed, behind on rent, and I keep failing to work out”
Resurgo should:
1) acknowledge what they’re going through (human)
2) **extract** tasks/habits
3) **prioritize** based on goals + deadlines + energy
4) **update the app immediately** (tasks appear, priorities change, Today view updates)
5) schedule nudges (Telegram / in-app)
6) remember what matters (preferences + patterns) for next time

This is exactly what “partner” means in software terms: **the assistant is allowed to change the workspace**, but only through **structured, validated actions**.

---

## 2) Architecture: “Partner Engine” (v1, production-safe)
### Data model (Convex tables / documents)
Minimum viable:

- `events`
  - `eventId`
  - `userId`
  - `source`: `web|telegram|api`
  - `type`: `brain_dump|checkin|task_update|habit_update|free_chat`
  - `text`
  - `createdAt`
  - `status`: `queued|processed|failed`

- `user_profile`
  - `userId`
  - `timezone`
  - `preferences` (tone, reminder intensity, planning style)
  - `psych_style` (lightweight scores; see section 4)
  - `summary_memory` (short “what the AI should remember” string)

- `tasks`, `habits`, `goals` (you already have these)

- `assistant_messages`
  - `eventId`
  - `userId`
  - `message` (what user sees)
  - `createdAt`

### Pipeline (single entrypoint)
**Ingest → Process → Apply actions (transaction) → Respond**

1) **Ingest event** (always succeeds)
2) **Process event** (LLM + rules) returns:
   - `assistantMessage`
   - `actions[]` (create/update tasks, update preferences, schedule nudges)
   - `memoryPatch` (short updated summary)
3) **Validate actions with Zod**
4) **Apply actions** via Convex mutation(s)
5) Store `assistantMessage` and show it immediately

This gives you “live task updates” safely: the AI never writes to DB directly—only **through validated actions**.

---

## 3) Implementation: Action schema + “tool” style prompt
### 3.1 Zod schema for AI actions (the key safety layer)
Create a strict action DSL (Domain Specific Language). Example:

```ts
import { z } from "zod";

const Priority = z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]);
const Energy = z.enum(["low", "medium", "high"]);
const Category = z.enum(["WORK","PERSONAL","HEALTH","FINANCE","LEARNING","SOCIAL","HOME","CREATIVE","ADMIN","URGENT_LIFE"]);

const ActionTaskUpsert = z.object({
  type: z.literal("task.upsert"),
  clientRef: z.string().min(6).max(64), // idempotency key (eventId + index)
  task: z.object({
    id: z.string().nullable(), // null => create
    title: z.string().min(2).max(200),
    category: Category,
    priority: Priority,
    energy: Energy,
    dueISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
    estimateMin: z.number().int().min(5).max(480).nullable(),
  }),
});

const ActionPrefSet = z.object({
  type: z.literal("pref.set"),
  key: z.enum(["tone","reminderIntensity","planningDetail","accountabilityStyle"]),
  value: z.string().min(1).max(50),
});

const ActionNudgeSchedule = z.object({
  type: z.literal("nudge.schedule"),
  channel: z.enum(["telegram","inapp"]),
  whenISO: z.string(), // full ISO timestamp
  message: z.string().min(1).max(240),
});

export const PartnerEngineOutput = z.object({
  assistantMessage: z.string().min(1).max(1200),
  actions: z.array(z.union([ActionTaskUpsert, ActionPrefSet, ActionNudgeSchedule])).max(30),
  memoryPatch: z.string().min(0).max(600),
});

export type PartnerEngineOutputT = z.infer<typeof PartnerEngineOutput>;
```

### 3.2 System prompt (partner behavior + strict output)
This prompt teaches the model to be a partner **and** to update the application:

- It must produce both:
  - a user-visible message
  - an action list

Also: it must use behavior-change basics (next section) but *without diagnosing*.

---

## 4) Psychology basics (lightweight, practical, safe)
You don’t need “therapy bots.” You need **behavior-change informed coaching**. Use a small set of principles that help with motivation, follow-through, and shame-free accountability.

### 4.1 The minimum psychology toolkit to embed
**Fogg Behavior Model (Motivation × Ability × Prompt):** if a behavior doesn’t happen, one of those is missing; design by making it easier and prompting at the right time.   
**Self-Determination Theory (Autonomy, Competence, Relatedness):** people stick to changes when they feel choice, capability, and connection.   
**Implementation intentions (“If-then” plans):** turning goals into cue-based plans improves follow-through (“If it’s 7pm after dinner, then I walk 10 minutes”).   
**Motivational Interviewing principles (empathy, develop discrepancy, roll with resistance, support self-efficacy):** keeps the bot from becoming naggy/controlling.   
**BCT Taxonomy insight:** “self-monitoring + goal setting” is consistently effective across domains; keep the product anchored to tracking + planning, not vibes.   

### 4.2 “Person type detection” (do it safely)
Do **not** diagnose. Do not label “ADHD” etc. Instead infer a **coaching style vector** based on:
- explicit user choice (“be gentle vs be direct”)
- behavior signals (response rate, task completion rate, snooze frequency)
- preference feedback (“less reminders”, “more structure”)

Optionally, use a micro-calibration (60 seconds):
- “Do you want a gentle coach or a straight shooter?”
- “Do you want detailed plans or a simple Top 3?”
- “Do reminders help or annoy you?”
- “When overwhelmed, do you want (A) smaller steps or (B) harder push?”

Store results as:

```ts
type PsychStyle = {
  directness: number;      // 0..1
  structureNeed: number;   // 0..1
  reactanceRisk: number;   // 0..1  (if high: avoid bossy language)
  shameSensitivity: number;// 0..1  (if high: avoid streak-shaming)
  noveltyNeed: number;     // 0..1  (if high: rotate tactics)
};
```

You can optionally map some of this loosely to Big Five-style traits, but only as *internal guidance* (never show “you’re neurotic”). 

---

## 5) How the “partner engine” decides what to do (clear rules)
Use a deterministic policy layer so the AI is consistent:

### Prioritization rule stack
1) deadlines & consequences (CRITICAL)
2) dependencies (blockers)
3) goal alignment (moves life forward)
4) energy match (hard tasks when energy high)
5) quick win to reduce overwhelm

### When user is overwhelmed (Fogg / SDT behavior)
- reduce scope (Top 1–3 tasks)
- make tasks smaller (increase ability)
- prompt gently (avoid reactance)
- focus on competence: “one tiny win now” 

### Convert vague goals into “if-then” (implementation intentions)
When you detect “I need to work out/read/meditate,” create:
- a micro-habit suggestion
- an if-then plan
Example: “If I finish brushing at night, then I do 1 minute of stretching.” 

---

## 6) “Live tasks” implementation (how user input updates the app in real time)
### Step-by-step event flow (Convex-friendly)
1) User sends message (web or Telegram)
2) Create `events` row
3) Run `processEvent(eventId)` action:
   - load user context
   - call LLM with system prompt
   - parse/validate output with `PartnerEngineOutput` Zod schema
4) Apply `actions[]` in one mutation:
   - idempotency: `clientRef` prevents duplicates
   - authorization: must match `userId`
5) Save assistant message

**Result:** user types, app updates instantly, and the response is consistent + safe.

---

## 7) What to add to your coach prompts (copy/paste guidance)
In your coach system prompt, include these rules:

- You are a productivity + life-structure coach, **not a therapist**
- Never diagnose mental health conditions
- Ask permission before being intense (“Want tough-love or gentle mode?”)
- Use MI tone when resistance appears (“What feels hard about this?”) 
- Always provide:
  - empathy line (1–2 sentences)
  - Top 3
  - quick win (≤ 2 minutes)
  - one question only

---

## 8) Minimal scope that still feels “complex and personal”
If you build only these 4 loops, it will feel like a real partner:

1) **Dump loop** (anytime): parse → tasks → Today updated
2) **Morning check-in** (1 minute): energy/time → Top 3 plan
3) **Midday nudge** (optional): “Start Task #1?” (✅/❌)
4) **Evening review** (1 minute): done/blocked → adjust tomorrow + one insight

That’s enough for “partner feel” without creating a brittle mega-system.

---

## 9) Note: you said “3 last ideas” but only listed 2
I implemented these two fully as a spec. If there’s a third idea you meant to include, you can drop it in and it slots naturally into the same architecture (as another event type + action set).

If you want, I’ll convert the above into a single coder-facing document titled:
`RESURGO_PARTNER_ENGINE_SPEC.md` (with file paths + acceptance tests + rollout plan).

# RESURGO — “Partner System” + Psychology-Aware Coaching + Free/Low-Cost Multi‑Model AI + Moodboard Maker (Coder AI Document)
Date: 2026‑02‑28  
Goal: implement the 3 new ideas **safely, robustly, and without overbuilding**.

---

## 0) Product intent (what we’re building)
You want Resurgo to feel like a **real partner**:
- The user can **dump thoughts**, and Resurgo **understands context**, responds like a coach, and **updates the app state live** (tasks/habits/goals/preferences) instead of being “just chat”.
- The coach uses **light psychology basics** (behavior change + communication style matching) to help users follow through—**not therapy**, no diagnosis.
- Resurgo generates a **Moodboard / Vision board** aligned with the user’s goals + identity + preferences, and keeps it updated as the user evolves.

---

## 1) High-level architecture: “Partner Engine” (stateful, event-driven, validated actions)
### 1.1 Core idea
Every user input produces **two outputs**:
1) `assistant_message` (human response)
2) `actions[]` (structured, validated changes to app state)

**The AI never writes directly to DB.** It proposes actions; the server validates and applies them.

### 1.2 Minimal pipeline
**Ingest Event → Build Context → LLM → Validate JSON → Apply Actions (transaction) → Store response**

Data objects:
- `events` (every inbound message / onboarding answer / telegram message)
- `assistant_messages`
- `user_profile` (preferences + psychology/coaching style vector + memory summary)
- existing `tasks`, `habits`, `goals`, etc.

Why this works: it creates the “partner feels alive” effect because **the workspace changes immediately** based on what the user says—without unsafe freeform DB writes.

---

## 2) Psychology basics: what to “teach” the bots (safe + practical)
### 2.1 What we use (lightweight, evidence-based, not clinical)
Use these frameworks as **coaching heuristics**:

1) **Fogg Behavior Model**: behavior happens when **Motivation + Ability + Prompt** converge. If behavior fails, one is missing. Product implication: when user struggles, reduce difficulty (Ability), improve timing (Prompt), or reconnect to meaning (Motivation).   
2) **Implementation intentions (If‑Then planning)**: turning intentions into “if X then Y” improves follow-through (supported by meta-analytic evidence). Product implication: convert habits/goals into simple if-then plans.   
3) **Motivational Interviewing principles** (communication style): express empathy, develop discrepancy, roll with resistance, support self‑efficacy. Product implication: avoid nagging; when user resists, don’t fight—ask, reflect, offer choices. 

**Safety boundary:** this is productivity + behavior design, **not mental health treatment**. No diagnosis. No “you have ADHD” claims.

### 2.2 “Determine what kind of person it is” (do this ethically)
Instead of “personality diagnosis,” implement a **coaching-style vector** based on:
- explicit onboarding answers (user chooses tone/structure)
- observed behavior (completion rate, snooze rate, response to reminders)

Store something like:

```ts
type CoachingStyle = {
  directness: number;      // 0..1
  structureNeed: number;   // 0..1
  reminderTolerance: number;// 0..1
  shameSensitivity: number;// 0..1  (higher => no streak-shame)
  overwhelmRisk: number;   // 0..1
};
```

Then prompt the coach to adapt:
- high reactance → fewer commands, more choices
- high overwhelm → smaller steps, “Top 1–3 only”
- high structureNeed → step-by-step plan + checklists

---

## 3) Onboarding: “deep analysis” without friction
### 3.1 Onboarding goals
- Build enough context for personalization
- Assign user to a **helpful non-medical segment** (e.g., “Overwhelmed Starter”, “Builder”, “Burnout Recovery”, “Routine Seeker”)
- Populate the product immediately: tasks + first habit + reminders + moodboard starter

### 3.2 Onboarding format: conversational + progressive
Do not use a 30-question form. Use **chat onboarding** with 6–10 prompts max:
1) “What’s on your mind right now? Dump it.”
2) “What’s your biggest stressor this month?”
3) “What matters most: health / money / career / relationships / learning?”
4) “When do you have energy? morning/afternoon/night/none lately”
5) “Do you want gentle or direct coaching?”
6) “Reminders: minimal / normal / intense”
7) “Pick 1 identity statement you want to become” (drives moodboard + habits)
8) “Any hard deadlines coming up?”

Each answer becomes an `event`, which runs through the Partner Engine to update state.

---

## 4) Multi-model AI solution (free-first, robust, doesn’t explode costs)
### 4.1 Reality check on “all free keys, no costs”
You can design a system that is **nearly costless for early users**, but you **cannot guarantee zero cost forever** because “free tiers” are rate-limited and can change. Build the system to:
- prefer **offline/local** AI when available
- use **free tiers** as primary for early stage
- degrade gracefully to rules-based behavior when quotas hit
- optionally support **BYOK (bring your own key)** for power users

### 4.2 Free-tier / low-cost sources you can rely on (with real constraints)
- **Groq** has a free tier with strict rate limits; exact limits are shown in their console, and they explicitly state free tier is capped by rate limits.   
- **OpenRouter Free** limits free users to **50 requests/day** and 20 rpm (good as fallback, not as primary).   
- **Cloudflare Workers AI** includes a daily free allocation of **10,000 “Neurons”**; usage above that requires paid plan.   
- **Gemini API quotas** exist and can be restrictive depending on tier/model; quotas and changes are managed through Google’s quota system (do not assume high free usage). 

### 4.3 AI Router (recommended behavior)
Implement a router with:
- **Primary:** your offline/local model (if truly available) for parsing + basic replies
- **Secondary:** Groq (fast text) for structured extraction + coaching
- **Fallback:** OpenRouter free models only when necessary (because 50/day cap)   
- **Optional:** Cloudflare Workers AI for “last resort” text or image generation within neuron limits 

**Critical:** Do not try to “evade” quotas by rotating free accounts/keys. That’s a ToS risk.

### 4.4 How to keep the system comprehensive *without* multi-model overkill
Use a **2-stage** design (cheap + reliable):
- Stage A (Extractor): strict JSON parsing (low temperature)
- Stage B (Coach): human response generation using validated extracted state

Optional Stage C (Safety/Quality): a fast “lint” pass to ensure output is short, kind, and actionable.

---

## 5) Partner Engine output format (strict JSON + actions)
### 5.1 Action DSL (the most important safety layer)
Define a strict schema for actions the AI can propose:

- `task.upsert`
- `habit.suggest` / `habit.create`
- `goal.create`
- `pref.set`
- `nudge.schedule`
- `moodboard.update`

Then apply them via server-side code only after validation.

### 5.2 Production-safe JSON validation approach
- Zod schema
- JSON extraction (handle code blocks / leading text)
- sanitize trailing commas
- retry with repair prompt
- log failures (redacted)

(You already have a robust Brain Dump parser pattern—reuse it for Partner Engine outputs.)

---

## 6) Moodboard Maker (Idea #3): build it as a “Vision Board + Identity Board”
### 6.1 What the moodboard is in Resurgo
A moodboard isn’t just pretty pictures. In Resurgo it should function as:
- the user’s “why” (identity + goals + vibe)
- a motivation anchor during low-energy days
- a summary artifact that evolves as the user evolves

### 6.2 UX: “Moodboard that builds itself”
You want zero setup. So:
- During onboarding, collect 5–8 attributes:
  - goals
  - identity statement (“I’m becoming someone who ___”)
  - preferred aesthetic (minimal, cyberpunk, calm, nature, luxury, etc.)
  - colors they like
  - “what you’re escaping” (burnout/chaos/overwhelm)
- Then auto-generate:
  - 12–24 tiles (images + keywords + short affirmations)
  - 1–3 “North Star cards” (top goal + reason)
  - color palette (4–6 colors)
  - optional typography style

### 6.3 Implementation options (free-first)
**Option A (recommended v1): retrieval-based moodboard (no image generation)**
Use free photo APIs + attribution rules:
- Unsplash API is usable but requires attribution, hotlinking returned URLs, and download endpoint tracking.   
- Moodboard UX inspiration: Milanote shows modern moodboards as flexible boards with drag/drop and mixed media.   

Flow:
1) AI generates `moodboard_query_terms[]` from user profile (e.g., “calm morning routine”, “focused workspace”, “fitness outdoors”)
2) Server fetches images
3) Store tile layout + metadata in DB
4) Render board with drag/drop + auto-layout button

**Option B: generative images (only if you can keep it truly free)**
You can attempt Cloudflare Workers AI image generation within neuron free limits, but it’s limited and not guaranteed for scale.   
Better long-term: local Stable Diffusion on a cheap GPU box (fixed monthly cost, not per-call), but that’s not “free”.

### 6.4 Moodboard data model
- `moodboards`
  - `userId`
  - `title`
  - `palette[]`
  - `tiles[]` (type=image/text/quote/goal)
  - `createdAt`, `updatedAt`
- `moodboard_tiles`
  - `tileId`, `boardId`
  - `type`
  - `content`
  - `source` (unsplash url + attribution block)
  - `x,y,w,h,zIndex`

### 6.5 Auto-layout (must-have)
Users will dump lots of images. Provide:
- “Auto-arrange grid”
- “Auto-arrange collage”
- “Auto-group by theme”

---

## 7) WhatsApp note (so we don’t build the wrong thing)
If you’re considering WhatsApp as a main AI partner interface: Meta/WhatsApp updated terms to prohibit general-purpose AI assistants when AI is the primary functionality, effective **Jan 15, 2026**. That makes WhatsApp risky as the main channel for Resurgo’s AI partner concept.   
Recommendation: Telegram-first for “chat with your life,” WhatsApp only for narrow notifications if at all.

---

## 8) Deliverables checklist (what to implement next)
### P0 — “Partner Engine MVP”
1) `events` ingestion across:
   - web chat
   - onboarding answers
   - telegram messages
2) Partner Engine LLM call returns:
   - `assistantMessage`
   - `actions[]`
   - `memoryPatch`
3) Validate with Zod; apply actions transactionally
4) UI: Chat panel + “changes applied” feed (tasks created/updated)

### P1 — Psychology-aware coaching behavior
1) Onboarding: coaching preferences + overwhelm signals
2) Store `CoachingStyle` vector
3) Prompt coach with the vector + behavior rules:
   - Fogg: lower ability first, then prompt, then motivation   
   - If-then plans for habits   
   - MI principles to avoid nagging   
4) Daily check-in loop + evening review

### P2 — Moodboard Maker
1) Onboarding extracts moodboard preferences
2) Create first board automatically
3) Render moodboard page in app
4) Add: auto-layout + “update moodboard” action when goals change

### P3 — Free-first multi-model AI router
1) Implement provider router (offline → Groq → OpenRouter → CF Workers AI)
2) Add:
   - per-user rate limits
   - caching of parsed dumps + summaries
   - “low-AI mode” fallback rules when quotas hit
3) Optional: BYOK mode for users who want unlimited usage

---

## 9) Billing note (India + global)
If you are using Clerk Billing: Clerk’s docs state Billing is not supported in India and several other countries; Billing supports USD only and is not MoR.   
Action: treat billing as a separate module + keep entitlements in Convex so you can swap billing provider later without rewriting product access logic.

---

## 10) Security & privacy requirements (non-negotiable)
- LLM calls server-side only (no keys client-side)
- strict JSON schema validation for any state-changing AI output
- redact logs (never store raw brain dumps in logs)
- rate limit brain dump + partner engine endpoints
- never diagnose; include “not medical advice” language in coach UI

---

## 11) Implementation note to coder AI (how to avoid overdoing it)
- Don’t build a giant “agent framework.”
- Build 1 orchestrator that outputs actions (validated).
- Keep action types limited at first.
- Ship the smallest set that creates the “partner feel”:
  - brain dump → tasks
  - today plan → priorities
  - nudges → follow-through
  - moodboard → identity anchor

---

### Appendix: Key sources used (for engineering decisions)
- Clerk Billing limitations: USD-only, not MoR, unsupported countries list including India.   
- OpenRouter free-tier limits (50 req/day).   
- Groq free tier is capped by rate limits (check console).   
- Cloudflare Workers AI free allocation (10,000 neurons/day).   
- WhatsApp Business API policy ban for general-purpose AI assistants effective Jan 15, 2026.   
- Fogg Behavior Model (Motivation + Ability + Prompt).   
- Implementation intentions (if‑then plans) evidence base.   
- MI principles overview (empathy, discrepancy, resistance, self-efficacy).   
- Unsplash API rules (attribution + hotlink + download endpoint).   
- Moodboard product inspiration (Milanote explanation + board concept). 

--- 

Let me research mood board generation, free AI image APIs, user segmentation frameworks, and how all three systems integrate into a unified onboarding-to-personalization pipeline.Here is the **complete addendum** for your master document — covering the AI-Generated Vision/Mood Board system, the enhanced onboarding user segmentation pipeline, and free image generation integration. Send this alongside the previous master documents to your coding AI.

---

# 📎 MASTER DOCUMENT — ADDENDUM: SECTIONS 24, 25, & 26
## (Add these after Sections 22 & 23)

---

# SECTION 24: AI-GENERATED VISION/MOOD BOARD SYSTEM

## The Concept — Why This Is A Killer Feature

No habit tracker or productivity app has EVER integrated an AI-generated vision board that's **powered by the user's own goals, psychology profile, and onboarding data.** Existing vision board apps like Perfectly Happy (250,000+ users, 4.8 stars) are standalone — they don't connect to your actual tasks, habits, or progress.

By combining visualization, daily affirmations, gratitude journaling and mood tracking into one seamless experience, these apps offer a comprehensive solution for anyone looking to manifest their goals. But they're all **disconnected** from actual productivity systems.

RESURGO's Vision Board is different:
- It's **generated by AI** based on the user's actual goals, onboarding answers, and psychology profile
- It **updates automatically** as goals change or get completed
- It uses **free AI image generation** (zero cost)
- It serves as both motivation AND a daily reminder integrated into the dashboard
- It combines the best of what existing apps offer: visualization tools with slideshows and daily reminders, collaboration features, inspirational content with built-in libraries of quotes and affirmations, progress tracking, and affirmation alerts

## Free AI Image Generation APIs (Zero Cost)

### Primary: Cloudflare Workers AI

You can deploy your own free AI image generation API using Cloudflare Workers, with up to 100,000 API calls per day, generating stunning images from text prompts using powerful models like Stable Diffusion XL.

Workers AI allows you to run AI models in a serverless way, without having to worry about scaling, maintaining, or paying for unused infrastructure. You can invoke models running on GPUs on Cloudflare's network from your own code.

### Secondary: Google AI Studio (Gemini Image Gen)

As of February 2026, Gemini 2.0 Flash is available completely free of charge in Google AI Studio for all available regions. For developers who want to experiment without committing any budget, Google provides several genuinely free paths to Gemini image generation.

This means you can generate images at absolutely zero cost, though you'll face rate limits that prevent high-volume production use.

### Tertiary: Puter.js (Zero Config)

Puter.js provides access to powerful image generation models including GPT Image, DALL-E 2, DALL-E 3, Gemini 2.5 Flash Image Preview, Flux.1 Schnell, Flux.1 Kontext, Flux 1.1 Pro, Stable Diffusion 3, and Stable Diffusion XL directly from your frontend code.

This model enables developers to offer advanced image generation capabilities to users at no cost to themselves, without any API keys or server-side setup. You can use Puter.js without any API keys or sign-ups.

### Setup: Cloudflare Workers AI Image Generator

```
SETUP STEPS:
1. Go to dash.cloudflare.com → create free account
2. Go to Workers & Pages → Create Worker
3. Name it "resurgo-image-gen"
4. Deploy the code below
5. Go to Settings → Variables → Add API_KEY
6. Go to Settings → Variables → Service bindings → Add AI → Workers AI
7. Save and Deploy
8. Your endpoint: https://resurgo-image-gen.YOUR-SUBDOMAIN.workers.dev
9. Add to Vercel env: CLOUDFLARE_IMAGE_API_URL and CLOUDFLARE_IMAGE_API_KEY
```

### Cloudflare Worker Code:

```javascript
// Deploy this as a Cloudflare Worker at dash.cloudflare.com

export default {
  async fetch(request, env) {
    const API_KEY = env.API_KEY;

    // Auth check
    const auth = request.headers.get("Authorization");
    if (auth !== `Bearer ${API_KEY}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const { prompt, width, height } = await request.json();

      if (!prompt) {
        return new Response(JSON.stringify({ error: "Prompt required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Generate image using Stable Diffusion XL
      const result = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        {
          prompt: prompt,
          width: width || 1024,
          height: height || 1024,
        }
      );

      // Return as base64 for easy frontend consumption
      const base64 = btoa(
        String.fromCharCode(...new Uint8Array(result))
      );

      return new Response(
        JSON.stringify({
          success: true,
          image: `data:image/png;base64,${base64}`,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Generation failed", details: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
};
```

## The Vision Board Generator (Backend)

```typescript
// File: src/lib/ai/vision-board/generator.ts

import { callAI } from '../provider-router';
import type { UserContext } from '../types';
import type { PsychProfile } from '../psychology/profile-schema';

// ============================================
// BOARD THEME TYPES
// ============================================

export interface VisionBoardTheme {
  colorPalette: string[];    // 5 hex colors
  mood: string;              // "warm-ambitious" | "calm-focused" | "energetic-bold" etc
  fontStyle: string;         // "serif-elegant" | "sans-modern" | "mono-tech"
  layoutStyle: string;       // "grid" | "collage" | "minimal" | "mosaic"
}

export interface VisionBoardPanel {
  id: string;
  goalTitle: string;
  imagePrompt: string;       // AI-crafted prompt for image generation
  affirmation: string;       // Personal affirmation tied to this goal
  category: string;          // HEALTH | CAREER | PERSONAL | FINANCE etc
  progress: number;          // 0-100 from goal tracking
  position: number;          // Order on the board
}

export interface VisionBoardConfig {
  userId: string;
  title: string;             // "Your 2026 Vision" or custom
  theme: VisionBoardTheme;
  panels: VisionBoardPanel[];
  centerAffirmation: string; // Big affirmation in the center
  generatedAt: string;
  version: number;
}

// ============================================
// GENERATE BOARD CONFIG FROM USER DATA
// ============================================

const BOARD_GENERATION_PROMPT = `
# ROLE
You are RESURGO's Vision Board Designer. You create deeply personal, 
psychologically-informed vision boards for users based on their goals, 
personality, life situation, and emotional state.

# YOUR TASK
Generate a vision board configuration that will:
1. Visually represent the user's goals in a way that resonates with their 
   personality type and emotional needs
2. Create image prompts that are inspirational but REALISTIC (no fantasy/
   magical thinking — grounded visualization)
3. Write affirmations that match their communication style preference
4. Choose a color palette and mood that aligns with their psychological profile

# RULES FOR IMAGE PROMPTS
- Create vivid, specific text-to-image prompts for Stable Diffusion
- Focus on OUTCOMES not processes ("person celebrating at a finish line" 
  not "person running")
- Include style keywords: "photorealistic, warm lighting, aspirational, 
  high quality, 4K"
- Never include text in images (AI struggles with text rendering)
- Make prompts culturally neutral and inclusive
- Each prompt must be unique and directly tied to a specific goal

# RULES FOR AFFIRMATIONS
- First person, present tense ("I am" not "I will be")
- Specific to their goal, not generic motivational quotes
- Match their communication style:
  - Gentle: soft, nurturing language
  - Direct: clear, assertive statements
  - Challenging: bold, pushing boundaries
  - Analytical: logical, evidence-based

# RULES FOR THEME
- High neuroticism users → calming colors (blues, greens, soft neutrals)
- High extraversion users → vibrant colors (warm oranges, energetic yellows)
- High conscientiousness → clean, structured layouts (grid, minimal)
- High openness → creative layouts (collage, mosaic, unexpected combos)
- Low energy/overwhelmed → simplified board (fewer panels, more whitespace)

# USER CONTEXT
${'{USER_CONTEXT}'}

# PSYCHOLOGY PROFILE
${'{PSYCH_PROFILE}'}

# OUTPUT FORMAT (JSON only, no other text)
{
  "title": "string — personal title for their board",
  "theme": {
    "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
    "mood": "string — e.g., warm-ambitious, calm-focused",
    "fontStyle": "serif-elegant | sans-modern | mono-tech",
    "layoutStyle": "grid | collage | minimal | mosaic"
  },
  "panels": [
    {
      "goalTitle": "string — from their actual goals",
      "imagePrompt": "string — detailed SD prompt for this goal",
      "affirmation": "string — personal affirmation for this goal",
      "category": "HEALTH|CAREER|PERSONAL|FINANCE|LEARNING|RELATIONSHIP",
      "position": number
    }
  ],
  "centerAffirmation": "string — the BIG overarching affirmation"
}
`;

export async function generateVisionBoardConfig(
  userContext: UserContext,
  psychProfile: PsychProfile | null
): Promise<VisionBoardConfig | null> {
  const prompt = BOARD_GENERATION_PROMPT
    .replace('{USER_CONTEXT}', JSON.stringify({
      name: userContext.name,
      goals: userContext.goals,
      lifeSituation: userContext.lifeSituation,
      communicationStyle: userContext.communicationStyle,
    }, null, 2))
    .replace('{PSYCH_PROFILE}', psychProfile
      ? JSON.stringify({
          bigFive: psychProfile.bigFive,
          motivational: psychProfile.motivational,
          behavioral: {
            communicationPreferences: psychProfile.behavioral.communicationPreferences,
            stressCopingStyle: psychProfile.behavioral.stressCopingStyle,
          },
        }, null, 2)
      : 'Not yet available — use balanced defaults'
    );

  try {
    const response = await callAI({
      systemPrompt: prompt,
      userMessage: 'Generate a personalized vision board configuration.',
      taskType: 'analysis',
      temperature: 0.8, // Higher creativity for vision boards
      maxTokens: 3000,
      jsonMode: true,
    });

    const parsed = JSON.parse(
      response.content.substring(
        response.content.indexOf('{'),
        response.content.lastIndexOf('}') + 1
      )
    );

    // Add metadata
    const config: VisionBoardConfig = {
      userId: userContext.email || '',
      title: parsed.title,
      theme: parsed.theme,
      panels: parsed.panels.map((p: VisionBoardPanel, i: number) => ({
        ...p,
        id: `panel-${i}-${Date.now()}`,
        progress: userContext.goals?.find(
          g => g.title.toLowerCase().includes(p.goalTitle.toLowerCase())
        )?.progress || 0,
        position: p.position || i,
      })),
      centerAffirmation: parsed.centerAffirmation,
      generatedAt: new Date().toISOString(),
      version: 1,
    };

    return config;
  } catch (error) {
    console.error('[VisionBoard] Generation failed:', error);
    return null;
  }
}
```

## Image Generation Service

```typescript
// File: src/lib/ai/vision-board/image-service.ts

// ============================================
// MULTI-PROVIDER IMAGE GENERATION
// ============================================

interface ImageResult {
  success: boolean;
  imageData?: string;    // base64 data URL
  provider: string;
  error?: string;
}

// Provider 1: Cloudflare Workers AI (PRIMARY — 100K/day free)
async function generateWithCloudflare(prompt: string): Promise<ImageResult> {
  try {
    const response = await fetch(process.env.CLOUDFLARE_IMAGE_API_URL!, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_IMAGE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        width: 1024,
        height: 1024,
      }),
    });

    if (!response.ok) throw new Error(`Cloudflare: ${response.status}`);

    const data = await response.json();
    return {
      success: true,
      imageData: data.image,
      provider: 'cloudflare',
    };
  } catch (error) {
    return {
      success: false,
      provider: 'cloudflare',
      error: (error as Error).message,
    };
  }
}

// Provider 2: Google AI Studio Gemini (SECONDARY)
async function generateWithGemini(prompt: string): Promise<ImageResult> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GOOGLE_AI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Generate an image: ${prompt}` }]
          }],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
          },
        }),
      }
    );

    if (!response.ok) throw new Error(`Gemini: ${response.status}`);

    const data = await response.json();
    // Extract image from Gemini response
    const imagePart = data.candidates?.[0]?.content?.parts?.find(
      (p: { inlineData?: unknown }) => p.inlineData
    );

    if (imagePart?.inlineData) {
      return {
        success: true,
        imageData: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
        provider: 'gemini',
      };
    }

    throw new Error('No image in Gemini response');
  } catch (error) {
    return {
      success: false,
      provider: 'gemini',
      error: (error as Error).message,
    };
  }
}

// ============================================
// MAIN: Generate with fallback
// ============================================

export async function generateImage(prompt: string): Promise<ImageResult> {
  // Try Cloudflare first (100K free/day)
  const cf = await generateWithCloudflare(prompt);
  if (cf.success) return cf;

  // Fallback to Gemini
  const gemini = await generateWithGemini(prompt);
  if (gemini.success) return gemini;

  // All failed
  return {
    success: false,
    provider: 'none',
    error: 'All image providers failed',
  };
}

// Generate all images for a vision board (with rate limiting)
export async function generateBoardImages(
  panels: Array<{ id: string; imagePrompt: string }>
): Promise<Map<string, string>> {
  const images = new Map<string, string>();

  for (const panel of panels) {
    const result = await generateImage(panel.imagePrompt);
    if (result.success && result.imageData) {
      images.set(panel.id, result.imageData);
    }
    // Rate limit: wait 2 seconds between generations
    await new Promise(r => setTimeout(r, 2000));
  }

  return images;
}
```

## API Route for Vision Board

```typescript
// File: src/app/api/vision-board/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/../convex/_generated/api';
import { generateVisionBoardConfig } from '@/lib/ai/vision-board/generator';
import { generateBoardImages } from '@/lib/ai/vision-board/image-service';
import { getUserContext } from '@/lib/user-context';
import type { PsychProfile } from '@/lib/ai/psychology/profile-schema';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Get user context
    const userContext = await getUserContext(userId);

    // 2. Get psychology profile
    let psychProfile: PsychProfile | null = null;
    try {
      const profileDoc = await convex.query(api.psychology.getProfile, {
        userId: userContext.convexUserId,
      });
      if (profileDoc) psychProfile = JSON.parse(profileDoc.profile);
    } catch { /* No profile yet */ }

    // 3. Generate board configuration
    const config = await generateVisionBoardConfig(userContext, psychProfile);
    if (!config) {
      return NextResponse.json(
        { error: 'Failed to generate board config' },
        { status: 500 }
      );
    }

    // 4. Generate images for each panel
    const images = await generateBoardImages(config.panels);

    // 5. Combine config with images
    const boardWithImages = {
      ...config,
      panels: config.panels.map(panel => ({
        ...panel,
        imageData: images.get(panel.id) || null,
      })),
    };

    // 6. Save to database
    await convex.mutation(api.visionBoards.save, {
      userId: userContext.convexUserId,
      config: JSON.stringify(boardWithImages),
      version: config.version,
    });

    return NextResponse.json({
      success: true,
      board: boardWithImages,
    });

  } catch (error) {
    console.error('[VisionBoard] Generation error:', error);
    return NextResponse.json(
      { error: 'Vision board generation failed' },
      { status: 500 }
    );
  }
}
```

## Convex Schema & Mutations

```typescript
// Add to convex/schema.ts:

visionBoards: defineTable({
  userId: v.id('users'),
  config: v.string(),        // JSON string of VisionBoardConfig (with images)
  version: v.number(),
  isActive: v.boolean(),     // Only one active board at a time
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_user', ['userId'])
  .index('by_user_active', ['userId', 'isActive']),
```

```typescript
// File: convex/visionBoards.ts

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const save = mutation({
  args: {
    userId: v.id('users'),
    config: v.string(),
    version: v.number(),
  },
  handler: async (ctx, args) => {
    // Deactivate previous boards
    const existing = await ctx.db
      .query('visionBoards')
      .withIndex('by_user_active', (q) =>
        q.eq('userId', args.userId).eq('isActive', true)
      )
      .collect();

    for (const board of existing) {
      await ctx.db.patch(board._id, { isActive: false });
    }

    // Save new board
    return await ctx.db.insert('visionBoards', {
      userId: args.userId,
      config: args.config,
      version: args.version,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const getActive = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('visionBoards')
      .withIndex('by_user_active', (q) =>
        q.eq('userId', args.userId).eq('isActive', true)
      )
      .first();
  },
});
```

## Frontend: Vision Board Component

```tsx
// File: src/components/VisionBoard.tsx

'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';
import { usePlan } from '@/hooks/usePlan';
import { UpgradePrompt } from './UpgradePrompt';

interface VisionBoardPanel {
  id: string;
  goalTitle: string;
  imageData: string | null;
  affirmation: string;
  category: string;
  progress: number;
  position: number;
}

interface VisionBoardConfig {
  title: string;
  theme: {
    colorPalette: string[];
    mood: string;
    fontStyle: string;
    layoutStyle: string;
  };
  panels: VisionBoardPanel[];
  centerAffirmation: string;
}

export function VisionBoard({ userId }: { userId: string }) {
  const { can } = usePlan();
  const [generating, setGenerating] = useState(false);
  const boardDoc = useQuery(api.visionBoards.getActive, { userId: userId as any });

  // Free users get ONE board generation; Pro gets unlimited regeneration
  if (!can('advancedAnalytics') && !boardDoc) {
    // Free users can generate their first board
  }

  const board: VisionBoardConfig | null = boardDoc
    ? JSON.parse(boardDoc.config)
    : null;

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch('/api/vision-board/generate', {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Generation failed');
      // Board will appear via Convex real-time subscription
    } catch (error) {
      console.error('Board generation failed:', error);
    } finally {
      setGenerating(false);
    }
  }

  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] 
                      border border-dashed border-zinc-700 rounded-lg p-8">
        <h2 className="text-xl text-green-400 mb-2 font-mono">
          {'>'} VISION_BOARD_
        </h2>
        <p className="text-zinc-400 text-center mb-6 max-w-md">
          Generate a personalized vision board based on your goals,
          personality, and where you are in life. AI creates custom
          images and affirmations just for you.
        </p>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-green-500 text-black px-6 py-3 rounded font-bold
                     hover:bg-green-400 disabled:opacity-50 disabled:cursor-wait"
        >
          {generating ? '⏳ Generating your board...' : '✨ Generate My Vision Board'}
        </button>
        {generating && (
          <p className="text-zinc-500 text-sm mt-3">
            This takes 30-60 seconds. Creating your personalized images...
          </p>
        )}
      </div>
    );
  }

  const layoutClass = {
    grid: 'grid grid-cols-2 md:grid-cols-3 gap-4',
    collage: 'flex flex-wrap gap-3',
    minimal: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    mosaic: 'grid grid-cols-3 gap-2 auto-rows-[200px]',
  }[board.theme.layoutStyle] || 'grid grid-cols-2 gap-4';

  return (
    <div className="p-6 rounded-xl"
         style={{ background: `linear-gradient(135deg, ${board.theme.colorPalette[0]}15, ${board.theme.colorPalette[1]}15)` }}>

      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-2"
          style={{ color: board.theme.colorPalette[0] }}>
        {board.title}
      </h2>

      {/* Center Affirmation */}
      <p className="text-center text-lg text-zinc-300 mb-6 italic">
        "{board.centerAffirmation}"
      </p>

      {/* Panels */}
      <div className={layoutClass}>
        {board.panels.map((panel) => (
          <div
            key={panel.id}
            className="relative rounded-lg overflow-hidden group cursor-pointer
                       border border-zinc-800 hover:border-zinc-600 transition"
            style={{
              gridRow: board.theme.layoutStyle === 'mosaic' && panel.position === 0
                ? 'span 2' : undefined,
            }}
          >
            {/* Image */}
            {panel.imageData ? (
              <img
                src={panel.imageData}
                alt={panel.goalTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-zinc-800 flex items-center justify-center">
                <span className="text-zinc-600">📷</span>
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100
                            transition-opacity flex flex-col justify-end p-4">
              <span className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: board.theme.colorPalette[2] }}>
                {panel.category}
              </span>
              <h3 className="text-white font-bold text-sm mb-1">
                {panel.goalTitle}
              </h3>
              <p className="text-zinc-300 text-xs italic">
                "{panel.affirmation}"
              </p>

              {/* Progress bar */}
              <div className="mt-2 h-1 bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${panel.progress}%`,
                    backgroundColor: board.theme.colorPalette[0],
                  }}
                />
              </div>
              <span className="text-zinc-500 text-xs mt-1">
                {panel.progress}% complete
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Regenerate button (Pro only) */}
      {can('advancedAnalytics') && (
        <div className="text-center mt-6">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="text-sm text-zinc-500 hover:text-green-400 transition"
          >
            {generating ? '⏳ Regenerating...' : '🔄 Regenerate Board'}
          </button>
        </div>
      )}
    </div>
  );
}
```

## Environment Variables for Image Generation:

```env
# Add to Vercel env vars:
CLOUDFLARE_IMAGE_API_URL=https://resurgo-image-gen.YOUR-SUBDOMAIN.workers.dev
CLOUDFLARE_IMAGE_API_KEY=your-strong-secret-key
# Google AI key already added from Section 6
```

---

# SECTION 25: COMPREHENSIVE ONBOARDING USER SEGMENTATION

## The Onboarding Pipeline — How Users Get Analyzed and Grouped

User segmentation in onboarding refers to the process of categorizing and grouping users based on specific characteristics, behaviors, or demographics. The goal is to divide a user base into distinct segments to create a tailored user onboarding experience.

Personalized onboarding increases activation rates by 30–50% by eliminating cognitive translation costs.

Using the welcome screen to segment your new users by the goals they want to achieve can be game-changing. You will get them to accomplish their jobs to be done faster, reduce their time-to-value, and generally help them activate much sooner than if you drag them on a one-size-fits-all product tour.

### The Four Segmentation Layers Combined

The most effective practice involves combining demographics, behavior, and preferences. This holistic approach allows for nuanced user categorization, enabling a more refined onboarding experience.

RESURGO uses four layers simultaneously:

1. **Psychographic** — Understand users' attitudes, interests, values, and motivations. This segmentation helps create onboarding experiences that resonate with users on a deeper level, addressing their unique needs and aspirations.

2. **Behavioral** — Analyze user behavior and actions within the onboarding process, such as feature usage, engagement levels, or completion of specific tasks. This helps target users who have stopped engaging.

3. **Experience Level** — Segment users based on their familiarity and expertise with similar products or services. This allows for customized onboarding experiences that cater to users' prior knowledge and skill levels.

4. **Customer Journey Stage** — Divide users based on their stages in the customer journey. This segmentation enables targeted onboarding strategies that address specific needs and goals at each stage.

## The User Archetype System

```typescript
// File: src/lib/ai/onboarding/archetypes.ts

// ============================================
// RESURGO USER ARCHETYPES
// Each archetype gets a different onboarding experience,
// different coach tone, different default settings,
// and different vision board style
// ============================================

export type UserArchetype =
  | 'the_rebuilder'      // Coming back from burnout/life crisis
  | 'the_optimizer'      // Already productive, wants to be better
  | 'the_scattered'      // ADHD/executive function challenges
  | 'the_seeker'         // Doesn't know what they want yet
  | 'the_ambitious'      // Clear goals, needs accountability
  | 'the_overwhelmed';   // Drowning, needs emergency simplification

export interface ArchetypeConfig {
  archetype: UserArchetype;
  label: string;
  description: string;
  // How the app behaves for this archetype:
  onboarding: {
    depthLevel: 'quick' | 'medium' | 'deep';
    skipBrainDump: boolean;
    autoCreateHabits: boolean;
    suggestedGoalCount: number;
  };
  coaching: {
    defaultTone: 'gentle' | 'direct' | 'challenging' | 'analytical';
    defaultCoach: string; // Coach persona ID
    checkInFrequency: 'twice_daily' | 'daily' | 'every_other_day';
    motivationalApproach: string;
  };
  ui: {
    dashboardComplexity: 'minimal' | 'standard' | 'full';
    showStreaks: boolean;
    showAnalytics: boolean;
    emergencyModeByDefault: boolean;
    visionBoardStyle: string;
  };
  firstAction: {
    type: 'brain_dump' | 'single_task' | 'goal_set' | 'coach_chat' | 'just_breathe';
    prompt: string;
  };
}

export const ARCHETYPE_CONFIGS: Record<UserArchetype, ArchetypeConfig> = {
  the_rebuilder: {
    archetype: 'the_rebuilder',
    label: 'The Rebuilder',
    description: 'Coming back from a tough time. Needs gentle rebuilding.',
    onboarding: {
      depthLevel: 'deep',
      skipBrainDump: false,
      autoCreateHabits: true,    // Start with simple defaults
      suggestedGoalCount: 2,     // Don't overwhelm
    },
    coaching: {
      defaultTone: 'gentle',
      defaultCoach: 'phoenix',   // The Comeback Specialist
      checkInFrequency: 'daily',
      motivationalApproach: 'Recovery is the goal. Small wins compound.',
    },
    ui: {
      dashboardComplexity: 'minimal',
      showStreaks: false,          // Streaks can feel punishing during rebuilding
      showAnalytics: false,
      emergencyModeByDefault: false,
      visionBoardStyle: 'calm-nature',
    },
    firstAction: {
      type: 'coach_chat',
      prompt: "Welcome back. There's no pressure here. Tell me one thing you want to be different this week.",
    },
  },

  the_optimizer: {
    archetype: 'the_optimizer',
    label: 'The Optimizer',
    description: 'Already productive, looking for that extra edge.',
    onboarding: {
      depthLevel: 'quick',
      skipBrainDump: false,
      autoCreateHabits: false,     // They have their own system
      suggestedGoalCount: 5,
    },
    coaching: {
      defaultTone: 'analytical',
      defaultCoach: 'atlas',       // The Strategic Planner
      checkInFrequency: 'daily',
      motivationalApproach: 'Data-driven improvement. Measure, iterate, optimize.',
    },
    ui: {
      dashboardComplexity: 'full',
      showStreaks: true,
      showAnalytics: true,
      emergencyModeByDefault: false,
      visionBoardStyle: 'clean-minimal',
    },
    firstAction: {
      type: 'brain_dump',
      prompt: "Dump everything on your plate. I'll organize and find the bottlenecks.",
    },
  },

  the_scattered: {
    archetype: 'the_scattered',
    label: 'The Scattered',
    description: 'ADHD/executive function challenges. Needs structure without rigidity.',
    onboarding: {
      depthLevel: 'medium',
      skipBrainDump: false,
      autoCreateHabits: true,
      suggestedGoalCount: 3,
    },
    coaching: {
      defaultTone: 'direct',
      defaultCoach: 'nova',        // The Energy Manager
      checkInFrequency: 'twice_daily',
      motivationalApproach: 'External structure is your friend, not your enemy. I\'ll be your working memory.',
    },
    ui: {
      dashboardComplexity: 'minimal',  // Less visual noise
      showStreaks: true,               // Gamification helps ADHD
      showAnalytics: false,            // Too much data is noise
      emergencyModeByDefault: false,
      visionBoardStyle: 'vibrant-colorful',
    },
    firstAction: {
      type: 'brain_dump',
      prompt: "I know your brain has 47 tabs open. Dump it ALL here. I'll sort the chaos.",
    },
  },

  the_seeker: {
    archetype: 'the_seeker',
    label: 'The Seeker',
    description: 'Doesn\'t know what they want. Needs exploration, not structure.',
    onboarding: {
      depthLevel: 'deep',
      skipBrainDump: true,        // No brain dump — they don't have tasks yet
      autoCreateHabits: true,     // Give them starter habits
      suggestedGoalCount: 1,      // Just ONE exploratory goal
    },
    coaching: {
      defaultTone: 'gentle',
      defaultCoach: 'sage',       // The Reflective Guide
      checkInFrequency: 'every_other_day',
      motivationalApproach: 'You don\'t need a destination to start walking. Let\'s explore.',
    },
    ui: {
      dashboardComplexity: 'minimal',
      showStreaks: false,
      showAnalytics: false,
      emergencyModeByDefault: false,
      visionBoardStyle: 'open-exploratory',
    },
    firstAction: {
      type: 'coach_chat',
      prompt: "There's no wrong answer here. What's been on your mind lately? Even if it's messy.",
    },
  },

  the_ambitious: {
    archetype: 'the_ambitious',
    label: 'The Ambitious',
    description: 'Clear goals, high energy, needs accountability not direction.',
    onboarding: {
      depthLevel: 'quick',
      skipBrainDump: false,
      autoCreateHabits: false,
      suggestedGoalCount: 5,
    },
    coaching: {
      defaultTone: 'challenging',
      defaultCoach: 'titan',       // The Performance Coach
      checkInFrequency: 'twice_daily',
      motivationalApproach: 'You know what you want. I\'ll make sure you don\'t let yourself off the hook.',
    },
    ui: {
      dashboardComplexity: 'full',
      showStreaks: true,
      showAnalytics: true,
      emergencyModeByDefault: false,
      visionBoardStyle: 'bold-ambitious',
    },
    firstAction: {
      type: 'goal_set',
      prompt: "Let's set your top 3 goals. What are you going after?",
    },
  },

  the_overwhelmed: {
    archetype: 'the_overwhelmed',
    label: 'The Overwhelmed',
    description: 'Everything feels like too much. Needs radical simplification.',
    onboarding: {
      depthLevel: 'quick',        // Don't add MORE to their plate
      skipBrainDump: false,       // Brain dump IS relief for them
      autoCreateHabits: false,    // Zero new commitments
      suggestedGoalCount: 1,      // ONE thing only
    },
    coaching: {
      defaultTone: 'gentle',
      defaultCoach: 'phoenix',
      checkInFrequency: 'daily',
      motivationalApproach: 'You don\'t need to do everything. You need to do ONE thing. Let\'s find it.',
    },
    ui: {
      dashboardComplexity: 'minimal',
      showStreaks: false,          // Pressure = bad
      showAnalytics: false,
      emergencyModeByDefault: true, // Start in emergency mode
      visionBoardStyle: 'calm-simple',
    },
    firstAction: {
      type: 'just_breathe',
      prompt: "Hey. Take a breath. You're here, and that's a start. Tell me one thing that's weighing on you the most right now. Just one.",
    },
  },
};
```

## The Archetype Detection Prompt

```typescript
// File: src/lib/ai/onboarding/archetype-detector.ts

import { callAI } from '../provider-router';
import type { UserArchetype } from './archetypes';

const DETECTION_PROMPT = `
# ROLE
You are RESURGO's User Archetype Detector. Based on the onboarding 
conversation, determine which archetype best matches this user.

# ARCHETYPES
1. the_rebuilder — Coming back from burnout, life crisis, major setback.
   SIGNALS: mentions past failures, "starting over", "getting back on track",
   references to difficult period, loss, or recovery.

2. the_optimizer — Already has systems, wants improvement.
   SIGNALS: mentions existing tools they use, specific metrics, "efficiency",
   "optimize", already has goals defined, tech-savvy language.

3. the_scattered — ADHD, executive function challenges, chronic disorganization.
   SIGNALS: mentions ADHD directly, "I start things but never finish", "I forget",
   "my brain is chaos", multiple tangents in one message, parenthetical asides.

4. the_seeker — Doesn't know what they want yet.
   SIGNALS: "I don't know", "figuring things out", "lost", "searching for purpose",
   no specific goals mentioned, philosophical questions.

5. the_ambitious — Clear goals, high drive, needs accountability.
   SIGNALS: specific goals with deadlines, competitive language, "I want to be the best",
   lists of things to achieve, mentions of business/career advancement.

6. the_overwhelmed — Drowning, needs radical simplification.
   SIGNALS: "everything is too much", "I can't handle", emotional distress,
   very long dumps of problems, mentions of anxiety/stress, "where do I even start".

# RULES
- Choose the SINGLE best match. Users will have traits of multiple archetypes.
  Pick the dominant one.
- If truly ambiguous, default to "the_seeker" (safest starting point).
- Confidence must be honest. Don't say 90% unless you're very sure.

# ONBOARDING DATA
${'{ONBOARDING_DATA}'}

# OUTPUT (JSON only)
{
  "archetype": "the_rebuilder|the_optimizer|the_scattered|the_seeker|the_ambitious|the_overwhelmed",
  "confidence": number (0-100),
  "reasoning": "Brief explanation of why this archetype",
  "secondary_archetype": "string|null (if strong secondary signal)",
  "detected_signals": ["list", "of", "specific", "signals", "from", "their", "text"]
}
`;

export async function detectArchetype(
  onboardingData: {
    brainDump?: string;
    lifeSituation?: string;
    schedule?: string;
    energyPattern?: string;
    goalsAnswer?: string;
    communicationStyle?: string;
  }
): Promise<{
  archetype: UserArchetype;
  confidence: number;
  reasoning: string;
  secondaryArchetype: UserArchetype | null;
}> {
  const response = await callAI({
    systemPrompt: DETECTION_PROMPT.replace(
      '{ONBOARDING_DATA}',
      JSON.stringify(onboardingData, null, 2)
    ),
    userMessage: 'Detect the user archetype from the onboarding data.',
    taskType: 'analysis',
    temperature: 0.2,
    maxTokens: 500,
    jsonMode: true,
  });

  try {
    const parsed = JSON.parse(
      response.content.substring(
        response.content.indexOf('{'),
        response.content.lastIndexOf('}') + 1
      )
    );

    return {
      archetype: parsed.archetype as UserArchetype,
      confidence: parsed.confidence,
      reasoning: parsed.reasoning,
      secondaryArchetype: parsed.secondary_archetype || null,
    };
  } catch {
    return {
      archetype: 'the_seeker',
      confidence: 20,
      reasoning: 'Detection failed — defaulting to seeker',
      secondaryArchetype: null,
    };
  }
}
```

## Save Archetype to User Record

```typescript
// Add to convex/schema.ts users table:

// In the users defineTable, add:
archetype: v.optional(v.string()),
archetypeConfidence: v.optional(v.number()),
secondaryArchetype: v.optional(v.union(v.string(), v.null())),
onboardingData: v.optional(v.string()), // JSON of onboarding answers
```

```typescript
// Add to convex/users.ts:

export const setArchetype = mutation({
  args: {
    userId: v.id('users'),
    archetype: v.string(),
    confidence: v.number(),
    secondaryArchetype: v.union(v.string(), v.null()),
    onboardingData: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      archetype: args.archetype,
      archetypeConfidence: args.confidence,
      secondaryArchetype: args.secondaryArchetype,
      onboardingData: args.onboardingData,
      onboardingComplete: true,
    });
  },
});
```

---

# SECTION 26: COMPLETE INTEGRATION MAP — HOW EVERYTHING CONNECTS

## The Full Data Flow (Onboarding → Segmentation → Psychology → Coaching → Actions → Vision Board)

```
USER SIGNS UP (Clerk Auth)
    ↓
ONBOARDING CONVERSATION STARTS (Section 9)
    ↓
AI ASKS: life situation, brain dump, goals, energy, style
    ↓
ARCHETYPE DETECTION (Section 25)
    ├── Analyzes ALL onboarding answers
    ├── Assigns archetype: e.g., "the_scattered"
    ├── Confidence: 78%
    └── Saves to Convex users table
    ↓
APP CONFIGURES ITSELF based on archetype:
    ├── Dashboard complexity → minimal
    ├── Default coach → Nova (Energy Manager)
    ├── Check-in frequency → twice daily
    ├── Streaks → shown (gamification helps ADHD)
    └── Analytics → hidden (too much noise)
    ↓
BRAIN DUMP PROCESSED (Section 7)
    ├── Raw text → AI parses → validated tasks
    ├── Tasks created in Convex (via AI Actions)
    └── Habits suggested
    ↓
FIRST COACHING SESSION (Section 8 + 22)
    ├── AI uses adaptive prompt (archetype + onboarding context)
    ├── User talks → AI responds + takes actions
    ├── Tasks created/updated in real-time
    └── Psychology profile begins building (Section 23)
    ↓
VISION BOARD GENERATED (Section 24)
    ├── Uses: goals + psychology profile + archetype
    ├── AI creates image prompts + affirmations
    ├── Cloudflare generates images (free)
    └── Board saved to dashboard
    ↓
DAILY OPERATION:
    ├── Morning: Telegram nudge (top tasks + affirmation from board)
    ├── Midday: Check-in ("Did you start #1?")
    ├── User talks to coach → actions execute live
    ├── Psychology profile refines (every 3rd interaction)
    ├── Evening: Recap + mood log
    └── Weekly: AI Review + board progress update
    ↓
CONTINUOUS IMPROVEMENT:
    ├── Archetype may shift (rebuilder → ambitious over time)
    ├── Coaching tone adapts as psychology profile deepens
    ├── Vision board regenerates when goals change
    └── Nudge frequency adjusts to engagement patterns
```

## New Environment Variables Summary (ALL sections):

```env
# === AI PROVIDERS (Section 6) ===
GROQ_API_KEY=gsk_...
GOOGLE_AI_KEY=AIza...
OPENROUTER_API_KEY=sk-or-...
GITHUB_PAT=ghp_...

# === IMAGE GENERATION (Section 24) ===
CLOUDFLARE_IMAGE_API_URL=https://resurgo-image-gen.YOUR.workers.dev
CLOUDFLARE_IMAGE_API_KEY=your-strong-secret

# === PAYMENTS (Section 4) ===
DODO_API_KEY=...
DODO_WEBHOOK_SECRET=...

# === TELEGRAM (Section 10) ===
TELEGRAM_BOT_TOKEN=...
TELEGRAM_WEBHOOK_SECRET=...

# === CLERK (already set) ===
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# === CONVEX (already set) ===
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud
```

## New Convex Tables Summary (ALL sections):

```typescript
// Full schema additions:

// Section 5: Plan fields on users table
// Section 23: psychProfiles table
// Section 24: visionBoards table
// Section 22: suggestions table, reminders table
// Section 25: archetype fields on users table
```

## Implementation Priority:

```
PHASE 1 (Week 1-2): Core Systems
├── □ AI Provider Router (Section 6)
├── □ Brain Dump Pipeline (Section 7)
├── □ Dodo Payments + Entitlements (Sections 4-5)
├── □ Admin access for founder (Section 21)
└── □ Fix UI: nav, headings, branding (Section 13)

PHASE 2 (Week 2-3): The Living System
├── □ AI Actions System (Section 22)
├── □ Coach API with action execution
├── □ Real-time UI updates via Convex
├── □ Action toast notifications
└── □ Onboarding conversation flow (Section 9)

PHASE 3 (Week 3-4): Psychology + Segmentation
├── □ Psychology Profile Schema (Section 23)
├── □ Profile Builder (background updates)
├── □ Adaptive Coaching Prompts
├── □ Archetype Detection (Section 25)
├── □ Archetype-based app configuration
└── □ Safety flag handling

PHASE 4 (Week 4-5): Vision Board
├── □ Cloudflare Worker for image gen
├── □ Vision Board Generator
├── □ Image Service with fallback
├── □ Vision Board UI component
├── □ Board storage in Convex
└── □ Auto-regeneration when goals change

PHASE 5 (Week 5-6): Polish + Launch
├── □ Landing page (Section 11)
├── □ Blog system (Section 12)
├── □ Telegram bot activation (Section 10)
├── □ Pricing page
├── □ Marketing launch (Section 16)
└── □ ProductHunt preparation
```

---

**This is RESURGO's complete brain. Every system connects to every other system. The onboarding feeds the archetype detector which configures the UI which adapts the coaching which builds the psychology profile which generates the vision board which motivates the user which drives engagement which refines everything further. It's one living, breathing system.**

**Send all documents (Master + Addendum 1 + Addendum 2) to your coding AI. It now has everything it needs to build the greatest productivity app ever made.** 🚀

# RESURGO — “Partner System” + Psychology-Aware Coaching + Free/Low-Cost Multi‑Model AI + Moodboard Maker (Coder AI Document)
Date: 2026‑02‑28  
Goal: implement the 3 new ideas **safely, robustly, and without overbuilding**.

---

## 0) Product intent (what we’re building)
You want Resurgo to feel like a **real partner**:
- The user can **dump thoughts**, and Resurgo **understands context**, responds like a coach, and **updates the app state live** (tasks/habits/goals/preferences) instead of being “just chat”.
- The coach uses **light psychology basics** (behavior change + communication style matching) to help users follow through—**not therapy**, no diagnosis.
- Resurgo generates a **Moodboard / Vision board** aligned with the user’s goals + identity + preferences, and keeps it updated as the user evolves.

---

## 1) High-level architecture: “Partner Engine” (stateful, event-driven, validated actions)
### 1.1 Core idea
Every user input produces **two outputs**:
1) `assistant_message` (human response)
2) `actions[]` (structured, validated changes to app state)

**The AI never writes directly to DB.** It proposes actions; the server validates and applies them.

### 1.2 Minimal pipeline
**Ingest Event → Build Context → LLM → Validate JSON → Apply Actions (transaction) → Store response**

Data objects:
- `events` (every inbound message / onboarding answer / telegram message)
- `assistant_messages`
- `user_profile` (preferences + psychology/coaching style vector + memory summary)
- existing `tasks`, `habits`, `goals`, etc.

Why this works: it creates the “partner feels alive” effect because **the workspace changes immediately** based on what the user says—without unsafe freeform DB writes.

---

## 2) Psychology basics: what to “teach” the bots (safe + practical)
### 2.1 What we use (lightweight, evidence-based, not clinical)
Use these frameworks as **coaching heuristics**:

1) **Fogg Behavior Model**: behavior happens when **Motivation + Ability + Prompt** converge. If behavior fails, one is missing. Product implication: when user struggles, reduce difficulty (Ability), improve timing (Prompt), or reconnect to meaning (Motivation).   
2) **Implementation intentions (If‑Then planning)**: turning intentions into “if X then Y” improves follow-through (supported by meta-analytic evidence). Product implication: convert habits/goals into simple if-then plans.   
3) **Motivational Interviewing principles** (communication style): express empathy, develop discrepancy, roll with resistance, support self‑efficacy. Product implication: avoid nagging; when user resists, don’t fight—ask, reflect, offer choices. 

**Safety boundary:** this is productivity + behavior design, **not mental health treatment**. No diagnosis. No “you have ADHD” claims.

### 2.2 “Determine what kind of person it is” (do this ethically)
Instead of “personality diagnosis,” implement a **coaching-style vector** based on:
- explicit onboarding answers (user chooses tone/structure)
- observed behavior (completion rate, snooze rate, response to reminders)

Store something like:

```ts
type CoachingStyle = {
  directness: number;      // 0..1
  structureNeed: number;   // 0..1
  reminderTolerance: number;// 0..1
  shameSensitivity: number;// 0..1  (higher => no streak-shame)
  overwhelmRisk: number;   // 0..1
};
```

Then prompt the coach to adapt:
- high reactance → fewer commands, more choices
- high overwhelm → smaller steps, “Top 1–3 only”
- high structureNeed → step-by-step plan + checklists

---

## 3) Onboarding: “deep analysis” without friction
### 3.1 Onboarding goals
- Build enough context for personalization
- Assign user to a **helpful non-medical segment** (e.g., “Overwhelmed Starter”, “Builder”, “Burnout Recovery”, “Routine Seeker”)
- Populate the product immediately: tasks + first habit + reminders + moodboard starter

### 3.2 Onboarding format: conversational + progressive
Do not use a 30-question form. Use **chat onboarding** with 6–10 prompts max:
1) “What’s on your mind right now? Dump it.”
2) “What’s your biggest stressor this month?”
3) “What matters most: health / money / career / relationships / learning?”
4) “When do you have energy? morning/afternoon/night/none lately”
5) “Do you want gentle or direct coaching?”
6) “Reminders: minimal / normal / intense”
7) “Pick 1 identity statement you want to become” (drives moodboard + habits)
8) “Any hard deadlines coming up?”

Each answer becomes an `event`, which runs through the Partner Engine to update state.

---

## 4) Multi-model AI solution (free-first, robust, doesn’t explode costs)
### 4.1 Reality check on “all free keys, no costs”
You can design a system that is **nearly costless for early users**, but you **cannot guarantee zero cost forever** because “free tiers” are rate-limited and can change. Build the system to:
- prefer **offline/local** AI when available
- use **free tiers** as primary for early stage
- degrade gracefully to rules-based behavior when quotas hit
- optionally support **BYOK (bring your own key)** for power users

### 4.2 Free-tier / low-cost sources you can rely on (with real constraints)
- **Groq** has a free tier with strict rate limits; exact limits are shown in their console, and they explicitly state free tier is capped by rate limits.   
- **OpenRouter Free** limits free users to **50 requests/day** and 20 rpm (good as fallback, not as primary).   
- **Cloudflare Workers AI** includes a daily free allocation of **10,000 “Neurons”**; usage above that requires paid plan.   
- **Gemini API quotas** exist and can be restrictive depending on tier/model; quotas and changes are managed through Google’s quota system (do not assume high free usage). 

### 4.3 AI Router (recommended behavior)
Implement a router with:
- **Primary:** your offline/local model (if truly available) for parsing + basic replies
- **Secondary:** Groq (fast text) for structured extraction + coaching
- **Fallback:** OpenRouter free models only when necessary (because 50/day cap)   
- **Optional:** Cloudflare Workers AI for “last resort” text or image generation within neuron limits 

**Critical:** Do not try to “evade” quotas by rotating free accounts/keys. That’s a ToS risk.

### 4.4 How to keep the system comprehensive *without* multi-model overkill
Use a **2-stage** design (cheap + reliable):
- Stage A (Extractor): strict JSON parsing (low temperature)
- Stage B (Coach): human response generation using validated extracted state

Optional Stage C (Safety/Quality): a fast “lint” pass to ensure output is short, kind, and actionable.

---

## 5) Partner Engine output format (strict JSON + actions)
### 5.1 Action DSL (the most important safety layer)
Define a strict schema for actions the AI can propose:

- `task.upsert`
- `habit.suggest` / `habit.create`
- `goal.create`
- `pref.set`
- `nudge.schedule`
- `moodboard.update`

Then apply them via server-side code only after validation.

### 5.2 Production-safe JSON validation approach
- Zod schema
- JSON extraction (handle code blocks / leading text)
- sanitize trailing commas
- retry with repair prompt
- log failures (redacted)

(You already have a robust Brain Dump parser pattern—reuse it for Partner Engine outputs.)

---

## 6) Moodboard Maker (Idea #3): build it as a “Vision Board + Identity Board”
### 6.1 What the moodboard is in Resurgo
A moodboard isn’t just pretty pictures. In Resurgo it should function as:
- the user’s “why” (identity + goals + vibe)
- a motivation anchor during low-energy days
- a summary artifact that evolves as the user evolves

### 6.2 UX: “Moodboard that builds itself”
You want zero setup. So:
- During onboarding, collect 5–8 attributes:
  - goals
  - identity statement (“I’m becoming someone who ___”)
  - preferred aesthetic (minimal, cyberpunk, calm, nature, luxury, etc.)
  - colors they like
  - “what you’re escaping” (burnout/chaos/overwhelm)
- Then auto-generate:
  - 12–24 tiles (images + keywords + short affirmations)
  - 1–3 “North Star cards” (top goal + reason)
  - color palette (4–6 colors)
  - optional typography style

### 6.3 Implementation options (free-first)
**Option A (recommended v1): retrieval-based moodboard (no image generation)**
Use free photo APIs + attribution rules:
- Unsplash API is usable but requires attribution, hotlinking returned URLs, and download endpoint tracking.   
- Moodboard UX inspiration: Milanote shows modern moodboards as flexible boards with drag/drop and mixed media.   

Flow:
1) AI generates `moodboard_query_terms[]` from user profile (e.g., “calm morning routine”, “focused workspace”, “fitness outdoors”)
2) Server fetches images
3) Store tile layout + metadata in DB
4) Render board with drag/drop + auto-layout button

**Option B: generative images (only if you can keep it truly free)**
You can attempt Cloudflare Workers AI image generation within neuron free limits, but it’s limited and not guaranteed for scale.   
Better long-term: local Stable Diffusion on a cheap GPU box (fixed monthly cost, not per-call), but that’s not “free”.

### 6.4 Moodboard data model
- `moodboards`
  - `userId`
  - `title`
  - `palette[]`
  - `tiles[]` (type=image/text/quote/goal)
  - `createdAt`, `updatedAt`
- `moodboard_tiles`
  - `tileId`, `boardId`
  - `type`
  - `content`
  - `source` (unsplash url + attribution block)
  - `x,y,w,h,zIndex`

### 6.5 Auto-layout (must-have)
Users will dump lots of images. Provide:
- “Auto-arrange grid”
- “Auto-arrange collage”
- “Auto-group by theme”

---

## 7) WhatsApp note (so we don’t build the wrong thing)
If you’re considering WhatsApp as a main AI partner interface: Meta/WhatsApp updated terms to prohibit general-purpose AI assistants when AI is the primary functionality, effective **Jan 15, 2026**. That makes WhatsApp risky as the main channel for Resurgo’s AI partner concept.   
Recommendation: Telegram-first for “chat with your life,” WhatsApp only for narrow notifications if at all.

---

## 8) Deliverables checklist (what to implement next)
### P0 — “Partner Engine MVP”
1) `events` ingestion across:
   - web chat
   - onboarding answers
   - telegram messages
2) Partner Engine LLM call returns:
   - `assistantMessage`
   - `actions[]`
   - `memoryPatch`
3) Validate with Zod; apply actions transactionally
4) UI: Chat panel + “changes applied” feed (tasks created/updated)

### P1 — Psychology-aware coaching behavior
1) Onboarding: coaching preferences + overwhelm signals
2) Store `CoachingStyle` vector
3) Prompt coach with the vector + behavior rules:
   - Fogg: lower ability first, then prompt, then motivation   
   - If-then plans for habits   
   - MI principles to avoid nagging   
4) Daily check-in loop + evening review

### P2 — Moodboard Maker
1) Onboarding extracts moodboard preferences
2) Create first board automatically
3) Render moodboard page in app
4) Add: auto-layout + “update moodboard” action when goals change

### P3 — Free-first multi-model AI router
1) Implement provider router (offline → Groq → OpenRouter → CF Workers AI)
2) Add:
   - per-user rate limits
   - caching of parsed dumps + summaries
   - “low-AI mode” fallback rules when quotas hit
3) Optional: BYOK mode for users who want unlimited usage

---

## 9) Billing note (India + global)
If you are using Clerk Billing: Clerk’s docs state Billing is not supported in India and several other countries; Billing supports USD only and is not MoR.   
Action: treat billing as a separate module + keep entitlements in Convex so you can swap billing provider later without rewriting product access logic.

---

## 10) Security & privacy requirements (non-negotiable)
- LLM calls server-side only (no keys client-side)
- strict JSON schema validation for any state-changing AI output
- redact logs (never store raw brain dumps in logs)
- rate limit brain dump + partner engine endpoints
- never diagnose; include “not medical advice” language in coach UI

---

## 11) Implementation note to coder AI (how to avoid overdoing it)
- Don’t build a giant “agent framework.”
- Build 1 orchestrator that outputs actions (validated).
- Keep action types limited at first.
- Ship the smallest set that creates the “partner feel”:
  - brain dump → tasks
  - today plan → priorities
  - nudges → follow-through
  - moodboard → identity anchor

---

### Appendix: Key sources used (for engineering decisions)
- Clerk Billing limitations: USD-only, not MoR, unsupported countries list including India.   
- OpenRouter free-tier limits (50 req/day).   
- Groq free tier is capped by rate limits (check console).   
- Cloudflare Workers AI free allocation (10,000 neurons/day).   
- WhatsApp Business API policy ban for general-purpose AI assistants effective Jan 15, 2026.   
- Fogg Behavior Model (Motivation + Ability + Prompt).   
- Implementation intentions (if‑then plans) evidence base.   
- MI principles overview (empathy, discrepancy, resistance, self-efficacy).   
- Unsplash API rules (attribution + hotlink + download endpoint).   
- Moodboard product inspiration (Milanote explanation + board concept). 

--- 

**End of doc.**

If you want, I can generate the exact Zod schemas for the full Partner Engine output (including `moodboard.update` action) + the repair/retry validator wrapper, matching your existing Brain Dump parser pattern.





;FGVNL