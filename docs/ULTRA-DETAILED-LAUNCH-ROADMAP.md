# ASCENDIFY Ultra-Detailed Launch Roadmap

Last updated: 2026-02-17  
Owner: Product + Engineering + Growth  
Status: In execution

---

## 0) Mission and launch definition

### Product mission
ASCENDIFY helps users consistently execute goals using structured planning, habits, focus systems, and coaching.

### Launch success definition (first 90 days)
- App is stable in production with no blocking auth/billing defects.
- Conversion funnel is measurable end-to-end (visitor → signup → active user → paid).
- Billing is fully operational (checkout, portal, webhooks, plan sync).
- Weekly release cadence is maintained with clear rollback procedures.

### Non-negotiables before public launch
- Auth + onboarding + dashboard flows work for new users.
- Billing links and webhook sync are production-verified.
- Error tracking and logs are active.
- Privacy/legal pages are complete and linked.

---

## 1) Current implementation snapshot

### Completed in codebase
- Billing plan catalog centralized in `src/lib/billing/plans.ts`.
- Billing page implemented in `src/app/billing/page.tsx`.
- Clerk billing webhook endpoint implemented in `src/app/api/webhooks/clerk-billing/route.ts`.
- Convex secure plan sync mutation added in `convex/users.ts` (`updatePlanFromWebhook`).
- Billing env placeholders added in `.env.local`.

### Still required (ops + platform)
- Clerk dashboard product/price setup.
- Clerk checkout/portal URLs inserted into env.
- Clerk webhook endpoint registration and signing secret set.
- Matching `BILLING_WEBHOOK_SYNC_SECRET` in Next.js env and Convex env.
- Production deployment and smoke testing on Vercel.

---

## 2) Architecture decisions to lock

### Plan model
- App internal plan states remain: `free | pro | lifetime`.
- Checkout variants: `pro_monthly`, `pro_yearly`, `lifetime`.
- Mapping logic owned by `mapClerkPlanToUserPlan()`.

### Event source of truth
- Clerk subscription events are source of truth for billing state.
- Convex user `plan` is the source of truth for app gating.

### Security model
- Webhook request signature verified via Svix (`CLERK_WEBHOOK_SECRET`).
- Next.js → Convex sync protected via shared secret (`BILLING_WEBHOOK_SYNC_SECRET`).

---

## 3) Environment variable matrix

## Local (`.env.local`)
- `NEXT_PUBLIC_CLERK_BILLING_PORTAL_URL`
- `NEXT_PUBLIC_CLERK_CHECKOUT_PRO_MONTHLY_URL`
- `NEXT_PUBLIC_CLERK_CHECKOUT_PRO_YEARLY_URL`
- `NEXT_PUBLIC_CLERK_CHECKOUT_LIFETIME_URL`
- `CLERK_WEBHOOK_SECRET`
- `BILLING_WEBHOOK_SYNC_SECRET`

## Vercel project env
Set all variables above for:
- Preview
- Production

## Convex env
- `BILLING_WEBHOOK_SYNC_SECRET` (must match Next.js runtime value)

### Validation rule
If these values are missing or mismatched, treat launch as blocked.

---

## 4) Clerk billing setup (dashboard runbook)

### Step A — Create plans/products
Create exactly three purchasable offers:
1. Pro Monthly
2. Pro Yearly
3. Lifetime

### Step B — Get hosted checkout links
Copy hosted checkout URLs and map to:
- `NEXT_PUBLIC_CLERK_CHECKOUT_PRO_MONTHLY_URL`
- `NEXT_PUBLIC_CLERK_CHECKOUT_PRO_YEARLY_URL`
- `NEXT_PUBLIC_CLERK_CHECKOUT_LIFETIME_URL`

### Step C — Customer portal
Enable billing portal and map URL to:
- `NEXT_PUBLIC_CLERK_BILLING_PORTAL_URL`

### Step D — Webhook
- Endpoint URL (prod): `https://<your-domain>/api/webhooks/clerk-billing`
- Subscribe to at least:
  - `billing.subscription.created`
  - `billing.subscription.updated`
  - `billing.subscription.deleted`
- Copy signing secret to:
  - `CLERK_WEBHOOK_SECRET`

### Step E — Secret sync hardening
Set identical `BILLING_WEBHOOK_SYNC_SECRET` in:
- Vercel env
- Convex env

---

## 5) End-to-end billing QA checklist

### Happy path tests
1. New user signs up.
2. User opens `/billing` and sees active plan cards.
3. User completes Pro Monthly checkout.
4. Clerk sends webhook.
5. App updates user plan to `pro` in Convex.
6. Gated features unlock without manual intervention.

### Cancellation path
1. Cancel subscription from portal.
2. Webhook received.
3. User plan downgrades to `free`.
4. Limits/gating re-applied.

### Lifetime path
1. Purchase lifetime.
2. Webhook received.
3. Plan updates to `lifetime`.
4. No recurring billing expectations in app messaging.

### Edge cases
- Webhook event retries do not corrupt state.
- Missing plan metadata falls back safely (`free`) and logs warning.
- Webhook before user sync does not crash (`no-op` warning expected).

---

## 6) Vercel deployment roadmap

