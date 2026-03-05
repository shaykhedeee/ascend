'use client';

// ════════════════════════════════════════════════════════════════
// RESURGO — Interactive Demo Carousel
// Shows Brain Dump / AI Coaches / Plan Builder / Vision Board
// Auto-cycles every 8s unless user interacts
// ════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface DemoFeature {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  lines: { type: 'input' | 'output' | 'comment' | 'success' | 'divider'; text: string }[];
  cta: { text: string; href: string };
  accent: string;
}

const DEMOS: DemoFeature[] = [
  {
    id: 'brain_dump',
    label: 'Brain Dump',
    title: 'From chaos to clarity in seconds',
    subtitle: 'Dump everything on your mind — AI organizes it instantly',
    accent: 'text-orange-400',
    lines: [
      { type: 'input', text: '> brain-dump --process' },
      { type: 'comment', text: '# Dumping stream of consciousness...' },
      { type: 'output', text: '"Need to call mum, fix the website bug, start gym,' },
      { type: 'output', text: ' read Atomic Habits, plan holiday, pay rent"' },
      { type: 'divider', text: '' },
      { type: 'comment', text: '# AI extracting structure...' },
      { type: 'success', text: '✓ TASKS (3):  call mum · fix website bug · pay rent' },
      { type: 'success', text: '✓ GOALS (2):  start gym · read Atomic Habits' },
      { type: 'success', text: '✓ IDEAS (1):  plan holiday → saved to Wishlist' },
      { type: 'comment', text: '# All items added to your dashboard_' },
    ],
    cta: { text: 'Try Brain Dump →', href: '/sign-up' },
  },
  {
    id: 'ai_coaches',
    label: 'AI Coaches',
    title: 'Your expert team, always available',
    subtitle: 'Six specialized AI coaches — each a master of their domain',
    accent: 'text-cyan-400',
    lines: [
      { type: 'input', text: '> coach --connect @TITAN' },
      { type: 'output', text: 'TITAN online. Fitness & Nutrition specialist.' },
      { type: 'divider', text: '' },
      { type: 'input', text: '> "I want to lose 10kg in 3 months"' },
      { type: 'comment', text: '# TITAN analyzing your data...' },
      { type: 'output', text: 'Calorie deficit: 500kcal/day → 0.5kg/week' },
      { type: 'output', text: 'Workout plan: 4x per week strength training' },
      { type: 'output', text: 'Habit stack: log meals + 10k steps daily' },
      { type: 'success', text: '✓ Plan created · Habits added · Goals set' },
      { type: 'comment', text: '# Use @SAGE for wealth, @AURORA for mindfulness_' },
    ],
    cta: { text: 'Meet Your Coaches →', href: '/sign-up' },
  },
  {
    id: 'plan_builder',
    label: 'Plan Builder',
    title: 'Goal to full 90-day plan in 2 minutes',
    subtitle: 'Tell AI your goal — get back milestones, tasks, habits',
    accent: 'text-green-400',
    lines: [
      { type: 'input', text: '> plan-builder --goal "Launch my app"' },
      { type: 'comment', text: '# AI Orchestrator activating 4 models...' },
      { type: 'output', text: 'Milestone 1 (Week 1-2): Validate idea + wireframes' },
      { type: 'output', text: 'Milestone 2 (Week 3-6): Build MVP + core features' },
      { type: 'output', text: 'Milestone 3 (Week 7-10): Beta testing + feedback' },
      { type: 'output', text: 'Milestone 4 (Week 11-12): Launch + marketing push' },
      { type: 'divider', text: '' },
      { type: 'success', text: '✓ 12 tasks created across 4 milestones' },
      { type: 'success', text: '✓ 3 daily habits scheduled' },
      { type: 'comment', text: '# Your 90-day plan is ready_' },
    ],
    cta: { text: 'Build Your Plan →', href: '/sign-up' },
  },
  {
    id: 'vision_board',
    label: 'Vision Board',
    title: 'Describe your dream life, AI visualizes it',
    subtitle: 'AI-generated imagery that keeps you motivated every day',
    accent: 'text-purple-400',
    lines: [
      { type: 'input', text: '> vision-board --generate' },
      { type: 'comment', text: '# Analyzing your goals and aspirations...' },
      { type: 'input', text: '"Dream home by the ocean, own my business,' },
      { type: 'output', text: ' be fit and travel 3x per year"' },
      { type: 'divider', text: '' },
      { type: 'comment', text: '# Generating personalized images...' },
      { type: 'output', text: '[1/4] Modern coastal home — generated ✓' },
      { type: 'output', text: '[2/4] Entrepreneur lifestyle — generated ✓' },
      { type: 'output', text: '[3/4] Peak fitness goal — generated ✓' },
      { type: 'success', text: '✓ Vision board created · 4 images ready_' },
    ],
    cta: { text: 'Create Vision Board →', href: '/sign-up' },
  },
];

