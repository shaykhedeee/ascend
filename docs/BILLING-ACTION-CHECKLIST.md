# 🚀 Billing v2.1.0 Release — Master Action Checklist

**Date:** February 26, 2026  
**Status:** Code ready, documentation complete, awaiting approvals  
**Print this page and post in #billing-v2.1-release Slack channel**

---

## 📋 STEP-BY-STEP RELEASE CHECKLIST

### ✅ STEP 1: Collect Stakeholder Approvals (TODAY, 1–2 hours)

**Owner:** Engineering Lead

**Action Items:**
- [ ] Print or share [BILLING-RELEASE-SIGN-OFF.md](docs/BILLING-RELEASE-SIGN-OFF.md)
- [ ] Send to 5 stakeholders (engineering, product, QA, ops, security)
- [ ] Set deadline for responses (e.g., "by end of business today")
- [ ] Collect completed forms with signatures/approvals

**When Each Role Should Approve:**
- [ ] **Engineering Lead** ← Must check: code quality, security hardening, test coverage
- [ ] **Product Manager** ← Must check: feature aligns with requirements, user impact
- [ ] **QA Lead** ← Must check: test coverage adequate, staging validation plan clear
- [ ] **Ops/DevOps Lead** ← Must check: deployment plan feasible, monitoring ready
- [ ] **Security Lead** ← Must check: webhook security hardened, no vulns

**Success Criteria:** All 5 sign-offs collected and approvals marked "GO"

---

### ✅ STEP 2: Staging Deployment & Validation (NEXT DAY, 2–4 hours)

**Owner:** DevOps / Ops Engineer  
**Prerequisite:** All approvals from Step 1

**Preparation (30 min before):**
- [ ] Open [BILLING-FIX-VERIFICATION-SCRIPT.md](docs/BILLING-FIX-VERIFICATION-SCRIPT.md) in tab 1
- [ ] Open staging dashboard in tab 2
- [ ] Open test user account in tab 3
- [ ] Terminal ready to run tests

**Execution (Follow verification script):**
- [ ] **Section 1:** Quick Verification (5 min)
  - [ ] Git log shows billing commits
  - [ ] `npm test` passes
  - [ ] PLAN_LIMITS grep finds 10/3 in all files
- [ ] **Section 2–7:** Full Verification (15 min)
  - [ ] Plan limits aligned
  - [ ] Archive/restore mutations present
  - [ ] Transaction safety helpers work
  - [ ] Webhook security hardened
  - [ ] Audit logging implemented
  - [ ] All tests passing (81/81)
  - [ ] Manual staging tests pass
- [ ] **Troubleshooting:** If any step fails, resolve before proceeding

**Sign-Off:**
- [ ] All items verified ✅
- [ ] No blocking issues found
- [ ] Engineer name & date: _____________________
- [ ] Can proceed to Step 3? **YES / NO**

---

### ✅ STEP 3: Support Team Training (SAME DAY, 1–2 hours)

**Owner:** Support Lead  
**Prerequisite:** Staging validation complete (Step 2)

**Training Modules to Complete:**
- [ ] **Module 1:** Understanding the changes (30 min)
  - [ ] Team understands: archived = preserved, not deleted
  - [ ] Team knows plan limits: free 10/3, pro unlimited
  - [ ] Team can explain "why we archive instead of delete"
  
- [ ] **Module 2:** Q&A Practice (30 min)
  - [ ] Practice script: "What happened to my habits?"
  - [ ] Practice script: "How do I restore items?"
  - [ ] Practice script: "Will I lose data?"
  - [ ] Each team member practices 1x
  
- [ ] **Module 3:** Troubleshooting (20 min)
  - [ ] Know how to diagnose "can't find Archived Items"
  - [ ] Know how to diagnose "restore button not working"
  - [ ] Know when to escalate to engineering
  
- [ ] **Module 4:** Communication (10 min)
  - [ ] Know what message to send proactive users
  - [ ] Know what to say to users who report issues
  - [ ] Know how to set expectations
  
- [ ] **Module 5:** Escalation (5 min)
  - [ ] Know escalation criteria (data loss, restore fails, etc.)
  - [ ] Know who to escalate to (engineering lead)
  - [ ] Know what info to include in escalation

