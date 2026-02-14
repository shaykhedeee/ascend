# ASCEND - Master TODO List
## Complete Development Roadmap for Launch-Ready App

**Last Updated**: June 2025 Session
**Status**: 🟢 Active Development — Build Passing, Zero Lint Errors

---

## ✅ COMPLETED TASKS

### Phase 1: Core Infrastructure
- [x] TypeScript configuration fixes (forceConsistentCasingInFileNames)
- [x] Security headers in next.config.js (CSP, HSTS, X-Frame-Options, etc.)
- [x] PWA configuration with service worker
- [x] Error boundary implementation
- [x] Sentry error tracking integration
- [x] Reduced motion CSS for accessibility

### Phase 2: Pro-Level Features (NEW)
- [x] **GlobalSearch Component** (~600 lines)
  - Notion-style Cmd+K command palette
  - Fuzzy search across habits, goals, tasks, commands
  - Keyboard navigation with arrow keys
  - Recent searches
  - Search by category

- [x] **KeyboardShortcuts Component** (~425 lines)
  - Comprehensive keyboard navigation
  - Help modal (press ?)
  - Number keys 1-8 for quick navigation
  - Ctrl+K for search, Ctrl+N for new habit, etc.
  - Context provider for global access

- [x] **TemplateLibrary Component** (~800 lines)
  - 25 pre-built habit templates
  - 10 goal templates
  - Category filtering
  - Search functionality
  - Multi-select and bulk add

- [x] **Accessibility Utilities**
  - Skip links for keyboard users
  - Focus trap for modals
  - Screen reader announcements
  - usePrefersReducedMotion hook

### Phase 3: Landing Page Enhancements
- [x] ADHD/Neurodivergent-focused section
  - Micro-task breakdown highlight
  - Pomodoro timer feature
  - Dopamine-friendly rewards
  - Streak protection showcase
  
- [x] Competitor comparison table
  - ASCEND vs Habitica vs Streaks vs Todoist
  - Feature-by-feature breakdown
  - Pricing comparison

- [x] Enhanced features section
- [x] Trust signals and stats
- [x] SEO-optimized FAQ with Schema.org markup

### Phase 4: Integration
- [x] Main page.tsx updated with all new components
- [x] Keyboard shortcuts integrated throughout
- [x] Global search accessible via Cmd+K
- [x] Template library accessible via Ctrl+T

---

## ✅ COMPLETED THIS SESSION

### Accessibility & UX
- [x] Fixed ARIA attributes — added `role="tabpanel"`, `aria-label`, screen reader live region
- [x] Added 44px minimum tap targets for mobile
- [x] Smooth scroll containers with touch-action support
- [x] Theme transition animation (0.35s ease on toggle)

### New Components Created
- [x] **WeeklyReview.tsx** (~890 lines) — 7-step weekly review wizard
  - Overview stats → Wins → Challenges → Habit breakdown → Goals → Plan → Summary
  - Awards 75 XP on completion
  - Integrated into page.tsx and Sidebar
- [x] **useNotifications.ts** (~210 lines) — Push notification client hook
  - Permission management, scheduling, recurring reminders
  - Service worker integration, localStorage persistence
  - Preset notification messages
- [x] **Celebration animations** — ConfettiBurst (40 CSS particles) + GoalCelebration (full-screen trophy modal)

### Performance Optimization
- [x] Dynamic imports for 9 heavy modal components (next/dynamic, ssr: false)
  - GoalWizard, AddHabitModal, SettingsModal, ProfileModal, GlobalSearch,
    TemplateLibrary, PaymentCheckout, WeeklyReview, WellnessCenter
- [x] CSS-only confetti animations (no JS animation libraries needed)

### Code Quality
- [x] **Zero lint errors** (down from 200+ errors)
- [x] Fixed unused imports across 40+ component files
- [x] Fixed unescaped entities across 20+ files
- [x] Fixed unused variables across 15+ files
- [x] ESLint config: added `_` prefix ignore pattern for intentionally unused vars
- [x] Fixed `require()` → ES import in utils.ts
- [x] Fixed ConvexClientProvider WorkOS auth token integration
- [x] Excluded `clerk-nextjs` subfolder from TypeScript compilation
- [x] **Production build passes** — all routes compile successfully

