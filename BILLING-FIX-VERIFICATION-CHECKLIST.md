# BILLING SYSTEM FIX VERIFICATION CHECKLIST

Use this checklist to verify all critical fixes have been properly implemented.

---

## ✅ CRITICAL FIX #1: Plan Limits Match (5 MIN)

### What to verify
- [ ] `convex/habits.ts` line 119 shows: `free: { maxHabits: 10 }`
- [ ] `convex/goals.ts` line 10 shows: `free: { maxGoals: 3 }`
- [ ] `src/hooks/usePlanGating.ts` shows: `maxHabits: 10, maxGoals: 3`
- [ ] All three files have matching values

### Test
```bash
# Test backend enforcement
cd convex
npx convex deploy

# Verify in console
Free user tries to create 11th habit → ERROR ✓
Free user tries to create 4th goal → ERROR ✓
```

### Expected Error Messages
```
"Plan limit reached: free plan allows 10 active habits"
"Plan limit reached: free plan allows 3 active goals"
```

---

## ✅ CRITICAL FIX #2: Data Preservation on Downgrade (6-8 HOURS)

### Step 1: Schema Updated
- [ ] `convex/schema.ts` - habits table has `status` field
- [ ] Statuses include: `'archived_downgrade'`
- [ ] Goals table can also have archive status

### Step 2: Handler Created
- [ ] `convex/users.ts` has new mutation: `handlePlanDowngrade`
- [ ] Takes `userId`, `oldPlan`, `newPlan` as args
- [ ] Returns `{ archivedHabitCount, archivedGoalCount }`

### Step 3: Webhook Updated
- [ ] `src/app/api/webhooks/clerk-billing/route.ts` calls `handlePlanDowngrade`
- [ ] Called after plan update, but still in webhook handler
- [ ] Logs archived items count

### Step 4: UI Added
- [ ] Component shows "Some of your habits are archived" notice
- [ ] Shows count of archived items
- [ ] Links to upgrade option

### Test
```bash
# Test downgrade scenario
1. Create user with Pro plan
2. Create 20 habits
3. Trigger webhook: billing.subscription.deleted
4. Check database:
   - First 10 habits: status = 'active' ✓
   - Habits 11-20: status = 'archived_downgrade' ✓
5. Check dashboard shows notification ✓
```

---

## ✅ CRITICAL FIX #3: Race Condition Prevention (6+ HOURS)

### Step 1: Transaction Helper Created
- [ ] `convex/lib/transactions.ts` exists (or similar)
- [ ] Has function: `checkAndCreateHabit()`
- [ ] Has function: `checkAndCreateGoal()`
- [ ] Both functions atomically check limit + create

### Step 2: Mutations Updated
- [ ] `convex/habits.ts` - `create` mutation uses helper
- [ ] `convex/goals.ts` - `create` mutation uses helper
- [ ] No separate limit check + insert (would race)

### Step 3: Plan Update Handler
- [ ] `convex/users.ts` - No special locking needed (Convex handles)
- [ ] `updatePlanFromWebhook` properly implements secret check

### Test
```bash
# Concurrent update test (harder to test, might skip for local launch)
1. Create free user at 10-habit limit
2. Parallel thread 1: Try to create 11th habit
3. Parallel thread 2: Webhook updates plan to pro
4. Verify: One consistently succeeds, no undefined behavior
```

---

## 🟡 HIGH PRIORITY FIX #4: Webhook Timestamp Validation (1 HOUR)

### What to verify
- [ ] `src/app/api/webhooks/clerk-billing/route.ts` line ~65 has timestamp check
- [ ] Calculates age difference from `svix-timestamp` header
- [ ] Rejects if older than 300 seconds (5 minutes)
- [ ] Returns 400 status with "timestamp too old" message

### Code Check
```typescript
// Should exist in webhook handler:
const headerTimestamp = parseInt(svix_timestamp);
const nowTimestamp = Math.floor(Date.now() / 1000);
const ageDifference = Math.abs(nowTimestamp - headerTimestamp);

if (ageDifference > 300) {
  return NextResponse.json(
    { error: 'Webhook timestamp too old' },
    { status: 400 }
  );
}
```

### Test
```bash
# Simulate old webhook (this is tricky to test locally)
# Skip for initial verification, test in staging with Clerk webhook tools
```

---

## 🟡 HIGH PRIORITY FIX #5: Audit Logging (2-3 HOURS)

### Step 1: Schema Updated
- [ ] `convex/schema.ts` has `billingEvents` table
- [ ] Table has fields:
  - `userId` (id reference)
  - `clerkId` (string)
  - `eventType` (union of event types)
  - `timestamp` (number)
  - `source` (webhook|api|system)
  - `details` (optional any)

### Step 2: Helper Mutation
- [ ] `convex/lib/billing-log.ts` or similar exists
- [ ] Has mutation: `logBillingEvent()`
- [ ] Takes all above parameters

### Step 3: Logging Calls Added
- [ ] Webhook handler logs: `plan_changed` event
- [ ] Webhook handler logs: `webhook_failed` on error
- [ ] Plan update includes old/new values

