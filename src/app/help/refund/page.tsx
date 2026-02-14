import { Metadata } from 'next';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════════
// SEO METADATA
// ═══════════════════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: 'Refund Policy - ASCEND',
  description: 'ASCEND refund policy. We offer a 14-day money-back guarantee for Pro subscriptions and 30-day guarantee for Lifetime purchases.',
  openGraph: {
    title: 'Refund Policy - ASCEND',
    description: 'Our hassle-free refund policy for Pro and Lifetime plans.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="py-12 px-4 border-b border-white/10">
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-[var(--text-muted)] mb-4">
            <Link href="/help" className="hover:text-[var(--accent)]">Help Center</Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--text-secondary)]">Refund Policy</span>
          </nav>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-2">
            Refund Policy
          </h1>
          <p className="text-[var(--text-secondary)]">
            Last updated: February 2026
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-invert max-w-none space-y-8">
          
          {/* Intro */}
          <section className="glass-card p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
            <div className="flex items-start gap-4">
              <span className="text-3xl">💰</span>
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-0 mb-2">
                  Our Promise
                </h2>
                <p className="text-[var(--text-secondary)] mb-0">
                  We want you to be 100% satisfied with ASCEND. If it&apos;s not working for you, 
                  we&apos;ll give you a full refund - no questions asked.
                </p>
              </div>
            </div>
          </section>

          {/* Pro Subscription */}
          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
              <span className="text-2xl">⭐</span> Pro Subscription
            </h2>
            <div className="glass-card p-6 mt-4">
              <h3 className="text-lg font-semibold text-[var(--accent)] mb-3">
                14-Day Money-Back Guarantee
              </h3>
              <p className="text-[var(--text-secondary)] mb-4">
                If you&apos;re not satisfied with Pro for any reason, request a refund within 
                14 days of your initial purchase and we&apos;ll refund your full payment.
              </p>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Full refund within 14 days
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> No questions asked
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Applies to both monthly and yearly plans
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Refund processed within 5-10 business days
                </li>
              </ul>
            </div>
          </section>

          {/* Lifetime Purchase */}
          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
              <span className="text-2xl">👑</span> Lifetime Purchase
            </h2>
            <div className="glass-card p-6 mt-4">
              <h3 className="text-lg font-semibold text-[var(--accent)] mb-3">
                30-Day Money-Back Guarantee
              </h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Lifetime purchases come with an extended 30-day refund window to give you 
                plenty of time to evaluate the full ASCEND experience.
              </p>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Full refund within 30 days
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> No questions asked
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> One-time exception for goodwill cases beyond 30 days
                </li>
              </ul>
            </div>
          </section>

          {/* How to Request */}
          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
              <span className="text-2xl">📝</span> How to Request a Refund
            </h2>
            <div className="glass-card p-6 mt-4">
              <ol className="space-y-4 text-[var(--text-secondary)]">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] font-semibold">1</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Contact Support</strong>
                    <p>Email us at <a href="mailto:support@ascend.app" className="text-[var(--accent)]">support@ascend.app</a> with your account email</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] font-semibold">2</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Include &quot;Refund Request&quot;</strong>
                    <p>Use this in your subject line so we can prioritize your request</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] font-semibold">3</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Receive Confirmation</strong>
                    <p>We&apos;ll confirm your refund within 24-48 hours</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] font-semibold">4</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Refund Processed</strong>
                    <p>Funds return to your original payment method in 5-10 business days</p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Exceptions */}
          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
              <span className="text-2xl">⚠️</span> Exceptions
            </h2>
            <div className="glass-card p-6 mt-4">
              <p className="text-[var(--text-secondary)] mb-4">
                While we try to be as generous as possible, the following are not eligible for refunds:
              </p>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <span className="text-red-400">✕</span> Requests made after the refund window
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400">✕</span> Repeated refund requests from the same user
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400">✕</span> Purchases made with promotional credits or gift cards
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400">✕</span> Accounts that have violated our Terms of Service
                </li>
              </ul>
            </div>
          </section>

          {/* Free Plan */}
          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
              <span className="text-2xl">🆓</span> Free Plan
            </h2>
            <div className="glass-card p-6 mt-4">
              <p className="text-[var(--text-secondary)]">
                Our Free plan is... free! There&apos;s nothing to refund. You can use the free 
                features forever with no commitment. If you&apos;re unsure about upgrading, 
                we recommend trying the free plan first.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="glass-card p-6 bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent-secondary)]/10">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mt-0 mb-2">
              Questions About Refunds?
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              We&apos;re here to help. Contact our support team and we&apos;ll get back to you within 24 hours.
            </p>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium transition-colors"
            >
              Contact Support
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </section>

        </div>
      </main>
    </div>
  );
}
