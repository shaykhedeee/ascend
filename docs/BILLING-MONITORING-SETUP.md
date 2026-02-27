# Billing Release Monitoring & Alerting Setup

**Purpose:** Define dashboards, metrics, and alerts for v2.1.0 rollout  
**Owner:** DevOps / Engineering Lead  
**Setup Time:** 30–45 minutes before rollout  
**Tools:** Convex Analytics Dashboard, Vercel Analytics, Datadog (optional), custom queries

---

## Pre-Rollout Setup Checklist

- [ ] **Convex Dashboard** open in browser at https://dashboard.convex.dev
- [ ] **Vercel Dashboard** open at https://vercel.com/dashboard/deployments
- [ ] **Slack** webhook configured for alerts (optional but recommended)
- [ ] **Database backup** confirmed (Convex automatic or manual)
- [ ] **Monitoring spreadsheet** prepared (shared with team, tracking metrics)
- [ ] **On-call engineer** has links to all dashboards
- [ ] **Support team** has billing-issue escalation SOP

---

## Core Metrics to Monitor

### 1. **Webhook Processing Health**

**Metric:** Webhook latency and error rate

**Where to Check:**
- Convex function invocation logs: `api.users.updatePlanFromWebhook` and `api.users.logBillingEvent`
- Vercel function logs: `/api/webhooks/clerk-billing`

**Dashboard Query:**
```sql
-- Convex: Check updatePlanFromWebhook function execution time
SELECT 
  functionName,
  COUNT(*) as invocations,
  AVG(duration) as avg_latency_ms,
  MAX(duration) as max_latency_ms,
  SUM(CASE WHEN error IS NOT NULL THEN 1 ELSE 0 END) as error_count
FROM convex_function_logs
WHERE functionName = 'users.updatePlanFromWebhook'
  AND timestamp > NOW() - INTERVAL 1 HOUR
GROUP BY functionName;
```

**Expected Results:**
- Avg latency: < 200ms
- Max latency: < 500ms
- Error count: 0 or very low (< 1%)

**Alert Threshold:**
- ERROR: Latency > 1000ms OR error_count > 5%
- WARNING: Latency > 500ms OR error_count > 1%

---

### 2. **Plan Downgrade Trigger Rate**

**Metric:** How many plan downgrade events occurred

**Where to Check:**
- `billingEvents` table in Convex

**Dashboard Query:**
```sql
-- Check downgrade events
SELECT 
  DATE_TRUNC(createdAt, HOUR) as hour,
  COUNT(*) as downgrade_count,
  SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success_count,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as fail_count
FROM billingEvents
WHERE eventType = 'plan_changed'
  AND newPlan = 'free'
  AND createdAt > NOW() - INTERVAL 24 HOURS
GROUP BY 1
ORDER BY 1 DESC;
```

**Expected Results (during normal operation):**
- Varies by user base (typically 1-5 per hour for moderate user base)
- Success rate: > 99%
- Fail count: Should stay low (< 1 failure per hour)

**Alert Threshold:**
- ERROR: Fail rate > 5%
- WARNING: Fail rate > 1%

---

### 3. **Archive/Restore Success Rate**

**Metric:** When users downgrade, did we successfully archive their excess items?

**Where to Check:**
- `billingEvents` table, filter for archive-related events
- Convex query logs for `archiveExcessOnDowngradeInternal` mutations

**Dashboard Query:**
```sql
-- Check archive operations on downgrades
SELECT 
  DATE_TRUNC(createdAt, HOUR) as hour,
  COUNT(*) as total_downgrades,
  SUM(CASE WHEN metadata LIKE '%archivedHabitCount%' THEN 1 ELSE 0 END) as had_archived_habits,
  SUM(CASE WHEN metadata LIKE '%archivedGoalCount%' THEN 1 ELSE 0 END) as had_archived_goals,
  SUM(CASE WHEN status = 'success' AND metadata LIKE '%archived%' THEN 1 ELSE 0 END) as successful_archives
FROM billingEvents
WHERE eventType = 'plan_changed'
  AND newPlan = 'free'
  AND createdAt > NOW() - INTERVAL 24 HOURS
GROUP BY 1
ORDER BY 1 DESC;
```

**Expected Results:**
- For downgrades from Pro → Free where user had > 10 habits or > 3 goals:
  - Archive operation should succeed 100% of the time
  - Check `habits` and `goals` tables: archived items have `archivedByDowngrade = true`