### Session 2 — Quick Wins & Feature Gaps
- [x] **ContributionHeatmap.tsx** (~300 lines) — GitHub-style 52-week activity grid
  - 5-level color coding (none → perfect), dark/light theme, navigation, hover tooltips
  - Stats bar: current streak, longest streak, active days, perfect days
- [x] **Haptic feedback** — `navigator.vibrate()` on habit & task completion (light/medium/heavy/success patterns)
  - `completionFeedback()` combines sound + haptic, wired into store's `toggleHabitEntry` and `completeTask`
- [x] **Streak celebrations** — Store now tracks `currentStreak` / `longestStreak` on all-habits-complete days
  - Milestone detection at 7/14/21/30/60/90/100/180/365 days with bonus XP (100 or 500)
  - `StreakCelebration` UI component auto-triggered via `streakCelebrationPending` flag
- [x] **CSV export** — `exportToCSV()` added to export.ts
  - Exports habit entries, goals summary, and habits summary with proper CSV escaping
- [x] **Daily notification scheduling** — `useNotifications` wired into page.tsx
  - Auto-schedules morning & evening reminders based on user preferences after onboarding

### Session 3 — Full SEO Implementation
- [x] **`/pricing` page** — 3-tier pricing cards (Free/Pro/Lifetime), feature comparison table, FAQ, JSON-LD
- [x] **`/features` page** — 5 feature categories with 16 individual features, competitor comparison table, JSON-LD
- [x] **`/about` page** — Mission statement, values grid, journey timeline, stats section, JSON-LD
- [x] **Sitemap updated** — Added /pricing, /features, /about, /support with correct priorities
- [x] **Billing page metadata** — Added SEO metadata + noindex robot directive
- [x] **Support layout metadata** — Added metadata via layout.tsx for client component page
- [x] **Landing page footer** — Updated links to /features, /pricing, /about (crawlable hrefs)
- [x] **WCAG AA contrast fixes** — Bumped muted text color for 4.5:1+ ratio in both themes
- [x] **DemoPlanGenerator** — Animated onboarding plan preview component
- [x] **Unit tests** — Jest + React Testing Library, 35 tests covering utils, store, export
- [x] **Build verified** — 37 pages compiled, zero errors

---

## 📋 TODO - DEVELOPER TASKS

### High Priority
- [x] Add unit tests for new components ✅ (Jest + React Testing Library — 35 tests passing)
- [ ] Add E2E tests with Playwright/Cypress
- [ ] Performance audit with Lighthouse
- [x] Bundle size optimization ✅ (next/font, dynamic imports, tree shaking)
- [x] Image optimization ✅ (N/A — app uses SVG icons only, no raster images)

### Medium Priority
- [ ] Add data sync/backup to cloud (optional Pro feature)
- [x] Implement push notifications ✅ (useNotifications hook + SW integration)
- [x] Add more habit templates (30+ templates with scientific basis)
- [x] Add goal templates for common scenarios (15+ goal templates)
- [x] Implement habit streaks leaderboard
- [x] Add social sharing improvements
- [x] Template Library V2 with import/export
- [x] Custom template creation

### Low Priority
- [x] Add dark/light theme toggle animation ✅ (smooth 0.35s transition)
- [x] Add more celebration animations ✅ (ConfettiBurst + GoalCelebration)
- [ ] Implement habit insights with ML
- [ ] Add voice commands for habit tracking
- [ ] Implement widgets for mobile PWA

---

## 📋 TODO - BUSINESS/OWNER TASKS

### Pre-Launch
- [ ] Set up Stripe account for payments
- [ ] Configure payment webhook endpoints
- [ ] Create demo video for landing page
- [ ] Write blog posts for SEO
- [ ] Set up analytics (Google Analytics / Plausible)
- [ ] Create social media accounts
- [ ] Prepare press kit

### Marketing
- [ ] Submit to ProductHunt
- [ ] Submit to Hacker News
- [ ] Create launch tweet thread
- [ ] Reach out to productivity bloggers
- [ ] Create YouTube tutorial videos

