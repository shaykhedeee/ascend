# ASCEND Enhancement Plan - The Ultimate Goal & Habit Tracker

## 🎯 Vision
**ASCEND** will be the most intelligent, user-friendly goal achievement and habit tracking application that makes reaching your goals feel **effortless**. Everything is interconnected - no random tasks, everything flows from the user's goals and lifestyle.

---

## 📊 Competitive Research Summary

### Key Insights from Top Apps:

| App | Strengths | What We'll Adopt |
|-----|-----------|------------------|
| **Todoist** | Quick add, natural language, multiple views, Karma gamification | Frictionless task capture, clean UI, progress visualization |
| **Any.do** | Daily planner, AI assistance, time-based reminders, templates | AI task breakdown, time-based scheduling |
| **Habitica** | Gamification (avatars, rewards, battles), social features | Enhanced gamification, visual rewards |
| **Streaks** | Simple habit tracking, Apple Design Award, statistics | Minimal design, streak visualization |
| **Fabulous** | Behavioral science, routines (morning/afternoon/evening), coaching | Routine-based habits, guided journey |
| **Notion** | AI agents, flexible workflows, everything in one place | AI-powered automation, unified workspace |

---

## 🔧 Critical Fixes (Phase 1)

### 1. Scrolling Issues
- [ ] Enable smooth scrolling on all containers
- [ ] Fix overflow properties
- [ ] Add touch-action for mobile

### 2. Consistent Logo
- [ ] Create unified Logo component
- [ ] Use same logo size/style everywhere
- [ ] Ensure proper rendering in all themes

### 3. Spacing & Layout
- [ ] Audit all components for consistent spacing
- [ ] Use Tailwind spacing scale consistently (4, 6, 8, 12, 16)
- [ ] Fix any overlapping elements

### 4. Button Improvements
- [ ] Consistent button sizes (min-height 44px for accessibility)
- [ ] Proper hover/active states
- [ ] Focus-visible outlines for keyboard navigation

### 5. Accessibility
- [ ] ARIA labels on all interactive elements
- [ ] Focus management
- [ ] Color contrast (WCAG AA minimum)
- [ ] Screen reader support

### 6. Color Palette - Orange Theme
```css
Primary Gradient: #F97316 (orange-500) → #EA580C (orange-600)
Accent Gold: #F59E0B (amber-500)
Success: #22C55E (green-500) with orange tint
Background: Warm grays with slight orange tint
Text: High contrast, warm tones
```

---

## 🚀 Enhanced Onboarding (Phase 2)

### New Onboarding Flow:

#### Step 1: Welcome & Basic Info
- Name
- Age (optional but helpful for AI)
- Primary email

#### Step 2: Lifestyle Assessment
- How busy is your typical day? (Scale 1-5)
- What time do you usually wake up?
- What time do you usually go to bed?
- Do you have a morning routine currently?

#### Step 3: Daily Life Context
- What are your typical daily responsibilities?
  - [ ] Work/Job
  - [ ] Studies
  - [ ] Family care
  - [ ] Side projects
  - [ ] Fitness/Health
  - [ ] Creative pursuits
- How many hours of free time do you have daily?

#### Step 4: Goal Setting
- What's the ONE thing you want to achieve?
- Why is this important to you? (motivation anchor)
- When do you want to achieve this by? (deadline)
- AI suggests realistic timeframe based on goal complexity

#### Step 5: Habits Discovery
- Do you want to build any of these habits?
  - [ ] Exercise regularly
  - [ ] Eat healthier
  - [ ] Read more
  - [ ] Sleep better
  - [ ] Learn a new skill
  - [ ] Quit smoking
  - [ ] Reduce screen time
  - [ ] Meditate/Mindfulness
  - [ ] Drink more water
  - [ ] Wake up earlier
- Custom habit input

#### Step 6: Preferences
- Preferred task notification times
- Focus hours (when not to disturb)
- Weekly review day preference

---

## 🤖 AI Enhancement (Phase 3)

### Goal Decomposition Engine

```
User Input: "I want to learn Spanish to B2 level"
AI Analysis:
├── Goal Category: Language Learning
├── Complexity: High
├── Estimated Duration: 6-12 months (based on CEFR standards)
├── Required Weekly Hours: 5-10 hours
└── Breakdown:
    ├── Milestone 1: A1 Level (Week 1-6)
    │   ├── Daily Tasks: Vocabulary (30 min)
    │   ├── Weekly Tasks: Grammar lesson
    │   └── Habits: Duolingo daily, Spanish podcast
    ├── Milestone 2: A2 Level (Week 7-14)
    │   ├── Daily Tasks: Reading practice
    │   ├── Weekly Tasks: Conversation practice
    │   └── Habits: Think in Spanish 5 min/day
    └── ... continues
```

### AI Features:
1. **Smart Task Generation**
   - Time-based scheduling (morning tasks, evening tasks)
   - Complexity-aware (harder tasks when user has energy)
   - Adaptive (adjusts based on completion rates)

2. **Goal Duration Estimation**
   - Research-backed estimates
   - Personalized based on user's available time
   - Buffer for realistic planning

3. **Habit Suggestions**
   - Based on goal type
   - Personalized to lifestyle
   - Stackable habits (morning routine builder)

4. **Progress Intelligence**
   - Predict completion likelihood
   - Suggest pace adjustments
   - Celebrate milestones proactively

---

## 📱 UI/UX Improvements (Phase 4)

### Tutorial System (First-Time User)
- Step-by-step walkthrough with tooltips
- Highlight key features
- "Skip Tutorial" option
- Can be replayed from settings

