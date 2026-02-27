// =============================================================================
// RESURGO - Root Page
// Public landing page — all navigation via native <Link> tags.
// force-dynamic prevents Next.js from statically caching this page.
// =============================================================================

export const dynamic = 'force-dynamic';

import { LandingPageV2 as LandingPage } from '@/components/LandingPageV2';

export default function Home() {
  // Show the marketing landing page for everyone on root.
  // Protected app routes (e.g. /dashboard) remain enforced by middleware.
  // All CTAs use native <Link href> — no router.push needed.
  return <LandingPage />;
}