**Alert Threshold:**
- ERROR: Archive failures > 0
- WARNING: Archive success < 100%

---

### 4. **UI Banner Rendering** (Optional, Client-Side Metric)

**Metric:** DowngradePlanNotice banner appears when user has archived items

**Where to Check:**
- Browser console logs (if instrumentation added)
- User reports / support tickets
- Manual spot checks in staging

**What to Verify:**
```json
{
  "component": "DowngradePlanNotice",
  "event": "banner_rendered",
  "user_id": "...",
  "archived_habits_count": 5,
  "archived_goals_count": 1,
  "timestamp": "2026-02-26T14:32:00Z"
}
```

**Expected Results:**
- Banner renders within 100ms of page load
- Shows accurate archived item counts
- Restore button clickable and functional

**Alert Threshold:**
- ERROR: Banner not rendering for users with archived items
- WARNING: Banner rendering latency > 500ms

---

### 5. **Audit Log Completeness**

**Metric:** All billing events are being logged to `billingEvents` table

**Where to Check:**
- Query `billingEvents` table for recent entries

**Dashboard Query:**
```sql
-- Check audit log writes
SELECT 
  eventType,
  COUNT(*) as count,
  SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
FROM billingEvents
WHERE createdAt > NOW() - INTERVAL 1 HOUR
GROUP BY eventType
ORDER BY count DESC;
```

**Expected Results:**
- Events logged for: plan_changed, archive_initiated, restore_initiated, webhook_received
- Success rate: > 99% (audit failures are best-effort, but should be rare)
- No gaps in timestamp sequence (indicates no missing events)

**Alert Threshold:**
- ERROR: Audit write failures > 5% (indicates data logging problem)
- WARNING: Audit write failures > 1%

---

## Critical Alerts to Configure

### Alert 1: High Webhook Error Rate

**Condition:** Error rate in webhook handler > 5%  
**Action:** Page on-call engineer immediately  
**Message:** "Billing webhook handler failing (>5% errors) — check logs and rollback if needed"

**Convex Cloud Setup:**
1. Open Convex Dashboard → Functions
2. Find `clerk-billing` webhook route
3. Set alert on error count

### Alert 2: Elevated Latency

**Condition:** Webhook latency p99 > 1 second  
**Action:** Notify ops and engineering  
**Message:** "Billing webhook latency high — may indicate DB bottleneck"

### Alert 3: Archive Operation Failures

**Condition:** Archive mutation failure rate > 0%  
**Action:** Page on-call engineer immediately  
**Message:** "Archive/restore failures detected — potential data loss during downgrade"

### Alert 4: Missing Audit Events

**Condition:** No `plan_changed` events logged in last 30 min (when downgrades expected)  
**Action:** Notify engineering  
**Message:** "No downgrade events detected — check if webhook integration is working"

---

## Real-Time Monitoring Dashboard (Setup)

### Option A: Convex Dashboard (Built-In, Recommended)

