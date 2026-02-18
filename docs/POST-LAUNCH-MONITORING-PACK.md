# Post-Launch Monitoring Pack

**App:** Ascendify  
**Version Window:** Launch + first 72 hours  
**Date:** 2026-02-18

---

## 1) Monitoring goals

1. Detect auth and billing breakages in under 5 minutes.
2. Detect API abuse/latency regressions before user-impact grows.
3. Keep checkout → webhook → plan sync reliable.
4. Provide clear owner/action paths for incidents.

---

## 2) Golden signals (what to watch first)

### Availability
- `GET /` success rate
- `GET /pricing` success rate
- `GET /billing` success rate
- API route 5xx rate (all)

### Latency
- p95 route latency (web + API)
- Webhook processing duration (`[WebhookTelemetry] durationMs`)

### Errors
- 5xx count by route
- Webhook mutation failures (per attempt)
- Payment callback verification failures (`invalid_hash`, `callback_error`)

### Saturation / Abuse
- 429 volume (AI + payment initiation)
- AI request volume/user and volume/IP

---

## 3) Critical route watchlist

| Route | Why critical | Alert threshold |
|---|---|---|
| `POST /api/webhooks/clerk-billing` | Plan sync integrity | >2 failures in 5 min |
| `POST /api/payment/initiate` | Revenue entrypoint | >3% non-2xx in 10 min |
| `POST /api/ai/chat` | High-volume AI usage | p95 > 2.5s for 10 min |
| `POST /api/ai/decompose` | High-cost AI op | p95 > 4s for 10 min |
| `POST /api/ai/suggestions` | UX-critical coaching | >5% 5xx in 10 min |

---

## 4) Webhook integrity dashboard queries

Use logs from:
- `[WebhookTelemetry]`
- `[Webhook]`

Track:
1. **applied vs duplicate_event ratio**
2. **retry attempt distribution** (1st pass vs retries)
3. **stale timestamp rejects**
4. **user_not_found outcomes**

Expected healthy baseline:
- `applied` high
- low retry count
- duplicate_event occasional
- stale timestamp near 0

---

## 5) Incident response matrix

| Severity | Trigger | SLA | Primary owner | Immediate action |
|---|---|---|---|---|
| Sev-1 | Checkout or webhook fully broken | 15 min | Eng On-Call | Enable incident mode, rollback if needed |
| Sev-2 | Elevated 5xx or major latency | 30 min | Backend owner | Identify route, deploy targeted fix |
| Sev-3 | Isolated route degradation | 2 hrs | Feature owner | Patch + monitor |

---

## 6) Playbooks

### Playbook A — Webhook failures spike
1. Check latest deploy diff.
2. Inspect `[WebhookTelemetry]` attempts/errors.
3. Validate env values:
   - `CLERK_WEBHOOK_SECRET`
   - `BILLING_WEBHOOK_SYNC_SECRET`
4. Verify Convex reachable + mutation success.
5. If plan updates failing continuously: rollback API route commit.

### Playbook B — Payment initiation failures
1. Confirm `POST /api/payment/initiate` auth behavior.
2. Validate PayU envs:
   - `PAYU_MERCHANT_KEY`
   - `PAYU_MERCHANT_SALT`
3. Check failure reason distribution by response status.
4. Run synthetic checkout initiation with test account.

### Playbook C — AI abuse or runaway usage
1. Check request spikes by user/IP.
2. Confirm auth enforced on AI routes.
3. Temporarily lower thresholds / block offending identifiers.
4. Prioritize distributed rate limiter rollout (Redis/Upstash).

---

## 7) Alert routing

- **Engineering on-call:** primary
- **Product owner:** secondary
- **Escalation:** if Sev-1 > 15 min unresolved, trigger leadership channel

Recommended channels:
- Slack: `#ascend-alerts`
- Email fallback: ops distro

---

## 8) First-hour launch watch checklist

- [ ] Deployment healthy in Vercel
- [ ] Convex functions healthy
- [ ] Webhook test event processed (`applied` or expected duplicate)
- [ ] One successful checkout initiation tested
- [ ] No sustained 5xx burst
- [ ] p95 route latency within expected range

---

## 9) Day-1 / Day-3 review checklist

### Day-1
- [ ] 24h error budget consumed < 10%
- [ ] No unresolved Sev-1 incidents
- [ ] Billing sync success rate > 99%
- [ ] AI route 5xx < 1%

### Day-3
- [ ] Rate-limit tuning proposal created from real traffic
- [ ] Top 5 warning classes prioritized for cleanup
- [ ] Post-launch bugfix patch train planned

---

## 10) Post-launch follow-ups

1. Implement distributed Redis-backed rate limiting.
2. Add scheduled synthetic probes for billing endpoints.
3. Add metrics panel for `billingWebhookEvents` in Convex admin views.
4. Tighten lint warnings and `any` debt in hot paths.
