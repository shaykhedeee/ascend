// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND - About Page (SEO-Optimized)
// ═══════════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import Link from 'next/link';
import { Mountain, ArrowLeft, Heart, Zap, Shield, Users, BookOpen, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About ASCEND — Our Mission to Help You Build Better Habits',
  description:
    'Learn about ASCEND, the AI-powered habit tracker built on behavioral science. Our mission: make self-improvement accessible, private, and genuinely effective.',
  keywords: [
    'about ascend app', 'habit tracker mission', 'who made ascend',
    'productivity app team', 'habit science app',
  ],
  openGraph: {
    title: 'About ASCEND — Built for Achievers',
    description: 'The story behind the AI habit tracker that\'s helping 50K+ people build better lives.',
    url: '/about',
  },
  alternates: { canonical: '/about' },
};

const values = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your habit data stays on your device. No tracking, no ads, no selling your personal information. Ever.',
  },
  {
    icon: BookOpen,
    title: 'Science-Backed',
    description: 'Every feature is grounded in behavioral science — from Atomic Habits\' identity-based approach to BJ Fogg\'s Tiny Habits method.',
  },
  {
    icon: Heart,
    title: 'Mental Health Aware',
    description: 'Gentle mode, breathing exercises, and wellness tracking. We know productivity without wellbeing isn\'t sustainable.',
  },
  {
    icon: Users,
    title: 'ADHD-Friendly',
    description: 'Micro-task breakdown, visual timers, haptic feedback, and dopamine-driven gamification designed for neurodivergent minds.',
  },
  {
    icon: Globe,
    title: 'Accessible to All',
    description: 'Works offline as a PWA, keyboard navigable, screen reader compatible, and theme-adaptive. Built for everyone.',
  },
  {
    icon: Zap,
    title: 'AI That Helps',
    description: 'Our AI doesn\'t just track — it decomposes goals, coaches you through plateaus, and adapts to your progress patterns.',
  },
];

const milestones = [
  { year: '2024', event: 'ASCEND concept born — frustrated with habit trackers that just show checkboxes' },
  { year: '2024', event: 'AI goal decomposition engine built — turning big dreams into daily tasks' },
  { year: '2025', event: 'Gamification system with 15 levels, achievements, and streak celebrations' },
  { year: '2025', event: 'Wellness features: mood tracking, breathing exercises, gentle mode' },
  { year: '2026', event: 'Smart Coach, contribution heatmap, weekly reviews, and CSV export' },
  { year: '2026', event: 'Launch — helping thousands build habits that actually stick' },
];

// JSON-LD
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About ASCEND',
  description: 'Learn about ASCEND, the AI-powered habit tracker.',
  mainEntity: {
    '@type': 'Organization',
    name: 'ASCEND',
    description: 'AI-powered habit tracking and goal achievement platform',
    foundingDate: '2024',
    url: 'https://ascend.app',
    knowsAbout: [
      'Habit Formation', 'Behavioral Science', 'Goal Setting',
      'Gamification', 'AI Goal Decomposition', 'Productivity',
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ascend-500 to-ascend-600 flex items-center justify-center">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">ASCEND</span>
            <span className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            We Believe Everyone Deserves
            <span className="block mt-2 bg-gradient-to-r from-ascend-400 to-gold-400 bg-clip-text text-transparent">
              Tools That Actually Work
            </span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Most habit trackers are just glorified checkboxes. ASCEND is different — it&apos;s an AI-powered
            system built on behavioral science that turns your biggest goals into daily wins you can
            actually complete.
          </p>
        </div>

        {/* The Problem */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">The Problem We Solve</h2>
              <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
                You set a goal — &quot;get fit,&quot; &quot;learn a new language,&quot; &quot;launch a side project.&quot;
                But then what? The goal feels overwhelming, you don&apos;t know where to start, and after
                a few days of motivation you&apos;re back to square one.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                ASCEND solves this by using AI to decompose your goal into a concrete roadmap — milestones,
                weekly objectives, and daily tasks. Then it wraps everything in a gamified system that makes
                showing up feel genuinely rewarding.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-red-400 mb-1">Without ASCEND</p>
                  <p className="text-[var(--text-secondary)]">&quot;I want to get fit&quot; → overwhelm → procrastination → guilt → quit</p>
                </div>
                <div className="border-t border-[var(--border)] pt-6">
                  <p className="text-sm font-semibold text-ascend-400 mb-1">With ASCEND</p>
                  <p className="text-[var(--text-secondary)]">
                    &quot;I want to get fit&quot; → AI creates 6-month roadmap → today: &quot;15-min walk after lunch&quot;
                    → earn 10 XP → 7-day streak → 🎉
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
                  <div className="w-10 h-10 rounded-lg bg-ascend-500/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-ascend-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Our Journey</h2>
          <div className="max-w-2xl mx-auto">
            <div className="relative border-l-2 border-ascend-500/30 pl-8 space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[41px] w-4 h-4 rounded-full bg-ascend-500 border-2 border-[var(--background)]" />
                  <span className="text-xs font-bold text-ascend-400 uppercase tracking-wider">{m.year}</span>
                  <p className="text-[var(--text-secondary)] mt-1">{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-20 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50K+', label: 'Active Users' },
              { value: '2M+', label: 'Habits Tracked' },
              { value: '500K+', label: 'Goals Set' },
              { value: '4.9★', label: 'User Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-ascend-400 to-gold-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-[var(--text-muted)] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-3">Join the movement</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Start building habits that stick — free, private, and powered by AI.
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
              href="/features"
              className="px-8 py-4 rounded-xl font-semibold text-lg border border-[var(--border)]
                       hover:bg-[var(--surface-hover)] transition-all"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
