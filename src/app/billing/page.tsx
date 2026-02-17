import { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { BILLING_PLANS } from '@/lib/billing/plans';

export const metadata: Metadata = {
  title: 'Billing & Subscription',
  description: 'Manage your Ascendify subscription, upgrade to Pro, or get lifetime access.',
  robots: { index: false, follow: false },
};

export default async function BillingPage() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const manageUrl = process.env.NEXT_PUBLIC_CLERK_BILLING_PORTAL_URL || '';

  const plans = BILLING_PLANS.map((plan) => {
    const checkoutUrl = plan.clerkCheckoutUrlEnv
      ? process.env[plan.clerkCheckoutUrlEnv]
      : null;

    return {
      ...plan,
      checkoutUrl,
    };
  });

  return (
    <main className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Choose your Ascendify plan</h1>
        <p className="text-[var(--text-secondary)] mb-10">
          Upgrade anytime and manage your subscription.
        </p>

        {!user ? (
          <div className="glass-card p-6 text-center space-y-4">
            <p className="text-[var(--text-secondary)]">Sign in to view and manage your plan.</p>
            <Link
              href="/sign-in"
              className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-ascend-500 to-gold-400 text-white font-semibold"
            >
              Sign in to continue
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="glass-card p-4 sm:p-6">
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Account</p>
                <p className="text-sm text-[var(--text-secondary)]">{user.emailAddresses?.[0]?.emailAddress}</p>
              </div>

              <div className="glass-card p-4 sm:p-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Subscription</p>
                  <p className="text-sm text-[var(--text-secondary)]">Manage payment method, invoices, and cancellations.</p>
                </div>
                {manageUrl ? (
                  <a
                    href={manageUrl}
                    className="shrink-0 inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-hover)]"
                  >
                    Manage
                  </a>
                ) : (
                  <span className="text-xs text-amber-400">Set NEXT_PUBLIC_CLERK_BILLING_PORTAL_URL</span>
                )}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-4">
              {plans.map((plan) => (
                <article
                  key={plan.key}
                  className={`glass-card p-5 flex flex-col ${plan.highlighted ? 'ring-2 ring-ascend-500/50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h2 className="text-lg font-bold">{plan.title}</h2>
                    {plan.badge ? (
                      <span className="text-xs rounded-full px-2 py-1 bg-ascend-500/20 text-ascend-400">
                        {plan.badge}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] mb-4">{plan.description}</p>

                  <div className="mb-4">
                    <p className="text-2xl font-extrabold">
                      ${plan.priceUsd}
                      {plan.cadence === 'monthly' ? <span className="text-sm font-medium text-[var(--text-muted)]">/mo</span> : null}
                      {plan.cadence === 'yearly' ? <span className="text-sm font-medium text-[var(--text-muted)]">/yr</span> : null}
                    </p>
                    {plan.key === 'pro_yearly' ? (
                      <p className="text-xs text-emerald-400">Save 33% vs monthly</p>
                    ) : null}
                  </div>

                  <ul className="space-y-2 text-sm text-[var(--text-secondary)] mb-6 flex-1">
                    {plan.featureBullets.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>

                  {plan.key === 'free' ? (
                    <button
                      className="w-full rounded-xl px-4 py-2 font-semibold border border-[var(--border)] bg-[var(--surface)] cursor-default"
                      disabled
                    >
                      {plan.ctaLabel}
                    </button>
                  ) : plan.checkoutUrl ? (
                    <a
                      href={plan.checkoutUrl}
                      className="w-full text-center rounded-xl px-4 py-2 font-semibold bg-gradient-to-r from-ascend-500 to-ascend-600 text-white hover:opacity-95"
                    >
                      {plan.ctaLabel}
                    </a>
                  ) : (
                    <button
                      className="w-full rounded-xl px-4 py-2 font-semibold border border-amber-500/40 text-amber-400"
                      disabled
                    >
                      Set {plan.clerkCheckoutUrlEnv}
                    </button>
                  )}
                </article>
              ))}
            </div>

            <div className="mt-8 glass-card p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-2">Clerk Billing setup checklist</h3>
              <ol className="list-decimal pl-5 space-y-1 text-sm text-[var(--text-secondary)]">
                <li>Create products/prices in Clerk Billing for Pro Monthly, Pro Yearly, and Lifetime.</li>
                <li>Paste hosted links into env vars used on this page.</li>
                <li>Configure webhook endpoint: <code>/api/webhooks/clerk-billing</code>.</li>
                <li>Set <code>CLERK_WEBHOOK_SECRET</code> and <code>BILLING_WEBHOOK_SYNC_SECRET</code>.</li>
              </ol>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