### Legal
- [ ] Review privacy policy
- [ ] Review terms of service
- [ ] Ensure GDPR compliance
- [ ] Add cookie consent if needed

---

## 🎯 LAUNCH CHECKLIST

### Technical
- [x] Build passing without errors
- [x] Security headers configured
- [x] PWA manifest configured
- [x] Error tracking set up
- [x] SEO metadata + JSON-LD structured data
- [x] Sitemap with all routes (37 pages)
- [x] Robots.txt configured
- [x] next/font optimization (no render-blocking requests)
- [x] Dynamic imports for code splitting (9 components)
- [ ] Performance score > 90 (Lighthouse audit pending)
- [ ] Accessibility score > 90 (Lighthouse audit pending)
- [ ] SEO score > 90 (Lighthouse audit pending)

### Content
- [x] Landing page complete
- [x] Features page (/features)
- [x] Pricing page (/pricing)
- [x] About page (/about)
- [x] FAQ section (landing page + support page)
- [x] Privacy policy page
- [x] Terms of service page
- [x] Help center (5 categories)
- [x] Guides section (6 guides)

### Infrastructure
- [ ] Domain configured
- [ ] SSL certificate
- [ ] CDN configured
- [ ] Database backups (if using cloud)
- [ ] Monitoring/alerts set up

---

## 🔧 KNOWN ISSUES

### Linting Warnings (Non-Critical)
- ✅ **Zero ESLint errors** — All errors resolved
- Remaining warnings are `no-explicit-any` (non-blocking) and `react-hooks/exhaustive-deps` (intentional)
- CSS `@apply` linter warnings (~41) are false positives from CSS linter not understanding Tailwind

### Browser Compatibility
- Test on Safari iOS for PWA install prompt
- Test on older Android browsers

---

## 📊 METRICS TO TRACK POST-LAUNCH

1. **User Acquisition**
   - Daily/Weekly/Monthly active users
   - Sign-up conversion rate
   - Source of traffic

2. **Engagement**
   - Habits created per user
   - Daily habit completion rate
   - Streak averages
   - Session duration

3. **Retention**
   - Day 1, Day 7, Day 30 retention
   - Churn rate
   - Feature usage stats

4. **Revenue** (Pro users)
   - Conversion to Pro rate
   - Monthly recurring revenue
   - Lifetime value

---

## 🏆 SUCCESS CRITERIA

- [ ] 1,000 users in first month
- [ ] 4.5+ star rating on app stores
- [ ] < 2% daily churn rate
- [ ] > 60% day 7 retention
- [ ] 100+ Pro subscribers in first 3 months

---

## NOTES

### Competitor Insights Applied
Based on competitive analysis of Notion, Todoist, Habitica, and Streaks:
- Added Notion-style command palette (GlobalSearch)
- Added comprehensive keyboard shortcuts
- Enhanced gamification elements
- Added ADHD-friendly features
- Added template library for quick start

### Architecture Decisions
- Zustand for state management (simpler than Redux)
- Local-first data storage (privacy-focused)
- PWA for cross-platform support
- Next.js for SEO and performance

---

*This document should be updated as tasks are completed or new requirements emerge.*



# Role: Senior Product Architect & Full-Stack Engineer (Next.js/Convex Expert)

