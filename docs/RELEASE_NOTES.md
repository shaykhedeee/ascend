# 2026-02-26 — v2.1.0: Billing Preservation & Hardening

## Overview
Critical billing system improvements: **zero data loss on downgrade**, atomic plan limits, hardened webhooks, and user-friendly downgrade notifications.

**PR:** https://github.com/shaykhedeee/ascend/pull/1  
**Status:** Ready for staged rollout (sign-off required — see [BILLING-RELEASE-SIGN-OFF.md](BILLING-RELEASE-SIGN-OFF.md))  
**Rollout Plan:** [BILLING-ROLLOUT-PLAN.md](BILLING-ROLLOUT-PLAN.md)

---

## What's New

### 1. Atomic Plan Limits & Race Condition Prevention
- **Added:** `convex/lib/transactions.ts` with `checkAndCreateHabit()` and `checkAndCreateGoal()` helpers.
- **Impact:** Eliminates race conditions between concurrent creates and plan updates; users cannot bypass plan limits via race.
- **Files Changed:** `convex/habits.ts`, `convex/goals.ts` (create mutations now use atomic helpers).

### 2. Data Preservation on Downgrade
- **Behavior:** When a user downgrades from Pro → Free:
  - Excess habits (11+) and goals (4+) are archived (marked `archivedByDowngrade: true`) instead of deleted.
  - Data is preserved indefinitely; user can restore on upgrade or via dashboard.
  - Audit log entry captures how many items were archived (billing event recorded).
- **Files Changed:** `convex/users.ts` (updatePlanFromWebhook calls archive/restore internal mutations), `convex/habits.ts`, `convex/goals.ts` (archive/restore mutations).

### 3. Downgrade Notification UI
- **Component:** `src/components/DowngradePlanNotice.tsx` — dismissible amber banner shown when archived count > 0.
- **Features:** Shows archived count, links to billing (upgrade) or settings (view archived), offers quick restore attempt.
- **Queries Used:** `habits.getArchivedDowngradeCount`, `goals.getArchivedDowngradeCount`, restore mutations.

### 4. Hardened Webhook Security
- **Signature Verification:** Svix headers (`svix-id`, `svix-timestamp`, `svix-signature`) validated.
- **Timestamp Guard:** Webhooks older than 5 minutes rejected (replay attack prevention).
- **Constant-Time Secret Check:** Uses bit-by-bit comparison (no timing leaks).
- **Audit Logging:** All webhook events (success, failure, stale, invalid) logged to `billingEvents` table.
- **File:** `src/app/api/webhooks/clerk-billing/route.ts`.

### 5. Billing Audit Logging
- **Table:** `convex/schema.ts` → `billingEvents` (userId, clerkId, eventId, eventType, source, status, plan, reason, details, createdAt).
- **Indexed:** by_clerkId_and_createdAt for fast support lookups.
- **Coverage:** Webhook received, accepted, applied, ignored, failed; manual plan changes; archived/restore counts.
- **Query:** `users.getBillingEventsByClerkId(clerkId, limit)` for support/debug.

### 6. Plan Limits Alignment
- **Backend:** `convex/habits.ts` and `convex/goals.ts` now enforce free: 10 habits / 3 goals (from 5 / 1).
- **Marketing:** `src/lib/billing/plans.ts` features already claimed 10 / 3 — now aligned.
- **UI:** `src/hooks/usePlanGating.ts` enforces the same limits client-side.
- **Outcome:** No more misleading marketing claims.

---

## Testing

### Test Coverage
- **Unit:** `src/__tests__/billing.archive.test.ts` (3 tests) — schema & Convex API surface.
- **Integration:** `src/app/api/webhooks/clerk-billing/integration.route.test.ts` (1 test) — webhook processing.
- **UI:** `src/__tests__/DowngradePlanNotice.ui.test.tsx` (1 test) — banner rendering.
- **Existing:** `src/app/api/webhooks/clerk-billing/route.test.ts` (5 tests) — security.

