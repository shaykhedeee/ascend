// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// RESURGOIFY - Pricing Page (SEO-Optimized)
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

import { Metadata } from 'next';
import Link from 'next/link';
import { Mountain, ArrowLeft, Check, Zap, Star, Shield, Crown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing â€” Free & Pro Plans',
  description:
    'RESURGO pricing plans: Free habit tracker with 10 habits & AI insights, or Pro with unlimited AI goal decomposition, advanced analytics, and priority support. No credit card required.',
  keywords: [
    'habit tracker pricing', 'free habit tracker', 'habit tracker no ads',
    'best free goal tracker', 'productivity app pricing',
  ],
  openGraph: {
    title: 'RESURGO Pricing â€” Free & Pro Plans',
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
      'PWA â€” works offline',
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
    cta: 'Start Pro â€” $8/mo',
  },
  {
    name: 'Lifetime',
    price: '$199',
    period: 'one-time',
    description: 'Pay once, own RESURGO forever â€” limited founder pricing',
    icon: Star,
    color: 'from-gold-400 to-orange-500',
    highlight: false,
    badge: 'Founder Deal',
    features: [
      'Everything in Pro â€” forever',
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
  { name: 'AI-Powered Insights', free: 'âœ“', pro: 'âœ“' },
  { name: 'AI Goal Decomposition', free: 'â€”', pro: 'âœ“' },
  { name: 'Adaptive AI Coaching', free: 'â€”', pro: 'âœ“' },
  { name: 'Streak Tracking', free: 'âœ“', pro: 'âœ“' },
  { name: 'Calendar View', free: 'âœ“', pro: 'âœ“' },
  { name: 'Focus Timer', free: 'Basic', pro: 'Advanced' },
  { name: 'Mood & Wellness Tracking', free: 'âœ“', pro: 'âœ“' },
  { name: 'Analytics History', free: '7 days', pro: 'Unlimited' },
  { name: 'Contribution Heatmap', free: 'â€”', pro: 'âœ“' },
  { name: 'Weekly AI Review', free: 'â€”', pro: 'âœ“' },
  { name: 'Habit Stacking', free: 'â€”', pro: 'âœ“' },
  { name: 'Identity-Based System', free: 'â€”', pro: 'âœ“' },
  { name: 'Custom Templates', free: 'â€”', pro: 'âœ“' },
  { name: 'Data Export', free: 'â€”', pro: 'CSV & PDF' },
  { name: 'Offline Support (PWA)', free: 'âœ“', pro: 'âœ“' },
  { name: 'Priority Support', free: 'â€”', pro: 'âœ“' },
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

      {/* ── HEADER ── */}
      <header className="border-b border-zinc-900 bg-black">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-zinc-600 transition hover:text-zinc-400">
            <ArrowLeft className="h-3 w-3" /> [HOME]
            <span className="ml-2 font-mono text-[10px] text-orange-600">RESURGO</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">

        {/* ── HEADING ── */}
        <div className="mb-16 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">PRICING_TIER :: ACCESS_LEVELS</span>
          </div>
          <h1 className="font-mono text-4xl font-black tracking-tight text-zinc-100 sm:text-5xl">
            ACCESS_<span className="text-orange-500">TIERS</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-zinc-600">
            START_FREE. UPGRADE_WHEN_READY. NO_CREDIT_CARD_REQUIRED.
          </p>
          <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[10px] text-zinc-700">
            <Shield className="h-3 w-3" />
            30_DAY_MONEY_BACK_GUARANTEE
          </div>
        </div>

        {/* ── PLAN CARDS ── */}
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
                <p className="font-mono text-[9px] tracking-widest text-zinc-700">{plan.name.toUpperCase()}_TIER</p>
                <p className="mt-1 font-mono text-xs text-zinc-600">{plan.description}</p>
              </div>

              <div className="border-b border-zinc-900 px-5 py-4">
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-black text-zinc-100">{plan.price}</span>
                  <span className="font-mono text-xs text-zinc-700">{plan.period}</span>
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
                    <li key={feature} className="flex items-start gap-2 font-mono text-[10px] text-zinc-600">
                      <Check className={`mt-0.5 h-3 w-3 shrink-0 ${plan.highlight ? 'text-orange-600' : 'text-green-700'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* ── FEATURE COMPARISON TABLE ── */}
        <div className="mb-24">
          <div className="mb-8 text-center">
            <h2 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">FEATURE_COMPARISON</h2>
          </div>
          <div className="overflow-x-auto border border-zinc-900">
            <table className="w-full font-mono text-xs" role="table">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-950">
                  <th className="px-4 py-3 text-left tracking-widest text-zinc-600">FEATURE</th>
                  <th className="px-4 py-3 text-center tracking-widest text-zinc-600">FREE</th>
                  <th className="px-4 py-3 text-center tracking-widest text-orange-600">PRO</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr key={row.name} className={`border-b border-zinc-900 ${
                    i % 2 === 0 ? 'bg-black' : 'bg-zinc-950'
                  }`}>
                    <td className="px-4 py-2.5 text-zinc-500">{row.name}</td>
                    <td className="px-4 py-2.5 text-center text-zinc-700">{row.free}</td>
                    <td className="px-4 py-2.5 text-center text-zinc-400">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="mx-auto mb-16 max-w-3xl">
          <h2 className="mb-8 text-center font-mono text-2xl font-bold tracking-tight text-zinc-100">FAQ</h2>
          <div className="space-y-px">
            {[
              { q: 'Can I try Pro for free?', a: 'Yes! Start with our generous free plan. Upgrade to Pro when you need unlimited power.' },
              { q: 'What happens if I downgrade?', a: 'You keep Pro access until the end of your paid period. Then you move to Free with all your data intact.' },
              { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel from the billing page. No questions asked.' },
              { q: 'Is the lifetime plan really forever?', a: 'Yes. One payment, lifetime access including all future updates.' },
              { q: 'Do you offer student discounts?', a: 'Yes — students get 50% off Pro. Contact support@resurgo.life with your student email.' },
            ].map((faq) => (
              <details key={faq.q} className="group border border-zinc-900 bg-zinc-950">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-mono text-xs tracking-wider text-zinc-400 transition hover:text-zinc-200">
                  {faq.q}
                  <span className="ml-4 text-zinc-700 transition group-open:rotate-180">&#9660;</span>
                </summary>
                <p className="border-t border-zinc-900 px-4 py-3 font-mono text-[10px] text-zinc-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="border border-zinc-900 bg-zinc-950 p-8 text-center">
          <h2 className="mb-2 font-mono text-xl font-bold tracking-tight text-zinc-100">READY_TO_EXECUTE?</h2>
          <p className="mb-6 font-mono text-xs text-zinc-600">JOIN 50,000+ OPERATORS BUILDING BETTER HABITS.</p>
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
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ascend-500 to-ascend-600 flex items-center justify-center">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">RESURGO</span>
            <span className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Page Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple, Transparent <span className="bg-gradient-to-r from-ascend-400 to-gold-400 bg-clip-text text-transparent">Pricing</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Start free and upgrade when you&apos;re ready. No credit card required.
            Cancel anytime.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-[var(--text-muted)]">
            <Shield className="w-4 h-4" />
            <span>30-day money back guarantee on all paid plans</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-24">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 sm:p-8 border transition-all 
                  ${plan.highlight
                    ? 'border-ascend-500 bg-gradient-to-b from-ascend-500/5 to-transparent shadow-xl shadow-ascend-500/10 scale-[1.02]'
                    : 'border-[var(--border)] bg-[var(--surface)]'
                  }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-ascend-500 to-gold-400 text-white text-xs font-bold uppercase tracking-wider">
                    {(plan as { badge?: string }).badge}
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                <p className="text-sm text-[var(--text-muted)] mb-4">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-[var(--text-muted)]">{plan.period}</span>
                </div>

                <Link
                  href="/sign-up"
                  className={`block w-full text-center py-3 rounded-xl font-semibold transition-all mb-8
                    ${plan.highlight
                      ? 'bg-gradient-to-r from-ascend-500 to-ascend-600 text-white hover:shadow-lg hover:shadow-ascend-500/25'
                      : 'bg-[var(--surface-hover)] hover:bg-[var(--border)] text-[var(--text-primary)]'
                    }`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? 'text-ascend-400' : 'text-green-400'}`} />
                      <span className="text-[var(--text-secondary)]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                  <th className="text-left py-4 px-5 font-semibold">Feature</th>
                  <th className="text-center py-4 px-5 font-semibold">Free</th>
                  <th className="text-center py-4 px-5 font-semibold text-ascend-400">Pro</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr key={row.name} className={`border-b border-[var(--border)] ${i % 2 === 0 ? '' : 'bg-[var(--surface)]/50'}`}>
                    <td className="py-3 px-5 text-[var(--text-secondary)]">{row.name}</td>
                    <td className="py-3 px-5 text-center">{row.free}</td>
                    <td className="py-3 px-5 text-center font-medium">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Mini Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Pricing FAQ</h2>
          <div className="space-y-4">
            {[
              { q: 'Can I try Pro for free?', a: 'Yes! Start with our generous free plan including 10 habits, 3 goals, and AI insights. Upgrade to Pro when you need unlimited power.' },
              { q: 'What happens if I downgrade?', a: 'You keep Pro access until the end of your paid period. Then you move to Free with all your data intact â€” nothing is deleted.' },
              { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel your subscription anytime from the billing page. No questions asked.' },
              { q: 'Is the lifetime plan really forever?', a: 'Yes. One payment, lifetime access. You\'ll receive all future updates at no additional cost.' },
              { q: 'Do you offer student discounts?', a: 'Yes! Students get 50% off the Pro plan. Contact support@resurgo.life with your student email.' },
            ].map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <summary className="cursor-pointer py-4 px-5 font-medium flex justify-between items-center list-none">
                  {faq.q}
                  <span className="text-[var(--text-muted)] group-open:rotate-180 transition-transform">â–¾</span>
                </summary>
                <p className="px-5 pb-4 text-sm text-[var(--text-secondary)]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to achieve your goals?</h2>
          <p className="text-[var(--text-secondary)] mb-6">Join 50,000+ people building better habits with RESURGO.</p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg
                     bg-gradient-to-r from-ascend-500 to-ascend-600 text-white shadow-xl shadow-ascend-500/25
                     hover:shadow-ascend-500/40 transition-all"
          >
            Start Building Habits Free
          </Link>
        </div>
      </main>
    </div>
  );
}
