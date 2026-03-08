import { GoalTemplate } from './types';

type Difficulty = GoalTemplate['difficulty'];
type TemplateSeed = {
  slug: string;
  title: string;
  category: string;
  durationWeeks: number;
  difficulty: Difficulty;
  focus: string;
  outcome: string;
};

type CategoryProfile = {
  intro: string;
  milestones: (seed: TemplateSeed) => GoalTemplate['milestones'];
  habits: (seed: TemplateSeed) => GoalTemplate['suggestedHabits'];
  tasks: (seed: TemplateSeed) => GoalTemplate['firstWeekTasks'];
  faq: GoalTemplate['faq'];
};

const BASE_FAQ = [
  {
    question: 'Can I start this template for free?',
    answer: 'Yes. You can start on the free plan and upgrade only if you need advanced coaching or higher-volume AI usage.',
  },
  {
    question: 'Do I need to follow every task exactly?',
    answer: 'No. Treat this template as a proven starting structure, then adapt it to your real schedule and energy.',
  },
  {
    question: 'Will Resurgo adapt the plan after week one?',
    answer: 'Yes. Your completed tasks, habits, and weekly reviews feed back into later suggestions and pacing.',
  },
];

const CATEGORY_PROFILES: Record<string, CategoryProfile> = {
  fitness: {
    intro: 'This plan emphasizes progressive loading, consistency, and recovery so you can build momentum without burning out.',
    milestones: (seed) => [
      { weekNumber: 1, title: 'Build the baseline', description: `Establish your starting level, training rhythm, and recovery constraints around ${seed.focus}.` },
      { weekNumber: Math.max(2, Math.floor(seed.durationWeeks / 2)), title: 'Increase controlled intensity', description: 'Add volume or complexity while protecting recovery and keeping technique clean.' },
      { weekNumber: seed.durationWeeks, title: 'Peak and sustain', description: `Stress-test the system, review progress, and lock in a repeatable version of ${seed.outcome}.` },
    ],
    habits: (seed) => [
      { name: `10-minute ${seed.focus} prep`, frequency: 'daily', why: 'Reduces friction before training and makes the next step obvious.' },
      { name: 'Recovery check-in', frequency: 'daily', why: 'Helps you notice fatigue before it derails the whole week.' },
      { name: 'Weekly performance review', frequency: 'weekly', why: 'Reveals trend lines in energy, effort, and results.' },
    ],
    tasks: (seed) => [
      { day: 1, title: `Define your baseline metrics for ${seed.title}`, priority: 'high' },
      { day: 2, title: 'Schedule every training session for this week', priority: 'high' },
      { day: 3, title: 'Prepare one lighter fallback workout for low-energy days', priority: 'medium' },
      { day: 4, title: 'Set up nutrition and hydration anchors', priority: 'medium' },
      { day: 5, title: `Complete your first deliberate ${seed.focus} session`, priority: 'high' },
      { day: 6, title: 'Review recovery signals and adjust next session', priority: 'medium' },
      { day: 7, title: 'Weekly review: progress, soreness, confidence, and next-week load', priority: 'high' },
    ],
    faq: BASE_FAQ,
  },
  career: {
    intro: 'This plan focuses on leverage, visibility, and consistent output so your work compounds instead of scattering.',
    milestones: (seed) => [
      { weekNumber: 1, title: 'Clarify the target', description: `Define what ${seed.outcome} looks like and which inputs actually move it.` },
      { weekNumber: Math.max(2, Math.floor(seed.durationWeeks / 2)), title: 'Ship visible proof', description: 'Create artifacts, wins, or relationships that make progress obvious to other people.' },
      { weekNumber: seed.durationWeeks, title: 'Consolidate the advantage', description: 'Turn short-term wins into a repeatable professional system you can sustain.' },
    ],
    habits: (seed) => [
      { name: 'Daily priority block', frequency: 'daily', why: 'Protects one non-negotiable block for meaningful work.' },
      { name: 'End-of-day work log', frequency: 'daily', why: 'Creates a paper trail of output and decisions.' },
      { name: 'Weekly leverage review', frequency: 'weekly', why: 'Keeps you focused on high-return actions instead of busywork.' },
    ],
    tasks: (seed) => [
      { day: 1, title: `Define success metrics for ${seed.title}`, priority: 'high' },
      { day: 2, title: 'Audit your current workflow for wasted effort', priority: 'medium' },
      { day: 3, title: 'Schedule two deep-work blocks for the highest-leverage deliverable', priority: 'high' },
      { day: 4, title: 'Draft a visible win or portfolio artifact', priority: 'high' },
      { day: 5, title: 'Ask for one piece of high-quality feedback', priority: 'medium' },
      { day: 6, title: 'Document blockers and convert them into next actions', priority: 'medium' },
      { day: 7, title: 'Weekly review: output, visibility, relationships, and next bets', priority: 'high' },
    ],
    faq: BASE_FAQ,
  },
  finance: {
    intro: 'This plan reduces financial anxiety by creating predictable systems, simpler decisions, and clear checkpoints.',
    milestones: (seed) => [
      { weekNumber: 1, title: 'Stabilize cash flow', description: 'Map where money is going, stop obvious leaks, and build a realistic baseline.' },
      { weekNumber: Math.max(2, Math.floor(seed.durationWeeks / 2)), title: 'Increase control and buffer', description: 'Strengthen saving behaviors, automate transfers, and shrink decision fatigue.' },
      { weekNumber: seed.durationWeeks, title: 'Lock in long-term discipline', description: `Turn ${seed.outcome} into a sustainable financial operating system.` },
    ],
    habits: (seed) => [
      { name: 'Daily spending awareness check', frequency: 'daily', why: 'Keeps small leaks from becoming invisible.' },
      { name: 'Twice-weekly account review', frequency: 'weekly', why: 'Creates fast feedback without obsessing over numbers.' },
      { name: `Weekly ${seed.focus} scorecard`, frequency: 'weekly', why: 'Keeps savings and tradeoffs visible.' },
    ],
    tasks: (seed) => [
      { day: 1, title: 'List all current recurring subscriptions and bills', priority: 'high' },
      { day: 2, title: 'Set a realistic weekly target you can repeat', priority: 'high' },
      { day: 3, title: 'Automate one saving or debt payment action', priority: 'medium' },
      { day: 4, title: 'Create one friction rule for impulse spending', priority: 'medium' },
      { day: 5, title: 'Review the past 7 days of spending without judgment', priority: 'medium' },
      { day: 6, title: 'Decide one category to tighten next week', priority: 'medium' },
      { day: 7, title: 'Weekly review: cash flow, stress level, and next week buffer goal', priority: 'high' },
    ],
    faq: BASE_FAQ,
  },
  learning: {
    intro: 'This plan uses deliberate practice and low-friction repetition so new knowledge turns into retained skill.',
    milestones: (seed) => [
      { weekNumber: 1, title: 'Set the learning system', description: `Define curriculum, cadence, and practice loop around ${seed.focus}.` },
      { weekNumber: Math.max(2, Math.floor(seed.durationWeeks / 2)), title: 'Move from consumption to output', description: 'Shift from passive study to active recall, projects, and feedback.' },
      { weekNumber: seed.durationWeeks, title: 'Demonstrate competence', description: `Package the learning into a visible result tied to ${seed.outcome}.` },
    ],
    habits: (seed) => [
      { name: `Daily ${seed.focus} session`, frequency: 'daily', why: 'Keeps retrieval and repetition alive even on busy days.' },
      { name: 'Capture one lesson learned', frequency: 'daily', why: 'Improves retention and reveals knowledge gaps.' },
      { name: 'Weekly demo or summary', frequency: 'weekly', why: 'Converts private studying into visible capability.' },
    ],
    tasks: (seed) => [
      { day: 1, title: `Define the first milestone for ${seed.title}`, priority: 'high' },
      { day: 2, title: 'Collect the minimum resources you will actually use', priority: 'medium' },
      { day: 3, title: 'Schedule four short study blocks for this week', priority: 'high' },
      { day: 4, title: 'Create a tiny practice project or recall test', priority: 'high' },
      { day: 5, title: 'Review friction points and simplify the environment', priority: 'medium' },
      { day: 6, title: 'Teach back one concept in your own words', priority: 'medium' },
      { day: 7, title: 'Weekly review: what stuck, what felt hard, what changes next', priority: 'high' },
    ],
    faq: BASE_FAQ,
  },
  wellness: {
    intro: 'This plan prioritizes consistency, nervous-system safety, and gradual improvement over all-or-nothing effort.',
    milestones: (seed) => [
      { weekNumber: 1, title: 'Reduce immediate friction', description: 'Make the healthy action easier than the unhealthy default.' },
      { weekNumber: Math.max(2, Math.floor(seed.durationWeeks / 2)), title: 'Stabilize routines', description: 'Protect the routine on messy days with fallback versions and clear cues.' },
      { weekNumber: seed.durationWeeks, title: 'Sustain the new normal', description: `Turn ${seed.outcome} into a reliable baseline rather than a short sprint.` },
    ],
    habits: (seed) => [
      { name: `Daily ${seed.focus} reset`, frequency: 'daily', why: 'Builds a repeatable anchor around the behavior you want most.' },
      { name: 'Evening check-out', frequency: 'daily', why: 'Helps you review stress, energy, and what tomorrow needs.' },
      { name: 'Weekly restore block', frequency: 'weekly', why: 'Protects recovery before overload shows up.' },
    ],
    tasks: (seed) => [
      { day: 1, title: `Write your version of a “good enough” ${seed.focus} day`, priority: 'high' },
      { day: 2, title: 'Remove one friction point from your environment', priority: 'medium' },
      { day: 3, title: 'Schedule two protected recovery windows', priority: 'medium' },
      { day: 4, title: 'Create a low-energy fallback routine', priority: 'high' },
      { day: 5, title: 'Track one leading indicator that matters this week', priority: 'medium' },
      { day: 6, title: 'Notice and document one trigger pattern', priority: 'medium' },
      { day: 7, title: 'Weekly review: energy, stress, sleep, and what to keep simple', priority: 'high' },
    ],
    faq: BASE_FAQ,
  },
  creativity: {
    intro: 'This plan helps creative work survive real life by protecting output volume, idea capture, and finishing rituals.',
    milestones: (seed) => [
      { weekNumber: 1, title: 'Open the channel', description: `Build a repeatable starting ritual around ${seed.focus}.` },
      { weekNumber: Math.max(2, Math.floor(seed.durationWeeks / 2)), title: 'Increase finished output', description: 'Move from collecting ideas to shipping drafts and iterations.' },
      { weekNumber: seed.durationWeeks, title: 'Publish or present the work', description: `Turn creative momentum into ${seed.outcome}.` },
    ],
    habits: (seed) => [
      { name: 'Capture one raw idea', frequency: 'daily', why: 'Prevents inspiration from evaporating before you can use it.' },
      { name: `Daily ${seed.focus} block`, frequency: 'daily', why: 'Builds identity and fluency through repetition.' },
      { name: 'Weekly finish-and-share session', frequency: 'weekly', why: 'Creative confidence rises when work gets completed, not just imagined.' },
    ],
    tasks: (seed) => [
      { day: 1, title: `Define what “finished” means for ${seed.title}`, priority: 'high' },
      { day: 2, title: 'Prepare a distraction-light creation environment', priority: 'medium' },
      { day: 3, title: 'Create an intentionally rough first pass', priority: 'high' },
      { day: 4, title: 'Collect one source of inspiration or reference', priority: 'medium' },
      { day: 5, title: 'Edit or refine one piece instead of starting over', priority: 'high' },
      { day: 6, title: 'Share a draft with one trusted person', priority: 'medium' },
      { day: 7, title: 'Weekly review: output volume, friction, and next creative edge', priority: 'high' },
    ],
    faq: BASE_FAQ,
  },
  productivity: {
    intro: 'This plan is built to reduce overwhelm, improve focus, and make daily execution feel lighter instead of louder.',
    milestones: (seed) => [
      { weekNumber: 1, title: 'Stop the leak', description: 'Identify the biggest sources of friction, context switching, and unfinished loops.' },
      { weekNumber: Math.max(2, Math.floor(seed.durationWeeks / 2)), title: 'Install reliable rhythms', description: 'Create repeatable focus blocks, review loops, and lower-friction daily planning.' },
      { weekNumber: seed.durationWeeks, title: 'Operate from clarity', description: `Turn ${seed.outcome} into the default state of your week.` },
    ],
    habits: (seed) => [
      { name: 'Daily capture habit', frequency: 'daily', why: 'Keeps mental clutter out of your head and inside a trusted system.' },
      { name: 'One protected focus block', frequency: 'daily', why: 'Creates real progress even when the rest of the day is noisy.' },
      { name: 'Weekly reset', frequency: 'weekly', why: 'Resets priorities before drift compounds.' },
    ],
    tasks: (seed) => [
      { day: 1, title: `Define the outcome for ${seed.title}`, priority: 'high' },
      { day: 2, title: 'Do a full brain dump and sort it into projects or queues', priority: 'high' },
      { day: 3, title: 'Block one focus window on your calendar', priority: 'high' },
      { day: 4, title: 'Write a lighter fallback routine for messy days', priority: 'medium' },
      { day: 5, title: 'Reduce one source of notifications or context switching', priority: 'medium' },
      { day: 6, title: 'Complete one meaningful task start-to-finish', priority: 'high' },
      { day: 7, title: 'Weekly review: what created momentum and what created drag', priority: 'high' },
    ],
    faq: BASE_FAQ,
  },
  health: {
    intro: 'This plan emphasizes sustainable recovery, trigger awareness, and compassionate consistency instead of brute force.',
    milestones: (seed) => [
      { weekNumber: 1, title: 'Stabilize the environment', description: 'Reduce triggers, add support, and define your minimum viable version of success.' },
      { weekNumber: Math.max(2, Math.floor(seed.durationWeeks / 2)), title: 'Build resilience through repetition', description: 'Practice the replacement behaviors until they feel automatic enough to trust.' },
      { weekNumber: seed.durationWeeks, title: 'Protect the comeback', description: `Create a relapse-prevention system that sustains ${seed.outcome}.` },
    ],
    habits: (seed) => [
      { name: 'Morning reset check-in', frequency: 'daily', why: 'Keeps awareness high before triggers pile up.' },
      { name: `Daily ${seed.focus} replacement action`, frequency: 'daily', why: 'Makes the new behavior easier to access under stress.' },
      { name: 'Weekly trigger review', frequency: 'weekly', why: 'Turns setbacks into usable data instead of shame.' },
    ],
    tasks: (seed) => [
      { day: 1, title: 'Write the three strongest reasons this change matters now', priority: 'high' },
      { day: 2, title: 'Remove one high-risk trigger from your environment', priority: 'high' },
      { day: 3, title: 'Prepare a support or accountability touchpoint', priority: 'medium' },
      { day: 4, title: 'Choose your fallback action for high-stress moments', priority: 'high' },
      { day: 5, title: 'Track one craving or trigger pattern without judgment', priority: 'medium' },
      { day: 6, title: 'Rehearse your response plan for a hard moment', priority: 'medium' },
      { day: 7, title: 'Weekly review: wins, slips, patterns, and protection for next week', priority: 'high' },
    ],
    faq: BASE_FAQ,
  },
};

