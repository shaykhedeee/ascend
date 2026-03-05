plan 1 : "

Max
COMPREHENSIVE RESURGO.LIFE RESTRUCTURING & ENHANCEMENT PROMPT
🎯 EXECUTIVE SUMMARY
You are tasked with a major restructuring of Resurgo.Life - transforming it from a feature-heavy wellness app into a streamlined, AI-coach-centric personal development platform with a cohesive terminal aesthetic. The core philosophy: AI Coaches are the central intelligence that orchestrates everything; all features are tools the AI uses to help users.

📋 CRITICAL CONTEXT & PHILOSOPHY
Core Concept Shift
text

BEFORE: Multiple disconnected features users navigate manually
AFTER: AI Coach-centric system where coaches intelligently use all features

ANALOGY: 
- Not a toolbox where user picks tools
- But a personal assistant who knows which tools to use when

USER INTERACTION MODEL:
User → AI Coach → AI Coach uses (tasks, habits, goals, brain dump, etc.) → Results

The AI Coaches are the interface; features are the backend capabilities.
Design Philosophy
text

AESTHETIC: Terminal/Command-line inspired (not generic modern widgets)
SIMPLICITY: Distraction-free, organized, intuitive
INTELLIGENCE: AI understands context, validates data, proactive suggestions
COHESION: Everything feels like one unified system, not separate features
🗂️ NEW INFORMATION ARCHITECTURE
Proposed Sidebar Structure
text

┌─ RESURGO SIDEBAR ─────────────────────────────────────────┐
│                                                             │
│  [🔶 RESURGO LOGO]                                         │
│                                                             │
│  ▼ DASHBOARD                                               │
│    ├─ Goals                                                │
│    ├─ Habits                                               │
│    ├─ Tasks                                                │
│    ├─ Calendar                                             │
│    └─ Analytics                                            │
│                                                             │
│  🤖 AI COACH ★ (Main Intelligence Hub)                     │
│                                                             │
│  ▼ PERSONAL                                                │
│    ├─ Vision Board                                         │
│    ├─ Journal                                              │
│    └─ Mood Tracker                                         │
│                                                             │
│  ▼ WELLNESS                                                │
│    ├─ Mood                                                 │
│    ├─ Fitness                                              │
│    ├─ Journal (or move to Personal?)                       │
│    ├─ Sleep                                                │
│    └─ Meditation                                           │
│                                                             │
│  ▼ HEALTH                                                  │
│    ├─ Calorie Tracker                                      │
│    ├─ Diet Plan                                            │
│    ├─ Water Tracker                                        │
│    └─ Nutrition Analytics                                  │
│                                                             │
│  ▼ FITNESS                                                 │
│    ├─ Running                                              │
│    ├─ Workout Plans                                        │
│    ├─ Weight Management                                    │
│    └─ Exercise Library                                     │
│                                                             │
│  ▼ WEALTH (Optional - evaluate feasibility)                │
│    ├─ Budget                                               │
│    ├─ Business                                             │
│    ├─ Wish List                                            │
│    └─ Personal Assets (gold, stocks with live prices)      │
│                                                             │
│  ⚙️ SETTINGS                                               │
│  📚 HELP & DOCS                                            │
│  👤 PROFILE                                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘

NOTES:
- Collapsible sections (▼ when expanded, ► when collapsed)
- Active item highlighted
- Consistent spacing and alignment
- Icons: Simple, pixelated style
- AI COACH marked with ★ to indicate primary feature
Rationale for Structure
DASHBOARD (Collapsible)

Core productivity tools users access frequently
Keeps related planning features together
Calendar and Analytics added here (removed from standalone tabs)
AI COACH (Standalone, Prominent)

THE primary interface for user interaction
Houses Plan Builder, Brain Dump, AI Orchestrator, Deep Scan
Users can chat with 4 specialized coaches
Coaches intelligently add tasks, update diet, modify plans, etc.
PERSONAL (Wellness-focused, non-physical)

Vision Board (manifestation, goals visualization)
Journal (thoughts, reflections)
Mood Tracker (emotional state)
WELLNESS (Mental & Spiritual Health)

Meditation, mood, sleep
Separate from physical fitness
HEALTH (Nutrition & Diet)

All food, water, calorie tracking
Diet plans and nutrition analytics
FITNESS (Physical Activity)

Workouts, running, weight tracking
Exercise-related features
WEALTH (Evaluate Implementation)

Financial tracking (budget, business, assets)
Live price tracking for gold/stocks (use free APIs if available)
Wish list for goal-oriented saving
DECISION NEEDED: Is this core to Resurgo's mission? If not, skip for MVP.
🤖 AI COACH SYSTEM - DETAILED SPECIFICATION
The Central Intelligence Hub
text

CONCEPT:
AI Coach tab is NOT just a chatbot. It's the command center where:
1. User communicates goals, tasks, thoughts
2. AI intelligently routes to appropriate features
3. AI provides feedback, suggestions, validation
4. AI learns user patterns and proactively assists

FOUR SPECIALIZED COACHES:

1. TITAN (Fitness & Physical Health)
   - Expertise: Workouts, nutrition, weight management, sleep
   - Personality: Motivational, disciplined, tough-love
   - Color: Red/Orange
   - Icon: Flexed arm pixel art

2. SAGE (Business & Wealth)
   - Expertise: Budget, business planning, financial goals
   - Personality: Wise, analytical, strategic
   - Color: Gold/Yellow
   - Icon: Lightbulb or coin pixel art

3. HARMONY (Mental & Emotional Wellness)
   - Expertise: Mood, meditation, journaling, stress
   - Personality: Calm, empathetic, supportive
   - Color: Purple/Blue
   - Icon: Lotus or heart pixel art

4. NEXUS (Productivity & Planning)
   - Expertise: Tasks, habits, goals, time management
   - Personality: Efficient, organized, focused
   - Color: Green/Cyan
   - Icon: Checklist or circuit pixel art
AI Coach Dashboard Design
text

┌─ AI COACH ─────────────────────────────────────────────────┐
│                                                             │
│  "Which coach would you like to speak with?"               │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐                         │
│  │   TITAN     │  │    SAGE     │                         │
│  │  [💪 icon]  │  │  [💡 icon]  │                         │
│  │  Fitness    │  │  Wealth     │                         │
│  └─────────────┘  └─────────────┘                         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐                         │
│  │  HARMONY    │  │   NEXUS     │                         │
│  │  [🧘 icon]  │  │  [✓ icon]   │                         │
│  │  Wellness   │  │ Productivity│                         │
│  └─────────────┘  └─────────────┘                         │
│                                                             │
│  OR: General conversation (AI auto-routes to expert)       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ > Ask anything or use @ to specify coach...         │  │
│  │   Examples:                                          │  │
│  │   "@titan create a workout plan for me"             │  │
│  │   "I want to start a business" (Sage responds)      │  │
│  │   "Add task: finish proposal by Friday" (Nexus)     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ─────── RECENT CONVERSATIONS ───────                      │
│  • [Nexus] Helped you plan your week                       │
│  • [Titan] Created your workout routine                    │
│  • [Harmony] Suggested meditation for stress               │
│                                                             │
└─────────────────────────────────────────────────────────────┘

INTERACTION MODEL:

User Input → AI Analysis → Route to Specialist Coach → Execute Action

Example Flow 1:
User: "I drank 7 liters of water in 2 hours"
AI: Detects impossible data
Titan (or general AI): "Hold on! 7 liters in 2 hours is dangerous and unlikely. Did you mean 0.7 liters or over a longer period? Let's update that."

Example Flow 2:
User: "I got a $5000 bonus today!"
Sage: "Congratulations! 🎉 I've added it to your budget. Here are some suggestions:
- Emergency fund: $2000
- Invest in index funds: $2000
- Treat yourself: $500
- Savings goal (vacation): $500
Would you like me to create tasks for these?"

Example Flow 3:
User: "I'm starting a coffee shop business"
Sage: "Exciting! I've created a business entry under Wealth > Business.
Let's break this down:
1. [Task added] Research coffee shop market in your area
2. [Task added] Draft business plan
3. [Goal created] Launch coffee shop in 6 months
4. [Reminder set] Weekly business planning session
Want to add more details?"

Example Flow 4:
User: "Add task: gym at 6am tomorrow"
Nexus: "Task added for 6:00 AM tomorrow. I noticed you have a workout plan with Titan. Should I sync this with your routine?"
(If yes, also updates Fitness > Workout Plans)
AI Coach Capabilities Matrix
text

ACTION TYPE              | TITAN | SAGE | HARMONY | NEXUS
─────────────────────────┼───────┼──────┼─────────┼───────
Add/modify tasks         |   ✓   |  ✓   |    ✓    |   ✓✓
Create/update goals      |   ✓   |  ✓✓  |    ✓    |   ✓
Add habits               |   ✓✓  |  ✓   |    ✓✓   |   ✓
Log meals/calories       |   ✓✓  |      |         |   
Create diet plan         |   ✓✓  |      |         |   
Log workouts             |   ✓✓  |      |         |   
Track sleep              |   ✓✓  |      |    ✓    |   
Budget entries           |       |  ✓✓  |         |   
Business tracking        |       |  ✓✓  |         |   
Mood logging             |       |      |    ✓✓   |   
Journal prompts          |       |      |    ✓✓   |   
Meditation guidance      |       |      |    ✓✓   |   
Schedule optimization    |   ✓   |  ✓   |    ✓    |   ✓✓
Vision board creation    |   ✓   |  ✓   |    ✓✓   |   ✓
Analytics generation     |   ✓   |  ✓   |    ✓    |   ✓✓
Data validation          |   ✓✓  |  ✓✓  |    ✓✓   |   ✓✓

✓✓ = Primary expertise
✓  = Can assist
Integration of Advanced AI Features
Under AI Coach Tab, create sub-sections or integrated tools:

Brain Dump

Quick access button in AI Coach interface
User rapidly types thoughts/tasks/ideas
AI processes and categorizes:
Tasks → Tasks tab
Goals → Goals tab
Business ideas → Wealth > Business
Workout notes → Fitness
Food to try → Health > Diet Plan
UI: Terminal-style rapid input area
text

┌─ BRAIN DUMP ─────────────────────────────┐
│ >_ Dump everything on your mind...       │
│                                           │
│ [User types freely]                       │
│ "need to call mom, workout tomorrow,      │
│  business idea: meal prep service,        │
│  buy protein powder, meditate daily"      │
│                                           │
│ [PROCESS] ← AI analyzes                   │
│                                           │
│ AI Response:                              │
│ ✓ Task: Call mom (added to Tasks)        │
│ ✓ Task: Workout tomorrow 7am (Fitness)    │
│ ✓ Business: Meal prep service (Wealth)    │
│ ✓ Shopping: Protein powder (Wish List)    │
│ ✓ Habit: Daily meditation (Habits)        │
└───────────────────────────────────────────┘
Plan Builder

Onboarding tool (runs at signup)
Also accessible anytime from AI Coach
User answers questions → AI generates comprehensive plan
UI: Wizard/step-by-step OR conversational with AI coach
Output: Populates goals, habits, tasks, diet plan, workout plan
Deep Scan

In-depth user profiling (part of onboarding)
Periodic re-scans (monthly check-ins)
AI asks probing questions to understand user deeply
Updates user model for better personalization
AI Orchestrator

Backend system (not a UI feature)
Manages multi-model AI pipeline
Routes complex tasks through multiple AI models
User doesn't see this; it powers all AI responses
Documentation mention: Explain in Help/Docs that Resurgo uses 15+ AI models working together
AI Coach Behavior Rules
JavaScript

// Pseudo-logic for AI Coach system

class AICoachSystem {
  
  async handleUserMessage(message, context) {
    // 1. Detect intent
    const intent = await detectIntent(message);
    
    // 2. Validate data
    if (intent.type === 'log_data') {
      const validation = validateData(intent.data);
      if (!validation.valid) {
        return {
          coach: 'general',
          response: validation.warningMessage,
          action: 'request_correction'
        };
      }
    }
    
    // 3. Route to appropriate coach
    const coach = routeToCoach(intent);
    
    // 4. Execute action
    const result = await coach.execute(intent, context);
    
    // 5. Update relevant features
    await updateFeatures(result);
    
    // 6. Generate response
    return coach.generateResponse(result);
  }
  
  validateData(data) {
    // Example: Water intake validation
    if (data.type === 'water' && data.amount > 5 && data.timeframe < 4) {
      return {
        valid: false,
        warningMessage: "Whoa! Drinking that much water so quickly can be dangerous. Did you mean to log this over a longer period?"
      };
    }
    
    // Example: Calorie validation
    if (data.type === 'calories' && data.amount > 5000) {
      return {
        valid: false,
        warningMessage: "That's a lot of calories! Are you sure about this number? A typical meal is 500-800 calories."
      };
    }
    
    // Example: Sleep validation
    if (data.type === 'sleep' && data.hours > 16) {
      return {
        valid: false,
        warningMessage: "16+ hours of sleep is unusual. Are you feeling okay? If this is accurate, you might want to consult a doctor."
      };
    }
    
    return { valid: true };
  }
  
  routeToCoach(intent) {
    const intentCoachMap = {
      'fitness': Titan,
      'workout': Titan,
      'nutrition': Titan,
      'sleep': Titan,
      'budget': Sage,
      'business': Sage,
      'finance': Sage,
      'mood': Harmony,
      'meditation': Harmony,
      'journal': Harmony,
      'stress': Harmony,
      'task': Nexus,
      'goal': Nexus,
      'habit': Nexus,
      'schedule': Nexus
    };
    
    return intentCoachMap[intent.category] || Nexus; // Default to Nexus
  }
}

// Example usage
User: "I just ran 5k in 18 minutes!"
AI: Detects fitness achievement
Titan: "Incredible pace! 🏃‍♂️ That's a 3:36 min/km pace - elite level! I've logged this in your running tracker. Want to set a new PR goal?"
Action: Logs workout, suggests new goal, updates fitness analytics

User: "@sage I earned $500 from freelancing"
AI: Routes to Sage
Sage: "Nice work! I've added $500 to your income. Your monthly total is now $3,200. You're 64% toward your monthly goal. Should I allocate this to savings or investments?"
Action: Updates budget, calculates progress, awaits user decision
AI Coach Proactive Behavior
text

SCENARIOS WHERE AI COACHES POP UP:

1. Missed Habit (Harmony):
   "Hey! I noticed you haven't meditated today. You've got a 15-day streak going. 
    Want to do a quick 5-minute session now?"
   [Start Meditation] [Skip Today] [Remind Me Later]

2. Goal Deadline Approaching (Nexus):
   "Your goal 'Finish Project Proposal' is due in 3 days and only 40% complete. 
    Let's create a sprint plan to get this done."
   [Create Plan] [Extend Deadline] [Mark as Complete]