**Test Results:** 81/81 passing locally (including new + existing).

### Load Script
- Prepared: `scripts/webhook-load-test.js` (configurable concurrency, 1000 requests).
- Use: `WEBHOOK_URL=... LOAD_CONCURRENCY=50 LOAD_TOTAL=1000 node scripts/webhook-load-test.js`.

---

## Migration Notes

### No Schema Migration Required
- Uses existing `archivedByDowngrade` boolean field (already in schema).
- No table renames, no column drops, no data rewrite.
- **Action:** No `npx convex deploy` migration needed before rollout.

### Environment Variables (Ensure Set)
- `CLERK_WEBHOOK_SECRET` — Clerk webhook verification key.
- `BILLING_WEBHOOK_SYNC_SECRET` — Sync secret for billing mutations (constant-time check).
- `CLERK_WEBHOOK_MAX_AGE_SECONDS` — Default: 300 (5 minutes).

### Backwards Compatibility
- Existing webhook events handled (both old Clerk Billing + new event types).
- Duplicate events idempotent (checked via `billingWebhookEvents` table with event ID).
- Stale event guard prevents out-of-order deliveries from overwriting newer plan states.

---

## Rollout Instructions

### Prerequisites
1. [ ] All sign-offs complete: [BILLING-RELEASE-SIGN-OFF.md](BILLING-RELEASE-SIGN-OFF.md)
2. [ ] QA sign-off on staging
3. [ ] Monitoring dashboards live
4. [ ] Support team briefed

### Phased Deployment (See [BILLING-ROLLOUT-PLAN.md](BILLING-ROLLOUT-PLAN.md) for details)
- **Phase 1 (Canary 5%):** 4 hours
- **Phase 2 (Wide 25%):** 8 hours
- **Phase 3 (Full 100%):** Immediate

### Monitoring
Key metrics during rollout:
- Webhook processing latency (p99 < 500ms)
- Archive/restore success rate (> 99%)
- Downgrade event volume (watch for spikes)
- Audit log write errors (should be rare)

### Rollback
- **Trigger:** Data loss, > 5% errors, security issue.
- **Method:** Feature flag `BILLING_FIXES_ENABLED=false` (instant) or Git revert (5–15 min).
- **Estimated Time:** < 15 minutes total.

---

## Impact Summary

| Aspect | Before | After | Impact |
|--------|--------|-------|--------|
| Data Loss on Downgrade | Yes (11+ habits deleted) | No (archived) | ✅ Zero data loss |
| Plan Limit Bypass (races) | Possible | Atomic check+create | ✅ Secure |
| Webhook Validation | Signature only | Signature + timestamp + secret check | ✅ Hardened |
| Audit Trail | Partial | Complete (all events logged) | ✅ Support-ready |
| Plan Limits Consistency | Mismatched (5 vs 10) | Aligned (10 habits / 3 goals) | ✅ Trust |

---

## Known Limitations & Future Work

1. **Archived Items Cleanup:** Currently no automatic deletion; users must GC manually or on permanent plan downgrade (future feature: auto-delete after 90 days).
2. **Restore UX:** Currently requires UI interaction or manual restore mutation; could auto-restore on upgrade (consider for v2.2).
3. **Webhook Latency:** Current ~ 100–200ms per webhook; optimize batching in future (v2.2+).

---

## Support Resources

- **Help Docs:** "What happens to my habits when I downgrade?" (TBD)
- **User FAQ:** "My habits disappeared after downgrade — where are they?" → Point to settings > Archived Items.
- **Support Route:** Support can query `users.getBillingEventsByClerkId(clerkId)` to trace plan changes.

---

## Questions & Contacts

- **Engineering Lead:** [Name]
- **Product Manager:** [Name]
- **Support Lead:** [Name]
- **On-Call Ops:** [Name]

---

**Release Complete:** [Date/Time to be filled post-deployment]
