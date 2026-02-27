# Billing Release v2.1.0 — Pre-Deployment Checklist

**Date:** [Deployment Date]  
**Release Manager:** [Name]  
**Expected Rollout Duration:** 12–18 hours (3 phases)

---

## 48 Hours Before Rollout

- [ ] All PR approvals collected and documented ([BILLING-RELEASE-SIGN-OFF.md](BILLING-RELEASE-SIGN-OFF.md))
- [ ] Staging deployment completed and tested
  - [ ] Webhook signature verification works
  - [ ] Plan downgrade → archive excess → audit log written
  - [ ] Archive count shows in UI banner
  - [ ] Restore on upgrade works
- [ ] Support team briefed:
  - [ ] What the feature does (data preservation)
  - [ ] What user will see (UI banner + archived items in settings)
  - [ ] How to help users restore archived items (settings > Archived > Restore)
- [ ] Monitoring dashboards prepared and live:
  - [ ] Webhook latency (p50, p99)
  - [ ] Archive/restore success rate (%)
  - [ ] Downgrade event volume
  - [ ] Audit log write failures
- [ ] Load test completed on staging (1000 concurrent webhooks, observe latency)
- [ ] Rollback procedure tested:
  - [ ] Feature flag toggle tested (on → off → on)
  - [ ] Git revert tested (confirm able to revert in < 5 min)
- [ ] Backup confirmed current
- [ ] Status page prepared (if expecting to report during rollout)

---

## 24 Hours Before Rollout

