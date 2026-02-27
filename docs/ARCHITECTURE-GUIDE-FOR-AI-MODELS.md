# 🤖 Ascendify Complete Architecture Guide for AI Models

**Purpose:** This document is written explicitly for AI language models and code generation tools to understand the entire Ascendify codebase, architecture, data flow, and implementation patterns.

**Structure:** Verbose, explicit, and detailed. Assumes model has no prior context about the project.

---

## Part 1: Platform Overview

### 1.1 What is Ascendify?

Ascendify is a mental health and personal productivity platform that helps users build and maintain healthy habits while managing personal goals.

**Core Problem Solved:**
- Users struggle to maintain habits with lasting behavior change
- Generic habit trackers lack scientific backing
- Users need personalized coaching on habit formation
- Users need support community and accountability

**Core Solution:**
- Habit tracking based on behavioral psychology scientific research
- AI-powered coaching from "Kai" (an LLM-based chatbot)
- Goal management with habit-based breakdowns
- Streak tracking and gamification
- Plan-based feature access (Free vs Pro)

### 1.2 User Journey

```
Visitor (Unauthenticated)
  ↓
Landing Page (Sees product value)
  ↓
Sign Up (Clerk authentication)
  ↓
Onboarding Flow (Learn how to use app)
  ↓
Dashboard (Main app interface)
  ↓
Create First Habit
  ↓
Track Habits Daily
  ↓
View Progress & Streaks
  ↓ [Optional] Get coaching from Kai
  ↓ [Optional] Pay for Pro plan
  ↓
Long-term user
```

### 1.3 Core Concepts

**Habit:** A behavior you want to repeat regularly (daily or weekly)
- Properties: name, category, frequency (daily/weekly), days of week
- Tracked: completion status each day/week
- Visualized: streak count, 7-day/month completion rate

**Goal:** A larger objective you want to achieve
- Properties: title, description, timeline
- Linked to: habits (building habits achieves goals)
- Tracked: progress percentage, completion date

**Streak:** Consecutive days/weeks habit is completed
- Longest streak: all-time maximum consecutive completions
- Current streak: resets if habit missed
- Visualized: number badge + celebration on milestones (7, 30, 66 days)

**Category:** Organization for habits
- Health (exercise, sleep, nutrition, meditation)
- Learning (reading, skills, courses)
- Productivity (focus sessions, deep work)
- Wellness (social, hobbies, mindfulness)

**Kai (Chatbot):** AI coaching assistant
- Provides habit tips and encouragement
- Answers questions about habit formation
- Offers personalized advice based on user habits
- Responds using intent detection and LLM generation

**Plan:** Billing tier determining feature access
- **Free:** 10 habits, 3 goals, basic tracking
- **Pro:** Unlimited habits/goals, full Kai coaching, priority support
- Users can upgrade anytime, downgrade anytime

---

## Part 2: Technology Stack

### 2.1 Frontend Architecture

**Framework:** Next.js 14+ (App Router)
- **Why:** Server-side rendering, API routes, excellent developer experience
- **Pattern:** Pages are in `src/app/` directory using App Router conventions

**React Components**
- **Type:** Functional components with TypeScript
- **State Management:** React hooks (useState, useContext, useReducer)
- **Async Handling:** React hooks + API calls

**Styling:** Tailwind CSS
- **Scope:** All styling uses Tailwind utility classes
- **Custom CSS:** Colors, animations defined in globals.css with CSS variables
- **Responsive:** Mobile-first approach (sm:, md:, lg: breakpoints)

**Package Management:** npm
- **Installation:** `npm install`
- **Scripts:** Defined in `package.json`

### 2.2 Backend Architecture

**Framework:** Convex (Serverless Backend-as-a-Service)
- **Why:** Handles authentication, database, API, functions all in one platform
- **Pattern:** Functions defined in `convex/` directory as TypeScript files

**Database:** Convex Tables (Relational, JSON-based)
- **Schema:** Defined in `convex/schema.ts`
- **Tables for core features:**
  - `users` - User profiles and settings
  - `habits` - Habit definitions (name, category, frequency)
  - `habitEntries` - Daily/weekly habit completions (tracking data)
  - `goals` - Goal definitions
  - `goalHabits` - Link goals to habits
  - `chatMessages` - Coaching chat history
  - `auditLog` - Security and billing events

**Functions:** Queries and Mutations
- **Queries:** Read-only data fetching (e.g., `getHabits`, `getGoalProgress`)
- **Mutations:** Data change operations (e.g., `createHabit`, `completeHabit`, `upgradePlan`)
- **Actions:** Long-running tasks (e.g., LLM API calls for Kai)
- **Webhooks:** Receive events from external services (e.g., Billin from Clerk)

### 2.3 Authentication & Billing

**Authentication Provider:** Clerk
- **Integration:** Next.js middleware handles auth checks
- **Storage:** Clerk manages user sessions and credentials
- **User ID:** Every user has a Clerk `userId` used as foreign key

**Billing Integration:** Clerk Billing + Svix Webhooks
- **Stripe Backend:** Clerk uses Stripe for payment processing
- **Webhook Handler:** `src/app/api/webhooks/clerk-billing/route.ts` receives billing events
- **Events:** `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
- **Mutations:** Webhook calls Convex mutations to update user plan

**Plans Enforced:**
- Free plan: User can create max 10 habits, max 3 goals
- Pro plan: Unlimited habits/goals
- Billing mutations in `convex/users.ts`: `upgradePlan`, `downgradePlan`

### 2.4 AI/LLM Integration (Kai)

**LLM Provider:** OpenAI API (or compatible)
- **Model:** GPT-3.5-turbo or GPT-4 (configured)
- **Integration:** `convex/coachMessages.ts` handles API calls
- **Environment Variables:** API key stored securely in Convex environment

**Kai Conversation Flow:**
1. User sends message to Kai in chat interface
2. Frontend calls mutation `createCoachMessage` with text
3. Mutation receives message in Convex
4. Mutation calls `generateCoachResponse` action
5. Action calls OpenAI API with system prompt + conversation history
6. OpenAI returns response text
7. Response saved to `chatMessages` table
8. Response returned to frontend
9. Frontend displays message in chat UI

**System Prompt (Hardened):**
```
You are Kai, a compassionate AI coaching assistant.
You help users build positive habits and achieve goals.
You provide encouragement, science-backed advice, and support.
You never give medical advice.
You never recommend stopping prescribed medication.
You always recommend consulting professionals for mental health crises.
Stay supportive, warm, and practical.
```

**Safety Mechanisms:**
- Rate limiting: 10 messages per hour per user (free), unlimited (pro)
- Content filtering: Check response for harmful content before sending
- Audit logging: All conversations logged for compliance
- User can delete conversation history anytime

---

## Part 3: Data Model & Schema

### 3.1 Complete Database Schema

```typescript
// Defined in convex/schema.ts

