// ═══════════════════════════════════════════════════════════════════════════════
// ASCENDIFY — Clerk Billing Webhook
// Handles subscription changes → updates user plan in Convex
// POST /api/webhooks/clerk-billing
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';
import { mapClerkPlanToUserPlan } from '@/lib/billing/plans';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function extractClerkPlanIdentifier(data: any): string | null {
  const candidates: Array<unknown> = [
    data?.plan_id,
    data?.plan?.id,
    data?.plan?.slug,
    data?.plan?.name,
    data?.subscription?.plan_id,
    data?.subscription?.plan?.id,
    data?.subscription?.plan?.slug,
    data?.subscription?.plan?.name,
    data?.public_metadata?.plan,
    data?.private_metadata?.plan,
  ];

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  // ────────────────────────────────────────────────────────────────────────
  // 1) Verify webhook signature (Clerk uses Svix)
  // ────────────────────────────────────────────────────────────────────────
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET env variable');
    return NextResponse.json({ error: 'Server config error' }, { status: 500 });
  }

  const svix_id = req.headers.get('svix-id');
  const svix_timestamp = req.headers.get('svix-timestamp');
  const svix_signature = req.headers.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: any;
  try {
    event = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // ────────────────────────────────────────────────────────────────────────
  // 2) Handle billing events
  // ────────────────────────────────────────────────────────────────────────
  const { type, data } = event;
  const syncSecret = process.env.BILLING_WEBHOOK_SYNC_SECRET;

  if (!syncSecret) {
    console.error('Missing BILLING_WEBHOOK_SYNC_SECRET env variable');
    return NextResponse.json({ error: 'Server config error' }, { status: 500 });
  }

  console.log(`[Webhook] Received: ${type}`);

  try {
    switch (type) {
      // Subscription created or updated
      case 'billing.subscription.created':
      case 'billing.subscription.updated':
      case 'subscription.created':
      case 'subscription.updated': {
        const clerkId = data.user_id || data.user?.id;
        const planIdentifier = extractClerkPlanIdentifier(data);

        if (!clerkId) {
          console.error('[Webhook] Missing user id in billing webhook payload');
          return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
        }

        const plan = mapClerkPlanToUserPlan(planIdentifier);

        // Validate plan is one of the allowed values
        if (!['free', 'pro', 'lifetime'].includes(plan)) {
          console.error(`[Webhook] Invalid plan value: ${plan} from identifier: ${planIdentifier}`);
          return NextResponse.json({ error: 'Invalid plan value' }, { status: 400 });
        }

        console.log(`[Webhook] Updating plan for ${clerkId} → ${plan} (${planIdentifier ?? 'unknown-plan'})`);

        try {
          await convex.mutation(api.users.updatePlanFromWebhook, {
            clerkId,
            plan,
            webhookSecret: syncSecret,
          });
          console.log(`[Webhook] Successfully updated plan for ${clerkId}`);
        } catch (updateErr: any) {
          console.error(`[Webhook] CRITICAL: Failed to update plan for ${clerkId}:`, updateErr);
          // Return 500 so Clerk retries the webhook
          return NextResponse.json(
            { error: 'Failed to process plan update', details: updateErr.message },
            { status: 500 }
          );
        }

        break;
      }

      // Subscription cancelled
      case 'billing.subscription.deleted':
      case 'subscription.deleted': {
        const clerkId = data.user_id || data.user?.id;
        if (!clerkId) {
          console.error('[Webhook] Missing user id in cancellation payload');
          return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
        }

        console.log(`[Webhook] Subscription cancelled for ${clerkId}`);
        try {
          await convex.mutation(api.users.updatePlanFromWebhook, {
            clerkId,
            plan: 'free',
            webhookSecret: syncSecret,
          });
          console.log(`[Webhook] Successfully downgraded ${clerkId} to free plan`);
        } catch (updateErr: any) {
          console.error(`[Webhook] CRITICAL: Failed to downgrade ${clerkId}:`, updateErr);
          return NextResponse.json(
            { error: 'Failed to process cancellation', details: updateErr.message },
            { status: 500 }
          );
        }

        break;
      }

      // User created in Clerk
      case 'user.created': {
        console.log(`[Webhook] New user: ${data.id}`);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event: ${type}`);
    }
  } catch (err: any) {
    console.error(`[Webhook] Unexpected error processing ${type}:`, err);
    return NextResponse.json(
      { error: 'Processing error', details: err.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
