# Billing Fixes Verification Script

**Purpose:** Automated verification that all P0 billing fixes are working correctly  
**Duration:** 15–20 minutes to run  
**When to Run:** After deploying to staging, before production rollout  
**Prerequisites:** Access to staging Convex dashboard, test user account, staging webhook endpoint

---

## Quick Verification (5 minutes)

Run this to quickly verify the most critical fixes:

```bash
# Terminal 1: Pull latest code and check fixes are present
git log --oneline -5
# Should show commit with "billing fixes" or similar

# Terminal 2: Run Jest test suite
npm test -- --testPathPattern=billing 2>&1 | tee verify-billing-tests.log

# Check output:
# Should show: PASS (all tests passing)
# Should NOT show: FAIL, snapshot mismatch, timeout

# Terminal 3: Check Convex schema
grep -n "archivedByDowngrade\|PLAN_LIMITS" convex/habits.ts convex/goals.ts
# Should show:
# - convex/habits.ts: PLAN_LIMITS with free: 10
# - convex/goals.ts: PLAN_LIMITS with free: 3
# - Both files reference archivedByDowngrade field

echo "✅ Quick verification complete"
```

---

## Full Verification (15–20 minutes)

### Step 1: Verify Plan Limits Constants (2 min)

```bash
echo "=== Checking Plan Limits Alignment ==="

# Check habits
echo "Habits PLAN_LIMITS:"
grep -A 4 "const PLAN_LIMITS" convex/habits.ts

# Check goals
echo "Goals PLAN_LIMITS:"
grep -A 4 "const PLAN_LIMITS" convex/goals.ts

# Check UI
echo "UI Plan Limits:"
grep -r "free.*10.*3\|maxHabits.*10\|maxGoals.*3" src/ --include="*.ts" --include="*.tsx" | head -5

# PASS: All three sources should show 10 habits, 3 goals for free tier
```

### Step 2: Verify Archive/Restore Mutations (3 min)

```bash
echo "=== Checking Archive/Restore Implementation ==="

# Check habits.ts has archive/restore
echo "Habits archive mutations:"
grep -n "archiveExcessOnDowngradeInternal\|restoreArchivedOnUpgradeInternal" convex/habits.ts

# Check goals.ts has archive/restore
echo "Goals archive mutations:"
grep -n "archiveExcessOnDowngradeInternal\|restoreArchivedOnUpgradeInternal" convex/goals.ts

# Check users.ts calls them
echo "Users.ts calls:"
grep -n "archiveExcessOnDowngradeInternal\|restoreArchivedOnUpgradeInternal" convex/users.ts

# PASS: Should see multiple matches showing archive/restore helpers exist
```

### Step 3: Verify Transaction Safety Helpers (3 min)

```bash
echo "=== Checking Transaction Safety ==="

# Check helpers exist
echo "Transaction helpers:"
grep -n "export..checkAndCreateHabit\|export..checkAndCreateGoal" convex/lib/transactions.ts

# Check they're used in create mutations
echo "Used in create mutations:"
grep -n "checkAndCreateHabit\|checkAndCreateGoal" convex/habits.ts convex/goals.ts

# PASS: Should see helpers exported and imported in mutation handlers
```

### Step 4: Verify Webhook Security Hardening (3 min)

```bash
echo "=== Checking Webhook Security ==="

# Check signature validation
grep -n "verifySignature\|svix" src/app/api/webhooks/clerk-billing/route.ts

# Check timestamp validation
grep -n "timestamp\|5.*minute\|300.*second" src/app/api/webhooks/clerk-billing/route.ts | head -5

# Check constant-time comparison
grep -n "timingSafeEqual\|constant.*time\|ctimecompare" src/app/api/webhooks/clerk-billing/route.ts

# PASS: Should see timestamp check and constant-time secret comparison
```

### Step 5: Verify Audit Logging (2 min)

```bash
echo "=== Checking Audit Logging ==="

# Check billingEvents table exists
grep -n "billingEvents.*defineTable" convex/schema.ts

# Check logging mutation exists
grep -n "export..logBillingEvent" convex/users.ts

# Check webhook calls logging
grep -n "logBillingEvent\|billingEvents" src/app/api/webhooks/clerk-billing/route.ts

# PASS: Should see table definition, mutation export, and webhook integration
```

### Step 6: Run Full Test Suite (5 min)

