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

// Wizard data passed from the guided creation flow
export interface WizardPromptData {
  overarchingVision: string;
  domains: string[];
  domainDetails: Record<string, string>;
  stylePreset: 'pinterest-bold' | 'clean-minimal' | 'luxury-editorial' | 'cinematic-dream';
  mood: string;
  customPromptBoost: string;
}

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

// ─────────────────────────────────────────────────────────────────────────────
// Style-to-visual mapping — used to enrich the AI prompt
// ─────────────────────────────────────────────────────────────────────────────

const STYLE_VISUAL_DESCRIPTOR: Record<string, string> = {
  'pinterest-bold': 'Pinterest-style boldly-composed collage aesthetic, high contrast, rich saturation, aspirational lifestyle photography',
  'clean-minimal': 'minimalist editorial aesthetic, soft natural light, airy white space, muted tones, calm premium design',
  'luxury-editorial': 'luxury editorial photography, polished premium textures, magazine-grade composition, sophisticated tones',
  'cinematic-dream': 'cinematic dreamlike imagery, dramatic moody lighting, shallow depth of field, cinematic color grading',
};

const DOMAIN_VISUAL_KEYWORDS: Record<string, string> = {
  HEALTH: 'fitness, athletic body, vibrant health, outdoor exercise, clean nutrition',
  CAREER: 'professional success, modern office, presentation, leadership, technology',
  WEALTH: 'luxury lifestyle, financial freedom, modern home, elegant possessions, abundance',
  RELATIONSHIP: 'connection, warm relationships, family, love, community',
  LEARNING: 'books, education, skill mastery, focus, intellectual growth',
  TRAVEL: 'exotic destination, adventure, world exploration, culture, freedom',
  MINDSET: 'meditation, calm mind, inner peace, clarity, mindfulness',
  CREATIVITY: 'artistic expression, creation, studio, music, art, innovation',
};

