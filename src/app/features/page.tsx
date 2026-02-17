// ═══════════════════════════════════════════════════════════════════════════════
// AscendifyIFY - Features Page (SEO-Optimized)
// ═══════════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import Link from 'next/link';
import {
  Mountain, ArrowLeft, Brain, Target, Flame, BarChart3,
  CalendarDays, Gamepad2, Shield, Wifi, Repeat, Award,
  Layers, Timer, Heart, Download, Palette, Keyboard,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Features — AI Habit Tracker with Goal Decomposition',
  description:
    'Explore Ascendify features: AI goal decomposition, streak tracking, gamified XP system, smart analytics, habit stacking, weekly reviews, contribution heatmap, and more.',
  keywords: [
    'habit tracker features', 'AI goal decomposition', 'habit streak tracker',
    'gamified productivity app', 'habit analytics', 'habit stacking app',
    'goal tracker with milestones', 'best habit tracking features',
  ],
  openGraph: {
    title: 'Ascendify Features — Everything You Need to Build Better Habits',
    description: 'AI-powered goal decomposition, streak tracking, gamification, and more.',
    url: '/features',
  },
  alternates: { canonical: '/features' },
};

const featureCategories = [
  {
    title: 'AI-Powered Intelligence',
    description: 'Let AI do the heavy lifting so you can focus on doing',
    features: [
      {
        icon: Brain,
        name: 'AI Goal Decomposition',
        description: 'Enter any goal and our AI breaks it into milestones, weekly objectives, and daily tasks. No more staring at a blank page wondering where to start.',
        badge: 'Pro',
      },
      {
        icon: Target,
        name: 'Smart Coach',
        description: 'Receive personalized coaching messages based on your progress, streaks, and behavior patterns. Science-backed nudges exactly when you need them.',
        badge: 'Pro',
      },
      {
        icon: Layers,
        name: 'AI Habit Suggestions',
        description: 'Get habit recommendations tailored to your goals and current routine. Built on Atomic Habits and behavioral science principles.',
        badge: null,
      },
    ],
  },
  {
    title: 'Habit Tracking That Works',
    description: 'Beautiful, frictionless tracking that keeps you coming back',
    features: [
      {
        icon: Flame,
        name: 'Streak Tracking',
        description: 'Visual streak counters with milestone celebrations at 7, 21, 30, 60, and 100 days. Streak freeze tokens protect your progress on off days.',
        badge: null,
      },
      {
        icon: CalendarDays,
        name: 'Contribution Heatmap',
        description: 'GitHub-style activity grid showing 52 weeks of daily habit completion. See your consistency at a glance with 5-level color coding.',
        badge: 'Pro',
      },
      {
        icon: Repeat,
        name: 'Habit Stacking',
        description: 'Chain habits together using the proven "After I [X], I will [Y]" formula from Atomic Habits. Build unstoppable routines.',
        badge: null,
      },
    ],
  },
  {
    title: 'Gamified Progress',
    description: 'Turn self-improvement into the most rewarding game you\'ll ever play',
    features: [
      {
        icon: Gamepad2,
        name: 'XP & Level System',
        description: 'Earn XP for completing habits, maintaining streaks, and hitting milestones. Progress through 15 levels from Beginner to Legend.',
        badge: null,
      },
      {
        icon: Award,
        name: 'Achievements & Badges',
        description: 'Unlock achievements for consistency, milestones, and special accomplishments. Celebrate wins with confetti bursts and sound effects.',
        badge: null,
      },
      {
        icon: Heart,
        name: 'Identity-Based Tracking',
        description: 'Build identity statements and collect evidence. Become "a person who exercises daily" — not just someone trying to work out.',
        badge: 'Pro',
      },
    ],
  },
  {
    title: 'Analytics & Insights',
    description: 'Understand your patterns and optimize your approach',
    features: [
      {
        icon: BarChart3,
        name: 'Smart Analytics Dashboard',
        description: 'Daily, weekly, and monthly completion rates. Top habits, consistency trends, and improvement areas — all beautifully visualized.',
        badge: null,
      },
      {
        icon: Timer,
        name: 'Pomodoro Focus Timer',
        description: 'Built-in focus timer with session tracking and stats. Measure your deep work minutes alongside your habit data.',
        badge: null,
      },
      {
        icon: Download,
        name: 'Data Export',
        description: 'Export your data as JSON, CSV, or PDF reports. Your data belongs to you — download it anytime.',
        badge: null,
      },
    ],
  },
  {
    title: 'Privacy & Accessibility',
    description: 'Built for everyone, respectful of your data',
    features: [
      {
        icon: Shield,
        name: 'Privacy First',
        description: 'Local-first architecture means your habit data never leaves your device. No tracking, no selling your data, no ads — ever.',
        badge: null,
      },
      {
        icon: Wifi,
        name: 'Works Offline (PWA)',
        description: 'Install Ascendify on any device. Full functionality even without internet. Syncs when you reconnect.',
        badge: null,
      },
      {
        icon: Palette,
        name: 'Dark & Light Themes',
        description: 'Smooth animated theme switching. Respects your system preference or set your own.',
        badge: null,
      },
      {
        icon: Keyboard,
        name: 'Keyboard Shortcuts',
        description: 'Full keyboard navigation: Cmd+K search, Ctrl+T templates, Ctrl+N quick add, and dozens more for power users.',
        badge: null,
      },
    ],
  },
];

