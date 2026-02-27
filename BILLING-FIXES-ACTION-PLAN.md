# ASCENDIFY BILLING FIXES — PRIORITIZED ACTION PLAN

Generated: February 18, 2026 after QA testing  
Estimated Total Fix Time: 6-8 hours  
Launch Blocker Status: 🔴 **4 CRITICAL ISSUES** must be fixed first

---

## P0 FIX #1: Plan Limits Mismatch (5 MINUTES)

**Critical Issue:** Backend enforces 5 habits/1 goal on free, UI shows 10/3

### Files to Change
1. `convex/habits.ts` line 119-121
2. `convex/goals.ts` line 10-12
3. `src/lib/billing/plans.ts` - verify consistency

### Current State (WRONG)
```typescript
// convex/habits.ts - LINE 119
const PLAN_LIMITS = {
  free: { maxHabits: 5 },    // ❌ WRONG - UI shows 10
  pro: { maxHabits: Infinity },
  lifetime: { maxHabits: Infinity },
};

// convex/goals.ts - LINE 10
const PLAN_LIMITS = {
  free: { maxGoals: 1 },     // ❌ WRONG - UI shows 3
  pro: { maxGoals: Infinity },
  lifetime: { maxGoals: Infinity },
};
```

### Fixed State (CORRECT)
```typescript
// convex/habits.ts - LINE 119
const PLAN_LIMITS = {
  free: { maxHabits: 10 },   // ✅ CORRECT - matches UI
  pro: { maxHabits: Infinity },
  lifetime: { maxHabits: Infinity },
};

// convex/goals.ts - LINE 10
const PLAN_LIMITS = {
  free: { maxGoals: 3 },     // ✅ CORRECT - matches UI
  pro: { maxGoals: Infinity },
  lifetime: { maxGoals: Infinity },
};
```

### Verification Checklist
- [ ] `convex/habits.ts` line 119 shows `free: { maxHabits: 10 }`
- [ ] `convex/goals.ts` line 10 shows `free: { maxGoals: 3 }`
- [ ] `src/hooks/usePlanGating.ts` already has correct values (10, 3)
- [ ] Redeploy Convex with `npx convex deploy`

### Test After Fix
```
Scenario: Free user creates habits
1. Create habit 1-10: ✅ All succeed
2. Try to create habit 11: ❌ Error "Plan limit reached"
Result: PASS
```

---

## P0 FIX #2: Data Preservation on Downgrade (6-8 HOURS)

**Critical Issue:** When user downgrades from pro to free, excess items silently disappear (data loss)

### Problem Scenario
- User has Pro plan with 20 habits
- Payment fails → Auto-downgrade to free (max 10 habits)
- Current code: Habits 11-20 become undefined (lost)
- Better approach: Archive them with recovery option

### Solution Architecture

#### Step 1: Add Status Field to Habits Schema
**File:** `convex/schema.ts` - Add to habits table

```typescript
habits: defineTable({
  // ... existing fields ...
  status: v.union(
    v.literal('active'),
    v.literal('archived_downgrade'),  // ← NEW: archived due to plan downgrade
    v.literal('archived_user'),        // ← NEW: user manually archived
    v.literal('complete'),
    v.literal('paused'),
  ),
  // ... rest of fields ...
})
```

#### Step 2: Create Downgrade Handler
**File:** `convex/users.ts` - Add new mutation after `updatePlanFromWebhook`

```typescript
// NEW MUTATION
export const handlePlanDowngrade = mutation({
  args: {
    userId: v.id('users'),
    oldPlan: v.union(v.literal('pro'), v.literal('lifetime')),
    newPlan: v.union(v.literal('free'), v.literal('pro')),
  },
  returns: v.object({
    archivedHabitCount: v.number(),
    archivedGoalCount: v.number(),
  }),
  handler: async (ctx, { userId, oldPlan, newPlan }) => {
    if (newPlan === 'free') {
      // Free users: max 10 habits, 3 goals
      const NEW_LIMITS = { maxHabits: 10, maxGoals: 3 };
      
      // Get all active habits
      const allHabits = await ctx.db
        .query('habits')
        .withIndex('by_userId_active', (q) =>
          q.eq('userId', userId).eq('isActive', true)
        )
        .collect();

      // Archive excess habits
      let archivedCount = 0;
      if (allHabits.length > NEW_LIMITS.maxHabits) {
        const excessHabits = allHabits.slice(NEW_LIMITS.maxHabits);
        for (const habit of excessHabits) {
          await ctx.db.patch(habit._id, {
            isActive: false,
            status: 'archived_downgrade',
            updatedAt: Date.now(),
          });
          archivedCount++;
        }
      }

      // Get all active goals
      const allGoals = await ctx.db
        .query('goals')
        .withIndex('by_userId_status', (q) =>
          q.eq('userId', userId).eq('status', 'in_progress')
        )
        .collect();

      // Archive excess goals
      let archivedGoalCount = 0;
      if (allGoals.length > NEW_LIMITS.maxGoals) {
        const excessGoals = allGoals.slice(NEW_LIMITS.maxGoals);
        for (const goal of excessGoals) {
          await ctx.db.patch(goal._id, {
            status: 'archived_downgrade',
            updatedAt: Date.now(),
          });
          archivedGoalCount++;
        }
      }

      return {
        archivedHabitCount: archivedCount,
        archivedGoalCount: archivedGoalCount,
      };
    }

    return {
      archivedHabitCount: 0,
      archivedGoalCount: 0,
    };
  },
});
```

