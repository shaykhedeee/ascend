# ASCENDIFY BILLING FIXES — IMPLEMENTATION TRACKER

**Use this document to track progress on fixing billing issues**

Generated: February 18, 2026  
Status: Ready for Implementation  
Estimated Total Time: 6-8 hours + 1-2 hours testing

---

## PHASE 1: CRITICAL FIXES (6-8 HOURS)

### Fix #1: Plan Limits Match Backend to Marketing ⭐ **START HERE**

**Priority:** P0 (Blocks launch)  
**Complexity:** 🟢 Easy (5 min)  
**Implementation Owner:** [NAME]  
**Status:** ⬜ Not Started

#### What to Change
File 1: `convex/habits.ts` line 119
```diff
  const PLAN_LIMITS = {
-   free: { maxHabits: 5 },
+   free: { maxHabits: 10 },
    pro: { maxHabits: Infinity },
    lifetime: { maxHabits: Infinity },
  };
```

File 2: `convex/goals.ts` line 10
```diff
  const PLAN_LIMITS = {
-   free: { maxGoals: 1 },
+   free: { maxGoals: 3 },
    pro: { maxGoals: Infinity },
    lifetime: { maxGoals: Infinity },
  };
```

#### Verification
- [ ] Change made to `convex/habits.ts`
- [ ] Change made to `convex/goals.ts`
- [ ] Verified: `src/hooks/usePlanGating.ts` already has 10, 3
- [ ] Verified: `src/lib/billing/plans.ts` features match
- [ ] Tested locally: Free user can create 10 habits
- [ ] Tested locally: Free user can create 3 goals
- [ ] Tested locally: 11th habit rejected
- [ ] Tested locally: 4th goal rejected
- [ ] Git commit message: "fix(billing): align free plan limits with marketing claims"
- [ ] Code review approved
- [ ] Merged to main

**Time Estimate:** 15 min (including tests)  
**Blockers:** None  
**Status:** 

- [ ] Code change: ⬜ Not started
- [ ] Testing: ⬜ Not started
- [ ] Review: ⬜ Not started
- [ ] Merged: ⬜ Not started

---

### Fix #2: Data Preservation on Downgrade

**Priority:** P0 (Blocks launch)  
**Complexity:** 🟠 Medium (6-8 hrs)  
**Implementation Owner:** [NAME]  
**Status:** ⬜ Not Started

#### What to Build

##### Step 1: Update Schema
File: `convex/schema.ts`

- [ ] Add `status` field to `habits` table
- [ ] Add `status` field to `goals` table
- [ ] Include literal: `'archived_downgrade'`
- [ ] Add index if needed

##### Step 2: Create Handler Mutation
File: `convex/users.ts`

- [ ] Add new mutation: `handlePlanDowngrade`
- [ ] Takes: userId, oldPlan, newPlan
- [ ] Returns: { archivedHabitCount, archivedGoalCount }
- [ ] Archives excess habits (>10 for free)
- [ ] Archives excess goals (>3 for free)
- [ ] Logs what was archived

##### Step 3: Update Webhook Handler
File: `src/app/api/webhooks/clerk-billing/route.ts`

- [ ] Call `handlePlanDowngrade` after plan update
- [ ] Pass user._id, oldPlan, newPlan
- [ ] Handle result (log counts)
- [ ] Test with actual webhook data

##### Step 4: Add UI Notification
File: `src/components/` (new file: `DowngradePlanNotice.tsx`)

- [ ] Create component showing archived items
- [ ] Show count of archived habits/goals
- [ ] Link to upgrade page
- [ ] Allow dismissing notification

##### Step 5: Add Dashboard Restoration
File: `src/components/` (new)

- [ ] Show "Archived Items" section in settings
- [ ] Allow viewing archived habits
- [ ] Show "Upgrade to Restore" button
- [ ] Load archived items on upgrade

