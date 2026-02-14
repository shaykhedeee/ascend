// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND - Payment Failed Page
// Shows error message and retry options after failed payment
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const reason = searchParams.get('reason') || 'Unknown error';
  const txnid = searchParams.get('txnid');

  const getErrorMessage = (reason: string): string => {
    const errorMessages: Record<string, string> = {
      'cancelled': 'You cancelled the payment. No amount was charged.',
      'failed': 'The payment could not be processed. Please try again.',
      'timeout': 'The payment session timed out. Please try again.',
      'invalid_card': 'The card details were invalid. Please check and try again.',
      'insufficient_funds': 'Insufficient funds in your account.',
      'bank_declined': 'Your bank declined the transaction.',
      'verification_failed': 'Payment verification failed. If you were charged, please contact support.',
    };
    return errorMessages[reason.toLowerCase()] || reason;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md text-center">
        {/* Error Icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 
                      flex items-center justify-center shadow-lg">
          <XCircle className="w-12 h-12 text-white" />
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-themed mb-3">Payment Failed</h1>
        <p className="text-themed-muted mb-8">
          {getErrorMessage(reason)}
        </p>

        {/* Error Details Card */}
        <div className="glass-card p-6 mb-8 text-left">
          <h3 className="font-semibold text-themed mb-3">What happened?</h3>
          <p className="text-themed-secondary text-sm mb-4">
            Your payment could not be completed. Don&apos;t worry - if any amount was deducted, 
            it will be refunded within 5-7 business days.
          </p>

          {txnid && (
            <div className="p-3 bg-[var(--card-hover)] rounded-lg">
              <p className="text-xs text-themed-muted">
                <span className="font-medium">Reference:</span> {txnid}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/?upgrade=true')}
            className="w-full py-4 bg-gradient-to-r from-ascend-500 to-ascend-600 text-white rounded-xl 
                     font-semibold flex items-center justify-center gap-2 shadow-glow-md hover:shadow-glow-lg transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <button
            onClick={() => router.push('/')}
            className="w-full py-4 bg-[var(--card)] text-themed border border-[var(--border)] rounded-xl 
                     font-semibold flex items-center justify-center gap-2 hover:bg-[var(--card-hover)] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Dashboard
          </button>

          <button
            onClick={() => router.push('/support')}
            className="w-full py-3 text-themed-secondary flex items-center justify-center gap-2 
                     hover:text-themed transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Contact Support
          </button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-themed-muted mt-8">
          If you continue to face issues, please contact us at{' '}
          <a href="mailto:support@ascend.app" className="text-ascend-400 hover:underline">
            support@ascend.app
          </a>
        </p>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-themed">Loading...</div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