### Test
```bash
1. Create user with Pro plan
2. Trigger downgrade webhook
3. Check billingEvents table:
   - eventType = 'plan_changed' ✓
   - oldValue = 'pro' ✓
   - newValue = 'free' ✓
   - source = 'webhook' ✓
4. Check dashboard reports → Can see history ✓
```

### Query for Debugging
```javascript
// Running in Convex console:
const events = await db
  .query('billingEvents')
  .withIndex('by_clerkId', q => q.eq('clerkId', 'user_123abc'))
  .collect();
  
// Should show:
[
  { eventType: 'plan_changed', oldValue: 'pro', newValue: 'free', timestamp: 1708... }
]
```

---

## 🟡 HIGH PRIORITY FIX #6: Parameter Sanitization (30 MIN)

### Step 1: Dependency Added
- [ ] `npm list dompurify` shows dompurify installed
- [ ] If not: `npm install dompurify`

### Step 2: Success Page Updated
- [ ] `src/app/payment/success/page.tsx` imports DOMPurify
- [ ] All URL parameters passed through `DOMPurify.sanitize()`
- [ ] No unsanitized parameters rendered

### Step 3: Failure Page Updated
- [ ] `src/app/payment/failure/page.tsx` same as above
- [ ] Error messages sanitized

### Code Check
```typescript
// Should exist in both files:
import DOMPurify from 'dompurify';

const transactionId = DOMPurify.sanitize(
  searchParams.get('txnid') || ''
);
```

### Test
```bash
# XSS test (verify page doesn't execute scripts)
1. Navigate to: /payment/success?txnid=<script>alert('xss')</script>
2. Verify: Script DOES NOT execute
3. Verify: Rendered as: &lt;script&gt;alert('xss')&lt;/script&gt;
```

---

## FINAL VERIFICATION TESTS

### Integration Test: Full Signup → Payment → Downgrade Flow

```bash
1. Create new test account
2. Sign up → gets plan='free'
3. Create 10 habits → all succeed ✓
4. Try 11th habit → error ✓
5. Trigger upgrade webhook → plan='pro'
6. Create 11th habit → succeeds ✓
7. Trigger downgrade webhook → plan='free'
8. Check: Habit #11 archived ✓
9. Dashboard shows "1 habit archived" notice ✓
10. Check billingEvents table has logged all changes ✓
```

### Load Test: Webhook Processing (if time permits)

```bash
# Send 100 webhooks in rapid succession
for i in {1..100}; do
  curl -X POST http://localhost:3000/api/webhooks/clerk-billing \
    -H "svix-id: msg_$i" \
    -H "svix-timestamp: $(date +%s)" \
    -H "svix-signature: v1,..." \
    -d '{"type":"billing.subscription.created","data":{...}}'
done

# Verify:
# - All webhooks process successfully
# - No duplicate plan updates
# - All logged in billingEvents table
# - No database errors in logs
```

### Security Test: Plan Override Attempt

```bash
# Verify user cannot spoof premium status
1. Free user opens browser console
2. localStorage.setItem('userPlan', 'pro')
3. Try to create 11th habit
4. Verify: Backend still rejects with "limit reached"
5. Check console logs: Backend used Convex plan, not localStorage ✓
```

---

## DEPLOYMENT CHECKLIST

Before deploying to production:

### Code Review
- [ ] All changes code-reviewed by 1+ senior engineer
- [ ] No hardcoded secrets or keys in commits
- [ ] All new code has comments explaining billing logic

### Testing
- [ ] All P0-P1 fixes verified locally
- [ ] Full integration test completed
- [ ] Load test completed (1000s/sec webhooks)
- [ ] Security review completed
- [ ] XSS/CSRF checks passed

### Environment Setup
- [ ] `BILLING_WEBHOOK_SYNC_SECRET` set in production
- [ ] `NEXT_PUBLIC_CLERK_CHECKOUT_*_URL` variables set
- [ ] Clerk webhook endpoint configured to send to production URL
- [ ] Monitoring/alerting setup for billing failures

### Documentation
- [ ] Engineering team trained on billing system
- [ ] Troubleshooting guide written
- [ ] On-call runbook created
- [ ] Customer communication templates prepared for failures

### Rollout
- [ ] Deploy to staging first
- [ ] Run full test suite on staging
- [ ] Get sign-off from product + engineering leads
- [ ] Deploy to production
- [ ] Monitor logs for errors in first hour
- [ ] Be ready to rollback if critical issues found

---

## KNOWN ISSUES STILL REMAINING (Post-Launch Work)

After critical fixes, these can be done later:

- [ ] Add coupon/discount system
- [ ] Implement Stripe integration (currently PayU only)
- [ ] Add metered billing (vs fixed tier)
- [ ] Create analytics dashboard for billing metrics
- [ ] Implement dunning (retry failed payments)
- [ ] Add team/organization support with per-seat billing

---

## Timeline

- **P0 Fixes:** 6-8 hours of engineering time
- **Testing:** 2-3 hours
- **Deployment:** 1 hour
- **Total:** ~10-12 hours

Can potentially run in parallel to speed up.

---

**Last Updated:** February 18, 2026  
**Next Review:** After all fixes implemented  
**Owner:** Engineering Lead  
**Status:** Ready for implementation