### Dashboard Redesign
```
┌─────────────────────────────────────────────────────────┐
│  🎯 Goal: Learn Spanish B2                              │
│  ████████████░░░░░░░░ 45% • 67 days left               │
│  ┌──────────────────────────────────────────────┐      │
│  │ 📅 Mini Calendar Widget                       │      │
│  │ [Jan] [Feb] [Mar●] [Apr] [May] [Jun]         │      │
│  │ Days completed: 23/30 this month             │      │
│  └──────────────────────────────────────────────┘      │
├─────────────────────────────────────────────────────────┤
│  📋 TODAY'S TASKS (3 remaining)                        │
│  ┌──────────────────────────────────────────────┐      │
│  │ ⏰ 9:00 AM  Vocabulary practice (30 min)     │      │
│  │ ⏰ 12:00 PM Grammar lesson                    │      │
│  │ ⏰ 7:00 PM  Listen to Spanish podcast        │      │
│  └──────────────────────────────────────────────┘      │
├─────────────────────────────────────────────────────────┤
│  🔥 DAILY HABITS (2/4 done)                            │
│  ✅ Morning meditation  ✅ Drink water                  │
│  ⬜ Duolingo lesson     ⬜ Read 10 pages               │
└─────────────────────────────────────────────────────────┘
```

### Calendar/Countdown Widget
- Visual countdown to goal deadline
- Mini calendar showing streak days
- Milestone markers

### All Tasks View
- Filter by: Today, This Week, This Month, All
- Sort by: Time, Priority, Milestone
- Group by: Milestone, Date, Type

---

## 🔗 Interconnected System (Phase 5)

### Everything Flows from Goals
```
GOAL
├── Milestones (AI-generated)
│   ├── Tasks (time-based, scheduled)
│   │   └── Linked to specific habits
│   └── Check-ins (weekly reviews)
└── Habits (support the goal)
    ├── Morning habits
    ├── Afternoon habits
    └── Evening habits
```

### No Random Tasks Policy
- Every task must be linked to:
  - A milestone, OR
  - A habit, OR
  - A "Quick Task" category (user explicitly adds)
- AI warns if tasks seem disconnected

---

## 🎨 Design System (Phase 6)

### Color Palette (Orange-focused)

```css
/* Primary Colors */
--ascend-50: #FFF7ED;   /* Warm white */
--ascend-100: #FFEDD5;  /* Light peach */
--ascend-200: #FED7AA;  /* Soft orange */
--ascend-300: #FDBA74;  /* Medium orange */
--ascend-400: #FB923C;  /* Bright orange */
--ascend-500: #F97316;  /* PRIMARY - Vibrant orange */
--ascend-600: #EA580C;  /* Deep orange */
--ascend-700: #C2410C;  /* Dark orange */

/* Accent Colors */
--gold-400: #FBBF24;    /* Achievement gold */
--gold-500: #F59E0B;    /* Reward gold */

/* Semantic Colors */
--success: #22C55E;     /* Completion green */
--warning: #F59E0B;     /* Warning amber */
--error: #EF4444;       /* Error red */
--info: #3B82F6;        /* Info blue */

/* Neutral (Warm) */
--gray-50: #FAFAF9;
--gray-100: #F5F5F4;
--gray-200: #E7E5E4;
--gray-900: #1C1917;
```

### Typography Scale
```css
--text-xs: 0.75rem;     /* 12px - Labels */
--text-sm: 0.875rem;    /* 14px - Secondary */
--text-base: 1rem;      /* 16px - Body */
--text-lg: 1.125rem;    /* 18px - Subheadings */
--text-xl: 1.25rem;     /* 20px - Headings */
--text-2xl: 1.5rem;     /* 24px - Page titles */
--text-3xl: 1.875rem;   /* 30px - Hero */
```

### Spacing Scale
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
```

---

## 📋 Implementation Checklist

### Phase 1: Critical Fixes (Day 1-2)
- [x] Fix scrolling issues ✅ (scroll-container, touch-action, smooth scroll)
- [x] Unify logo component ✅ (Logo.tsx exists)
- [x] Fix spacing inconsistencies ✅ (consistent Tailwind scale)
- [x] Improve button styles ✅ (44px min tap targets)
- [x] Add accessibility attributes ✅ (ARIA tabpanel, live region, focus states)
- [x] Implement orange color palette ✅ (#F97316 primary theme)

### Phase 2: Enhanced Onboarding (Day 3-4)
- [x] Create DeepOnboarding component ✅ (958 lines, full flow)
- [x] Build lifestyle assessment ✅ (integrated in onboarding)
- [x] Add goal timeframe input ✅ (GoalWizard.tsx)
- [x] Create habit discovery flow ✅ (habit suggestions in onboarding)
- [x] Add preferences step ✅ (notification prefs, focus hours)

### Phase 3: AI Enhancement (Day 5-6)
- [x] Enhance goal decomposition ✅ (ai-goal-decomposer.ts — Groq/Gemini)
- [x] Add duration estimation ✅ (research-backed estimates)
- [x] Create smart task scheduling ✅ (time-based task generation)
- [x] Build habit suggestion engine ✅ (AIHabitSuggestions.tsx)
- [x] Add time-based task generation ✅ (TimedTasks.tsx)

### Phase 4: UI/UX (Day 7-8)
- [x] Build tutorial system ✅ (Tutorial.tsx — step-by-step)
- [x] Create countdown/calendar widget ✅ (GoalCountdown.tsx, CalendarView.tsx)
- [x] Redesign dashboard ✅ (UnifiedTodayView.tsx)
- [x] Build "All Tasks" view ✅ (AllTasksView.tsx with filters)
- [x] Add visual progress indicators ✅ (progress bars, streak vis)

### Phase 5: Integration (Day 9-10)
- [x] Connect all systems ✅ (store.ts unified state)
- [ ] Ensure no random tasks (partial — UI supports goal linking)
- [ ] Build demo plan generator
- [x] Add weekly review system ✅ (WeeklyReview.tsx — 7-step wizard)
- [x] Polish and test ✅ (zero lint errors, build passes)

---

## 🎯 Success Metrics

### User Experience
- [ ] New user can understand app in < 30 seconds
- [ ] Onboarding completion rate > 80%
- [ ] Task completion rate > 60%
- [ ] 7-day retention > 40%

### Technical
- [ ] Lighthouse score > 90 (all categories)
- [ ] First Contentful Paint < 1.5s
- [ ] No console errors
- [ ] WCAG AA compliance

---

## 📅 Demo Plan Example

After onboarding, user sees their personalized plan:

```
┌─────────────────────────────────────────────────────────┐
│  🎉 Your ASCEND Journey Begins!                         │
│                                                         │
│  GOAL: Learn Spanish to B2 Level                        │
│  DEADLINE: June 15, 2026 (130 days from now)           │
│                                                         │
│  📊 YOUR PERSONALIZED PLAN:                             │
│                                                         │
│  Week 1-4: Foundation Building                          │
│  • 30 min vocabulary daily                              │
│  • Grammar basics (3x week)                            │
│  • Habit: Duolingo streak                              │
│                                                         │
│  Week 5-8: Building Confidence                          │
│  • Reading practice added                               │
│  • First conversation practice                          │
│                                                         │
│  [View Full Plan] [Start Day 1] [Customize]            │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Differentiators

