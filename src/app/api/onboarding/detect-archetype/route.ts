// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/onboarding/detect-archetype
// Detects and saves the user archetype from onboarding answers.
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';
import { detectArchetype, heuristicArchetypeDetect, type OnboardingData } from '@/lib/ai/onboarding/archetype-detector';
import { getArchetypeConfig } from '@/lib/ai/onboarding/archetypes';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let token: string;
  try {
    const t = await getToken({ template: 'convex' });
    if (!t) throw new Error('no token');
    token = t;
  } catch {
    return NextResponse.json({ error: 'Auth token failed' }, { status: 401 });
  }

  let body: OnboardingData;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // ── Detect archetype via AI, fallback to heuristic ─────────────────────────
  let result;
  try {
    result = await detectArchetype(body);
  } catch {
    const heuristic = heuristicArchetypeDetect(body);
    result = { archetype: heuristic, confidence: 30, reasoning: 'heuristic fallback', secondaryArchetype: null, detectedSignals: [] };
  }

  const config = getArchetypeConfig(result.archetype);

  // ── Save to Convex ─────────────────────────────────────────────────────────
  convex.setAuth(token);
  try {
    await convex.mutation(api.users.setArchetype, {
      archetype: result.archetype,
      confidence: result.confidence,
      secondaryArchetype: result.secondaryArchetype,
      onboardingData: JSON.stringify(body),
    });
  } catch (err) {
    console.error('[Archetype] Failed to save to Convex:', err);
  }

  return NextResponse.json({
    archetype: result.archetype,
    confidence: result.confidence,
    reasoning: result.reasoning,
    secondaryArchetype: result.secondaryArchetype,
    detectedSignals: result.detectedSignals,
    config: {
      label: config.label,
      emoji: config.emoji,
      description: config.description,
      firstMessagePrompt: config.coaching.firstMessagePrompt,
      welcomeMessage: config.onboarding.welcomeMessage,
      ui: config.ui,
    },
  });
}