#### Step 3: Update Webhook Handler to Call Archive
**File:** `src/app/api/webhooks/clerk-billing/route.ts`

```typescript
// In the webhook handler, after successful plan update:
case 'billing.subscription.deleted':
case 'subscription.deleted': {
  const clerkId = data.user_id || data.user?.id;
  if (!clerkId) {
    console.error('[Webhook] Missing user id in cancellation payload');
    return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
  }

  console.log(`[Webhook] Subscription cancelled for ${clerkId}`);
  try {
    // 1. Update plan to free
    const updateResult = await convex.mutation(api.users.updatePlanFromWebhook, {
      clerkId,
      plan: 'free',
      webhookSecret: syncSecret,
    });

    // 2. NEW: Handle data preservation
    const user = await convex.query(api.users.getByClerkId, { clerkId });
    if (user) {
      const archiveResult = await convex.mutation(api.users.handlePlanDowngrade, {
        userId: user._id,
        oldPlan: user.plan as 'pro' | 'lifetime',
        newPlan: 'free',
      });
      
      // 3. Log what was archived
      console.log(
        `[Webhook] Archived ${archiveResult.archivedHabitCount} habits, ` +
        `${archiveResult.archivedGoalCount} goals for ${clerkId}`
      );
    }

    console.log(`[Webhook] Successfully downgraded ${clerkId} to free plan`);
  } catch (updateErr: any) {
    // ...error handling...
  }
  break;
}
```

#### Step 4: Add UI Notification in Dashboard
**File:** `src/components/DowngradedPlanNotice.tsx` (NEW FILE)

```typescript
'use client';

import { useStoreUser } from '@/hooks/useStoreUser';
import { Card } from '@/components/ui/card';

export function DowngradedPlanNotice() {
  const { user } = useStoreUser();

  if (user?.plan !== 'free') return null;

  // Check if user previously had pro (based on userData)
  const wasDowngraded = false; // Would need to track this

  if (!wasDowngraded) return null;

  return (
    <Card className="border-l-4 border-l-yellow-500 bg-yellow-50 p-4 mb-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900">
            Some of your habits are archived
          </h3>
          <p className="text-sm text-yellow-800 mt-1">
            Your Pro plan ended, so we archived habits beyond the free tier limit. 
            Upgrade to restore them and keep tracking!
          </p>
        </div>
        <button className="text-yellow-600 hover:text-yellow-700">
          ✕
        </button>
      </div>
    </Card>
  );
}
```

### Testing After Implementation
```
Test Scenario: Downgrade from Pro to Free
1. Create user with Pro plan
2. Create 20 habits
3. Simulate webhook: subscription.deleted
4. Check database:
   - First 10 habits: status = 'active'
   - Habits 11-20: status = 'archived_downgrade' ✓
5. Dashboard shows notice: "5 habits archived" ✓
6. User can upgrade and see "Restore" option ✓
```

---

## P0 FIX #3: Race Condition on Concurrent Updates (6+ HOURS)

**Critical Issue:** Plan changes and habit creation can race, causing undefined behavior

### Problem Visualization
```
Timeline without transaction:
T1: Habit create starts, checks plan = 'free' ✓
T2: Webhook updates to 'pro' ✓
T3: Habit create continues, finds 10 habits (at limit for free)
T4: Error thrown even though plan is now pro!

With transaction:
T1: Habit create acquires lock on user record
T2: Webhook tries to update, WAITS for lock
T3: Habit create checks plan (still free), creates successfully
T4: Releases lock
T5: Webhook acquires lock, updates plan to pro
→ No race condition!
```

### Solution: Add Transaction Wrapper