3. Calorie Budget Alert (Titan):
   "You've consumed 2,100 calories today (88% of budget). 
    For dinner, I suggest a 300-calorie meal. Here are some options..."
   [View Suggestions] [Log Dinner] [Adjust Budget]

4. Sleep Deficit Warning (Titan):
   "You've averaged 5.5 hours of sleep this week. This impacts recovery and focus. 
    Can we aim for 7 hours tonight? I'll remind you at 10 PM to start winding down."
   [Set Reminder] [I'll Manage] [Tell Me More]

5. Business Milestone (Sage):
   "Congrats on hitting $10K revenue in your business! 🎉 
    This is a 25% increase from last month. Should we update your growth projections?"
   [Yes, Update] [View Analytics] [Celebrate Later]

6. Mood Pattern Detection (Harmony):
   "I've noticed your mood has been low for 5 consecutive days. 
    This isn't like you. Want to talk about what's going on or try some stress-relief exercises?"
   [Journal About It] [Breathing Exercise] [I'm Okay]

IMPLEMENTATION:
- Triggered by data patterns, not just scheduled
- User can disable proactive notifications in Settings
- Respect quiet hours (no notifications during sleep time)
- Limit to 2-3 proactive messages per day (avoid spam)
🎨 LANDING PAGE / HOMEPAGE REDESIGN
Current Issues Identified
text

❌ Menu items aligned to top (not vertically centered)
❌ Auto-scroll to demo section (disruptive)
❌ Features shown but not creatively
❌ Missing key features (Brain Dump, AI Orchestrator, AI Coaches)
❌ Inconsistent button designs (some tiny fonts)
❌ "How It Works" section plain
❌ AI Coach section layout weird
❌ Pricing lacks yearly toggle
❌ Review section headings don't stand out
❌ AI Habit Planner too large, needs companion feature
❌ Popup design not terminal-themed
❌ Email verification says "Ascend" not "Resurgo"
❌ PWA install button says "Install as PWA" (too technical)
Fixed Structure & Design
1. HEADER / NAVIGATION
text

┌─ HEADER ───────────────────────────────────────────────────┐
│                                                             │
│  [🔶 RESURGO Logo]    Features  How It Works  Coaches      │
│                       Pricing   Blog   FAQ                  │
│                                        [Sign In] [Sign Up]  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

CHANGES:
✓ Menu items vertically centered (use flexbox align-items: center)
✓ Consistent spacing between menu items
✓ Logo: Orange pixelated arrow + "RESURGO" (same across ALL pages)
✓ Remove "by webmess" everywhere
✓ Sticky header on scroll (collapses slightly)

CSS:
.header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Vertical centering */
  padding: 1rem 2rem;
  background: #0a0e27;
}

.nav-menu {
  display: flex;
  gap: 2rem;
  align-items: center; /* Vertical centering */
}

.nav-link {
  color: #e0e6ed;
  font-size: 1rem; /* Consistent size */
  transition: color 0.2s;
}

.nav-link:hover {
  color: #FF6B35; /* Orange accent */
}
2. HERO SECTION
text

┌─ HERO ─────────────────────────────────────────────────────┐
│                                                             │
│         Your Life, Orchestrated by AI                      │
│         Set Goals Once. AI Handles the Rest.               │
│                                                             │
│    [GET STARTED FREE]  [SEE HOW IT WORKS ↓]                │
│                                                             │
│    [Animated terminal/dashboard preview]                   │
│    (Subtle floating animation, NOT auto-scroll)            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

CHANGES:
✓ Remove auto-scroll on page load
✓ "See How It Works" button smoothly scrolls to next section (user-triggered)
✓ CTA buttons consistent design (see button spec below)

JavaScript fix:
// Remove any automatic scrolling
useEffect(() => {
  // Don't scroll on mount
}, []);

// Only scroll on button click
<button onClick={() => {
  document.getElementById('how-it-works').scrollIntoView({ 
    behavior: 'smooth' 
  })
}}>
  SEE HOW IT WORKS ↓
</button>
3. UNIVERSAL CTA BUTTON DESIGN
text

SPECIFICATION:

Design: Terminal-inspired with bright orange accent
Size: Minimum 44px height (accessibility)
Font: 16px minimum (readable)
Style: Slight 3D effect, glows on hover

CSS:
.cta-button {
  /* Base styles */
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
  color: #0a0e27;
  font-family: 'Rajdhani', sans-serif;
  font-size: 16px;
  font-weight: 700;
  padding: 14px 32px;
  border: 2px solid #FF6B35;
  border-radius: 4px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(255, 107, 53, 0.3);
  
  /* Ensure minimum touch target */
  min-height: 44px;
  min-width: 120px;
}

.cta-button:hover {
  background: linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%);
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.6);
  transform: translateY(-2px);
}

.cta-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(255, 107, 53, 0.4);
}

/* Secondary button variant */
.cta-button-secondary {
  background: transparent;
  color: #FF6B35;
  border: 2px solid #FF6B35;
  box-shadow: none;
}

.cta-button-secondary:hover {
  background: rgba(255, 107, 53, 0.1);
  box-shadow: 0 0 15px rgba(255, 107, 53, 0.3);
}

APPLY TO:
- All CTA buttons site-wide
- Sign Up / Sign In buttons
- Get Started buttons
- Form submit buttons
- Primary action buttons in app

ENSURE:
✓ Consistent across landing page and dashboard
✓ No tiny fonts (minimum 16px)
✓ High contrast (readable)
✓ Accessible (meets WCAG AA)
4. FEATURES SECTION (Creative Showcase)
text

CURRENT: Basic list or cards
TARGET: Interactive, fun, visually engaging

DESIGN CONCEPT: "Terminal Tabs" Interface

┌─ FEATURES ─────────────────────────────────────────────────┐
│                                                             │
│  Discover What Resurgo Can Do For You                      │
│                                                             │
│  [🤖 AI Coaches] [🧠 Brain Dump] [📊 AI Orchestrator]      │
│  [📋 Smart Tasks] [🎯 Goal Templates] [🎨 Vision Board]    │
│                                                             │
│  ┌─ ACTIVE TAB: AI COACHES ──────────────────────────────┐ │
│  │                                                         │ │
│  │   Meet Your Personal AI Team                           │ │
│  │                                                         │ │
│  │   ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐     │ │
│  │   │ TITAN  │  │  SAGE  │  │HARMONY │  │ NEXUS  │     │ │
│  │   │  💪    │  │   💡   │  │   🧘   │  │   ✓    │     │ │
│  │   │Fitness │  │ Wealth │  │Wellness│  │  Tasks │     │ │
│  │   └────────┘  └────────┘  └────────┘  └────────┘     │ │
│  │                                                         │ │
│  │   Four specialized AI coaches who understand your      │ │
│  │   goals and help you achieve them. Chat naturally,     │ │
│  │   and they'll handle the complexity.                   │ │
│  │                                                         │ │
│  │   [TRY AI COACH DEMO →]                                │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  (User clicks different tabs to see different features)    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

FEATURES TO HIGHLIGHT:

Tab 1: AI Coaches
- Show 4 coaches in 2x2 grid (as specified)
- Explain each coach's role
- Interactive demo or screenshot of chat

Tab 2: Brain Dump
- Visual: Terminal-style input with typed text animating
- Explanation: "Dump your thoughts, AI organizes them instantly"
- Show before/after (messy input → organized tasks/goals)

Tab 3: AI Orchestrator
- Visual: Flowchart or diagram showing multi-model pipeline
- Explanation: "15+ AI models working together for smart results"
- Stats: "10x faster processing, 99% accurate categorization"

Tab 4: Smart Tasks & Goals
- Visual: Task board with AI suggestions
- Explanation: "AI prioritizes, schedules, and reminds you"
- Show intelligence (e.g., "Moved 'Gym' to morning based on your energy patterns")

Tab 5: Vision Board
- Visual: Beautiful vision board example (AI-generated images)
- Explanation: "AI creates inspiring visuals from your goals"
- CTA: "Create Your Vision Board"

Tab 6: Goal Templates
- Visual: Grid of pre-made goal templates
- Examples: "Lose 10kg", "Learn Spanish", "Start a Business"
- Explanation: "One-click setup with AI-optimized plans"

INTERACTION:
- Tabs change content on click (smooth transition)
- Each tab has a mini live demo or interactive element
- Mobile: Swipeable carousel instead of tabs
5. HOW IT WORKS (Terminal Flowchart)
text

CURRENT: Plain text or basic diagram
TARGET: Terminal-themed visual flowchart

DESIGN:

┌─ HOW RESURGO WORKS ────────────────────────────────────────┐
│                                                             │
│  From Chaos to Clarity in 3 Steps                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │   YOU              →        AI         →   RESULTS   │  │
│  │   ┌─────────┐              ┌─────┐       ┌────────┐ │  │
│  │   │Tell your│              │Multi│       │Achieve │ │  │
│  │   │  goals  │────────────→ │model│─────→ │ goals  │ │  │
│  │   │& dreams │              │ AI  │       │faster  │ │  │
│  │   └─────────┘              └─────┘       └────────┘ │  │
│  │       │                       │              ▲       │  │
│  │       │                       ▼              │       │  │
│  │   ┌─────────┐              ┌─────┐       ┌────────┐ │  │
│  │   │ Share   │              │Plans│       │AI keeps│ │  │
│  │   │  your   │────────────→ │your │─────→ │you on  │ │  │
│  │   │schedule │              │ day │       │ track  │ │  │
│  │   └─────────┘              └─────┘       └────────┘ │  │
│  │       │                       │              ▲       │  │
│  │       │                       ▼              │       │  │
│  │   ┌─────────┐              ┌─────┐       ┌────────┐ │  │
│  │   │  Live   │              │Learns│       │System  │ │  │
│  │   │  your   │────────────→ │ and │─────→ │ adapts │ │  │
│  │   │  life   │              │adapts│       │to you  │ │  │
│  │   └─────────┘              └─────┘       └────────┘ │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Or, more creative ASCII art style:                        │
│                                                             │
│  [YOU] ──→ [AI BRAIN] ──→ [ORGANIZED LIFE]                │
│              ↓                    ↑                         │
│         [LEARNS PATTERNS]  [ACHIEVES GOALS]                │
│                                                             │
└─────────────────────────────────────────────────────────────┘

ALTERNATIVE: Animated Terminal Simulation
- Show simulated terminal where AI types out the process
- User sees commands being executed
- Results appear in real-time (animation)

Example:
> resurgo --init
Initializing your personal AI system...
> Analyzing your goals... ✓
> Creating personalized plan... ✓
> Setting up daily tasks... ✓
> Optimizing schedule... ✓
System ready! You're all set to achieve your goals.
6. AI COACHES SECTION (Redesigned)
text

CURRENT ISSUE: Layout weird, needs better design
TARGET: 2x2 grid, terminal-themed, engaging

┌─ MEET YOUR AI TEAM ────────────────────────────────────────┐
│                                                             │
│  Four Specialists, One Mission: Your Success               │
│                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐ │
│  │  ┌─────────────────────┐│  │  ┌─────────────────────┐│ │
│  │  │       TITAN         ││  │  │        SAGE         ││ │
│  │  │      [💪 icon]      ││  │  │      [💡 icon]      ││ │
│  │  └─────────────────────┘│  │  └─────────────────────┘│ │
│  │                          │  │                          │ │
│  │  Fitness & Health Coach  │  │   Wealth & Business     │ │
│  │                          │  │                          │ │
│  │  • Workout plans         │  │  • Budget tracking      │ │
│  │  • Nutrition guidance    │  │  • Business strategy    │ │
│  │  • Sleep optimization    │  │  • Investment advice    │ │
│  │                          │  │                          │ │
│  │  [CHAT WITH TITAN]       │  │  [CHAT WITH SAGE]       │ │
│  └──────────────────────────┘  └──────────────────────────┘ │
│                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐ │
│  │  ┌─────────────────────┐│  │  ┌─────────────────────┐│ │
│  │  │      HARMONY        ││  │  │       NEXUS         ││ │
│  │  │      [🧘 icon]      ││  │  │      [✓ icon]       ││ │
│  │  └─────────────────────┘│  │  └─────────────────────┘│ │
│  │                          │  │                          │ │
│  │  Wellness & Mindfulness  │  │  Productivity & Planning│ │
│  │                          │  │                          │ │
│  │  • Mood tracking         │  │  • Task management      │ │
│  │  • Meditation guides     │  │  • Goal setting         │ │
│  │  • Stress relief         │  │  • Time optimization    │ │
│  │                          │  │                          │ │
│  │  [CHAT WITH HARMONY]     │  │  [CHAT WITH NEXUS]      │ │
│  └──────────────────────────┘  └──────────────────────────┘ │
│                                                             │
│  Or ask any question, and the right coach will respond     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

STYLING:
- Each coach card: Terminal-style border
- Color-coded (Titan=red, Sage=gold, Harmony=purple, Nexus=cyan)
- Hover effect: Glow in coach's color
- Responsive: 2x2 on desktop, stacked on mobile
7. PRICING SECTION (With Yearly Toggle)
text

CURRENT: Separate yearly column (if exists)
TARGET: Toggle between Monthly/Yearly

DESIGN:

┌─ PRICING ──────────────────────────────────────────────────┐
│                                                             │
│  Choose Your Plan                                          │
│                                                             │
│  ┌─────────────────────────┐                               │
│  │  MONTHLY  ◯──────●  YEARLY (Save 20%)                   │
│  └─────────────────────────┘                               │
│                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  │
│  │     FREE      │  │    PREMIUM    │  │   POWER USER  │  │
│  │               │  │               │  │               │  │
│  │    $0/mo      │  │   $12/mo      │  │    $35/mo     │  │
│  │               │  │  $115/yr save │  │   $336/yr     │  │
│  │               │  │               │  │               │  │
│  │ • 3 goals     │  │ • Unlimited   │  │ • Everything  │  │
│  │ • Basic AI    │  │ • Advanced AI │  │ • API access  │  │
│  │ • Core tools  │  │ • All features│  │ • Team/family │  │
│  │               │  │ • Priority    │  │ • Coaching    │  │
│  │               │  │                                    │  │
│  │ [START FREE]  │  │ [UPGRADE]     │  │ [GO PRO]      │  │
│  └───────────────┘  └───────────────┘  └───────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

IMPLEMENTATION:
- Toggle switch changes displayed prices
- Monthly: Show monthly price
- Yearly: Show annual price + monthly equivalent + savings badge
- Smooth transition animation
- State persists (if user toggles, stays on that view)

React component:
const [billingPeriod, setBillingPeriod] = useState('monthly');

