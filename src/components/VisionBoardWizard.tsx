'use client';

// ════════════════════════════════════════════════════════════════
// RESURGO — Vision Board Guided Creation Wizard
// Multi-step prompt builder for richer AI image generation
// ════════════════════════════════════════════════════════════════

import { useState } from 'react';

export interface VisionBoardWizardResult {
  overarchingVision: string;
  domains: string[];
  domainDetails: Record<string, string>;
  stylePreset: 'pinterest-bold' | 'clean-minimal' | 'luxury-editorial' | 'cinematic-dream';
  mood: string;
  customPromptBoost: string;
}

interface Props {
  onComplete: (result: VisionBoardWizardResult) => void;
  onSkip: () => void;
}

const DOMAINS = [
  { id: 'HEALTH', icon: '💪', label: 'Health & Fitness', placeholder: 'e.g. "Athletic, strong, running a 10K, lean physique, morning workouts"' },
  { id: 'CAREER', icon: '🚀', label: 'Career & Business', placeholder: 'e.g. "Founder of a SaaS company, speaking on stages, financial freedom"' },
  { id: 'WEALTH', icon: '💰', label: 'Wealth & Lifestyle', placeholder: 'e.g. "Modern apartment, luxury car, investments growing, passive income"' },
  { id: 'RELATIONSHIP', icon: '❤️', label: 'Relationships', placeholder: 'e.g. "Deep friendships, loving relationship, strong family bonds"' },
  { id: 'LEARNING', icon: '📚', label: 'Learning & Growth', placeholder: 'e.g. "Fluent in Spanish, advanced coding skills, reading 30 books/year"' },
  { id: 'TRAVEL', icon: '✈️', label: 'Travel & Adventures', placeholder: 'e.g. "Japan, Bali, hiking the Alps, 3 international trips per year"' },
  { id: 'MINDSET', icon: '🧘', label: 'Mindset & Peace', placeholder: 'e.g. "Daily meditation, calm and focused, resilient under pressure"' },
  { id: 'CREATIVITY', icon: '🎨', label: 'Creativity & Passion', placeholder: 'e.g. "Published author, music producer, painting as a hobby"' },
];

const STYLE_OPTIONS = [
  {
    id: 'pinterest-bold' as const,
    label: 'Pinterest Bold',
    desc: 'High contrast, vibrant, dynamic energy',
    emoji: '⚡',
  },
  {
    id: 'clean-minimal' as const,
    label: 'Clean Minimal',
    desc: 'Airy white space, calm, elegant',
    emoji: '🌿',
  },
  {
    id: 'luxury-editorial' as const,
    label: 'Luxury Editorial',
    desc: 'Premium magazine feel, sophisticated',
    emoji: '✨',
  },
  {
    id: 'cinematic-dream' as const,
    label: 'Cinematic Dream',
    desc: 'Moody, dramatic lighting, cinematic',
    emoji: '🎬',
  },
];

const MOOD_OPTIONS = [
  'Ambitious & Bold', 'Calm & Peaceful', 'Luxurious & Premium',
  'Raw & Authentic', 'Spiritual & Mindful', 'Adventurous & Free',
];

const VISION_EXAMPLES = [
  '"I wake up every day energized, building my dream business from a beautiful home office, while staying healthy and present for the people I love."',
  '"My life in 3 years: financially free, living abroad, leading a team I\'m proud of, and in the best shape of my life."',
  '"I\'m the person who has it together — focused, wealthy, healthy, and doing work that matters."',
];

