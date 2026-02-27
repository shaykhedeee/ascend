# Clerk Billing Feature Entitlements Mapping (Ascendify)

Use this as the source-of-truth checklist when configuring products/plans in Clerk Billing.

## Plan identifiers
- `free`
- `pro_monthly`
- `pro_yearly`
- `lifetime`

## App-level plan mapping
- `free` → app plan `free`
- `pro_monthly` / `pro_yearly` → app plan `pro`
- `lifetime` → app plan `lifetime`

## Feature matrix to mirror in Clerk product descriptions/metadata

| Feature | Free | Pro | Lifetime |
|---|---:|---:|---:|
| Max habits | 10 | Unlimited | Unlimited |
| Max goals | 3 | Unlimited | Unlimited |
| AI insights | ✅ | ✅ | ✅ |
| Advanced analytics | ❌ | ✅ | ✅ |
| Habit stacking | ❌ | ✅ | ✅ |
| Deep onboarding | ❌ | ✅ | ✅ |
| Calendar view | ✅ | ✅ | ✅ |
| Focus timer | ✅ | ✅ | ✅ |
| Mood tracking | ✅ | ✅ | ✅ |
| Identity system | ❌ | ✅ | ✅ |
| Custom themes | ❌ | ✅ | ✅ |
| Data export | ❌ | ✅ | ✅ |
| Priority support | ❌ | ✅ | ✅ |

## Recommended Clerk metadata (per paid product)

Set these keys in Clerk product metadata so support/billing context stays consistent:

- `app_plan`: `pro` or `lifetime`
- `feature_tier`: `core` | `pro` | `lifetime`
- `max_habits`: `Infinity` (or large number)
- `max_goals`: `Infinity` (or large number)
- `ai_coaching`: `true`
- `advanced_analytics`: `true`
- `data_export`: `true`

## Verification after setup
1. Complete test checkout for each plan in Clerk test mode.
2. Confirm webhook `/api/webhooks/clerk-billing` receives event and updates Convex `users.plan`.
3. Confirm UI gating in app matches selected plan.
4. Confirm billing page CTA and labels reflect configured plan prices.

## Where this is enforced in code
- Plan catalog: `src/lib/billing/plans.ts`
- Plan mapping from Clerk identifier: `mapClerkPlanToUserPlan(...)`
- Feature gating: `src/hooks/usePlanGating.ts`
- Webhook sync: `src/app/api/webhooks/clerk-billing/route.ts`