// JSON-LD
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Ascendify Features',
  description: 'Complete feature list for the Ascendify AI-powered habit tracker.',
  mainEntity: {
    '@type': 'SoftwareApplication',
    name: 'Ascendify',
    applicationCategory: 'LifestyleApplication',
    featureList: featureCategories.flatMap((cat) =>
      cat.features.map((f) => f.name)
    ),
  },
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ascend-500 to-ascend-600 flex items-center justify-center">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">ASCENDIFY</span>
            <span className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-ascend-400 to-gold-400 bg-clip-text text-transparent">
              Build Better Habits
            </span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            AI goal decomposition, gamified streaks, smart analytics, and more — all designed
            to help you achieve your goals and become the person you want to be.
          </p>
        </div>

        {/* Feature Categories */}
        {featureCategories.map((category) => (
          <section key={category.title} className="mb-20">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">{category.title}</h2>
              <p className="text-[var(--text-secondary)]">{category.description}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.name}
                    className="relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-ascend-500/30 transition-colors"
                  >
                    {feature.badge && (
                      <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-ascend-500/10 text-ascend-400 text-xs font-semibold">
                        {feature.badge}
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-lg bg-ascend-500/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-ascend-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* VS Competitors */}
        <section className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Ascendify vs. Other Habit Trackers
          </h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface)]">
                  <th className="text-left py-4 px-5 font-semibold">Feature</th>
                  <th className="text-center py-4 px-5 font-semibold text-ascend-400">ASCENDIFY</th>
                  <th className="text-center py-4 px-5 font-semibold text-[var(--text-muted)]">Habitica</th>
                  <th className="text-center py-4 px-5 font-semibold text-[var(--text-muted)]">Streaks</th>
                  <th className="text-center py-4 px-5 font-semibold text-[var(--text-muted)]">Todoist</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['AI Goal Decomposition', '✓', '—', '—', '—'],
                  ['Gamification (XP/Levels)', '✓', '✓', '—', '—'],
                  ['Habit Stacking', '✓', '—', '—', '—'],
                  ['Streak Tracking', '✓', '✓', '✓', '—'],
                  ['Advanced Analytics', '✓', '—', '✓', '—'],
                  ['Identity-Based Tracking', '✓', '—', '—', '—'],
                  ['Privacy First / Local Data', '✓', '—', '✓', '—'],
                  ['Works Offline (PWA)', '✓', '—', '✓', '—'],
                  ['Free Plan', '✓', '✓', '—', '✓'],
                  ['ADHD-Friendly Design', '✓', '—', '—', '—'],
                ].map((row, i) => (
                  <tr key={row[0]} className={`border-b border-[var(--border)] ${i % 2 === 1 ? 'bg-[var(--surface)]/50' : ''}`}>
                    <td className="py-3 px-5 text-[var(--text-secondary)]">{row[0]}</td>
                    <td className="py-3 px-5 text-center font-medium text-ascend-400">{row[1]}</td>
                    <td className="py-3 px-5 text-center text-[var(--text-muted)]">{row[2]}</td>
                    <td className="py-3 px-5 text-center text-[var(--text-muted)]">{row[3]}</td>
                    <td className="py-3 px-5 text-center text-[var(--text-muted)]">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">Start building better habits today</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Free to start. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl font-semibold text-lg
                       bg-gradient-to-r from-ascend-500 to-ascend-600 text-white shadow-xl shadow-ascend-500/25
                       hover:shadow-ascend-500/40 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 rounded-xl font-semibold text-lg border border-[var(--border)]
                       hover:bg-[var(--surface-hover)] transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