export default function VisionBoardWizard({ onComplete, onSkip }: Props) {
  const [step, setStep] = useState(1);
  const [overarchingVision, setOverarchingVision] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [domainDetails, setDomainDetails] = useState<Record<string, string>>({});
  const [stylePreset, setStylePreset] = useState<VisionBoardWizardResult['stylePreset']>('pinterest-bold');
  const [mood, setMood] = useState('Ambitious & Bold');
  const [customBoost, setCustomBoost] = useState('');

  const toggleDomain = (id: string) => {
    setSelectedDomains((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id].slice(0, 6)
    );
  };

  const canProceed = () => {
    if (step === 1) return overarchingVision.trim().length > 10;
    if (step === 2) return selectedDomains.length >= 2;
    if (step === 3) return selectedDomains.every((d) => (domainDetails[d] ?? '').trim().length > 0);
    return true;
  };

  const handleComplete = () => {
    onComplete({
      overarchingVision,
      domains: selectedDomains,
      domainDetails,
      stylePreset,
      mood,
      customPromptBoost: customBoost,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Terminal header */}
      <div className="border border-zinc-800 bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-700" />
          </div>
          <span className="font-pixel text-[0.45rem] tracking-widest text-zinc-500">
            VISION_BOARD_WIZARD.sh — STEP {step}/4
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((s) => (
              <span
                key={s}
                className={`h-1.5 w-4 transition-colors ${s <= step ? 'bg-orange-500' : 'bg-zinc-800'}`}
              />
            ))}
          </div>
        </div>

        <div className="px-5 py-6 space-y-5">
          {/* ── STEP 1: Overarching vision ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <p className="font-pixel text-[0.5rem] tracking-widest text-orange-500 mb-1">
                  &gt; STEP_01 :: DEFINE_YOUR_VISION
                </p>
                <h3 className="font-terminal text-lg font-semibold text-zinc-100">
                  Describe your dream life in 1–3 sentences
                </h3>
                <p className="font-terminal text-sm text-zinc-500 mt-1">
                  Be specific. Including emotions, environments, and outcomes helps AI create vivid, personal imagery.
                </p>
              </div>

              {/* Example prompts */}
              <div className="space-y-2">
                <p className="font-pixel text-[0.45rem] tracking-widest text-zinc-600">EXAMPLES FOR INSPIRATION:</p>
                {VISION_EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setOverarchingVision(ex.replace(/^"|"$/g, ''))}
                    className="w-full text-left border border-zinc-800 bg-zinc-900/40 px-3 py-2 font-terminal text-xs text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition"
                  >
                    {ex}
                  </button>
                ))}
              </div>

              <textarea
                value={overarchingVision}
                onChange={(e) => setOverarchingVision(e.target.value)}
                placeholder="Describe your ideal future life — where you are, who you are, what you have achieved..."
                rows={4}
                className="w-full border border-zinc-700 bg-black px-3 py-2.5 font-terminal text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-orange-600 focus:outline-none resize-none"
              />
              <p className="font-terminal text-xs text-zinc-600">
                {overarchingVision.length} chars · {overarchingVision.split(' ').filter(Boolean).length} words
              </p>
            </div>
          )}

          {/* ── STEP 2: Domain selection ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <p className="font-pixel text-[0.5rem] tracking-widest text-orange-500 mb-1">
                  &gt; STEP_02 :: SELECT_LIFE_DOMAINS
                </p>
                <h3 className="font-terminal text-lg font-semibold text-zinc-100">
                  Pick 2–6 areas of your life to visualize
                </h3>
                <p className="font-terminal text-sm text-zinc-500 mt-1">
                  Each domain becomes a dedicated panel in your vision board.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {DOMAINS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDomain(d.id)}
                    className={`flex items-center gap-2 border px-3 py-2.5 text-left transition ${
                      selectedDomains.includes(d.id)
                        ? 'border-orange-600 bg-orange-950/30 text-orange-300'
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                    }`}
                  >
                    <span className="shrink-0 text-base">{d.icon}</span>
                    <span className="font-terminal text-xs font-semibold">{d.label}</span>
                    {selectedDomains.includes(d.id) && (
                      <span className="ml-auto font-pixel text-[0.5rem] text-orange-500">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <p className="font-terminal text-xs text-zinc-600">
                {selectedDomains.length}/6 selected {selectedDomains.length < 2 && '· select at least 2'}
              </p>
            </div>
          )}

          {/* ── STEP 3: Domain details ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <p className="font-pixel text-[0.5rem] tracking-widest text-orange-500 mb-1">
                  &gt; STEP_03 :: DETAIL_EACH_DOMAIN
                </p>
                <h3 className="font-terminal text-lg font-semibold text-zinc-100">
                  Describe your vision in each area
                </h3>
                <p className="font-terminal text-sm text-zinc-500 mt-1">
                  These details become the AI image prompts. The more specific you are, the better the output.
                </p>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {selectedDomains.map((domainId) => {
                  const domain = DOMAINS.find((d) => d.id === domainId)!;
                  return (
                    <div key={domainId} className="border border-zinc-800 bg-zinc-900/20 p-3 space-y-2">
                      <p className="font-terminal text-sm font-semibold text-zinc-200">
                        {domain.icon} {domain.label}
                      </p>
                      <textarea
                        value={domainDetails[domainId] ?? ''}
                        onChange={(e) =>
                          setDomainDetails((prev) => ({ ...prev, [domainId]: e.target.value }))
                        }
                        placeholder={domain.placeholder}
                        rows={2}
                        className="w-full border border-zinc-700 bg-black px-2.5 py-2 font-terminal text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-orange-600 focus:outline-none resize-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 4: Style + mood ── */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <p className="font-pixel text-[0.5rem] tracking-widest text-orange-500 mb-1">
                  &gt; STEP_04 :: CHOOSE_AESTHETIC
                </p>
                <h3 className="font-terminal text-lg font-semibold text-zinc-100">
                  Choose your visual style and mood
                </h3>
              </div>

              <div>
                <p className="font-terminal text-xs text-zinc-500 mb-2 uppercase tracking-widest">Visual Style</p>
                <div className="grid grid-cols-2 gap-2">
                  {STYLE_OPTIONS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStylePreset(s.id)}
                      className={`flex items-start gap-2 border p-3 text-left transition ${
                        stylePreset === s.id
                          ? 'border-orange-600 bg-orange-950/30'
                          : 'border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      <span className="text-base shrink-0">{s.emoji}</span>
                      <div>
                        <p className="font-terminal text-xs font-semibold text-zinc-200">{s.label}</p>
                        <p className="font-terminal text-[0.65rem] text-zinc-500">{s.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-terminal text-xs text-zinc-500 mb-2 uppercase tracking-widest">Board Mood</p>
                <div className="flex flex-wrap gap-2">
                  {MOOD_OPTIONS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`border px-3 py-1.5 font-terminal text-xs transition ${
                        mood === m
                          ? 'border-orange-600 bg-orange-950/30 text-orange-300'
                          : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-terminal text-xs text-zinc-500 mb-2 uppercase tracking-widest">
                  Extra details (optional)
                </p>
                <textarea
                  value={customBoost}
                  onChange={(e) => setCustomBoost(e.target.value)}
                  placeholder="Any specific objects, colors, settings, or people you want in your board? e.g. 'warm sunset tones, minimalist home office, mountains in background'"
                  rows={2}
                  className="w-full border border-zinc-700 bg-black px-2.5 py-2 font-terminal text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-orange-600 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation footer */}
        <div className="flex items-center justify-between border-t border-zinc-800 px-5 py-3">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="border border-zinc-700 px-3 py-1.5 font-terminal text-sm text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-200"
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              onClick={onSkip}
              className="font-terminal text-xs text-zinc-600 hover:text-zinc-400 transition"
            >
              Skip wizard
            </button>
          </div>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="border-2 border-orange-600 bg-orange-600 px-5 py-2 font-terminal text-sm font-bold text-black shadow-[2px_2px_0px_rgba(0,0,0,0.7)] transition-all hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              className="border-2 border-orange-600 bg-orange-600 px-5 py-2 font-terminal text-sm font-bold text-black shadow-[2px_2px_0px_rgba(0,0,0,0.7)] transition-all hover:bg-orange-500"
            >
              ✦ Generate My Board
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