#### Verification
- [ ] Schema migration passes
- [ ] Unit test: Archive 15 habits on downgrade (keep 10)
- [ ] Unit test: Archive 5 goals on downgrade (keep 3)
- [ ] Integration test: Webhook → Archive → UI shows
- [ ] Database check: Archived items marked correctly
- [ ] UI displays notification for downgraded users
- [ ] UI allows restoring on upgrade

**Time Estimate:** 6-8 hours  
**Blockers:** Fix #1 must be done first  
**Dependencies:** Fix #3 (race condition fix helps here)  

**Status:**
- [ ] Schema: ⬜ Not started
- [ ] Handler: ⬜ Not started
- [ ] Webhook: ⬜ Not started
- [ ] UI: ⬜ Not started
- [ ] Tests: ⬜ Not started
- [ ] Review: ⬜ Not started
- [ ] Merged: ⬜ Not started

---

### Fix #3: Race Condition on Concurrent Updates

**Priority:** P0 (Blocks launch)  
**Complexity:** 🔴 Hard (6+ hrs)  
**Implementation Owner:** [NAME]  
**Status:** ⬜ Not Started

#### What to Build

##### Step 1: Create Transaction Helper
File: `convex/lib/transactions.ts` (NEW)

- [ ] Export function: `checkAndCreateHabit()`
- [ ] Atomically: gets user → checks limit → creates habit
- [ ] Returns: habitId on success
- [ ] Throws: Error with limit message on failure
- [ ] Export function: `checkAndCreateGoal()` (similar)

##### Step 2: Update Habits Mutation
File: `convex/habits.ts`

- [ ] Update `create` mutation
- [ ] Replace: get user → check limit → insert
- [ ] With: call `checkAndCreateHabit()`
- [ ] Import helper function

##### Step 3: Update Goals Mutation
File: `convex/goals.ts`

- [ ] Update `create` mutation  
- [ ] Replace: get user → check limit → insert
- [ ] With: call `checkAndCreateGoal()`
- [ ] Import helper function

#### Verification
- [ ] Simple case: Create habit at limit → rejected
- [ ] Race case: Create habit while webhook runs
  - [ ] Create starts (sees free plan)
  - [ ] Webhook updates to pro (parallel)
  - [ ] Create completes → consistent result (no race)
- [ ] Concurrent load test: 10 simultaneous creates at limit
- [ ] All requests atomic (no duplicate inserts)
- [ ] Error messages consistent

