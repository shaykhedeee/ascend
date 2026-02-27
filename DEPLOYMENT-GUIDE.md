# 🚀 RESURGO DEPLOYMENT GUIDE

**Complete step-by-step guide to deploy Resurgo from development to production**

Last Updated: February 27, 2026  
Target Launch: March 3, 2026  
Author: AI Assistant  
Status: PRODUCTION-READY

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Variables](#environment-variables)
4. [Convex Deployment](#convex-deployment)
5. [Clerk Authentication Setup](#clerk-authentication-setup)
6. [Stripe Payment Configuration](#stripe-payment-configuration)
7. [Domain Connection](#domain-connection)
8. [Vercel Production Deployment](#vercel-production-deployment)
9. [Post-Deployment Verification](#post-deployment-verification)
10. [Troubleshooting](#troubleshooting)

---

## 1. PREREQUISITES

### Required Software

- ✅ **Node.js** 18.17+ or 20.x  
  Check: `node --version`  
  Install: https://nodejs.org/

- ✅ **npm** 9+ or **pnpm** 8+  
  Check: `npm --version`  
  Install: Comes with Node.js

- ✅ **Git**  
  Check: `git --version`  
  Install: https://git-scm.com/

- ✅ **Vercel CLI** (optional but recommended)  
  Install: `npm install -g vercel`

### Required Accounts

- [x] GitHub account (for repo hosting)
- [x] Vercel account (for hosting)
- [x] Convex account (for backend)
- [x] Clerk account (for authentication)
- [x] Stripe account (for payments)
- [x] Groq account (for AI - FREE)
- [x] OpenRouter account (for AI - optional)
- [x] Hostinger domain (purchased: resurgo.app)

---

## 2. LOCAL DEVELOPMENT SETUP

### Step 1: Clone Repository

```bash
cd C:\Users\USER\Documents
git clone <your-repo-url> GOAKL_RTRACKER
cd GOAKL_RTRACKER
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected output:**
```
added 450+ packages in 30s
```

### Step 3: Create Environment File

```bash
copy .env.local.example .env.local
```

*(We'll fill this in the next section)*

### Step 4: Start Development Servers

**Terminal 1: Convex Backend**
```bash
npx convex dev
```

Wait for:
```
✓ Convex functions ready!
✓ Connected to https://[your-deployment].convex.cloud
```

**Terminal 2: Next.js Frontend**
```bash
npm run dev
```

Wait for:
```
▲ Next.js 14.2.35
- Local: http://localhost:3000
✓ Ready in 2.5s
```

### Step 5: Verify Local Setup

1. Open http://localhost:3000
2. You should see the Resurgo landing page
3. Click "ACCESS_TERMINAL" → redirects to sign-up (expected)

---

## 3. ENVIRONMENT VARIABLES

### Complete .env.local Configuration

Create/edit `c:\Users\USER\Documents\GOAKL RTRACKER\.env.local`:

```env
# ========================================
# CONVEX (Backend Database)
# ========================================
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# ========================================
# CLERK (Authentication)
# ========================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Clerk Webhook (for production)
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# ========================================
# STRIPE (Payments)
# ========================================
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# ========================================
# AI PROVIDERS
# ========================================
# Groq (Primary - FREE)
GROQ_API_KEY=your_groq_api_key_here
NEXT_PUBLIC_FREE_MODEL_GROQ=llama-3.1-8b-instant
NEXT_PUBLIC_PREMIUM_MODEL_GROQ=llama-3.3-70b-versatile

# OpenRouter (Fallback)
OPENROUTER_API_KEY=your_openrouter_key_here
NEXT_PUBLIC_FREE_MODEL_OPENROUTER=google/gemma-2-9b-it:free
NEXT_PUBLIC_PREMIUM_MODEL_OPENROUTER=anthropic/claude-3.5-sonnet

# Gemini (Optional)
NEXT_PUBLIC_FREE_MODEL_GEMINI=gemini-1.5-flash
NEXT_PUBLIC_PREMIUM_MODEL_GEMINI=gemini-1.5-pro

# ========================================
# EMAIL (Resend)
# ========================================
RESEND_API_KEY=re_xxxxx

# ========================================
# TELEGRAM BOT (Optional)
# ========================================
TELEGRAM_BOT_TOKEN=xxxxx:xxxxx-xxxxx
TELEGRAM_BOT_USERNAME=ResurgoBot
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=ResurgoBot

# ========================================
# ANALYTICS (Optional)
# ========================================
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=xxxxx

# ========================================
# APP CONFIGURATION
# ========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 4. CONVEX DEPLOYMENT

### Step 1: Sign Up / Login

1. Go to https://convex.dev
2. Sign in with GitHub
3. Create new project: "Resurgo Production"

### Step 2: Initialize Convex

```bash
npx convex dev
```

**First time setup:**
- Select: "Create new project"
- Project name: "resurgo-prod"
- Team: (your team name)
- Region: **EU-West-1** (closest to your users)

### Step 3: Deploy Schema

Convex will automatically deploy your schema from `convex/schema.ts`.

**Verify deployment:**
```bash
npx convex dashboard
```

Go to "Data" tab → You should see all 20+ tables:
- users
- goals
- tasks
- habits
- coachMessages
- coachMemory
- transactions
- focusSessions
- etc.

### Step 4: Production Deployment

```bash
npx convex deploy --prod
```

**Copy the production URL:**
```
✓ Deployed to production
URL: https://[your-name].convex.cloud
```

Update `.env.local`:
```env
CONVEX_DEPLOYMENT=prod:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://[your-name].convex.cloud
```

---

## 5. CLERK AUTHENTICATION SETUP

### Step 1: Create Clerk Application

1. Go to https://clerk.com/dashboard
2. Click "Create Application"
3. Application name: "Resurgo"
4. Enable: Email, Google, GitHub (social providers)
5. Click "Create"

### Step 2: Configure Redirect URLs

In Clerk Dashboard → Settings → Paths:

**After sign-up:** `/onboarding`  
**After sign-in:** `/dashboard`  
**Sign-in page:** `/sign-in`  
**Sign-up page:** `/sign-up`

### Step 3: Configure Allowed Domains

In Clerk Dashboard → Advanced → Allowlist:

Add:
- `http://localhost:3000` (development)
- `https://resurgo.app` (production)
- `https://www.resurgo.app` (production)
- `https://[your-vercel-preview].vercel.app` (previews)

### Step 4: Get API Keys

In Clerk Dashboard → API Keys:

Copy:
- **Publishable key:** `pk_test_xxxxx` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- **Secret key:** `sk_test_xxxxx` → `CLERK_SECRET_KEY`

### Step 5: Configure Webhooks

1. Clerk Dashboard → Webhooks → Add Endpoint
2. Endpoint URL: `https://resurgo.app/api/webhooks/clerk-billing`
3. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
   - `subscription.created`
   - `subscription.updated`
   - `subscription.deleted`
4. Copy signing secret → `CLERK_WEBHOOK_SECRET`

### Step 6: Enable Session Token Customization

Clerk Dashboard → Sessions → Customize session token:

```json
{
  "tier": "{{user.public_metadata.tier}}",
  "sub": "{{user.public_metadata.subscriptionStatus}}"
}
```

---

## 6. STRIPE PAYMENT CONFIGURATION

### Step 1: Create Stripe Account

1. Go to https://dashboard.stripe.com/register
2. Complete business verification
3. Activate account

### Step 2: Create Products

Stripe Dashboard → Products → Add Product:

**Product 1: Free Tier**
- Name: "Resurgo Free"
- Price: $0.00 / month
- Product ID: (copy this)

**Product 2: Pro Tier**
- Name: "Resurgo Pro"
- Price: $5.00 / month
- Price ID: (copy this) → Update `src/lib/stripe-config.ts`

### Step 3: Configure Webhook

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://resurgo.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy signing secret → `STRIPE_WEBHOOK_SECRET`

### Step 4: Get API Keys

Stripe Dashboard → Developers → API keys:

**Test mode:**
- Publishable key: `pk_test_xxxxx` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Secret key: `sk_test_xxxxx` → `STRIPE_SECRET_KEY`

**Production mode:**
- Switch to Live mode
- Copy keys (same env vars, use live keys)

### Step 5: Test Payment Flow

```bash
npm run dev
```

1. Sign up → `/onboarding`
2. Go to `/pricing`
3. Click "Upgrade to Pro"
4. Use test card: `4242 4242 4242 4242`
5. Any future date + any CVC
6. Verify: User tier updated in Convex `users` table

---

## 7. DOMAIN CONNECTION

### Step 1: Hostinger DNS Management

1. Log into Hostinger: https://hpanel.hostinger.com
2. Go to: Domains → resurgo.app → DNS / Name Servers

### Step 2: Configure DNS Records

**For Vercel:**

| Type  | Name | Value                | TTL  |
|-------|------|----------------------|------|
| A     | @    | 76.76.21.21         | 14400 |
| CNAME | www  | cname.vercel-dns.com | 14400 |

**Click "Save" or "Add Record"**

### Step 3: Verify DNS Propagation

```bash
# Windows Command Prompt
nslookup resurgo.app

# Expected output:
# Address: 76.76.21.21
```

**Note:** DNS propagation takes 1-24 hours. Check status:
- https://www.whatsmydns.net/#A/resurgo.app

---

## 8. VERCEL PRODUCTION DEPLOYMENT

### Step 1: Create Vercel Project

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import from GitHub repo
4. Framework Preset: **Next.js**
5. Root Directory: `./`
6. Build Command: `npm run build`
7. Output Directory: `.next`

### Step 2: Configure Environment Variables

Vercel Dashboard → Project → Settings → Environment Variables:

**Copy ALL variables from `.env.local`** EXCEPT:
- ❌ `NODE_ENV` (Vercel sets this automatically)
- ❌ `NEXT_PUBLIC_APP_URL` (will be auto-updated)

**Critical variables to add:**

```env
CONVEX_DEPLOYMENT=prod:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://[your-name].convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
GROQ_API_KEY=your_groq_api_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
```

**Environment:** Production, Preview, Development (select all)

### Step 3: Deploy

```bash
# Option A: Deploy from Dashboard
Click "Deploy" in Vercel Dashboard

# Option B: Deploy from CLI
vercel --prod
```

**Wait for deployment (~2-3 minutes)**

### Step 4: Add Custom Domain

1. Vercel Dashboard → Project → Settings → Domains
2. Add domain: `resurgo.app`
3. Add domain: `www.resurgo.app`
4. Vercel will automatically configure SSL (Let's Encrypt)

**Verify SSL:**
- https://resurgo.app → Should show green padlock
- https://www.resurgo.app → Should redirect to https://resurgo.app

### Step 5: Configure Production URLs

Update Clerk allowed domains:
- `https://resurgo.app`
- `https://www.resurgo.app`

Update Stripe webhook URL:
- `https://resurgo.app/api/webhooks/stripe`

Update Clerk webhook URL:
- `https://resurgo.app/api/webhooks/clerk-billing`

---

## 9. POST-DEPLOYMENT VERIFICATION

### Critical Path Checklist (30 minutes)

#### 1. Landing Page
- [ ] Visit https://resurgo.app
- [ ] Logo loads
- [ ] Custom cursor appears
- [ ] "ACCESS_TERMINAL" button works
- [ ] All sections render
- [ ] Footer links work

#### 2. Authentication
- [ ] Click "Sign Up"
- [ ] Create account with email
- [ ] Redirects to `/onboarding`
- [ ] Sign out
- [ ] Sign in with same credentials
- [ ] Redirects to `/dashboard`

#### 3. Onboarding Flow
- [ ] 6-step wizard loads
- [ ] Can input goal
- [ ] Can select life domains
- [ ] Can add habits
- [ ] Can set schedule
- [ ] Summary page shows correct data
- [ ] "Launch Dashboard" completes setup

#### 4. Dashboard
- [ ] Dashboard loads
- [ ] Today's date displayed
- [ ] Sidebar navigation works
- [ ] All 14 nav items accessible
- [ ] User menu works (top right)

#### 5. AI Coaches
- [ ] Go to `/coach`
- [ ] Select coach (e.g., MARCUS)
- [ ] Send message: "Help me stay consistent"
- [ ] Response appears within 5 seconds
- [ ] Response is contextual (not generic)
- [ ] Try different coach (e.g., AURORA)

#### 6. Goals
- [ ] Go to `/goals`
- [ ] Create new goal
- [ ] Goal appears in list
- [ ] Click goal → detail page loads
- [ ] Edit goal → changes save
- [ ] Mark goal complete → status updates

#### 7. Habits
- [ ] Go to `/habits`
- [ ] Create habit
- [ ] Daily frequency selected
- [ ] Habit appears with checkbox
- [ ] Click checkbox → streak increments
- [ ] Unclick → streak decrements

#### 8. Tasks
- [ ] Go to `/tasks`
- [ ] Create task
- [ ] Task appears in list
- [ ] Check task → status = done
- [ ] Task gets strikethrough styling

#### 9. Focus Sessions
- [ ] Go to `/focus`
- [ ] Set timer: 25 minutes
- [ ] Click "Start Session"
- [ ] Timer counts down
- [ ] Can pause timer
- [ ] Can end session early
- [ ] Session logs to history

#### 10. Payments (Critical)
- [ ] Go to `/pricing`
- [ ] Click "Upgrade to Pro"
- [ ] Stripe checkout page loads
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Payment succeeds
- [ ] Redirects to success page
- [ ] User tier = "pro" in Convex
- [ ] Dashboard shows "PRO_ACCESS"

### Performance Checks

```bash
# Run Lighthouse audit
npx lighthouse https://resurgo.app --output html --output-path ./lighthouse-report.html
```

**Target scores:**
- Performance: 90+
- Accessibility: 95+ (after fixes)
- Best Practices: 95+
- SEO: 95+

### Security Checks

- [ ] HTTPS enabled (green padlock)
- [ ] Security headers present (check: https://securityheaders.com)
- [ ] No API keys exposed in client bundle (check DevTools → Sources)
- [ ] CORS configured correctly
- [ ] Rate limiting works (try 10+ rapid requests)

### Error Handling

Test error scenarios:
- [ ] Network offline → shows error message
- [ ] Invalid API key → shows fallback UI
- [ ] 404 page: https://resurgo.app/nonexistent
- [ ] 500 error: Try invalid Convex query

---

## 10. TROUBLESHOOTING

### Build Fails: "Duplicate Routes"

**Error:**
```
You cannot have two parallel pages that resolve to the same path.
Please check /(marketing)/about/page and /about/page.
```

**Fix:**
```bash
Remove-Item -Path "src/app/about" -Recurse -Force
Remove-Item -Path "src/app/features" -Recurse -Force
Remove-Item -Path "src/app/privacy" -Recurse -Force
Remove-Item -Path "src/app/terms" -Recurse -Force
```

### Build Fails: "Failed to read source code... invalid UTF-8"

**Error:**
```
Error: Failed to read source code from [...]/page.tsx
Caused by: stream did not contain valid UTF-8
```

**Fix:**
```powershell
# Fix all TSX files
Get-ChildItem -Path "src" -Include "*.tsx" -Recurse | ForEach-Object {
  $content = Get-Content $_.FullName -Raw -Encoding UTF8
  [System.IO.File]::WriteAllText($_.FullName, $content, [System.Text.UTF8Encoding]::new($false))
}
```

### Convex Connection Issues

**Error:** "Failed to connect to Convex"

**Fixes:**
1. Check `.env.local` has correct `NEXT_PUBLIC_CONVEX_URL`
2. Verify deployment exists: `npx convex dashboard`
3. Restart dev server: `npm run dev`
4. Clear Next.js cache: `rm -rf .next`

### Clerk Authentication Loop

**Symptoms:** Redirects between `/sign-in` and `/dashboard` infinitely

**Fixes:**
1. Check Clerk webhook is receiving events
2. Verify `users` table in Convex has entry
3. Check `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard` in env
4. Clear browser cookies
5. Check Clerk Dashboard → Sessions → active session exists

### Stripe Webhook Not Firing

**Symptoms:** Payment succeeds but user tier doesn't update

**Fixes:**
1. Verify webhook URL: `https://resurgo.app/api/webhooks/stripe`
2. Check Stripe Dashboard → Webhooks → Event logs
3. Re-send failed event manually
4. Verify `STRIPE_WEBHOOK_SECRET` matches
5. Check Convex `users` table for tier update

### AI Coaches Not Responding

**Symptoms:** Loading spinner forever or "Failed to generate response"

**Fixes:**
1. Check `GROQ_API_KEY` in production env vars
2. Verify Groq API quota: https://console.groq.com/keys
3. Test fallback: Check `OPENROUTER_API_KEY`
4. Check Convex logs: `npx convex logs --tail`
5. Try alternate model: Update `NEXT_PUBLIC_FREE_MODEL_GROQ`

### Domain Not Resolving

**Symptoms:** https://resurgo.app shows "This site can't be reached"

**Fixes:**
1. Check DNS propagation: https://www.whatsmydns.net/#A/resurgo.app
2. Verify Hostinger DNS records
3. Verify Vercel domain configuration
4. Wait 24 hours for full DNS propagation
5. Try `nslookup resurgo.app` → should show 76.76.21.21

### Disk Space Issues During Build

**Error:** `ENOSPC: no space left on device`

**Fix (Local):**
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force
```

**Note:** This won't happen on Vercel (unlimited build resources)

---

## 🎯 FINAL PRE-LAUNCH CHECKLIST

### Code Quality
- [x] All accessibility violations fixed (text contrast WCAG AA)
- [x] TypeScript compiles without errors
- [x] No duplicate routes
- [x] UTF-8 encoding verified
- [ ] Lighthouse audit run (pending disk space)

### Configuration
- [ ] All environment variables set in Vercel
- [ ] Clerk webhook configured + verified
- [ ] Stripe webhook configured + verified
- [ ] Custom domain connected (resurgo.app)
- [ ] SSL certificate active

### Features Testing
- [ ] Authentication flow (sign up + sign in)
- [ ] Onboarding 6-step wizard
- [ ] AI Coaches (all 6 personas)
- [ ] Goals CRUD
- [ ] Habits tracking
- [ ] Tasks management
- [ ] Focus sessions
- [ ] Payment flow (Stripe checkout)

### Performance
- [ ] Initial page load < 3s
- [ ] Time to Interactive < 3s
- [ ] Largest Contentful Paint < 2.5s

### Security
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] API keys not exposed in client
- [ ] Rate limiting active
- [ ] Webhook signatures verified

### Marketing
- [ ] ProductHunt listing created
- [ ] Demo video uploaded
- [ ] Social posts queued
- [ ] Blog posts live
- [ ] Waitlist contacted

---

## 📞 SUPPORT & RESOURCES

### Official Docs
- **Next.js:** https://nextjs.org/docs
- **Convex:** https://docs.convex.dev
- **Clerk:** https://clerk.com/docs
- **Stripe:** https://stripe.com/docs
- **Vercel:** https://vercel.com/docs

### API Keys & Dashboards
- Convex: https://dashboard.convex.dev
- Clerk: https://dashboard.clerk.com
- Stripe: https://dashboard.stripe.com
- Groq: https://console.groq.com
- Vercel: https://vercel.com/dashboard

### Monitoring
- Vercel Analytics: https://vercel.com/[your-project]/analytics
- Convex Logs: `npx convex logs --tail`
- Stripe Dashboard: Real-time payment events
- Clerk Dashboard: Active sessions

---

## 🚀 LAUNCH DAY PROTOCOL (March 3, 2026)

### Pre-Launch (6 AM PST)
- [ ] Final production test (all features)
- [ ] Verify all webhooks active
- [ ] Check Convex deployment health
- [ ] Verify email sending (Resend)
- [ ] Post to ProductHunt (6:01 AM PST)

### Launch Day
- [ ] Monitor Vercel analytics
- [ ] Watch Convex logs for errors
- [ ] Track ProductHunt ranking
- [ ] Respond to PH comments
- [ ] Post launch tweets
- [ ] Email waitlist

### Post-Launch (Week 1)
- [ ] Daily analytics check
- [ ] Bug triage and patches
- [ ] User feedback collection
- [ ] Performance optimization
- [ ] Feature requests prioritization

---

## ✅ DEPLOYMENT COMPLETE

If you've followed this guide:

✅ Resurgo is deployed to production  
✅ Custom domain connected (resurgo.app)  
✅ All features tested and working  
✅ Payments configured  
✅ AI coaches operational  
✅ Ready to launch

**Next Steps:**
1. Complete final pre-launch checklist above
2. Run Lighthouse audit
3. Test payment flow with real card
4. Prepare ProductHunt launch (March 3, 6 AM PST)

---

**Questions? Issues? Found a bug?**  
Document in: `DEPLOYMENT-ISSUES.md`  
Or check: `TROUBLESHOOTING.md`

**Good luck with launch! 🚀**
