// ═══════════════════════════════════════════════════════════════════════════════
// RESURGOIFY - Pricing Page (SEO-Optimized)
// ═══════════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import Link from 'next/link';
import { Mountain, ArrowLeft, Check, Zap, Star, Shield, Crown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing — Free & Pro Plans',
  description:
    'RESURGO pricing plans: Free habit tracker with 10 habits & AI insights, or Pro with unlimited AI goal decomposition, advanced analytics, and priority support. No credit card required.',
  keywords: [
    'habit tracker pricing', 'free habit tracker', 'habit tracker no ads',
    'best free goal tracker', 'productivity app pricing',
  ],
  openGraph: {
    title: 'RESURGO Pricing — Free & Pro Plans',
    description: 'Start free. Upgrade when you\'re ready. No credit card needed.',
    url: '/pricing',
  },
  alternates: { canonical: '/pricing' },
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Everything you need to start building habits',
    icon: Zap,
    color: 'from-slate-400 to-slate-500',
    highlight: false,
    features: [
      'Up to 10 active habits',
      'Up to 3 active goals',
      'AI-powered insights & suggestions',
      'Streak tracking & reminders',
      'Calendar view',
      'Focus timer (basic)',
      'Mood & wellness tracking',
      '7-day analytics history',
      'PWA — works offline',
    ],
    cta: 'Get Started Free',
  },
  {
    name: 'Pro',
    price: '$8',
    period: '/mo (billed yearly)',
    description: 'Unlimited power with AI coaching to achieve your biggest goals',
    icon: Crown,
    color: 'from-ascend-500 to-gold-400',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Unlimited habits & goals',
      'AI Goal Decomposition engine',
      'Adaptive AI coaching & smart nudges',
      'Advanced analytics & long-range trends',
      'Contribution heatmap',
      'Weekly AI review wizard',
      'Habit stacking builder',
      'Identity-based habit system',
      'Custom habit templates',
      'Data export (CSV & PDF)',
      'Priority email support',
      'Priority roadmap voting',
    ],
    cta: 'Start Pro — $8/mo',
  },
  {
    name: 'Lifetime',
    price: '$199',
    period: 'one-time',
    description: 'Pay once, own RESURGO forever — limited founder pricing',
    icon: Star,
    color: 'from-gold-400 to-orange-500',
    highlight: false,
    badge: 'Founder Deal',
    features: [
      'Everything in Pro — forever',
      'Lifetime updates included',
      'No recurring charges, ever',
      'Founder badge & early feature channel',
      'Priority concierge onboarding',
      'Exclusive founder community access',
    ],
    cta: 'Get Lifetime Access',
  },
];

const comparisonFeatures = [
  { name: 'Active Habits', free: '10', pro: 'Unlimited' },
  { name: 'Active Goals', free: '3', pro: 'Unlimited' },
  { name: 'AI-Powered Insights', free: '✓', pro: '✓' },
  { name: 'AI Goal Decomposition', free: '—', pro: '✓' },
  { name: 'Adaptive AI Coaching', free: '—', pro: '✓' },
  { name: 'Streak Tracking', free: '✓', pro: '✓' },
  { name: 'Calendar View', free: '✓', pro: '✓' },
  { name: 'Focus Timer', free: 'Basic', pro: 'Advanced' },
  { name: 'Mood & Wellness Tracking', free: '✓', pro: '✓' },
  { name: 'Analytics History', free: '7 days', pro: 'Unlimited' },
  { name: 'Contribution Heatmap', free: '—', pro: '✓' },
  { name: 'Weekly AI Review', free: '—', pro: '✓' },
  { name: 'Habit Stacking', free: '—', pro: '✓' },
  { name: 'Identity-Based System', free: '—', pro: '✓' },
  { name: 'Custom Templates', free: '—', pro: '✓' },
  { name: 'Data Export', free: '—', pro: 'CSV & PDF' },
  { name: 'Offline Support (PWA)', free: '✓', pro: '✓' },
  { name: 'Priority Support', free: '—', pro: '✓' },
];