**Time Estimate:** 6+ hours  
**Blockers:** None (can run in parallel with #2)  
**Risks:** Convex might have limitations on transactions

**Status:**
- [ ] Helper: ⬜ Not started
- [ ] Habits: ⬜ Not started
- [ ] Goals: ⬜ Not started
- [ ] Tests: ⬜ Not started
- [ ] Review: ⬜ Not started
- [ ] Merged: ⬜ Not started

---

### Phase 1 Summary

| Fix | Status | Owner | Est Time | Done By |
|-----|--------|-------|----------|---------|
| #1 Limits | ⬜ | _____ | 15 min | ___/__ |
| #2 Data | ⬜ | _____ | 6-8 hrs | ___/__ |
| #3 Race | ⬜ | _____ | 6+ hrs | ___/__ |
| Testing | ⬜ | _____ | 1-2 hrs | ___/__ |

**Phase 1 Total:** 13-16 hours (with parallelization: 8-10 hours)  
**Phase 1 Deadline:** [DATE/TIME]

---

## PHASE 2: HIGH PRIORITY FIXES (4-5 HOURS)

### Fix #4: Webhook Timestamp Validation

**Priority:** P1 (Before production)  
**Complexity:** 🟢 Easy (1 hr)  
**Implementation Owner:** [NAME]  
**Status:** ⬜ Not Started

#### What to Change

File: `src/app/api/webhooks/clerk-billing/route.ts` after line 60

```typescript
// Add after signature verification, before event processing:
const headerTimestamp = parseInt(svix_timestamp);
const nowTimestamp = Math.floor(Date.now() / 1000);
const ageDifference = Math.abs(nowTimestamp - headerTimestamp);

const MAX_WEBHOOK_AGE_SECONDS = 300; // 5 minutes

if (ageDifference > MAX_WEBHOOK_AGE_SECONDS) {
  console.warn(
    `[Webhook] Rejecting webhook older than 5 minutes (${ageDifference}s old)`
  );
  return NextResponse.json(
    { error: 'Webhook timestamp too old' },
    { status: 400 }
  );
}
```

#### Verification
- [ ] Added timestamp age calculation
- [ ] Rejects webhooks >5 minutes old
- [ ] Returns 400 status
- [ ] Logs warning with age
- [ ] Test: Recent webhook (now) → accepted
- [ ] Test: Old webhook (10 min) → rejected

**Status:**
- [ ] Code change: ⬜
- [ ] Tests: ⬜
- [ ] Review: ⬜
- [ ] Merged: ⬜

---

### Fix #5: Audit Logging System

**Priority:** P1 (Before production)  
**Complexity:** 🟠 Medium (2-3 hrs)  
**Implementation Owner:** [NAME]  
**Status:** ⬜ Not Started

#### What to Build

##### Step 1: Add Schema Table
File: `convex/schema.ts`

- [ ] Add `billingEvents` table
- [ ] Fields: userId, clerkId, eventType, timestamp, source, details
- [ ] Indexes: by_userId, by_clerkId, by_timestamp

##### Step 2: Create Logging Helper
File: `convex/lib/billing-log.ts` (NEW)

- [ ] Export mutation: `logBillingEvent`
- [ ] Takes event details
- [ ] Inserts to billingEvents

##### Step 3: Add Logging Calls
File: `src/app/api/webhooks/clerk-billing/route.ts`

- [ ] Log on plan_changed event
- [ ] Log on mutations successful
- [ ] Log on mutations failed
- [ ] Include oldValue/newValue

#### Verification
- [ ] Schema migration passes
- [ ] Webhook logs events
- [ ] Can query: SELECT * FROM billingEvents WHERE clerkId='user123'
- [ ] Shows plan changes with timestamps
- [ ] Support can use for debugging

**Status:**
- [ ] Schema: ⬜
- [ ] Helper: ⬜
- [ ] Logging: ⬜
- [ ] Tests: ⬜
- [ ] Review: ⬜
- [ ] Merged: ⬜

---

### Fix #6: Parameter Sanitization

**Priority:** P1 (Security)  
**Complexity:** 🟢 Easy (30 min)  
**Implementation Owner:** [NAME]  
**Status:** ⬜ Not Started

#### What to Change

File: `src/app/payment/success/page.tsx`

```typescript
// Add import:
import DOMPurify from 'dompurify';

// Add sanitization:
const transactionId = DOMPurify.sanitize(
  searchParams.get('txnid') || ''
);
```

File: `src/app/payment/failure/page.tsx` (same)

#### Verification
- [ ] dompurify installed: `npm list dompurify`
- [ ] Success page sanitizes all params
- [ ] Failure page sanitizes all params
- [ ] Test XSS: `/payment/success?txnid=<script>` → no execution

**Status:**
- [ ] Install: ⬜
- [ ] Success page: ⬜
- [ ] Failure page: ⬜
- [ ] Tests: ⬜
- [ ] Review: ⬜
- [ ] Merged: ⬜

---

### Phase 2 Summary

| Fix | Status | Owner | Time | Done By |
|-----|--------|-------|------|---------|
| #4 Timestamp | ⬜ | _____ | 1 hr | ___/__ |
| #5 Logging | ⬜ | _____ | 2-3 hrs | ___/__ |
| #6 Sanitize | ⬜ | _____ | 30 min | ___/__ |

**Phase 2 Total:** 4-5 hours  
**Phase 2 Deadline:** [DATE/TIME]

---

## TESTING PHASE (2-3 HOURS)

### Unit Tests
- [ ] Plan limits (5 min)
- [ ] Data archiving (30 min)
- [ ] Race condition prevention (30 min)
- [ ] Timestamp validation (10 min)
- [ ] Logging (15 min)

### Integration Tests
- [ ] Signup → Free plan (5 min)
- [ ] Create habits (5 min)
- [ ] Downgrade → Archive (15 min)
- [ ] Upgrade → Restore (15 min)
- [ ] Webhook processing (20 min)

### Security Tests
- [ ] XSS parameter handling (10 min)
- [ ] Timestamp replay attack (10 min)
- [ ] Secret timing-safe (5 min)

### Load Tests (Optional)
- [ ] 100 concurrent webhooks (10 min)
- [ ] Habit creation at limit (10 min)

---

## DEPLOYMENT CHECKLIST

### Pre-Staging
- [ ] All code reviewed by 1+ senior
- [ ] All tests passing locally
- [ ] No console errors
- [ ] Git history clean

### Staging Deployment
- [ ] Schema migrations applied
- [ ] Environment variables set
- [ ] Full integration test run
- [ ] Payment flow tested end-to-end
- [ ] Webhook simulator tested

### Pre-Production
- [ ] Engineering sign-off
- [ ] Product manager approval
- [ ] Load test passing (1000s/sec)
- [ ] Monitoring set up
- [ ] Rollback plan documented

### Production Deployment
- [ ] Off-peak time (2-4am)
- [ ] Gradual rollout (1% → 10% → 100%)
- [ ] Live monitoring enabled
- [ ] On-call engineering ready
- [ ] First hour: no promotions sent

---

## WEEKLY STATUS TEMPLATE

### Week of [DATE]

#### This Week's Goals
- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

#### Completed
- [x] Completed item 1
- [x] Completed item 2

#### In Progress
- [ ] In progress item 1
- [ ] In progress item 2

#### Blocked
- [ ] Blocked item 1 (reason: ...)

#### Issues Found
- Issue 1: ...
- Issue 2: ...

#### Next Week
- [ ] Next week item 1
- [ ] Next week item 2

---

## COMMUNICATION LOG

### To Be Scheduled
- [ ] Team kickoff meeting (30 min)
- [ ] Mid-week sync (15 min)
- [ ] Pre-launch review (1 hour)

### Completed
- [x] Initial discovery (18 Feb)
- [x] QA report shared (18 Feb)

### Action Items for Others
- [ ] Provide PayU credentials for testing
- [ ] Set up Clerk webhook simulator
- [ ] Create staging environment
- [ ] Brief customer support on changes

---

## SUCCESS CRITERIA

Before declaring "Complete":

✅ All code changes implemented  
✅ All tests passing (100% pass rate)  
✅ Code reviewed by 2+ engineers  
✅ Staging deployment successful  
✅ End-to-end test executed  
✅ Load test: 1000s/sec webhooks handled  
✅ Security review cleared  
✅ Product manager sign-off  
✅ Monitoring/alerting configured  
✅ Runbook documented  
✅ Customer support trained  

---

## RISK MITIGATION

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Fix breaks existing features | Medium | High | Full regression test |
| Downgrade breaks data | Low | Critical | Automated backup |
| Webhook replay attack | Low | Medium | Timestamp validation |
| Race condition persists | Low | High | Load testing |
| Rollback needed | Low | Critical | Test rollback procedure |

---

## NOTES & DECISIONS

```
[Space for team notes, decisions, learnings]

Decision Log:
- Fixed plan limits to 10/3 (Option 1) ← Feb 18
- Chose archiving over deletion for excess items ← [DATE]
- 5-min webhook age window (Svix standard) ← [DATE]

Learnings:
- Multiple source of truth causes inconsistency
- Webhooks must be idempotent
- Need audit trail for support
```

---

**Document Version:** 1.0  
**Last Updated:** February 18, 2026  
**Track Status:** Ready for Engineering

*Print this page and post in engineering area for visibility*