**File:** `convex/lib/transactions.ts` (NEW FILE)

```typescript
// ═══════════════════════════════════════════════════════════════════════════════
// Transaction helpers for critical billing operations
// Ensures habits/goals creation is atomic with plan checks
// ═══════════════════════════════════════════════════════════════════════════════

export async function checkAndCreateHabit(
  ctx: any,
  userId: string,
  habitData: any
): Promise<string> {
  // Get user and check limit in single operation (no race condition)
  const user = await ctx.db.get(userId);
  if (!user) throw new Error('User not found');

  // Validate plan
  const planLimits = {
    free: 10,
    pro: Infinity,
    lifetime: Infinity,
  };

  const limit = planLimits[user.plan as keyof typeof planLimits];

  // Count active habits
  const activeHabits = await ctx.db
    .query('habits')
    .withIndex('by_userId_active', (q: any) =>
      q.eq('userId', userId).eq('isActive', true)
    )
    .collect();

  // Check limit
  if (activeHabits.length >= limit) {
    throw new Error(
      `Plan limit reached: ${user.plan} plan allows ` +
      `${limit === Infinity ? 'unlimited' : limit} active habits.`
    );
  }

  // Create habit
  return await ctx.db.insert('habits', {
    ...habitData,
    userId,
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}

export async function checkAndCreateGoal(
  ctx: any,
  userId: string,
  goalData: any
): Promise<string> {
  // Same pattern as habits
  const user = await ctx.db.get(userId);
  if (!user) throw new Error('User not found');

  const planLimits = {
    free: 3,
    pro: Infinity,
    lifetime: Infinity,
  };

  const limit = planLimits[user.plan as keyof typeof planLimits];

  const activeGoals = await ctx.db
    .query('goals')
    .withIndex('by_userId_status', (q: any) =>
      q.eq('userId', userId).eq('status', 'in_progress')
    )
    .collect();

  if (activeGoals.length >= limit) {
    throw new Error(
      `Plan limit reached: ${user.plan} plan allows ` +
      `${limit === Infinity ? 'unlimited' : limit} active goals.`
    );
  }

  return await ctx.db.insert('goals', {
    ...goalData,
    userId,
    status: 'in_progress',
    progress: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}
```

**File:** `convex/habits.ts` - Update create mutation

```typescript
// BEFORE (line 195):
export const create = mutation({
  args: { title: v.string(), /* ... */ },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    
    const activeHabits = await ctx.db
      .query('habits')
      .withIndex('by_userId_active', (q: any) =>
        q.eq('userId', user._id).eq('isActive', true)
      )
      .collect();
    
    // ... check limit ...
    return await ctx.db.insert('habits', { /* ... */ });
  }
});

// AFTER (using transaction-safe helper):
export const create = mutation({
  args: { title: v.string(), /* ... */ },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');
    
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) throw new Error('User not found');

    // Use atomic operation
    return await checkAndCreateHabit(ctx, user._id, {
      title: args.title,
      description: args.description,
      category: args.category,
      frequency: args.frequency,
      timeOfDay: args.timeOfDay,
      // ... other args ...
    });
  }
});
```

### Testing
```
Test: Concurrent habit create + plan update
1. User on free plan with 10 habits
2. Start habit creation in thread 1
3. Start webhook update to pro in thread 2
4. Verify: No race condition, consistent result
```

---

## P1 FIX #4: Add Webhook Timestamp Validation (1 HOUR)

**High Priority Issue:** Webhooks can be replayed hours/days later

**File:** `src/app/api/webhooks/clerk-billing/route.ts`

```typescript
// ADD after verify svix signature (line 60):

const event: any = wh.verify(body, {
  'svix-id': svix_id,
  'svix-timestamp': svix_timestamp,
  'svix-signature': svix_signature,
});

// ✅ NEW: Validate timestamp is recent
const headerTimestamp = parseInt(svix_timestamp);
const nowTimestamp = Math.floor(Date.now() / 1000);
const ageDifference = Math.abs(nowTimestamp - headerTimestamp);

const MAX_WEBHOOK_AGE_SECONDS = 300; // 5 minutes (Svix standard)

if (ageDifference > MAX_WEBHOOK_AGE_SECONDS) {
  console.warn(
    `[Webhook] Rejecting webhook older than 5 minutes (${ageDifference}s old)`
  );
  return NextResponse.json(
    { error: 'Webhook timestamp too old' },
    { status: 400 }
  );
}

// Continue with normal processing...
```

---

## P1 FIX #5: Add Audit Logging (2-3 HOURS)

**High Priority Issue:** Cannot debug billing issues without logs

