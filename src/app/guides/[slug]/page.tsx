import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Dynamic Guide Pages
// Covers all guide slugs linked from /guides index
// ═══════════════════════════════════════════════════════════════════════════════

interface GuideSection {
  heading: string;
  body: string[];
  bullets?: string[];
}

interface GuideData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  readTime: number;
  category: string;
  publishedTime: string;
  sections: GuideSection[];
  keyTakeaways: string[];
  relatedSlugs: string[];
}

const GUIDES: GuideData[] = [
  {
    slug: 'goal-setting-system',
    title: 'The Ultimate Goal Achievement System',
    subtitle: 'Turn dreams into daily actions with AI-powered decomposition',
    description:
      'Learn how to set goals that actually work. Discover SMART goals, OKRs, goal decomposition, and how to break big goals into tiny daily habits.',
    readTime: 20,
    category: 'Goals',
    publishedTime: '2026-01-15',
    sections: [
      {
        heading: 'Why Most Goal Setting Fails',
        body: [
          'The majority of people set goals incorrectly. They define outcomes ("lose 20 lbs", "earn $100k") without ever specifying the behaviors that produce those outcomes. When motivation dips — and it always does — there\'s nothing structural holding the goal together.',
          'Research on implementation intentions (Gollwitzer, 1999) shows a consistent medium-to-large effect on goal attainment when people specify *when*, *where*, and *how* they will act, not just *what* they want to achieve.',
        ],
        bullets: [
          'Vague goals produce vague actions — specificity is the core fix',
          'Identity precedes outcomes: "I am someone who trains" beats "I will train"',
          'Process goals are more controllable than outcome goals',
        ],
      },
      {
        heading: 'The Decomposition Framework',
        body: [
          'Every significant goal has three layers: the outcome (what you want), the milestones (checkpoints), and the daily behaviors (what you actually do each day). Most planning stops at milestones. The fatal gap is between milestone and daily action.',
          'Effective decomposition asks: "If I did only one thing today that moved this goal forward, what would it be?" That single action, done consistently, compounds into milestone completion — then outcome achievement.',
        ],
        bullets: [
          'Break every goal into 4–6 milestones with clear completion criteria',
          'For each milestone, define 1–3 repeatable weekly actions',
          'Daily actions should take less than 30 minutes each to be sustainable',
          'Add a "definition of done" to each milestone so you know when to move on',
        ],
      },
      {
        heading: 'The OKR Method Adapted for Personal Goals',
        body: [
          'OKRs (Objectives and Key Results) were built for organizations but adapt powerfully for individuals. The objective is your north star — ambitious, inspiring, qualitative. The key results are measurable signals that tell you if you\'re on track.',
          'For personal use: one objective per quarter maximum. Three key results that are genuinely measurable, not proxy metrics. Check-in weekly for 10 minutes. Adjust monthly if data says adjust.',
        ],
        bullets: [
          'Objective: "Become someone with a consistent fitness identity"',
          'KR1: Train at least 4 times per week for 12 consecutive weeks',
          'KR2: Complete a 5K run by end of quarter',
          'KR3: Sleep 7+ hours tracked 5 nights per week',
        ],
      },
      {
        heading: 'How RESURGO Implements This',
        body: [
          'RESURGO\'s goal engine lets you articulate the objective, build milestones, and then attach repeatable daily tasks and habits directly to each milestone. Nothing falls through the cracks.',
          'The AI coach can decompose any goal you describe into a full milestone-and-task structure in one conversation — including emotional pacing ("start with micro-wins in week 1 to build confidence before scaling intensity").',
        ],
        bullets: [
          'Goals, milestones, tasks, and habits all link in one unified system',
          'Progress is automatic — completing linked tasks moves milestone progress',
          'Weekly AI review surfaces which goals are off-track before they fail',
        ],
      },
    ],
    keyTakeaways: [
      'Set process goals, not just outcome goals',
      'Decompose every goal to a daily action level',
      'Use OKRs to connect ambition to measurable weekly behavior',
      'Check in weekly — monthly assessments alone are too slow',
    ],
    relatedSlugs: ['habit-stacking', 'identity-habits', 'goal-decomposition'],
  },
  {
    slug: 'productivity-habits',
    title: 'Productivity Habits for High Performers',
    subtitle: 'Daily routines backed by behavioral science',
    description:
      'Discover the morning routines, evening rituals, and work habits used by top performers. Backed by science and easy to implement.',
    readTime: 18,
    category: 'Productivity',
    publishedTime: '2026-01-20',
    sections: [
      {
        heading: 'The Myth of the Perfect Morning Routine',
        body: [
          'Productivity content is obsessed with morning routines — cold showers, journaling, meditation, exercise, and reading all before 7 AM. The research is more nuanced. What matters isn\'t the specific routine but the *presence* of a reliable start signal that tells your brain "work mode begins now."',
          'Cal Newport\'s research on deep work, combined with Circadian rhythm studies, suggests aligning cognitive work to your chronotype is more impactful than any specific ritual.',
        ],
        bullets: [
          'Identify your peak cognitive window (morning for most, not all)',
          'Use a 2–3 step "launch sequence" to reliably enter focused work',
          'Protect your first 90 minutes from reactive work (email, Slack, social)',
        ],
      },
      {
        heading: 'The Shutdown Ritual — Criminally Underrated',
        body: [
          'Newport\'s experiment with shutdown rituals showed dramatic improvements in subjective rest quality and sustainable output. The ritual doesn\'t end work; it creates a psychological boundary that allows genuine mental recovery.',
          'A proper shutdown ritual takes 10–15 minutes. It closes open cognitive loops, captures tomorrow\'s one critical task, and ends with a verbal or written trigger phrase like "shutdown complete."',
        ],
        bullets: [
          'Review today\'s task list and capture any open loops',
          'Plan tomorrow\'s top 3 (not 10) priorities',
          'Close all work tabs and apps before moving to personal time',
          'Use a signal phrase to tell your brain the workday is actually over',
        ],
      },
      {
        heading: 'Task Batching and Cognitive Recovery',
        body: [
          'Attention residue (Sophie Leroy\'s research) shows that switching between tasks leaves a cognitive residue that degrades performance on the new task. Batching similar tasks minimizes this cost.',
          'Practically: group all communication, all creative work, and all administrative work into separate blocks. Never interleave high-focus work with reactive tasks if performance matters.',
        ],
        bullets: [
          'Map task types: deep work, shallow work, admin, communication',
          'Assign blocks to types, not individual tasks',
          'Build recovery buffers between deep work blocks (10–15 min minimum)',
        ],
      },
      {
        heading: 'The Weekly Horizon Check',
        body: [
          'David Allen\'s Getting Things Done popularized the weekly review, but most people underuse it. A proper weekly review isn\'t just a task list audit — it\'s a strategic recalibration: what progressed this week, what didn\'t, and what changes are needed.',
          'Done in 30 minutes every Sunday, a consistent weekly review compresses the feedback loop on productivity habits and surfaces what\'s working vs what\'s friction.',
        ],
        bullets: [
          'Review all open projects and commitments',
          'Capture everything outstanding from the previous week',
          'Process your notes, calendar, and inbox to zero',
          'Set one "wildly important" focus for the incoming week',
        ],
      },
    ],
    keyTakeaways: [
      'Match cognitive work to your chronotype, not a template routine',
      'Protect the first 90 minutes of your peak window for deep work',
      'A shutdown ritual is as important as a morning ritual',
      'Batch task types to reduce attention residue penalty',
    ],
    relatedSlugs: ['morning-routine', 'two-minute-rule', 'goal-decomposition'],
  },
  {
    slug: 'habit-tracking-statistics',
    title: 'Habit Tracking Statistics & Research 2026',
    subtitle: 'Data-driven insights on what actually works',
    description:
      'Original research on habit formation success rates, streak psychology, and what the data says about building lasting habits.',
    readTime: 15,
    category: 'Research',
    publishedTime: '2026-02-01',
    sections: [
      {
        heading: 'How Long Does It Actually Take to Build a Habit?',
        body: [
          'The popular "21 days" figure comes from a misreading of Maxwell Maltz\'s 1960s plastic surgery observations. The actual research: Phillippa Lally (2010) studied 96 participants and found habit automaticity took 18 to 254 days, with a median around 66 days — highly variable based on habit complexity.',
          '"Flossing one tooth" automatizes in weeks. "Running 30 minutes before breakfast" may take 3–4 months. Complexity, consistency, and environmental friction all interact.',
        ],
        bullets: [
          'Simple habits: 18–30 days to partial automaticity',
          'Moderate habits: 40–80 days for reliable automatic behavior',
          'Complex habits: 66–200+ days depending on consistency',
          'Missing one day has minimal impact on long-term formation',
        ],
      },
      {
        heading: 'Streak Psychology: What the Data Shows',
        body: [
          'Streaks have a powerful anchoring effect on motivation — but they also create a "never miss twice" psychological pressure that can paradoxically increase quit rates after a single miss if users aren\'t prepared for it.',
          'Apps that frame a missed day as "reset to zero" show significantly higher churn than apps that use "never miss twice" framing. The behavior design insight: streaks should feel like momentum to protect, not a fragile glass object.',
        ],
        bullets: [
          '"Never miss twice" users have 3x better long-term retention than "reset to zero" framing',
          'Streak length of 7+ days significantly reduces daily quit probability',
          'Post-streak-break engagement drops 40–60% without supportive reframing',
        ],
      },
      {
        heading: 'Implementation Intentions: The Highest-Evidence Technique',
        body: [
          'Meta-analysis across 94 studies (Gollwitzer & Sheeran, 2006) found implementation intentions — "When X happens, I will do Y" — produced a medium-to-large effect on goal attainment (d ≈ 0.65). This is one of the strongest effects in behavior change research.',
          '"I will meditate at 7 AM in the kitchen after making coffee" dramatically outperforms "I will meditate daily." The specificity closes the intention-behavior gap.',
        ],
        bullets: [
          'Specify when, where, and the trigger event, not just what',
          'Link new habits to existing strong routines (habit stacking)',
          'Pre-commit publicly or to an accountability partner',
          'Use if-then plans for obstacles: "If I miss the morning slot, I will do it at lunch"',
        ],
      },
      {
        heading: 'What Habit Tracking Apps Get Wrong',
        body: [
          'Most habit trackers optimize for check-in friction reduction while ignoring the reinforcement loops that actually drive automaticity. Tapping a checkbox is satisfying, but it can substitute for the actual behavior without users noticing.',
          'The most effective digital habit support provides: behavioral reminders tied to existing anchors, social accountability mechanisms, and regular reflection prompts that connect daily actions to identity and outcomes.',
        ],
        bullets: [
          'Reminders should fire at the trigger time, not arbitrary recurring times',
          'Weekly review prompts increase 30-day retention by ~25% in behavior research',
          'Visible progress toward a meaningful goal raises consistency significantly',
        ],
      },
    ],
    keyTakeaways: [
      'Real habit formation takes 2–3 months for moderate complexity behaviors',
      '"Never miss twice" framing dramatically outperforms streak-reset approaches',
      'Implementation intentions are the highest-evidence technique in behavior science',
      'Habit trackers that connect actions to identity produce better long-term outcomes',
    ],
    relatedSlugs: ['habit-stacking', 'identity-habits', 'morning-routine'],
  },
  {
    slug: 'morning-routine',
    title: 'How to Build a Morning Routine That Actually Sticks',
    subtitle: 'Design a start sequence your future self will keep',
    description:
      'Most morning routines fail by week two. This guide shows you how to build a morning start sequence aligned with your energy, goals, and chronotype.',
    readTime: 12,
    category: 'Productivity',
    publishedTime: '2026-01-10',
    sections: [
      {
        heading: 'Start Smaller Than You Think',
        body: [
          'The biggest mistake in morning routine design is adding too many elements too quickly. When you fail to execute a 12-step sequence on a rough morning, you feel like you failed the entire day before it started.',
          'Start with a 3-element "minimum viable morning": wake, hydrate, one priority action. Add only after that sequence is automatic — typically 3–4 weeks.',
        ],
        bullets: [
          'Define your minimum viable morning (2–3 steps)',
          'Treat it as non-negotiable on hard days, not just easy days',
          'Only expand after the core sequence is fully automatic',
        ],
      },
      {
        heading: 'Match Your Routine to Your Chronotype',
        body: [
          'Morning larks (early risers) genuinely have their analytical peak in the morning. Night owls do not — their cognitive peak is 4–6 hours later. Forcing a productivity-heavy morning routine onto a night owl is fighting biology.',
          'The goal isn\'t a 5 AM routine. The goal is a reliable start sequence that launches your peak cognitive window — whatever time that is for you.',
        ],
        bullets: [
          'Lions / larks: protect 6–9 AM for deep analyticalwork',
          'Intermittent / neutral types: protect 9 AM–noon',
          'Wolves / night owls: protect afternoon-evening for complex work',
        ],
      },
      {
        heading: 'Environmental Design Is More Powerful Than Willpower',
        body: [
          'If your phone is the first thing you reach for, your morning belongs to other people\'s agendas. Physical environment precedes behavioral outcomes consistently in habit research.',
          'Overnight prep reduces morning decision load and friction: workout clothes laid out, journal on the desk, phone charging in another room. Thirty seconds of evening prep beats 20 minutes of morning willpower.',
        ],
        bullets: [
          'Charge your phone outside the bedroom',
          'Prepare tomorrow\'s first action the night before',
          'Create a visual anchor for your start sequence (a specific spot, a specific mug)',
        ],
      },
      {
        heading: 'The 20-Minute Non-Negotiable Block',
        body: [
          'Not every day allows full routines. Commutes exist. Sick kids exist. Travel exists. The solution: define your 20-minute non-negotiable — a compressed version of your core routine that works in any context.',
          'Knowing that even on chaos days you can execute a 20-minute version removes the all-or-nothing failure mode that sinks most morning routines.',
        ],
        bullets: [
          'Create a 5-minute version and a 20-minute version of your routine',
          'The 5-minute version = the absolute floor (hydrate + one intention)',
          'Use the 20-minute version as the daily standard',
        ],
      },
    ],
    keyTakeaways: [
      'Start with 2–3 elements, not 10',
      'Match your peak cognitive window to your chronotype, not a trend',
      'Environmental design removes more friction than willpower',
      'Always have a compressed "bad day" version of your routine',
    ],
    relatedSlugs: ['productivity-habits', 'habit-stacking', 'two-minute-rule'],
  },
  {
    slug: 'two-minute-rule',
    title: 'The Two-Minute Rule: The Most Practical Habit Hack',
    subtitle: 'Use a startup behavior to eliminate the hardest part of any habit',
    description:
      'James Clear\'s two-minute rule solves the hardest part of habit execution: starting. Here\'s the science, the application, and how to use it effectively.',
    readTime: 8,
    category: 'Habits',
    publishedTime: '2026-01-05',
    sections: [
      {
        heading: 'What the Two-Minute Rule Actually Is',
        body: [
          'James Clear popularized the rule in Atomic Habits: when starting a new habit, it should take less than two minutes to do. "Run a marathon" becomes "put on running shoes." "Study for exam" becomes "open textbook."',
          'The two-minute rule isn\'t about accomplishing the full task in two minutes — it\'s about removing the activation energy barrier to getting started. The habit associated with starting is what you\'re building first.',
        ],
        bullets: [
          'The goal is to make starting automatic, not completing automatic',
          'Reduced activation energy = fewer decisions needed to begin',
          'Once started, most people continue beyond two minutes naturally',
        ],
      },
      {
        heading: 'The Neuroscience: Why Starting Is the Hardest Part',
        body: [
          'Behavioral research on action initiation shows that the gap between intention and action is largely explained by "intention-behavior gap" — you intend to start, but the perceived effort of initiation triggers avoidance behavior.',
          'Once you begin, completion is far more likely. The two-minute rule hacks the initiation problem by making the "starting action" so small it can\'t realistically be avoided.',
        ],
        bullets: [
          'The first 2 minutes of any task are cognitively the most costly',
          'After momentum begins, continuation requires far less activation energy',
          'Habit loops (cue → routine → reward) reinforce starting behaviors specifically',
        ],
      },
      {
        heading: 'How to Apply It Practically',
        body: [
          'Identify the "gateway action" for each habit you want to build — the tiniest physical action that unambiguously begins the behavior. For exercise: putting on workout clothes. For meditation: sitting on your cushion. For writing: opening your document.',
          'Your habit tracker and reminders should trigger the gateway action, not the full habit. "Sit on cushion" is far less avoidable than "meditate for 20 minutes."',
        ],
        bullets: [
          'Write down your gateway action for each habit',
          'Make the gateway action the cue in your reminder, not the full behavior',
          'For sequences: complete the gateway action before deciding whether to continue',
        ],
      },
      {
        heading: 'Scaling Beyond Two Minutes',
        body: [
          'The two-minute rule is a starting strategy, not a permanent ceiling. Once the gateway action is automatic — reliably triggered by its cue — you can begin extending duration incrementally.',
          'Extend by 5 minutes every two weeks. The identity shift ("I\'m someone who meditates") should precede the duration — not the other way around.',
        ],
        bullets: [
          'Phase 1: Make the gateway action automatic (2–4 weeks)',
          'Phase 2: Add 5 minutes of actual behavior after the gateway',
          'Phase 3: Gradually extend to target duration over 4–8 weeks',
        ],
      },
    ],
    keyTakeaways: [
      'Focus on the gateway action (beginning), not the full behavior',
      'Activation energy barrier, not motivation, is usually the real problem',
      'Build the starting habit first, then scale duration',
      'Reminders should trigger the 2-minute starting action specifically',
    ],
    relatedSlugs: ['habit-stacking', 'identity-habits', 'morning-routine'],
  },
  {
    slug: 'habit-stacking',
    title: 'Habit Stacking: The Complete Guide',
    subtitle: 'Link new behaviors to existing routines for frictionless adoption',
    description:
      'Habit stacking uses your existing neural pathways to anchor new habits with minimal willpower. Backed by behavioral science, this is one of the most reliable techniques for building lasting routines.',
    readTime: 10,
    category: 'Habits',
    publishedTime: '2026-01-08',
    sections: [
      {
        heading: 'The Science Behind Habit Stacking',
        body: [
          'BJ Fogg\'s Tiny Habits research established that the most reliable way to introduce a new behavior is to anchor it directly after an existing, stable behavior. He calls this the "Anchor → New Behavior → Celebration" formula.',
          'The existing habit has years of neural reinforcement behind it. Linking a new behavior to that existing cue "borrows" the reliability of the existing habit\'s trigger — dramatically reducing the activation energy required for the new behavior.',
        ],
        bullets: [
          'Anchors should be stable existing habits (brushing teeth, making coffee)',
          'The sequence must be specific: "After X, I will do Y immediately"',
          'Instinctive celebration (a small internal "yes") reinforces the new behavior',
        ],
      },
      {
        heading: 'Building Your Habit Stack',
        body: [
          'Start by inventorying your current daily anchors — reliable behaviors that happen every day without deliberate decision. For most people these include: waking, brushing teeth, making coffee, eating meals, commuting, and going to bed.',
          'For each habit you want to add, choose one strong anchor that occurs at approximately the right time and in the right context. Specificity matters: "After I pour my morning coffee" is more reliable than "after breakfast."',
        ],
        bullets: [
          'List your top 5 most reliable daily anchors',
          'For each new habit, identify its ideal timing and context',
          'Match the new behavior to the anchor that fits timing and friction level',
          'Write the stack as: "After [ANCHOR], I will [NEW HABIT] for [DURATION]"',
        ],
      },
      {
        heading: 'Common Mistakes and How to Fix Them',
        body: [
          'The most common mistake is using a weak or inconsistent anchor. "After lunch" fails when you eat at different times or places. "After I close my laptop at the end of the workday" is far more reliable because it\'s contextually anchored, not time-anchored.',
          'Another mistake: stacking too many new behaviors onto one anchor. One new behavior per anchor is the reliable maximum while habits are forming.',
        ],
        bullets: [
          'Use context anchors (events) over time anchors when possible',
          'Maximum one new behavior per anchor during formation phase',
          'If the anchor is weak, find a stronger one rather than pushing through',
        ],
      },
      {
        heading: 'Habit Stacks for Common Goals',
        body: [
          'Most goal domains have natural anchor opportunities. The skill is mapping them correctly. Fitness goals leverage morning anchors. Mindfulness goals work well with transition anchors (commute start, meal end). Learning habits attach naturally to existing "consumption" windows like waking or commuting.',
        ],
        bullets: [
          'After morning coffee: 5-minute journaling or gratitude',
          'After closing laptop: 10-minute walk (shutdown-to-recovery transition)',
          'After sitting in the car: 5-minute breathing exercise before driving',
          'After dinner: 15-minute reading before screens',
        ],
      },
    ],
    keyTakeaways: [
      'Anchor new habits to existing highly reliable behaviors',
      'Specificity is everything: "After X immediately" beats "after X generally"',
      'Maximum one new habit per anchor during the formation period',
      'Context anchors are more reliable than time-based triggers',
    ],
    relatedSlugs: ['two-minute-rule', 'identity-habits', 'morning-routine'],
  },
  {
    slug: 'breaking-bad-habits',
    title: 'How to Break Bad Habits (That Actually Works)',
    subtitle: 'Use behavior design, not willpower, to eliminate unwanted patterns',
    description:
      'Breaking bad habits with willpower alone has a poor track record. This guide uses behavior design principles — environment modification, friction increase, and substitution — to build a realistic elimination strategy.',
    readTime: 11,
    category: 'Habits',
    publishedTime: '2026-01-12',
    sections: [
      {
        heading: 'Why Willpower Is the Wrong Tool',
        body: [
          'Roy Baumeister\'s ego depletion research (though partially revised since) and more robust decision fatigue literature agree: relying on conscious suppression of impulses is a losing strategy over time. Willpower is a limited resource. Friction and environment are not.',
          'Charles Duhigg\'s habit loop model (in The Power of Habit) shows bad habits follow the same cue-routine-reward structure as good ones. The key: you cannot simply "stop" a habit — you must substitute the routine while keeping the cue and the underlying reward.',
        ],
        bullets: [
          'Identify the cue, the routine, and the craving the routine satisfies',
          'Design a substitute routine that delivers the same reward more efficiently',
          'Increase friction on the unwanted routine, not just willpower',
        ],
      },
      {
        heading: 'The Friction Strategy',
        body: [
          'BJ Fogg\'s behavior model frames behavior as: Behavior = Motivation × Ability × Prompt. To reduce a behavior, reduce its "ability" (increase friction) and remove its prompts. This works at scale where motivation management does not.',
          'Phone scrolling habit: remove social media apps from home screen, move to a folder two taps away, log out after every session. These 3 friction increases, per behavior research, produce significant reduction without relying on willpower at all.',
        ],
        bullets: [
          'For phone habits: move apps off home screen, delete notifications, log out',
          'For food habits: remove items from visible/accessible locations first',
          'For avoidance habits: increase accessibility of the healthy replacement',
        ],
      },
      {
        heading: 'The Substitution Model',
        body: [
          'Cold turkey elimination of a deeply entrenched behavior has a high relapse rate because the underlying craving (stress relief, stimulation, social connection) remains unaddressed. The substitution model: keep the cue, keep the reward, change the routine.',
          'If cigarettes served as a "stress break with social interaction," an effective substitute must also provide a legitimate pause and social element — not just a nicotine patch.',
        ],
        bullets: [
          'Identify what specific reward the bad habit is delivering',
          'Design a substitute that delivers the same reward more efficiently',
          'Pre-plan the substitute behavior before encountering the cue',
        ],
      },
      {
        heading: 'The Never Miss Twice Protocol',
        body: [
          'Habit breaking involves setbacks. Pre-committing mentally to "never miss twice" dramatically reduces the compounding failure mode where one lapse becomes a full abandonment.',
          'Research by Wendy Wood (Habit: The Power of Routine) confirms that people who recover immediately from lapses have habit elimination success rates dramatically higher than those who treat a slip as a relapse.',
        ],
        bullets: [
          'Expect a lapse — plan your response to it now, not during the lapse',
          '"Never miss twice" is a single rule that prevents compounding failure',
          'Log lapses without judgment: data collection, not character judgement',
        ],
      },
    ],
    keyTakeaways: [
      'Friction engineering outperforms willpower for elimination',
      'You must substitute, not just stop — the craving must be addressed',
      'Never miss twice is a higher-leverage rule than "never miss"',
      'Remove environmental cues wherever possible; willpower is for edge cases',
    ],
    relatedSlugs: ['habit-stacking', 'two-minute-rule', 'identity-habits'],
  },
  {
    slug: 'identity-habits',
    title: 'Identity-Based Habits: Become the Person First',
    subtitle: 'The most durable habit change starts with self-concept, not outcomes',
    description:
      'James Clear\'s most powerful insight: outcome-based habits ask "what do I want?" while identity-based habits ask "who do I want to become?" Identity shifts produce durable behavior change that survives motivation loss.',
    readTime: 9,
    category: 'Habits',
    publishedTime: '2026-01-14',
    sections: [
      {
        heading: 'The Two Layers of Change',
        body: [
          'Most behavior change efforts operate at the outcomes layer (lose weight, earn money) or the process layer (diet, save). Atomic Habits proposes a third, deeper layer: identity. "I am someone who eats well" is more durable than "I am trying to lose weight."',
          'Identity-based habits operate differently psychologically: when a behavior is consistent with your self-concept, violating it creates dissonance. The behavior becomes about who you are, not what you want — which survives motivation fluctuations far better.',
        ],
        bullets: [
          'Outcome: what you want to achieve',
          'Process: what you will do to achieve it',
          'Identity: who you are becoming — the most durable anchor',
        ],
      },
      {
        heading: 'How to Start an Identity Shift',
        body: [
          'Identity is built through accumulated evidence. Every time you act in alignment with a desired identity ("I am someone who trains"), you cast a vote for that identity. Consistency creates the evidence base that makes the identity feel true.',
          'Start small deliberately — the goal isn\'t impressive actions but consistent evidence-casting. Ten two-minute runs builds identity faster than one great marathon training week followed by three absent weeks.',
        ],
        bullets: [
          'Define the identity you want: "I am someone who..."',
          'Find the smallest evidence-casting action you can do daily',
          'Prioritize consistency over intensity in early weeks',
          'Track the behavior as identity reinforcement, not task completion',
        ],
      },
      {
        heading: 'Language and Self-Talk in Habit Formation',
        body: [
          'How you narrate your behavior to yourself and others matters more than most people realize. "I\'m trying to quit smoking" frames smoking as your identity with an external battle against it. "I don\'t smoke" — even before it feels true — casts an identity vote.',
          'Research on self-affirmation and identity-behavior congruence shows that internal language shapes perceived identity, which then shapes behavior. The direction of causality runs both ways.',
        ],
        bullets: [
          '"I don\'t" is more powerful than "I can\'t" in behavior research',
          'Tell others your identity, not just your goal',
          'Celebrate evidence-casting actions as identity-confirming, not just task-complete',
        ],
      },
      {
        heading: 'Surviving Setbacks with Identity',
        body: [
          'When a setback occurs, outcome-based framing produces: "I failed my goal." Identity-based framing produces: "I had a bad day. People who exercise regularly have bad days. I have one tomorrow."',
          'The resilience of identity-based framing to setbacks is one of its strongest practical advantages. The identity doesn\'t change because of a single day; it changes through accumulated pattern.',
        ],
        bullets: [
          'Reframe setbacks as "outlier days", not identity disconfirmation',
          'Return immediately — the identity narrative absorbs misses better than outcomes',
          'Track consistency percentage, not perfection streaks',
        ],
      },
    ],
    keyTakeaways: [
      'Build habits from identity down, not outcomes up',
      'Consistency in small actions creates the evidence base for identity',
      'Language matters: "I don\'t" beats "I can\'t"; identity claims beat goal claims',
      'Identity framing makes setbacks survivable without full abandonment',
    ],
    relatedSlugs: ['habit-stacking', 'two-minute-rule', 'breaking-bad-habits'],
  },
  {
    slug: 'goal-decomposition',
    title: 'Goal Decomposition with AI: From Ambition to Action',
    subtitle: 'Break any goal into milestones, tasks, and first steps',
    description:
      'Modern AI tools can decompose complex goals into structured action plans. Here\'s how to use goal decomposition effectively — with or without AI assistance.',
    readTime: 10,
    category: 'Goals',
    publishedTime: '2026-01-22',
    sections: [
      {
        heading: 'What Goal Decomposition Really Is',
        body: [
          'Goal decomposition is the process of taking a high-level outcome and breaking it into progressively smaller executable units until each unit takes less than 2 hours and has a clear completion criterion.',
          'The decomposition hierarchy for a well-structured goal: North Star → Milestones (monthly/quarterly checkpoints) → Weekly Targets → Daily Actions. Each layer must be specific enough to generate the next layer without ambiguity.',
        ],
        bullets: [
          'North star: the overarching outcome (6–12 month horizon)',
          'Milestones: 3–6 checkpoints with measurable completion criteria',
          'Weekly targets: the output needed each week to hit the next milestone',
          'Daily actions: tasks taking under 2 hours, with clear "done" criteria',
        ],
      },
      {
        heading: 'The AI-Assisted Decomposition Flow',
        body: [
          'LLMs are unusually good at goal decomposition because they can apply domain knowledge (what typically has to happen to achieve Y in domain Z) combined with constraint awareness (timeline, available hours, dependency ordering).',
          'An effective AI decomposition prompt includes: the goal, the timeline, your current status, your available weekly hours, and any known constraints. The output should be a milestone-and-task structure, not a flat list.',
        ],
        bullets: [
          'Include timeline and weekly capacity in your AI prompt',
          'Ask for dependencies explicitly: "What must be completed before X?"',
          'Request a "first 7 days" action set to give you immediate traction',
          'Refine iteratively: "Reduce week 1 scope by 30% for a sustainable start"',
        ],
      },
      {
        heading: 'The Dependency Tree Problem',
        body: [
          'Most goal decomposition fails by producing a flat list of tasks without dependency relationships. In reality, many tasks can\'t start until others finish. Missing this produces parallel actions that aren\'t executable concurrently.',
          'Explicitly mapping dependencies prevents the experience of "I don\'t know what to do next" — you always have a clear critical path and can see which tasks are currently unblocked.',
        ],
        bullets: [
          'For each task, write: "This requires: [dependency] to be done first"',
          'Map the critical path: the sequence whose delay delays the entire milestone',
          'Identify which tasks can run in parallel vs. must be sequential',
        ],
      },
      {
        heading: 'Maintaining the Decomposition Over Time',
        body: [
          'Goal decomposition isn\'t a one-time planning exercise. It\'s a living structure that requires weekly recalibration as reality diverges from the initial plan.',
          'Treat your decomposed plan as a hypothesis. Weekly: what completed, what slipped, what changed in priority. Monthly: does the milestone architecture still reflect the current best path to the north star?',
        ],
        bullets: [
          'Review decomposed tasks weekly, not just at milestone boundaries',
          'Expect and plan for 20–30% re-planning overhead in complex goals',
          'When scope changes, update the dependency tree, not just the task list',
        ],
      },
    ],
    keyTakeaways: [
      'Decompose to the daily action level before starting any significant goal',
      'Dependency mapping prevents the "what do I do next?" failure mode',
      'AI is excellent at first-pass decomposition — you provide constraints and refinement',
      'Treat your plan as a living document with weekly recalibration',
    ],
    relatedSlugs: ['goal-setting-system', 'productivity-habits', 'identity-habits'],
  },
];