1. **AI-First Approach** - Everything is intelligently generated and connected
2. **Effortless Experience** - User understands at a glance
3. **Time-Aware** - Tasks scheduled for optimal times
4. **Habit-Goal Integration** - Habits directly support goals
5. **Visual Progress** - Calendar, countdown, streaks all visible
6. **Clean, Orange-Themed UI** - Professional, warm, motivating

---

*This document serves as the blueprint for transforming ASCEND into the best goal and habit tracker application.*



---
title: Protect content and read user data
description: Learn how to use Clerk's hooks and helpers to protect content and
  read user data in your Next.js application.
metadata:
  title: Read session and user data in your Next.js app with Clerk
sdk: nextjs, expo, react-router, remix, tanstack-react-start, astro, nuxt
sdkScoped: "true"
canonical: /docs/:sdk:/guides/users/reading
lastUpdated: 2026-02-10T20:55:59.000Z
availableSdks: nextjs,expo,react-router,remix,tanstack-react-start,astro,nuxt
notAvailableSdks: react,js-frontend,chrome-extension,android,ios,expressjs,fastify,go,vue,ruby,js-backend
activeSdk: nextjs
sourceFile: /docs/guides/users/reading.mdx
---

Clerk provides a set of <SDKLink href="/docs/reference/nextjs/overview#client-side-helpers" sdks={["nextjs"]}>hooks and helpers</SDKLink> that you can use to protect content and read user data in your Next.js application. Here are examples of how to use these helpers in both the client and server-side to get you started.

## Server-side

### App Router

<SDKLink href="/docs/reference/nextjs/app-router/auth" sdks={["nextjs"]} code={true}>auth()</SDKLink> and <SDKLink href="/docs/reference/nextjs/app-router/current-user" sdks={["nextjs"]} code={true}>currentUser()</SDKLink> are App Router-specific helpers that you can use inside of your Route Handlers, Middleware, Server Components, and Server Actions.

* The `auth()` helper will return the <SDKLink href="/docs/reference/backend/types/auth-object" sdks={["js-backend"]} code={true}>Auth</SDKLink> object of the currently active user.
* The `currentUser()` helper will return the <SDKLink href="/docs/reference/backend/types/backend-user" sdks={["js-backend"]} code={true}>Backend User</SDKLink> object of the currently active user, which includes helpful information like the user's name or email address. **It does count towards the [Backend API request rate limit](/docs/guides/how-clerk-works/system-limits)** so it's recommended to use the <SDKLink href="/docs/:sdk:/reference/hooks/use-user" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useUser()</SDKLink> hook on the client side when possible and only use `currentUser()` when you specifically need user data in a server context. For more information on this helper, see the <SDKLink href="/docs/reference/nextjs/app-router/current-user" sdks={["nextjs"]} code={true}>currentUser()</SDKLink> reference.

The following example uses the <SDKLink href="/docs/reference/nextjs/app-router/auth" sdks={["nextjs"]} code={true}>auth()</SDKLink> helper to validate an authenticated user and the `currentUser()` helper to access the `Backend User` object for the authenticated user.

> \[!TIP]
> Any requests from a Client Component to a Route Handler will read the session from cookies and will not need the token sent as a Bearer token.

<Tabs items={["Server components and actions", "Route Handler"]}>
  <Tab>
    ```tsx {{ filename: 'app/page.tsx' }}
    import { auth, currentUser } from '@clerk/nextjs/server'

    export default async function Page() {
      // Use `auth()` to access `isAuthenticated` - if false, the user is not signed in
      const { isAuthenticated } = await auth()

      // Protect the route by checking if the user is signed in
      if (!isAuthenticated) {
        return <div>Sign in to view this page</div>
      }

      // Get the Backend User object when you need access to the user's information
      const user = await currentUser()

      // Use `user` to render user details or create UI elements
      return <div>Welcome, {user.firstName}!</div>
    }
    ```
  </Tab>

  <Tab>
    > \[!WARNING]
    > The <SDKLink href="/docs/reference/backend/types/backend-user" sdks={["js-backend"]} code={true}>Backend User</SDKLink> object includes a `privateMetadata` field that should not be exposed to the frontend. Avoid passing the full user object returned by `currentUser()` to the frontend. Instead, pass only the specified fields you need.

    ```tsx {{ filename: 'app/api/user/route.ts' }}
    import { NextResponse } from 'next/server'
    import { currentUser, auth } from '@clerk/nextjs/server'

    export async function GET() {
      // Use `auth()` to access `isAuthenticated` - if false, the user is not signed in
      const { isAuthenticated } = await auth()

      // Protect the route by checking if the user is signed in
      if (!isAuthenticated) {
        return new NextResponse('Unauthorized', { status: 401 })
      }

      // Use `currentUser()` to get the Backend User object
      const user = await currentUser()

      // Add your Route Handler's logic with the returned `user` object

      return NextResponse.json(
        { userId: user.id, email: user.emailAddresses[0].emailAddress },
        { status: 200 },
      )
    }
    ```
  </Tab>
</Tabs>

### Pages Router

