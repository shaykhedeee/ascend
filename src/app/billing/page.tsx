import { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Billing & Subscription',
  description: 'Manage your ASCEND subscription, upgrade to Pro, or get lifetime access.',
  robots: { index: false, follow: false },
};

export default async function BillingPage() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;

  return (
    <main className="min-h-screen px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Choose your ASCEND plan</h1>
        <p className="text-[var(--text-secondary)] mb-10">
          Upgrade anytime and manage your subscription.
        </p>

        {!user ? (
          <div className="glass-card p-6 text-center space-y-4">
            <p className="text-[var(--text-secondary)]">Sign in to view and manage your plan.</p>
            <Link
              href="/login"
              className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-ascend-500 to-gold-400 text-white font-semibold"
            >
              Sign in to continue
            </Link>
          </div>
        ) : (
          <div className="glass-card p-4 sm:p-6">
            <p className="text-[var(--text-secondary)]">
              Billing management coming soon. You are signed in as {user.emailAddresses?.[0]?.emailAddress}.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
