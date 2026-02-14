// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND - Payment Success Page
// Shows confirmation after successful payment
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAscendStore } from '@/lib/store';
import { CheckCircle, Sparkles, Crown, ArrowRight } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { upgradePlan, addToast, addXP } = useAscendStore();

  const plan = searchParams.get('plan') as 'pro' | 'lifetime' | null;
  const txnid = searchParams.get('txnid');

  useEffect(() => {
    if (plan) {
      // Update user's plan in the store
      upgradePlan(plan);
      
      // Award bonus XP for upgrading
      addXP(500, `Upgraded to ${plan === 'lifetime' ? 'Lifetime' : 'Pro'} plan!`);
      
      addToast({
        type: 'success',
        title: '🎉 Payment Successful!',
        message: `Welcome to ASCEND ${plan === 'lifetime' ? 'Lifetime' : 'Pro'}!`,
        duration: 5000,
      });
    }
  }, [plan, upgradePlan, addXP, addToast]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ascend-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-400/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-md text-center">
        {/* Success Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 
                        flex items-center justify-center shadow-glow-lg animate-bounce-slow">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gold-400 
                        flex items-center justify-center animate-spin-slow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-themed mb-3">Payment Successful!</h1>
        <p className="text-themed-muted mb-8">
          Welcome to ASCEND {plan === 'lifetime' ? 'Lifetime' : 'Pro'}! You now have access to all premium features.
        </p>

        {/* Plan Card */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-gold-400" />
            <span className="text-xl font-bold text-themed">
              {plan === 'lifetime' ? 'Lifetime Access' : 'Pro Member'}
            </span>
          </div>

          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2 text-themed-secondary">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Unlimited habits & goals</span>
            </div>
            <div className="flex items-center gap-2 text-themed-secondary">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>AI-powered coaching & insights</span>
            </div>
            <div className="flex items-center gap-2 text-themed-secondary">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Advanced analytics & reports</span>
            </div>
            <div className="flex items-center gap-2 text-themed-secondary">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Habit stacking & templates</span>
            </div>
            <div className="flex items-center gap-2 text-themed-secondary">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Data export & backup</span>
            </div>
          </div>

          {txnid && (
            <p className="text-xs text-themed-muted mt-4 pt-4 border-t border-[var(--border)]">
              Transaction ID: {txnid}
            </p>
          )}
        </div>

        {/* Bonus XP */}
        <div className="p-4 bg-gold-400/10 border border-gold-400/20 rounded-xl mb-8">
          <p className="text-gold-400 font-semibold">
            🎁 Bonus: +500 XP added to your account!
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push('/')}
          className="w-full py-4 bg-gradient-to-r from-ascend-500 to-ascend-600 text-white rounded-xl 
                   font-semibold flex items-center justify-center gap-2 shadow-glow-md hover:shadow-glow-lg transition-all"
        >
          Start Your Premium Journey
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-themed">Loading...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
