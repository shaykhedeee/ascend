// ═══════════════════════════════════════════════════════════════════════════════
// ASCENDIFY — Billing Plans (Research-backed)
// Central pricing + feature matrix used by billing and pricing surfaces.
// ═══════════════════════════════════════════════════════════════════════════════

export type BillingCadence = 'monthly' | 'yearly' | 'lifetime';
export type BillingPlanKey = 'free' | 'pro_monthly' | 'pro_yearly' | 'lifetime';

export interface BillingPlan {
  key: BillingPlanKey;
  title: string;
  badge?: string;
  description: string;
  cadence: BillingCadence;
  priceUsd: number;
  yearlyEquivalentUsd?: number;
  highlighted?: boolean;
  ctaLabel: string;
  clerkCheckoutUrlEnv?: string;
  featureBullets: string[];
}

// Research basis (2026):
// - Todoist Pro ~ $4/mo billed yearly (price-sensitive mass market)
// - Sunsama $20-$25/mo (premium high-touch positioning)
// - Motion ~$19-$29/seat/mo (AI-heavy productivity)
// - Habitify ~₹100/mo annual (~$1.2/mo regional low-cost strategy)
// Positioning chosen: "premium-but-accessible" at $12 monthly / $8 annual effective.
export const BILLING_PLANS: BillingPlan[] = [
  {
    key: 'free',
    title: 'Free',
    description: 'Everything you need to start building habits — no credit card required.',
    cadence: 'monthly',
    priceUsd: 0,
    ctaLabel: 'Get Started Free',
    featureBullets: [
      'Up to 10 active habits',
      'Up to 3 active goals',
      'AI-powered insights & suggestions',
      'Streak tracking & reminders',
      'Calendar view',
      'Focus timer (basic)',
      'Mood tracking',
      '7-day analytics history',
      'Community support',
    ],
  },
  {
    key: 'pro_monthly',
    title: 'Pro',
    badge: 'Flexible',
    description: 'Unlock full power — unlimited everything with AI coaching.',
    cadence: 'monthly',
    priceUsd: 12,
    yearlyEquivalentUsd: 144,
    ctaLabel: 'Start Pro Monthly',
    clerkCheckoutUrlEnv: 'NEXT_PUBLIC_CLERK_CHECKOUT_PRO_MONTHLY_URL',
    featureBullets: [
      'Unlimited habits & goals',
      'Unlimited focus sessions',
      'AI goal decomposition engine',
      'AI adaptive coaching & smart nudges',
      'Advanced analytics & long-range trends',
      'Contribution heatmap',
      'Weekly review wizard',
      'Habit stacking builder',
      'Identity-based habit system',
      'Custom habit templates',
      'Data export (CSV & PDF)',
      'Priority email support',
    ],
  },
  {
    key: 'pro_yearly',
    title: 'Pro Yearly',
    badge: 'Best Value — Save 33%',
    description: 'Same Pro power, billed yearly at $8/mo effective — our most popular plan.',
    cadence: 'yearly',
    priceUsd: 96,
    yearlyEquivalentUsd: 96,
    highlighted: true,
    ctaLabel: 'Start Pro Yearly',
    clerkCheckoutUrlEnv: 'NEXT_PUBLIC_CLERK_CHECKOUT_PRO_YEARLY_URL',
    featureBullets: [
      'Everything in Pro Monthly',
      'Billed at $8/mo (save $48/yr)',
      'Priority roadmap voting',
      'Annual performance review toolkit',
      'Early access to new features',
    ],
  },
  {
    key: 'lifetime',
    title: 'Lifetime',
    badge: 'Founder Deal',
    description: 'Pay once, own Ascendify forever. Limited-time founder pricing.',
    cadence: 'lifetime',
    priceUsd: 199,
    yearlyEquivalentUsd: 199,
    ctaLabel: 'Get Lifetime Access',
    clerkCheckoutUrlEnv: 'NEXT_PUBLIC_CLERK_CHECKOUT_LIFETIME_URL',
    featureBullets: [
      'Everything in Pro — forever',
      'No recurring charges, ever',
      'Lifetime updates included',
      'Founder badge & early feature channel',
      'Priority concierge onboarding',
      'Exclusive founder community access',
    ],
  },
];

export function mapClerkPlanToUserPlan(planIdentifier: string | null | undefined): 'free' | 'pro' | 'lifetime' {
  if (!planIdentifier) return 'free';
  const normalized = planIdentifier.toLowerCase();
  if (normalized.includes('lifetime')) return 'lifetime';
  if (normalized.includes('pro') || normalized.includes('premium') || normalized.includes('yearly') || normalized.includes('monthly')) return 'pro';
  return 'free';
}