1. Open [Convex Dashboard](https://dashboard.convex.dev)
2. Go to **Deployment** → **Your Prod Deployment**
3. Select **Functions**
4. Set up views for:
   - `users.updatePlanFromWebhook` (latency, error rate, invocation count)
   - `users.logBillingEvent` (invocation count, success rate)
   - `habits.archiveExcessOnDowngradeInternal` (invocation count, status)
   - `goals.archiveExcessOnDowngradeInternal` (invocation count, status)

**Screenshots to Save:**
- Before rollout: baseline metrics (expected values)
- During Phase 1: metrics at 5% scale
- During Phase 2: metrics at 25% scale
- After Phase 3: metrics at 100% scale

### Option B: Custom Monitoring Spreadsheet

**Template:**

```markdown
| Timestamp | Phase | Metric | Value | Expected | Status | Notes |
|-----------|-------|--------|-------|----------|--------|-------|
| 14:00 | Phase 1 (5%) | Webhook Latency p99 | 145ms | <500ms | ✓ PASS | Normal |
| 14:15 | Phase 1 (5%) | Archive Success Rate | 100% | >99% | ✓ PASS | - |
| 14:30 | Phase 1 (5%) | Downgrade Events | 3 | ~1-3/15min | ✓ PASS | Baseline |
| 15:00 | Phase 1 (5%) | Webhook Error Rate | 0% | <1% | ✓ PASS | - |

[Continue for all phases and every 15-30 min during rollout]
```

**Spreadsheet Location:** Shared in Slack / Wiki (URL: _____________)

### Option C: Datadog (Optional, Enterprise)

If using Datadog:

```yaml
dashboards:
  - name: "Billing Release v2.1.0"
    widgets:
      - title: "Webhook Latency (p50, p99)"
        metric: "convex.function.duration"
        filter: "function:users.updatePlanFromWebhook"
      - title: "Webhook Error Rate"
        metric: "convex.function.error_count"
        filter: "function:users.updatePlanFromWebhook"
      - title: "Archive Success Rate"
        metric: "convex.function.success_rate"
        filter: "function:habits.archiveExcessOnDowngradeInternal"
      - title: "Audit Log Writes"
        metric: "convex.mutation.invocations"
        filter: "function:users.logBillingEvent"
```

---

## During Rollout: Live Monitoring Tasks

### Phase 1 (Canary, 5%) — Every 15 minutes
- [ ] Check webhook latency p99: _________________ ms (target: < 500ms)
- [ ] Check error rate: _________________ % (target: < 1%)
- [ ] Check archive success rate: _________________ % (target: > 99%)
- [ ] Check for new error types in logs: _________________
- [ ] Check downgrade event count (realistic?): _________________

### Phase 2 (Wide, 25%) — Every 30 minutes
- [ ] Latency stable at Phase 1 levels? ☐ Yes / ☐ No
- [ ] Error rate stable or lower? ☐ Yes / ☐ No
- [ ] Archive/restore working? ☐ Yes / ☐ No
- [ ] Any user reports in support? ☐ None / ☐ X issues
- [ ] DB query performance normal? ☐ Yes / ☐ No

### Phase 3 (Full, 100%) — Every 1 hour
- [ ] Metrics stable over time? ☐ Yes / ☐ No
- [ ] No trending issues? ☐ Correct / ☐ Degrading
- [ ] Support quiet (no escalations)? ☐ Yes / ☐ Issues
- [ ] All queries respond < 1s? ☐ Yes / ☐ Slow queries

---

## Post-Rollout: Verification (24 Hours Later)

```sql
-- Final audit: Confirm all downgrades processed correctly
SELECT 
  plan,
  COUNT(*) as user_count,
  AVG(JSON_EXTRACT(metadata, '$.archivedHabitCount')) as avg_archived_habits,
  AVG(JSON_EXTRACT(metadata, '$.archivedGoalCount')) as avg_archived_goals,
  SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success_count,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as fail_count
FROM billingEvents
WHERE eventType = 'plan_changed'
  AND newPlan = 'free'
  AND createdAt > NOW() - INTERVAL 24 HOURS
GROUP BY plan;
```

**Sign-Off:**
- [ ] All metrics nominal (no errors, latency OK)
- [ ] No data loss or corruption detected
- [ ] Audit trail complete and accurate
- [ ] Support reports zero billing-related escalations
- [ ] Engineering lead approval: ________________
- [ ] Date/time: ________________

---

## Rollback Monitoring

If rollback triggered, monitor these **immediately**:

1. **Feature flag disabled** → Webhook logic reverts to previous version
2. **Latency returns to baseline** → Within 5 min
3. **Error rate drops to zero** → No errors from new code
4. **Archived items unaffected** → Already marked in DB, will persist
5. **Next rollout plan** → Scheduled after root cause fix

**Post-Rollback Verification:**
```bash
# Confirm rollback applied
grep -n "BILLING_FIXES_ENABLED" src/app/api/webhooks/clerk-billing/route.ts
# Should show: BILLING_FIXES_ENABLED = false (or missing feature flag)

# Confirm old webhook behavior restored
npm test -- src/app/api/webhooks/clerk-billing/route.test.ts
# Should pass (tests written for both old and new paths)
```

---

## Troubleshooting

### "Metrics dashboard not loading"
- **Solution:** Refresh browser, check Convex auth, verify project permission

### "Webhook latency spiking"
- **Solution:** Check Convex function logs for timeouts; check DB query slowness

### "Archive mutations not appearing in logs"
- **Solution:** Verify `updatePlanFromWebhook` is calling `ctx.runMutation()` correctly

### "Zero downgrade events (when expecting some)"
- **Solution:** Check if Clerk webhooks reaching your endpoint; test webhook delivery in Clerk dashboard

### "Audit log missing entries"
- **Solution:** Check for `logBillingEvent` errors; audit logging is best-effort, may have small gaps