- [ ] All team members notified of rollout window
- [ ] Slack channels created/verified (#billing-rollout-monitoring, #incident-Response if needed)
- [ ] On-call engineer confirmed and briefed
- [ ] Product manager standby during Phase 1
- [ ] Ops engineer confirmed and dashboards open
- [ ] Support team ready (extra staff during rollout hours)
- [ ] All secrets confirmed in production (not staging):
  - [ ] `CLERK_WEBHOOK_SECRET` set
  - [ ] `BILLING_WEBHOOK_SYNC_SECRET` set
  - [ ] Both secrets match expected values
- [ ] Feature flag prepared (`BILLING_FIXES_ENABLED` or equivalent)
- [ ] Git PR merged and commit SHA confirmed

---

## 4 Hours Before Rollout

- [ ] Final commit hash confirmed: `_________________` (Git SHA)
- [ ] Production deployment validated (staging → prod code path verified)
- [ ] Monitoring dashboards live and refreshing
- [ ] All team members online:
  - [ ] Engineering lead: present
  - [ ] On-call engineer: present
  - [ ] Ops/DevOps: present
  - [ ] Product: available (standby)
  - [ ] Support lead: present
- [ ] Slack channels verified (all members added)
- [ ] Status page access confirmed (if applicable)
- [ ] Rollback plan reviewed one more time with ops
- [ ] Load test baseline noted for comparison:
  - [ ] Baseline webhook latency p99: `__________ ms`
  - [ ] Baseline archive success rate: `__________ %`

---

## 1 Hour Before Rollout (Final Checks)

- [ ] Database backup initiated (Convex or primary data store)
- [ ] Feature flag set to `false` (disabled by default)
- [ ] All monitoring queries prepared:
  - [ ] Webhook latency query copy-pasted into editor
  - [ ] Archive success rate query ready
  - [ ] Error log query ready
- [ ] Slack updates scheduled (announcements at phase transitions)
- [ ] Team briefing completed (everyone knows the phases, timings, success criteria)
- [ ] Any last-minute changes reviewed and approved
- [ ] No ongoing incidents or maintenance windows

---

## Phase 1: Canary (5% of users) — 4 Hours

**Start Time:** `__________________`

### Actions (T+0 min)
- [ ] Enable `BILLING_FIXES_ENABLED=true` OR set feature flag percentage to 5%
- [ ] Confirm change deployed (check logs for "Billing fixes enabled 5% of requests")
- [ ] Announce in #billing-rollout-monitoring: "Canary phase started"

### Monitoring (T+5 to T+15 min)
- [ ] Watch webhook logs for errors
  - [ ] No signature failures
  - [ ] No timestamp rejections (should be zero in canary)
- [ ] Check database: query archive success rate (expect > 99%)
- [ ] Confirm UI banner renders (check logs or staging screenshot)
- [ ] Ask support: any user complaints so far? (should be zero)

### Monitoring (T+30 min - T+1.5 hours)
- [ ] Run latency query: compare p99 to baseline (should be < baseline + 50ms)
- [ ] Check downgrade event count: normal rate?
- [ ] Review audit log: all events marked 'applied' or 'ignored', not 'failed'?
- [ ] Team sync: "All looks good so far?"

### Monitoring (T+2 to T+4 hours)
- [ ] Continue monitoring every 15 min
- [ ] Any trending issues?
  - [ ] If latency growing → investigate (may need rollback)
  - [ ] If error rate > 1% → investigate (may need rollback)
  - [ ] If user complaints → escalate

### Phase 1 End (T+4 hours)
- [ ] Success criteria met?
  - [ ] Error rate < 1%
  - [ ] Latency p99 < 500ms
  - [ ] Archive success > 99%
  - [ ] Zero critical user issues
- [ ] Team agreement to proceed to Phase 2?
  - [ ] Engineering lead: **Yes / No / Conditional**
  - [ ] Ops: **Yes / No / Conditional**
  - [ ] Product (standby): **Yes / No / Conditional**

**Decision:** ☐ **PROCEED to Phase 2** | ☐ **HOLD (investigate)** | ☐ **ROLLBACK (critical issue)**

---

## Phase 2: Wide Rollout (25% of users) — 8 Hours

**Start Time:** `__________________`

### Actions (T+0 min)
- [ ] Increase feature flag percentage to 25%
- [ ] Announce in #billing-rollout-monitoring: "Phase 2 started (25% rollout)"

### Monitoring (T+5 to T+30 min)
- [ ] Watch error rate (expect similar or lower than Phase 1)
- [ ] Check for any new error categories (log for "ERROR" or "CRITICAL")
- [ ] Confirm no db errors or connection failures

### Data Integrity Spot Check (T+1 hour)
- [ ] Query: sample 5 downgraded users, verify `archivedByDowngrade: true` marked correctly
  ```sql
  SELECT COUNT(*) as archived_count FROM habits WHERE archivedByDowngrade = true AND userId = 'test_user_1';
  ```
- [ ] Query: confirm restore mutations logged counts correctly
  ```sql
  SELECT plan, COUNT(*) FROM billingEvents WHERE eventType = 'plan_changed' AND reason LIKE 'restored_%' GROUP BY plan;
  ```

### Monitoring Throughout Phase 2
- [ ] Every 2 hours: run latency query (p99 should stay < 500ms)
- [ ] Every 2 hours: check downgrade volume (normal rate?)
- [ ] Every 2 hours: check audit log write errors (should be < 10 in 2 hours)
- [ ] Ask support every 2 hours: "Any issues?" (document response)

### Phase 2 Mid-Point (T+4 hours)
- [ ] Team check-in: "Everything stable?"
- [ ] Any issues identified? Document and decide: continue or hold.

### Phase 2 End (T+8 hours)
- [ ] Success criteria met?
  - [ ] Error rate < 1%
  - [ ] Latency p99 < 500ms
  - [ ] Archive/restore working correctly
  - [ ] Zero complaints from support
- [ ] Team agreement to proceed to Phase 3 (100%)?
  - [ ] Engineering lead: **Yes / No / Conditional**
  - [ ] Ops: **Yes / No / Conditional**
  - [ ] Product: **Yes / No / Conditional**

**Decision:** ☐ **PROCEED to Phase 3** | ☐ **HOLD (investigate)** | ☐ **ROLLBACK (issue found)**

---

## Phase 3: Full Rollout (100% of users) — Immediate

**Start Time:** `__________________`

### Actions (T+0 min)
- [ ] Set feature flag to 100% (or remove conditional entirely)
- [ ] Announce in #billing-rollout-monitoring: "Phase 3 started (100% rollout)"

### Immediate Monitoring (T+5 to T+30 min)
- [ ] Watch for any traffic spikes or errors
- [ ] Confirm all requests now use billing fixes
- [ ] Ask support: "Any complaints yet?"

### Ongoing Monitoring (First 24 Hours)
- [ ] Every hour: check latency p99 (watch for degradation)
- [ ] Every hour: check error rate (should be < 0.5%)
- [ ] Every 4 hours: run data integrity spot checks
- [ ] Continuous: watch logs for `[Downgrade]` or `[Archive]` errors

### Post-Rollout (24 Hours Later)
- [ ] Confirm zero critical incidents
- [ ] Metrics stable and nominal
- [ ] Support reports: zero escalations re: missing data
- [ ] Team retrospective:
  - [ ] What went well
  - [ ] What could improve
  - [ ] Action items for next release

---

## Incident Response

**If issues arise during any phase:**

### Alert Triggered
1. [ ] On-call engineer acknowledges (Slack reaction)
2. [ ] On-call engineer investigates (check logs, queries, dashboards)
3. [ ] Engineering lead notified if unsure

### Decision Tree
- **Data Loss / Corruption Suspected**
  - → **ROLLBACK IMMEDIATELY** (feature flag false)
  - → Escalate to engineering lead + ops
  - → Query `billingEvents` table to identify affected users
  - → Post incident report

- **Error Rate > 5%**
  - → **HOLD** current phase (don't increase rollout %)
  - → Investigate for 1 hour
  - → If unresolved → **ROLLBACK**
  - → If resolved → Proceed or retry phase

- **Latency Spike > 100% above baseline**
  - → **HOLD** current phase
  - → Check for webhook queue backlog or DB bottleneck
  - → If recovers in 15 min → Monitor and proceed
  - → If persists → **ROLLBACK**

- **User-Reported Billing Issue**
  - → **PAUSE** phase (stay at current %)
  - → Escalate to product + support
  - → Investigate with team
  - → If issue confirmed in code → **ROLLBACK**
  - → If false alarm → Continue rollout

---

## Rollback Procedure

**If rollback triggered during any phase:**

### Immediate (0–5 min)
1. [ ] Set `BILLING_FIXES_ENABLED=false` (feature flag, instant)
2. [ ] Announce in #billing-rollout-monitoring: "Rollback initiated — investigating [reason]"
3. [ ] Request ops to revert last commit (if flag not sufficient)

### Investigation (5–15 min)
1. [ ] Engineering lead reviews logs and queries
2. [ ] Determine root cause and severity
3. [ ] Assess: can issue be hot-fixed, or wait for next release?

### Communication (Ongoing)
1. [ ] Update status page (if public rollout): "Investigating billing changes"
2. [ ] Post-incident: root cause + action items

### Post-Rollback
1. [ ] Restore feature to known-good state (feature flag = false or previous commit)
2. [ ] Run sanity checks: plan updates, webhooks, UI work as before
3. [ ] Team retrospective before reattempting

---

## Sign-Off After Deployment

Once fully rolled out and stable (24+ hours):

- [ ] **Engineering Lead** confirms: "Deployment successful, no critical issues"  
  Signature: ____________________ Date: ____________

- [ ] **Ops/DevOps** confirms: "Monitoring stable, alerts not firing"  
  Signature: ____________________ Date: ____________

- [ ] **Product Manager** confirms: "Feature working as expected, user experience good"  
  Signature: ____________________ Date: ____________

- [ ] **Support Lead** confirms: "No user escalations related to billing"  
  Signature: ____________________ Date: ____________

---

## Post-Deployment Retrospective (24–48 Hours After)

**Summary:**  
Release outcome (successful / with issues / etc.): _________________________________

**Key Metrics:**
- Webhook latency p99: __________ ms (baseline: __________ ms)
- Archive success rate: __________ % (target: > 99%)
- Downgrade event volume: __________ events (baseline: __________ events)
- Audit log write errors: __________ (target: < 10 total)

**Issues Encountered (if any):**
```
[Document any issues, their severity, and how they were resolved]
```

**Lessons Learned:**
```
[What went well, what needs improvement for next release]
```

**Next Steps:**
- [ ] Close PR
- [ ] Tag release (v2.1.0)
- [ ] Update help docs with FAQ
- [ ] Prepare launch communication (if external-facing feature)
- [ ] Schedule follow-up retrospective if needed

---
