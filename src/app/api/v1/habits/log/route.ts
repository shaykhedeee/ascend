import { NextRequest, NextResponse } from 'next/server';

function validateApiKey(req: NextRequest): boolean {
  const key = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '');
  return !!(key && key.startsWith('rsg_'));
}

export async function POST(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { habitId, date, completed } = body;

  if (!habitId) {
    return NextResponse.json({ error: 'habitId is required.' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: 'Use Convex client SDK for real-time habit logging.',
    receivedPayload: { habitId, date: date || new Date().toISOString().split('T')[0], completed: completed ?? true },
  });
}
