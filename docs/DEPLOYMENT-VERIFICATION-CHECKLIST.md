# Deployment Verification Checklist

## Preflight
- [ ] Confirm required environment variables are set for target environment.
- [ ] Confirm Clerk product IDs/metadata match in-app entitlements.
- [ ] Confirm Convex deployment target is correct.

## Local Reliability
- [ ] Use clean dev start (`npm run dev:clean`) to avoid stale `.next` and port collisions.
- [ ] Verify app loads at `/` and dashboard routes after sign-in.
- [ ] Verify `middleware` protection for private routes and public access for marketing routes.

## Build & Runtime Checks
- [x] Run `npm run verify:deploy` (typecheck + production build).
- [x] Run `npm run test:ics` (strict ICS malformed + provider compatibility checks).
- [x] Run security validation tests (`npm test -- src/lib/__tests__/security.headers.test.ts src/app/api/webhooks/clerk-billing/route.test.ts`).
- [ ] Run `npm run start` and load key routes:
  - [ ] `/`
  - [ ] `/pricing`
  - [ ] `/features`
  - [ ] `/guides`
  - [ ] `/help`
  - [ ] `/billing`
- [ ] Validate `error`, `global-error`, and `not-found` screens render correctly in failure/404 scenarios.

## Security Checks
- [x] Confirm security headers are present on API responses.
- [ ] Confirm origin validation blocks untrusted mutating API requests.
- [ ] Confirm rate limiting responses return 429 and retry headers.

## SEO/AEO Checks
- [ ] Validate `/robots.txt` and `/sitemap.xml` are accessible and coherent.
- [ ] Validate JSON-LD in page source (SoftwareApplication + FAQ + WebSite).
- [ ] Confirm canonical metadata and Open Graph tags on key pages.

## Notifications & Personalization
- [ ] Verify notification settings persist and rehydrate from store.
- [ ] Verify quiet hours suppress/shift reminders correctly.
- [ ] Verify work/university personalization changes reminder windows.

## Release Readiness
- [x] Confirm no broken footer links.
- [ ] Confirm no user-facing emoji in updated surfaces.
- [ ] Capture release notes and rollback plan.

## CI Quality Gates
- [x] PR CI runs dedicated ICS QA command (`npm run test:ics`).
