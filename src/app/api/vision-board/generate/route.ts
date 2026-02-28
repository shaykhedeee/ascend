// ═══════════════════════════════════════════════════════════════════════════════
// POST /api/vision-board/generate
// Generates + stores a personalised vision board for the authenticated user.
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

import { generateVisionBoardConfig, type GoalSummary } from '@/lib/ai/vision-board/generator';
import { generateBoardImages } from '@/lib/ai/vision-board/image-service';
import type { PsychologicalProfile } from '@/lib/ai/psychology/profile-schema';
import type { UserArchetype } from '@/lib/ai/onboarding/archetypes';

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
    return NextResponse.json({ error: 'Could not obtain auth token' }, { status: 401 });
  }

  convex.setAuth(token);

  // ── 1. Load user + goals in parallel ──────────────────────────────────────
  const [convexUser, rawGoals] = await Promise.all([
    convex.query(api.users.current, {}).catch(() => null),
    convex.query((api as any).goals.list ?? (api as any).goals.getActiveGoals, {}).catch(() => [] as unknown[]),
  ]);

  if (!convexUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const goals: GoalSummary[] = (Array.isArray(rawGoals) ? rawGoals : [])
    .map((g: any) => ({
      title: g.title ?? '',
      category: g.category ?? 'PERSONAL',
      progress: g.progress ?? 0,
      description: g.description,
    }))
    .filter((g) => g.title.length > 0)
    .slice(0, 6);

  // ── 2. Load psychology profile ─────────────────────────────────────────────
  let psychProfile: PsychologicalProfile | null = null;
  try {
    const doc = await convex.query((api as any).psychology.getProfile, {});
    if (doc?.profileData) psychProfile = JSON.parse(doc.profileData);
  } catch { /* profile not required */ }

  // ── 3. Get archetype ───────────────────────────────────────────────────────
  const archetype = ((convexUser as any).archetype as UserArchetype | undefined) ?? null;
  const userName = (convexUser as any).name?.split(' ')[0] ?? 'friend';

  // ── 4. Generate board config ───────────────────────────────────────────────
  // If no goals yet, create placeholder goals so the board still generates
  const goalsForBoard = goals.length > 0
    ? goals
    : [{ title: 'Define my life vision', category: 'PERSONAL', progress: 0 }];

  const config = await generateVisionBoardConfig({
    userId,
    userName,
    goals: goalsForBoard,
    archetype,
    psychProfile,
  });

  if (!config) {
    return NextResponse.json({ error: 'Board config generation failed' }, { status: 500 });
  }

  // ── 5. Generate images for each panel ─────────────────────────────────────
  const images = await generateBoardImages(config.panels);

  const boardWithImages = {
    ...config,
    panels: config.panels.map((panel) => ({
      ...panel,
      imageData: images.get(panel.id) ?? null,
    })),
  };

  // ── 6. Save to Convex ──────────────────────────────────────────────────────
  try {
    await convex.mutation((api as any).visionBoards.save, {
      config: JSON.stringify(boardWithImages),
      version: boardWithImages.version,
    });
  } catch (err) {
    console.error('[VisionBoard] Failed to save board:', err);
    // Still return the generated board even if save fails
  }

  return NextResponse.json({ success: true, board: boardWithImages });
}
