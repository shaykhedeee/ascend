// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Vision Board Config Generator (Section 24)
// Uses AI to generate a deeply personalised vision board config based on the
// user's goals, psychology profile, and archetype.
// ═══════════════════════════════════════════════════════════════════════════════

import { callAIJson } from '../provider-router';
import type { PsychologicalProfile } from '../psychology/profile-schema';
import type { UserArchetype } from '../onboarding/archetypes';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface VisionBoardTheme {
  colorPalette: string[];   // 5 hex colors
  mood: string;             // e.g. "warm-ambitious" | "calm-focused"
  fontStyle: 'serif-elegant' | 'sans-modern' | 'mono-tech';
  layoutStyle: 'grid' | 'collage' | 'minimal' | 'mosaic';
}

export interface VisionBoardPanel {
  id: string;
  goalTitle: string;
  imagePrompt: string;      // Stable Diffusion prompt
  affirmation: string;
  category: string;
  progress: number;         // 0–100, filled in from goal tracking
  position: number;
}

export interface VisionBoardConfig {
  userId: string;
  title: string;
  theme: VisionBoardTheme;
  panels: VisionBoardPanel[];
  centerAffirmation: string;
  generatedAt: string;
  version: number;
  archetype?: string;
}

// Minimal goal shape needed for generation
export interface GoalSummary {
  title: string;
  category: string;
  progress: number;
  description?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Build the generation prompt
// ─────────────────────────────────────────────────────────────────────────────

function buildGenerationPrompt(params: {
  userName: string;
  goals: GoalSummary[];
  archetype: UserArchetype | null;
  psychProfile: PsychologicalProfile | null;
  todayDate: string;
}): string {
  const { userName, goals, archetype, psychProfile, todayDate } = params;

  const archetypeHint = archetype
    ? `User archetype: ${archetype.replace('the_', '').toUpperCase()}`
    : 'Archetype: unknown (use balanced defaults)';

  const psychHint = psychProfile && psychProfile.bigFive.confidence >= 20
    ? `Big Five (1-10): O=${psychProfile.bigFive.openness} C=${psychProfile.bigFive.conscientiousness} E=${psychProfile.bigFive.extraversion} A=${psychProfile.bigFive.agreeableness} N=${psychProfile.bigFive.neuroticism}
Motivational stage: ${psychProfile.motivational.changeStage}
Feedback style: ${psychProfile.behavioral.preferredFeedbackStyle}
Procrastination tendency: ${psychProfile.behavioral.procrastinationTendency}/10`
    : 'Psychology profile: not yet available (use balanced defaults)';

  return `You are RESURGO's Vision Board Designer. Create a deeply personal vision board configuration.

USER: ${userName}
DATE: ${todayDate}
${archetypeHint}
${psychHint}

GOALS (${goals.length} total):
${goals.map((g, i) => `${i + 1}. [${g.category}] ${g.title} — ${g.progress}% done${g.description ? ` (${g.description.slice(0, 80)})` : ''}`).join('\n')}

RULES FOR THEMES:
- High neuroticism (>7) → calming colors (blues, greens, soft neutrals)
- High extraversion (>7) → vibrant colors (warm oranges, energetic yellows)  
- High conscientiousness (>7) → grid or minimal layout
- High openness (>7) → collage or mosaic layout
- the_overwhelmed / the_rebuilder → minimal layout, max 3 panels, soft palette
- the_ambitious / the_optimizer → full grid, bold palette

RULES FOR IMAGE PROMPTS:
- Vivid, specific Stable Diffusion prompts. Focus on OUTCOMES not processes.
- Always append: "photorealistic, warm lighting, aspirational, high quality, 4K"
- Never include text in images. Culturally neutral and inclusive.
- Each prompt uniquely tied to the specific goal.

RULES FOR AFFIRMATIONS:
- First person, present tense ("I am" not "I will be")
- Specific to the goal, not generic quotes
- Match archetype tone: rebuilder=nurturing, optimizer=analytical, ambitious=bold, scattered=short+clear

OUTPUT (JSON only, no markdown, no explanation):
{
  "title": "string — personal board title",
  "theme": {
    "colorPalette": ["#hex1","#hex2","#hex3","#hex4","#hex5"],
    "mood": "string",
    "fontStyle": "serif-elegant|sans-modern|mono-tech",
    "layoutStyle": "grid|collage|minimal|mosaic"
  },
  "panels": [
    {
      "goalTitle": "exact goal title from the list",
      "imagePrompt": "detailed SD prompt",
      "affirmation": "personal affirmation",
      "category": "HEALTH|CAREER|PERSONAL|FINANCE|LEARNING|RELATIONSHIP",
      "position": 0
    }
  ],
  "centerAffirmation": "the big overarching I AM statement"
}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN: Generate vision board config from user data
// ─────────────────────────────────────────────────────────────────────────────

export async function generateVisionBoardConfig(params: {
  userId: string;
  userName: string;
  goals: GoalSummary[];
  archetype: UserArchetype | null;
  psychProfile: PsychologicalProfile | null;
}): Promise<VisionBoardConfig | null> {
  if (params.goals.length === 0) {
    console.warn('[VisionBoard] No goals provided — cannot generate board');
    return null;
  }

  const todayDate = new Date().toISOString().slice(0, 10);

  // Max 6 panels to keep the board focused
  const goals = params.goals.slice(0, 6);

  const systemPrompt = buildGenerationPrompt({
    userName: params.userName,
    goals,
    archetype: params.archetype,
    psychProfile: params.psychProfile,
    todayDate,
  });

  try {
    const { data: raw } = await callAIJson<{
      title: string;
      theme: VisionBoardTheme;
      panels: Omit<VisionBoardPanel, 'id' | 'progress'>[];
      centerAffirmation: string;
    }>(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate my personalized vision board configuration now.' },
      ],
      { taskType: 'analyze', temperature: 0.8, maxTokens: 3000 }
    );

    if (!raw.panels || raw.panels.length === 0) throw new Error('No panels generated');

    const config: VisionBoardConfig = {
      userId: params.userId,
      title: raw.title || `${params.userName}'s Vision Board`,
      theme: {
        colorPalette: Array.isArray(raw.theme?.colorPalette) ? raw.theme.colorPalette : ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
        mood: raw.theme?.mood || 'balanced',
        fontStyle: raw.theme?.fontStyle || 'sans-modern',
        layoutStyle: raw.theme?.layoutStyle || 'grid',
      },
      panels: raw.panels.map((p, i) => {
        const matchedGoal = goals.find(
          (g) => g.title.toLowerCase().includes(p.goalTitle.toLowerCase().slice(0, 15))
        );
        return {
          ...p,
          id: `panel-${i}-${Date.now()}`,
          progress: matchedGoal?.progress ?? 0,
          position: p.position ?? i,
        };
      }),
      centerAffirmation: raw.centerAffirmation || 'I am building the life I deserve.',
      generatedAt: new Date().toISOString(),
      version: 1,
      archetype: params.archetype ?? undefined,
    };

    return config;
  } catch (err) {
    console.error('[VisionBoard] Config generation failed:', err);
    return null;
  }
}
