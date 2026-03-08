import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { z } from 'zod';
import { api } from '../../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const offlineTaskSchema = z.object({
  title: z.string().min(1).max(240),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string().optional(),
  eisenhowerQuadrant: z.enum(['urgent_important', 'important', 'urgent', 'neither']).optional(),
  estimatedMinutes: z.number().int().positive().max(960).optional(),
  source: z.enum(['manual', 'ai_generated', 'recurring', 'decomposition', 'imported', 'telegram']).optional(),
});

export async function POST(request: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const parsed = offlineTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const token = await getToken({ template: 'convex' });
  if (!token) {
    return NextResponse.json({ error: 'Convex auth token unavailable' }, { status: 401 });
  }

  convex.setAuth(token);
  const taskId = await convex.mutation(api.tasks.create, {
    ...parsed.data,
    source: parsed.data.source ?? 'manual',
  });

  return NextResponse.json({ success: true, taskId });
}
