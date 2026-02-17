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
    description: 'Best for trying Ascendify and building your first success loop.',
    cadence: 'monthly',
    priceUsd: 0,
    ctaLabel: 'Current baseline',
    featureBullets: [
      'Up to 5 habits and 1 active goal',
      'Core tracking, reminders, and calendar',
      '7-day history',
      'Community support',
    ],
  },
  {
    key: 'pro_monthly',
    title: 'Pro Monthly',
    badge: 'Flexible',
    description: 'For serious builders who want full power without annual commitment.',
    cadence: 'monthly',
    priceUsd: 12,
    yearlyEquivalentUsd: 144,
    ctaLabel: 'Start Pro Monthly',
    clerkCheckoutUrlEnv: 'NEXT_PUBLIC_CLERK_CHECKOUT_PRO_MONTHLY_URL',
    featureBullets: [
      'Unlimited habits, goals, and focus sessions',
      'AI decomposition, insights, and adaptive coaching',
      'Advanced analytics + long-range trends',
      'Data export + premium support',
    ],
  },
  {
    key: 'pro_yearly',
    title: 'Pro Yearly',
    badge: 'Best Value',
    description: 'Commit yearly and save 33% while locking in your growth system.',
    cadence: 'yearly',
    priceUsd: 96,
    yearlyEquivalentUsd: 96,
    highlighted: true,
    ctaLabel: 'Start Pro Yearly',
    clerkCheckoutUrlEnv: 'NEXT_PUBLIC_CLERK_CHECKOUT_PRO_YEARLY_URL',
    featureBullets: [
      'Everything in Pro Monthly',
      '33% annual savings vs monthly',
      'Priority roadmap access',
      'Annual performance review toolkit',
    ],
  },
  {
    key: 'lifetime',
    title: 'Lifetime',
    badge: 'Founder Access',
    description: 'One-time payment for long-term believers and early supporters.',
    cadence: 'lifetime',
    priceUsd: 249,
    yearlyEquivalentUsd: 249,
    ctaLabel: 'Get Lifetime Access',
    clerkCheckoutUrlEnv: 'NEXT_PUBLIC_CLERK_CHECKOUT_LIFETIME_URL',
    featureBullets: [
      'Everything in Pro Yearly',
      'No recurring renewals',
      'Founder badge + early feature channel',
      'Priority concierge onboarding',
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
