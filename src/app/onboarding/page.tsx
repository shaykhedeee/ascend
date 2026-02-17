'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// Ascendify — Onboarding Flow
// Multi-step wizard: Welcome → Life Wheel → Core Values → Vision → Coach → Done
// ═══════════════════════════════════════════════════════════════════════════════

import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStoreUser } from '@/hooks/useStoreUser';
import {
  ArrowRight,
  ArrowLeft,
  Target,
  Star,
  Compass,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

const LIFE_DOMAINS = [
  'health', 'career', 'finance', 'learning',
  'relationships', 'creativity', 'mindfulness', 'personal_growth',
] as const;

const LIFE_DOMAIN_LABELS: Record<string, string> = {
  health: '🏃 Health & Fitness',
  career: '💼 Career & Work',
  finance: '💰 Finance',
  learning: '📚 Learning',
  relationships: '❤️ Relationships',
  creativity: '🎨 Creativity',
  mindfulness: '🧘 Mindfulness',
  personal_growth: '🌱 Personal Growth',
};

const VALUE_OPTIONS = [
  'Growth', 'Integrity', 'Courage', 'Compassion', 'Creativity',
  'Discipline', 'Freedom', 'Family', 'Health', 'Wisdom',
  'Adventure', 'Balance', 'Community', 'Gratitude', 'Resilience',
  'Curiosity', 'Excellence', 'Authenticity', 'Kindness', 'Leadership',
];

const COACH_TYPES = [
  { id: 'supportive', label: 'Supportive', desc: 'Encouraging, warm, celebrates wins', icon: '🤗' },
  { id: 'challenging', label: 'Challenging', desc: 'Pushes you to do better, direct', icon: '💪' },
  { id: 'analytical', label: 'Analytical', desc: 'Data-driven, strategic, focused', icon: '📊' },
  { id: 'humorous', label: 'Humorous', desc: 'Lighthearted, fun, motivating', icon: '😄' },
] as const;

type Step = 'welcome' | 'lifeWheel' | 'values' | 'vision' | 'coach' | 'done';
const STEPS: Step[] = ['welcome', 'lifeWheel', 'values', 'vision', 'coach', 'done'];

export default function OnboardingPage() {
  const { user, isLoading } = useStoreUser();
  const router = useRouter();
  const completeOnboarding = useMutation(api.users.completeOnboarding);

  const [step, setStep] = useState<Step>('welcome');
  const [saving, setSaving] = useState(false);

  // Life Wheel
  const [lifeWheel, setLifeWheel] = useState<Record<string, number>>(
    Object.fromEntries(LIFE_DOMAINS.map((d) => [d, 5]))
  );

  // Core Values
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  // Vision
  const [vision, setVision] = useState('');

  // Coach
  const [coachType, setCoachType] = useState<'supportive' | 'challenging' | 'analytical' | 'humorous'>('supportive');

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ascend-500 border-t-transparent" />
      </div>
    );
  }

  if (user?.onboardingComplete) {
    router.push('/dashboard');
    return null;
  }

  const stepIndex = STEPS.indexOf(step);
  const progress = ((stepIndex) / (STEPS.length - 1)) * 100;

  const next = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const back = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const toggleValue = (v: string) => {
    setSelectedValues((prev) =>
      prev.includes(v)
        ? prev.filter((x) => x !== v)
        : prev.length < 5 ? [...prev, v] : prev
    );
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      await completeOnboarding({
        lifeWheelScores: lifeWheel as any,
        coreValues: selectedValues.length > 0 ? selectedValues : undefined,
        lifeVision: vision || undefined,
        coachPersonality: coachType,
      });
      setStep('done');
    } catch (e) {
      console.error('Failed to complete onboarding:', e);
    }
    setSaving(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-4">
      {/* Progress bar */}
      {step !== 'welcome' && step !== 'done' && (
        <div className="mb-8 w-full max-w-lg">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface)]">
            <div
              className="h-full rounded-full bg-ascend-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-center text-xs text-[var(--text-secondary)]">
            Step {stepIndex} of {STEPS.length - 2}
          </p>
        </div>
      )}

      <div className="w-full max-w-lg">
        {/* ════════ WELCOME ════════ */}
        {step === 'welcome' && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-ascend-500/20">
              <Sparkles className="h-10 w-10 text-ascend-400" />
            </div>
            <h1 className="mb-3 text-3xl font-bold text-[var(--text-primary)]">
              Welcome to Ascendify
            </h1>
            <p className="mb-8 text-[var(--text-secondary)]">
              Let&apos;s set up your personal growth journey. This takes about 2 minutes and helps us personalize your experience.
            </p>
            <button
              onClick={next}
              className="flex mx-auto items-center gap-2 rounded-lg bg-ascend-500 px-8 py-3 text-sm font-medium text-white hover:bg-ascend-600"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ════════ LIFE WHEEL ════════ */}
        {step === 'lifeWheel' && (
          <div>
            <div className="mb-6 text-center">
              <Target className="mx-auto mb-2 h-8 w-8 text-ascend-400" />
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Life Wheel Assessment</h2>
              <p className="text-sm text-[var(--text-secondary)]">Rate your current satisfaction in each area (1-10)</p>
            </div>

            <div className="space-y-4 mb-8">
              {LIFE_DOMAINS.map((domain) => (
                <div key={domain}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm text-[var(--text-primary)]">{LIFE_DOMAIN_LABELS[domain]}</span>
                    <span className="text-sm font-bold text-ascend-400">{lifeWheel[domain]}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={lifeWheel[domain]}
                    onChange={(e) =>
                      setLifeWheel((prev) => ({ ...prev, [domain]: parseInt(e.target.value) }))
                    }
                    className="w-full accent-[#F97316]"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={back} className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button onClick={next} className="flex items-center gap-2 rounded-lg bg-ascend-500 px-6 py-2 text-sm font-medium text-white hover:bg-ascend-600">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ════════ CORE VALUES ════════ */}
        {step === 'values' && (
          <div>
            <div className="mb-6 text-center">
              <Star className="mx-auto mb-2 h-8 w-8 text-yellow-400" />
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Core Values</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Choose up to 5 values that matter most to you
              </p>
            </div>

            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {VALUE_OPTIONS.map((v) => (
                <button
                  key={v}
                  onClick={() => toggleValue(v)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    selectedValues.includes(v)
                      ? 'bg-ascend-500 text-white scale-105'
                      : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            <p className="mb-4 text-center text-xs text-[var(--text-secondary)]">
              {selectedValues.length}/5 selected
            </p>

            <div className="flex justify-between">
              <button onClick={back} className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button onClick={next} className="flex items-center gap-2 rounded-lg bg-ascend-500 px-6 py-2 text-sm font-medium text-white hover:bg-ascend-600">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ════════ VISION ════════ */}
        {step === 'vision' && (
          <div>
            <div className="mb-6 text-center">
              <Compass className="mx-auto mb-2 h-8 w-8 text-blue-400" />
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Life Vision</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Describe your ideal life 1-5 years from now
              </p>
            </div>

            <textarea
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              placeholder="In 5 years, I want to be..."
              className="mb-8 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-ascend-500 focus:outline-none resize-none"
              rows={6}
            />

            <div className="flex justify-between">
              <button onClick={back} className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button onClick={next} className="flex items-center gap-2 rounded-lg bg-ascend-500 px-6 py-2 text-sm font-medium text-white hover:bg-ascend-600">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ════════ COACH TYPE ════════ */}
        {step === 'coach' && (
          <div>
            <div className="mb-6 text-center">
              <MessageCircle className="mx-auto mb-2 h-8 w-8 text-green-400" />
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Coach Personality</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                How would you like your AI coach to interact with you?
              </p>
            </div>

            <div className="mb-8 grid gap-3 grid-cols-1 sm:grid-cols-2">
              {COACH_TYPES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCoachType(c.id)}
                  className={`rounded-xl p-4 text-left transition-all ${
                    coachType === c.id
                      ? 'bg-ascend-500/20 ring-2 ring-ascend-500'
                      : 'bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <span className="text-2xl">{c.icon}</span>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{c.label}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{c.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={back} className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={handleComplete}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-ascend-500 px-6 py-2 text-sm font-medium text-white hover:bg-ascend-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Complete Setup'} <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ════════ DONE ════════ */}
        {step === 'done' && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <Sparkles className="h-10 w-10 text-green-400" />
            </div>
            <h1 className="mb-3 text-3xl font-bold text-[var(--text-primary)]">
              You&apos;re all set! 🎉
            </h1>
            <p className="mb-8 text-[var(--text-secondary)]">
              Your personalized growth journey starts now. Let&apos;s make it count.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex mx-auto items-center gap-2 rounded-lg bg-ascend-500 px-8 py-3 text-sm font-medium text-white hover:bg-ascend-600"
            >
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
