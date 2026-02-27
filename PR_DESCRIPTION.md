PR: fix/billing-transactions

Summary
- Add Convex transaction helpers to enforce plan limits atomically and avoid races.
- Rewire habit and goal create mutations to use transaction helpers.
- Implement archive/restore helpers for downgrade preservation; expose queries:
  - `convex/habits.ts`: `listArchivedByDowngrade`, `getArchivedDowngradeCount`, `restoreArchivedOnUpgrade`
  - `convex/goals.ts`: similar queries/mutations
- Add frontend `DowngradePlanNotice` component (`src/components/DowngradePlanNotice.tsx`) that shows a dismissible banner when items were archived due to downgrade and allows attempting restore or opening billing/settings.

Tests
- Ran targeted billing integration tests and full Jest suite locally: all tests pass (81/81).

Notes for reviewers
- Branch: `fix/billing-transactions` pushed to origin.
- Key files: `convex/lib/transactions.ts`, `convex/habits.ts`, `convex/goals.ts`, `src/components/DowngradePlanNotice.tsx`.
- Environment: make sure Convex and Clerk webhook secrets are configured in staging when testing webhooks.
