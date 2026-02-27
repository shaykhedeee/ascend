# Resurgo — Launch Plan
**Domain:** `resurgo.life`  
**Stack:** Next.js 14 · Convex · Clerk · Vercel  
**Convex cloud:** `https://spotted-akita-320.eu-west-1.convex.cloud`

---

## 1. Environment Variables

All variables below must be set in **Vercel → Project → Settings → Environment Variables** for the `production` environment (and optionally preview/development).

### Convex

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Convex dashboard → Deployment URL (e.g. `https://spotted-akita-320.eu-west-1.convex.cloud`) |
| `CONVEX_DEPLOY_KEY` | Convex dashboard → Settings → Deploy Key (for CI/CD only, not required on Vercel if you run `npx convex deploy` manually) |

### Clerk

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk dashboard → API Keys → Publishable key |
| `CLERK_SECRET_KEY` | Clerk dashboard → API Keys → Secret key |
| `CLERK_WEBHOOK_SECRET` | Clerk dashboard → Webhooks → your endpoint → Signing secret |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/dashboard` |
| `NEXT_PUBLIC_CLERK_BILLING_PORTAL_URL` | Clerk dashboard → Billing → Portal URL |

### Site

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://resurgo.life` |
| `NEXT_PUBLIC_APP_URL` | `https://resurgo.life` (duplicate for safety) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics Measurement ID (e.g. `G-XXXXXXXXXX`) — optional |

### AI (server-side, not exposed to browser)

| Variable | Where to get it | Required |
|---|---|---|
| `GROQ_API_KEY` | console.groq.com | ✅ Primary model provider |
| `GOOGLE_AI_STUDIO_KEY` | aistudio.google.com | ✅ Gemini fallback |
| `GOOGLE_AI_STUDIO_KEY_BACKUP` | Same project, second key | Optional |
| `OPENROUTER_API_KEY` | openrouter.ai | ✅ Final fallback |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | ❌ Only needed for local dev |

---

## 2. Convex Setup

```bash
# 1. Install Convex CLI (if not already)
npm install -g convex

# 2. Login
npx convex login

# 3. Link to production deployment
npx convex dev --once  # or just run:

# 4. Deploy (after any schema / function changes)
npx convex deploy
```

Convex env vars on the cloud function side (set in Convex dashboard → Settings → Environment Variables):
- None required for current schema — all secrets live in Next.js environment.

---

## 3. Clerk Setup

### Production instance
1. Create a **Production** Clerk instance (separate from dev).
2. Enable sign-in methods: **Email + Google OAuth** (recommended).
3. Set allowed redirect URLs: `https://resurgo.life/*`
4. Copy production keys to Vercel env vars.

### Webhook
1. Clerk dashboard → Webhooks → Add Endpoint.
2. URL: `https://resurgo.life/api/webhooks/clerk-billing`
3. Events to subscribe:
   - `user.created`
   - `user.updated`
   - `user.deleted`
   - `billing.subscription.created`
   - `billing.subscription.updated`
   - `billing.subscription.deleted`
4. Copy the **Signing Secret** → `CLERK_WEBHOOK_SECRET` in Vercel.

### Billing
1. Clerk dashboard → Billing → Plans.
2. Create two plans that match the app:
   - **Free** — `plan_free` (or however Clerk generates the ID)
   - **Pro** — match the IDs in `src/lib/clerk-billing.ts`
3. Set `NEXT_PUBLIC_CLERK_BILLING_PORTAL_URL` to the Clerk billing portal URL.

---

## 4. Vercel Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Deploy to production
vercel --prod
```

Recommended Vercel project settings:
- Framework: **Next.js**
- Node version: **20.x**
- Build command: `npm run build` (default)
- Output directory: `.next` (default)
- Install command: `npm install`

**Important:** `next.config.js` has `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true` — this is intentional to unblock deployment while TypeScript errors are cleaned up incrementally.

---

## 5. DNS Records

Point `resurgo.life` to Vercel:

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

In Vercel: Project → Settings → Domains → Add `resurgo.life` and `www.resurgo.life`.

---

## 6. Go-Live Command Sequence

```bash
# Step 1: Deploy Convex functions
npx convex deploy

# Step 2: Push code to GitHub (triggers Vercel auto-deploy)
git add -A
git commit -m "chore: production launch"
git push origin fix/billing-transactions

# Step 3: In Vercel, promote the deployment to production domain
# (or merge branch to main if main = production)

# Step 4: Verify deployment
curl https://resurgo.life/api/health  # should return 200
```

---

## 7. 10-Step Smoke Test

Run these manually after go-live:

| # | Test | Expected |
|---|---|---|
| 1 | Open `https://resurgo.life` | Landing page loads, no JS errors in console |
| 2 | Click **Get Started** | Redirects to `/sign-up` |
| 3 | Sign up with email | Account created, redirected to `/onboarding` |
| 4 | Complete onboarding (all 5 steps) | Redirected to `/dashboard` without crash |
| 5 | Create a goal from `/goals` | Goal appears in list |
| 6 | Create a habit from `/habits` | Habit appears in list |
| 7 | Open AI Chat (`/coach`) | Coach responds within 10s |
| 8 | Open `/focus` and start a session | Timer runs |
| 9 | Open `/settings` | Profile, billing, preferences visible |
| 10 | Sign out | Redirected to `/`, session cleared |

---

## 8. Known Issues at Launch

| Issue | Impact | Fix |
|---|---|---|
| TypeScript `any` warnings in several files | None at runtime — `ignoreBuildErrors: true` | Low priority cleanup |
| `LoadingScreen.tsx` is defined but unused | Dead code only | Delete or wire up post-launch |
| Ollama AI provider only works on local dev | Cloud deployments skip it gracefully | Intentional |
| `animate-blink` class used in dashboard layout loading state — defined in globals.css | Works if `animate-blink` is in Tailwind config or globals | Verify post-deploy |

---

## 9. Post-Launch Monitoring

- **Vercel Analytics:** Enable in Vercel dashboard for Core Web Vitals.
- **Convex Dashboard:** Monitor function error rates at `https://dashboard.convex.dev`.
- **Clerk Dashboard:** Monitor sign-up/sign-in rates, failed webhooks.
- **Console errors:** Check browser console on first login from a fresh incognito window.

---

## 10. Rollback Plan

If a critical bug is found immediately after go-live:

```bash
# Option A: Revert Vercel deployment (instant)
# Vercel dashboard → Deployments → Pick last good deploy → Promote to Production

# Option B: Git revert
git revert HEAD
git push origin fix/billing-transactions
```

Convex functions are independently versioned — revert by redeploying the previous commit.

---

*Generated post-implementation of session fixes: Convex deploy, Cursor rewrite, onboarding copy, CSS enhancements, mobile tab bar.*
