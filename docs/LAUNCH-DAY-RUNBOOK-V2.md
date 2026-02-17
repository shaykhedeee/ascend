# Ascendify Launch-Day Runbook v2

**Date created**: 2026-02-17  
**Target launch window**: When all Go criteria (Section 9) are met  
**Production URL**: https://ascend-wheat-six.vercel.app  
**Repository**: https://github.com/shaykhedeee/ascend  
**Convex deployment**: `dev:spotted-akita-320` (eu-west-1)

---

## Table of Contents

1. [Pre-Launch Validation (T-24h)](#1-pre-launch-validation-t-24h)
2. [Environment Variables — Production Checklist](#2-environment-variables--production-checklist)
3. [Clerk Dashboard Configuration](#3-clerk-dashboard-configuration)
4. [Convex Production Setup](#4-convex-production-setup)
5. [Deploy Sequence](#5-deploy-sequence)
6. [Post-Deploy Smoke Tests](#6-post-deploy-smoke-tests)
7. [Billing Validation — Quick Pass](#7-billing-validation--quick-pass)
8. [Monitoring and Alerting](#8-monitoring-and-alerting)
9. [Go/No-Go Gate](#9-gono-go-gate)
10. [Launch Execution (T-0)](#10-launch-execution-t-0)
11. [First-Hour Monitoring](#11-first-hour-monitoring)
12. [Rollback Procedures](#12-rollback-procedures)
13. [Post-Launch Day-1 Checklist](#13-post-launch-day-1-checklist)
14. [Communication Templates](#14-communication-templates)
15. [Known Risks and Mitigations](#15-known-risks-and-mitigations)

---

## 1. Pre-Launch Validation (T-24h)

### Code freeze criteria
- [ ] All billing, auth, and core flows are committed to `main`
- [ ] `npm run build` passes with no errors (warnings acceptable)
- [ ] No open PRs that touch auth/billing/webhook paths
- [ ] Convex schema synced with `npx convex deploy`

### Local sanity checks (run from repo root)
```powershell
# Build check
npm run build

# Convex validation
npx convex dev --until-success

# TypeScript check
npx tsc --noEmit
```

### Files that must be reviewed before launch
| File | Purpose | Risk area |
|---|---|---|
| `src/app/api/webhooks/clerk-billing/route.ts` | Billing webhook handler | Plan sync integrity |
| `convex/users.ts` | `updatePlanFromWebhook` mutation | Secret validation |
| `src/lib/billing/plans.ts` | Plan catalog + mapping | Price accuracy |
| `src/app/billing/page.tsx` | Billing UI | Checkout link availability |
| `src/proxy.ts` | Middleware route matcher | Webhook must be public |
| `src/hooks/usePlanGating.ts` | Feature limits | Free vs Pro enforcement |

---

## 2. Environment Variables — Production Checklist

### Currently set on Vercel (verified 2026-02-17)
- [x] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [x] `CLERK_SECRET_KEY`
- [x] `NEXT_PUBLIC_CONVEX_URL`
- [x] `CONVEX_DEPLOYMENT`
- [x] `NEXT_PUBLIC_CLERK_SIGN_IN_URL` → `/sign-in`
- [x] `NEXT_PUBLIC_CLERK_SIGN_UP_URL` → `/sign-up`
- [x] `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`
- [x] `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`
- [x] AI provider keys (AIML, Groq, Google, OpenRouter)
- [x] `CLERK_FRONTEND_API_URL`

### Must be added before launch
- [ ] `NEXT_PUBLIC_CLERK_BILLING_PORTAL_URL` — from Clerk billing portal setup
- [ ] `NEXT_PUBLIC_CLERK_CHECKOUT_PRO_MONTHLY_URL` — from Clerk product: Pro Monthly
- [ ] `NEXT_PUBLIC_CLERK_CHECKOUT_PRO_YEARLY_URL` — from Clerk product: Pro Yearly
- [ ] `NEXT_PUBLIC_CLERK_CHECKOUT_LIFETIME_URL` — from Clerk product: Lifetime
- [ ] `CLERK_WEBHOOK_SECRET` — from Clerk webhook endpoint signing secret
- [ ] `BILLING_WEBHOOK_SYNC_SECRET` — generate a random 32+ char string

### How to add a variable to Vercel

```powershell
# From repo root (linked to Vercel project)
vercel env add CLERK_WEBHOOK_SECRET production
# Paste value when prompted

# Or via Vercel dashboard: Settings → Environment Variables → Add
```

### On Convex (must match Next.js)
```powershell
npx convex env set BILLING_WEBHOOK_SYNC_SECRET "<same-value-as-vercel>"
```

---

## 3. Clerk Dashboard Configuration

### Step-by-step (clerk.com → your application)

#### A. Create billing products
1. Go to **Billing** → **Products**
2. Create **Pro Monthly**: $12/month, recurring
3. Create **Pro Yearly**: $96/year, recurring
4. Create **Lifetime**: $249, one-time

#### B. Copy checkout links
After creating products, each has a hosted checkout URL.
- Copy Pro Monthly URL → `NEXT_PUBLIC_CLERK_CHECKOUT_PRO_MONTHLY_URL`
- Copy Pro Yearly URL → `NEXT_PUBLIC_CLERK_CHECKOUT_PRO_YEARLY_URL`
- Copy Lifetime URL → `NEXT_PUBLIC_CLERK_CHECKOUT_LIFETIME_URL`

#### C. Enable billing portal
1. Go to **Billing** → **Portal**
2. Enable the customer self-service portal
3. Copy portal URL → `NEXT_PUBLIC_CLERK_BILLING_PORTAL_URL`

#### D. Register webhook
1. Go to **Webhooks** → **Add Endpoint**
2. URL: `https://ascend-wheat-six.vercel.app/api/webhooks/clerk-billing`
3. Subscribe to events:
   - `billing.subscription.created`
   - `billing.subscription.updated`
   - `billing.subscription.deleted`
4. Copy **Signing Secret** → `CLERK_WEBHOOK_SECRET`

---

## 4. Convex Production Setup

### Current deployment
- Name: `dev:spotted-akita-320`
- Region: eu-west-1
- URL: `https://spotted-akita-320.eu-west-1.convex.cloud`

### Production deployment steps
```powershell
# Deploy Convex functions
npx convex deploy

# Set billing secret (must match Vercel env)
npx convex env set BILLING_WEBHOOK_SYNC_SECRET "<your-secret>"

# Verify
npx convex env list
```

### Schema validation
Confirm the `users` table has:
- `plan` field with union: `free | pro | lifetime`
- `by_clerkId` index

---

## 5. Deploy Sequence

### Pre-deploy checklist
1. All env variables set on Vercel (Section 2)
2. Convex deployed and secret synced (Section 4)
3. Clerk webhook registered (Section 3D)

### Deploy commands
```powershell
# Ensure on main branch with latest code
git checkout main
git pull origin main

# Production deploy
vercel deploy --prod --yes
```

### Post-deploy verification
```powershell
# Check deployment status
vercel inspect <deployment-url>

# Quick health check (expect redirect to Clerk handshake)
curl -s -o /dev/null -w "%{http_code}" https://ascend-wheat-six.vercel.app/
# Expected: 200 or 307 (Clerk auth redirect)

# Webhook endpoint check (should return 400 — no svix headers)
curl -s -o /dev/null -w "%{http_code}" -X POST https://ascend-wheat-six.vercel.app/api/webhooks/clerk-billing
# Expected: 400
```

---

## 6. Post-Deploy Smoke Tests

### Priority 1 — Authentication flow
| Test | Expected |
|---|---|
| Visit `/` | Landing page renders |
| Visit `/sign-in` | Clerk sign-in modal loads |
| Sign in with existing account | Redirected to `/dashboard` |
| Visit `/sign-up` | Clerk sign-up modal loads |

### Priority 2 — Core app functionality
| Test | Expected |
|---|---|
| Dashboard loads with user data | Convex query succeeds |
| Create a habit | Mutation succeeds, habit appears |
| Create a goal | Mutation succeeds, goal appears |
| Open focus timer | Timer renders and starts |
| Log mood in wellness | Entry saved |

### Priority 3 — Billing page
| Test | Expected |
|---|---|
| Open `/billing` signed out | Sign-in prompt shown |
| Open `/billing` signed in | 4 plan cards visible |
| Checkout links clickable | Redirects to Clerk checkout (if URLs set) |
| "Manage" button visible | Links to Clerk portal (if URL set) |

---

## 7. Billing Validation — Quick Pass

Execute these from the full [CLERK-BILLING-VALIDATION-PLAN.md](CLERK-BILLING-VALIDATION-PLAN.md):

| Priority | Test case | Description |
|---|---|---|
| **MUST** | TC-10 | Unsigned webhook rejected (400) |
| **MUST** | TC-02 | Pro Monthly purchase → plan sync to Convex |
| **MUST** | TC-05 | Cancellation → downgrade to free |
| **SHOULD** | TC-04 | Lifetime purchase → plan = lifetime |
| **SHOULD** | TC-08 | Webhook before user sync (race, no crash) |

If TC-02 and TC-05 pass, billing is production-viable.

---

## 8. Monitoring and Alerting

### Vercel monitoring
- **Runtime Logs**: Filter by function `/api/webhooks/clerk-billing`
- **Deployment Status**: Check for failed builds
- **Edge Middleware**: Watch for auth redirect failures

### Convex monitoring
- **Logs**: Filter for `updatePlanFromWebhook` execution
- **Data**: Watch `users` table `plan` field changes
- **Errors**: Any thrown exceptions in mutations

### What to watch in first hour
- 5xx error count (target: 0)
- Webhook success rate (target: 100%)
- Auth callback failures (target: 0)
- Page load errors in browser console

---

## 9. Go/No-Go Gate

### Go criteria (ALL must be true)
- [ ] Build passes (`next build` exit code 0)
- [ ] All 6 billing env vars set on Vercel
- [ ] `BILLING_WEBHOOK_SYNC_SECRET` matches in Vercel and Convex
- [ ] Webhook endpoint returns 400 for unsigned requests (TC-10)
- [ ] At least one successful paid flow tested (TC-02)
- [ ] At least one successful cancellation tested (TC-05)
- [ ] Dashboard loads for authenticated user
- [ ] No SEV-1 open issues

### No-Go criteria (ANY blocks launch)
- Billing webhook 500-errors on valid requests
- Plan not updating after successful payment
- Auth callback loops or failures
- Missing production secrets
- Build failure

---

## 10. Launch Execution (T-0)

### Minute-by-minute

| Time | Action | Owner |
|---|---|---|
| T-60m | Final `git pull` + `npm run build` | Dev |
| T-45m | Verify all env vars on Vercel + Convex | Dev |
| T-30m | `vercel deploy --prod --yes` | Dev |
| T-20m | Run smoke tests (Section 6) | Dev |
| T-10m | Run billing quick pass (Section 7) | Dev |
| T-0 | **Launch announcement** | Marketing |
| T+5m | Monitor first signups in Convex dashboard | Dev |
| T+15m | Check webhook logs for any billing events | Dev |
| T+30m | Review error rates | Dev |
| T+60m | First-hour checkpoint (Section 11) | Dev |

---

## 11. First-Hour Monitoring

### Dashboard checks every 15 minutes

| Metric | Where to check | Healthy threshold |
|---|---|---|
| Vercel 5xx rate | Vercel Analytics | 0% |
| Webhook function invocations | Vercel Logs | No errors |
| New user signups | Convex Data → users table | > 0 |
| Auth callback success | Clerk Dashboard → Sessions | No failures |
| Page load performance | Browser DevTools Network | < 3s LCP |

### Escalation triggers
- **Any** 5xx on webhook endpoint → investigate immediately
- **Any** user report of payment accepted but plan not updated → SEV-1
- **3+** auth failures in 15 minutes → check Clerk status page
- **Build failure** on Vercel → freeze deploys, use last known good

---

## 12. Rollback Procedures

### Level 1 — Quick rollback (< 2 minutes)
```powershell
# Rollback to previous Vercel deployment
vercel rollback
```
This restores the last successful production deployment without changing code.

### Level 2 — Code rollback (< 5 minutes)
```powershell
# Revert to last known good commit
git log --oneline -5
git revert <bad-commit-hash>
git push origin main
vercel deploy --prod --yes
```

### Level 3 — Environment reset (< 10 minutes)
If billing is the issue:
1. Remove billing checkout URLs from Vercel env (users see "Set URL" buttons)
2. Redeploy — billing page becomes informational only
3. Debug webhook/plan sync issue in isolation

### Convex rollback
```powershell
# Convex doesn't have instant rollback — redeploy from git
git checkout <last-good-hash>
npx convex deploy
git checkout main
```

### Webhook endpoint preservation
When rolling back, ensure the webhook URL remains the same. Clerk will retry failed webhooks for up to 3 days.

---

## 13. Post-Launch Day-1 Checklist

### Morning after (T+12h to T+24h)
- [ ] Review all webhook logs — any failures?
- [ ] Count new signups and check onboarding completion rate
- [ ] Verify at least one plan upgrade worked (if any purchases happened)
- [ ] Check Convex function execution metrics for anomalies
- [ ] Review browser error reports (if error tracking is enabled)

### Day-1 data collection
| Metric | Source | Action if concerning |
|---|---|---|
| Signup count | Convex users table count | If 0, check auth flow |
| Onboarding completion % | Convex users `onboardingComplete` | If < 50%, investigate friction |
| Billing page visits | Vercel analytics | If 0, check routing |
| Paid conversions | Convex users where `plan != free` | If 0 (expected), no action needed |
| Error rate | Vercel logs | If > 0, investigate |

### Day-1 fixes (ship within 24h)
- Fix any broken links or missing assets
- Address any user-reported onboarding friction
- Correct any billing page display issues
- Update billing portal URL if Clerk generated a different one

---

## 14. Communication Templates

### Launch announcement (social/email)
```
Ascendify is live!

Build habits, crush goals, and transform your life with AI-powered coaching.

Start free → [link]
Go Pro for $8/mo (annual) → [link]

#productivity #habits #goals
```

### Incident communication (if SEV-1)
```
We're aware of an issue affecting [billing/auth/dashboard].
Our team is investigating and we'll update within 30 minutes.
Your data is safe and no action is needed on your end.
```

### Resolution communication
```
The issue affecting [description] has been resolved.
All systems are operating normally.
Thank you for your patience.
```

---

## 15. Known Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Webhook lost by Clerk | Low | Plan not updated | Clerk retries for 3 days; add manual plan override in Convex dashboard |
| Clerk outage during launch | Low | Auth unavailable | Redirect users to status page; retry later |
| Convex rate limiting | Low | Queries fail | Monitor function execution; upgrade plan if needed |
| User pays but webhook fails | Medium | SEV-1 | Manual fix via Convex dashboard; refund if needed |
| High traffic spike | Low | Slow pages | Vercel auto-scales; Convex handles concurrency |
| Wrong price displayed | Low | Trust issue | Prices are hardcoded in `plans.ts`; verify before launch |

### Manual plan override (emergency)
If a user paid but webhook didn't update their plan:
1. Find user in Convex Data → users table
2. Filter by email or clerkId
3. Patch `plan` field to `"pro"` or `"lifetime"`
4. Notify user that access has been granted

---

## Quick Reference Card

```
Production URL:   https://ascend-wheat-six.vercel.app
Vercel Project:   shays-projects-4d072282/ascend
Convex Dashboard: https://dashboard.convex.dev
Clerk Dashboard:  https://clerk.com → your app
GitHub Repo:      https://github.com/shaykhedeee/ascend

Deploy:           vercel deploy --prod --yes
Rollback:         vercel rollback
Convex deploy:    npx convex deploy
Convex env:       npx convex env set KEY value
Convex env list:  npx convex env list
```