<Toggle 
  checked={billingPeriod === 'yearly'}
  onChange={() => setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
/>

{billingPeriod === 'yearly' && (
  <Badge>Save 20%</Badge>
)}

<Price>
  {billingPeriod === 'monthly' ? '$12/mo' : '$115/year'}
</Price>

NOTE: If toggle implementation is too complex or time-consuming, SKIP and keep current design.
8. REVIEWS / TESTIMONIALS SECTION
text

CURRENT ISSUE: Headings too plain, don't stand out
FIX: Make headings terminal-styled and prominent

BEFORE:
Reviews

AFTER:
┌─ WHAT USERS SAY ───────────────────────────────────────────┐

OR

═══════════════════════════════════════════════════════
       REAL PEOPLE, REAL RESULTS
═══════════════════════════════════════════════════════

STYLING:
.section-heading {
  font-family: 'Rajdhani', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #FF6B35;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 3rem;
  position: relative;
}

.section-heading::before,
.section-heading::after {
  content: '━━━━━━━━━━━━━━━';
  display: block;
  color: #00d9ff;
  font-size: 1rem;
  margin: 0.5rem 0;
}

Apply to all section headings (Features, How It Works, Pricing, etc.)
9. AI HABIT PLANNER + COMPANION FEATURE
text

CURRENT: AI Habit Planner too large
TARGET: Side-by-side with another feature (Brain Dump or AI Orchestrator)

┌─ ADVANCED AI TOOLS ────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐ │
│  │  AI HABIT PLANNER       │  │  BRAIN DUMP             │ │
│  │                         │  │                         │ │
│  │ [Screenshot or demo]    │  │ [Screenshot or demo]    │ │
│  │                         │  │                         │ │
│  │ AI creates custom habit │  │ Dump thoughts, AI       │ │
│  │ plans based on your     │  │ organizes them into     │ │
│  │ goals and lifestyle.    │  │ tasks, goals, ideas.    │ │
│  │                         │  │                         │ │
│  │ [TRY IT FREE]           │  │ [TRY IT FREE]           │ │
│  └─────────────────────────┘  └─────────────────────────┘ │
│                                                             │
│  OR:                                                        │
│                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐ │
│  │  AI HABIT PLANNER       │  │  AI ORCHESTRATOR        │ │
│  │  ...                    │  │  15+ AI models          │ │
│  │                         │  │  working in harmony     │ │
│  └─────────────────────────┘  └─────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘

SIZING:
- Each feature box: 50% width on desktop
- Smaller, more concise than current AI Habit Planner
- Stack vertically on mobile
10. POPUP / MODAL (Terminal-Themed)
text

CURRENT: Generic popup, no email received
TARGET: Terminal aesthetic, functional email delivery

DESIGN:

┌─ TERMINAL ─────────────────────────────────────────────────┐
│ > resurgo --subscribe                                       │
│                                                             │
│ Join the waitlist for exclusive early access               │
│                                                             │
│ > Email: [________________]                                │
│                                                             │
│ [SUBSCRIBE] [CLOSE]                                         │
│                                                             │
│ > We respect your privacy. Unsubscribe anytime.            │
└─────────────────────────────────────────────────────────────┘

FIXES NEEDED:
1. Design: Terminal/command-line aesthetic
   - Monospace font (Fira Code, JetBrains Mono)
   - Dark background (#0a0e27)
   - Green or cyan text (#00ff00 or #00d9ff)
   - Blinking cursor effect

2. Functionality: Email delivery
   - Check backend email service configuration
   - Verify SMTP settings or email API (SendGrid, Mailgun, etc.)
   - Test email sending
   - Add error handling (show "Email sent!" or "Error, try again")
   - Log emails in database for follow-up

3. Alternative popup purposes:
   - Newsletter signup
   - Feature announcement
   - Early access waitlist
   - Beta testing invitation

CSS:
.terminal-popup {
  background: #0a0e27;
  border: 2px solid #00d9ff;
  color: #00ff00;
  font-family: 'Fira Code', monospace;
  padding: 2rem;
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(0, 217, 255, 0.3);
}

.terminal-input {
  background: #1a1e37;
  border: 1px solid #00d9ff;
  color: #00ff00;
  font-family: 'Fira Code', monospace;
  padding: 0.75rem;
  width: 100%;
}

.terminal-input::before {
  content: '> ';
  color: #00d9ff;
}
11. EMAIL VERIFICATION TEMPLATE (Clerk)
text

CURRENT ISSUE: Emails say "Ascend" instead of "Resurgo"
FIX: Update Clerk email templates with Resurgo branding

STEPS:
1. Log into Clerk Dashboard
2. Navigate to: Customization → Emails
3. Update templates:
   - Verification Email
   - Magic Link Email
   - Password Reset Email
   - Invitation Email

TEMPLATE CHANGES:
- Replace "Ascend" with "Resurgo"
- Add Resurgo logo (upload to Clerk assets)
- Update color scheme to match brand (#FF6B35 orange, #0a0e27 dark)
- Update copy to match Resurgo's tone

EXAMPLE VERIFICATION EMAIL:

Subject: Verify your Resurgo account

---

[RESURGO LOGO]

Hi {{user.firstName}},

Welcome to Resurgo! 🎉

Click the button below to verify your email and start your journey to an AI-powered life.

[VERIFY EMAIL]

Or copy and paste this link:
{{verification_link}}

If you didn't create a Resurgo account, you can safely ignore this email.

Best,
The Resurgo Team

---

P.S. Need help? Reply to this email or visit resurgo.life/help

LOGO IMPLEMENTATION:
- Upload logo PNG (transparent background, 200x50px recommended)
- Use in email header
- Ensure consistent across all email templates
12. PWA INSTALL BUTTON
text

CURRENT: "Install as PWA" (too technical)
TARGET: User-friendly language

CHANGE TO:
✓ "Install on Home Screen"
✓ "Add to Home Screen" (iOS-friendly)
✓ "Get the App"
✓ "Install Resurgo"

BUTTON DESIGN:
- Use standard CTA button design (orange, terminal-themed)
- Icon: Download or phone icon (pixelated)
- Tooltip: "Access Resurgo offline, just like a native app"

IMPLEMENTATION:
// Update button text
<button onClick={handleInstallPWA}>
  📱 Add to Home Screen
</button>

// Or with icon
<button onClick={handleInstallPWA}>
  <DownloadIcon /> Install Resurgo
</button>

PWA HOMESCREEN WIDGETS:
NOTE: True home screen widgets (iOS/Android) require native development.
PWA does NOT support home screen widgets.

ALTERNATIVES:
1. Widget-like shortcuts (Android):
   - Use Web App Manifest shortcuts
   - Quick actions: "Add Task", "Log Water", "Start Meditation"

2. Push notifications with rich content:
   - Can show data in notification
   - Quick actions in notification

3. Post-MVP: Consider converting to React Native or Flutter for true widgets

CURRENT RECOMMENDATION:
- Focus on excellent PWA experience
- Use push notifications creatively
- Add manifest shortcuts for quick actions
- Defer home screen widgets to future native app version
13. FREE TOOLS SECTION (Showcase)
text

ADD: Section highlighting free tools available

┌─ FREE TOOLS TO GET STARTED ────────────────────────────────┐
│                                                             │
│  Try these powerful features before signing up             │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Goal         │  │  Habit       │  │  Task        │     │
│  │ Templates    │  │  Builder     │  │  Calculator  │     │
│  │              │  │              │  │              │     │
│  │ [USE FREE]   │  │  [USE FREE]  │  │  [USE FREE]  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Calorie      │  │  Sleep       │  │  Productivity│     │
│  │ Calculator   │  │  Tracker     │  │  Timer       │     │
│  │              │  │              │  │              │     │
│  │ [USE FREE]   │  │  [USE FREE]  │  │  [USE FREE]  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  No signup required. Try them now!                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

PURPOSE:
- Lead magnet (show value before signup)
- SEO benefit (tools get traffic from Google)
- Viral potential (people share useful tools)

IMPLEMENTATION:
- Each tool is a simple, standalone page
- Works without login
- CTA at bottom: "Want to save your data? Sign up free"
14. BLOG SECTION (If Relevant)
text

RESEARCH: Do top SaaS companies have blogs?
ANSWER: Yes! (Notion, Asana, Monday.com, Todoist all have blogs)

PURPOSE:
- SEO (rank for productivity, wellness keywords)
- Authority building
- User education
- Content marketing

DECISION:
□ If you plan to create content regularly (2-4 posts/month), add Blog
□ If not, skip for MVP and add post-launch

IF ADDING BLOG:
- Header navigation: "Blog" link
- Blog homepage: Latest posts, categories
- Individual post pages
- Categories: Productivity, Wellness, AI, Success Stories, Product Updates
- Author: Can be AI-generated or human-written
- SEO-optimized (keywords, meta tags, images)

BLOG POST IDEAS:
- "How AI Coaches Help You Achieve Goals Faster"
- "5 Habits of Highly Productive People (Science-Backed)"
- "Brain Dump Method: Clear Your Mind in 5 Minutes"
- "Case Study: How Sarah Lost 15kg Using Resurgo"
- "The Science of Habit Formation"
15. HOMEPAGE vs LANDING PAGE CLARITY
text

DEFINITION:
- LANDING PAGE: Marketing-focused, conversion-optimized (for ads, campaigns)
- HOMEPAGE: Main entry point, general audience

FOR RESURGO:
Decision: Use ONE page that serves both purposes (homepage = landing page)

URL: resurgo.life (root)

SECTIONS (in order):
1. Header/Navigation
2. Hero (value prop, CTA)
3. Features (tabbed or cards)
4. How It Works (flowchart)
5. AI Coaches (meet the team)
6. Advanced Tools (Habit Planner, Brain Dump)
7. Free Tools
8. Pricing
9. Testimonials/Reviews
10. FAQ
11. Final CTA
12. Footer

INTERACTIVE ELEMENTS:
- AI coaches explaining terminal in animated demo
- Interactive terminal simulator (user can type commands, get responses)
- Live data visualization (fake data showing progress)

EXAMPLE: AI Coaches Explain Terminal
┌─ INTERACTIVE DEMO ─────────────────────────────────────────┐
│                                                             │
│  [Animated AI coach (Nexus) appears]                       │
│                                                             │
│  Nexus: "Want to see how powerful our terminal is?         │
│          Try typing a command!"                             │
│                                                             │
│  > [User types: "add task: finish proposal"]               │
│                                                             │
│  Nexus: "Got it! I've added 'Finish proposal' to your      │
│          tasks. When should we set the deadline?"           │
│                                                             │
│  > [User types: "Friday"]                                  │
│                                                             │
│  Nexus: "Perfect! Task added for this Friday. I'll remind  │
│          you on Thursday. Want to break it into subtasks?"  │
│                                                             │
│  [CTA: Sign up to unlock your AI coach!]                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

This is interactive, fun, and shows value immediately.
🖥️ DASHBOARD ENHANCEMENTS
Current Issues & Requirements
text

❌ Missing quick task widget
❌ Missing quick note widget
❌ AI analysis not on top
❌ Health & wellness not integrated in dashboard
❌ Sleep tracker not implemented
❌ Fitness features not visible
❌ Too many features, some redundant
❌ Vision board widget missing from dashboard
❌ Calendar and Analytics should be under Dashboard tab
❌ Dashboard not terminal-themed enough
❌ Modern widgets (should be terminal-style)
❌ Need digital clock (terminal aesthetic)
❌ Items not center-aligned
❌ Brain Dump button should be replaced with AI Coach button
New Dashboard Structure
Widget Layout
text

┌─ DASHBOARD ────────────────────────────────────────────────┐
│ [RESURGO 🔶]  Dashboard ▼  Personal ▼  Wellness ▼  Health ▼│
│                                            [🤖] [🔔] [👤]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Good evening, Alex! Here's your command center. 🚀        │
│                                                             │
│  ┌─ AI ANALYSIS ────────────────────────────────────────┐  │
│  │ You're on fire this week! 🔥                          │  │
│  │ • 85% task completion (up from 72%)                   │  │
│  │ • 12-day meditation streak                            │  │
│  │ • Calorie goal met 6/7 days                           │  │
│  │                                                        │  │
│  │ Suggestion: Add a rest day this week for recovery.    │  │
│  │ [CHAT WITH AI COACH]                                   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─ QUICK ACTIONS ──────────────┬─ TERMINAL CLOCK ───────┐ │
│  │ [+ Task] [+ Note] [💧 Water] │  FRI 14 JAN 2025       │ │
│  │ [🍽️ Meal] [💪 Workout]       │  23:45:07 PST          │ │
│  └──────────────────────────────┴────────────────────────┘ │
│                                                             │
│  ┌─ TASK OVERVIEW ───────┬─ HABIT STREAKS ────┬─ GOALS ──┐│
│  │ Today: 3/5 complete   │ 🔥 Meditate: 12d   │ Q1: 60%  ││
│  │ □ Finish proposal     │ 💪 Workout: 8d     │ Q2: 30%  ││
│  │ ✓ Morning routine     │ 📚 Read: 22d       │ Q3: 15%  ││
│  │ ✓ Team meeting        │ [VIEW ALL]         │ [VIEW]   ││
│  │ ✓ Gym session         │                    │          ││
│  │ □ Meal prep           │                    │          ││
│  │ □ Journal             │                    │          ││
│  │ [ADD TASK]            │                    │          ││
│  └───────────────────────┴────────────────────┴──────────┘│
│                                                             │
│  ┌─ HEALTH & FITNESS ──────────────────────────────────┐   │
│  │ 💧 Water: 6/8 glasses  🍎 Calories: 1,850/2,400     │   │
│  │ 😴 Sleep: 7.5h (Good)  💪 Workouts this week: 4/5   │   │
│  │ [VIEW WELLNESS CENTER]                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─ VISION BOARD PREVIEW ──────┐ ┌─ QUICK NOTE ─────────┐ │
│  │ [Thumbnail of vision board] │ │ >_ Brain dump here   │ │
│  │ "Dream Life 2025"           │ │ [                  ] │ │
│  │ [OPEN FULL BOARD]           │ │ [                  ] │ │
│  └─────────────────────────────┘ │ [SAVE NOTE]          │ │
│                                   └──────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
Widget Specifications
1. AI ANALYSIS (Top Priority)

Position: Top of dashboard (most prominent)
Content: Personalized insights, encouragement, suggestions
Updated: Daily (or after significant actions)
CTA: Direct link to AI Coach chat
Style: Terminal window with gradient border
2. QUICK ACTIONS

One-click buttons for common actions
Icons: Pixelated (water drop, food, dumbbell, etc.)
Instant modals/forms (no page navigation)
Style: Button group, horizontal layout
3. TERMINAL CLOCK

Real-time digital clock (updates every second)
Shows: Day, Date, Time, Timezone
Style: Monospace font, neon green or cyan text
Optional: Weather icon (pixelated sun/cloud/rain)
4. TASK OVERVIEW

Shows today's tasks (max 5-7 visible)
Checkbox to complete inline
"Add Task" quick button
Link to full Tasks page
Style: List with checkboxes, terminal aesthetic
5. HABIT STREAKS

Top 3-5 habits with current streaks
Fire emoji for active streaks
Color-coded by category
Link to full Habits page
Style: Badge-style indicators
6. GOALS PROGRESS

Top 3 active goals with progress bars
Percentage complete
Link to full Goals page
Style: Progress bars with pixelated fill
7. HEALTH & FITNESS SUMMARY

Key metrics: Water, Calories, Sleep, Workouts
Visual indicators (pixelated icons)
Quick stats (no detailed charts)
Link to Wellness Center
Style: Icon + number + label
8. VISION BOARD PREVIEW

Thumbnail of user's active vision board
Board title
Link to open full editor
Style: Image card with terminal border
9. QUICK NOTE / BRAIN DUMP

Small text area for rapid input
AI processes on save
Adds to tasks/goals/notes as appropriate
Style: Terminal-style input box
10. MISSING WIDGETS TO ADD:

Sleep Tracker Summary

Last night's sleep: 7.5 hours
Weekly average: 7.2 hours
Sleep quality score: 85/100
Link to full Sleep page
Fitness Tracker Summary

This week's workouts: 4/5 completed
Calories burned: 2,400 kcal
Active minutes: 180 min
Link to full Fitness page
Terminal-Themed Styling
CSS

/* Dashboard container */
.dashboard {
  background: #0a0e27;
  color: #e0e6ed;
  font-family: 'Fira Code', monospace;
  padding: 2rem;
}

/* Widget base style */
.widget {
  background: rgba(26, 30, 55, 0.6);
  border: 1px solid #00d9ff;
  border-radius: 4px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

/* Widget header */
.widget-header {
  color: #00d9ff;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
  border-bottom: 1px solid #00d9ff;
  padding-bottom: 0.5rem;
}

/* Terminal clock */
.terminal-clock {
  font-family: 'Fira Code', monospace;
  font-size: 1.5rem;
  color: #00ff00;
  text-align: center;
  background: #000;
  border: 2px solid #00ff00;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

/* Quick action buttons */
.quick-action-btn {
  background: transparent;
  border: 1px solid #FF6B35;
  color: #FF6B35;
  padding: 0.5rem 1rem;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Rajdhani', sans-serif;
  text-transform: uppercase;
  font-size: 0.875rem;
}

.quick-action-btn:hover {
  background: rgba(255, 107, 53, 0.1);
  box-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
}

/* Task list */
.task-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(224, 230, 237, 0.1);
}

.task-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #00d9ff;
  background: transparent;
  cursor: pointer;
}

.task-checkbox:checked {
  background: #00d9ff;
}

.task-checkbox:checked + .task-text {
  text-decoration: line-through;
  opacity: 0.5;
}

/* Habit streaks */
.habit-streak {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid #FF6B35;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  margin: 0.25rem;
}

.habit-streak-fire {
  color: #FF6B35;
  font-size: 1.25rem;
}

/* Progress bars */
.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(224, 230, 237, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d9ff, #00ff88);
  transition: width 0.5s ease;
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
}

/* Remove modern widget look */
/* Avoid: */
- Rounded corners > 8px
- Drop shadows (use glows instead)
- Gradient backgrounds (keep flat or subtle)
- Soft pastel colors (use neon/bright colors)

/* Embrace: */
- Sharp edges or minimal rounding (4px max)
- Borders (1-2px solid)
- Glows and neon effects
- High contrast
- Monospace fonts
- ASCII art decorations
Center Alignment
CSS

/* Center all dashboard content */
.dashboard-content {
  max-width: 1200px;
  margin: 0 auto; /* Centers horizontally */
  padding: 0 2rem;
}

/* Center widgets within grid */
.widget-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  justify-items: center; /* Centers items */
}

/* Center text within widgets */
.widget-header,
.widget-content {
  text-align: center; /* Or left, depending on content type */
}

/* Center buttons */
.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
AI Coach Integration in Dashboard
Top Navigation:

Replace "Brain Dump" button with "AI Coach" button
Clicking opens AI Coach sidebar or modal
Icon: 🤖 (or custom pixelated robot icon)
Implementation:

JavaScript

// Header component
<Header>
  <Logo />
  <Nav>
    <NavItem>Dashboard</NavItem>
    <NavItem>Personal</NavItem>
    <NavItem>Wellness</NavItem>
    <NavItem>Health</NavItem>
  </Nav>
  <ActionButtons>
    <IconButton onClick={openAICoach}>
      <AICoachIcon /> AI COACH
    </IconButton>
    <IconButton>
      <BellIcon />
    </IconButton>
    <IconButton>
      <UserIcon />
    </IconButton>
  </ActionButtons>
</Header>

// AI Coach Modal/Sidebar
<AICoachModal isOpen={aiCoachOpen} onClose={closeAICoach}>
  <AICoachInterface />
</AICoachModal>
Dashboard Widget Linking:

"Chat with AI Coach" button in AI Analysis widget
AI Coach suggestions can directly trigger actions (add task, update goal, etc.)
Example:
text

AI: "You haven't worked out in 3 days. Want to schedule a session now?"
[YES] ← Clicking this opens calendar and pre-fills workout task
🗂️ FEATURE CLUSTERING & ORGANIZATION
Rationale for New Structure
Problem: Too many standalone features overwhelming users
Solution: Group related features under logical categories

Grouped Feature Map
text

DASHBOARD (Main Hub)
├── Goals (view, create, track)
├── Habits (track, streaks, analytics)
├── Tasks (manage, schedule, complete)
├── Calendar (unified view of tasks, habits, events)
└── Analytics (progress charts, insights, trends)

AI COACH (Central Intelligence)
├── Chat Interface (talk to 4 coaches)
├── Brain Dump (rapid thought capture → AI organizes)
├── Plan Builder (onboarding + anytime re-planning)
├── Deep Scan (user profiling for personalization)
└── AI Orchestrator (backend - powers all AI features)

PERSONAL (Self-Development)
├── Vision Board (create, edit, view)
├── Journal (daily entries, prompts, mood tracking)
└── Mood Tracker (log emotions, patterns, insights)

WELLNESS (Mental & Spiritual)
├── Mood (emotional state tracking)
├── Fitness (workouts - MOVED HERE or separate?)
├── Journal (MOVED from Personal OR keep both?)
├── Sleep (tracking, analysis, improvement tips)
└── Meditation (guided sessions, timers, streaks)

HEALTH (Nutrition & Diet)
├── Calorie Tracker (log meals, track macros)
├── Diet Plan (AI-generated meal plans)
├── Water Tracker (hydration goals, reminders)
└── Nutrition Analytics (deficiencies, trends)

FITNESS (Physical Activity)
├── Running (distance, pace, routes)
├── Workout Plans (exercises, schedules, progress)
├── Weight Management (track weight, body measurements)
└── Exercise Library (database of exercises with demos)

WEALTH (Financial & Business) [OPTIONAL]
├── Budget (income, expenses, savings)
├── Business (track ventures, revenue, tasks)
├── Wish List (items to save for, price tracking)
└── Personal Assets (gold, stocks, crypto with live prices)
Overlaps & Decisions
ISSUE: Fitness in Wellness vs. standalone
DECISION:

WELLNESS = Mental/spiritual health (mood, meditation, sleep)
FITNESS = Physical activity (workouts, running, weight)
Keep separate for clarity
ISSUE: Journal in Personal vs. Wellness
DECISION:

PERSONAL = General journaling (life reflections, thoughts)
WELLNESS > Mood = Mood-specific journaling (emotions, triggers)
Option 1: Keep separate (different purposes)
Option 2: Merge into one journal with mood tracking feature
RECOMMENDATION: Merge into Personal > Journal with mood logging capability
UPDATED STRUCTURE:

text

PERSONAL
├── Vision Board
├── Journal (includes mood logging)
└── (Mood Tracker removed as standalone, integrated into Journal)

WELLNESS
├── Fitness → MOVED to standalone FITNESS tab
├── Sleep
└── Meditation
Implementation in Sidebar
text

┌─ SIDEBAR ──────────────────────────────────────────────────┐
│                                                             │
│  [RESURGO 🔶]                                               │
│                                                             │
│  ▼ DASHBOARD                        ← Collapsible          │
│    • Goals                                                  │
│    • Habits                                                 │
│    • Tasks                                                  │
│    • Calendar                                               │
│    • Analytics                                              │
│                                                             │
│  🤖 AI COACH                         ← Standalone (primary) │
│                                                             │
│  ▼ PERSONAL                          ← Collapsible          │
│    • Vision Board                                           │
│    • Journal (with mood tracking)                           │
│                                                             │
│  ▼ WELLNESS                          ← Collapsible          │
│    • Sleep                                                  │
│    • Meditation                                             │
│                                                             │
│  ▼ HEALTH                            ← Collapsible          │
│    • Calorie Tracker                                        │
│    • Diet Plan                                              │
│    • Water Tracker                                          │
│    • Nutrition Analytics                                    │
│                                                             │
│  ▼ FITNESS                           ← Collapsible          │
│    • Running                                                │
│    • Workout Plans                                          │
│    • Weight Management                                      │
│    • Exercise Library                                       │
│                                                             │
│  ▼ WEALTH (Optional)                 ← Collapsible          │
│    • Budget                                                 │
│    • Business                                               │
│    • Wish List                                              │
│    • Assets                                                 │
│                                                             │
│  ⚙️ SETTINGS                                                │
│  📚 HELP                                                    │
│  👤 PROFILE                                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘

BEHAVIOR:
- Clicking category header (▼) expands/collapses
- Active page highlighted
- Icons for each category (pixelated style)
- Smooth expand/collapse animation
- Mobile: Collapsible hamburger menu
🧠 BRAIN DUMP FEATURE ENHANCEMENT
Current State
Unknown (may be basic or missing)

Target State
Rapid thought capture → AI intelligently categorizes → Populates relevant features

User Experience Flow
text

USER FLOW:

1. User clicks "Brain Dump" (from AI Coach tab or dashboard quick action)

2. Modal/Page opens with terminal-style input area
   ┌─ BRAIN DUMP ─────────────────────────────────────────────┐
   │ >_ Dump everything on your mind...                       │
   │                                                           │
   │ ┌───────────────────────────────────────────────────────┐│
   ││ [User types stream of consciousness]                   ││
   ││                                                         ││
   ││ "need to call mom tomorrow, workout idea: try HIIT,    ││
   ││  business idea for meal prep service targeting busy    ││
   ││  professionals, buy protein powder and creatine,       ││
   ││  feeling stressed about deadline, want to meditate     ││
   ││  daily, read atomic habits book, lose 5kg by march"    ││
   ││                                                         ││
   │└───────────────────────────────────────────────────────┘│
   │                                                           │
   │ [ORGANIZE WITH AI]  [CLEAR]  [SAVE AS NOTE]              │
   └───────────────────────────────────────────────────────────┘

3. User clicks "Organize with AI"

4. AI processes (loading animation)
   > Analyzing your thoughts...
   > Categorizing items...
   > Creating actionable items...

5. AI presents organized output
   ┌─ AI ORGANIZED YOUR BRAIN DUMP ─────────────────────────┐
   │                                                         │
   │ ✓ TASKS (3 created)                                    │
   │   • Call mom - Due: Tomorrow                           │
   │   • Buy supplements (protein, creatine) - Shopping     │
   │   • Read "Atomic Habits" - Leisure                     │
   │                                                         │
   │ ✓ GOALS (1 created)                                    │
   │   • Lose 5kg by March - Health & Fitness               │
   │     Progress tracking: Weekly weigh-ins                │
   │                                                         │
   │ ✓ HABITS (2 suggested)                                 │
   │   • Daily meditation (10 min) - Wellness               │
   │   • HIIT workout (3x/week) - Fitness                   │
   │                                                         │
   │ ✓ BUSINESS IDEAS (1 saved)                             │
   │   • Meal prep service for busy professionals           │
   │     Added to: Wealth > Business                        │
   │                                                         │
   │ ✓ MOOD NOTED                                           │
   │   • Feeling stressed about deadline                    │
   │     Logged in: Personal > Journal                      │
   │     Suggestion: Try breathing exercise now?            │
   │                                                         │
   │ [ACCEPT ALL]  [EDIT]  [DISMISS]                        │
   └─────────────────────────────────────────────────────────┘

6. User clicks "Accept All"

7. Confirmation
   ✓ 3 tasks added to Tasks
   ✓ 1 goal created (with milestone plan)
   ✓ 2 habits suggested (not auto-added, user can review)
   ✓ 1 business idea saved
   ✓ Mood logged

   [VIEW DASHBOARD]  [DUMP MORE THOUGHTS]
AI Processing Logic
JavaScript

async function processBrainDump(rawText) {
  // Send to AI with specific categorization instructions
  const prompt = `
    Analyze this brain dump and extract:
    1. Tasks (action items with due dates if mentioned)
    2. Goals (long-term objectives with metrics)
    3. Habits (recurring behaviors to build)
    4. Ideas (business, creative, projects)
    5. Emotions/Mood (feelings expressed)
    6. Shopping/Purchases (items to buy)
    
    Raw text: "${rawText}"
    
    Return JSON with categorized items.
  `;
  
  const aiResponse = await callAIOrchestrator(prompt);
  
  return {
    tasks: aiResponse.tasks,
    goals: aiResponse.goals,
    habits: aiResponse.habits,
    ideas: aiResponse.ideas,
    mood: aiResponse.mood,
    shopping: aiResponse.shopping
  };
}

async function createItemsFromBrainDump(organized, userId) {
  // Create tasks
  for (const task of organized.tasks) {
    await createTask(userId, {
      title: task.title,
      dueDate: task.dueDate || null,
      category: task.category || 'general',
      priority: task.priority || 'medium',
      source: 'brain_dump'
    });
  }
  
  // Create goals
  for (const goal of organized.goals) {
    await createGoal(userId, {
      title: goal.title,
      deadline: goal.deadline,
      category: goal.category,
      metric: goal.metric,
      target: goal.target,
      aiGenerated: true
    });
  }
  
  // Suggest habits (don't auto-create)
  for (const habit of organized.habits) {
    await createHabitSuggestion(userId, {
      name: habit.name,
      frequency: habit.frequency,
      category: habit.category,
      reason: habit.reason
    });
  }
  
  // Save ideas
  for (const idea of organized.ideas) {
    await saveIdea(userId, {
      title: idea.title,
      description: idea.description,
      category: idea.category, // business, creative, project
      addedFrom: 'brain_dump'
    });
  }
  
  // Log mood
  if (organized.mood) {
    await logMood(userId, {
      emotion: organized.mood.emotion,
      note: organized.mood.note,
      triggers: organized.mood.triggers,
      timestamp: new Date()
    });
  }
  
  // Add shopping items to wish list
  for (const item of organized.shopping) {
    await addToWishList(userId, {
      name: item.name,
      category: item.category,
      priority: item.priority
    });
  }
}
Integration with Onboarding
During Onboarding:

After initial questions, prompt user:
"Before we finalize your plan, dump any thoughts, goals, or ideas on your mind. I'll organize them for you."

User types freely in brain dump area

AI processes and shows organized output

AI uses this to enhance the personalized plan:

Adds mentioned goals to goal list
Creates initial tasks from action items
Suggests habits based on what user mentioned
Saves ideas for later review
User sees: "I've added these to your system. You can edit them anytime."

Why this works:

Captures user's raw thoughts (often more honest than structured forms)
Reduces onboarding friction (no need to fill multiple forms)
AI demonstrates value immediately (user sees magic happen)
Creates comprehensive initial system
🔧 TECHNICAL FIXES & IMPLEMENTATIONS
1. Weather & Location API Integration
ISSUE: Weather and location APIs not working

DIAGNOSIS STEPS:

JavaScript

// Check API key configuration
console.log('Weather API Key:', process.env.WEATHER_API_KEY); // Should not be undefined

// Check API call
async function testWeatherAPI() {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${process.env.WEATHER_API_KEY}`
    );
    const data = await response.json();
    console.log('Weather API response:', data);
    
    if (data.cod === 401) {
      console.error('Invalid API key');
    } else if (data.cod === 200) {
      console.log('API working! Current temp:', data.main.temp);
    }
  } catch (error) {
    console.error('Weather API error:', error);
  }
}

testWeatherAPI();
FIXES:

Verify API Key

Check .env file has WEATHER_API_KEY=your_key_here
Verify key is valid on OpenWeatherMap dashboard
Ensure .env is loaded (use dotenv package)
Location Detection

JavaScript

// Get user location (requires user permission)
async function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocation not supported');
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
}

// Fetch weather by coordinates
async function getWeatherByLocation() {
  try {
    const location = await getUserLocation();
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to get weather:', error);
    // Fallback: Ask user to input city manually
    return null;
  }
}
Store User Location

On first visit, request location permission
Save to user profile (city, coordinates)
Use saved location for future API calls
Allow user to change location in settings
Display Weather on Dashboard

JavaScript

// Weather widget component
const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  
  useEffect(() => {
    async function fetchWeather() {
      const data = await getWeatherByLocation();
      setWeather(data);
    }
    fetchWeather();
    
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  if (!weather) return <div>Loading weather...</div>;
  
  return (
    <div className="weather-widget">
      <div className="weather-icon">
        {getPixelatedWeatherIcon(weather.weather[0].main)}
      </div>
      <div className="weather-temp">{Math.round(weather.main.temp)}°C</div>
      <div className="weather-desc">{weather.weather[0].description}</div>
      <div className="weather-location">{weather.name}</div>
    </div>
  );
};

function getPixelatedWeatherIcon(condition) {
  const icons = {
    'Clear': '☀️', // Replace with actual pixelated sun SVG
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Snow': '❄️',
    'Thunderstorm': '⚡'
  };
  return icons[condition] || '🌤️';
}
ALTERNATIVE: IP-Based Location (No Permission Needed)

JavaScript

// Use IP geolocation API (free tier available)
async function getLocationByIP() {
  const response = await fetch('https://ipapi.co/json/');
  const data = await response.json();
  return {
    city: data.city,
    country: data.country_name,
    lat: data.latitude,
    lon: data.longitude
  };
}
2. Security Page Not Loading
ISSUE: https://resurgo.life/security returns error

POSSIBLE CAUSES:

Route not defined in routing configuration
Page component missing
Build error preventing page from rendering
Incorrect file path
DIAGNOSIS:

JavaScript

// Check Next.js pages directory
// Should have: pages/security.js or pages/security/index.js

// Check routing in App.js (if React Router)
<Route path="/security" element={<SecurityPage />} />

// Check for build errors
npm run build
// Look for errors related to security page
FIXES:

Create Security Page

JavaScript

// pages/security.js (Next.js) or components/pages/Security.js

const SecurityPage = () => {
  return (
    <div className="security-page">
      <h1>Security & Privacy</h1>
      
      <section>
        <h2>Your Data is Safe</h2>
        <p>We take security seriously. Here's how we protect you:</p>
        
        <ul>
          <li>End-to-end encryption for sensitive data</li>
          <li>Secure authentication (JWT with httpOnly cookies)</li>
          <li>Regular security audits</li>
          <li>GDPR compliant</li>
          <li>No selling of user data</li>
        </ul>
      </section>
      
      <section>
        <h2>Data Storage</h2>
        <p>Your data is stored on secure servers with:</p>
        <ul>
          <li>Daily backups</li>
          <li>Encryption at rest</li>
          <li>Access controls</li>
        </ul>
      </section>
      
      <section>
        <h2>Third-Party Services</h2>
        <p>We use trusted third-party services:</p>
        <ul>
          <li>Authentication: Clerk</li>
          <li>Database: [Your database provider]</li>
          <li>Hosting: [Your hosting provider]</li>
          <li>AI: Multiple AI providers (data not stored by them)</li>
        </ul>
      </section>
      
      <section>
        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your data (export feature)</li>
          <li>Delete your data (account deletion)</li>
          <li>Opt-out of analytics</li>
          <li>Control notification preferences</li>
        </ul>
      </section>
      
      <section>
        <h2>Contact Us</h2>
        <p>Security concerns? Email us at security@resurgo.life</p>
      </section>
    </div>
  );
};

export default SecurityPage;
Add to Navigation

JavaScript

// Footer component
<Footer>
  <Link to="/privacy">Privacy Policy</Link>
  <Link to="/terms">Terms of Service</Link>
  <Link to="/security">Security</Link>
  <Link to="/help">Help</Link>
</Footer>
Ensure Route Exists

JavaScript

// In App.js or routing configuration
<Route path="/security" element={<SecurityPage />} />
Check Deployment

If using static site generation, ensure security page is included in build
If using server-side rendering, verify route handler exists
Clear cache and rebuild
📱 PWA & PROGRESSIVE ENHANCEMENT
Home Screen Widgets (Reality Check)
USER REQUEST: "I want the app to come with homescreen widgets"

TECHNICAL REALITY:

PWAs do NOT support true home screen widgets (iOS or Android)
Widgets require native app development (React Native, Flutter, Swift, Kotlin)
ALTERNATIVES FOR PWA:

App Shortcuts (Android)

JSON

// manifest.json
{
  "shortcuts": [
    {
      "name": "Add Task",
      "short_name": "Task",
      "description": "Quickly add a new task",
      "url": "/add-task",
      "icons": [{ "src": "/icons/task.png", "sizes": "192x192" }]
    },
    {
      "name": "Log Water",
      "short_name": "Water",
      "url": "/log-water",
      "icons": [{ "src": "/icons/water.png", "sizes": "192x192" }]
    }
  ]
}
Rich Push Notifications

Can display data in notification
Quick action buttons in notification
Example: "You've completed 3/5 tasks today" with [View Tasks] button
Badging API

JavaScript

// Set app icon badge count (supported on some platforms)
if ('setAppBadge' in navigator) {
  navigator.setAppBadge(3); // Shows "3" on app icon
}
Lock Screen / Notification Widgets (Limited)

Some Android skins allow notification widgets
Not widely supported
RECOMMENDATION:

For MVP: Focus on excellent PWA with push notifications and shortcuts
Future (v2): Consider React Native conversion for true widgets
DECISION POINT:
Does user want to invest in native app development now, or postpone to post-launch?

🎯 COMPREHENSIVE PROMPT FOR AI CODER (Claude Opus)
Below is the complete, detailed prompt to give to Claude Opus or any AI coding assistant:

RESURGO.LIFE - COMPLETE RESTRUCTURING & ENHANCEMENT SPECIFICATION
PROJECT CONTEXT
You are working on Resurgo.Life - an AI-powered personal development platform. The application helps users achieve goals through intelligent task management, habit formation, wellness tracking, and personalized AI coaching.

Tech Stack (assumed):

Frontend: React (Next.js or Create React App)
Backend: Node.js/Express or Next.js API routes
Database: MongoDB, PostgreSQL, or Firebase
Authentication: Clerk
Styling: CSS/Tailwind/styled-components
AI: Multiple LLM APIs (OpenAI, Anthropic, etc.)
Current Issues:

Feature bloat (too many disconnected features)
Inconsistent design (not terminal-themed throughout)
Missing integrations (weather, location APIs broken)
Poor information architecture
Weak AI integration (not central to experience)
Landing page UX issues
Missing features (sleep tracker, fitness integration)
Target State:

AI Coach-centric platform (AI is the primary interface)
Terminal-inspired design (cohesive aesthetic)
Streamlined navigation (grouped features)
Fully functional integrations
Production-ready code
TASK BREAKDOWN
PHASE 1: LANDING PAGE FIXES & ENHANCEMENTS
1.1 HEADER NAVIGATION
File: components/Header.js (or equivalent)

Changes:

JavaScript

// Fix vertical alignment
<nav style={{ display: 'flex', alignItems: 'center' }}>
  <NavLink to="/features">Features</NavLink>
  <NavLink to="/how-it-works">How It Works</NavLink>
  <NavLink to="/coaches">Coaches</NavLink>
  <NavLink to="/pricing">Pricing</NavLink>
  <NavLink to="/blog">Blog</NavLink>
  <NavLink to="/faq">FAQ</NavLink>
  <button className="cta-button-secondary">Sign In</button>
  <button className="cta-button">Sign Up</button>
</nav>
CSS:

CSS

nav {
  display: flex;
  align-items: center; /* Vertical centering */
  gap: 2rem;
}

.nav-link {
  font-size: 1rem; /* Consistent size, not tiny */
  color: #e0e6ed;
}
Remove Auto-Scroll:

JavaScript

// In landing page component, remove any useEffect with scrollIntoView
// ❌ Remove this:
useEffect(() => {
  document.getElementById('demo').scrollIntoView();
}, []);

// ✅ Only scroll on button click:
<button onClick={() => {
  document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
}}>
  SEE HOW IT WORKS ↓
</button>
1.2 UNIVERSAL CTA BUTTON
File: styles/buttons.css or component library

Create:

CSS

.cta-button {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
  color: #0a0e27;
  font-family: 'Rajdhani', sans-serif;
  font-size: 16px; /* Minimum, not tiny */
  font-weight: 700;
  padding: 14px 32px;
  border: 2px solid #FF6B35;
  border-radius: 4px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(255, 107, 53, 0.3);
  min-height: 44px;
  min-width: 120px;
}

.cta-button:hover {
  background: linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%);
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.6);
  transform: translateY(-2px);
}

.cta-button-secondary {
  background: transparent;
  color: #FF6B35;
  border: 2px solid #FF6B35;
  /* Same sizing as primary */
  padding: 14px 32px;
  font-size: 16px;
  min-height: 44px;
}

.cta-button-secondary:hover {
  background: rgba(255, 107, 53, 0.1);
}
Replace ALL button instances site-wide with these classes.

1.3 FEATURES SECTION REDESIGN
File: components/landing/FeaturesSection.js

Implement Tabbed Interface:

JavaScript

const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState('ai-coaches');
  
  const tabs = [
    { id: 'ai-coaches', label: '🤖 AI Coaches', content: <AICoachesTab /> },
    { id: 'brain-dump', label: '🧠 Brain Dump', content: <BrainDumpTab /> },
    { id: 'orchestrator', label: '📊 AI Orchestrator', content: <OrchestratorTab /> },
    { id: 'smart-tasks', label: '📋 Smart Tasks', content: <SmartTasksTab /> },
    { id: 'vision-board', label: '🎨 Vision Board', content: <VisionBoardTab /> }
  ];
  
  return (
    <section className="features-section">
      <h2 className="section-heading">Discover What Resurgo Can Do</h2>
      
      <div className="feature-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="feature-content">
        {tabs.find(t => t.id === activeTab).content}
      </div>
    </section>
  );
};

const AICoachesTab = () => (
  <div className="feature-tab-content">
    <h3>Meet Your Personal AI Team</h3>
    <div className="coaches-grid">
      <CoachCard name="Titan" icon="💪" specialty="Fitness & Health" />
      <CoachCard name="Sage" icon="💡" specialty="Wealth & Business" />
      <CoachCard name="Harmony" icon="🧘" specialty="Wellness" />
      <CoachCard name="Nexus" icon="✓" specialty="Productivity" />
    </div>
    <p>Four specialized coaches working together to help you succeed.</p>
    <button className="cta-button">TRY AI COACH DEMO →</button>
  </div>
);

// Similar for other tabs...
1.4 HOW IT WORKS (Terminal Flowchart)
File: components/landing/HowItWorksSection.js

Create ASCII/Visual Flowchart:

JavaScript

const HowItWorksSection = () => (
  <section className="how-it-works">
    <h2 className="section-heading">How Resurgo Works</h2>
    
    <div className="terminal-flowchart">
      <pre className="ascii-art">
{`
  [YOU]           →        [AI]        →     [RESULTS]
  
  Tell your              Multi-model        Achieve
  goals                  AI analyzes        goals
  & dreams               your life          faster
       ↓                      ↓                 ↑
  Share your             Creates            AI keeps
  schedule               personalized       you on
  & constraints          daily plan         track
       ↓                      ↓                 ↑
  Live your              Learns and         System
  life                   adapts to          adapts
                         patterns           to you
`}
      </pre>
    </div>
    
    <div className="steps">
      <Step number="1" title="Tell AI Your Goals" />
      <Step number="2" title="AI Builds Your System" />
      <Step number="3" title="Live Your Life, AI Handles the Rest" />
    </div>
  </section>
);
1.5 AI COACHES SECTION (2x2 Grid)
File: components/landing/CoachesSection.js

Redesign Layout:

JavaScript

const CoachesSection = () => (
  <section className="coaches-section">
    <h2 className="section-heading">Meet Your AI Team</h2>
    <p className="subtitle">Four Specialists, One Mission: Your Success</p>
    
    <div className="coaches-grid-2x2">
      <CoachCard
        name="TITAN"
        icon="💪"
        color="#FF6B35"
        specialty="Fitness & Health Coach"
        features={['Workout plans', 'Nutrition guidance', 'Sleep optimization']}
        cta="CHAT WITH TITAN"
      />
      <CoachCard
        name="SAGE"
        icon="💡"
        color="#FFD700"
        specialty="Wealth & Business"
        features={['Budget tracking', 'Business strategy', 'Investment advice']}
        cta="CHAT WITH SAGE"
      />
      <CoachCard
        name="HARMONY"
        icon="🧘"
        color="#B833FF"
        specialty="Wellness & Mindfulness"
        features={['Mood tracking', 'Meditation guides', 'Stress relief']}
        cta="CHAT WITH HARMONY"
      />
      <CoachCard
        name="NEXUS"
        icon="✓"
        color="#00D9FF"
        specialty="Productivity & Planning"
        features={['Task management', 'Goal setting', 'Time optimization']}
        cta="CHAT WITH NEXUS"
      />
    </div>
  </section>
);

const CoachCard = ({ name, icon, color, specialty, features, cta }) => (
  <div className="coach-card" style={{ borderColor: color }}>
    <div className="coach-icon" style={{ color }}>{icon}</div>
    <h3 className="coach-name">{name}</h3>
    <p className="coach-specialty">{specialty}</p>
    <ul className="coach-features">
      {features.map(f => <li key={f}>• {f}</li>)}
    </ul>
    <button className="cta-button" style={{ borderColor: color }}>
      {cta}
    </button>
  </div>
);
CSS:

CSS

.coaches-grid-2x2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .coaches-grid-2x2 {
    grid-template-columns: 1fr; /* Stack on mobile */
  }
}

.coach-card {
  background: rgba(26, 30, 55, 0.6);
  border: 2px solid;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
}

.coach-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 30px currentColor;
}
1.6 PRICING SECTION (Yearly Toggle)
File: components/landing/PricingSection.js

Implement Toggle:

JavaScript

const PricingSection = () => {
  const [billing, setBilling] = useState('monthly');
  
  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      features: ['3 goals', 'Basic AI', 'Core tools']
    },
    {
      name: 'Premium',
      price: { monthly: 12, yearly: 115 },
      features: ['Unlimited goals', 'Advanced AI', 'All features', 'Priority support']
    },
    {
      name: 'Power User',
      price: { monthly: 35, yearly: 336 },
      features: ['Everything', 'API access', 'Team accounts', 'Coaching']
    }
  ];
  
  return (
    <section className="pricing-section">
      <h2 className="section-heading">Choose Your Plan</h2>
      
      <div className="billing-toggle">
        <span className={billing === 'monthly' ? 'active' : ''}>MONTHLY</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={billing === 'yearly'}
            onChange={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
          />
          <span className="slider"></span>
        </label>
        <span className={billing === 'yearly' ? 'active' : ''}>
          YEARLY <span className="badge">Save 20%</span>
        </span>
      </div>
      
      <div className="pricing-cards">
        {plans.map(plan => (
          <PricingCard
            key={plan.name}
            name={plan.name}
            price={plan.price[billing]}
            billing={billing}
            features={plan.features}
          />
        ))}
      </div>
    </section>
  );
};

const PricingCard = ({ name, price, billing, features }) => (
  <div className="pricing-card">
    <h3>{name}</h3>
    <div className="price">
      ${price}
      <span className="billing-period">
        {billing === 'yearly' ? '/year' : '/month'}
      </span>
    </div>
    {billing === 'yearly' && price > 0 && (
      <p className="savings">That's ${Math.round(price / 12)}/month</p>
    )}
    <ul>
      {features.map(f => <li key={f}>✓ {f}</li>)}
    </ul>
    <button className="cta-button">
      {price === 0 ? 'START FREE' : 'UPGRADE'}
    </button>
  </div>
);
Toggle CSS:

CSS

.billing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.switch {
  position: relative;
  width: 60px;
  height: 30px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 30px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #FF6B35;
}

input:checked + .slider:before {
  transform: translateX(30px);
}
If toggle is too complex: Keep separate monthly/yearly columns.

1.7 SECTION HEADINGS ENHANCEMENT
Apply to all sections:

CSS

.section-heading {
  font-family: 'Rajdhani', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: #FF6B35;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 3rem;
  position: relative;
  text-align: center;
}

.section-heading::before {
  content: '━━━━━━━━━━━━━━━';
  display: block;
  color: #00d9ff;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.section-heading::after {
  content: '━━━━━━━━━━━━━━━';
  display: block;
  color: #00d9ff;
  font-size: 1rem;
  margin-top: 0.5rem;
}
1.8 AI HABIT PLANNER + COMPANION FEATURE
File: components/landing/AdvancedToolsSection.js

JavaScript

const AdvancedToolsSection = () => (
  <section className="advanced-tools">
    <h2 className="section-heading">Advanced AI Tools</h2>
    
    <div className="tools-grid">
      <ToolCard
        title="AI Habit Planner"
        description="AI creates custom habit plans based on your goals and lifestyle."
        image="/images/habit-planner-demo.png"
        cta="TRY IT FREE"
      />
      <ToolCard
        title="Brain Dump"
        description="Dump your thoughts, AI organizes them into tasks, goals, and ideas instantly."
        image="/images/brain-dump-demo.png"
        cta="TRY IT FREE"
      />
    </div>
  </section>
);

const ToolCard = ({ title, description, image, cta }) => (
  <div className="tool-card">
    <img src={image} alt={title} className="tool-image" />
    <h3>{title}</h3>
    <p>{description}</p>
    <button className="cta-button">{cta}</button>
  </div>
);
CSS:

CSS

.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
}

.tool-card {
  background: rgba(26, 30, 55, 0.6);
  border: 1px solid #00d9ff;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
}

.tool-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 1rem;
}
1.9 EMAIL POPUP (Terminal-Themed)
File: components/EmailPopup.js

JavaScript

const EmailPopup = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setEmail('');
          setStatus('idle');
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="terminal-popup" onClick={e => e.stopPropagation()}>
        <div className="terminal-header">
          <span>TERMINAL</span>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="terminal-body">
          <p className="terminal-prompt">&gt; resurgo --subscribe</p>
          <p>Join the waitlist for exclusive early access</p>
          
          <form onSubmit={handleSubmit}>
            <div className="terminal-input-group">
              <span className="prompt">&gt; Email:</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="terminal-input"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="terminal-actions">
              <button type="submit" className="cta-button" disabled={status === 'loading'}>
                {status === 'loading' ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
              </button>
              <button type="button" onClick={onClose} className="cta-button-secondary">
                CLOSE
              </button>
            </div>
          </form>
          
          {status === 'success' && (
            <p className="terminal-success">&gt; Success! Check your email.</p>
          )}
          {status === 'error' && (
            <p className="terminal-error">&gt; Error! Please try again.</p>
          )}
          
          <p className="terminal-footnote">&gt; We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  );
};
Backend API (if not exists):

JavaScript

// api/subscribe.js (Next.js API route) or Express route

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { email } = req.body;
  
  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  
  try {
    // Save to database
    await saveEmailToDatabase(email);
    
    // Send welcome email (configure email service)
    await sendWelcomeEmail(email);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
}

async function saveEmailToDatabase(email) {
  // Implement database save
  // Example: await db.collection('subscribers').insertOne({ email, date: new Date() });
}

async function sendWelcomeEmail(email) {
  // Implement email sending (SendGrid, Mailgun, etc.)
  // Example:
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to: email,
    from: 'hello@resurgo.life',
    subject: 'Welcome to Resurgo!',
    text: 'Thanks for joining the waitlist...',
    html: '<strong>Thanks for joining!</strong>',
  };
  
  await sgMail.send(msg);
  */
}
CSS:

CSS

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.terminal-popup {
  background: #0a0e27;
  border: 2px solid #00d9ff;
  border-radius: 4px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 0 30px rgba(0, 217, 255, 0.5);
  font-family: 'Fira Code', monospace;
}

.terminal-header {
  background: #00d9ff;
  color: #0a0e27;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: #0a0e27;
  font-size: 1.5rem;
  cursor: pointer;
}

.terminal-body {
  padding: 2rem;
  color: #00ff00;
}

.terminal-prompt {
  color: #00d9ff;
  margin-bottom: 0.5rem;
}

.terminal-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1.5rem 0;
}

.terminal-input {
  flex: 1;
  background: #1a1e37;
  border: 1px solid #00d9ff;
  color: #00ff00;
  padding: 0.75rem;
  font-family: 'Fira Code', monospace;
  border-radius: 3px;
}

.terminal-success {
  color: #00ff88;
  margin-top: 1rem;
}

.terminal-error {
  color: #ff3366;
  margin-top: 1rem;
}

.terminal-footnote {
  font-size: 0.875rem;
  color: #8892a6;
  margin-top: 1rem;
}
1.10 CLERK EMAIL TEMPLATES
Access: Clerk Dashboard → Customization → Emails

Update each template:

Verification Email
Magic Link Email
Password Reset Email
Changes:

Replace "Ascend" with "Resurgo"
Upload Resurgo logo (Settings → Branding → Upload Logo)
Update colors to match brand
Update email copy
Example Verification Email:

text

Subject: Verify your Resurgo account

Hi {{user.firstName}},

Welcome to Resurgo! 🎉

Verify your email to unlock your AI-powered personal development system.

{{verification_button}}

Or copy this link: {{verification_link}}

If you didn't sign up, ignore this email.

Best,
The Resurgo Team

---

Need help? Reply to this email or visit https://resurgo.life/help
1.11 PWA INSTALL BUTTON
File: Component that triggers PWA install

Update button text:

JavaScript

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);
  
  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User installed PWA');
        }
        setDeferredPrompt(null);
      });
    }
  };
  
  if (!deferredPrompt) return null;
  
  return (
    <button onClick={handleInstall} className="cta-button">
      📱 Add to Home Screen {/* Changed from "Install as PWA" */}
    </button>
  );
};
Note about widgets: PWAs don't support true home screen widgets. Document this limitation and suggest alternatives (shortcuts, rich notifications).

PHASE 2: DASHBOARD RESTRUCTURING
2.1 NEW SIDEBAR STRUCTURE
File: components/Sidebar.js or equivalent

Implement Collapsible Sidebar:

JavaScript

const Sidebar = () => {
  const [expanded, setExpanded] = useState({
    dashboard: true,
    personal: false,
    wellness: false,
    health: false,
    fitness: false,
    wealth: false
  });
  
  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.svg" alt="Resurgo" />
        <span>RESURGO</span>
      </div>
      
      {/* Dashboard Section */}
      <div className="sidebar-section">
        <button
          className="section-header"
          onClick={() => toggleSection('dashboard')}
        >
          <span>▼ DASHBOARD</span>
        </button>
        {expanded.dashboard && (
          <ul className="section-items">
            <li><NavLink to="/dashboard/goals">Goals</NavLink></li>
            <li><NavLink to="/dashboard/habits">Habits</NavLink></li>
            <li><NavLink to="/dashboard/tasks">Tasks</NavLink></li>
            <li><NavLink to="/dashboard/calendar">Calendar</NavLink></li>
            <li><NavLink to="/dashboard/analytics">Analytics</NavLink></li>
          </ul>
        )}
      </div>
      
      {/* AI Coach Section */}
      <NavLink to="/ai-coach" className="sidebar-item-primary">
        🤖 AI COACH ★
      </NavLink>
      
      {/* Personal Section */}
      <div className="sidebar-section">
        <button
          className="section-header"
          onClick={() => toggleSection('personal')}
        >
          <span>▼ PERSONAL</span>
        </button>
        {expanded.personal && (
          <ul className="section-items">
            <li><NavLink to="/personal/vision-board">Vision Board</NavLink></li>
            <li><NavLink to="/personal/journal">Journal</NavLink></li>
          </ul>
        )}
      </div>
      
      {/* Wellness Section */}
      <div className="sidebar-section">
        <button
          className="section-header"
          onClick={() => toggleSection('wellness')}
        >
          <span>▼ WELLNESS</span>
        </button>
        {expanded.wellness && (
          <ul className="section-items">
            <li><NavLink to="/wellness/mood">Mood</NavLink></li>
            <li><NavLink to="/wellness/sleep">Sleep</NavLink></li>
            <li><NavLink to="/wellness/meditation">Meditation</NavLink></li>
          </ul>
        )}
      </div>
      
      {/* Health Section */}
      <div className="sidebar-section">
        <button
          className="section-header"
          onClick={() => toggleSection('health')}
        >
          <span>▼ HEALTH</span>
        </button>
        {expanded.health && (
          <ul className="section-items">
            <li><NavLink to="/health/calories">Calorie Tracker</NavLink></li>
            <li><NavLink to="/health/diet-plan">Diet Plan</NavLink></li>
            <li><NavLink to="/health/water">Water Tracker</NavLink></li>
            <li><NavLink to="/health/nutrition">Nutrition Analytics</NavLink></li>
          </ul>
        )}
      </div>
      
      {/* Fitness Section */}
      <div className="sidebar-section">
        <button
          className="section-header"
          onClick={() => toggleSection('fitness')}
        >
          <span>▼ FITNESS</span>
        </button>
        {expanded.fitness && (
          <ul className="section-items">
            <li><NavLink to="/fitness/running">Running</NavLink></li>
            <li><NavLink to="/fitness/workouts">Workout Plans</NavLink></li>
            <li><NavLink to="/fitness/weight">Weight Management</NavLink></li>
            <li><NavLink to="/fitness/exercises">Exercise Library</NavLink></li>
          </ul>
        )}
      </div>
      
      {/* Wealth Section (Optional) */}
      <div className="sidebar-section">
        <button
          className="section-header"
          onClick={() => toggleSection('wealth')}
        >
          <span>▼ WEALTH</span>
        </button>
        {expanded.wealth && (
          <ul className="section-items">
            <li><NavLink to="/wealth/budget">Budget</NavLink></li>
            <li><NavLink to="/wealth/business">Business</NavLink></li>
            <li><NavLink to="/wealth/wishlist">Wish List</NavLink></li>
            <li><NavLink to="/wealth/assets">Assets</NavLink></li>
          </ul>
        )}
      </div>
      
      {/* Bottom Items */}
      <NavLink to="/settings" className="sidebar-item">⚙️ Settings</NavLink>
      <NavLink to="/help" className="sidebar-item">📚 Help</NavLink>
      <NavLink to="/profile" className="sidebar-item">👤 Profile</NavLink>
    </aside>
  );
};
CSS:

CSS

.sidebar {
  width: 280px;
  background: #0a0e27;
  border-right: 1px solid #00d9ff;
  padding: 1.5rem;
  overflow-y: auto;
  height: 100vh;
  position: fixed;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #FF6B35;
}

.sidebar-section {
  margin-bottom: 1rem;
}

.section-header {
  width: 100%;
  background: transparent;
  border: none;
  color: #00d9ff;
  text-align: left;
  padding: 0.75rem 0.5rem;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 1px;
  transition: background 0.2s;
}

.section-header:hover {
  background: rgba(0, 217, 255, 0.1);
}

.section-items {
  list-style: none;
  padding-left: 1.5rem;
  margin: 0.5rem 0;
}

.section-items li {
  margin: 0.25rem 0;
}

.section-items a {
  color: #e0e6ed;
  text-decoration: none;
  display: block;
  padding: 0.5rem;
  border-radius: 3px;
  transition: all 0.2s;
}

.section-items a:hover {
  background: rgba(255, 107, 53, 0.1);
  color: #FF6B35;
}

.section-items a.active {
  background: rgba(255, 107, 53, 0.2);
  color: #FF6B35;
  border-left: 3px solid #FF6B35;
}

.sidebar-item-primary {
  display: block;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(0, 217, 255, 0.2));
  border: 1px solid #FF6B35;
  color: #FF6B35;
  padding: 1rem;
  text-align: center;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 700;
  margin: 1rem 0;
  transition: all 0.3s;
}

.sidebar-item-primary:hover {
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
  transform: translateX(5px);
}

.sidebar-item {
  display: block;
  color: #e0e6ed;
  padding: 0.75rem 0.5rem;
  text-decoration: none;
  border-radius: 3px;
  margin: 0.25rem 0;
  transition: all 0.2s;
}

.sidebar-item:hover {
  background: rgba(224, 230, 237, 0.1);
}
2.2 DASHBOARD WIDGETS (Terminal-Themed)
File: pages/Dashboard.js or equivalent

Layout:

JavaScript

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Header />
      
      <div className="dashboard-greeting">
        Good evening, {user.name}! Here's your command center. 🚀
      </div>
      
      {/* AI Analysis - TOP PRIORITY */}
      <AIAnalysisWidget />
      
      {/* Quick Actions + Clock */}
      <div className="dashboard-row">
        <QuickActionsWidget />
        <TerminalClockWidget />
      </div>
      
      {/* Core Metrics */}
      <div className="dashboard-grid">
        <TaskOverviewWidget />
        <HabitStreaksWidget />
        <GoalsProgressWidget />
      </div>
      
      {/* Health & Fitness Summary */}
      <HealthFitnessSummaryWidget />
      
      {/* Vision Board Preview + Quick Note */}
      <div className="dashboard-row">
        <VisionBoardPreviewWidget />
        <QuickNoteWidget />
      </div>
      
      {/* Sleep Tracker */}
      <SleepTrackerWidget />
      
      {/* Fitness Summary */}
      <FitnessSummaryWidget />
    </div>
  );
};
AI Analysis Widget:

JavaScript

const AIAnalysisWidget = () => {
  const [analysis, setAnalysis] = useState(null);
  
  useEffect(() => {
    fetchAIAnalysis().then(setAnalysis);
  }, []);
  
  if (!analysis) return <div>Loading AI analysis...</div>;
  
  return (
    <div className="widget ai-analysis-widget">
      <div className="widget-header">AI ANALYSIS</div>
      <div className="widget-content">
        <p className="analysis-message">{analysis.message}</p>
        <ul className="analysis-highlights">
          {analysis.highlights.map((h, i) => (
            <li key={i}>• {h}</li>
          ))}
        </ul>
        {analysis.suggestion && (
          <p className="analysis-suggestion">
            💡 Suggestion: {analysis.suggestion}
          </p>
        )}
        <button className="cta-button" onClick={() => navigateToAICoach()}>
          CHAT WITH AI COACH
        </button>
      </div>
    </div>
  );
};

async function fetchAIAnalysis() {
  // Call backend API that uses AI to analyze user's recent activity
  const response = await fetch('/api/ai/daily-analysis');
  return response.json();
  
  // Example response:
  /*
  {
    message: "You're on fire this week! 🔥",
    highlights: [
      "85% task completion (up from 72%)",
      "12-day meditation streak",
      "Calorie goal met 6/7 days"
    ],
    suggestion: "Add a rest day this week for recovery."
  }
  */
}
Terminal Clock Widget:

JavaScript

const TerminalClockWidget = () => {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    fetchWeather().then(setWeather);
  }, []);
  
  const formatTime = () => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  
  const formatDate = () => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${days[time.getDay()]} ${time.getDate()} ${months[time.getMonth()]} ${time.getFullYear()}`;
  };
  
  return (
    <div className="widget terminal-clock-widget">
      <div className="clock-display">
        <div className="clock-date">{formatDate()}</div>
        <div className="clock-time">{formatTime()}</div>
        {weather && (
          <div className="clock-weather">
            <span className="weather-icon">{getPixelatedWeatherIcon(weather.condition)}</span>
            <span>{weather.temp}°C</span>
            <span>{weather.description}</span>
          </div>
        )}
      </div>
    </div>
  );
};

function getPixelatedWeatherIcon(condition) {
  // Return appropriate pixelated icon
  // For now, use emoji; later replace with actual pixel art SVG
  const icons = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Snow': '❄️',
    'Thunderstorm': '⚡'
  };
  return icons[condition] || '🌤️';
}

async function fetchWeather() {
  // Implement weather API call (see Phase 3.1)
  return { condition: 'Clear', temp: 23, description: 'Clear Sky' };
}
CSS for Terminal Clock:

CSS

.terminal-clock-widget {
  background: #000;
  border: 2px solid #00ff00;
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
}

.clock-display {
  font-family: 'Fira Code', monospace;
  color: #00ff00;
  text-align: center;
  padding: 1.5rem;
}

.clock-date {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.clock-time {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 2px;
}

.clock-weather {
  margin-top: 1rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.weather-icon {
  font-size: 1.5rem;
}
Quick Actions Widget:

JavaScript

const QuickActionsWidget = () => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  
  return (
    <div className="widget quick-actions-widget">
      <div className="widget-header">QUICK ACTIONS</div>
      <div className="widget-content">
        <div className="action-buttons">
          <button className="quick-action-btn" onClick={() => setShowTaskModal(true)}>
            + Task
          </button>
          <button className="quick-action-btn" onClick={() => setShowNoteModal(true)}>
            + Note
          </button>
          <button className="quick-action-btn" onClick={() => logWater()}>
            💧 Water
          </button>
          <button className="quick-action-btn" onClick={() => logMeal()}>
            🍽️ Meal
          </button>
          <button className="quick-action-btn" onClick={() => logWorkout()}>
            💪 Workout
          </button>
        </div>
      </div>
      
      {showTaskModal && <QuickTaskModal onClose={() => setShowTaskModal(false)} />}
      {showNoteModal && <QuickNoteModal onClose={() => setShowNoteModal(false)} />}
    </div>
  );
};

function logWater() {
  // Open modal or inline form to log water intake
}

function logMeal() {
  // Open modal to log meal
}

function logWorkout() {
  // Open modal to log workout
}
Task Overview Widget:

JavaScript

const TaskOverviewWidget = () => {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    fetchTodaysTasks().then(setTasks);
  }, []);
  
  const toggleTask = async (taskId) => {
    await updateTaskStatus(taskId, 'completed');
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };
  
  const completedCount = tasks.filter(t => t.completed).length;
  
  return (
    <div className="widget task-overview-widget">
      <div className="widget-header">TASK OVERVIEW</div>
      <div className="widget-content">
        <p>Today: {completedCount}/{tasks.length} complete</p>
        <ul className="task-list">
          {tasks.slice(0, 7).map(task => (
            <li key={task.id} className="task-item">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="task-checkbox"
              />
              <span className={task.completed ? 'task-text completed' : 'task-text'}>
                {task.title}
              </span>
            </li>
          ))}
        </ul>
        <button className="cta-button-secondary" onClick={() => navigate('/dashboard/tasks')}>
          ADD TASK
        </button>
      </div>
    </div>
  );
};

