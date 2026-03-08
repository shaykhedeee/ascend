import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { z } from 'zod';
import { api } from '../../../../../../convex/_generated/api';
import { parseBrainDump } from '@/lib/ai/brain-dump/parser';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const offlineBrainDumpSchema = z.object({
  text: z.string().min(10).max(5000),
  capturedAt: z.number().optional(),
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

  const parsed = offlineBrainDumpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const token = await getToken({ template: 'convex' });
  if (!token) {
    return NextResponse.json({ error: 'Convex auth token unavailable' }, { status: 401 });
  }

  convex.setAuth(token);

  const user = await convex.query(api.users.current, {});
  const tasks = await convex.query(api.tasks.list, {});
  const goals = await convex.query(api.goals.listActive, {});

  const result = await parseBrainDump({
    rawText: parsed.data.text,
    userContext: {
      name: user?.name ?? 'User',
      existingTaskCount: Array.isArray(tasks)
        ? tasks.filter((task: { status?: string }) => task.status !== 'done').length
        : 0,
      goals: Array.isArray(goals) ? goals.map((goal: { title: string }) => ({ title: goal.title })) : [],
    },
  });

  await convex.mutation(api.wellness.createJournalEntry, {
    date: new Date(parsed.data.capturedAt ?? Date.now()).toISOString().slice(0, 10),
    content: parsed.data.text,
    type: 'freeform',
  });

  return NextResponse.json({
    success: true,
    parsed: result.success ? result.data : null,
    attempts: result.attempts,
    provider: result.success ? result.provider : undefined,
    latencyMs: result.totalLatencyMs,
  });
}