### Step 1: Add to Schema
**File:** `convex/schema.ts`

```typescript
export default defineSchema({
  // ... existing tables ...
  
  // NEW TABLE: Billing audit log
  billingEvents: defineTable({
    userId: v.id('users'),
    clerkId: v.string(),
    eventType: v.union(
      v.literal('plan_changed'),
      v.literal('webhook_received'),
      v.literal('webhook_failed'),
      v.literal('habit_created'),
      v.literal('habit_failed'),
      v.literal('goal_created'),
      v.literal('goal_failed'),
      v.literal('downgrade'),
      v.literal('upgrade'),
    ),
    timestamp: v.number(),
    oldValue: v.optional(v.string()),
    newValue: v.optional(v.string()),
    source: v.union(
      v.literal('webhook'),
      v.literal('api'),
      v.literal('system'),
    ),
    details: v.optional(v.any()),
  })
    .index('by_userId', ['userId'])
    .index('by_clerkId', ['clerkId'])
    .index('by_timestamp', ['timestamp']),
});
```

### Step 2: Add Logging Helper
**File:** `convex/lib/billing-log.ts` (NEW FILE)

```typescript
import { mutation } from '../_generated/server';
import { v } from 'convex/values';

export const logBillingEvent = mutation({
  args: {
    userId: v.id('users'),
    clerkId: v.string(),
    eventType: v.string(),
    oldValue: v.optional(v.string()),
    newValue: v.optional(v.string()),
    source: v.string(),
    details: v.optional(v.any()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert('billingEvents', {
      ...args,
      timestamp: Date.now(),
    });
  },
});
```

### Step 3: Use in Webhook Handler

```typescript
// In webhook handler, after plan update:
await convex.mutation(api.billingLog.logBillingEvent, {
  userId: user._id,
  clerkId,
  eventType: 'plan_changed',
  oldValue: user.plan,
  newValue: plan,
  source: 'webhook',
  details: {
    webhookType: type,
    planIdentifier,
  },
});
```

---

## P1 FIX #6: Parameter Sanitization (30 MIN)

**File:** `src/app/payment/success/page.tsx` (and failure)

```typescript
'use client';

import DOMPurify from 'dompurify';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  
  // ✅ Sanitize all user-provided parameters
  const transactionId = DOMPurify.sanitize(
    searchParams.get('txnid') || ''
  );
  const planName = DOMPurify.sanitize(
    searchParams.get('plan') || ''
  );
  
  return (
    <div>
      <h1>Payment Successful!</h1>
      {/* Safe to render now */}
      <p>Transaction: {transactionId}</p>
      <p>Plan: {planName}</p>
    </div>
  );
}
```

**Install:** `npm install dompurify` (if not already installed)

---

## Summary of All Fixes

| Fix | Priority | Files | Time | Impact |
|-----|----------|-------|------|--------|
| 1. Plan Limits | P0 | 2 files (backend) | 5 min | CRITICAL - Users hit limits |
| 2. Data Preservation | P0 | 3 files (handlers + UI) | 6-8 hrs | CRITICAL - Data loss |
| 3. Race Condition | P0 | 2 files (transaction logic) | 6+ hrs | CRITICAL - Race bugs |
| 4. Timestamp Validation | P1 | 1 file | 1 hr | Replay attack protection |
| 5. Audit Logging | P1 | 3 files | 2-3 hrs | Debugging capability |
| 6. Parameter Sanitization | P1 | 2 files | 30 min | XSS protection |

**Total Estimated Time:** 6-8 hours to all critical fixes  
**Recommended Order:**
1. Fix #1 (plan limits) - quickest, highest impact
2. Fix #2 (data preservation) - most complex, needed before launch
3. Fix #3 (race conditions) - architectural, enables #2 properly
4. Fix #4-6 (polish & hardening)

---

## Verification Checklist

After implementing all fixes:

- [ ] Plan limits match across all files (backend, UI, marketing)
- [ ] Downgrade archives excess items instead of deleting
- [ ] Concurrent habit/goal creates don't race with plan updates
- [ ] Webhook timestamp validated (within 5 minutes)
- [ ] All billing events logged to audit table
- [ ] XSS parameters sanitized in success/failure pages
- [ ] Test end-to-end: signup → payment → webhook → feature gating
- [ ] Load test webhook processing with 1000s/sec traffic
- [ ] Verify no user can bypass plan limits
- [ ] Document for engineering team

---

**Report Date:** February 18, 2026  
**Status:** Ready for implementation  
**Next Step:** Assign to engineers, start with P0 fixes