**Sign-Off:**
- [ ] All team members completed training ✅
- [ ] Q&A practiced (team confident)
- [ ] Escalation criteria understood
- [ ] Support lead name & date: _____________________
- [ ] Support team ready? **YES / NO**

---

### ✅ STEP 4: Setup Monitoring & Alerts (DAY BEFORE ROLLOUT, 30 min)

**Owner:** DevOps / Ops Engineer

**Action Items:**
- [ ] Open [BILLING-MONITORING-SETUP.md](docs/BILLING-MONITORING-SETUP.md)
- [ ] Open Convex dashboard in browser
- [ ] Open Vercel dashboard in browser
- [ ] Have notebook ready to document baselines

**Setup Tasks:**
- [ ] **Convex Dashboard:** Setup function monitoring
  - [ ] View: `users.updatePlanFromWebhook` function metrics
  - [ ] View: `users.logBillingEvent` invocation counts
  - [ ] View: `habits.archiveExcessOnDowngradeInternal` success rate
  - [ ] View: `goals.archiveExcessOnDowngradeInternal` success rate
  - [ ] Screenshot all 4 views (baseline before rollout)
  
- [ ] **Create Monitoring Spreadsheet** (or use shared doc)
  - [ ] Columns: Timestamp | Phase | Metric | Value | Expected | Status | Notes
  - [ ] Share link with team in Slack
  - [ ] Set up template rows (for every 15 min during rollout)
  
- [ ] **Configure Slack Alerts** (optional but recommended)
  - [ ] Create #billing-v2.1-alerts channel
  - [ ] Set up webhook for Convex → Slack on error spike
  - [ ] Test alert system
  
- [ ] **Print or Bookmark Key Queries:** (from monitoring doc)
  - [ ] Webhook latency query
  - [ ] Archive success rate query
  - [ ] Downgrade event count query
  - [ ] Audit log completeness query

**Verification:**
- [ ] Convex metrics visible ✅
- [ ] Monitoring spreadsheet shared ✅
- [ ] Baseline metrics documented ✅
- [ ] Ready for live monitoring? **YES / NO**

---

### ✅ STEP 5: Pre-Rollout Checklist (DAY OF, 4 hours before)

**Owner:** On-Call Engineer + Engineering Lead

**Final Checks:**
- [ ] All 4 steps above completed
- [ ] All stakeholder approvals collected in writing
- [ ] Staging validation passed (sign-off collected)
- [ ] Support team trained (sign-off collected)
- [ ] Monitoring ready (dashboards live)
- [ ] Rollback procedure tested (can revert in < 5 min)
- [ ] Database backup confirmed (recent and valid)
- [ ] On-call schedule confirmed (all 3 shifts assigned)
- [ ] Communication channels created & tested:
  - [ ] `#billing-v2.1-release` (announcements)
  - [ ] `#billing-v2.1-monitoring` (live updates)
  - [ ] `#billing-support` (escalations)
- [ ] All team members online and ready

**Final Approvals:**
- [ ] Engineering Lead: ☑️ Ready to rollout
- [ ] Ops Lead: ☑️ Ready to rollout
- [ ] Product Lead: ☑️ Ready to rollout

**Proceed?** **YES / NO** (If NO, pause and investigate blockers)

---

### ✅ STEP 6: Execute 3-Phase Rollout (DAY OF, 12–18 hours)

**Owner:** On-Call Engineer (with ops + engineering support)

**Reference:** [BILLING-DEPLOYMENT-CHECKLIST.md](docs/BILLING-DEPLOYMENT-CHECKLIST.md) (follow hour by hour)

**Phase 1: Canary (5% of users, 4 hours)**

- [ ] **T+0 min:** Enable feature flag (BILLING_FIXES_ENABLED=true, 5% traffic)
- [ ] **T+5–15 min:**
  - [ ] Watch webhook logs (no signature failures)
  - [ ] Check DB: archive success rate > 99%
  - [ ] Confirm UI banner renders
  - [ ] Post in #billing-v2.1-monitoring: "Phase 1 started, monitoring latency..."
  