// JSON-LD Structured Data for pricing
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'RESURGO Pricing',
  description: 'Pricing plans for RESURGO AI-powered habit tracker',
  mainEntity: {
    '@type': 'SoftwareApplication',
    name: 'RESURGO',
    applicationCategory: 'LifestyleApplication',
    offers: plans.map((plan) => ({
      '@type': 'Offer',
      name: `${plan.name} Plan`,
      price: plan.price.replace('$', ''),
      priceCurrency: 'USD',
      description: plan.description,
    })),
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* -- HEADER -- */}
      <header className="border-b border-zinc-900 bg-black">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-zinc-400 transition hover:text-zinc-400">
            <ArrowLeft className="h-3 w-3" /> [HOME]
            <span className="ml-2 font-mono text-[10px] text-orange-600">RESURGO</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">

        {/* -- HEADING -- */}
        <div className="mb-16 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">PRICING_TIER :: ACCESS_LEVELS</span>
          </div>
          <h1 className="font-mono text-4xl font-black tracking-tight text-zinc-100 sm:text-5xl">
            ACCESS_<span className="text-orange-500">TIERS</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-zinc-400">
            START_FREE. UPGRADE_WHEN_READY. NO_CREDIT_CARD_REQUIRED.
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[10px] text-zinc-400">
            <Shield className="h-3 w-3" />
            30_DAY_MONEY_BACK_GUARANTEE
          </div>
        </div>

        {/* -- PLAN CARDS -- */}
        <div className="mb-24 grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative border bg-zinc-950 ${
                plan.highlight ? 'border-orange-800' : 'border-zinc-900'
              }`}
            >
              {(plan as { badge?: string }).badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 border border-orange-800 bg-black px-3 py-0.5 font-mono text-[9px] tracking-widest text-orange-500">
                  {(plan as { badge?: string }).badge?.toUpperCase()}
                </div>
              )}

              <div className="border-b border-zinc-900 px-5 py-4">
                <p className="font-mono text-[9px] tracking-widest text-zinc-400">{plan.name.toUpperCase()}_TIER</p>
                <p className="mt-1 font-mono text-xs text-zinc-400">{plan.description}</p>
              </div>

              <div className="border-b border-zinc-900 px-5 py-4">
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-black text-zinc-100">{plan.price}</span>
                  <span className="font-mono text-xs text-zinc-400">{plan.period}</span>
                </div>
              </div>

              <div className="px-5 py-4">
                <Link
                  href="/sign-up"
                  className={`mb-5 block w-full border py-2.5 text-center font-mono text-[10px] tracking-widest transition ${
                    plan.highlight
                      ? 'border-orange-800 bg-orange-950/30 text-orange-500 hover:bg-orange-950/50'
                      : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                  }`}
                >
                  [{plan.cta.toUpperCase().replace(/ /g, '_')}]
                </Link>
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 font-mono text-[10px] text-zinc-400">
                      <Check className={`mt-0.5 h-3 w-3 shrink-0 ${plan.highlight ? 'text-orange-600' : 'text-green-700'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* -- FEATURE COMPARISON TABLE -- */}
        <div className="mb-24">
          <div className="mb-8 text-center">
            <h2 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">FEATURE_COMPARISON</h2>
          </div>
          <div className="overflow-x-auto border border-zinc-900">
            <table className="w-full font-mono text-xs" role="table">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-950">
                  <th className="px-4 py-3 text-left tracking-widest text-zinc-400">FEATURE</th>
                  <th className="px-4 py-3 text-center tracking-widest text-zinc-400">FREE</th>
                  <th className="px-4 py-3 text-center tracking-widest text-orange-600">PRO</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr key={row.name} className={`border-b border-zinc-900 ${
                    i % 2 === 0 ? 'bg-black' : 'bg-zinc-950'
                  }`}>
                    <td className="px-4 py-2.5 text-zinc-500">{row.name}</td>
                    <td className="px-4 py-2.5 text-center text-zinc-400">{row.free}</td>
                    <td className="px-4 py-2.5 text-center text-zinc-400">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* -- FAQ -- */}
        <div className="mx-auto mb-16 max-w-3xl">
          <h2 className="mb-8 text-center font-mono text-2xl font-bold tracking-tight text-zinc-100">FAQ</h2>
          <div className="space-y-px">
            {[
              { q: 'Can I try Pro for free?', a: 'Yes! Start with our generous free plan. Upgrade to Pro when you need unlimited power.' },
              { q: 'What happens if I downgrade?', a: 'You keep Pro access until the end of your paid period. Then you move to Free with all your data intact.' },
              { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel from the billing page. No questions asked.' },
              { q: 'Is the lifetime plan really forever?', a: 'Yes. One payment, lifetime access including all future updates.' },
              { q: 'Do you offer student discounts?', a: 'Yes � students get 50% off Pro. Contact support@resurgo.life with your student email.' },
            ].map((faq) => (
              <details key={faq.q} className="group border border-zinc-900 bg-zinc-950">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-mono text-xs tracking-wider text-zinc-400 transition hover:text-zinc-200">
                  {faq.q}
                  <span className="ml-4 text-zinc-400 transition group-open:rotate-180">&#9660;</span>
                </summary>
                <p className="border-t border-zinc-900 px-4 py-3 font-mono text-[10px] text-zinc-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* -- CTA -- */}
        <div className="border border-zinc-900 bg-zinc-950 p-8 text-center">
          <h2 className="mb-2 font-mono text-xl font-bold tracking-tight text-zinc-100">READY_TO_EXECUTE?</h2>
          <p className="mb-6 font-mono text-xs text-zinc-400">JOIN 50,000+ OPERATORS BUILDING BETTER HABITS.</p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 border border-orange-800 bg-orange-950/30 px-8 py-3 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/50"
          >
            [START_FREE_NOW]
          </Link>
        </div>

      </main>
    </div>
  );
}