// Users table: Store user account info
{
  _id: Id<"users">,
  clerkUserId: string,                  // Clerk auth user ID
  email: string,                        // Email address
  firstName: string,                    // First name
  lastName: string,                     // Last name
  plan: "free" | "pro" | "lifetime",    // Current billing plan
  planUpdatedAt: number,                // Timestamp of last plan change
  archivedHabits: Id<"habits">[],      // Habit IDs archived due to plan downgrade
  archivedGoals: Id<"goals">[],        // Goal IDs archived due to plan downgrade
  preferences: {
    timezone: string,                   // User's timezone
    theme: "light" | "dark",            // UI theme preference
    notifications: boolean,             // Email notifications enabled
    language: "en" | "es" | "fr",      // Preferred language
  },
  createdAt: number,                    // Account creation timestamp
  updatedAt: number,                    // Last update timestamp
}

// Habits table: Define user's habits
{
  _id: Id<"habits">,
  userId: Id<"users">,                  // Owner of habit
  name: string,                         // Habit name (e.g., "Morning Meditation")
  category: "health" | "learning" | "productivity" | "wellness",
  description: string | undefined,      // Optional description
  frequency: "daily" | "weekly",        // Daily or weekly
  weekDays: number[],                   // [0-6] if weekly (0=Monday)
  startDate: number,                    // When habit started
  archived: boolean,                    // True if archived (not shown in main list)
  archivedByDowngrade: boolean,         // True if archived due to downgrade
  archivedAt: number | undefined,       // When archived
  icon: string | undefined,             // Icon emoji or name
  color: string | undefined,            // Color for visualizations
  createdAt: number,
  updatedAt: number,
}

// HabitEntries table: Track daily/weekly completions
{
  _id: Id<"habitEntries">,
  habitId: Id<"habits">,                // Which habit
  userId: Id<"users">,                  // Habit owner
  completionDate: number,               // Date (unix timestamp, start of day)
  completed: boolean,                   // Did user complete it
  mood: 1 | 2 | 3 | 4 | 5 | undefined, // Optional mood rating
  notes: string | undefined,            // Optional notes
  completedAt: number | undefined,      // When marked complete
  createdAt: number,
}

// Goals table: Define user's goals
{
  _id: Id<"goals">,
  userId: Id<"users">,                  // Owner of goal
  title: string,                        // Goal title
  description: string | undefined,      // Optional description
  targetDate: number | undefined,       // Deadline (unix timestamp)
  status: "active" | "completed" | "abandoned" | "archived",
  archived: boolean,                    // True if archived
  archivedByDowngrade: boolean,         // True if archived due to downgrade
  archivedAt: number | undefined,       // When archived
  category: string | undefined,         // Goal category
  priority: "low" | "medium" | "high" | undefined,
  progress: number,                     // 0-100 percentage complete
  completedAt: number | undefined,      // When marked complete
  createdAt: number,
  updatedAt: number,
}

// GoalHabits table: Link goals to habits
{
  _id: Id<"goalHabits">,
  goalId: Id<"goals">,                  // Which goal
  habitId: Id<"habits">,                // Which habit
  userId: Id<"users">,                  // Goal owner
  createdAt: number,
}

// ChatMessages table: Kai coaching history
{
  _id: Id<"chatMessages">,
  userId: Id<"users">,                  // User in conversation
  role: "user" | "assistant",           // Who sent message
  content: string,                      // Message text
  intent: string | undefined,           // Detected intent (e.g., "habit_advice")
  tokens: number | undefined,           // LLM tokens used
  model: string | undefined,            // Which model used (gpt-3.5, gpt-4)
  createdAt: number,
}

// AuditLog table: Security and compliance tracking
{
  _id: Id<"auditLog">,
  userId: Id<"users"> | undefined,      // User involved (or undefined for system events)
  action: string,                       // Event type (e.g., "habit_created", "plan_upgraded")
  resourceType: string,                 // What changed (e.g., "habit", "user", "subscription")
  resourceId: string | undefined,       // ID of resource changed
  details: Record<string, any>,         // Additional context
  severity: "info" | "warning" | "error",
  ipAddress: string | undefined,        // If available
  createdAt: number,
}

// Subscriptions table: Active subscriptions (may be managed by Clerk)
{
  _id: Id<"subscriptions">,
  userId: Id<"users">,
  clerkSubscriptionId: string,          // Clerk's subscription ID
  plan: "free" | "pro" | "lifetime",
  status: "active" | "canceled" | "expired",
  currentPeriodStart: number,
  currentPeriodEnd: number,
  cancelAt: number | undefined,
  createdAt: number,
  updatedAt: number,
}

// WebhookEvents table: Log all incoming webhooks (for debugging)
{
  _id: Id<"webhookEvents">,
  provider: string,                     // "clerk-billing", "stripe", etc.
  eventType: string,                    // e.g., "customer.subscription.updated"
  payload: Record<string, any>,         // Full webhook data
  processed: boolean,                   // Successfully processed
  error: string | undefined,            // Error message if failed
  processedAt: number | undefined,
  createdAt: number,
}
```

### 3.2 Data Relationships (ER Diagram)

```
Users (1) ──── (0..*)  Habits
            ├─ habits created by user
            ├─ stored in userId field

Users (1) ──── (0..*)  Goals
            ├─ goals created by user

Users (1) ──── (0..*)  HabitEntries
            ├─ daily/weekly completions

Users (1) ──── (0..*)  ChatMessages
            ├─ coaching conversations

Habits (1) ──── (0..*)  HabitEntries
             ├─ completions of that habit
             ├─ stored in habitId field

Goals (1) ──── (0..*)  GoalHabits
           ├─ habits that achieve this goal

Habits (1) ──── (0..*)  GoalHabits
             ├─ goals this habit contributes to
```

---

## Part 4: Feature Implementation Details

### 4.1 Habit Tracking Feature

**What It Does:**
- User can create habits (e.g., "Meditate 10 min")
- User can mark habit as complete each day
- System calculates and displays streaks
- User can view 7-day and monthly completion rates
- User can archive or delete habits

**Implementation:**

**Creating a Habit:**
```typescript
// File: convex/habits.ts, Function: createHabit
Input: {
  name: string,
  category: "health" | "learning" | "productivity" | "wellness",
  frequency: "daily" | "weekly",
  weekDays?: number[],
  description?: string
}

