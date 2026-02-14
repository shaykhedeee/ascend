# ASCEND by Webness — Complete Setup & Deployment Guide

> **Last updated**: February 2026  
> This guide covers everything you need to do manually to get ASCEND fully running in production.

---

## Table of Contents

1. [Architecture Overview — What's What](#1-architecture-overview)
2. [Do You Need WorkOS?](#2-do-you-need-workos)
3. [Do You Need Convex?](#3-do-you-need-convex)
4. [Clerk Setup — Step by Step](#4-clerk-setup)
5. [Convex Setup — Step by Step](#5-convex-setup)
6. [Vercel Deployment](#6-vercel-deployment)
7. [Environment Variables Reference](#7-environment-variables)
8. [Custom Domain Setup](#8-custom-domain)
9. [Post-Deployment Checklist](#9-post-deployment-checklist)
10. [Cost Breakdown](#10-cost-breakdown)

---

## 1. Architecture Overview

ASCEND is a **Next.js 14** app with this stack:

| Layer | Technology | What It Does | Free Tier |
|-------|-----------|-------------|-----------|
| **Frontend** | Next.js 14 + React 18 + Tailwind CSS | UI and pages | Unlimited (open source) |
| **Auth** | Clerk | Sign-up, sign-in, user management | 10,000 MAU free |
| **Database** | Convex | Real-time data storage (habits, goals, tasks) | 1GB storage, 25K function calls/day free |
| **AI** | Groq / Gemini / OpenRouter | Goal decomposition, suggestions, chatbot | Groq: 14,400 req/day. Gemini: 1,500 req/day |
| **Hosting** | Vercel | Deployment, CDN, serverless functions | 100GB bandwidth, unlimited deploys |
| **State** | Zustand | Client-side UI state management | N/A (in-browser) |

**How data flows:**
```
User → Clerk (authentication) → Next.js (app) → Convex (database)
                                              → Groq/Gemini (AI features)
```

---

## 2. Do You Need WorkOS?

**NO. WorkOS has been completely removed.** 

WorkOS was the previous auth provider. It has been fully replaced by Clerk. There is zero WorkOS code remaining in the app. You do not need a WorkOS account.

---

## 3. Do You Need Convex?

**YES — but it's already set up, and the free tier is generous enough.**

### Why Convex (vs. alternatives)?

| Option | Pros | Cons |
|--------|------|------|
| **Convex** (current) | Real-time sync, built-in auth integration with Clerk, no SQL needed, great DX | Vendor lock-in, proprietary query language |
| **Supabase** | PostgreSQL, more traditional, open-source | More setup work, need to wire auth manually |
| **PlanetScale** | MySQL, familiar SQL | No real-time, more boilerplate |
| **Firebase** | Real-time, Google ecosystem | Expensive at scale, complex pricing |

**Recommendation: Keep Convex.** It's already integrated, the free tier gives you 1GB storage + 25K function calls/day, and it handles real-time sync with Clerk JWT auth out of the box. Switching databases would require rewriting ~10 files (all the convex/*.ts files + hooks).

### Your Convex Project
- **Deployment**: `dev:spotted-akita-320`
- **URL**: `https://spotted-akita-320.eu-west-1.convex.cloud`
- **Region**: EU West 1
- **Dashboard**: https://dashboard.convex.dev

---

## 4. Clerk Setup — Step by Step

Clerk handles all authentication. Here's what you need to do in the Clerk Dashboard:

### 4.1 Verify Your Clerk Application

1. Go to: https://dashboard.clerk.com
2. Sign in with your account
3. You should see your ASCEND application

### 4.2 Create the Convex JWT Template ⚠️ CRITICAL

This is the step that connects Clerk auth to your Convex database. **Without this, authenticated users can't read/write data.**

1. In Clerk Dashboard → **JWT Templates** (left sidebar)
2. Click **"New template"**
3. Select **"Convex"** from the template list
4. The template name MUST be exactly: `convex`
5. Click **"Create"**
6. Copy the **Issuer URL** shown (it looks like `https://awaited-kitten-8.clerk.accounts.dev`)

### 4.3 Set Up Sign-In Methods

1. Clerk Dashboard → **User & Authentication** → **Email, phone, username**
2. Enable what you want:
   - ✅ Email address (recommended)
   - ✅ Google OAuth (easy social login)
   - Optional: GitHub, Apple, etc.

### 4.4 Customize Appearance (Optional)

1. Clerk Dashboard → **Customization** → **Branding**
2. Set your brand colors (orange: #F97316)
3. Upload your logo
4. Toggle "Remove Secured by Clerk" branding (requires paid plan)

### 4.5 Set Redirect URLs

1. Clerk Dashboard → **Paths** (or **URLs** depending on version)
2. Set:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in redirect: `/`
   - After sign-up redirect: `/`

---

## 5. Convex Setup — Step by Step

### 5.1 Set the Clerk Issuer Domain in Convex

This tells Convex how to verify Clerk's JWT tokens.

**Option A — Via Convex Dashboard:**
1. Go to: https://dashboard.convex.dev
2. Select your project (`spotted-akita-320`)
3. Go to **Settings** → **Environment Variables**
4. Add: `CLERK_JWT_ISSUER_DOMAIN` = the Issuer URL from step 4.2
   - Example: `https://awaited-kitten-8.clerk.accounts.dev`

**Option B — Via CLI:**
```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN https://awaited-kitten-8.clerk.accounts.dev
```

### 5.2 Deploy Convex Functions

After setting the env var, deploy the Convex functions:
```bash
npx convex deploy --prod
```

This pushes your schema and functions (habits.ts, goals.ts, tasks.ts, etc.) to the Convex cloud.

### 5.3 Verify Convex is Working

1. Go to Convex Dashboard → **Data**
2. You should see your tables: users, goals, habits, tasks, etc.
3. After a user signs in via Clerk, they should appear in the `users` table

---

## 6. Vercel Deployment

### 6.1 Your Vercel Project

- **Project ID**: `prj_YJEDUnGkp5bAbnDUwcOq2sqPGHjA`
- **URL**: https://ascend-ashen-seven.vercel.app
- **Team**: webness-projects

### 6.2 Connect GitHub Repo

1. Go to: https://vercel.com/webness-projects-94871add/ascend/settings
2. Under **Git** → Connect to: `shaykhedeee/ascend`
3. Set:
   - Framework Preset: **Next.js**
   - Root Directory: `.` (default)
   - Build Command: `npx next build` (default)
   - Output Directory: `.next` (default)

### 6.3 Set Environment Variables in Vercel

Go to: Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

Add ALL of these (Production + Preview + Development):

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | (from Clerk Dashboard → API Keys) | Your Clerk publishable key |
| `CLERK_SECRET_KEY` | (from Clerk Dashboard → API Keys) | Your Clerk secret key |
| `CLERK_JWT_ISSUER_DOMAIN` | (from step 4.2) | Clerk JWT issuer URL |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` | |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` | |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | `/` | |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | `/` | |
| `NEXT_PUBLIC_CONVEX_URL` | `https://spotted-akita-320.eu-west-1.convex.cloud` | |
| `CONVEX_DEPLOYMENT` | `dev:spotted-akita-320` | |
| `GROQ_API_KEY` | (your key) | Server-side only |
| `GOOGLE_AI_STUDIO_KEY` | (your key) | Server-side only |
| `OPENROUTER_API_KEY` | (your key) | Server-side only |
| `AIML_API_KEY` | (your key) | Server-side only |
| `NEXT_PUBLIC_AI_PROVIDER` | `groq` | |
| `NEXT_PUBLIC_AI_ENABLED` | `true` | |
| `NEXT_PUBLIC_PUTER_ENABLED` | `true` | |
| `NEXT_PUBLIC_APP_NAME` | `ASCEND` | |
| `NEXT_PUBLIC_APP_URL` | `https://ascend-ashen-seven.vercel.app` | |
| `NEXT_PUBLIC_SITE_URL` | `https://ascend-ashen-seven.vercel.app` | |

### 6.4 Add Vercel URL to Clerk

1. Clerk Dashboard → **Domains**
2. Add your Vercel URL: `ascend-ashen-seven.vercel.app`
3. If using a custom domain later, add that too

### 6.5 Deploy

After connecting GitHub and setting env vars:
- Every push to `main` auto-deploys
- Or trigger manually: Vercel Dashboard → **Deployments** → **Redeploy**

---

## 7. Environment Variables

### What goes where?

| Variable Prefix | Where it runs | Visible to users? |
|----------------|---------------|-------------------|
| `NEXT_PUBLIC_*` | Client + Server | **YES** — never put secrets here |
| No prefix | Server only | **NO** — safe for API keys |

### Security Note

The AI API keys (`GROQ_API_KEY`, `GOOGLE_AI_STUDIO_KEY`, etc.) are **server-side only**. They are called through Next.js API routes (`/api/ai/chat`, `/api/ai/decompose`, `/api/ai/suggestions`), not directly from the browser.

---

## 8. Custom Domain Setup

### Option A: Vercel Custom Domain (Recommended)

1. Vercel Dashboard → Settings → **Domains**
2. Add: `ascend.webness.in`
3. Vercel will give you DNS records to add
4. In your Hostinger DNS panel, add:
   - **CNAME**: `ascend` → `cname.vercel-dns.com`
   - Or **A record**: `ascend` → `76.76.21.21`
5. Wait for DNS propagation (5-30 minutes)
6. Update Clerk Dashboard → Domains → add `ascend.webness.in`

### Option B: Hostinger VPS (Not recommended for now)

You don't need Hostinger VPS for hosting. Vercel's free tier is more than enough:
- Unlimited deployments
- 100GB bandwidth/month
- Automatic SSL
- Global CDN
- Zero server management

**Save Hostinger for** when you need to run custom backend services, cron jobs, or hit Vercel's limits.

---

## 9. Post-Deployment Checklist

### Must Do Before Go-Live

- [ ] **Clerk JWT Template**: Create "convex" JWT template in Clerk Dashboard
- [ ] **Convex env var**: Set `CLERK_JWT_ISSUER_DOMAIN` in Convex Dashboard
- [ ] **Deploy Convex**: Run `npx convex deploy --prod`
- [ ] **Vercel env vars**: Add all env vars listed in section 6.3
- [ ] **Connect GitHub**: Link `shaykhedeee/ascend` to Vercel project
- [ ] **Test sign-up flow**: Create a test account, verify it shows in Clerk Dashboard
- [ ] **Test data persistence**: Create a habit, verify it appears in Convex Dashboard
- [ ] **Test AI features**: Try goal decomposition, verify AI API is working

### Nice to Have

- [ ] Add custom domain (`ascend.webness.in`) in Vercel
- [ ] Update Clerk domain settings for custom domain
- [ ] Set up Google Analytics (optional)
- [ ] Add Open Graph image (`/og-image.png`) for social sharing
- [ ] Switch to Clerk production keys when ready for real users
- [ ] Remove "Secured by Clerk" branding (Clerk paid plan)

---

## 10. Cost Breakdown

### Free Tier (What you have now)

| Service | Free Limits | Enough for? |
|---------|------------|-------------|
| **Clerk** | 10,000 MAU, unlimited sign-ins | ~10K users/month |
| **Convex** | 1GB storage, 25K function calls/day | ~500+ daily active users |
| **Vercel** | 100GB bandwidth, unlimited deploys | ~50K page views/month |
| **Groq AI** | 14,400 requests/day | ~14K AI uses/day |
| **Gemini AI** | 1,500 requests/day | Backup provider |

**Total cost to launch: $0/month**

### When You'll Need to Pay

| Trigger | Service | Cost |
|---------|---------|------|
| >10K users/month | Clerk Pro | $25/month |
| >1GB stored data | Convex Pro | $25/month |
| >100GB bandwidth | Vercel Pro | $20/month |
| Custom branding | Clerk Pro | Included in $25 |

### Revenue vs. Cost

With ASCEND's pricing (Free / $9 Pro / $149 Lifetime):
- 3 Pro subscribers = covers Clerk Pro
- 6 Pro subscribers = covers all infrastructure
- You're profitable with ~10 paying users

---

## Quick Reference — Key URLs

| What | URL |
|------|-----|
| Your App | https://ascend-ashen-seven.vercel.app |
| Clerk Dashboard | https://dashboard.clerk.com |
| Convex Dashboard | https://dashboard.convex.dev |
| Vercel Dashboard | https://vercel.com/webness-projects-94871add/ascend |
| GitHub Repo | https://github.com/shaykhedeee/ascend |

---

## Architecture Decision Record

### Why Clerk over WorkOS?

WorkOS was removed because:
1. Clerk has better Next.js App Router support with `clerkMiddleware()`
2. Pre-built `<SignIn />`, `<SignUp />`, `<UserButton />` components
3. Native Convex integration (`ConvexProviderWithClerk`)
4. Free tier is 10x more generous (10K vs 1K MAU)
5. Better developer experience and documentation

### Why Convex over alternatives?

Convex was kept because:
1. Already fully integrated (10+ files)
2. Real-time sync out of the box (no WebSocket setup)
3. Built-in JWT auth with Clerk (just configure and it works)
4. Schema validation at the database level
5. Free tier is generous for an early-stage app
6. Switching would require rewriting the entire data layer

### Why Vercel over Hostinger?

Vercel is recommended for now because:
1. **Zero-config deployment** — push to GitHub, it deploys
2. **Free SSL** — automatic HTTPS
3. **Edge network** — fast globally
4. **Serverless functions** — API routes just work
5. **No server management** — no SSH, no PM2, no Nginx
6. Custom domain support (add `ascend.webness.in` as CNAME)

Hostinger would require:
- VPS plan ($8+/month)
- Manual Node.js + PM2 + Nginx setup
- Manual SSL with Certbot
- Manual deployments or CI/CD pipeline
- More things to break and maintain

→ **Use Vercel now, consider Hostinger only if you need specific server-side capabilities.**