const TEMPLATE_SEEDS: TemplateSeed[] = [
  { slug: 'run-a-5k-in-12-weeks', title: 'Run a 5K in 12 Weeks', category: 'fitness', durationWeeks: 12, difficulty: 'beginner', focus: 'progressive training', outcome: 'crossing the finish line confidently' },
  { slug: 'lose-20-pounds-sustainably', title: 'Lose 20 Pounds Sustainably', category: 'fitness', durationWeeks: 20, difficulty: 'intermediate', focus: 'nutrition consistency', outcome: 'steady fat-loss habits that hold' },
  { slug: 'build-a-consistent-gym-habit', title: 'Build a Consistent Gym Habit', category: 'fitness', durationWeeks: 10, difficulty: 'beginner', focus: 'attendance streaks', outcome: 'training without negotiation' },
  { slug: 'complete-your-first-half-marathon', title: 'Complete Your First Half Marathon', category: 'fitness', durationWeeks: 18, difficulty: 'advanced', focus: 'endurance training', outcome: 'race-day readiness with recovery built in' },
  { slug: 'build-a-morning-routine', title: 'Build a Morning Routine', category: 'wellness', durationWeeks: 8, difficulty: 'beginner', focus: 'identity-based habits', outcome: 'starting the day without chaos' },
  { slug: 'recover-from-burnout', title: 'Recover from Burnout', category: 'wellness', durationWeeks: 12, difficulty: 'advanced', focus: 'energy restoration', outcome: 'a calmer, more sustainable baseline' },
  { slug: 'improve-sleep-quality', title: 'Improve Sleep Quality', category: 'wellness', durationWeeks: 6, difficulty: 'beginner', focus: 'night routine', outcome: 'better sleep consistency and recovery' },
  { slug: 'reduce-screen-time-by-50-percent', title: 'Reduce Screen Time by 50%', category: 'wellness', durationWeeks: 8, difficulty: 'intermediate', focus: 'attention protection', outcome: 'more calm and less reactive scrolling' },
  { slug: 'save-5000-emergency-fund', title: 'Save a $5,000 Emergency Fund', category: 'finance', durationWeeks: 24, difficulty: 'intermediate', focus: 'cash-flow control', outcome: 'a real financial buffer' },
  { slug: 'build-a-budget-that-sticks', title: 'Build a Budget That Sticks', category: 'finance', durationWeeks: 8, difficulty: 'beginner', focus: 'category discipline', outcome: 'predictable monthly spending' },
  { slug: 'pay-off-10000-in-debt', title: 'Pay Off $10,000 in Debt', category: 'finance', durationWeeks: 32, difficulty: 'advanced', focus: 'debt reduction systems', outcome: 'fewer interest leaks and more breathing room' },
  { slug: 'start-investing-consistently', title: 'Start Investing Consistently', category: 'finance', durationWeeks: 12, difficulty: 'intermediate', focus: 'automated investing habits', outcome: 'steady contributions you trust' },
  { slug: 'get-promoted-this-year', title: 'Get Promoted This Year', category: 'career', durationWeeks: 40, difficulty: 'advanced', focus: 'visibility and output', outcome: 'stronger scope, leverage, and recognition' },
  { slug: 'launch-a-side-project', title: 'Launch a Side Project', category: 'career', durationWeeks: 12, difficulty: 'advanced', focus: 'shipping cadence', outcome: 'something real in public instead of another idea' },
  { slug: 'grow-your-linkedin-network', title: 'Grow Your LinkedIn Network', category: 'career', durationWeeks: 12, difficulty: 'intermediate', focus: 'outreach consistency', outcome: 'higher-quality opportunities and conversations' },
  { slug: 'land-a-remote-job', title: 'Land a Remote Job', category: 'career', durationWeeks: 16, difficulty: 'intermediate', focus: 'application pipeline quality', outcome: 'interviews and a better-fit role' },
  { slug: 'learn-spanish-in-6-months', title: 'Learn Spanish in 6 Months', category: 'learning', durationWeeks: 24, difficulty: 'intermediate', focus: 'language immersion', outcome: 'functional everyday fluency' },
  { slug: 'learn-to-code-in-100-days', title: 'Learn to Code in 100 Days', category: 'learning', durationWeeks: 15, difficulty: 'intermediate', focus: 'daily practice loops', outcome: 'shipped practice projects and real skill' },
  { slug: 'read-24-books-this-year', title: 'Read 24 Books This Year', category: 'learning', durationWeeks: 52, difficulty: 'intermediate', focus: 'reading consistency', outcome: 'a meaningful reading rhythm you sustain' },
  { slug: 'pass-a-professional-certification', title: 'Pass a Professional Certification', category: 'learning', durationWeeks: 14, difficulty: 'advanced', focus: 'deliberate exam prep', outcome: 'confidence under test conditions' },
  { slug: 'write-your-first-book', title: 'Write Your First Book', category: 'creativity', durationWeeks: 24, difficulty: 'advanced', focus: 'draft momentum', outcome: 'a complete manuscript draft' },
  { slug: 'launch-a-newsletter', title: 'Launch a Newsletter', category: 'creativity', durationWeeks: 8, difficulty: 'intermediate', focus: 'publishing consistency', outcome: 'an audience-building writing loop' },
  { slug: 'start-a-podcast', title: 'Start a Podcast', category: 'creativity', durationWeeks: 10, difficulty: 'intermediate', focus: 'episode production rhythm', outcome: 'a repeatable publishing cadence' },
  { slug: 'build-a-deep-work-routine', title: 'Build a Deep Work Routine', category: 'productivity', durationWeeks: 10, difficulty: 'intermediate', focus: 'focus blocks', outcome: 'more meaningful work with less noise' },
  { slug: 'get-inbox-under-control', title: 'Get Your Inbox Under Control', category: 'productivity', durationWeeks: 4, difficulty: 'beginner', focus: 'communication triage', outcome: 'less reactive task switching' },
  { slug: 'plan-your-week-like-a-chief-of-staff', title: 'Plan Your Week Like a Chief of Staff', category: 'productivity', durationWeeks: 6, difficulty: 'intermediate', focus: 'weekly planning rituals', outcome: 'a calmer week with clearer priorities' },
  { slug: 'quit-smoking-90-day-plan', title: 'Quit Smoking (90-Day Plan)', category: 'health', durationWeeks: 13, difficulty: 'advanced', focus: 'trigger replacement', outcome: 'fewer cravings and stronger recovery routines' },
  { slug: 'recover-after-a-stressful-season', title: 'Recover After a Stressful Season', category: 'health', durationWeeks: 8, difficulty: 'intermediate', focus: 'recovery practices', outcome: 'more stability and less allostatic overload' },
  { slug: 'lower-your-blood-pressure-habits', title: 'Lower Your Blood Pressure Habits', category: 'health', durationWeeks: 12, difficulty: 'intermediate', focus: 'sleep, stress, and movement basics', outcome: 'better daily inputs and steadier health routines' },
];