Process:
1. Check user plan limits (free: max 10, pro: unlimited)
2. Create Habit record in database
3. Log audit event
4. Return new habit object

Stored in: habits table
User sees: New habit appears on dashboard
```

**Marking Habit Complete:**
```typescript
// File: convex/habits.ts, Function: completeHabit
Input: {
  habitId: Id<"habits">,
  date: number,  // unix timestamp of date
  mood?: 1|2|3|4|5,
  notes?: string
}

Process:
1. Create HabitEntry record with completed = true
2. Calculate new streak
3. Check if milestone reached (7, 30, 66 days)
4. Log audit event
5. Return updated habit with new streak

Stored in: habitEntries table
User sees: Habit shows as completed, streak increases, celebration if milestone
```

**Calculating Streaks:**
```
Streak = Count of consecutive days habit was completed until today
         (or consecutive weeks if habit is weekly)

Example:
Mon (completed) → streak = 1
Tue (completed) → streak = 2
Wed (completed) → streak = 3
Thu (completed) → streak = 4
Fri (missed)    → streak = 0 (reset!)
Sat (completed) → streak = 1

Longest streak = maximum streak ever achieved = 4 in example above
```

**Displaying Progress:**
```
7-Day View: Show completion status for last 7 days
            [✓][✓][✗][✓][✓][✓][✗] = 5/7 = 71%

Monthly View: Show heatmap calendar
             Sun Mon Tue Wed Thu Fri Sat
             [1] [1] [0] [1] [1] [1] [0]  Color intensity = days completed
             ...

Streak Widget: Display current streak + longest streak
              Current: 15 days ⚡
              Best: 47 days 🏆
```

**Archiving a Habit:**
```typescript
// File: convex/habits.ts, Function: archiveHabit
Input: { habitId: Id<"habits"> }