- [ ] **T+30 min – T+4 hours:** Monitor every 30 min
  - [ ] Latency p99: __________ ms (target < 500ms)
  - [ ] Error rate: __________ % (target < 1%)
  - [ ] Archive success: __________ % (target > 99%)
  - [ ] Any new errors? (document in notes)
  
- [ ] **T+4 hours:** Decision Point
  - [ ] All metrics green? → **PROCEED TO PHASE 2**
  - [ ] Issues found? → **HOLD & INVESTIGATE** or **ROLLBACK**

**Phase 2: Wide (25% of users, 8 hours)**

- [ ] **T+0 min:** Increase feature flag to 25%
- [ ] **T+5–30 min:**
  - [ ] Monitor same metrics as Phase 1
  - [ ] Data integrity spot check (sample 5 users with excess habits)
  - [ ] Post in Slack: "Phase 2 started (25% rollout)"
  
- [ ] **Every 2 hours:** Monitoring check
  - [ ] Latency stable? ✓
  - [ ] Error rate stable? ✓
  - [ ] Archive/restore working? ✓
  - [ ] Any user complaints? (ask support team)
  - [ ] Document in spreadsheet
  
- [ ] **T+8 hours:** Decision Point
  - [ ] All metrics green? → **PROCEED TO PHASE 3**
  - [ ] Issues found? → **HOLD & INVESTIGATE** or **ROLLBACK**

**Phase 3: Full (100% of users, ongoing)**

- [ ] **T+0 min:** Set feature flag to 100%
- [ ] **T+5–30 min:**
  - [ ] Watch for traffic spike errors
  - [ ] Confirm all requests use new logic
  - [ ] Post in Slack: "Phase 3 started (100% rollout)"
  
- [ ] **First 24 hours:** Hourly monitoring
  - [ ] Every hour: check latency p99, error rate, support queue
  - [ ] Every 4 hours: data integrity check
  - [ ] Post updates in #billing-v2.1-monitoring
  
- [ ] **After 24 hours:** Phase out to normal monitoring
  - [ ] Metrics look good?
  - [ ] Support team reporting no escalations?
  - [ ] Move to post-deployment sign-off (Step 7)

---

### ✅ STEP 7: Post-Deployment Verification (24 hours after Phase 3)

**Owner:** Engineering Lead + Ops

**Verification Queries:**
- [ ] Run final audit query (from BILLING-MONITORING-SETUP.md)
  - [ ] Confirm all downgrade events processed
  - [ ] Confirm archive success rate > 99%
  - [ ] Confirm zero data loss or corruption
  
- [ ] Check metrics stable
  - [ ] Webhook latency: __________ ms (vs baseline)
  - [ ] Error rate: __________ % (should be < 0.5%)
  - [ ] Archive success: __________ % (should be > 99%)
  
- [ ] Support feedback
  - [ ] Support lead: Any escalations? _____
  - [ ] User reports of missing data? (should be 0)
  - [ ] Questions about archived items? (~5 per 1000 users expected)
  
- [ ] Final sign-off
  - [ ] Engineering Lead: _____________ Date: _____
  - [ ] Ops Lead: _____________ Date: _____
  - [ ] Product Manager: _____________ Date: _____

**ROLLOUT COMPLETE!** ✅

---

## 🚨 EMERGENCY PROCEDURES

### If You Need to Rollback

**Time to Execute:** < 5 minutes

**Steps:**
1. [ ] Set feature flag: `BILLING_FIXES_ENABLED=false` (or remove)
2. [ ] Verify: New webhook requests use old logic (check logs)
3. [ ] Monitor: Latency drops, error rate drops to 0
4. [ ] Announce: Post in #billing-v2.1-release "Rollback initiated — investigating [reason]"
5. [ ] Investigate: Check logs for root cause
6. [ ] Escalate: Brief engineering lead on what went wrong
7. [ ] Plan: Schedule fix + retry after root cause resolved

**Rollback is safe because:**
- Archive tables already marked in DB (nothing reverted)
- Archived items will persist (user data not lost)
- Webhook handler reverts to previous logic
- No data deleted or corrupted

---

## 📞 CONTACTS & CHANNELS

**Slack Channels:**
- `#billing-v2.1-release` (announcements)
- `#billing-v2.1-monitoring` (live rollout updates, every 15–30 min)
- `#billing-support` (support team escalations)
- `#oncall` (emergency contact for on-call engineer)