function buildGenerationPrompt(params: {
  userName: string;
  goals: GoalSummary[];
  archetype: UserArchetype | null;
  psychProfile: PsychologicalProfile | null;
  todayDate: string;
  wizardData?: WizardPromptData | null;
}): string {
  const { userName, goals, archetype, psychProfile, todayDate, wizardData } = params;

  const archetypeHint = archetype
    ? `User archetype: ${archetype.replace('the_', '').toUpperCase()}`
    : 'Archetype: unknown (use balanced defaults)';

  const psychHint = psychProfile && psychProfile.bigFive.confidence >= 20
    ? `Big Five (1-10): O=${psychProfile.bigFive.openness} C=${psychProfile.bigFive.conscientiousness} E=${psychProfile.bigFive.extraversion} A=${psychProfile.bigFive.agreeableness} N=${psychProfile.bigFive.neuroticism}
Motivational stage: ${psychProfile.motivational.changeStage}
Feedback style: ${psychProfile.behavioral.preferredFeedbackStyle}
Procrastination tendency: ${psychProfile.behavioral.procrastinationTendency}/10`
    : 'Psychology profile: not yet available (use balanced defaults)';

  // Build the wizard-enhanced context block
  let wizardContext = '';
  if (wizardData) {
    const styleVisual = STYLE_VISUAL_DESCRIPTOR[wizardData.stylePreset] ?? '';
    const domainLines = wizardData.domains
      .map((d) => {
        const detail = wizardData.domainDetails[d] ?? '';
        const visual = DOMAIN_VISUAL_KEYWORDS[d] ?? '';
        return `  ${d}: "${detail}" (visual keywords: ${visual})`;
      })
      .join('\n');

    wizardContext = `
GUIDED WIZARD INPUT (HIGH PRIORITY — use this over generic goal inference):
Overarching vision: "${wizardData.overarchingVision}"
Board mood: ${wizardData.mood}
Visual style: ${wizardData.stylePreset} — ${styleVisual}
Life domains and user's specific vision for each:
${domainLines}
${wizardData.customPromptBoost ? `Extra visual details requested: "${wizardData.customPromptBoost}"` : ''}

INSTRUCTION: Use the wizard domain details as the DIRECT SOURCE for image prompts. Each domain selected by the user MUST become a panel. The user's exact words and specifics should be woven into the image prompts and affirmations.`;
  }

  // When wizard data provides domains, use them instead of goals
  const panelSource = wizardData && wizardData.domains.length > 0
    ? `PANELS TO GENERATE: One panel per selected domain below (${wizardData.domains.length} total). 
Use the user's domain details directly as the basis for imagePrompt and affirmation:
${wizardData.domains.map((d, i) => {
  const detail = wizardData.domainDetails[d] ?? d;
  return `${i + 1}. [${d}] ${detail}`;
}).join('\n')}`
    : `GOALS (${goals.length} total):
${goals.map((g, i) => `${i + 1}. [${g.category}] ${g.title} — ${g.progress}% done${g.description ? ` (${g.description.slice(0, 80)})` : ''}`).join('\n')}`;

  return `You are RESURGO's Vision Board Designer — an expert at creating deeply personal, emotionally resonant vision board configurations. Your image prompts are highly specific, cinematic, and optimized for AI image generation.

USER: ${userName}
DATE: ${todayDate}
${archetypeHint}
${psychHint}
${wizardContext}

${panelSource}

RULES FOR IMAGE PROMPTS (critical — follow precisely):
- Write Stable Diffusion style prompts: specific, visual, evocative. Focus on OUTCOMES not processes.
- Incorporate the user's own words and specific details from their domain descriptions
- Each prompt must be unique and directly tied to THIS user's specific vision
- Include subject, environment, lighting, mood, style in every prompt
- Always end with: "photorealistic, inspirational lifestyle photography, 4K, award-winning composition"
- Never include text, words, or signs in the visual
- Culturally neutral and inclusive. No specific celebrity faces.
- GOOD: "A lean athletic man finishing a morning run on a coastal cliff path at golden hour, Mediterranean morning light, triumphant expression, wearing performance gear"
- BAD: "A person exercising at the gym"

RULES FOR AFFIRMATIONS:
- First person, present tense ("I am" not "I will be")  
- Must be specific to THIS user's domain detail — not generic quotes
- 8–15 words maximum. Punchy and personal.
- Match mood: "${wizardData?.mood ?? 'Ambitious & Bold'}"

RULES FOR THEME:
${wizardData ? `- Style preset: ${wizardData.stylePreset} → apply matching color palette and layout
- Mood: ${wizardData.mood} → reflect in color choices and font style
- "Ambitious": bold oranges/reds, grid layout, sans-modern
- "Calm/Peaceful": soft blues/greens, minimal layout, serif-elegant
- "Luxurious": gold/black palette, collage or mosaic, serif-elegant
- "Adventurous": warm earth tones, mosaic layout, sans-modern
- "Spiritual": purple/indigo palette, minimal layout, serif-elegant` : `- High neuroticism (>7) → calming colors blues/greens
- High extraversion (>7) → vibrant warm oranges/yellows
- High conscientiousness (>7) → grid or minimal layout
- High openness (>7) → collage or mosaic layout`}

OUTPUT (strict JSON only, no markdown, no explanation, no code fences):
{
  "title": "Personal, specific board title referencing the user's overarching vision",
  "theme": {
    "colorPalette": ["#hex1","#hex2","#hex3","#hex4","#hex5"],
    "mood": "string",
    "fontStyle": "serif-elegant|sans-modern|mono-tech",
    "layoutStyle": "grid|collage|minimal|mosaic"
  },
  "panels": [
    {
      "goalTitle": "domain or goal title being visualized",
      "imagePrompt": "highly specific AI image generation prompt incorporating user's exact words",
      "affirmation": "specific present-tense affirmation 8-15 words",
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
  wizardData?: WizardPromptData | null;
}): Promise<VisionBoardConfig | null> {
  // Allow generation with wizard data even without goals
  if (params.goals.length === 0 && !params.wizardData) {
    console.warn('[VisionBoard] No goals and no wizard data — cannot generate board');
    return null;
  }

  const todayDate = new Date().toISOString().slice(0, 10);

  // Max 6 panels. If wizard data provided, use domains instead of goals cap.
  const goals = params.wizardData?.domains.length
    ? params.goals.slice(0, 6)
    : params.goals.slice(0, 6);

  const systemPrompt = buildGenerationPrompt({
    userName: params.userName,
    goals,
    archetype: params.archetype,
    psychProfile: params.psychProfile,
    todayDate,
    wizardData: params.wizardData ?? null,
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
