'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND — ClerkProviderWrapper
// Wraps children with ClerkProvider only when a valid key is configured.
// Falls back to rendering children without auth during build / keyless dev.
// ═══════════════════════════════════════════════════════════════════════════════

import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasValidKey =
  publishableKey &&
  publishableKey !== 'YOUR_PUBLISHABLE_KEY' &&
  publishableKey.startsWith('pk_');

export default function ClerkProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  if (!hasValidKey) {
    // No valid Clerk key — render without auth (build-time / dev without keys)
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}