### Phase 1 — Project bootstrap
- Connect repository to Vercel.
- Confirm framework settings detect Next.js.
- Set production domain.

### Phase 2 — Runtime configuration
- Add all required env variables.
- Confirm variables exist in both Preview and Production.

### Phase 3 — Deploy and verify
- Trigger production deploy.
- Verify routes:
  - `/`
  - `/sign-in`
  - `/billing`
  - `/api/webhooks/clerk-billing` (method check)

### Phase 4 — Post-deploy checks
- Complete one test checkout in production environment.
- Confirm webhook logs and Convex mutation execution.
- Confirm UI reflects updated plan.

---

## 7) Observability and incident response

### Logging
Must log:
- Webhook event type
- Plan mapping result
- Mutation success/failure
- Missing-secret errors

### Monitoring targets
- 5xx rate for `/api/webhooks/clerk-billing`
- Authentication callback failures
- Billing page client errors

### Incident severity levels
- **SEV-1**: Checkout successful but plan not updated.
- **SEV-2**: Billing page inaccessible.
- **SEV-3**: Cosmetic billing UI inconsistency.

### Rollback strategy
- Keep last known good deployment ready in Vercel.
- Roll back immediately for SEV-1/SEV-2.
- Preserve webhook endpoint compatibility while rolling back.

---

## 8) Product launch timeline (execution plan)

## Week 0 (hardening)
- Complete billing setup and E2E tests.
- Freeze major feature scope.
- Add/verify analytics events for funnel.

## Week 1 (private beta)
- Invite 25–50 target users.
- Collect onboarding friction notes and billing confusion points.
- Fix top 10 friction issues.

## Week 2 (public beta)
- Open signups publicly.
- Run founder offer campaign (time-limited yearly/lifetime positioning).
- Monitor conversion and churn indicators daily.

## Week 3–4 (stabilize + optimize)
- Improve pricing page and in-app upgrade moments.
- Tighten onboarding completion.
- Add habit/goal activation nudges.

## Month 2–3 (growth loop)
- Launch referral experiment.
- Publish SEO content for goal/habit niches.
- Add social proof and case studies.

---

## 9) Growth and monetization execution

### Funnel KPIs
- Visitor → Signup rate
- Signup → Onboarding complete rate
- Onboarding complete → Week-1 active rate
- Active → Paid conversion rate
- Paid churn (monthly)

### Pricing optimization tests
- Test monthly price anchoring vs yearly emphasis.
- Test CTA language on billing cards.
- Test trial/no-trial framing if applicable.

### Retention loops
- Daily intention prompt completion
- Weekly review completion
- Streak recovery flow engagement

---

## 10) Git and release management

### Branch policy
- `main`: production-ready only
- feature branches: one initiative per branch

### Commit policy
- Small, logical commits.
- Include clear billing/deploy context in commit messages.

### Release notes template
For each release include:
- user-facing changes
- billing/auth risk area
- migration/env requirements
- rollback notes

---

## 11) Security, compliance, and trust

### Security checklist
- No secret keys in client-exposed env names except intentionally public URLs.
- Webhook signature validation enforced.
- Secret mismatch fails fast.

### Legal checklist
- Privacy policy and terms linked and current.
- Refund policy aligned with actual billing behavior.
- Support contact visible in billing/help flows.

---

## 12) Team operating cadence

### Daily (launch window)
- 15-minute standup: blockers, incidents, conversion data.
- Review deploy health and webhook logs.

### Weekly
- Product + engineering launch review.
- KPI review and top 3 priorities.
- Scope cut/add decisions.

### Decision framework
- If it improves activation/conversion and is low-risk: ship quickly.
- If it risks auth/billing integrity: delay until tested.

---

## 13) “Go/No-Go” launch gate

### Go criteria
- Billing webhook verified in production.
- At least one successful paid conversion and downgrade test.
- No open SEV-1 issues.
- Error rates within acceptable thresholds.

### No-Go criteria
- Any unresolved billing plan sync defect.
- Missing production secrets.
- Critical onboarding/auth breakages.

---

## 14) Immediate next actions (for this repo)

1. Fill real Clerk billing URLs and secrets in environment variables.
2. Register Clerk webhook and validate signature flow.
3. Set matching `BILLING_WEBHOOK_SYNC_SECRET` in Convex.
4. Deploy to Vercel production.
5. Run end-to-end paid flow and cancellation flow.
6. Commit + push billing implementation and roadmap doc.

---

## 15) Owner checklist (copy/paste)

- [ ] Clerk products/prices created (monthly/yearly/lifetime)
- [ ] Portal URL configured
- [ ] Checkout URLs configured
- [ ] `CLERK_WEBHOOK_SECRET` set in Vercel
- [ ] `BILLING_WEBHOOK_SYNC_SECRET` set in Vercel and Convex (same value)
- [ ] Production deploy completed on Vercel
- [ ] Test payment updates Convex plan to `pro`
- [ ] Cancellation updates Convex plan to `free`
- [ ] Git commit created and pushed
- [ ] Post-launch monitoring dashboard reviewed daily

---

If you want, the next iteration of this roadmap can include:
- exact owner-by-owner assignment table,
- day-by-day launch calendar,
- and a severity-tagged QA test script for manual testers.