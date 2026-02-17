// ═══════════════════════════════════════════════════════════════════════════════
// ASCENDIFY - Payment Checkout Component
// Beautiful checkout modal with plan selection and PayU integration
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useRef, useEffect } from 'react';
import { useAscendStore } from '@/lib/store';
import {
  X,
  Crown,
  Zap,
  Check,
  Sparkles,
  Shield,
  Infinity,
  Clock,
  Lock,
} from 'lucide-react';

interface PaymentCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: 'pro' | 'lifetime';
}

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: 'pro' | 'lifetime';
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
  features: PlanFeature[];
}

const PLANS: Plan[] = [
  {
    id: 'pro',
    name: 'Pro',
    price: 199,
    period: '/month',
    description: 'For dedicated goal achievers',
    icon: <Zap className="w-6 h-6" />,
    features: [
      { text: 'Unlimited habits & goals', included: true },
      { text: 'AI coaching & insights', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Habit stacking', included: true },
      { text: 'Data export', included: true },
      { text: 'Priority support', included: true },
      { text: 'Lifetime updates', included: false },
    ],
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: 999,
    originalPrice: 2388,
    period: 'one-time',
    description: 'Best value - Pay once, use forever',
    icon: <Infinity className="w-6 h-6" />,
    popular: true,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Lifetime access', included: true },
      { text: 'All future features', included: true },
      { text: 'Priority support forever', included: true },
      { text: 'Early access to beta features', included: true },
      { text: 'Exclusive badge & rewards', included: true },
      { text: 'No recurring charges', included: true },
    ],
  },
];

export default function PaymentCheckout({ isOpen, onClose, defaultPlan = 'lifetime' }: PaymentCheckoutProps) {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'lifetime'>(defaultPlan);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAscendStore();
  const formRef = useRef<HTMLFormElement>(null);
  
  // For PayU form submission
  const [paymentData, setPaymentData] = useState<{
    paymentUrl: string;
    formData: Record<string, string>;
  } | null>(null);

  useEffect(() => {
    setSelectedPlan(defaultPlan);
  }, [defaultPlan]);

  // Auto-submit form when payment data is ready
  useEffect(() => {
    if (paymentData && formRef.current) {
      formRef.current.submit();
    }
  }, [paymentData]);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          email: user?.email || '',
          name: user?.name || 'User',
          phone: '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate payment');
      }

      // Set payment data to trigger form submission
      setPaymentData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const plan = PLANS.find(p => p.id === selectedPlan)!;
  const savings = selectedPlan === 'lifetime' ? Math.round((1 - 999 / 2388) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto bg-[var(--card)] rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 
                          flex items-center justify-center shadow-glow-sm">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-themed">Upgrade to Premium</h2>
              <p className="text-sm text-themed-muted">Unlock your full potential</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--card-hover)] transition-colors"
          >
            <X className="w-5 h-5 text-themed-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Plan Selection */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                  selectedPlan === p.id
                    ? 'border-ascend-500 bg-ascend-500/10 shadow-glow-md'
                    : 'border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--card-hover)]'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-gold-400 to-gold-500 
                                text-white text-xs font-semibold rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Best Value
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    selectedPlan === p.id 
                      ? 'bg-ascend-500/20 text-ascend-400' 
                      : 'bg-[var(--card-hover)] text-themed-secondary'
                  }`}>
                    {p.icon}
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === p.id
                      ? 'border-ascend-500 bg-ascend-500'
                      : 'border-[var(--border)]'
                  }`}>
                    {selectedPlan === p.id && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-themed mb-1">{p.name}</h3>
                <p className="text-sm text-themed-muted mb-4">{p.description}</p>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-themed">₹{p.price}</span>
                  <span className="text-themed-muted">{p.period}</span>
                  {p.originalPrice && (
                    <span className="ml-2 text-sm line-through text-themed-muted">
                      ₹{p.originalPrice}
                    </span>
                  )}
                </div>

                <ul className="space-y-2">
                  {p.features.slice(0, 4).map((feature, i) => (
                    <li key={i} className={`flex items-center gap-2 text-sm ${
                      feature.included ? 'text-themed-secondary' : 'text-themed-muted'
                    }`}>
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <X className="w-4 h-4 text-themed-muted" />
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          {/* Selected Plan Features */}
          <div className="glass-card p-6 mb-6">
            <h3 className="font-semibold text-themed mb-4">What you&apos;ll get with {plan.name}:</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-themed-secondary">
                  <Check className="w-4 h-4 text-green-400 shrink-0" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Savings Banner */}
          {selectedPlan === 'lifetime' && (
            <div className="p-4 mb-6 bg-gradient-to-r from-gold-400/20 to-gold-500/20 
                          border border-gold-400/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gold-400/20">
                    <Clock className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gold-400">Save {savings}% with Lifetime!</p>
                    <p className="text-sm text-themed-muted">That&apos;s ₹{2388 - 999} in savings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gold-400">₹999</p>
                  <p className="text-sm line-through text-themed-muted">₹2,388/year</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              {error}
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 bg-gradient-to-r from-ascend-500 to-ascend-600 text-white rounded-xl 
                     font-bold text-lg flex items-center justify-center gap-2 shadow-glow-md 
                     hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Pay ₹{plan.price} {plan.period !== 'one-time' && plan.period}
              </>
            )}
          </button>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 mt-6 text-themed-muted text-sm">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Secure Payment
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-4 h-4" />
              256-bit SSL
            </div>
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4" />
              Money-back guarantee
            </div>
          </div>

          {/* Payment Partners */}
          <p className="text-center text-xs text-themed-muted mt-4">
            Powered by PayU • UPI • Cards • Net Banking • Wallets
          </p>
        </div>
      </div>

      {/* Hidden PayU Form */}
      {paymentData && (
        <form
          ref={formRef}
          action={paymentData.paymentUrl}
          method="POST"
          className="hidden"
        >
          {Object.entries(paymentData.formData).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}
    </div>
  );
}
