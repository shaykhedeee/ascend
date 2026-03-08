// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Content Analytics API Route
// Receives events from the content metrics tracker and stores in Convex
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

const VALID_EVENTS = [
  'content_signup_assist',
  'content_pricing_click',
  'content_internal_link',
  'content_continuation',
  'content_cta_click',
  'content_scroll_depth',
  'content_time_on_page',
  'content_exit_intent',
  'ai_visibility_check',
] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const event = typeof body.event === 'string' ? body.event.trim() : '';
    if (!VALID_EVENTS.includes(event as (typeof VALID_EVENTS)[number])) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
    }

    const path = typeof body.path === 'string' ? body.path.slice(0, 200) : '/';
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.slice(0, 64) : undefined;
    const journey = Array.isArray(body.journey) ? body.journey.slice(0, 10).map(String) : [];
    const properties = typeof body.properties === 'object' && body.properties ? body.properties : {};

    // Try to store in Convex via marketing.logEvent if available
    type ApiShape = {
      marketing?: {
        logEvent?: unknown;
      };
    };

    const typedApi = api as unknown as ApiShape;
    const apiRef = typedApi.marketing?.logEvent;

    if (convex && apiRef) {
      const invokeMutation = convex.mutation as unknown as (
        functionReference: unknown,
        args: Record<string, unknown>
      ) => Promise<unknown>;

      await invokeMutation(apiRef, {
        event: `content:${event}`,
        path,
        properties: {
          ...properties,
          sessionId,
          journey,
          timestamp: body.timestamp ?? Date.now(),
        },
        sessionId,
      }).catch(() => {
        /* silent — analytics never breaks */
      });
    }

    // Also log to console in dev for visibility
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ContentMetrics] ${event} | ${path}`, properties);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
