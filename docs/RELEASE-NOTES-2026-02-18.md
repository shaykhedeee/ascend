# Release Notes — 2026-02-18

**Release tag (proposed):** `v2.0.0-launch-hardening`  
**Repository:** `shaykhedeee/ascend`  
**Prepared on:** 2026-02-18

---

## Highlights

This release focuses on **launch hardening** for billing integrity, security, and operational readiness.

### ✅ Security
- Removed runtime reliance on public AI secret key patterns.
- Standardized server-side secret usage for AI providers.
- Added typed environment contracts for safer config handling.

### ✅ Billing reliability
- Implemented durable webhook idempotency using persisted event ledger (`billingWebhookEvents`).
- Added replay-window protection for webhook timestamps.
- Added retry/backoff for webhook plan-sync with structured telemetry.

### ✅ API trust boundary improvements
- Enforced auth across AI API routes.
- Enforced auth on payment initiation endpoint.
- Payment initiation now derives payer identity from trusted Clerk context.

### ✅ Developer experience / quality
- Added CI workflow (`typecheck`, `lint`, `test`, `build`).
- Added explicit `npm run typecheck` script.
- Fixed Jest setup key warning (`setupFilesAfterEnv`).

---

## Behavior changes

1. **Webhook processing**
   - Duplicate webhook events are now safely ignored.
   - Stale webhook timestamps are rejected.

2. **Payment initiation**
   - Anonymous calls are now rejected (`401`).
   - Client-supplied user identity fields are no longer trusted.

3. **AI secrets**
   - Runtime now expects server-side env vars only.

---

## Plan and pricing alignment

- Free plan limits aligned end-to-end: **10 habits**, **3 goals**, **AI insights enabled**.
- Lifetime plan set to **$199** and reflected in pricing/billing materials.
- Backend plan gates synced with UI claims.

---

## Verification summary

- Typecheck: ✅ pass
- Tests: ✅ pass (`55/55`)
- Build: ✅ pass
- Runtime smoke checks: ✅ key routes verified

---

## Documentation added/updated

### Newly added
- `docs/RATE-LIMIT-STRATEGY.md`
- `docs/PHASE0-SECURITY-IMPLEMENTATION-NOTES.md`
- `docs/LAUNCH-READINESS-CHECKLIST.md`
- `docs/GO-NO-GO-REPORT-2026-02-18.md`
- `docs/POST-LAUNCH-MONITORING-PACK.md`
- `docs/RELEASE-NOTES-2026-02-18.md`

### Updated
- `README.md`
- `.env.example`
- `.env.local.example`
- `docs/AI-IMPLEMENTATION-SUMMARY.md`

---

## Notable commits in this hardening cycle

- `132633c` — config/env contracts + CI baseline
- `bfced30` — remove public AI secret patterns + webhook idempotency
- `cb9b32c` — replay guard + retry telemetry + auth normalization
- `7b6cd58` — launch docs (rate-limit/checklist/go-no-go)

---

## Known follow-ups

1. Distributed Redis/Upstash rate limiter (implementation phase).
2. Lint warning cleanup (`any`, hook dependency warnings) in non-blocking areas.
3. Monitoring alert channel wiring and ownership sign-off.

---

## Release recommendation

**Engineering status:** Ready  
**Operational status:** Conditional (requires final env + monitoring checklist sign-off)

Proceed to production launch once `docs/LAUNCH-READINESS-CHECKLIST.md` unchecked operational items are completed.