function makeTemplate(seed: TemplateSeed): GoalTemplate {
  const profile = CATEGORY_PROFILES[seed.category] ?? CATEGORY_PROFILES.productivity;

  return {
    slug: seed.slug,
    title: seed.title,
    category: seed.category,
    durationWeeks: seed.durationWeeks,
    difficulty: seed.difficulty,
    metaDescription: `${seed.title} template: get a ${seed.durationWeeks}-week plan with milestones, habits, first-week tasks, and AI coaching support inside Resurgo.`,
    description: `${seed.title} becomes easier when the next action is obvious. This template gives you structured milestones, behavior anchors, and a practical first week tailored around ${seed.focus}. ${profile.intro} Use it as your launch plan, then let Resurgo adapt the pacing using your real-world progress, missed days, and weekly reviews so ${seed.outcome} feels achievable instead of abstract.`,
    milestones: profile.milestones(seed),
    suggestedHabits: profile.habits(seed),
    firstWeekTasks: profile.tasks(seed),
    faq: profile.faq,
    relatedTemplates: [],
  };
}

export const GOAL_TEMPLATES: GoalTemplate[] = TEMPLATE_SEEDS.map(makeTemplate).map((template, index, all) => ({
  ...template,
  relatedTemplates: all
    .filter((candidate) => candidate.slug !== template.slug && candidate.category === template.category)
    .slice(0, 2)
    .concat(
      all
        .filter((candidate) => candidate.slug !== template.slug && candidate.category !== template.category)
        .slice(index % 5, (index % 5) + 1)
    )
    .slice(0, 3)
    .map((candidate) => candidate.slug),
}));

export async function getAllTemplates(): Promise<GoalTemplate[]> {
  return GOAL_TEMPLATES;
}

export async function getTemplateBySlug(slug: string): Promise<GoalTemplate | null> {
  return GOAL_TEMPLATES.find((template) => template.slug === slug) ?? null;
}
