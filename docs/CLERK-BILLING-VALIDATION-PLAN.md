# Clerk Billing Production Validation Plan

**App**: Ascendify  
**Date**: 2026-02-17  
**Scope**: End-to-end purchase → webhook → plan sync → feature gating cycle  
**Environment targets**: Vercel production (`ascend-wheat-six.vercel.app`) + Convex cloud

---

## 0) Prerequisites — must pass before any test

### A. Environment readiness

| Variable | Location | Current status | Required action |
|---|---|---|---|
| `NEXT_PUBLIC_CLERK_CHECKOUT_PRO_MONTHLY_URL` | Vercel env | **EMPTY** | Create Pro Monthly product in Clerk → paste hosted link |
| `NEXT_PUBLIC_CLERK_CHECKOUT_PRO_YEARLY_URL` | Vercel env | **EMPTY** | Create Pro Yearly product in Clerk → paste hosted link |
| `NEXT_PUBLIC_CLERK_CHECKOUT_LIFETIME_URL` | Vercel env | **EMPTY** | Create Lifetime product in Clerk → paste hosted link |
| `NEXT_PUBLIC_CLERK_BILLING_PORTAL_URL` | Vercel env | **EMPTY** | Enable billing portal in Clerk → paste portal link |
| `CLERK_WEBHOOK_SECRET` | Vercel env | **EMPTY** | Register webhook in Clerk dashboard → copy signing secret |
| `BILLING_WEBHOOK_SYNC_SECRET` | Vercel env **AND** Convex env | **EMPTY** | Generate a 32+ char secret, set in both places (must match) |

### B. Clerk dashboard configuration

1. **Products/Prices created**
   - Pro Monthly: $12/mo recurring
   - Pro Yearly: $96/yr recurring
   - Lifetime: $249 one-time

2. **Webhook endpoint registered**
   - URL: `https://ascend-wheat-six.vercel.app/api/webhooks/clerk-billing`
   - Events subscribed:
     - `billing.subscription.created`
     - `billing.subscription.updated`
     - `billing.subscription.deleted`

3. **Billing portal enabled**
   - Hosted portal URL copied to env

### C. Middleware allowlist verified

The webhook route is already public in middleware (`/api/webhooks(.*)`).  
Confirm by checking `src/proxy.ts` — the route matcher includes `/api/webhooks(.*)` as a public route.

---

## 1) Test Case Matrix

### TC-01: Free user baseline

| Step | Action | Expected result |
|---|---|---|
| 1 | Sign up as new user | User created in Convex with `plan: "free"` |
| 2 | Open `/billing` | See 4 plan cards (Free highlighted as current) |
| 3 | Open `/dashboard` | Gating limits applied (5 habits max, 1 goal max) |
| 4 | Try AI insights | Blocked or greyed out (`canUse('aiInsights') === false`) |

**Pass criteria**: Free restrictions enforce correctly, billing page renders with all plan cards.

---

### TC-02: Pro Monthly purchase — happy path

| Step | Action | Expected result |
|---|---|---|
| 1 | Click "Start Pro Monthly" on `/billing` | Redirected to Clerk-hosted checkout |
| 2 | Complete payment with Clerk test card | Checkout success page shown |
| 3 | _Wait 5-30s for webhook_ | Clerk fires `billing.subscription.created` |
| 4 | Check Vercel function logs | Log entry: `[Webhook] Updating plan for <clerkId> → pro` |
| 5 | Check Convex dashboard | User document: `plan: "pro"` |
| 6 | Reload `/dashboard` | All pro features unlocked (unlimited habits, AI insights, etc.) |
| 7 | Open `/billing` | "Manage" button links to portal |

**Pass criteria**: Plan updates to `pro` within 60s of payment without manual intervention.

---

### TC-03: Pro Yearly purchase

| Step | Action | Expected result |
|---|---|---|
| 1 | Click "Start Pro Yearly" on `/billing` | Clerk checkout for yearly plan |
| 2 | Complete payment | Success |
| 3 | Webhook fires | `billing.subscription.created` with yearly plan identifier |
| 4 | `mapClerkPlanToUserPlan()` maps to `pro` | Convex user plan = `pro` |
| 5 | Dashboard reflects pro access | Unlimited features available |

**Pass criteria**: Yearly variant correctly maps to `pro` (not a new plan type).

---

### TC-04: Lifetime purchase

| Step | Action | Expected result |
|---|---|---|
| 1 | Click "Get Lifetime Access" on `/billing` | Clerk checkout for one-time payment |
| 2 | Complete payment | Success |
| 3 | Webhook fires | Event with lifetime plan identifier |
| 4 | `mapClerkPlanToUserPlan()` maps to `lifetime` | Convex user plan = `lifetime` |
| 5 | Dashboard shows lifetime badge | No recurring billing UI shown |

**Pass criteria**: Lifetime correctly stored, no subscription renewal expectations in UI.

---

### TC-05: Subscription cancellation — downgrade to free

| Step | Action | Expected result |
|---|---|---|
| 1 | Open billing portal (click "Manage" on `/billing`) | Portal loaded |
| 2 | Cancel subscription | Cancellation confirmed in portal |
| 3 | Clerk fires `billing.subscription.deleted` | Webhook received |
| 4 | Check Vercel logs | `[Webhook] Subscription cancelled for <clerkId>` |
| 5 | Check Convex | User plan = `free` |
| 6 | Reload dashboard | Free limits re-applied |

**Pass criteria**: Downgrade is automatic and immediate after cancellation webhook.

---

### TC-06: Subscription update (plan change)