async function fetchTodaysTasks() {
  const response = await fetch('/api/tasks/today');
  return response.json();
}

async function updateTaskStatus(taskId, status) {
  await fetch(`/api/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
}
Habit Streaks Widget:

JavaScript

const HabitStreaksWidget = () => {
  const [habits, setHabits] = useState([]);
  
  useEffect(() => {
    fetchHabits().then(setHabits);
  }, []);
  
  return (
    <div className="widget habit-streaks-widget">
      <div className="widget-header">HABIT STREAKS</div>
      <div className="widget-content">
        {habits.map(habit => (
          <div key={habit.id} className="habit-streak">
            <span className="habit-streak-fire">🔥</span>
            <span className="habit-name">{habit.name}:</span>
            <span className="habit-days">{habit.streak}d</span>
          </div>
        ))}
        <button className="cta-button-secondary" onClick={() => navigate('/dashboard/habits')}>
          VIEW ALL
        </button>
      </div>
    </div>
  );
};

async function fetchHabits() {
  const response = await fetch('/api/habits');
  const all = await response.json();
  return all
    .filter(h => h.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5);
}
Health & Fitness Summary Widget:

JavaScript

const HealthFitnessSummaryWidget = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchHealthFitnessData().then(setData);
  }, []);
  
  if (!data) return null;
  
  return (
    <div className="widget health-fitness-widget">
      <div className="widget-header">HEALTH & FITNESS</div>
      <div className="widget-content">
        <div className="health-grid">
          <div className="health-stat">
            <span className="health-icon">💧</span>
            <span>Water: {data.water.current}/{data.water.goal} glasses</span>
          </div>
          <div className="health-stat">
            <span className="health-icon">🍎</span>
            <span>Calories: {data.calories.current}/{data.calories.goal}</span>
          </div>
          <div className="health-stat">
            <span className="health-icon">😴</span>
            <span>Sleep: {data.sleep.hours}h ({data.sleep.quality})</span>
          </div>
          <div className="health-stat">
            <span className="health-icon">💪</span>
            <span>Workouts: {data.workouts.thisWeek}/5</span>
          </div>
        </div>
        <button className="cta-button" onClick={() => navigate('/wellness')}>
          VIEW WELLNESS CENTER
        </button>
      </div>
    </div>
  );
};

async function fetchHealthFitnessData() {
  const response = await fetch('/api/health/summary');
  return response.json();
}
Sleep Tracker Widget:

JavaScript

const SleepTrackerWidget = () => {
  const [sleepData, setSleepData] = useState(null);
  
  useEffect(() => {
    fetchSleepData().then(setSleepData);
  }, []);
  
  if (!sleepData) return null;
  
  return (
    <div className="widget sleep-tracker-widget">
      <div className="widget-header">SLEEP TRACKER</div>
      <div className="widget-content">
        <div className="sleep-stats">
          <div className="sleep-stat">
            <label>Last Night:</label>
            <span className="sleep-value">{sleepData.lastNight} hours</span>
          </div>
          <div className="sleep-stat">
            <label>Weekly Average:</label>
            <span className="sleep-value">{sleepData.weeklyAvg} hours</span>
          </div>
          <div className="sleep-stat">
            <label>Sleep Quality:</label>
            <span className="sleep-value">{sleepData.quality}/100</span>
          </div>
        </div>
        <button className="cta-button-secondary" onClick={() => navigate('/wellness/sleep')}>
          LOG SLEEP
        </button>
      </div>
    </div>
  );
};

async function fetchSleepData() {
  const response = await fetch('/api/sleep/summary');
  return response.json();
}
Fitness Summary Widget:

JavaScript

const FitnessSummaryWidget = () => {
  const [fitnessData, setFitnessData] = useState(null);
  
  useEffect(() => {
    fetchFitnessData().then(setFitnessData);
  }, []);
  
  if (!fitnessData) return null;
  
  return (
    <div className="widget fitness-summary-widget">
      <div className="widget-header">FITNESS SUMMARY</div>
      <div className="widget-content">
        <div className="fitness-stats">
          <div className="fitness-stat">
            <label>This Week's Workouts:</label>
            <span>{fitnessData.workoutsThisWeek}/5 completed</span>
          </div>
          <div className="fitness-stat">
            <label>Calories Burned:</label>
            <span>{fitnessData.caloriesBurned} kcal</span>
          </div>
          <div className="fitness-stat">
            <label>Active Minutes:</label>
            <span>{fitnessData.activeMinutes} min</span>
          </div>
        </div>
        <button className="cta-button" onClick={() => navigate('/fitness')}>
          VIEW FULL FITNESS
        </button>
      </div>
    </div>
  );
};

async function fetchFitnessData() {
  const response = await fetch('/api/fitness/summary');
  return response.json();
}
Vision Board Preview Widget:

JavaScript

const VisionBoardPreviewWidget = () => {
  const [visionBoard, setVisionBoard] = useState(null);
  
  useEffect(() => {
    fetchVisionBoard().then(setVisionBoard);
  }, []);
  
  if (!visionBoard) {
    return (
      <div className="widget vision-board-widget">
        <div className="widget-header">VISION BOARD</div>
        <div className="widget-content">
          <p>Create your vision board to visualize your goals!</p>
          <button className="cta-button" onClick={() => navigate('/personal/vision-board')}>
            CREATE VISION BOARD
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="widget vision-board-widget">
      <div className="widget-header">VISION BOARD PREVIEW</div>
      <div className="widget-content">
        <img
          src={visionBoard.thumbnail}
          alt={visionBoard.title}
          className="vision-board-thumbnail"
        />
        <p className="vision-board-title">{visionBoard.title}</p>
        <button className="cta-button" onClick={() => navigate('/personal/vision-board')}>
          OPEN FULL BOARD
        </button>
      </div>
    </div>
  );
};

async function fetchVisionBoard() {
  const response = await fetch('/api/vision-board/active');
  return response.json();
}
Quick Note / Brain Dump Widget:

JavaScript

const QuickNoteWidget = () => {
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  
  const handleSave = async () => {
    if (!note.trim()) return;
    
    setSaving(true);
    await fetch('/api/brain-dump', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: note })
    });
    
    // AI processes the brain dump
    // Show success message
    alert('Note saved and organized by AI!');
    setNote('');
    setSaving(false);
  };
  
  return (
    <div className="widget quick-note-widget">
      <div className="widget-header">QUICK NOTE / BRAIN DUMP</div>
      <div className="widget-content">
        <textarea
          className="terminal-textarea"
          placeholder=">_ Brain dump here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows="4"
        />
        <button
          className="cta-button"
          onClick={handleSave}
          disabled={saving || !note.trim()}
        >
          {saving ? 'SAVING...' : 'SAVE NOTE'}
        </button>
      </div>
    </div>
  );
};
Center Alignment:

CSS

.dashboard {
  max-width: 1400px;
  margin: 0 auto; /* Centers dashboard content */
  padding: 2rem;
}

.widget-content {
  text-align: center; /* Or left, depending on widget */
}
Remove Modern Widget Look:

CSS

/* Avoid soft shadows, rounded corners >8px */
.widget {
  background: rgba(26, 30, 55, 0.6);
  border: 1px solid #00d9ff;
  border-radius: 4px; /* Max 4px, not 12px */"



Plan 2 : # Resurgo Full Redesign — Landing, Dashboard, Sidebar, AI Coach

**Decisions locked:**
- Pricing: 3 tiers with Annual/Monthly toggle for Pro
- AI Coach: UI routing structure + @ mentions now, deep AI context later
- Wealth: Budget + Business + Wishlist (no live prices)
- Clerk: Manual template update instructions provided at end

---

## Phase 1 — Universal Button System (affects all pages)

### Steps

1. Create `src/components/ui/TermButton.tsx` — a single button component with 3 variants:
   - `primary`: `border-2 border-orange-600 bg-orange-600 px-5 py-2.5 font-terminal text-sm font-semibold text-black shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:bg-orange-500 active:translate-x-px active:translate-y-px`
   - `secondary`: `border-2 border-zinc-700 bg-transparent px-5 py-2.5 font-terminal text-sm text-zinc-300 hover:border-orange-600 hover:text-orange-400`
   - `ghost`: `border border-zinc-800 bg-zinc-900 px-4 py-2 font-terminal text-xs text-zinc-400 hover:border-zinc-700`
   - Also handles `size` prop (sm/md/lg) and `loading` state

2. Replace all CTA buttons across:
   - `src/components/LandingPageV2.tsx`
   - `src/components/marketing/EmailCapture.tsx`
   - `src/components/marketing/StickyCTA.tsx`
   - `src/components/marketing/ExitIntent.tsx`
   - `src/app/(marketing)/pricing/page.tsx`

3. Replace tiny-font / inconsistent buttons in all dashboard pages (tasks, habits, goals, settings) with `TermButton ghost/secondary` variants.

---

## Phase 2 — Landing Page Redesign

### 2a. Nav vertical alignment
In `src/components/LandingPageV2.tsx` the `<nav>` inner div needs `h-full items-center flex` to match the logo row height. Add `min-h-[48px]` to the flex row and `self-center` to the nav links container.

### 2b. Section headings
Replace each plain `<h2>` with a consistent terminal-banner pattern:
```
[ ── SECTION_LABEL ── ]   (pixel font, orange, bordered)
Main Heading               (larger, zinc-100)
```
Apply to all 9 sections: How It Works, Features, AI Coaches, Pricing, Testimonials, Demo, Brand Story, Achievement, FAQ.

### 2c. "How Resurgo Works" → Terminal Flowchart
Replace the 3-column step grid with a stepped vertical terminal pipeline:
- Each step is a labeled `process block` with ASCII borders and `bg-zinc-950`
- Arrow connectors using CSS border/pseudo-elements between steps
- Side branches showing outputs: Goal → [Milestones · Tasks · Habits] → Daily Loop → [XP · Streaks] → AI Review → [Adaptive Plan]
- Add a 4th step: "AI Coach adapts your plan"
- Keep the pixel font labels, add a blinking cursor at the end

### 2d. Features Section — Tabbed Terminal Window
Replace the 12-card static grid with a **tabbed terminal window**:
- Terminal window chrome (dots, title bar `CAPABILITIES_OVERVIEW.sh`)
- 5 category tabs: `PLANNING | HABITS | FOCUS | AI_SYSTEMS | WELLNESS`
- Each tab shows 3–4 features as terminal stdout lines: `✓ Brain Dump (NEW) — Pour thoughts, AI extracts tasks`
- Animate tab switching with a scanline-style transition
- Mention Brain Dump, AI Orchestrator, 6 coaches, Deep Scan explicitly as features

### 2e. AI Coaches Section — 2×3 Grid
Rebuild from 3-col to `grid-cols-2 gap-px` always:
- 6 coaches: MARCUS, AURORA, TITAN, SAGE, PHOENIX, NOVA (full list from coach page, not just 4)
- Each card: coach codename in `font-pixel`, title, 2-line personality, `[expertise tags]` in `font-terminal text-xs`
- Free badge (green) / Pro badge (orange)
- Card hover: border animates to coach's accent color
- Add line at bottom: "Mention any coach with @TITAN in the chat"

### 2f. Pricing — 3 Tiers + Annual Toggle
Rebuild `ACCESS_TIERS` data to 3 tiers (Free, Pro, Lifetime).
- Add `const [annual, setAnnual] = useState(false)` state
- Pro tier shows `$4.99/mo` or `$29.99/yr ($2.49/mo, save 50%)` based on toggle
- Toggle button: two-state pill `MONTHLY | ANNUAL (SAVE 50%)` above the cards
- Remove the standalone "PRO YEARLY" card

### 2g. AI Habit Planner Section — Compact 2-Column
Resize `<DemoSandbox />` to 50% width, add a new `<BrainDumpDemo />` marketing card beside it (static demo showing brain dump → task extraction). Keep `EmailCapture` below the pair.

### 2h. Exit Intent Popup — Terminal Redesign
Rewrite `src/components/marketing/ExitIntent.tsx`:
- Terminal modal chrome: `INTERRUPT :: PROCESS_TERMINATING` label bar
- Blinking cursor prompt: `> Enter your email to receive the blueprint_`
- Email input styled as terminal input with `$_` prefix
- Button: `[ SEND_BLUEPRINT ]` primary variant
- Verify `/api/leads/capture` route exists and works

### 2i. PWA Button Text
Change all 3 instances of "Install as PWA" / "INSTALL_AS_PWA" to `"Install on Homescreen"`. Update descriptive text to mention homescreen shortcuts.

### 2j. Landing Nav / Footer
- Upgrade header nav to include a "Resources" dropdown (Blog, Tools, Templates, Use Cases)
- Keep simple on mobile (collapsible)
- Make the footer logo use `<Logo showText size="md" />` everywhere — only one logo component across entire site, same in header, footer, dashboard

### 2k. Security Page
Create `src/app/(marketing)/security/page.tsx` with terminal-styled content:
- Clerk authentication, Convex end-to-end encryption, zero data selling, password-free auth, session management, GDPR notes
- Add "Security" link to marketing nav / footer

---

## Phase 3 — Dashboard Widget Enhancements

### 3a. Digital Clock Widget
Create `src/components/widgets/DigitalClockWidget.tsx`:
- Real-time clock updating every second via `setInterval`
- Format: `HH:MM:SS` in `font-pixel text-2xl text-orange-400` with terminal glow
- Shows day + date below in `font-terminal`
- Compact — fits in a 1-col dashboard cell

### 3b. Quick Task Widget
Create `src/components/widgets/QuickTaskWidget.tsx`:
- Single-line input with inline `[ + ADD ]` button
- On submit: calls `api.tasks.create` with `priority: 'medium'`, `source: 'dashboard_quick'`
- Shows last 3 tasks added via this widget with tick-off button

### 3c. Quick Note Widget
Create `src/components/widgets/QuickNoteWidget.tsx`:
- Textarea (3 rows) with `[ SAVE_NOTE ]` button
- Saves to Convex (add `scratchNotes` table to schema, or pipe through brain dump API)
- Shows most recent note below with timestamp
- `[ → BRAIN DUMP ]` button to send content to the AI processor

### 3d. Sleep Tracker Widget
Create `src/components/widgets/SleepWidget.tsx`:
- Queries `api.sleep.listSleepLogs` for last entry
- Displays last logged sleep: hours, quality score 1–5, time
- `[ LOG_SLEEP ]` inline form: bedtime, wake time, quality slider
- Calls existing `api.sleep.logSleep` mutation

### 3e. Vision Board Widget
Create `src/components/widgets/VisionBoardWidget.tsx`:
- Queries `api.visionBoard.getItems` (check if exists, else stub)
- Shows 2–3 vision board image thumbnails in compact card
- `[ OPEN_STUDIO ]` link to `/vision-board`

### 3f. Dashboard Layout Reorder
In `src/app/(dashboard)/dashboard/page.tsx`:
- Row 1: `DigitalClockWidget` | AI Analysis (moved up, condensed) | `QuickTaskWidget`
- Row 2: XP/Level | Water | `SleepWidget`
- Row 3: `QuickNoteWidget` | `VisionBoardWidget` | Activity Feed
- Row 4: Focus Timer | Habit Streaks | AI Coach (existing new widgets)
- Row 5: Journal | Goal Progress | Calorie Tracker
- Weather and Daily Quote remain below
- Replace Brain Dump floating button with AI Coach floating button linking to `/coach`

---

## Phase 4 — Sidebar Restructure

### 4a. New `NAV_SECTIONS` in `src/app/(dashboard)/layout.tsx`

```
── COMMAND CENTER ──
  > Dashboard (collapsible)
      Goals | Habits | Tasks | Calendar | Analytics

── PERSONAL ──
  > Wellness       (mood, journal, sleep, meditation)
  > Health         (calories, diet plan, water tracker)
  > Fitness        (running, workouts, weight)
  > Vision Board

── WEALTH ──
  > Budget
  > Business
  > Wishlist        (new page)

── AI SYSTEMS ──
  > AI Coach       (Plan Builder, Brain Dump, Orchestrator, Deep Scan as tabs inside)

── SETTINGS ──
  > Settings | Integrations | Refer & Earn
```

### 4b. Collapsible sidebar sections
- Add `collapsedSections` state (Set of section names)
- Sections with sub-items get a disclosure triangle `▶ / ▼`
- Sub-items are indented links with a `│` connector line
- On mobile, all sections start collapsed except COMMAND CENTER

### 4c. Wellness / Health / Fitness Hub Pages
- `/wellness` → adds `meditation` tab alongside existing mood, journal, sleep
- `/health` → new page with tabs: Calories, Diet Plan, Water (unified from scattered widgets)
- `/fitness` → new page with tabs: Workouts, Running Log, Weight Tracking

### 4d. Wealth Hub
Create `src/app/(dashboard)/wealth/page.tsx`:
- 3 tabs: Budget (links to `/budget`), Business (links to `/business`), Wishlist (new)
- Keep existing standalone budget/business pages working

### 4e. Wishlist
- Add `wishlistItems` table to `convex/schema.ts`
- Create `convex/wishlist.ts` with CRUD: item name, price, priority, link, "bought" toggle
- Create `src/app/(dashboard)/wishlist/page.tsx`

---

## Phase 5 — AI Coach Tab Overhaul (UI + Routing)

### 5a. Coach page restructure
`src/app/(dashboard)/coach/page.tsx` new layout:
- Left panel: coach selector (6 coaches) + conversation history list
- Right panel: main chat area
- Bottom tab strip within page: `CHAT | PLAN_BUILDER | BRAIN_DUMP | DEEP_SCAN | ORCHESTRATOR`
- Each non-chat tab lazy-loads the existing component (`PlanBuilderPage`, `BrainDump`, `DeepScanProtocol`, `AIOrchestrator`)

### 5b. @ mention routing
- In chat input, detect `@TITAN`, `@SAGE`, `@NOVA` etc. tokens
- If detected, auto-switch selected coach
- Show `@CoachName` as a highlighted chip in the input
- The existing `coachAI.sendWithPersona` call already accepts `persona` — pass the detected coach ID

### 5c. Coach expertise suggestions
- When user selects a coach, quick-prompts panel shows domain-matched suggestions
- Add `COACH_CAPABILITIES` array mapping each coach to skills + example prompts

### 5d. Context-aware action chips (UI only)
- After an AI response, parse response text for action keywords
- If response mentions "task", show `[ + Add as Task ]` chip
- If response mentions a budget item, show `[ + Add to Budget ]`
- These chips call the relevant Convex mutations client-side
- *(Deep AI context awareness from conversation = backend phase, not now)*

### 5e. Replace Brain Dump floating button
- Remove Brain Dump FAB from `layout.tsx`
- Replace with an `AI COACH` quick-launch button → navigates to `/coach`
- Brain Dump is accessible from within the AI Coach tab's BRAIN_DUMP sub-tab

---

## Phase 6 — Bug Fixes & Infrastructure

### 6a. Weather API proxy
Create `src/app/api/weather/route.ts` that proxies `wttr.in` requests server-side (avoids browser CORS/mixed-content issues in production). Update `src/components/WeatherWidget.tsx` to call `/api/weather?q={location}` instead of the external URL directly.

### 6b. Security page
Create `src/app/(marketing)/security/page.tsx` with terminal-styled content covering: Clerk authentication, Convex end-to-end encryption, zero data selling, password-free auth, session management, GDPR notes. Add "Security" to marketing footer.

### 6c. Brain Dump in Onboarding
In `src/components/DeepScanProtocol.tsx`, add a step after the initial questions: "Brain Dump — tell us everything on your mind" as an optional step with a textarea that runs through the Brain Dump API. Results pre-populate the goal/task suggestions.

### 6d. Logo consistency audit
Search for any inline text "Resurgo" or custom SVG logos in headers/footers not using the `Logo` component. Replace with `<Logo showText size={...} />` or `<LogoMark />`. Check: `MarketingFooter.tsx`, all marketing page headers, any email layout files. **One logo component everywhere — no duplicates.**

---

## Phase 7 — Clerk Email Instructions (manual update required)

The Clerk verification email template can only be changed via the Clerk Dashboard — not via code.

**Steps to perform manually:**

1. Log in to [Clerk Dashboard](https://dashboard.clerk.com) → select your Resurgo app
2. Go to **Customization → Emails**
3. For **"Email verification code"** and **"Magic link"** templates:
   - Change the **From name** from "Ascend" to "Resurgo"
   - In the email HTML body, add above the main content:
     ```html
     <img src="https://resurgo.life/logo.png" width="48" height="48" alt="Resurgo" style="display:block;margin-bottom:16px;" />
     ```
   - Change the email headline from any "Ascend" wording to: **"Resurgo — Verify your email"**
4. Save and send a test verification email to confirm changes
5. Ensure `public/logo.png` exists (export the 48×48 pixel arrow logo as PNG and place in `/public/`)

---

## Verification Checklist

After full implementation, test:

- [ ] `npx next build` — 0 errors, 195+ pages
- [ ] Nav links visually centered at mid-height on all screen sizes
- [ ] `/security` route loads correctly
- [ ] Weather widget loads via `/api/weather` proxy (no CORS error)
- [ ] Pricing toggle switches Pro price between $4.99/mo and $29.99/yr
- [ ] AI Coach tab shows all 6 coaches in 2×3 grid
- [ ] Sub-tool tabs (Plan Builder, Brain Dump, Deep Scan, Orchestrator) load inside Coach tab
- [ ] @ mention auto-switches active coach in chat
- [ ] Sidebar collapsible sections work on desktop and mobile
- [ ] Wealth tab (Budget, Business, Wishlist) renders
- [ ] Wishlist CRUD works end-to-end
- [ ] Sleep widget shows last logged data and quick-log form works
- [ ] Digital clock updates in real-time
- [ ] Quick Task widget creates tasks and lists them
- [ ] TermButton renders consistently on landing, dashboard, and marketing pages
- [ ] All instances of "Install as PWA" replaced with "Install on Homescreen"
- [ ] Brain Dump floating button replaced with AI Coach button in layout
- [ ] Logo is the same `<Logo />` component across all pages and footer
- [ ] ExitIntent popup has terminal styling, email capture works
- [ ] Git commit and push triggers clean Vercel deployment



I prefer teh plan 2 more but if the plan 2 has missed out anything then please add it from the plan 1 and make this a comprehensive and advaced plan dived into phases, after analysing add any input or changes you would think wqould benefit from the plan merging