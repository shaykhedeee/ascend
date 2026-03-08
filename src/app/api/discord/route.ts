// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Discord Integration API
// Webhook-based Discord notifications + community bridge
// Set DISCORD_WEBHOOK_URL + DISCORD_COMMUNITY_INVITE in env
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL || '';
const DISCORD_ALERTS_WEBHOOK = process.env.DISCORD_ALERTS_WEBHOOK_URL || '';
const DISCORD_COMMUNITY_INVITE = process.env.NEXT_PUBLIC_DISCORD_INVITE || 'https://discord.gg/resurgo';

// ── Embed builder ─────────────────────────────────────────────────────────────

interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  footer?: { text: string; icon_url?: string };
  thumbnail?: { url: string };
  timestamp?: string;
}

function buildEmbed(embed: DiscordEmbed) {
  return {
    ...embed,
    color: embed.color ?? 0xFF6B35, // Resurgo orange
    footer: embed.footer ?? { text: 'Resurgo · resurgo.life', icon_url: 'https://resurgo.life/icon.png' },
    timestamp: embed.timestamp ?? new Date().toISOString(),
  };
}

async function sendWebhook(webhookUrl: string, content: string, embeds?: DiscordEmbed[]) {
  if (!webhookUrl) return false;
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        embeds: embeds?.map(buildEmbed),
        username: 'Resurgo',
        avatar_url: 'https://resurgo.life/icon.png',
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Event triggers ─────────────────────────────────────────────────────────────

export async function notifyNewSignup(name: string, plan: string) {
  return sendWebhook(
    DISCORD_ALERTS_WEBHOOK,
    '',
    [{
      title: '🎉 New User Signup',
      description: `**${name}** just joined Resurgo on the **${plan}** plan.`,
      color: 0x00FF88,
      fields: [
        { name: 'Time', value: new Date().toUTCString(), inline: true },
        { name: 'Plan', value: plan, inline: true },
      ],
    }]
  );
}

export async function notifyNewPurchase(name: string, plan: string, amount: string) {
  return sendWebhook(
    DISCORD_ALERTS_WEBHOOK,
    '💰 **NEW PURCHASE** 💰',
    [{
      title: `${name} upgraded to ${plan}`,
      description: `Payment received: **${amount}**`,
      color: 0xFFD700,
      fields: [
        { name: 'Plan', value: plan, inline: true },
        { name: 'Amount', value: amount, inline: true },
        { name: 'Time', value: new Date().toUTCString(), inline: false },
      ],
    }]
  );
}

export async function notifyGoalAchieved(userName: string, goalName: string) {
  return sendWebhook(
    DISCORD_WEBHOOK,
    '',
    [{
      title: '🏆 Goal Achieved!',
      description: `**${userName}** just completed their goal: **${goalName}**`,
      color: 0xFF6B35,
    }]
  );
}

export async function postCommunityUpdate(message: string, embeds?: DiscordEmbed[]) {
  return sendWebhook(DISCORD_WEBHOOK, message, embeds);
}

// ── API Route ─────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { event, data } = body;

  let success = false;

  switch (event) {
    case 'goal_achieved':
      success = await notifyGoalAchieved(data.userName, data.goalName);
      break;
    case 'milestone':
      success = await sendWebhook(DISCORD_WEBHOOK, '', [{
        title: `🌟 ${data.userName} hit a milestone!`,
        description: data.description,
        color: 0xFF6B35,
      }]);
      break;
    case 'community_post':
      success = await postCommunityUpdate(data.message);
      break;
    default:
      return NextResponse.json({ error: 'Unknown event' }, { status: 400 });
  }

  return NextResponse.json({ success, discordInvite: DISCORD_COMMUNITY_INVITE });
}

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    connected: !!DISCORD_WEBHOOK,
    communityInvite: DISCORD_COMMUNITY_INVITE,
    instructions: {
      setup: [
        '1. Create a Discord server at discord.com/channels/@me',
        '2. Go to Server Settings → Integrations → Webhooks',
        '3. Create webhook for #signups channel → copy URL → set DISCORD_ALERTS_WEBHOOK_URL',
        '4. Create webhook for #community channel → copy URL → set DISCORD_WEBHOOK_URL',
        '5. Set NEXT_PUBLIC_DISCORD_INVITE to your server invite link',
      ],
    },
  });
}