| Step | Action | Expected result |
|---|---|---|
| 1 | User on Pro Monthly upgrades to Pro Yearly via portal | `billing.subscription.updated` fires |
| 2 | Plan stays `pro` in Convex | No interruption — same app-level plan |

**Pass criteria**: Plan change within the same tier does not reset or break state.

---

### TC-07: Webhook retry resilience

| Step | Action | Expected result |
|---|---|---|
| 1 | Same webhook event delivered twice (Clerk retry) | Second call is a no-op (idempotent `patch`) |
| 2 | No duplicate users, no errors | Convex mutation patches same value |

**Pass criteria**: No 500 errors, no data corruption on retries.

---

### TC-08: Webhook before user sync (race condition)

| Step | Action | Expected result |
|---|---|---|
| 1 | Webhook arrives for a `clerkId` not yet in Convex | Mutation logs warning: `User not found for clerkId=...` |
| 2 | Returns 200 OK (no crash) | Clerk does not retry endlessly |
| 3 | User signs in later → `store` mutation creates user with `plan: free` | User exists; next webhook will update plan |

**Pass criteria**: No crash, safe no-op, warning logged.

---

### TC-09: Invalid/unknown plan identifier

| Step | Action | Expected result |
|---|---|---|
| 1 | Webhook payload has plan_id = `"some_unknown_thing"` | `mapClerkPlanToUserPlan()` returns `"free"` |
| 2 | User plan set to `free` (safe fallback) | No crash |

**Pass criteria**: Unknown plans default to `free`, logged for review.

---

### TC-10: Signature verification failure

| Step | Action | Expected result |
|---|---|---|
| 1 | Send POST to `/api/webhooks/clerk-billing` without valid Svix headers | 400 response |
| 2 | Send POST with tampered body | 400 "Invalid signature" |
| 3 | No Convex mutation called | Data integrity preserved |

**Pass criteria**: Unsigned/tampered requests rejected, no plan changes.

---

### TC-11: Missing `BILLING_WEBHOOK_SYNC_SECRET`

| Step | Action | Expected result |
|---|---|---|
| 1 | Remove `BILLING_WEBHOOK_SYNC_SECRET` from env | Webhook route returns 500 `Server config error` |
| 2 | No Convex mutation attempted | Safe failure |

**Pass criteria**: Explicit error logged, no silent data corruption.

---

### TC-12: Secret mismatch between Next.js and Convex

| Step | Action | Expected result |
|---|---|---|
| 1 | Set different `BILLING_WEBHOOK_SYNC_SECRET` in Next.js vs Convex | Convex mutation throws `Unauthorized webhook plan update` |
| 2 | Webhook route returns 500 | Plan not updated |

**Pass criteria**: Mismatched secrets fail loudly.

---

## 2) Feature gating verification matrix

After plan update, verify these transitions:

| Feature | `free` | `pro` / `lifetime` |
|---|---|---|
| Max habits | 5 | Unlimited |
| Max goals | 1 | Unlimited |
| AI insights | Blocked | Available |
| Advanced analytics | Blocked | Available |
| Habit stacking | Blocked | Available |
| Identity system | Blocked | Available |
| Data export | Blocked | Available |
| Custom themes | Blocked | Available |
| Priority support | No | Yes |

Source: `src/hooks/usePlanGating.ts`

---

## 3) Observability checkpoints

### Vercel function logs
- Filter by function: `/api/webhooks/clerk-billing`
- Look for:
  - `[Webhook] Received: <event_type>`
  - `[Webhook] Updating plan for <clerkId> → <plan>`
  - `[Webhook] Subscription cancelled for <clerkId>`
  - Any `Error processing` entries

### Convex dashboard
- Open Data tab → users table
- Filter by the test user's `clerkId`
- Verify `plan` field changes after each test

### Clerk dashboard
- Billing → Subscriptions tab
- Confirm subscription state matches expected for each test

---

## 4) Test execution order (recommended)

```
TC-10 (auth rejection)       ← validate security first
TC-11 (missing secret)       ← validate config safety
TC-12 (secret mismatch)      ← validate config safety
TC-01 (free baseline)        ← establish baseline
TC-02 (pro monthly purchase) ← critical happy path
TC-05 (cancellation)         ← critical downgrade path
TC-03 (pro yearly)           ← variant check
TC-04 (lifetime)             ← variant check
TC-06 (plan change)          ← edge case
TC-07 (webhook retry)        ← resilience
TC-08 (race condition)       ← edge case
TC-09 (unknown plan)         ← fallback safety
```

---

## 5) Sign-off criteria

All of the following must be true before declaring billing production-ready:

- [ ] TC-02 passes end-to-end (pro monthly purchase → plan sync)
- [ ] TC-05 passes end-to-end (cancellation → downgrade)
- [ ] TC-10 passes (unsigned requests rejected)
- [ ] No 500 errors in Vercel logs during test suite
- [ ] Convex user plan matches expected state after each test
- [ ] Feature gating reflects plan changes in real-time
- [ ] Billing page renders correctly for both signed-in and signed-out users

---

## 6) Known limitations / future work

1. **No trial period**: Current plans go directly to paid. Trial support requires Clerk pricing model changes + additional webhook events.
2. **No proration handling**: Plan upgrades/downgrades don't show prorated amounts in-app (handled by Clerk portal).
3. **No invoice display**: Invoices are managed in Clerk portal, not surfaced in-app.
4. **Webhook-only sync**: If a webhook is lost, plan state could be stale until next webhook. Consider adding a periodic plan check or Clerk API polling as a fallback.
