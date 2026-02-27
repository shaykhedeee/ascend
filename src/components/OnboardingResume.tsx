// Subtle banner + modal to resume onboarding without forcing a redirect

'use client';

import { useState } from 'react';
import { DeepOnboarding } from '@/components/DeepOnboarding';
import { useAscendStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

interface Props {
  onboardingComplete?: boolean;
}

export function OnboardingResume({ onboardingComplete }: Props) {
  const [visible, setVisible] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const { completeOnboarding, logout } = useAscendStore();

  if (onboardingComplete) return null;

  return (
    <div className="mb-4 px-4 md:px-6">
      {visible && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Finish personalization</p>
            <p className="text-xs text-[var(--text-secondary)]">Complete a quick setup so Resurgo can tailor your goals and habits.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenModal(true)}
              className="px-3 py-1.5 rounded-lg bg-ascend-500 text-white text-sm font-medium"
            >
              Resume
            </button>
            <button
              onClick={() => setVisible(false)}
              className="px-3 py-1.5 rounded-lg bg-[var(--surface-hover)] text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenModal(false)} />
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-auto">
            <DeepOnboarding
              onComplete={(profile) => {
                try { completeOnboarding(); } catch (e) {}
                setOpenModal(false);
                // Optionally navigate to dashboard root
                router.push('/dashboard');
              }}
              onSkip={() => {
                setOpenModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