## Project: "Ascend" – The Identity-Based Growth OS
We are building a premium, high-performance habit tracking application called **Ascend**.
Unlike basic trackers (Streaks, Habitify) that just let users "check boxes," Ascend focuses on **Identity Building** (James Clear's *Atomic Habits* philosophy) and **Flow State** (Mihaly Csikszentmihalyi). It links small daily actions to larger life goals.

## 1. The Stack (Strict Constraints)
* **Framework:** Next.js 15 (App Router, Turbo).
* **Backend & Database:** **Convex** (Real-time database, cron jobs, internal functions). *Do not use Prisma/Postgres. We are going 100% Serverless/Real-time.*
* **Auth:** **Clerk** (User management, OAuth, Multi-session).
* **Billing:** **Clerk Billing** (Stripe integration for Subscriptions).
* **UI System:** **Shadcn/ui** (Radix Primitives) + **Tailwind CSS**.
* **Font:** `Geist Sans` + `Geist Mono` (Vercel).
* **Hosting:** Hostinger VPS (Node.js runtime).

## 2. Competitive Analysis & "Ascend" Edge
I have studied Akiflow, Toggl, and Reclaim. Here is how Ascend defeats them:
* **Vs. Akiflow:** Akiflow is for *tasks*. Ascend is for *lifestyle design*. We don't just clear a todo list; we build streaks.
* **Vs. Toggl:** Toggl is for *time accounting*. Ascend is for *consistency*. We focus on "Did you show up?" vs "How long did it take?".
* **The "Ascend" Secret Sauce:**
    1.  **The Heatmap Garden:** Instead of a list, the dashboard is a GitHub-style contribution graph for your life. Green squares = growth.
    2.  **Mode-Based Tracking:** Users can toggle "Focus Mode" (only show morning habits) vs "Review Mode" (show all stats).
    3.  **The "Why" Prompt:** When creating a habit, the user *must* answer "Who do I become by doing this?" (e.g., "I become a Runner"). This is displayed on the card to reinforce identity.

## 3. Database Schema (Convex `schema.ts`)
You must define the following tables in Convex:
* `users`: Syncs with Clerk `user.id`. Stores `premiumStatus`, `timezone`, `theme`.
* `goals`: The "North Star" (e.g., "Run a Marathon"). Parent to habits.
* `habits`: The daily action. Fields: `title`, `frequency` (daily/weekly/custom), `timeOfDay` (morning/noon/night), `identityLabel` (e.g., "Runner"), `goalId`.
* `logs`: The individual completion records. Fields: `habitId`, `date` (ISO string), `status` (completed/skipped/failed), `mood` (1-5 scale attached to the log).
* `journal`: Optional text entry attached to a `log` for reflection.

## 4. User Flow & UX Journey
**Phase 1: The "Commitment" (Onboarding)**
* User signs up via Clerk (Google/Email).
* **Screen 1:** "What is one identity you want to build?" (Input: "Writer", "Athlete").
* **Screen 2:** "What is one small proof of that identity?" (Input: "Write 100 words").
* **Screen 3:** "When will you do it?" (Time picker).
* *Result:* User lands on dashboard with their first habit pre-populated.

**Phase 2: The "Climb" (Dashboard)**
* **Header:** "Good Morning, [Name]. You are 80% consistent this week."
* **Main View:** A clean, card-based list of *today's* active habits.
    * *Interaction:* Click card -> Satisfying "ripple" animation -> Card turns green.
    * *Undo:* Long press to uncheck (prevents accidental clicks).
* **Sidebar:** Navigation to "Analytics", "Goals", "Billing".

**Phase 3: The "Review" (Analytics)**
* Monthly calendar view showing streaks.
* "Completion Rate" charts (Recharts or Visx).
* **AI Insight:** "You miss your 'Read Book' habit 40% more often on Fridays. Should we move it to Saturday morning?"

## 5. Technical Implementation Roadmap
**Step 1: The Nervous System (Auth + DB)**
* Configure `convex/auth.config.js` to trust Clerk.
* Create a `ConvexProviderWithClerk` wrapper in `app/ConvexClientProvider.tsx`.
* **Critical:** Implement `clerkMiddleware()` to protect `/dashboard` and `/journal`. Public pages: `/`, `/pricing`.

**Step 2: The Core (Habit Engine)**
* Build the `HabitCard` component. Use `framer-motion` for the completion animation.
* Create Convex mutations: `api.habits.create`, `api.logs.toggle`.
* *Performance:* Use `useQuery` with optimistic updates so the UI feels instant, even on slow networks.

**Step 3: The AI Coach (DeepSeek/OpenAI)**
* Create a Convex Action `api.ai.generateInsight`.
* It reads the user's last 30 days of `logs`.
* It generates a 1-sentence tip: "Great streak on Running! Try increasing duration by 5 mins this week."

**Step 4: Billing (Clerk + Stripe)**
* Create a Pricing Page using Clerk's pre-built `<PricingTable />`.
* **Logic:**
    * Free Plan: Max 3 active habits.
    * Ascend Pro ($5/mo): Unlimited habits, AI Insights, Dark Mode, CSV Export.
    * *Check:* In `api.habits.create`, query the user's plan. If Free && count >= 3, throw `PlanLimitError`.

## 6. Design System (Shadcn + Tailwind)
* **Palette:**
    * Primary: Deep Indigo (`bg-indigo-600`) - representing "Focus".
    * Success: Emerald Teal (`text-teal-500`) - representing "Growth".
    * Background: Slate-50 (`bg-slate-50`) for light mode, Slate-950 for dark mode.
* **Typography:** Large, bold headings for Goals. Small, mono-spaced fonts for data/stats.

## 7. Your Order
Start by setting up the **folder structure** and the **Convex Schema**.
Once confirmed, move to the **Clerk Integration**.
Do not write the frontend until the backend data structure is perfect.
Reflect on the "Ascend" philosophy in every variable name (e.g., use `streakCurrent` instead of `count`).

# SYSTEM PROMPT: Project Vantage - Professional Habit & Goal Orchestration

You are an expert Full-Stack Engineer specializing in the "C3 Stack": Clerk, Convex, and Clean UI (Shadcn). Your task is to build "Vantage," a high-end habit-tracking and goal-setting SaaS.

## 1. CORE ARCHITECTURE & STACK
- Framework: Next.js 14+ (App Router, Server Components)
- Backend/Database: Convex (Real-time, Type-safe)
- Authentication: Clerk (Middleware protection, User Sync)
- UI: Tailwind CSS, Shadcn/UI, Lucide Icons, Framer Motion (for subtle professional transitions)
- Billing: Clerk Billing (Stripe integration)
- Deployment: Hostinger (Node.js VPS or Static build)

## 2. DATA MODEL (Convex Schema)
- `users`: clerkId (indexed), email, subscriptionStatus (free/pro), onboardingComplete (boolean).
- `habits`: userId, name, description, frequency (daily/weekly/cron), color, icon, reminderTime, isActive, streakCount.
- `habitLogs`: habitId, userId, completedAt (timestamp), status (completed/skipped).
- `goals`: userId, title, deadline, status (active/achieved), linkedHabits (array of IDs).
- `insights`: userId, aiGeneratedSummary, lastAnalyzedAt.

## 3. USER FLOW & UX STRUCTURE
- L0 (Landing): Professional, minimal hero section. "Systems over Goals."
- L1 (Auth): Clerk hosted Flow.
- L2 (Onboarding): 3-step wizard. 1) Define 3 Life Pillars (e.g., Health, Wealth, Mindset). 2) Create first habit for each. 3) Choose Plan.
- L3 (The Command Center):
    - Left Sidebar: Navigation (Dashboard, Habits, Goals, Insights, Settings).
    - Top Bar: "Flow State" toggle (hides distractions), User Button.
    - Main View: A "Today" focus view using a Column-based layout.
    - Right Panel (Contextual): AI Coaching tips based on current habit performance.