Process:
1. Set habit.archived = true
2. Note the reason (user-initiated vs downgrade)
3. Keep all habit data and entries (don't delete)
4. Remove from active lists, keep accessible via "archived" view
5. User can restore anytime

This preserves user data if they re-upgrade plan.
```

### 4.2 Goal Management Feature

**What It Does:**
- User can create goals (e.g., "Lose 10 lbs by June")
- Each goal can link to multiple habits
- System calculates goal progress based on linked habit completion
- User can track toward goal completion
- User can mark goal as complete or abandoned

**Implementation:**

**Creating a Goal:**
```typescript
// File: convex/goals.ts, Function: createGoal
Input: {
  title: string,
  description?: string,
  targetDate?: number,  // unix timestamp
  category?: string,
  priority?: "low" | "medium" | "high"
}

Process:
1. Check user plan limits (free: max 3, pro: unlimited)
2. Create Goal record in database
3. Initialize progress = 0
4. Log audit event
5. Return new goal object

Stored in: goals table
User sees: New goal on goals page, ready to link habits
```

**Linking Habits to Goals:**
```typescript
// File: convex/goals.ts, Function: addHabitToGoal
Input: {
  goalId: Id<"goals">,
  habitId: Id<"habits">
}

Process:
1. Create GoalHabits entry
2. Recalculate goal progress based on all linked habits
3. Log audit event

Stored in: goalHabits table
User sees: Habit appears under goal, goal progress updates
```

**Calculating Goal Progress:**
```
Goal Progress = Average completion rate of all linked habits

Example:
Goal: "Get Healthy"
  ├─ Habit 1: Exercise (70% completion last month)
  ├─ Habit 2: Sleep 8h (80% completion last month)
  └─ Habit 3: Healthy food (60% completion last month)

Goal Progress = (70 + 80 + 60) / 3 = 70%

This is updated daily based on latest habit entries.
```

**Completing a Goal:**
```typescript
// File: convex/goals.ts, Function: completeGoal
Input: { goalId: Id<"goals"> }

Process:
1. Check if goal has habits and progress >= 80% (configurable)
2. Mark goal.status = "completed"
3. Set completedAt = now
4. Celebrate with UI animation
5. Log audit event

User sees: Goal moves to "completed" section, celebration animation
```

### 4.3 Kai Chatbot (AI Coaching)

**What It Does:**
- User can talk to Kai AI assistant
- Kai provides habit formation advice
- Kai gives encouragement and support
- Kai can answer questions about personal habits
- Conversations stored and retrievable

**Implementation:**

**Sending Message to Kai:**
```typescript
// File: convex/coachMessages.ts, Function: createCoachMessage
Input: {
  content: string,  // User's message
  habitIds?: Id<"habits">[]  // Optional habits to discuss
}

Process:
1. Save user message to chatMessages table
2. Validate message (length, language filtering)
3. Call generateCoachResponse action (async)
4. Return immediately with message saved
5. Frontend polls for response or uses websocket

Stored in: chatMessages table (role = "user")
User sees: Message appears in chat, loading indicator
```

**Generating Kai Response:**
```typescript
// File: convex/coachMessages.ts, Function: generateCoachResponse
Input: {
  userId: Id<"users">,
  messages: ChatMessage[],  // Conversation history
  habitContext?: HabitInfo[]  // User's habits for context
}

Process:
1. Build system prompt (hardened safeguards)
2. Include last 5 messages as context (not full history, for token efficiency)
3. Include user's habit names and categories
4. Call OpenAI API (LLM_API_KEY from env)
5. Extract response text
6. Run content safety filter (check for harmful content)
7. Save response to chatMessages table
8. Return response to frontend

LLM Call Example:
  Model: gpt-3.5-turbo
  Temperature: 0.7 (creative but not random)
  Max tokens: 300 (keep responses concise)
  
Stored in: chatMessages table (role = "assistant")
User sees: Response appears in chat, smooth animation
```

**Safety & Hardening:**
```
Before LLM Call:
- Rate limit check: 10 msg/hour free, unlimited pro
- Content filter: Block messages with "ignore prompt", "jailbreak", etc.

After LLM Call:
- Response filter: Block if contains advice about stopping meds
- Response filter: Block if contains harmful self-harm content
- Response filter: Ensure compassionate tone

Audit Trail:
- Log all conversations (for compliance)
- Log all API calls (for cost tracking)
- Log any content filters triggered
```

**Conversation History:**
```
User can see all past messages with Kai
- Messages grouped by date
- Searchable by content
- Can delete individual messages or entire chat
- Can export as PDF

Implementation: Query chatMessages ordered by createdAt DESC
```

### 4.4 Billing & Plan Management

**What It Does:**
- Free users get 10 habits, 3 goals
- Pro users get unlimited habits/goals + full Kai coaching
- Users can upgrade to Pro anytime
- Users can downgrade anytime (preserves data)
- System enforces plan limits

**Implementation:**

**Checking Plan Limits:**
```typescript
// File: convex/habits.ts, Function: createHabit
Before creating habit:

If user.plan === "free":
  habitCount = Count(habits where userId = user._id and archived = false)
  if habitCount >= 10:
    throw Error("Free plan max 10 habits. Upgrade to Pro for unlimited.")
    
If user.plan === "pro" or "lifetime":
  Allow unlimited habits

Similar checks for goals:
- If user.plan === "free": max 3 goals
- If user.plan === "pro"/"lifetime": unlimited
```

**Upgrading to Pro:**
```typescript
// File: convex/users.ts, Function: upgradePlan
Input: {
  userId: Id<"users">,
  stripeSubscriptionId: string  // From Clerk Billing
}

Process:
1. Update user.plan = "pro"
2. Set planUpdatedAt = now
3. Clear any archived items (restore them)
4. Log audit event (severity: info)
5. Send email confirmation to user
6. Return updated user

Triggered by: Webhook from Clerk when payment succeeds
User sees: "Upgrade successful" toast, new features enabled
```

**Downgrading from Pro:**
```typescript
// File: convex/users.ts, Function: downgradePlan
Input: {
  userId: Id<"users">,
  reason?: string  // e.g., "subscription_canceled"
}

Process:
1. Update user.plan = "free"
2. Set planUpdatedAt = now
3. Count current habits: if > 10, archive oldest
4. Count current goals: if > 3, archive oldest
5. Move archived items to user.archivedHabits, user.archivedGoals
6. Store archivedByDowngrade = true for each
7. Log audit event with details
8. Send email to user with link to restore
9. Return updated user

Key Feature: Downgrade does NOT delete data, just hides it
User sees: "Downgrade successful" + "View archived items" link
User can: Upgrade later and restore all archived items
```

**Data Preservation on Downgrade:**
```
Before Downgrade:
- 15 habits, 5 goals

Downgrade Happens:
- Only 10 most active habits stay visible
- Oldest 5 habits moved to archived
- Only 3 most active goals stay visible  
- Oldest 2 goals moved to archived

User can see:
- "View Archived" section shows: "5 habits and 2 goals archived"
- Click to view archived items
- "Restore when you upgrade" message

If User Upgrades Again:
- Click "Restore" button
- All 5 habits + 2 goals restored to active
- Historical data (streaks, dates) preserved
```

**Webhook Processing:**
```
File: src/app/api/webhooks/clerk-billing/route.ts

Receives: POST request from Clerk Billing with event

Event Types:
1. customer.subscription.created
   → User just subscribed to Pro
   → Call upgradePlan mutation

2. customer.subscription.updated
   → Subscription details changed (plan, amount)
   → Call updatePlan mutation

3. customer.subscription.deleted
   → User canceled subscription
   → Call downgradePlan mutation

Security:
- Verify webhook signature (using Clerk's signing secret)
- Validate event exists in DB (idempotent)
- Never trust user input, always verify with provider
- Log all events for audit trail
```

---

## Part 5: Frontend Architecture

### 5.1 Page Routes & Components

**Public Pages (No Auth Required):**

`src/app/page.tsx` - Landing page
- Hero section with value proposition
- Feature cards
- Testimonials
- Pricing section
- FAQ
- CTA to sign up

`src/app/sign-up/page.tsx` - User registration
- Clerk SignUp component (handles auth)
- Optional: Custom form wrapper for branding

`src/app/sign-in/page.tsx` - User login
- Clerk SignIn component
- Optional: Custom form wrapper for branding

`src/app/pricing/page.tsx` - Pricing page
- Free tier details
- Pro tier details
- Lifetime details
- Comparison table
- FAQ about billing
- Upgrade button

**Protected Pages (Auth Required):**

`src/app/(dashboard)/page.tsx` - Main dashboard
- Middleware checks auth
- Welcome message
- Today's habits card
- Today's goals card
- Stats/progress widget
- Kai quick tip
- Weekly chart

`src/app/(dashboard)/habits/page.tsx` - Habits list
- All user's habits
- Buttons to create, edit, delete
- Filter by activeRaw/archived
- Search bar

`src/app/(dashboard)/habits/[id]/page.tsx` - Habit detail
- Habit name, description
- Frequency settings
- History/entries chart
- Streak info
- Complete/incomplete button
- Edit/delete buttons

`src/app/(dashboard)/goals/page.tsx` - Goals list
- All user's goals
- Status badges (active/completed/archived)
- Progress bars
- Buttons to create, edit

`src/app/(dashboard)/goals/[id]/page.tsx` - Goal detail
- Goal title and description
- Linked habits
- Progress percentage
- Timeline
- Add/remove habits
- Mark complete button

`src/app/(dashboard)/kai/page.tsx` - Kai chatbot interface
- Chat message thread
- Message input
- Quick action buttons
- Settings button

`src/app/(dashboard)/settings/page.tsx` - Settings/profile
- User profile (name, email, avatar)
- Preferences (timezone, theme, notifications)
- Billing section (current plan, upgrade/downgrade links)
- Privacy/data section (export data, delete account)
- Archived items section

`src/app/payment/success/page.tsx` - Payment success page
- "Payment successful" message
- Shows order details
- DOMPurify sanitizes URL params (prevents XSS)
- Link back to dashboard

`src/app/payment/failure/page.tsx` - Payment failure page
- "Payment failed" message
- Error reason
- Retry link

### 5.2 Component Architecture

**Naming Convention:** `ComponentName.tsx`

**Common Components (Reusable):**

```typescript
// src/components/Button.tsx
export function Button({
  children,
  onClick,
  variant: "primary" | "secondary" | "danger",
  disabled?: boolean,
  ...props
}) {
  // Renders button with Tailwind classes based on variant
}

// src/components/Card.tsx
export function Card({ children, className, ...props }) {
  // Renders bordered/padded container with shadow
}

// src/components/Input.tsx
export function Input({ label, error, ...props }) {
  // Renders form input with label and error message
}

// src/components/Modal.tsx
export function Modal({ isOpen, onClose, children, title }) {
  // Renders modal dialog with backdrop
}

// src/components/Badge.tsx
export function Badge({ variant, children, ...props }) {
  // Renders small colored badge (status, category, etc.)
}

// src/components/Skeleton.tsx
export function Skeleton({ width, height }) {
  // Renders loading placeholder
}

// src/components/Toast.tsx
export function Toast({ type: "success" | "error", message }) {
  // Renders temporary notification
}
```

**Feature Components (Specific to features):**

```typescript
// src/components/HabitCard.tsx
export function HabitCard({ habit, onComplete, onEdit, onDelete }) {
  // Shows habit with streak, completion button, actions
  // Used on dashboard and habits page
}

// src/components/GoalCard.tsx
export function GoalCard({ goal, onEdit, onDelete }) {
  // Shows goal with progress bar, status, actions
}

// src/components/HabitForm.tsx
export function HabitForm({ habitId, onSubmit }) {
  // Form to create/edit habit
  // Fields: name, category, frequency, description
}

// src/components/GoalForm.tsx
export function GoalForm({ goalId, onSubmit }) {
  // Form to create/edit goal
  // Fields: title, description, target date, category
}

// src/components/ChatMessage.tsx
export function ChatMessage({ role, content, timestamp }) {
  // Shows single message in Kai chat
  // User message: right-aligned, blue
  // Kai message: left-aligned, gray background
}

// src/components/MessageInput.tsx
export function MessageInput({ onSend, disabled }) {
  // Text input + send button for Kai chat
}

// src/components/PricingCard.tsx
export function PricingCard({ plan, price, features, onUpgrade }) {
  // Shows pricing plan in card format
  // Used on pricing page
}

// src/components/StatsWidget.tsx
export function StatsWidget({ habits, goals, completionRate }) {
  // Shows summary stats on dashboard
  // Numbers: habit count, goal count, week completion %
}

// src/components/HeatmapCalendar.tsx
export function HeatmapCalendar({ data, title }) {
  // Shows calendar heatmap (like GitHub contribution graph)
  // Color intensity = days completed
}
```

### 5.3 Hooks & Custom Hooks

**Authentication Hook:**
```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  const { userId, user } = useAuth();  // From Clerk
  const { data: userProfile } = useQuery(
    api.users.getProfile,
    { userId }
  );
  return { userId, user, userProfile, isLoading };
}
```

**Mutations Hook:**
```typescript
// src/hooks/useConvexUser.ts
export function useConvexUser() {
  const userId = useClerkUserId();
  const { data: user } = useQuery(api.users.getProfile, { userId });
  
  return user;
}
```

**Habit Tracking Hook:**
```typescript
// src/hooks/useHabits.ts
export function useHabits() {
  const userId = useClerkUserId();
  
  const { data: habits, isLoading } = useQuery(
    api.habits.getHabits,
    { userId: userId! },
    userId ? undefined : "skip"
  );
  
  const completeHabit = useMutation(api.habits.completeHabit);
  
  return { habits, isLoading, completeHabit };
}
```

**API Call Hook:**
```typescript
// src/hooks/useAsync.ts
export function useAsync(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fn().then(setData).catch(setError).finally(() => setLoading(false));
  }, deps);
  
  return { data, loading, error };
}
```

### 5.4 State Management

**Pattern:** Use React hooks (useState, useContext) + Convex queries/mutations

**App-wide State (if needed):**
```typescript
// src/context/AppContext.ts
export const AppContext = createContext();

