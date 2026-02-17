// =============================================================================
// Ascendify - Root Page
// Shows landing page for unauthenticated visitors,
// redirects signed-in users to /dashboard.
// =============================================================================

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { LandingPageV2 as LandingPage } from '@/components/LandingPageV2';

export default function Home() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  // While Clerk is loading, show a minimal spinner
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#8A8580]">Loading...</p>
        </div>
      </div>
    );
  }

  // If signed in, show nothing while redirect happens
  if (isSignedIn) {
    return null;
  }

  // Show the marketing landing page for visitors
  return (
    <LandingPage
      onGetStarted={() => router.push('/sign-up')}
      onLogin={() => router.push('/sign-in')}
    />
  );
}
