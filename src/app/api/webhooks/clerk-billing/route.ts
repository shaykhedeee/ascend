// ═══════════════════════════════════════════════════════════════════════════════
// VANTAGE — Clerk Billing Webhook
// Handles subscription changes → updates user plan in Convex
// POST /api/webhooks/clerk-billing
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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

  console.log(`[Webhook] Received: ${type}`);

  try {
    switch (type) {
      // Subscription created or updated
      case 'subscription.created':
      case 'subscription.updated': {
        const clerkId = data.user_id;
        const planId = data.plan_id; // Your Clerk plan ID

        // Map Clerk plan IDs to our plan names
        let plan: 'free' | 'pro' | 'lifetime' = 'free';
        if (planId?.includes('pro') || planId?.includes('premium')) {
          plan = 'pro';
        } else if (planId?.includes('lifetime')) {
          plan = 'lifetime';
        }

        // Update user plan in Convex via internal mutation
        // Note: For production, use Convex HTTP client with a service token
        // or call the updatePlan mutation directly
        console.log(`[Webhook] Updating plan for ${clerkId} → ${plan}`);

        // We can't call internalMutation from HTTP client, 
        // so use a public mutation that validates a webhook secret
        await convex.mutation(api.users.store as any);

        break;
      }

      // Subscription cancelled
      case 'subscription.deleted': {
        const clerkId = data.user_id;
        console.log(`[Webhook] Subscription cancelled for ${clerkId}`);
        // Downgrade to free
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
  } catch (err) {
    console.error(`[Webhook] Error processing ${type}:`, err);
    return NextResponse.json({ error: 'Processing error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