export function AppProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <AppContext.Provider value={{ notifications, setNotifications, darkMode, setDarkMode }}>
      {children}
    </AppContext.Provider>
  );
}

// Usage in components:
const { notifications } = useContext(AppContext);
```

**Form State Management:**
```typescript
// Simple pattern for forms:
const [formData, setFormData] = useState({
  name: "",
  category: "health"
});

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
```

---

## Part 6: API & Convex Functions

### 6.1 Query Functions (Read-Only, No Side Effects)

**File:** `convex/habits.ts`

```typescript
// Get all habits for a user
export const getHabits = query({
  args: { userId: v.id("users") },
  async handler(ctx, { userId }) {
    const habits = await ctx.db
      .query("habits")
      .filter(q => q.eq(q.field("userId"), userId))
      .filter(q => q.eq(q.field("archived"), false))
      .collect();
    return habits;
  }
});

// Get habit detail with entries
export const getHabitDetail = query({
  args: { habitId: v.id("habits") },
  async handler(ctx, { habitId }) {
    const habit = await ctx.db.get(habitId);
    
    const entries = await ctx.db
      .query("habitEntries")
      .filter(q => q.eq(q.field("habitId"), habitId))
      .order("desc")  // Latest first
      .take(30);      // Last 30 entries
    
    return { ...habit, entries };
  }
});

// Calculate streak
export const getHabitStreak = query({
  args: { habitId: v.id("habits") },
  async handler(ctx, { habitId }) {
    const entries = await ctx.db
      .query("habitEntries")
      .filter(q => q.eq(q.field("habitId"), habitId))
      .order("desc")
      .collect();
    
    // Calculate current streak by iterating from today backwards
    let streak = 0;
    for (const entry of entries) {
      if (entry.completed) {
        streak++;
      } else {
        break;
      }
    }
    
    return { currentStreak: streak };
  }
});
```

**File:** `convex/users.ts`

```typescript
// Get user profile
export const getProfile = query({
  args: { userId: v.id("users") },
  async handler(ctx, { userId }) {
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    return user;
  }
});

// Get user's plan
export const getPlan = query({
  args: { userId: v.id("users") },
  async handler(ctx, { userId }) {
    const user = await ctx.db.get(userId);
    return user?.plan || "free";
  }
});
```

### 6.2 Mutation Functions (Write Data, Side Effects)

**File:** `convex/habits.ts`

```typescript
// Create a new habit
export const createHabit = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    category: v.union(v.literal("health"), v.literal("learning"), ...),
    frequency: v.union(v.literal("daily"), v.literal("weekly")),
    weekDays: v.optional(v.array(v.number())),
    description: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId);
    
    // Check plan limit
    const habitCount = await ctx.db
      .query("habits")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .filter(q => q.eq(q.field("archived"), false))
      .count();
    
    if (user.plan === "free" && habitCount >= 10) {
      throw new Error("Free plan limit: 10 habits. Upgrade to Pro.");
    }
    
    // Create habit
    const habitId = await ctx.db.insert("habits", {
      userId: args.userId,
      name: args.name,
      category: args.category,
      frequency: args.frequency,
      weekDays: args.weekDays || [],
      description: args.description,
      archived: false,
      archivedByDowngrade: false,
      startDate: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Log audit event
    await ctx.db.insert("auditLog", {
      userId: args.userId,
      action: "habit_created",
      resourceType: "habit",
      resourceId: habitId,
      severity: "info",
      createdAt: Date.now(),
    });
    
    return await ctx.db.get(habitId);
  }
});

