// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO User Archetypes — Section 25
// Each archetype receives a completely different onboarding experience,
// coach tone, dashboard complexity, and vision board style.
// ═══════════════════════════════════════════════════════════════════════════════

export type UserArchetype =
  | 'the_rebuilder'   // Coming back from burnout / life crisis
  | 'the_optimizer'   // Already productive, wants an edge
  | 'the_scattered'   // ADHD / executive function challenges
  | 'the_seeker'      // Doesn't know what they want yet
  | 'the_ambitious'   // Clear goals, needs accountability
  | 'the_overwhelmed'; // Drowning — needs radical simplification

export interface ArchetypeConfig {
  archetype: UserArchetype;
  label: string;
  emoji: string;
  description: string;
  onboarding: {
    depthLevel: 'quick' | 'medium' | 'deep';
    skipBrainDump: boolean;
    autoCreateHabits: boolean;
    suggestedGoalCount: number;
    welcomeMessage: string;
  };
  coaching: {
    defaultTone: 'gentle' | 'direct' | 'challenging' | 'analytical';
    defaultCoach: string;
    checkInFrequency: 'twice_daily' | 'daily' | 'every_other_day';
    motivationalApproach: string;
    // What the AI says in the first coaching message
    firstMessagePrompt: string;
  };
  ui: {
    dashboardComplexity: 'minimal' | 'standard' | 'full';
    showStreaks: boolean;
    showAnalytics: boolean;
    emergencyModeByDefault: boolean;
    visionBoardStyle: string;
    accentColor: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ARCHETYPE CONFIGURATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const ARCHETYPE_CONFIGS: Record<UserArchetype, ArchetypeConfig> = {
  the_rebuilder: {
    archetype: 'the_rebuilder',
    label: 'The Rebuilder',
    emoji: '🌱',
    description: 'Coming back from a tough time. Needs gentle rebuilding.',
    onboarding: {
      depthLevel: 'deep',
      skipBrainDump: false,
      autoCreateHabits: true,
      suggestedGoalCount: 2,
      welcomeMessage: "Welcome. You've been through something hard. There's no pressure here — we move at your pace.",
    },
    coaching: {
      defaultTone: 'gentle',
      defaultCoach: 'phoenix',
      checkInFrequency: 'daily',
      motivationalApproach: 'Recovery is the goal. Small wins compound. No comparisons.',
      firstMessagePrompt: "Welcome back. There's no pressure here. Tell me one thing you want to be different this week.",
    },
    ui: {
      dashboardComplexity: 'minimal',
      showStreaks: false,        // Streaks feel punishing during rebuilding
      showAnalytics: false,
      emergencyModeByDefault: false,
      visionBoardStyle: 'calm-nature',
      accentColor: '#34d399',   // Soft green
    },
  },

  the_optimizer: {
    archetype: 'the_optimizer',
    label: 'The Optimizer',
    emoji: '⚡',
    description: 'Already productive, looking for that extra edge.',
    onboarding: {
      depthLevel: 'quick',
      skipBrainDump: false,
      autoCreateHabits: false,
      suggestedGoalCount: 5,
      welcomeMessage: "You already have a system. Let's find the bottlenecks and squeeze out more.",
    },
    coaching: {
      defaultTone: 'analytical',
      defaultCoach: 'atlas',
      checkInFrequency: 'daily',
      motivationalApproach: 'Data-driven improvement. Measure, iterate, optimize.',
      firstMessagePrompt: "Dump everything on your plate. I'll organize and find the bottlenecks.",
    },
    ui: {
      dashboardComplexity: 'full',
      showStreaks: true,
      showAnalytics: true,
      emergencyModeByDefault: false,
      visionBoardStyle: 'clean-minimal',
      accentColor: '#818cf8',   // Indigo
    },
  },

  the_scattered: {
    archetype: 'the_scattered',
    label: 'The Scattered',
    emoji: '🌀',
    description: 'ADHD / executive function challenges. Needs structure without rigidity.',
    onboarding: {
      depthLevel: 'medium',
      skipBrainDump: false,
      autoCreateHabits: true,
      suggestedGoalCount: 3,
      welcomeMessage: "I know your brain has 47 tabs open right now. Let's dump them all here and sort the chaos together.",
    },
    coaching: {
      defaultTone: 'direct',
      defaultCoach: 'nova',
      checkInFrequency: 'twice_daily',
      motivationalApproach: "External structure is your friend, not your enemy. I'll be your working memory.",
      firstMessagePrompt: "I know your brain has 47 tabs open. Dump it ALL here. I'll sort the chaos.",
    },
    ui: {
      dashboardComplexity: 'minimal',  // Less visual noise
      showStreaks: true,               // Gamification helps ADHD
      showAnalytics: false,
      emergencyModeByDefault: false,
      visionBoardStyle: 'vibrant-colorful',
      accentColor: '#f59e0b',   // Amber
    },
  },

  the_seeker: {
    archetype: 'the_seeker',
    label: 'The Seeker',
    emoji: '🧭',
    description: "Doesn't know what they want yet. Needs exploration, not structure.",
    onboarding: {
      depthLevel: 'deep',
      skipBrainDump: true,
      autoCreateHabits: true,
      suggestedGoalCount: 1,
      welcomeMessage: "You don't need a destination to start walking. Let's explore what matters to you.",
    },
    coaching: {
      defaultTone: 'gentle',
      defaultCoach: 'sage',
      checkInFrequency: 'every_other_day',
      motivationalApproach: "You don't need a destination to start walking. Let's explore.",
      firstMessagePrompt: "There's no wrong answer here. What's been on your mind lately? Even if it's messy.",
    },
    ui: {
      dashboardComplexity: 'minimal',
      showStreaks: false,
      showAnalytics: false,
      emergencyModeByDefault: false,
      visionBoardStyle: 'open-exploratory',
      accentColor: '#a78bfa',   // Violet
    },
  },

  the_ambitious: {
    archetype: 'the_ambitious',
    label: 'The Ambitious',
    emoji: '🚀',
    description: 'Clear goals, high energy. Needs accountability, not direction.',
    onboarding: {
      depthLevel: 'quick',
      skipBrainDump: false,
      autoCreateHabits: false,
      suggestedGoalCount: 5,
      welcomeMessage: "Good. You know what you want. Let's make sure you actually get there.",
    },
    coaching: {
      defaultTone: 'challenging',
      defaultCoach: 'titan',
      checkInFrequency: 'twice_daily',
      motivationalApproach: "You know what you want. I'll make sure you don't let yourself off the hook.",
      firstMessagePrompt: "Let's set your top 3 goals for the next 90 days. What are you going after?",
    },
    ui: {
      dashboardComplexity: 'full',
      showStreaks: true,
      showAnalytics: true,
      emergencyModeByDefault: false,
      visionBoardStyle: 'bold-ambitious',
      accentColor: '#f43f5e',   // Rose
    },
  },

  the_overwhelmed: {
    archetype: 'the_overwhelmed',
    label: 'The Overwhelmed',
    emoji: '🌊',
    description: 'Everything feels like too much. Needs radical simplification.',
    onboarding: {
      depthLevel: 'quick',
      skipBrainDump: false,
      autoCreateHabits: false,
      suggestedGoalCount: 1,
      welcomeMessage: "Hey. Take a breath. You're here, and that's already a start.",
    },
    coaching: {
      defaultTone: 'gentle',
      defaultCoach: 'phoenix',
      checkInFrequency: 'daily',
      motivationalApproach: "You don't need to do everything. You need to do ONE thing. Let's find it.",
      firstMessagePrompt: "Hey. Take a breath. Tell me one thing that's weighing on you the most right now. Just one.",
    },
    ui: {
      dashboardComplexity: 'minimal',
      showStreaks: false,
      showAnalytics: false,
      emergencyModeByDefault: true,
      visionBoardStyle: 'calm-simple',
      accentColor: '#6ee7b7',   // Teal
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: get archetype config with safe fallback
// ─────────────────────────────────────────────────────────────────────────────
export function getArchetypeConfig(archetype: string | null | undefined): ArchetypeConfig {
  if (archetype && archetype in ARCHETYPE_CONFIGS) {
    return ARCHETYPE_CONFIGS[archetype as UserArchetype];
  }
  return ARCHETYPE_CONFIGS.the_seeker; // safe default
}
