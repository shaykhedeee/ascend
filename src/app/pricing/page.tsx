// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND - Pricing Page (SEO-Optimized)
// ═══════════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import Link from 'next/link';
import { Mountain, ArrowLeft, Check, Zap, Star, Shield, Crown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing — Free & Pro Plans',
  description:
    'ASCEND pricing plans: Free habit tracker with 5 habits, or Pro with unlimited AI goal decomposition, advanced analytics, and priority support. No credit card required.',
  keywords: [
    'habit tracker pricing', 'free habit tracker', 'habit tracker no ads',
    'best free goal tracker', 'productivity app pricing',
  ],
  openGraph: {
    title: 'ASCEND Pricing — Free & Pro Plans',
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
    description: 'Perfect for getting started with habit tracking',
    icon: Zap,
    color: 'from-slate-400 to-slate-500',
    highlight: false,
    features: [
      'Up to 5 active habits',
      'Basic habit analytics',
      'Streak tracking',
      'Daily task management',
      'Dark & light themes',
      'PWA — works offline',
      'Data export (JSON)',
    ],
    cta: 'Get Started Free',
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'Everything you need to achieve your biggest goals',
    icon: Crown,
    color: 'from-ascend-500 to-gold-400',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Unlimited habits & goals',
      'AI Goal Decomposition',
      'Advanced analytics & insights',
      'Contribution heatmap',
      'Weekly review wizard',
      'CSV & PDF export',
      'Habit stacking builder',
      'Identity-based tracking',
      'Smart Coach AI messages',
      'Priority support',
      'Streak freeze tokens',
      'Custom habit templates',
    ],
    cta: 'Start 14-Day Free Trial',
  },
  {
    name: 'Lifetime',
    price: '$149',
    period: 'one-time',
    description: 'Pay once and own ASCEND forever',
    icon: Star,
    color: 'from-gold-400 to-orange-500',
    highlight: false,
    features: [
      'Everything in Pro',
      'Lifetime updates included',
      'Early access to new features',
      'Founding member badge',
      'Community access',
      'No recurring charges ever',
    ],
    cta: 'Get Lifetime Access',
  },
];

const comparisonFeatures = [
  { name: 'Active Habits', free: '5', pro: 'Unlimited' },
  { name: 'Goals', free: '1', pro: 'Unlimited' },
  { name: 'AI Goal Decomposition', free: '—', pro: '✓' },
  { name: 'Streak Tracking', free: '✓', pro: '✓' },
  { name: 'Basic Analytics', free: '✓', pro: '✓' },
  { name: 'Advanced Analytics', free: '—', pro: '✓' },
  { name: 'Contribution Heatmap', free: '—', pro: '✓' },
  { name: 'Weekly Review', free: '—', pro: '✓' },
  { name: 'Habit Stacking', free: '—', pro: '✓' },
  { name: 'Smart Coach', free: '—', pro: '✓' },
  { name: 'CSV & PDF Export', free: 'JSON only', pro: '✓' },
  { name: 'Custom Templates', free: '—', pro: '✓' },
  { name: 'Streak Freeze', free: '—', pro: '✓' },
  { name: 'Identity System', free: '—', pro: '✓' },
  { name: 'Offline Support', free: '✓', pro: '✓' },
  { name: 'Priority Support', free: '—', pro: '✓' },
];

// JSON-LD Structured Data for pricing
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'ASCEND Pricing',
  description: 'Pricing plans for ASCEND AI-powered habit tracker',
  mainEntity: {
    '@type': 'SoftwareApplication',
    name: 'ASCEND',
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
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
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
            <span className="font-bold text-lg">ASCEND</span>
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
                  href="/login"
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
              { q: 'Can I try Pro for free?', a: 'Yes! Every Pro plan comes with a 14-day free trial. No credit card needed to start.' },
              { q: 'What happens when my trial ends?', a: 'You\'ll be moved to the Free plan with all your data intact. Upgrade anytime to regain Pro features.' },
              { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel your subscription anytime from the billing page. No questions asked.' },
              { q: 'Is the lifetime plan really forever?', a: 'Yes. One payment, lifetime access. You\'ll receive all future updates at no additional cost.' },
              { q: 'Do you offer student discounts?', a: 'Yes! Students get 50% off the Pro plan. Contact support@ascend.app with your student email.' },
            ].map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <summary className="cursor-pointer py-4 px-5 font-medium flex justify-between items-center list-none">
                  {faq.q}
                  <span className="text-[var(--text-muted)] group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="px-5 pb-4 text-sm text-[var(--text-secondary)]">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to achieve your goals?</h2>
          <p className="text-[var(--text-secondary)] mb-6">Join 50,000+ people building better habits with ASCEND.</p>
          <Link
            href="/login"
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