// Complete a habit (mark as done for a day)
export const completeHabit = mutation({
  args: {
    habitId: v.id("habits"),
    userId: v.id("users"),
    date: v.number(),  // unix timestamp
    mood: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  async handler(ctx, args) {
    // Create entry
    const entryId = await ctx.db.insert("habitEntries", {
      habitId: args.habitId,
      userId: args.userId,
      completionDate: args.date,
      completed: true,
      mood: args.mood,
      notes: args.notes,
      completedAt: Date.now(),
      createdAt: Date.now(),
    });
    
    // Recalculate streak
    const entries = await ctx.db
      .query("habitEntries")
      .filter(q => q.eq(q.field("habitId"), args.habitId))
      .order("desc")
      .collect();
    
    let streak = 0;
    for (const entry of entries) {
      if (entry.completed) streak++;
      else break;
    }
    
    // Log audit event
    await ctx.db.insert("auditLog", {
      userId: args.userId,
      action: "habit_completed",
      resourceType: "habitEntry",
      resourceId: entryId,
      severity: "info",
      createdAt: Date.now(),
    });
    
    return { success: true, streak };
  }
});

// Archive habit
export const archiveHabit = mutation({
  args: {
    habitId: v.id("habits"),
    userId: v.id("users"),
    reason: v.optional(v.string()),  // "user" or "downgrade"
  },
  async handler(ctx, args) {
    const habit = await ctx.db.get(args.habitId);
    if (habit.userId.toString() !== args.userId.toString()) {
      throw new Error("Not authorized");
    }
    
    await ctx.db.patch(args.habitId, {
      archived: true,
      archivedByDowngrade: args.reason === "downgrade",
      archivedAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Log audit event
    await ctx.db.insert("auditLog", {
      userId: args.userId,
      action: "habit_archived",
      resourceType: "habit",
      resourceId: args.habitId,
      details: { reason: args.reason },
      severity: "info",
      createdAt: Date.now(),
    });
    
    return { success: true };
  }
});
```

**File:** `convex/users.ts`

```typescript
// Upgrade plan (called when Clerk webhook received)
export const upgradePlan = mutation({
  args: {
    userId: v.id("users"),
    plan: v.union(v.literal("pro"), v.literal("lifetime")),
    stripeSubscriptionId: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId);
    
    // Update user plan
    await ctx.db.patch(args.userId, {
      plan: args.plan,
      planUpdatedAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Restore any archived habits/goals (optional)
    const archivedHabits = await ctx.db
      .query("habits")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .filter(q => q.eq(q.field("archived"), true))
      .filter(q => q.eq(q.field("archivedByDowngrade"), true))
      .collect();
    
    for (const habit of archivedHabits) {
      await ctx.db.patch(habit._id, {
        archived: false,
        archivedByDowngrade: false,
        archivedAt: undefined,
      });
    }
    
    // Similar for goals...
    
    // Log audit event
    await ctx.db.insert("auditLog", {
      userId: args.userId,
      action: "plan_upgraded",
      resourceType: "user",
      details: { newPlan: args.plan },
      severity: "info",
      createdAt: Date.now(),
    });
    
    // TODO: Send email to user
    
    return { success: true };
  }
});

// Downgrade plan (called when Clerk webhook received)
export const downgradePlan = mutation({
  args: {
    userId: v.id("users"),
    plan: v.literal("free"),
  },
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId);
    
    // Update user plan
    await ctx.db.patch(args.userId, {
      plan: "free",
      planUpdatedAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Archive excess habits (keep only 10 most recent, active ones)
    const habits = await ctx.db
      .query("habits")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .filter(q => q.eq(q.field("archived"), false))
      .order("desc")  // Most recent first
      .collect();
    
    const toArchive = habits.slice(10);  // All beyond #10
    for (const habit of toArchive) {
      await ctx.db.patch(habit._id, {
        archived: true,
        archivedByDowngrade: true,
        archivedAt: Date.now(),
      });
    }
    
    // Archive excess goals (keep only 3)
    const goals = await ctx.db
      .query("goals")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .filter(q => q.eq(q.field("status"), "active"))
      .order("desc")
      .collect();
    
    const goalsToArchive = goals.slice(3);
    for (const goal of goalsToArchive) {
      await ctx.db.patch(goal._id, {
        archived: true,
        archivedByDowngrade: true,
        archivedAt: Date.now(),
      });
    }
    
    // Update user object with archived IDs
    await ctx.db.patch(args.userId, {
      archivedHabits: toArchive.map(h => h._id),
      archivedGoals: goalsToArchive.map(g => g._id),
    });
    
    // Log audit event
    await ctx.db.insert("auditLog", {
      userId: args.userId,
      action: "plan_downgraded",
      resourceType: "user",
      details: {
        habitsArchived: toArchive.length,
        goalsArchived: goalsToArchive.length,
      },
      severity: "warning",
      createdAt: Date.now(),
    });
    
    // TODO: Send email to user with restore link
    
    return { success: true };
  }
});
```

### 6.3 Actions (Long-running, External API Calls)

**File:** `convex/coachMessages.ts`

```typescript
// Generate response from Kai (LLM)
export const generateCoachResponse = action({
  args: {
    userId: v.id("users"),
    userMessage: v.string(),
    habitContext: v.optional(v.array(v.object({
      name: v.string(),
      category: v.string(),
      streak: v.optional(v.number()),
    }))),
  },
  async handler(ctx, args) {
    // Build conversation history (last 5 messages for context)
    const recentMessages = await ctx.runQuery(
      internal.coachMessages.getRecentMessages,
      { userId: args.userId, limit: 5 }
    );
    
    // Build system prompt
    const systemPrompt = `You are Kai, a compassionate AI coaching assistant for Ascendify.
    
Your role:
- Help users build and maintain positive habits
- Provide evidence-based habit formation advice
- Offer encouragement and support
- Ask clarifying questions to understand better

Constraints (CRITICAL - NEVER violate these):
- You are NOT a medical doctor or therapist
- Never recommend stopping prescribed medication without consulting a doctor
- Always recommend consulting mental health professionals for serious concerns
- Never provide diagnosis or medical treatment advice
- Keep responses concise (under 150 words)
- Be warm, supportive, and practical
- If user mentions self-harm or suicidal thoughts, immediately suggest contacting crisis hotline

User's current habits:
${args.habitContext?.map(h => `- ${h.name} (${h.category}${h.streak ? `, ${h.streak}-day streak` : ''})`).join('\n')}

Respond naturally and helpfully within your constraints.`;
    
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...recentMessages,
          { role: "user", content: args.userMessage },
        ],
        temperature: 0.7,
        max_tokens: 300,
        top_p: 1,
      }),
    });
    
    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // Safety filter
    const harmfulKeywords = [
      "stop your medication",
      "stop taking your",
      "no medication",
      "harm yourself",
    ];
    
    if (harmfulKeywords.some(kw => content.toLowerCase().includes(kw))) {
      // Return safe response instead
      content = "I appreciate your question, but I'm not able to give advice about medications. Please consult with your doctor or healthcare provider.";
    }
    
    // Save response to database
    await ctx.runMutation(internal.coachMessages.saveMessage, {
      userId: args.userId,
      role: "assistant",
      content: content,
      model: "gpt-3.5-turbo",
      tokens: data.usage.completion_tokens,
    });
    
    return { content };
  }
});
```

---

## Part 7: Security & Compliance

### 7.1 Authentication Security

**Clerk Handles:**
- User account creation and management
- Password hashing and reset flow
- Multi-factor authentication
- Session management
- CSRF protection

**What We Handle:**
- Verify userId in every mutation/query
- Check user authorization (user A cannot access user B's data)
- Assume Clerk session is valid (Convex handles this)

**Authorization Pattern:**
```typescript
export const completeHabit = mutation({
  args: { habitId: v.id("habits"), userId: v.id("users") },
  async handler(ctx, args) {
    const habit = await ctx.db.get(args.habitId);
    
    // Verify habit belongs to user
    if (habit.userId.toString() !== args.userId.toString()) {
      throw new Error("Not authorized");
    }
    
    // Safe to proceed
  }
});
```

### 7.2 Data Security

**At Rest:**
- Convex handled (database encrypted)
- User passwords managed by Clerk

**In Transit:**
- HTTPS/TLS everywhere
- Convex handles API encryption

**Access Control:**
- User can only see own data (enforced via userId checks)
- API keys secured in environment variables
- NoLogging of sensitive data (passwords, payment cards, PII)

### 7.3 Payment Security

**Stripe/Clerk Handles:**
- PCI DSS compliance
- Card data encryption
- Fraud detection
- Payment processing

**We Handle:**
- Payment success/failure page sanitization (DOMPurify)
- Webhook signature verification
- No storage of card details (Stripe handles this)

### 7.4 Data Privacy

**GDPR Compliance:**
- Users can export data (CSV export)
- Users can delete account
- Retention policies documented
- Privacy policy accessible on site

**Data Deletion:**
```typescript
// When user deletes account:
1. Delete user profile
2. Delete user's habits
3. Delete user's goals
4. Delete user's habitEntries  
5. Delete user's chat history
6. Anonymize audit logs (keep for compliance, remove PII)
7. Initiate vendor deletion (email Stripe, Clerk, etc.)

