# Launch Readiness Checklist

**App:** Ascendify  
**Date:** 2026-02-18  
**Owner:** Engineering + Product + Ops

---

## 1) Build and quality gates

- [x] `npm run build` passes
- [x] `npx tsc --noEmit` passes
- [x] `npm test -- --passWithNoTests` passes (55/55)
- [x] CI workflow exists (`.github/workflows/ci.yml`)
- [ ] Lint warnings reviewed and triaged for post-launch sprint

---

## 2) Security gates

- [x] No runtime use of `NEXT_PUBLIC_*` AI secrets
- [x] AI keys are server-side env only
- [x] Webhook signature verification enabled
- [x] Webhook replay-window guard enabled
- [x] Webhook idempotency ledger enabled (`billingWebhookEvents`)
- [x] Webhook retry/backoff and telemetry enabled
- [x] Payment initiation requires auth and server-derived identity

---

## 3) Billing correctness gates

- [x] Free plan limits aligned (10 habits, 3 goals, AI insights enabled)
- [x] Pro/lifetime mapping stable (`mapClerkPlanToUserPlan`)
- [x] Webhook duplicate events safely ignored
- [x] Cancellation path downgrades to free
- [ ] Confirm production Clerk checkout URLs are set
- [ ] Confirm production Clerk webhook secret is set
- [ ] Confirm `BILLING_WEBHOOK_SYNC_SECRET` matches Vercel + Convex

---

## 4) Production configuration gates

- [ ] Vercel env variables fully populated
- [ ] Convex env variables fully populated
- [ ] Clerk Billing Portal configured
- [ ] Clerk products configured (Monthly/Yearly/Lifetime)
- [ ] Clerk webhook endpoint live and event subscriptions validated

---

## 5) Smoke test gates

- [x] Public pages render (`/`, `/pricing`, `/billing`, `/sign-in`, `/sign-up`)
- [x] Build-time route generation succeeds
- [ ] Live production smoke test completed after deploy
- [ ] Billing purchase test in production-like env completed

---

## 6) Monitoring and incident gates

- [ ] Error tracking integration validated (Sentry/alternative)
- [ ] Alert routing channel confirmed (Slack/email/on-call)
- [ ] Webhook failure dashboard query prepared
- [ ] Rollback owner + runbook link confirmed

---

## 7) Decision gate

**Ready for production launch when all unchecked items above are completed.**

Approvals:
- Engineering Lead: [ ]
- Product Owner: [ ]
- Operations/DevOps: [ ]