function getGuide(slug: string): GuideData | null {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}

// ── generateStaticParams ──────────────────────────────────────────────────────

export async function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return {
    title: `${guide.title} (2026) | RESURGO`,
    description: guide.description,
    keywords: [guide.category.toLowerCase(), 'habit guide', 'productivity guide', 'RESURGO'],
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      publishedTime: guide.publishedTime,
      authors: ['RESURGO Team'],
    },
    alternates: {
      canonical: `/guides/${slug}`,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    author: { '@type': 'Organization', name: 'RESURGO' },
    publisher: {
      '@type': 'Organization',
      name: 'RESURGO',
      logo: { '@type': 'ImageObject', url: 'https://resurgo.life/icons/icon.svg' },
    },
    datePublished: guide.publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://resurgo.life/guides/${slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Link href="/guides" className="hover:text-[var(--accent)] transition-colors">
            Guides
          </Link>
          <span>/</span>
          <span className="text-[var(--text-secondary)] truncate">{guide.title}</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs mb-5">
            {guide.category} · {guide.readTime} min read
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
            {guide.title}
          </h1>
          <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
            {guide.subtitle}
          </p>
        </div>
      </header>

      {/* Table of Contents */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass-card p-6 mb-10">
          <h2 className="font-semibold text-[var(--text-primary)] mb-4">In this guide</h2>
          <ol className="space-y-2">
            {guide.sections.map((section, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-[var(--accent)] font-mono">{String(i + 1).padStart(2, '0')}.</span>
                <span className="text-[var(--text-secondary)]">{section.heading}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Article Sections */}
        <article className="space-y-12">
          {guide.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-5">
                {section.heading}
              </h2>
              <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                {section.body.map((paragraph, j) => (
                  <p key={j}>{paragraph}</p>
                ))}
              </div>
              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-5 space-y-3">
                  {section.bullets.map((bullet, j) => (
                    <li key={j} className="flex gap-3 text-sm text-[var(--text-secondary)]">
                      <span className="text-[var(--accent)] mt-0.5 shrink-0">▸</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        {/* Key Takeaways */}
        <div className="mt-14 glass-card p-7 border-l-4 border-[var(--accent)]">
          <h2 className="font-bold text-[var(--text-primary)] mb-5 text-lg">Key Takeaways</h2>
          <ul className="space-y-3">
            {guide.keyTakeaways.map((point, i) => (
              <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)]">
                <span className="text-[var(--accent)] font-bold shrink-0">{i + 1}.</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-10 glass-card p-7 text-center">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
            Put this into practice
          </h3>
          <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-lg mx-auto">
            RESURGO connects these concepts to daily execution — habits, goals, tasks, AI coaching, and weekly reviews in one system.
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-6 py-3 bg-[var(--accent)] text-black font-semibold rounded hover:opacity-90 transition-opacity"
          >
            Start free — no credit card
          </Link>
        </div>

        {/* Related Guides */}
        {guide.relatedSlugs.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-5">Related Guides</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {guide.relatedSlugs.map((relatedSlug) => {
                const related = getGuide(relatedSlug);
                if (!related) return null;
                return (
                  <Link
                    key={relatedSlug}
                    href={`/guides/${relatedSlug}`}
                    className="glass-card p-4 group hover:border-[var(--accent)]/50 transition-all"
                  >
                    <span className="text-xs text-[var(--accent)]">{related.category}</span>
                    <h3 className="mt-1 font-semibold text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                      {related.title}
                    </h3>
                    <span className="text-xs text-[var(--text-muted)]">{related.readTime} min read</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 pb-10">
          <Link href="/guides" className="text-sm text-[var(--accent)] hover:underline">
            ← Back to all guides
          </Link>
        </div>
      </div>
    </div>
  );
}
