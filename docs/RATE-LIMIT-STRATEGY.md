# Ascendify Rate-Limit Strategy

**Date:** 2026-02-18  
**Owner:** Platform/Security  
**Scope:** API abuse prevention, webhook resilience, cost control

---

## 1) Objectives

1. Protect paid infrastructure from abuse (AI endpoints + payment initiation).
2. Preserve billing correctness during retries and webhook bursts.
3. Keep UX smooth for normal users while throttling bots/noise.
4. Provide clear telemetry for incident triage.

---

## 2) Endpoints and policy

### A) AI endpoints (authenticated)
Routes:
- `POST /api/ai/chat`
- `POST /api/ai/decompose`
- `POST /api/ai/suggestions`
- `POST /api/chatbot`

Policy target:
- Free users: lower burst/throughput
- Pro/Lifetime users: higher thresholds
- Keying: `userId` primary, `IP` secondary fallback
- Failure response: `429` + `Retry-After` header

Recommended baseline:
- Free: `30 req / 10 min`, burst `6 / 30 sec`
- Pro/Lifetime: `120 req / 10 min`, burst `20 / 30 sec`

### B) Payment initiation (authenticated)
Route:
- `POST /api/payment/initiate`

Policy target:
- `5 req / 15 min` per user
- `10 req / 15 min` per IP
- Reject with `429` and generic error body

### C) Billing webhook endpoint (Clerk)
Route:
- `POST /api/webhooks/clerk-billing`

Policy target:
- No user-facing rate-limit response required (provider callback).
- Protection already implemented:
  - signature verification
  - replay-window timestamp guard
  - durable idempotency by `svix-id`
  - retry/backoff for internal mutation attempts

---

## 3) Storage strategy

### Phase 1 (current)
- In-memory process limits (best effort) for low traffic.
- Durable idempotency in Convex for webhook events.

### Phase 2 (launch hardening)
- Move runtime rate limits to Redis/Upstash for distributed enforcement.
- Use fixed-window + burst token bucket hybrid.
- Central helper module at `src/lib/security/rateLimit.ts`.

---

## 4) Telemetry requirements

For each protected route, log structured events:
- `event`: `rate_limit_check`
- `route`
- `actorType`: `user|ip|webhook`
- `actorId`
- `allowed`
- `remaining`
- `resetAt`
- `requestId`

For webhook retries (already in place):
- attempt number
- duration
- applied/ignored status
- duplicate indicator
- error message (if failed)

---

## 5) Configuration knobs

Add these environment variables (proposed):

```env
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REDIS_URL=
RATE_LIMIT_REDIS_TOKEN=
RATE_LIMIT_AI_FREE_WINDOW_SEC=600
RATE_LIMIT_AI_FREE_MAX=30
RATE_LIMIT_AI_PRO_WINDOW_SEC=600
RATE_LIMIT_AI_PRO_MAX=120
RATE_LIMIT_PAYMENT_WINDOW_SEC=900
RATE_LIMIT_PAYMENT_MAX=5
```

---

## 6) Rollout plan

1. **Shadow mode** (log-only): collect 24h baseline.
2. Enable enforcement on AI routes.
3. Enable enforcement on payment initiation.
4. Tune thresholds from telemetry.
5. Add alerts for repeated 429 spikes.

---

## 7) Acceptance criteria

- AI abuse simulation gets 429 within threshold.
- Normal user session stays below 1% rate-limit hits.
- Payment endpoint blocks burst retries safely.
- Webhook duplicate delivery does not re-apply plan.
- Dashboard logs show route-level throttling metrics.

---

## 8) Current status

- ✅ Auth required for AI and payment initiation routes
- ✅ Webhook replay guard + idempotency + retry telemetry
- ⏳ Distributed rate-limiter module implementation pending (Phase 2)