This should be an "async job" to avoid timeout
```

### 7.5 API Rate Limiting

**Kai Chatbot:**
- Free users: 10 messages per hour
- Pro users: 100 messages per hour
- Lifetime users: Unlimited

**Implementation:**
```typescript
export const createCoachMessage = mutation({
  args: { userId: v.id("users"), content: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId);
    
    // Check rate limit
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentMessages = await ctx.db
      .query("chatMessages")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .filter(q => q.eq(q.field("role"), "user"))
      .filter(q => q.gt(q.field("createdAt"), oneHourAgo))
      .count();
    
    const limit = user.plan === "free" ? 10 : (user.plan === "lifetime" ? Infinity : 100);
    
    if (recentMessages >= limit) {
      throw new Error("Rate limit exceeded. Try again in an hour.");
    }
    
    // Proceed...
  }
});
```

---

## Part 8: Testing Strategy

### 8.1 Unit Tests

**File:** `src/__tests__/habits.test.ts`

```typescript
import { describe, it, expect, beforeEach } from "@jest/globals";
import { calculateStreak } from "@/lib/habitUtils";

describe("Habit Utilities", () => {
  describe("calculateStreak", () => {
    it("should return 0 for empty entries", () => {
      const result = calculateStreak([]);
      expect(result).toBe(0);
    });
    
    it("should count consecutive completed days", () => {
      const entries = [
        { completed: true },
        { completed: true },
        { completed: true },
      ];
      const result = calculateStreak(entries);
      expect(result).toBe(3);
    });
    
    it("should stop at first incomplete", () => {
      const entries = [
        { completed: true },
        { completed: true },
        { completed: false }, // Break
        { completed: true },
      ];
      const result = calculateStreak(entries);
      expect(result).toBe(0); // Resets at break
    });
  });
});
```

### 8.2 Integration Tests

**File:** `convex/__tests__/habits.integration.test.ts`

```typescript
// These test Convex mutations/queries directly
// Set up: Create test user, run mutation, verify database state

describe("Habit Creation", () => {
  it("should create habit for user within plan limit", async () => {
    // 1. Create user
    // 2. Call createHabit mutation
    // 3. Verify habit exists in database
    // 4. Verify audit log created
  });
  
  it("should prevent habit creation exceeding free limit", async () => {
    // 1. Create free user
    // 2. Create 10 habits (max for free)
    // 3. Attempt to create 11th
    // 4. Expect error "Free plan limit: 10 habits"
  });
});
```

### 8.3 E2E Tests

**File:** `tests/e2e/habitFlow.test.ts`

```typescript
// Using Playwright or similar
// Tests: actual user workflows in real browser

test("User can create habit and track completion", async ({ page }) => {
  // 1. Sign up
  // 2. Complete onboarding
  // 3. Create habit
  // 4. Go to dashboard
  // 5. Click "Complete" button
  // 6. Verify habit shows as completed
  // 7. Verify streak = 1
  // 8. Verify audit log exists
});
```

### 8.4 Test Coverage Targets

```
Target: 95%+ coverage across critical paths

- Auth/security features: 100%
- Payment/billing: 100%
- Habit creation/tracking: 95%
- Goal management: 90%
- Kai chatbot: 85% (can be harder to test LLM)
- UI components: 80%

Total: 95%+ average
```

---

## Part 9: Deployment & Operations

### 9.1 Deployment Architecture

```
Code Repository (GitHub)
  ↓ (push to main)
CI/CD Pipeline (GitHub Actions)
  ├─ Run tests (unit + integration)
  ├─ Build artifact
  ├─ Security scan
  ├─ Performance test
  ↓ (if all pass)
Staging Environment
  ├─ Deploy candidate version
  ├─ Full test suite
  ├─ Manual QA
  ├─ Performance benchmark
  ↓ (if approved)
Production Environment (Canary)
  ├─ Deploy to 5% of users
  ├─ Monitor metrics (1 hour)
  ├─ Check error rate, latency
  ↓ (if stable, proceed to wide rollout)
