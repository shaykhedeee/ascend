// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Meta Marketing API: Health Check Route
// GET: verify token, ad account access, and pixel configuration
// ═══════════════════════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { checkMetaApiHealth } from '@/lib/marketing/meta-api';

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const health = await checkMetaApiHealth();
    return NextResponse.json(health);
  } catch (error) {
    console.error('[Meta Health GET]', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
