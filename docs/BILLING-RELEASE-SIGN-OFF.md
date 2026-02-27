---
**FORM: Billing Fixes Release Sign-Off**

**Release:** Billing Preservation & Hardening (v2.1.0)  
**Date:** February 26, 2026  
**PR:** https://github.com/shaykhedeee/ascend/pull/1

---

## Section 1: Engineering Lead Sign-Off

**Responsible:** [Name]  
**Date Reviewed:** ________________

- [ ] Code review completed
- [ ] All tests passing (81/81 tests)
- [ ] Security review passed (webhook validation, secret checks, sanitization)
- [ ] No hardcoded secrets or API keys
- [ ] Schema changes verified (no migration needed, using `archivedByDowngrade`)
- [ ] Performance impact acceptable (< 50ms latency addition per webhook)
- [ ] Rollback procedure understood and documented

**Sign-Off:**
- [ ] **APPROVED** — Ready for staging deployment
- [ ] **CONDITIONAL** — Ready with conditions (details below)
- [ ] **BLOCKED** — Do not deploy (details below)

**Notes/Conditions:**
```
[Leave blank if approved]
```

**Signature:** ___________________________  
**Date:** ___________________________

---

## Section 2: Product Manager Sign-Off

**Responsible:** [Name]  
**Date Reviewed:** ________________

- [ ] Feature aligns with product roadmap
- [ ] Downgrade preservation UX acceptable to user base
- [ ] Plan limits (10 habits / 3 goals free) align with marketing claims
- [ ] Help docs and comms plan reviewed
- [ ] No breaking API changes (only internal mutations)
- [ ] Pricing page and landing copy reviewed for consistency

**Sign-Off:**
- [ ] **APPROVED** — Ready for deployment
- [ ] **CONDITIONAL** — Ready with conditions (details below)
- [ ] **BLOCKED** — Do not deploy (details below)

**Notes/Conditions:**
```
[Leave blank if approved]
```

**Signature:** ___________________________  
**Date:** ___________________________

---

## Section 3: QA/Testing Lead Sign-Off

**Responsible:** [Name]  
**Date Reviewed:** ________________

- [ ] Unit tests passing locally (3 new tests)
- [ ] Integration tests passing (webhook + UI, 2 tests)
- [ ] Manual QA on staging completed:
  - [ ] Subscription downgrade → archive excess habits/goals
  - [ ] Subscription upgrade → restore archived items
  - [ ] UI banner shows only when archived count > 0
  - [ ] Webhook idempotency (duplicate event → ignored)
  - [ ] Webhook timestamp validation (stale events rejected)
  - [ ] Audit logs written for all events
- [ ] Regression test suite passed (no new failures)
- [ ] Load test baseline established (if applicable)

**Sign-Off:**
- [ ] **APPROVED** — Ready for production
- [ ] **CONDITIONAL** — Ready with conditions (details below)
- [ ] **BLOCKED** — Do not deploy (details below)

**Notes/Conditions:**
```
[Leave blank if approved]
```

**Signature:** ___________________________  
**Date:** ___________________________

---

## Section 4: Operations/DevOps Sign-Off

**Responsible:** [Name]  
**Date Reviewed:** ________________

- [ ] Staging deployment tested
- [ ] Production secrets configured (`CLERK_WEBHOOK_SECRET`, `BILLING_WEBHOOK_SYNC_SECRET`)
- [ ] Monitoring dashboards prepared (webhook latency, archive/restore rates)
- [ ] Logging and alerting configured
- [ ] Rollback procedure tested (feature flag or Git revert)
- [ ] Backup/disaster recovery plan reviewed
- [ ] Capacity planning reviewed (no expected spike)

**Sign-Off:**
- [ ] **APPROVED** — Ready for production deployment
- [ ] **CONDITIONAL** — Ready with conditions (details below)
- [ ] **BLOCKED** — Do not deploy (details below)

**Notes/Conditions:**
```
[Leave blank if approved]
```

**Signature:** ___________________________  
**Date:** ___________________________

---

## Section 5: Security Lead Sign-Off (if applicable)

**Responsible:** [Name]  
**Date Reviewed:** ________________

- [ ] Webhook signature verification validated (Svix)
- [ ] Timing-safe constant comparison for secrets
- [ ] Timestamp freshness guard (5 min window)
- [ ] XSS protection reviewed (DOMPurify on payment pages)
- [ ] SQL injection risk reviewed (Convex queries parameterized)
- [ ] CSRF protection validated (Next.js built-in)
- [ ] No hardcoded API keys or secrets
- [ ] Audit logging captures intent and results

**Sign-Off:**
- [ ] **APPROVED** — Security acceptable
- [ ] **CONDITIONAL** — Acceptable with conditions (details below)
- [ ] **BLOCKED** — Security concerns block deployment (details below)

**Notes/Conditions:**
```
[Leave blank if approved]
```

**Signature:** ___________________________  
**Date:** ___________________________

---

## Final Rollout Authorization

**Release Manager:** [Name]  
**Approval Date:** ________________

All sign-offs complete and APPROVED:
- [x] Engineering
- [x] Product
- [x] QA
- [x] Operations
- [x] Security (if required)

**Deployment Schedule:**
- **Staging Validation:** [Date/Time]
- **Canary Rollout (5%):** [Date/Time]
- **Wide Rollout (25%):** [Date/Time]  
- **Full Rollout (100%):** [Date/Time]

**Release Manager Signature:** ___________________________  
**Date:** ___________________________

---

## Go/No-Go Checklist (Day of Deployment)

4 hours before rollout:
- [ ] All team members online and ready
- [ ] Monitoring dashboards live and accessible
- [ ] Slack escalation channels active
- [ ] Status page ready (if needed)
- [ ] Support team briefed and ready

1 hour before rollout:
- [ ] Feature flag staging tested (on/off toggle works)
- [ ] Rollback procedure confirmed working
- [ ] Database backups current
- [ ] Convex deployment validated in staging

At rollout:
- [ ] Enable Phase 1 canary (5%)
- [ ] Watch metrics for 15 minutes
- [ ] Check logs for errors/warnings
- [ ] Confirm no user-reported issues in first hour

---

## Post-Deployment Sign-Off (Retrospective)

**Deployment Completed:** [Date/Time]

- [ ] Zero critical incidents during rollout
- [ ] All phases completed successfully
- [ ] Team conducted blameless retrospective
- [ ] Post-deployment metrics normal
- [ ] User feedback collected and logged

**Signature:** ___________________________  
**Date:** ___________________________

---