Production Environment (Wide)
  ├─ Deploy to 100% of users
  ├─ Continuous monitoring
  ├─ Support team on standby
```

### 9.2 Monitoring & Alerts

**Metrics to Monitor:**

| Metric | Alert Threshold | Action |
|--------|-----------------|--------|
| Error Rate | > 0.5% | page ops, investigate |
| API Latency (p99) | > 1000ms | check database, scaling |
| Database Connection Pool | > 90% | increase capacity |
| Disk usage | > 90% | cleanup, expand |
| Status Page | Down | immediate investigation |

**Logs to Aggregate:**

```
CloudLogging (or similar):
- All API calls (method, endpoint, latency)
- Errors and exceptions (full stack trace)
- Business events (user action like "habit_completed")
- Security events (failed login, unauthorized access)
- Webhook events (Clerk billing notifications)

Retention: 30 days default
High-risk logs (security): 1 year
```

### 9.3 Incident Response

**Severity Levels:**

| Level | Impact | Response Time |
|-------|--------|----------------|
| P1 | Complete outage | Immediate |
| P2 | Degraded (some users affected) | 15 min |
| P3 | Minor issue | 1 hour |
| P4 | Documentation issue | Next business day |

**Response Steps:**

1. **Detect:** Monitoring alerts or user report
2. **Acknowledge:** Respond on-call pager
3. **Investigate:** Check logs, database, APIs
4. **Mitigate:** Quick fix or rollback
5. **Resolve:** Permanent fix deployed
6. **Postmortem:** Document root cause, prevent recurrence

---

## Part 10: Codebase Navigation Guide for AI Models

### 10.1 Finding Specific Features

**Question: Where is the habit creation code?**
- Frontend: `src/app/(dashboard)/habits/page.tsx` and `src/components/HabitForm.tsx`
- Backend: `convex/habits.ts`, function `createHabit`
- Tests: `src/__tests__/habits.test.ts`

**Question: Where is the payment system?**
- Webhook handler: `src/app/api/webhooks/clerk-billing/route.ts`
- Mutations: `convex/users.ts`, functions `upgradePlan` and `downgradePlan`
- Frontend: `src/app/pricing/page.tsx`
- Tests: `src/__tests__/billing.integration.test.ts`

**Question: Where is Kai chatbot code?**
- Frontend UI: `src/app/(dashboard)/kai/page.tsx` and `src/components/chatbot/`
- Backend: `convex/coachMessages.ts`
- LLM integration: `convex/coachMessages.ts`, function `generateCoachResponse`

**Question: Where is the database?**
- Schema: `convex/schema.ts`
- Migrations: `convex/_generated/` (auto-generated)
- Queries: Various files in `convex/` that export queries
- Mutations: Various files in `convex/` that export mutations

### 10.2 File Structure Reference

```
src/
├── app/                 ← Next.js pages/routes
│   ├── page.tsx              ← Landing page
│   ├── sign-up/page.tsx      ← Sign up page
│   ├── sign-in/page.tsx      ← Sign in page
│   ├── (dashboard)/          ← Auth-required routes
│   │   ├── page.tsx          ← Main dashboard
│   │   ├── habits/page.tsx   ← Habits list
│   │   ├── goals/page.tsx    ← Goals list
│   │   ├── kai/page.tsx      ← Chatbot
│   │   └── settings/page.tsx ← Settings
│   ├── api/                  ← API routes
│   │   └── webhooks/clerk-billing/route.ts ← Billing webhook
│   ├── payment/
│   │   ├── success/page.tsx
│   │   └── failure/page.tsx
│   ├── pricing/page.tsx      ← Pricing page
│   ├── layout.tsx            ← Root layout
│   └── globals.css           ← Global styles
│
├── components/          ← React components
│   ├── common/          ← Reusable components (Button, Card, etc.)
│   ├── dashboard/       ← Dashboard-specific components
│   ├── chatbot/         ← Kai chatbot components
│   └── forms/           ← Form components
│
├── hooks/               ← Custom React hooks
│   ├── useAuth.ts
│   ├── useHabits.ts
│   ├── useConvexUser.ts
│   └── useAsync.ts
│
├── lib/                 ← Utility functions
│   ├── habitUtils.ts    ← Habit calculation helpers
│   ├── dateUtils.ts     ← Date manipulation
│   └── api.ts           ← API call helpers
│
├── types/               ← TypeScript type definitions
│   ├── habits.ts
│   ├── goals.ts
│   └── users.ts
│
└── __tests__/           ← Unit tests
    ├── habits.test.ts
    ├── habits.integration.test.ts
    └── ...

convex/
├── schema.ts            ← Database schema
├── auth.config.js       ← Clerk auth config
├── users.ts             ← User queries/mutations
├── habits.ts            ← Habit queries/mutations
├── goals.ts             ← Goal queries/mutations
├── coachMessages.ts     ← Kai chatbot messages
├── dailyPlans.ts        ← Daily planning feature
├── focusSessions.ts     ← Focus tracking
├── gamification.ts      ← Leaderboards, badges
├── insights.ts          ← Analytics insights
├── wellness.ts          ← Wellness tracking
└── _generated/          ← Auto-generated (don't edit)
    ├── api.d.ts
    ├── api.js
    └── server.d.ts

docs/
├── PRODUCTION-READINESS-COMPLETE.md ← THIS FILE
├── ASCEND-UNIFIED-EXECUTION-MASTER.md ← Project master plan
└── ... (14+ comprehensive docs)

package.json            ← Dependencies, scripts
tsconfig.json           ← TypeScript config
next.config.js          ← Next.js config
convex/tsconfig.json    ← Convex TypeScript config
tailwind.config.js      ← Tailwind CSS config
jest.config.js          ← Jest testing config
```

---

## Summary for AI Models

**This document provides:**
1. ✅ Complete platform overview and user journey
2. ✅ Full technology stack explanation
3. ✅ Detailed database schema with relationships
4. ✅ Feature implementation details with code examples
5. ✅ Frontend architecture and component structure
6. ✅ Backend API functions (queries, mutations, actions)
7. ✅ Security, compliance, and privacy measures
8. ✅ Testing strategy and coverage targets
9. ✅ Deployment, monitoring, and incident response
10. ✅ Codebase navigation guide

**Use this document to:**
- Understand the complete architecture
- Locate specific features quickly
- Generate code that fits the existing patterns
- Understand security and compliance requirements
- Contribute to testing and documentation

---

**Generated for:** GitHub Copilot and smaller AI models  
**Level:** Comprehensive architectural documentation  
**Audience:** Any AI language model needing to understand Ascendify codebase