## 4. FEATURE SPECIFICATIONS
- Habit Stacking: Users can link habits (e.g., "After [Meditation], do [Journaling]").
- Professional Heatmaps: Use a GitHub-style activity grid for habit consistency, but with a refined color palette (Zinc/Slate).
- Smart Reminders: Clerk-based session handling with Convex scheduled functions for notifications.
- AI Integration (The "Vantage Point"):
    - Analyze `habitLogs` to identify "Danger Zones" (e.g., "You usually fail your workout on Tuesdays").
    - Suggest habit adjustments based on goal deadlines.

## 5. FILE STRUCTURE REQUIREMENTS
/app
  /(auth)         # Sign-in/Sign-up routes
  /(dashboard)    # Protected routes using clerkMiddleware
    /habits       # Habit management
    /goals        # Goal tracking
    /billing      # Clerk <PricingTable /> and billing management
  /api            # Webhooks for Clerk/Stripe
/components
  /ui             # Shadcn components
  /dashboard      # Feature-specific components (HabitCard, GoalProgress)
  /shared         # Layout, Sidebar, Header
/convex
  schema.ts       # Database definitions
  habits.ts       # Mutations and Queries
  users.ts        # User sync logic
  crons.ts        # Scheduled AI analysis
/lib
  utils.ts        # Tailwind merge, formatting