For Next.js applications using the Pages Router, the <SDKLink href="/docs/reference/nextjs/pages-router/get-auth" sdks={["nextjs"]} code={true}>getAuth()</SDKLink> helper will return the <SDKLink href="/docs/reference/backend/types/auth-object" sdks={["js-backend"]} code={true}>Auth</SDKLink> object of the currently active user, which contains important information like the current user's session ID, user ID, and Organization ID, as well as the `isAuthenticated` property which can be used to protect your API routes.

In some cases, you may need the full <SDKLink href="/docs/reference/backend/types/backend-user" sdks={["js-backend"]} code={true}>Backend User</SDKLink> object of the currently active user. This is helpful if you want to render information, like their first and last name, directly from the server.

The `clerkClient()` helper returns an instance of the <SDKLink href="/docs/js-backend/getting-started/quickstart" sdks={["js-backend"]}>JS Backend SDK</SDKLink>, which exposes Clerk's Backend API resources through methods such as the <SDKLink href="/docs/reference/backend/user/get-user" sdks={["js-backend"]} code={true}>getUser()</SDKLink>{{ target: '_blank' }} method. This method returns the full `Backend User` object. **It does count towards the [Backend API request rate limit](/docs/guides/how-clerk-works/system-limits)** so it's recommended to use the <SDKLink href="/docs/:sdk:/reference/hooks/use-user" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useUser()</SDKLink> hook on the client side when possible and only use `getUser()` when you specifically need user data in a server context.

In the following example, the `userId` is passed to the JS Backend SDK's `getUser()` method to get the user's full `Backend User` object.

<Tabs items={["API Route", "getServerSideProps"]}>
  <Tab>
    ```tsx {{ filename: 'pages/api/auth.ts' }}
    import { getAuth, clerkClient } from '@clerk/nextjs/server'
    import type { NextApiRequest, NextApiResponse } from 'next'

    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
      // Use `getAuth()` to access `isAuthenticated` and the user's ID
      const { isAuthenticated, userId } = getAuth(req)

      // Protect the route by checking if the user is signed in
      if (!isAuthenticated) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      // Initialize the JS Backend SDK
      const client = await clerkClient()

      // Get the user's full Backend User object
      const user = await client.users.getUser(userId)

      return res.status(200).json({ user })
    }
    ```
  </Tab>

  <Tab>
    The `buildClerkProps()` function is used in your Next.js application's `getServerSideProps` to pass authentication state from the server to the client. It returns props that get spread into the `<ClerkProvider>` component. This enables Clerk's client-side helpers, such as `useAuth()`, to correctly determine the user's authentication status during server-side rendering.

    ```tsx {{ filename: 'pages/example.tsx' }}
    import { getAuth, buildClerkProps } from '@clerk/nextjs/server'
    import { GetServerSideProps } from 'next'

    export const getServerSideProps: GetServerSideProps = async (ctx) => {
      // Use `getAuth()` to access `isAuthenticated` and the user's ID
      const { isAuthenticated, userId } = getAuth(ctx.req)

      // Protect the route by checking if the user is signed in
      if (!isAuthenticated) {
        return {
          redirect: {
            destination: '/sign-in',
            permanent: false,
          },
        }
      }

      // Initialize the JS Backend SDK
      const client = await clerkClient()

      // Get the user's full `Backend User` object
      const user = await client.users.getUser(userId)

      // Pass the `user` object to buildClerkProps()
      return { props: { ...buildClerkProps(ctx.req, { user }) } }
    }
    ```
  </Tab>
</Tabs>

## Client-side

### `useAuth()`

{/* TODO: Keep in sync with /tanstack-react-start/read-session-data and /expo/read-session-user-data */}