**Key Contacts:**
| Role | Phone | Slack |
|------|-------|-------|
| Engineering Lead | | @____ |
| On-Call Engineer | | @____ |
| DevOps / Ops | | @____ |
| Support Lead | | @____ |
| Product Manager | | @____ |

---

## 📊 KEY METRICS TO WATCH

**Critical (Alert if exceeded):**
- ❌ Webhook error rate > 5%
- ❌ Webhook latency p99 > 1000ms
- ❌ Archive operation failure rate > 0%
- ❌ Data loss reports > 0

**Important (Monitor):**
- 📊 Webhook latency p99 (target: < 500ms)
- 📊 Archive success rate (target: > 99%)
- 📊 Downgrade event count (should be ~baseline rate)
- 📊 Support tickets (should stay low)

**Dashboard:** Convex Function Metrics (see [BILLING-MONITORING-SETUP.md](docs/BILLING-MONITORING-SETUP.md))

---

## ✅ Quick Reference Card (Laminate & Post)

```
╔══════════════════════════════════════════════════════════════╗
║         BILLING v2.1.0 ROLLOUT — QUICK REFERENCE            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║ What Changed:                                                ║
║ • Plan limits: Free = 10 habits / 3 goals (now enforced)    ║
║ • Data safety: Excess items archived on downgrade (not lost)║
║ • User control: 1-click restore from Settings/Archived Items║
║ • Webhook hardening: Signature validation + timestamp check  ║
║ • Audit logging: All billing events recorded                ║
║                                                              ║
║ Phases:                                                      ║
║ Phase 1 (4h):  5% of users  → Green?  → Phase 2             ║
║ Phase 2 (8h):  25% of users → Green?  → Phase 3             ║
║ Phase 3 (24h+): 100% of users → Monitor → Sign-off          ║
║                                                              ║
║ Rollback: Set BILLING_FIXES_ENABLED=false (< 5 min)         ║
║                                                              ║
║ Key Metrics:                                                 ║
║ • Webhook latency p99: < 500ms ✓                            ║
║ • Archive success: > 99% ✓                                   ║
║ • Error rate: < 1% ✓                                         ║
║ • Data loss reports: 0 ✓                                     ║
║                                                              ║
║ If latency or errors spike → HOLD PHASE & INVESTIGATE        ║
║ If data loss reported → ROLLBACK IMMEDIATELY                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 🎉 SUCCESS LOOKS LIKE

✅ Phase 1 (5%): 4 hours of clean monitoring, zero issues  
✅ Phase 2 (25%): 8 hours stable, archive/restore working, no support escalations  
✅ Phase 3 (100%): 24+ hours green, metrics nominal, user feedback positive  

**Result:** Zero data loss, zero user complaints about missing items, archive/restore feature working smoothly across user base.

---

## 📄 Document References

- [BILLING-RELEASE-SIGN-OFF.md](docs/BILLING-RELEASE-SIGN-OFF.md) — Stakeholder approvals (Step 1)
- [BILLING-FIX-VERIFICATION-SCRIPT.md](docs/BILLING-FIX-VERIFICATION-SCRIPT.md) — Staging validation (Step 2)
- [BILLING-SUPPORT-TRAINING.md](docs/BILLING-SUPPORT-TRAINING.md) — Support training (Step 3)
- [BILLING-MONITORING-SETUP.md](docs/BILLING-MONITORING-SETUP.md) — Monitoring setup (Step 4)
- [BILLING-DEPLOYMENT-CHECKLIST.md](docs/BILLING-DEPLOYMENT-CHECKLIST.md) — Hour-by-hour rollout (Step 6)
- [BILLING-ROLLOUT-PLAN.md](docs/BILLING-ROLLOUT-PLAN.md) — Strategy & timeline (reference)
- [BILLING-DELIVERY-SUMMARY.md](docs/BILLING-DELIVERY-SUMMARY.md) — Status & context (reference)
- [RELEASE_NOTES.md](docs/RELEASE_NOTES.md) — User-facing announcement (reference)

---

**Last Updated:** February 26, 2026  
**Print & Post In:** #billing-v2.1-release Slack channel  
**Update Frequency:** After each step completes