```bash
echo "=== Running Full Test Suite ==="

npm test -- --testPathPattern="billing|chatbot|payment" --coverage 2>&1 | tee verify-test-output.log

# PASS: Should show:
# PASS  src/app/api/webhooks/clerk-billing/route.test.ts
# PASS  src/__tests__/billing.archive.test.ts
# PASS  src/__tests__/DowngradePlanNotice.ui.test.tsx
# Total: X tests in Y test suites, X passed

# Generate test coverage report
npm test -- --coverage --testPathPattern="billing" 2>&1 | grep -A 20 "Coverage summary"
```

### Step 7: Manual Staging Test (5 min)

Run this test manually in staging environment:

1. **Create Test User**
   ```
   1. Go to staging app: https://staging.ascendify.com
   2. Sign up with test email: billing-test-{date}@example.com
   3. Confirm you're on "free" plan
   ```

2. **Test Plan Limit**
   ```
   1. Create habits 1-10: All succeed ✓
   2. Attempt habit 11: See error "Plan limit reached (10 max)" ✓
   3. Create goals 1-3: All succeed ✓
   4. Attempt goal 4: See error "Plan limit reached (3 max)" ✓
   ```

3. **Test Archive/Restore (simulated)**
   ```
   1. Get access to Convex mutations in staging
   2. Simulate downgrade:
      - Query: Get test user's ID and 10–15 habits
      - Mutation: Call updatePlanFromWebhook (free tier)
      - Expected: If had >10 habits, excess should be marked archived
   3. Check UI:
      - Refresh dashboard
      - Should see "Archived Items" banner if any archived
   4. Restore via UI:
      - Click "Restore" button in banner
      - Verify habits re-appear in active list
   ```

4. **Test Webhook Signature Validation**
   ```
   1. Use Clerk webhook testing tool (or Svix replay)
   2. Send valid webhook: Should succeed (200 OK)
   3. Send tampered signature: Should fail (403 Forbidden)
   4. Send expired timestamp (> 5 min old): Should fail (400 Bad Request)
   5. Check logs: All attempts logged to billingEvents table
   ```

---

## Verification Checklist

```
Quick Verification:
☐ Git log shows billing commits
☐ npm test passes
☐ PLAN_LIMITS grep finds 10/3 in all files

Full Verification:
☐ Step 1: Plan limits aligned (10 habits, 3 goals)
☐ Step 2: Archive/restore mutations present in all files
☐ Step 3: Transaction safety helpers exported and used
☐ Step 4: Webhook signature and timestamp validation in code
☐ Step 5: Audit logging table, mutation, and webhook integration
☐ Step 6: All tests passing (coverage > 85% for billing)
☐ Step 7: Manual staging tests all pass

Manual Tests:
☐ Free user can create 10 habits, not 11
☐ Free user can create 3 goals, not 4
☐ Downgrade archives excess items
☐ Restore unarchives items
☐ Valid webhook succeeds
☐ Invalid signature rejected
☐ Stale timestamp rejected
☐ All events logged to billingEvents

Sign-Off:
☐ All items above verified
☐ No blocking issues found
☐ Ready for staging deployment
☐ Engineer name: ________________
☐ Date/time: ________________
```

---

## Troubleshooting

### Issue: Tests failing with "Missing module"
**Solution:** Run `npm install` and `npx convex dev`

### Issue: PLAN_LIMITS grep finds different values
**Solution:** Check both habits.ts and goals.ts have the same free tier limits (10/3)

### Issue: Archive mutations not found
**Solution:** Check convex/users.ts for `updatePlanFromWebhook` mutation; it should call archive helpers via `ctx.runMutation()`

### Issue: Webhook test fails with 403
**Solution:** Verify `BILLING_WEBHOOK_SYNC_SECRET` is set correctly in Convex environment

### Issue: Manual test can't access Convex mutations
**Solution:** Use Convex dashboard at https://dashboard.convex.dev, select staging project, browse mutations in Data Explorer

---

## Pass/Fail Criteria

**PASS:** All verifications marked ☐ above completed successfully

**FAIL:** Any of the following:
- Tests not passing (even one FAIL)
- PLAN_LIMITS mismatch between files
- Archive/restore mutations missing or unused
- Webhook security checks not in code
- Manual test scenarios fail

**NEXT STEP IF FAIL:** 
1. Document which verification failed
2. Review corresponding fix in BILLING-FIXES-ACTION-PLAN.md
3. Revert and reimp, or request engineering review
4. Re-run verification

**NEXT STEP IF PASS:** Proceed to production rollout with BILLING-DEPLOYMENT-CHECKLIST.md

