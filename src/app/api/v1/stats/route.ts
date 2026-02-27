import { NextRequest, NextResponse } from 'next/server';

function validateApiKey(req: NextRequest): boolean {
  const key = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '');
  return !!(key && key.startsWith('rsg_'));
}

export async function GET(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  return NextResponse.json({
    stats: {
      message: 'Connect via Convex client SDK to get real-time stats.',
      docs: 'https://resurgo.life/docs#stats',
    },
  });
}