export default function InteractiveDemoCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lineRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activateDemo = (idx: number, isUserAction = false) => {
    if (isUserAction) setUserInteracted(true);
    setActiveIdx(idx);
    setVisibleLines(0);
  };

  // Animate lines in one by one
  useEffect(() => {
    if (lineRef.current) clearInterval(lineRef.current);
    const demo = DEMOS[activeIdx];
    let line = 0;
    lineRef.current = setInterval(() => {
      line += 1;
      setVisibleLines(line);
      if (line >= demo.lines.length) {
        if (lineRef.current) clearInterval(lineRef.current);
      }
    }, 260);
    return () => {
      if (lineRef.current) clearInterval(lineRef.current);
    };
  }, [activeIdx]);

  // Auto-cycle every 8s unless user interacted
  useEffect(() => {
    if (userInteracted) return;
    autoRef.current = setInterval(() => {
      setActiveIdx((i) => (i + 1) % DEMOS.length);
    }, 8000);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [userInteracted]);

  const demo = DEMOS[activeIdx];

  return (
    <div className="w-full">
      {/* Feature tab strip */}
      <div className="mb-6 flex flex-wrap items-center gap-2 justify-center">
        {DEMOS.map((d, i) => (
          <button
            key={d.id}
            onClick={() => activateDemo(i, true)}
            className={`border px-4 py-2 font-terminal text-sm font-semibold tracking-wide transition-all ${
              i === activeIdx
                ? 'border-orange-600 bg-orange-600 text-black shadow-[2px_2px_0px_rgba(0,0,0,0.7)]'
                : 'border-zinc-700 bg-transparent text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
            }`}
          >
            {i === activeIdx && '▶ '}{d.label}
          </button>
        ))}
      </div>

      {/* Main demo window */}
      <div className="border-2 border-zinc-800 bg-zinc-950 shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
        {/* Terminal chrome */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-700" />
          </div>
          <span className="font-pixel text-[0.45rem] tracking-widest text-zinc-500">
            RESURGO :: {demo.id.toUpperCase()}_DEMO
          </span>
          <div className="flex items-center gap-1.5">
            {DEMOS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${i === activeIdx ? 'bg-orange-500' : 'bg-zinc-700'}`}
              />
            ))}
          </div>
        </div>

        {/* Terminal body */}
        <div className="min-h-[280px] px-5 py-4 font-mono text-sm leading-7 lg:min-h-[240px]">
          {demo.lines.slice(0, visibleLines).map((line, i) => {
            if (line.type === 'divider') {
              return <div key={i} className="my-2 border-t border-zinc-800" />;
            }
            return (
              <div
                key={i}
                className={`
                  ${line.type === 'input' ? 'text-orange-400' : ''}
                  ${line.type === 'output' ? 'text-zinc-300' : ''}
                  ${line.type === 'comment' ? 'text-zinc-600 italic' : ''}
                  ${line.type === 'success' ? 'text-green-400' : ''}
                `}
              >
                {line.text}
              </div>
            );
          })}
          {/* Blinking cursor */}
          {visibleLines < demo.lines.length && (
            <span className="inline-block h-4 w-2 animate-pulse bg-orange-500" />
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900 px-4 py-3">
          <div>
            <p className="font-terminal text-sm font-semibold text-zinc-100">{demo.title}</p>
            <p className="font-terminal text-xs text-zinc-500">{demo.subtitle}</p>
          </div>
          <Link
            href={demo.cta.href}
            className="shrink-0 border-2 border-orange-600 bg-orange-600 px-4 py-2 font-terminal text-sm font-bold text-black shadow-[2px_2px_0px_rgba(0,0,0,0.7)] transition-all hover:bg-orange-500 active:translate-x-px active:translate-y-px"
          >
            {demo.cta.text}
          </Link>
        </div>
      </div>

      {/* Auto-cycle hint */}
      {!userInteracted && (
        <p className="mt-3 text-center font-pixel text-[0.4rem] tracking-widest text-zinc-700">
          AUTO-CYCLING · CLICK A TAB TO TAKE CONTROL
        </p>
      )}
    </div>
  );
}