The following example uses the <SDKLink href="/docs/:sdk:/reference/hooks/use-auth" sdks={["astro","chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useAuth()</SDKLink> hook to access the current auth state, as well as helper methods to manage the current session.

```tsx {{ filename: 'example.tsx' }}
export default function Example() {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth()

  const fetchExternalData = async () => {
    // Use `getToken()` to get the current user's session token
    const token = await getToken()

    // Use `token` to fetch data from an external API
    const response = await fetch('https://api.example.com/data', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.json()
  }

  // Use `isLoaded` to check if Clerk is loaded
  if (!isLoaded) {
    return <div>Loading...</div>
  }

  // Use `isSignedIn` to check if the user is signed in
  if (!isSignedIn) {
    // You could also add a redirect to the sign-in page here
    return <div>Sign in to view this page</div>
  }

  return (
    <div>
      Hello, {userId}! Your current active session is {sessionId}.
    </div>
  )
}
```

### `useUser()`

{/* TODO: Keep in sync with /reference/tanstack-react-start/read-session-data and /reference/expo/read-session-user-data */}

The following example uses the <SDKLink href="/docs/:sdk:/reference/hooks/use-user" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useUser()</SDKLink> hook to access the <SDKLink href="/docs/reference/javascript/user" sdks={["js-frontend"]} code={true}>User</SDKLink> object, which contains the current user's data such as their full name. The following example demonstrates how to use `useUser()` to check if the user is signed in and display their first name.

```tsx {{ filename: 'src/Example.tsx' }}
export default function Example() {
  const { isSignedIn, user, isLoaded } = useUser()

  // Use `isLoaded` to check if Clerk is loaded
  if (!isLoaded) {
    return <div>Loading...</div>
  }

  // Use `isSignedIn` to protect the content
  if (!isSignedIn) {
    return <div>Sign in to view this page</div>
  }

  // Use `user` to access the current user's data
  return <div>Hello {user.firstName}!</div>
}
```


---
title: Clerk Next.js SDK
description: The Clerk Next.js SDK gives you access to prebuilt components,
  React hooks, and helpers to make user authentication easier.
sdk: nextjs
sdkScoped: "true"
canonical: /docs/reference/nextjs/overview
lastUpdated: 2026-02-10T20:55:59.000Z
availableSdks: nextjs
notAvailableSdks: react,js-frontend,chrome-extension,expo,android,ios,expressjs,fastify,react-router,remix,tanstack-react-start,go,astro,nuxt,vue,ruby,js-backend
activeSdk: nextjs
sourceFile: /docs/reference/nextjs/overview.mdx
---

The Clerk Next.js SDK gives you access to prebuilt components, React hooks, and helpers to make user authentication easier. Refer to the <SDKLink href="/docs/nextjs/getting-started/quickstart" sdks={["nextjs","react","js-frontend","chrome-extension","expo","android","ios","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>quickstart guide</SDKLink> to get started.

## `clerkMiddleware()`

The `clerkMiddleware()` helper integrates Clerk authentication into your Next.js application through middleware. It allows you to integrate authorization into both the client and server of your application. You can learn more <SDKLink href="/docs/reference/nextjs/clerk-middleware" sdks={["nextjs"]}>here</SDKLink>.

## Client-side helpers

Because the Next.js SDK is built on top of the Clerk React SDK, you can use the hooks that the React SDK provides. These hooks include access to the <SDKLink href="/docs/reference/javascript/clerk" sdks={["js-frontend"]} code={true}>Clerk</SDKLink> object, <SDKLink href="/docs/reference/javascript/user" sdks={["js-frontend"]} code={true}>User object</SDKLink>, <SDKLink href="/docs/reference/javascript/organization" sdks={["js-frontend"]} code={true}>Organization object</SDKLink>, and a set of useful helper methods for signing in and signing up.

* <SDKLink href="/docs/:sdk:/reference/hooks/use-user" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useUser()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-clerk" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useClerk()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-auth" sdks={["astro","chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useAuth()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-sign-in" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useSignIn()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-sign-up" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useSignUp()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-session" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useSession()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-session-list" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useSessionList()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-organization" sdks={["chrome-extension","expo","nextjs","react","react-router","remix","tanstack-react-start"]} code={true}>useOrganization()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-organization-list" sdks={["chrome-extension","expo","nextjs","react","react-router","remix","tanstack-react-start"]} code={true}>useOrganizationList()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-organization-creation-defaults" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useOrganizationCreationDefaults()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-reverification" sdks={["chrome-extension","expo","nextjs","react","react-router","remix","tanstack-react-start"]} code={true}>useReverification()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-checkout" sdks={["nextjs","react"]} code={true}>useCheckout()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-payment-element" sdks={["nextjs","react"]} code={true}>usePaymentElement()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-payment-methods" sdks={["nextjs","react"]} code={true}>usePaymentMethods()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-plans" sdks={["nextjs","react"]} code={true}>usePlans()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-subscription" sdks={["nextjs","react"]} code={true}>useSubscription()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-statements" sdks={["nextjs","react"]} code={true}>useStatements()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-payment-attempts" sdks={["nextjs","react"]} code={true}>usePaymentAttempts()</SDKLink>

## Server-side helpers

### App router

Clerk provides first-class support for the [Next.js App Router](https://nextjs.org/docs/app). The following references show how to integrate Clerk features into apps using the latest App Router and React Server Components features.

* <SDKLink href="/docs/reference/nextjs/app-router/auth" sdks={["nextjs"]} code={true}>auth()</SDKLink>
* <SDKLink href="/docs/reference/nextjs/app-router/current-user" sdks={["nextjs"]} code={true}>currentUser()</SDKLink>
* <SDKLink href="/docs/reference/nextjs/app-router/route-handlers" sdks={["nextjs"]}>Route Handlers</SDKLink>
* <SDKLink href="/docs/reference/nextjs/app-router/server-actions" sdks={["nextjs"]}>Server Actions</SDKLink>

### Pages router

Clerk continues to provide drop-in support for the Next.js Pages Router. In addition to the main Clerk integration, the following references are available for apps using Pages Router.

* <SDKLink href="/docs/reference/nextjs/pages-router/get-auth" sdks={["nextjs"]} code={true}>getAuth()</SDKLink>
* <SDKLink href="/docs/reference/nextjs/pages-router/build-clerk-props" sdks={["nextjs"]} code={true}>buildClerkProps()</SDKLink>

## `clerkClient`

<SDKLink href="/docs/js-backend/getting-started/quickstart" sdks={["js-backend"]}>Clerk's JS Backend SDK</SDKLink> is a wrapper around the [Backend API](/docs/reference/backend-api){{ target: '_blank' }} that makes it easier to interact with the API. For example, to retrieve a list of all users in your application, you can use the `users.getUserList()` method from the JS Backend SDK instead of manually making a fetch request to the `https://api.clerk.com/v1/users` endpoint.

To access a resource, you must first instantiate a `clerkClient` instance. See the <SDKLink href="/docs/js-backend/getting-started/quickstart" sdks={["js-backend"]}>reference documentation</SDKLink> for more information.

## `Auth` object

Both `auth()` (App Router) and `getAuth()` (Pages Router) return an `Auth` object. This JavaScript object contains important information like the current user's session ID, user ID, and Organization ID. Learn more about the <SDKLink href="/docs/reference/backend/types/auth-object" sdks={["js-backend"]} code={true}>Auth object</SDKLink>{{ target: '_blank' }}.

## Demo repositories

For examples of Clerk's features, such as user and Organization management, integrated into a single application, see the Next.js demo repositories:

* [Clerk + Next.js App Router Demo](https://github.com/clerk/clerk-nextjs-demo-app-router)
* [Clerk + Next.js Pages Router Demo](https://github.com/clerk/clerk-nextjs-demo-pages-router)


---
title: Component Reference
description: A list of Clerk's comprehensive suite of components designed to
  seamlessly integrate authentication and multi-tenancy into your application.
sdk: react, nextjs, js-frontend, chrome-extension, expo, expressjs, fastify,
  react-router, remix, tanstack-react-start, go, astro, nuxt, vue, ruby,
  js-backend
sdkScoped: "true"
canonical: /docs/:sdk:/reference/components/overview
lastUpdated: 2026-02-10T20:55:59.000Z
availableSdks: react,nextjs,js-frontend,chrome-extension,expo,expressjs,fastify,react-router,remix,tanstack-react-start,go,astro,nuxt,vue,ruby,js-backend
notAvailableSdks: android,ios
activeSdk: nextjs
sourceFile: /docs/reference/components/overview.mdx
---

Clerk offers a comprehensive suite of components designed to seamlessly integrate authentication and multi-tenancy into your application. With Clerk components, you can easily customize the appearance of authentication components and pages, manage the entire authentication flow to suit your specific needs, and even build robust SaaS applications.

## Authentication components

* <SDKLink href="/docs/:sdk:/reference/components/authentication/sign-in" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<SignIn /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/authentication/sign-up" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<SignUp /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/authentication/google-one-tap" sdks={["astro","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<GoogleOneTap /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/authentication/task-choose-organization" sdks={["js-frontend","nextjs","react","react-router","remix","tanstack-react-start"]} code={true}>\<TaskChooseOrganization /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/authentication/waitlist" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<Waitlist /></SDKLink>

## User components

* <SDKLink href="/docs/:sdk:/reference/components/user/user-avatar" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserAvatar /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/user/user-button" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserButton /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/user/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<UserProfile /></SDKLink>

## Organization components

* <SDKLink href="/docs/:sdk:/reference/components/organization/create-organization" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<CreateOrganization /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/organization/organization-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<OrganizationProfile /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/organization/organization-switcher" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<OrganizationSwitcher /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/organization/organization-list" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<OrganizationList /></SDKLink>

## Billing components

* <SDKLink href="/docs/:sdk:/reference/components/billing/pricing-table" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<PricingTable /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/billing/checkout-button" sdks={["react","nextjs","vue"]} code={true}>\<CheckoutButton /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/billing/plan-details-button" sdks={["react","nextjs","vue"]} code={true}>\<PlanDetailsButton /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/billing/subscription-details-button" sdks={["react","nextjs","vue"]} code={true}>\<SubscriptionDetailsButton /></SDKLink>

## Control components

Control components manage authentication-related behaviors in your application. They handle tasks such as controlling content visibility based on user authentication status, managing loading states during authentication processes, and redirecting users to appropriate pages. Control components render at `<Loading />` and `<Loaded />` states for assertions on the <SDKLink href="/docs/reference/javascript/clerk" sdks={["js-frontend"]} code={true}>Clerk object</SDKLink>. A common example is the <SDKLink href="/docs/:sdk:/reference/components/control/signed-in" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<SignedIn></SDKLink> component, which allows you to conditionally render content only when a user is authenticated.

* <SDKLink href="/docs/:sdk:/reference/components/control/authenticate-with-redirect-callback" sdks={["astro","chrome-extension","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<AuthenticateWithRedirectCallback /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/control/clerk-loaded" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]} code={true}>\<ClerkLoaded /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/control/clerk-loading" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<ClerkLoading /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/control/clerk-degraded" sdks={["nextjs","react","react-router","chrome-extension","remix","tanstack-react-start"]} code={true}>\<ClerkDegraded /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/control/clerk-failed" sdks={["nextjs","react","react-router","chrome-extension","remix","tanstack-react-start"]} code={true}>\<ClerkFailed /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/control/protect" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<Protect /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/control/redirect-to-sign-in" sdks={["chrome-extension","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<RedirectToSignIn /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/control/redirect-to-sign-up" sdks={["chrome-extension","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<RedirectToSignUp /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/control/redirect-to-tasks" sdks={["chrome-extension","nextjs","nuxt","react","react-router","tanstack-react-start","vue"]} code={true}>\<RedirectToTasks /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/control/redirect-to-user-profile" sdks={["nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<RedirectToUserProfile /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/control/redirect-to-organization-profile" sdks={["nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<RedirectToOrganizationProfile /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/control/redirect-to-create-organization" sdks={["nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<RedirectToCreateOrganization /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/control/signed-in" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<SignedIn /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/control/signed-out" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<SignedOut /></SDKLink>

## Unstyled components

* <SDKLink href="/docs/:sdk:/reference/components/unstyled/sign-in-button" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<SignInButton /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/unstyled/sign-in-with-metamask" sdks={["expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<SignInWithMetamaskButton /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/unstyled/sign-up-button" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<SignUpButton /></SDKLink>
* <SDKLink href="/docs/:sdk:/reference/components/unstyled/sign-out-button" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue"]} code={true}>\<SignOutButton /></SDKLink>

## Customization guides

* <SDKLink href="/docs/:sdk:/guides/customizing-clerk/appearance-prop/overview" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend","fastify","expressjs","js-backend","go","ruby"]}>Customize components with the `appearance` prop</SDKLink>
* [Localize components with the `localization` prop (experimental)](/docs/guides/customizing-clerk/localization)
* <SDKLink href="/docs/:sdk:/guides/customizing-clerk/adding-items/user-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]}>Add pages to the `<UserProfile />` component</SDKLink>
* <SDKLink href="/docs/:sdk:/guides/customizing-clerk/adding-items/organization-profile" sdks={["astro","chrome-extension","expo","nextjs","nuxt","react","react-router","remix","tanstack-react-start","vue","js-frontend"]}>Add pages to the `<OrganizationProfile />` component</SDKLink>

### Secured by Clerk branding

> \[!WARNING]
> This feature requires a [paid plan](/pricing){{ target: '_blank' }} for production use, but all features are free to use in development mode so that you can try out what works for you. See the [pricing](/pricing){{ target: '_blank' }} page for more information.

By default, Clerk displays a **Secured by Clerk** badge on Clerk components. You can remove this branding by following these steps:

1. In the Clerk Dashboard, navigate to your application's [**Settings**](https://dashboard.clerk.com/~/settings).
2. Under **Branding**, toggle on the **Remove "Secured by Clerk" branding** option.

<Cards variant="cta" level={2}>
  * [Join our Discord](https://clerk.com/discord "Join Discord")
  * Join our official Discord server to chat with us directly and become a part of the Clerk community.
  * ![Discord logo](/docs/images/logos/auth_providers/discord.svg){{ dark: '/docs/images/logos/auth_providers/discord-dark.svg' }}

  ***

  * [Need help?](/support "Get help")
  * Contact us through Discord, Twitter, or email to receive answers to your questions and learn more about Clerk.
  * {<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"><g clipPath="url(#a)"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M22 30.603c-5.109 0-9.25-3.773-9.25-8.427 0-4.653 4.141-8.426 9.25-8.426s9.25 3.773 9.25 8.426c0 1.864-.664 3.587-1.789 4.982.28 1.476.996 3.488 1.789 4.092 0 0-2.735-.379-4.79-1.69A9.9 9.9 0 0 1 22 30.603"/><path fill="currentColor" fillOpacity=".15" fillRule="evenodd" d="M14.55 27.172c-1.131-1.398-1.8-3.125-1.8-4.996 0-4.653 4.141-8.426 9.25-8.426 3.67 0 6.84 1.947 8.335 4.768.592-1.412.915-2.937.915-4.527C31.25 6.678 24.422.75 16 .75S.75 6.678.75 13.99c0 2.93 1.095 5.636 2.95 7.829-.462 2.319-1.643 5.481-2.95 6.43 0 0 4.511-.595 7.9-2.654a16.9 16.9 0 0 0 5.9 1.577" clipRule="evenodd"/><path fill="currentColor" d="m14.55 27.172-.06.748a.75.75 0 0 0 .643-1.22zm15.785-8.654-.663.351a.75.75 0 0 0 1.355-.06zM3.7 21.818l.736.147a.75.75 0 0 0-.163-.63zM.75 28.25l-.44-.607a.75.75 0 0 0 .538 1.35zm7.9-2.655.323-.677a.75.75 0 0 0-.713.036zm6.483 1.105c-1.031-1.275-1.633-2.837-1.633-4.524H12c0 2.055.736 3.947 1.967 5.468zM13.5 22.176c0-4.175 3.738-7.676 8.5-7.676V13c-5.456 0-10 4.044-10 9.176zM22 14.5c3.408 0 6.315 1.807 7.672 4.37l1.326-.703C29.366 15.087 25.93 13 22 13zm9.027 4.309c.642-1.525.973-3.164.973-4.818h-1.5c0 1.455-.292 2.896-.857 4.237zM32 13.991C32 6.168 24.734 0 16 0v1.5c8.111 0 14.5 5.688 14.5 12.49zM16 0C7.266 0 0 6.168 0 13.99h1.5C1.5 7.189 7.889 1.5 16 1.5zM0 13.99c0 3.123 1.169 5.998 3.127 8.313l1.145-.969c-1.75-2.07-2.772-4.608-2.772-7.343zm2.964 7.682a19 19 0 0 1-1.111 3.58C1.34 26.438.785 27.296.309 27.641l.882 1.215c.831-.604 1.519-1.802 2.04-3.013.538-1.25.963-2.671 1.204-3.879l-1.471-.293zM.75 28.25l.098.743h.006l.011-.002.201-.03a28 28 0 0 0 2.553-.541c1.584-.415 3.637-1.101 5.42-2.185l-.78-1.281c-1.605.976-3.501 1.617-5.02 2.015a27 27 0 0 1-2.578.536l-.008.001zm7.576-1.979a17.6 17.6 0 0 0 6.164 1.649l.122-1.495a16.1 16.1 0 0 1-5.639-1.507z"/></g><defs><clipPath id="a"><path fill="currentColor" d="M0 0h32v32H0z"/></clipPath></defs></svg>}
</Cards>


---
title: Clerk Next.js SDK
description: The Clerk Next.js SDK gives you access to prebuilt components,
  React hooks, and helpers to make user authentication easier.
sdk: nextjs
sdkScoped: "true"
canonical: /docs/reference/nextjs/overview
lastUpdated: 2026-02-10T20:55:59.000Z
availableSdks: nextjs
notAvailableSdks: react,js-frontend,chrome-extension,expo,android,ios,expressjs,fastify,react-router,remix,tanstack-react-start,go,astro,nuxt,vue,ruby,js-backend
activeSdk: nextjs
sourceFile: /docs/reference/nextjs/overview.mdx
---

The Clerk Next.js SDK gives you access to prebuilt components, React hooks, and helpers to make user authentication easier. Refer to the <SDKLink href="/docs/nextjs/getting-started/quickstart" sdks={["nextjs","react","js-frontend","chrome-extension","expo","android","ios","expressjs","fastify","react-router","remix","tanstack-react-start","go","astro","nuxt","vue","ruby","js-backend"]}>quickstart guide</SDKLink> to get started.

## `clerkMiddleware()`

The `clerkMiddleware()` helper integrates Clerk authentication into your Next.js application through middleware. It allows you to integrate authorization into both the client and server of your application. You can learn more <SDKLink href="/docs/reference/nextjs/clerk-middleware" sdks={["nextjs"]}>here</SDKLink>.

## Client-side helpers

Because the Next.js SDK is built on top of the Clerk React SDK, you can use the hooks that the React SDK provides. These hooks include access to the <SDKLink href="/docs/reference/javascript/clerk" sdks={["js-frontend"]} code={true}>Clerk</SDKLink> object, <SDKLink href="/docs/reference/javascript/user" sdks={["js-frontend"]} code={true}>User object</SDKLink>, <SDKLink href="/docs/reference/javascript/organization" sdks={["js-frontend"]} code={true}>Organization object</SDKLink>, and a set of useful helper methods for signing in and signing up.

* <SDKLink href="/docs/:sdk:/reference/hooks/use-user" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useUser()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-clerk" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useClerk()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-auth" sdks={["astro","chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useAuth()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-sign-in" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useSignIn()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-sign-up" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useSignUp()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-session" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useSession()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-session-list" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useSessionList()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-organization" sdks={["chrome-extension","expo","nextjs","react","react-router","remix","tanstack-react-start"]} code={true}>useOrganization()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-organization-list" sdks={["chrome-extension","expo","nextjs","react","react-router","remix","tanstack-react-start"]} code={true}>useOrganizationList()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-organization-creation-defaults" sdks={["chrome-extension","expo","nextjs","react","react-router","tanstack-react-start"]} code={true}>useOrganizationCreationDefaults()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-reverification" sdks={["chrome-extension","expo","nextjs","react","react-router","remix","tanstack-react-start"]} code={true}>useReverification()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-checkout" sdks={["nextjs","react"]} code={true}>useCheckout()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-payment-element" sdks={["nextjs","react"]} code={true}>usePaymentElement()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-payment-methods" sdks={["nextjs","react"]} code={true}>usePaymentMethods()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-plans" sdks={["nextjs","react"]} code={true}>usePlans()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-subscription" sdks={["nextjs","react"]} code={true}>useSubscription()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-statements" sdks={["nextjs","react"]} code={true}>useStatements()</SDKLink>
* <SDKLink href="/docs/:sdk:/reference/hooks/use-payment-attempts" sdks={["nextjs","react"]} code={true}>usePaymentAttempts()</SDKLink>

## Server-side helpers

### App router

Clerk provides first-class support for the [Next.js App Router](https://nextjs.org/docs/app). The following references show how to integrate Clerk features into apps using the latest App Router and React Server Components features.

* <SDKLink href="/docs/reference/nextjs/app-router/auth" sdks={["nextjs"]} code={true}>auth()</SDKLink>
* <SDKLink href="/docs/reference/nextjs/app-router/current-user" sdks={["nextjs"]} code={true}>currentUser()</SDKLink>
* <SDKLink href="/docs/reference/nextjs/app-router/route-handlers" sdks={["nextjs"]}>Route Handlers</SDKLink>
* <SDKLink href="/docs/reference/nextjs/app-router/server-actions" sdks={["nextjs"]}>Server Actions</SDKLink>

### Pages router

Clerk continues to provide drop-in support for the Next.js Pages Router. In addition to the main Clerk integration, the following references are available for apps using Pages Router.

* <SDKLink href="/docs/reference/nextjs/pages-router/get-auth" sdks={["nextjs"]} code={true}>getAuth()</SDKLink>
* <SDKLink href="/docs/reference/nextjs/pages-router/build-clerk-props" sdks={["nextjs"]} code={true}>buildClerkProps()</SDKLink>

## `clerkClient`

<SDKLink href="/docs/js-backend/getting-started/quickstart" sdks={["js-backend"]}>Clerk's JS Backend SDK</SDKLink> is a wrapper around the [Backend API](/docs/reference/backend-api){{ target: '_blank' }} that makes it easier to interact with the API. For example, to retrieve a list of all users in your application, you can use the `users.getUserList()` method from the JS Backend SDK instead of manually making a fetch request to the `https://api.clerk.com/v1/users` endpoint.

To access a resource, you must first instantiate a `clerkClient` instance. See the <SDKLink href="/docs/js-backend/getting-started/quickstart" sdks={["js-backend"]}>reference documentation</SDKLink> for more information.

## `Auth` object

Both `auth()` (App Router) and `getAuth()` (Pages Router) return an `Auth` object. This JavaScript object contains important information like the current user's session ID, user ID, and Organization ID. Learn more about the <SDKLink href="/docs/reference/backend/types/auth-object" sdks={["js-backend"]} code={true}>Auth object</SDKLink>{{ target: '_blank' }}.

## Demo repositories

For examples of Clerk's features, such as user and Organization management, integrated into a single application, see the Next.js demo repositories:

* [Clerk + Next.js App Router Demo](https://github.com/clerk/clerk-nextjs-demo-app-router)
* [Clerk + Next.js Pages Router Demo](https://github.com/clerk/clerk-nextjs-demo-pages-router)


---
title: API Reference
description: Access Clerk's frontend and backend API reference documentation.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/reference/api/overview
sourceFile: /docs/reference/api/overview.mdx
---

While accessing Clerk functionality via SDK is the easiest path, Clerk offers two different HTTP APIs for you to interact with directly.

[The Clerk Frontend API](/docs/reference/frontend-api){{ target: '_blank' }} is meant to be accessed from a browser or native clients. This is what the Clerk SDK's utilize. Use this API if you are building client-side functionality.

[The Clerk Backend API](/docs/reference/backend-api){{ target: '_blank' }} is meant to be accessed by backend servers. Use this API if you need to update data inside of Clerk's systems outside the concept of a session, like coordinating data sync operations with third-parties or fetching and updating configuration settings.

[The Clerk Platform API](/docs/reference/platform-api){{ target: '_blank' }} is meant to be accessed by backend servers. Use this API if you need to manage resources of a workspace such as your Clerk applications, domains, and application transfers.

For more information about how Clerk works, see the [dedicated guide](/docs/guides/how-clerk-works/overview).
---
title: API Reference
description: Access Clerk's frontend and backend API reference documentation.
lastUpdated: 2026-02-10T20:55:59.000Z
sdkScoped: "false"
canonical: /docs/reference/api/overview
sourceFile: /docs/reference/api/overview.mdx
---

While accessing Clerk functionality via SDK is the easiest path, Clerk offers two different HTTP APIs for you to interact with directly.

[The Clerk Frontend API](/docs/reference/frontend-api){{ target: '_blank' }} is meant to be accessed from a browser or native clients. This is what the Clerk SDK's utilize. Use this API if you are building client-side functionality.

[The Clerk Backend API](/docs/reference/backend-api){{ target: '_blank' }} is meant to be accessed by backend servers. Use this API if you need to update data inside of Clerk's systems outside the concept of a session, like coordinating data sync operations with third-parties or fetching and updating configuration settings.

[The Clerk Platform API](/docs/reference/platform-api){{ target: '_blank' }} is meant to be accessed by backend servers. Use this API if you need to manage resources of a workspace such as your Clerk applications, domains, and application transfers.

For more information about how Clerk works, see the [dedicated guide](/docs/guides/how-clerk-works/overview).
