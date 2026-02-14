'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// VANTAGE — Dashboard Layout (Protected)
// All routes under /(dashboard)/ require authentication
// Handles user sync, onboarding redirect, and shell UI
// ═══════════════════════════════════════════════════════════════════════════════

import { useStoreUser } from '@/hooks/useStoreUser';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useStoreUser();
  const router = useRouter();

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!isLoading && user && !user.onboardingComplete) {
      // For now, auto-complete onboarding. 
      // Replace with router.push('/onboarding') when onboarding page is ready.
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ascend-500 border-t-transparent" />
          <p className="text-sm text-[var(--text-secondary)]">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-[var(--text-secondary)]">Redirecting to sign in...</p>
      </div>
    );
  }

  return <>{children}</>;
}
