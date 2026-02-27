import { NextRequest, NextResponse } from 'next/server';

function validateApiKey(req: NextRequest): boolean {
  const key = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '');
  return !!(key && key.startsWith('rsg_'));
}

export async function GET(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'Unauthorized. Provide x-api-key header.' }, { status: 401 });
  }
  return NextResponse.json({
    data: [],
    message: 'Habits endpoint. Connect via Convex client SDK for real-time data.',
    docs: 'https://resurgo.life/docs#habits',
  });
}
