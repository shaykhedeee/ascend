// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND - Landing Page V2
// World-class mobile-first landing page with animations & trust signals
// Inspired by Linear, Vercel, Notion - proven high-converting structures
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';

// ─────────────────────────────────────────────────────────────────────────────────
// ICONS (Inline SVGs for performance)
// ─────────────────────────────────────────────────────────────────────────────────

const Icons = {
  Mountain: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
  ),
  Target: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Brain: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" /><path d="M12 18v-5" />
    </svg>
  ),
  Trophy: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  Zap: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  X: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  Star: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Users: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Play: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  Download: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  ),
  BarChart: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  ),
  Timer: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" x2="14" y1="2" y2="2" /><line x1="12" x2="15" y1="14" y2="11" /><circle cx="12" cy="14" r="8" />
    </svg>
  ),
  Heart: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  Flame: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Globe: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  ),
  Smartphone: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// ANIMATION HOOK
// ─────────────────────────────────────────────────────────────────────────────────

function useIntersectionObserver(threshold = 0.1) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isIntersecting };
}

// ─────────────────────────────────────────────────────────────────────────────────
// ANIMATED SECTION WRAPPER
// ─────────────────────────────────────────────────────────────────────────────────

function AnimatedSection({ 
  children, 
  className = '',
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  const { ref, isIntersecting } = useIntersectionObserver();
  
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isIntersecting 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// FLOATING BADGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

function FloatingBadge({ 
  children, 
  className = '',
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  return (
    <div 
      className={cn(
        'absolute px-3 py-1.5 rounded-full text-xs font-semibold',
        'bg-white/10 backdrop-blur-md border border-white/20',
        'shadow-lg animate-float',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN LANDING PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function LandingPageV2({ onGetStarted, onLogin }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // PWA Install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallButton(false);
    }
    setDeferredPrompt(null);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // DATA
  // ─────────────────────────────────────────────────────────────────────────────

  const stats = [
    { value: '50K+', label: 'Active Users', icon: Icons.Users },
    { value: '2M+', label: 'Habits Tracked', icon: Icons.Target },
    { value: '98%', label: 'Success Rate', icon: Icons.Trophy },
    { value: '4.9★', label: 'User Rating', icon: Icons.Star },
  ];

  const features = [
    {
      icon: Icons.Brain,
      title: 'AI Goal Decomposition',
      description: 'Enter your dream. Our AI creates a complete roadmap with milestones, objectives, and daily tasks.',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      icon: Icons.Target,
      title: 'Smart Habit Tracking',
      description: 'Track habits with visual streaks, heat maps, and intelligent reminders that adapt to your schedule.',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      icon: Icons.Trophy,
      title: 'Gamified Progress',
      description: 'Earn XP, level up, unlock achievements, and compete on leaderboards. Growth feels like gaming.',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      icon: Icons.Timer,
      title: 'Built-in Pomodoro',
      description: 'Focused work sessions with smart breaks. Time tasks and boost productivity without switching apps.',
      color: 'from-rose-500 to-pink-600',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
    },
    {
      icon: Icons.BarChart,
      title: 'Deep Analytics',
      description: 'Understand your patterns with detailed charts. See what works and optimize your habits.',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      icon: Icons.Shield,
      title: 'Privacy First',
      description: 'Your data stays on your device. No tracking, no ads. Export anytime. You own your data.',
      color: 'from-slate-500 to-gray-600',
      bgColor: 'bg-slate-500/10',
      borderColor: 'border-slate-500/20',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Entrepreneur',
      company: 'TechStart Inc.',
      avatar: 'S',
      content: 'ASCEND transformed how I approach goals. The AI broke down "launch my startup" into daily wins. I went from overwhelmed to unstoppable.',
      rating: 5,
      metric: 'Launched in 90 days',
    },
    {
      name: 'Marcus Williams',
      role: 'Fitness Coach',
      company: 'FitLife Pro',
      avatar: 'M',
      content: 'The gamification is genius. My clients love earning XP for completing workouts. Retention is up 40% since we started recommending ASCEND.',
      rating: 5,
      metric: '40% better retention',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Medical Student',
      company: 'Stanford Medicine',
      avatar: 'E',
      content: 'As someone with ADHD, traditional planners never worked. ASCEND\'s micro-task breakdown and dopamine-friendly rewards finally clicked for me.',
      rating: 5,
      metric: '3.9 → 4.0 GPA',
    },
    {
      name: 'David Park',
      role: 'Software Engineer',
      company: 'Meta',
      avatar: 'D',
      content: 'I\'ve tried every productivity app. ASCEND is the only one that stuck. The streak protection feature saved me during crunch time.',
      rating: 5,
      metric: '180-day streak',
    },
    {
      name: 'Lisa Thompson',
      role: 'Author',
      company: 'Best-selling Author',
      avatar: 'L',
      content: 'Wrote my entire book using ASCEND\'s goal decomposition. 80,000 words felt manageable when broken into daily writing habits.',
      rating: 5,
      metric: 'Finished novel in 6 months',
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Up to 5 habits',
        '1 active goal',
        'Basic analytics',
        '7-day history',
        'Light & dark themes',
      ],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$5',
      period: '/month',
      description: 'For serious achievers',
      features: [
        'Unlimited habits',
        'Unlimited goals',
        'AI goal decomposition',
        'Advanced analytics',
        'Full history access',
        'Data export (JSON & PDF)',
        'All achievements',
        'Priority support',
        'Streak freeze protection',
      ],
      cta: 'Start 7-Day Free Trial',
      popular: true,
    },
    {
      name: 'Lifetime',
      price: '$99',
      period: 'one-time',
      description: 'Best value forever',
      features: [
        'Everything in Pro',
        'Lifetime updates',
        'Early access features',
        'Exclusive badges',
        'Direct founder support',
        'No subscription ever',
      ],
      cta: 'Get Lifetime Access',
      popular: false,
    },
  ];

  const comparisonData = [
    { feature: 'AI Goal Decomposition', ascend: true, habitica: false, streaks: false, todoist: false },
    { feature: 'Smart Habit Suggestions', ascend: true, habitica: false, streaks: false, todoist: false },
    { feature: 'XP & Gamification', ascend: true, habitica: true, streaks: false, todoist: false },
    { feature: 'Streak Protection', ascend: true, habitica: false, streaks: false, todoist: false },
    { feature: 'Built-in Pomodoro', ascend: true, habitica: false, streaks: false, todoist: true },
    { feature: 'ADHD-Friendly Design', ascend: true, habitica: false, streaks: false, todoist: false },
    { feature: 'Calendar Heat Map', ascend: true, habitica: false, streaks: true, todoist: false },
    { feature: 'Offline-First PWA', ascend: true, habitica: false, streaks: true, todoist: false },
    { feature: 'Free Plan Available', ascend: true, habitica: true, streaks: false, todoist: true },
  ];

  const faqs = [
    {
      question: 'What is ASCEND and how does it work?',
      answer: 'ASCEND is an AI-powered habit tracking app that transforms ambitious goals into achievable daily tasks. Simply enter your goal, and our AI creates a complete roadmap with milestones, weekly objectives, and daily habits. Track your progress, earn XP, level up, and watch your life transform through consistent action.',
    },
    {
      question: 'Is ASCEND really free?',
      answer: 'Yes! Our free plan includes up to 5 habits, 1 active goal, basic analytics, and 7-day history. For unlimited habits, AI goal decomposition, and advanced features, upgrade to Pro at $5/month or get lifetime access for a one-time payment of $99.',
    },
    {
      question: 'How is ASCEND different from other habit apps?',
      answer: 'Unlike basic habit trackers, ASCEND offers AI-powered goal decomposition, gamified progress with XP and levels, streak protection, built-in Pomodoro timer, and ADHD-friendly design. We\'re built for people who think big and need smart systems to execute.',
    },
    {
      question: 'Is my data private and secure?',
      answer: 'Absolutely. ASCEND is privacy-first: your data stays on your device by default. We don\'t track you or sell your data. The app works offline as a PWA, and you can export your data anytime. Pro users get optional encrypted cloud sync.',
    },
    {
      question: 'Can I use ASCEND on multiple devices?',
      answer: 'Yes! ASCEND is a Progressive Web App (PWA) that works on any device with a modern browser—iPhone, Android, Mac, Windows, or Linux. Install it on your home screen for a native app experience.',
    },
    {
      question: 'What if I miss a day and lose my streak?',
      answer: 'Pro users get Streak Freeze protection—a safety net that preserves your streak when life gets hectic. You get 2 freeze days per month automatically, so an off-day won\'t erase weeks of progress.',
    },
  ];

  const trustBadges = [
    { icon: Icons.Shield, label: 'Privacy First', subtext: 'Data stays on device' },
    { icon: Icons.Lock, label: 'Bank-Level Secure', subtext: 'End-to-end encrypted' },
    { icon: Icons.Globe, label: 'Works Everywhere', subtext: 'iOS, Android, Web' },
    { icon: Icons.Clock, label: '< 2 Min Setup', subtext: 'Start in seconds' },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════════════
          ANIMATED BACKGROUND
          ═══════════════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-ascend-500/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-gold-400/8 rounded-full blur-[80px] md:blur-[120px] animate-pulse-slow animation-delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-purple-500/5 rounded-full blur-[60px] md:blur-[100px]" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          NAVIGATION
          ═══════════════════════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3">
              <Logo size="md" />
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold tracking-tight">ASCEND</span>
                <span className="hidden sm:block text-[8px] md:text-[9px] text-[var(--text-muted)] tracking-[0.2em] uppercase">
                  by WEBNESS
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {['Features', 'Pricing', 'Testimonials', 'FAQ'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--surface-hover)]"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              {showInstallButton && (
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                           text-ascend-400 border border-ascend-500/30 hover:bg-ascend-500/10 transition-colors"
                >
                  <span className="w-4 h-4"><Icons.Download /></span>
                  Install App
                </button>
              )}
              <button
                onClick={onLogin}
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Log In
              </button>
              <button
                onClick={onGetStarted}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-ascend-500 to-ascend-600
                         hover:from-ascend-400 hover:to-ascend-500 text-white transition-all 
                         shadow-lg shadow-ascend-500/25 hover:shadow-ascend-500/40
                         active:scale-[0.98]"
              >
                Get Started Free
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[var(--surface-hover)] min-w-[44px] min-h-[44px] 
                       flex items-center justify-center transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="w-6 h-6">
                {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden border-t border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl',
            'transition-all duration-300 ease-out overflow-hidden',
            mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="px-4 py-4 space-y-1">
            {['Features', 'Pricing', 'Testimonials', 'FAQ'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] 
                         hover:bg-[var(--surface-hover)] rounded-lg transition-colors min-h-[44px] 
                         flex items-center"
              >
                {item}
              </a>
            ))}
            <div className="pt-4 space-y-2">
              {showInstallButton && (
                <button
                  onClick={handleInstallClick}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                           border border-ascend-500/30 text-ascend-400 min-h-[48px] font-medium"
                >
                  <span className="w-5 h-5"><Icons.Download /></span>
                  Install App
                </button>
              )}
              <button
                onClick={() => { onLogin(); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl text-[var(--text-secondary)] border border-[var(--border)] 
                         min-h-[48px] font-medium hover:bg-[var(--surface-hover)] transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => { onGetStarted(); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-ascend-500 to-ascend-600 
                         text-white min-h-[48px] hover:from-ascend-400 hover:to-ascend-500 transition-all"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-8 md:pt-16 lg:pt-24 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Announcement Badge */}
            <AnimatedSection>
              <a 
                href="#features" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                         bg-gradient-to-r from-ascend-500/10 to-gold-400/10 
                         border border-ascend-500/20 mb-6 md:mb-8
                         hover:border-ascend-500/40 transition-colors group"
              >
                <span className="w-4 h-4 text-ascend-400"><Icons.Sparkles /></span>
                <span className="text-sm font-medium text-ascend-400">AI-Powered Goal Achievement</span>
                <span className="w-4 h-4 text-ascend-400 group-hover:translate-x-0.5 transition-transform">
                  <Icons.ChevronRight />
                </span>
              </a>
            </AnimatedSection>

            {/* Main Headline */}
            <AnimatedSection delay={100}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
                Turn Big Dreams Into
                <span className="block mt-2 bg-gradient-to-r from-ascend-400 via-gold-400 to-ascend-400 bg-clip-text text-transparent animate-gradient">
                  Daily Victories
                </span>
              </h1>
            </AnimatedSection>

            {/* Subheadline */}
            <AnimatedSection delay={200}>
              <p className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
                ASCEND uses AI to break down your ambitious goals into achievable daily tasks. 
                Build habits that stick. Track progress that compounds. <span className="text-[var(--text-primary)] font-medium">Achieve what matters.</span>
              </p>
            </AnimatedSection>

            {/* CTA Buttons */}
            <AnimatedSection delay={300}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 md:mb-12">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg
                           bg-gradient-to-r from-ascend-500 to-ascend-600 hover:from-ascend-400 hover:to-ascend-500
                           text-white shadow-xl shadow-ascend-500/25 hover:shadow-ascend-500/40
                           transition-all flex items-center justify-center gap-2
                           active:scale-[0.98] min-h-[52px] sm:min-h-[56px]"
                >
                  Start Free — No Credit Card
                  <span className="w-5 h-5"><Icons.ArrowRight /></span>
                </button>
                <button
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg
                           border border-[var(--border)] hover:bg-[var(--surface-hover)] 
                           transition-colors flex items-center justify-center gap-2
                           active:scale-[0.98] min-h-[52px] sm:min-h-[56px]"
                >
                  <span className="w-5 h-5 text-ascend-400"><Icons.Play /></span>
                  See How It Works
                </button>
              </div>
            </AnimatedSection>

            {/* Trust Badges */}
            <AnimatedSection delay={400}>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-10 md:mb-16">
                {trustBadges.map((badge, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full 
                             bg-[var(--surface)] border border-[var(--border)]"
                  >
                    <span className="w-4 h-4 text-ascend-400"><badge.icon /></span>
                    <div className="text-left">
                      <p className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">{badge.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Stats */}
            <AnimatedSection delay={500}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="relative p-4 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]
                             hover:border-ascend-500/30 transition-colors group"
                  >
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] 
                                  group-hover:text-ascend-400 transition-colors">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-[var(--text-muted)]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* App Preview */}
          <AnimatedSection delay={600} className="mt-12 md:mt-20">
            <div className="relative mx-auto max-w-5xl">
              {/* Floating Elements */}
              <FloatingBadge className="hidden md:flex -top-4 -left-4 text-emerald-400" delay={0}>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3"><Icons.Check /></span>
                  7-day streak!
                </span>
              </FloatingBadge>
              <FloatingBadge className="hidden md:flex -top-4 -right-8 text-amber-400" delay={500}>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3"><Icons.Trophy /></span>
                  +250 XP earned
                </span>
              </FloatingBadge>
              <FloatingBadge className="hidden lg:flex -bottom-4 -left-8 text-purple-400" delay={1000}>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3"><Icons.Sparkles /></span>
                  Level 14 achieved!
                </span>
              </FloatingBadge>

              {/* Main Preview Card */}
              <div className="relative rounded-2xl md:rounded-3xl border border-[var(--border)] overflow-hidden 
                            shadow-2xl shadow-black/20 bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
                {/* Browser Chrome */}
                <div className="hidden sm:flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-lg bg-[var(--background)] text-xs text-[var(--text-muted)]">
                      app.ascend.ai
                    </div>
                  </div>
                </div>

                {/* App Preview Content */}
                <div className="aspect-[16/10] sm:aspect-[16/9] p-4 sm:p-6 lg:p-10 bg-gradient-to-br from-[var(--background)] to-[var(--surface)]">
                  <div className="h-full flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-ascend-500/20 flex items-center justify-center">
                          <span className="w-4 h-4 sm:w-5 sm:h-5 text-ascend-400"><Icons.Mountain /></span>
                        </div>
                        <div>
                          <div className="h-3 sm:h-4 w-20 sm:w-24 bg-[var(--text-primary)]/10 rounded animate-pulse" />
                          <div className="h-2 sm:h-3 w-14 sm:w-16 bg-[var(--text-muted)]/10 rounded mt-1 animate-pulse animation-delay-200" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-7 sm:h-8 w-16 sm:w-20 bg-ascend-500/20 rounded-lg animate-pulse animation-delay-400" />
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="flex-1 grid grid-cols-3 gap-3 sm:gap-4">
                      <div className="col-span-2 space-y-3 sm:space-y-4">
                        {/* Habit Cards */}
                        <div className="h-24 sm:h-32 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 
                                      border border-emerald-500/20 p-3 sm:p-4 animate-pulse animation-delay-600">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500/30" />
                            <div className="h-3 w-20 bg-emerald-500/20 rounded" />
                          </div>
                          <div className="flex gap-1">
                            {[...Array(7)].map((_, i) => (
                              <div key={i} className={cn(
                                "flex-1 h-6 sm:h-8 rounded",
                                i < 5 ? "bg-emerald-500/40" : "bg-emerald-500/10"
                              )} />
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div className="h-20 sm:h-24 rounded-xl bg-[var(--surface)] border border-[var(--border)] animate-pulse animation-delay-800" />
                          <div className="h-20 sm:h-24 rounded-xl bg-[var(--surface)] border border-[var(--border)] animate-pulse animation-delay-1000" />
                        </div>
                      </div>
                      
                      {/* Sidebar */}
                      <div className="space-y-3 sm:space-y-4">
                        <div className="h-16 sm:h-20 rounded-xl bg-gradient-to-br from-ascend-500/10 to-ascend-500/5 
                                      border border-ascend-500/20 animate-pulse animation-delay-1200" />
                        <div className="h-16 sm:h-20 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 
                                      border border-amber-500/20 animate-pulse animation-delay-1400" />
                        <div className="h-16 sm:h-20 rounded-xl bg-[var(--surface)] border border-[var(--border)] 
                                      animate-pulse animation-delay-1600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          SOCIAL PROOF BANNER
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-8 md:py-12 border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <p className="text-sm text-[var(--text-muted)]">Trusted by achievers at</p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {['Google', 'Meta', 'Apple', 'Microsoft', 'Amazon'].map((company) => (
                <span 
                  key={company} 
                  className="text-lg md:text-xl font-semibold text-[var(--text-muted)]/50 hover:text-[var(--text-muted)] transition-colors"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          FEATURES SECTION
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="features" className="relative py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Everything You Need to <span className="text-ascend-400">Transform</span>
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              One powerful system to become your ideal self. AI does the planning, you do the becoming.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div
                  className={cn(
                    "group p-6 sm:p-8 rounded-2xl border transition-all duration-300",
                    feature.bgColor,
                    feature.borderColor,
                    "hover:scale-[1.02] hover:shadow-xl"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 sm:mb-6",
                    feature.color
                  )}>
                    <span className="w-6 h-6 sm:w-7 sm:h-7 text-white"><feature.icon /></span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          HOW IT WORKS SECTION
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              How <span className="text-gold-400">ASCEND</span> Works
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Three simple steps to transform your life
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-12">
            {[
              {
                step: '01',
                title: 'Set Your Ultimate Goal',
                description: 'Tell us what you want to achieve. Launching a business, getting fit, learning a new skill—dream big.',
                icon: Icons.Target,
                color: 'from-emerald-500 to-teal-600',
              },
              {
                step: '02',
                title: 'AI Creates Your Plan',
                description: 'Our AI breaks down your goal into milestones, weekly objectives, and daily tasks tailored to your timeline.',
                icon: Icons.Brain,
                color: 'from-purple-500 to-violet-600',
              },
              {
                step: '03',
                title: 'Track & Level Up',
                description: 'Complete daily tasks, build habits, earn XP, and watch your progress compound into real results.',
                icon: Icons.Trophy,
                color: 'from-amber-500 to-orange-600',
              },
            ].map((item, index) => (
              <AnimatedSection key={index} delay={index * 150} className="relative">
                <div className="text-center">
                  <div className={cn(
                    "inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mb-6",
                    "bg-gradient-to-br shadow-lg",
                    item.color
                  )}>
                    <span className="w-8 h-8 sm:w-10 sm:h-10 text-white"><item.icon /></span>
                  </div>
                  <div className="text-xs sm:text-sm text-ascend-400 font-bold mb-2 tracking-wider">STEP {item.step}</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
                </div>
                
                {/* Connector Arrow */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 -right-3 lg:-right-6">
                    <span className="w-6 h-6 lg:w-8 lg:h-8 text-[var(--border)]"><Icons.ChevronRight /></span>
                  </div>
                )}
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          COMPARISON SECTION
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose <span className="text-ascend-400">ASCEND</span>?
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              See how we compare to other popular habit tracking apps
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full min-w-[600px] border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 text-[var(--text-muted)] font-medium text-sm">Feature</th>
                    <th className="p-4 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl 
                                    bg-gradient-to-r from-ascend-500/20 to-gold-400/20 
                                    border border-ascend-500/30">
                        <span className="w-4 h-4 text-ascend-400"><Icons.Mountain /></span>
                        <span className="font-bold text-ascend-400">ASCEND</span>
                      </div>
                    </th>
                    <th className="p-4 text-center text-[var(--text-muted)] text-sm">Habitica</th>
                    <th className="p-4 text-center text-[var(--text-muted)] text-sm">Streaks</th>
                    <th className="p-4 text-center text-[var(--text-muted)] text-sm">Todoist</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="border-t border-[var(--border)]">
                      <td className="p-4 text-[var(--text-secondary)]">{row.feature}</td>
                      <td className="p-4 text-center">
                        {row.ascend ? (
                          <span className="w-5 h-5 text-emerald-400 mx-auto block"><Icons.Check /></span>
                        ) : (
                          <span className="w-5 h-5 text-[var(--text-muted)]/30 mx-auto block"><Icons.X /></span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.habitica ? (
                          <span className="w-5 h-5 text-[var(--text-muted)] mx-auto block"><Icons.Check /></span>
                        ) : (
                          <span className="w-5 h-5 text-[var(--text-muted)]/30 mx-auto block"><Icons.X /></span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.streaks ? (
                          <span className="w-5 h-5 text-[var(--text-muted)] mx-auto block"><Icons.Check /></span>
                        ) : (
                          <span className="w-5 h-5 text-[var(--text-muted)]/30 mx-auto block"><Icons.X /></span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.todoist ? (
                          <span className="w-5 h-5 text-[var(--text-muted)] mx-auto block"><Icons.Check /></span>
                        ) : (
                          <span className="w-5 h-5 text-[var(--text-muted)]/30 mx-auto block"><Icons.X /></span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-xs text-[var(--text-muted)] mt-6">
              Comparison as of February 2026. Features may have changed.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          PRICING SECTION
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="relative py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Simple, Transparent <span className="text-ascend-400">Pricing</span>
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Start free, upgrade when you&apos;re ready. No hidden fees.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div
                  className={cn(
                    "relative rounded-2xl p-6 sm:p-8 border transition-all duration-300 h-full flex flex-col",
                    plan.popular
                      ? "bg-gradient-to-b from-ascend-500/10 to-transparent border-ascend-500/30 md:scale-105 shadow-xl shadow-ascend-500/10"
                      : "bg-[var(--background)] border-[var(--border)] hover:border-[var(--text-muted)]/30"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full
                                  bg-gradient-to-r from-ascend-500 to-ascend-600 text-xs font-semibold text-white">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-[var(--text-muted)]">{plan.description}</p>
                  </div>
                  
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl sm:text-5xl font-bold">{plan.price}</span>
                    <span className="text-[var(--text-muted)]">{plan.period}</span>
                  </div>

                  <button
                    onClick={onGetStarted}
                    className={cn(
                      "w-full py-3 rounded-xl font-semibold transition-all mb-6 min-h-[48px]",
                      plan.popular
                        ? "bg-gradient-to-r from-ascend-500 to-ascend-600 hover:from-ascend-400 hover:to-ascend-500 text-white shadow-lg shadow-ascend-500/25"
                        : "bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)]"
                    )}
                  >
                    {plan.cta}
                  </button>

                  <div className="space-y-3 flex-1">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <span className="w-4 h-4 text-emerald-400 shrink-0"><Icons.Check /></span>
                        <span className="text-[var(--text-secondary)]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Money Back Guarantee */}
          <AnimatedSection delay={400} className="mt-10 md:mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--background)] border border-[var(--border)]">
              <span className="w-6 h-6 text-emerald-400"><Icons.Shield /></span>
              <span className="text-sm">
                <span className="font-semibold">30-day money back guarantee.</span>
                <span className="text-[var(--text-muted)]"> No questions asked.</span>
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          TESTIMONIALS SECTION
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="relative py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Loved by <span className="text-gold-400">Thousands</span>
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Join achievers who have transformed their lives with ASCEND
            </p>
          </AnimatedSection>

          {/* Featured Testimonial */}
          <AnimatedSection delay={200} className="mb-12">
            <div className="relative max-w-4xl mx-auto">
              <div className="relative p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-[var(--surface)] to-[var(--background)] 
                            border border-[var(--border)] overflow-hidden">
                {/* Quote Icon */}
                <div className="absolute top-6 left-6 text-6xl text-ascend-500/10 font-serif">&ldquo;</div>
                
                <div className="relative">
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="w-5 h-5 text-gold-400"><Icons.Star /></span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-lg sm:text-xl lg:text-2xl text-[var(--text-primary)] leading-relaxed mb-6">
                    &ldquo;{testimonials[activeTestimonial].content}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-ascend-500 to-gold-400
                                    flex items-center justify-center text-lg font-bold text-white">
                        {testimonials[activeTestimonial].avatar}
                      </div>
                      <div>
                        <p className="font-semibold">{testimonials[activeTestimonial].name}</p>
                        <p className="text-sm text-[var(--text-muted)]">
                          {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-sm font-medium text-emerald-400">
                        {testimonials[activeTestimonial].metric}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial Navigation */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      activeTestimonial === index 
                        ? "w-8 bg-ascend-500" 
                        : "bg-[var(--border)] hover:bg-[var(--text-muted)]"
                    )}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Testimonial Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <AnimatedSection key={index} delay={300 + index * 100}>
                <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="w-4 h-4 text-gold-400"><Icons.Star /></span>
                    ))}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 line-clamp-4">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ascend-500 to-gold-400
                                  flex items-center justify-center text-sm font-bold text-white">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          FAQ SECTION
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="relative py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Frequently Asked <span className="text-ascend-400">Questions</span>
            </h2>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Everything you need to know about ASCEND
            </p>
          </AnimatedSection>

          <div className="space-y-3" itemScope itemType="https://schema.org/FAQPage">
            {faqs.map((faq, index) => (
              <AnimatedSection key={index} delay={index * 50}>
                <div
                  className="rounded-xl border border-[var(--border)] bg-[var(--background)] overflow-hidden"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex items-center justify-between w-full p-4 sm:p-6 text-left min-h-[60px]"
                    aria-expanded={openFaq === index}
                  >
                    <h3 className="font-semibold pr-4 text-sm sm:text-base" itemProp="name">{faq.question}</h3>
                    <span className={cn(
                      "w-5 h-5 text-[var(--text-muted)] shrink-0 transition-transform duration-200",
                      openFaq === index && "rotate-180"
                    )}>
                      <Icons.ChevronDown />
                    </span>
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      openFaq === index ? "max-h-96" : "max-h-0"
                    )}
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p 
                      className="px-4 sm:px-6 pb-4 sm:pb-6 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed"
                      itemProp="text"
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          FINAL CTA SECTION
          ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                         bg-gold-400/10 border border-gold-400/20 mb-6 md:mb-8">
              <span className="w-4 h-4 text-gold-400"><Icons.Zap /></span>
              <span className="text-sm font-medium text-gold-400">Start Your Transformation Today</span>
            </div>
          </AnimatedSection>
          
          <AnimatedSection delay={100}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to <span className="text-ascend-400">ASCEND</span>?
            </h2>
          </AnimatedSection>
          
          <AnimatedSection delay={200}>
            <p className="text-base sm:text-lg text-[var(--text-secondary)] mb-8 md:mb-10 max-w-2xl mx-auto">
              Join 50,000+ achievers who have transformed their goals into reality. 
              Start for free, upgrade anytime.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg
                         bg-gradient-to-r from-ascend-500 to-ascend-600 hover:from-ascend-400 hover:to-ascend-500
                         text-white shadow-xl shadow-ascend-500/25 hover:shadow-ascend-500/40
                         transition-all flex items-center justify-center gap-2
                         active:scale-[0.98] min-h-[52px] sm:min-h-[56px]"
              >
                Get Started Free
                <span className="w-5 h-5"><Icons.ArrowRight /></span>
              </button>
              {showInstallButton && (
                <button
                  onClick={handleInstallClick}
                  className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg
                           border border-[var(--border)] hover:bg-[var(--surface-hover)]
                           transition-colors flex items-center justify-center gap-2
                           min-h-[52px] sm:min-h-[56px]"
                >
                  <span className="w-5 h-5"><Icons.Download /></span>
                  Add to Homescreen
                </button>
              )}
            </div>
          </AnimatedSection>

          {/* Final Trust Signals */}
          <AnimatedSection delay={400}>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 text-sm text-[var(--text-muted)]">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 text-emerald-400"><Icons.Shield /></span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 text-emerald-400"><Icons.Clock /></span>
                <span>Setup in 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 text-emerald-400"><Icons.Heart /></span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[var(--border)] py-12 px-4 sm:px-6 lg:px-8 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ascend-500 to-ascend-600 
                              flex items-center justify-center">
                  <span className="w-4 h-4 text-white"><Icons.Mountain /></span>
                </div>
                <span className="font-bold">ASCEND</span>
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                Transform your goals into daily victories with AI-powered planning.
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="w-4 h-4 text-gold-400"><Icons.Star /></span>
                ))}
                <span className="text-sm text-[var(--text-muted)] ml-2">4.9/5 (2,500+ reviews)</span>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li><Link href="/features" className="hover:text-[var(--text-primary)] transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-[var(--text-primary)] transition-colors">Pricing</Link></li>
                <li><Link href="/about" className="hover:text-[var(--text-primary)] transition-colors">About</Link></li>
                <li><a href="#testimonials" className="hover:text-[var(--text-primary)] transition-colors">Testimonials</a></li>
                <li><a href="#faq" className="hover:text-[var(--text-primary)] transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li><Link href="/guides" className="hover:text-[var(--text-primary)] transition-colors">Guides</Link></li>
                <li><Link href="/help" className="hover:text-[var(--text-primary)] transition-colors">Help Center</Link></li>
                <li><Link href="/support" className="hover:text-[var(--text-primary)] transition-colors">Support</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                <li><Link href="/privacy" className="hover:text-[var(--text-primary)] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[var(--text-primary)] transition-colors">Terms of Service</Link></li>
                <li><Link href="/help/cookies" className="hover:text-[var(--text-primary)] transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--text-muted)]">
              © 2026 ASCEND by WEBNESS. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              Made with <span className="w-4 h-4 text-red-400 inline-block"><Icons.Heart /></span> for achievers everywhere
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// TYPE AUGMENTATION
// ─────────────────────────────────────────────────────────────────────────────────

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default LandingPageV2;
