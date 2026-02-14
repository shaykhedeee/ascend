// ═══════════════════════════════════════════════════════════════════════════════
// ASCEND - Support & FAQ Page
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import { Mountain, ArrowLeft, ChevronDown, Mail, MessageCircle, Book, Zap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How does AI Goal Decomposition work?',
        a: 'When you enter your ultimate goal, our AI analyzes it and breaks it down into achievable milestones, weekly objectives, and daily tasks. This process considers your timeline, category, and available time to create a personalized action plan.',
      },
      {
        q: 'Is my data stored online or locally?',
        a: 'ASCEND uses a local-first approach. All your habits, goals, and progress data are stored locally on your device. This means your data never leaves your device unless you explicitly choose to export it.',
      },
      {
        q: 'Can I use ASCEND offline?',
        a: 'Yes! ASCEND is a Progressive Web App (PWA) that works offline. Install it to your home screen for the best experience. Your progress will sync when you come back online.',
      },
    ],
  },
  {
    category: 'Features',
    questions: [
      {
        q: 'What is Habit Stacking?',
        a: 'Habit Stacking is a technique from Atomic Habits where you link a new habit to an existing one. For example: "After I pour my morning coffee (existing), I will meditate for 2 minutes (new)." This creates powerful habit chains.',
      },
      {
        q: 'How does the XP and leveling system work?',
        a: 'You earn XP by completing habits, finishing tasks, maintaining streaks, and reaching milestones. As you accumulate XP, you level up and unlock achievements. The system is designed to keep you motivated with regular rewards.',
      },
      {
        q: 'What is the Identity System?',
        a: 'Based on Atomic Habits, the Identity System helps you define who you want to become (e.g., "I am an athlete"). Every completed habit becomes a "vote" for that identity, reinforcing your new self-image.',
      },
      {
        q: 'Can I import data from other apps?',
        a: 'Currently, ASCEND supports importing data in JSON format. If you have exported data from another habit tracker, contact us and we may be able to help with conversion.',
      },
    ],
  },
  {
    category: 'Subscription & Billing',
    questions: [
      {
        q: 'What\'s included in the Free plan?',
        a: 'Free plan includes up to 5 habits, 2 goals, 14-day history, basic analytics, Pomodoro timer, and all core tracking features. It\'s fully functional for most users getting started.',
      },
      {
        q: 'What extra features do Pro users get?',
        a: 'Pro unlocks unlimited habits & goals, AI Goal Decomposition, advanced analytics with charts, full history access, data export, Identity System, and Habit Stacking features.',
      },
      {
        q: 'Can I cancel my subscription anytime?',
        a: 'Yes, you can cancel your Pro subscription at any time. You\'ll continue to have access until the end of your billing period. Lifetime purchases are non-recurring and never expire.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'Yes! We offer a 14-day refund for Pro subscriptions and 30-day refund for Lifetime purchases if you haven\'t extensively used premium features. Contact support for assistance.',
      },
    ],
  },
  {
    category: 'Troubleshooting',
    questions: [
      {
        q: 'My data disappeared. How do I recover it?',
        a: 'ASCEND stores data in your browser\'s local storage. If you cleared your browser data, the information may be lost. We recommend regularly exporting your data as a backup. Check if you\'re logged into the same browser/device.',
      },
      {
        q: 'The app isn\'t loading properly.',
        a: 'Try these steps: 1) Refresh the page, 2) Clear your browser cache, 3) Try a different browser, 4) Disable browser extensions that might interfere. If issues persist, contact support.',
      },
      {
        q: 'How do I reset my progress?',
        a: 'Go to Settings > Account > Reset Data. This will clear all your habits, goals, and progress. This action cannot be undone, so export your data first if you want a backup.',
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="font-medium text-white/90 group-hover:text-white transition-colors pr-4">
          {question}
        </span>
        <ChevronDown 
          className={cn(
            "w-5 h-5 text-white/50 flex-shrink-0 transition-transform",
            isOpen && "rotate-180"
          )} 
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-white/60 leading-relaxed animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ascend-500 to-ascend-600 
                          flex items-center justify-center">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">ASCEND</span>
            <span className="text-white/50 group-hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back
            </span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-4 sm:px-6 text-center border-b border-white/5">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">How can we help?</h1>
          <p className="text-white/60 text-lg">
            Find answers to common questions or reach out to our support team.
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 px-4 sm:px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            <a 
              href="mailto:support@ascend.app"
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-ascend-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-ascend-400" />
              </div>
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-white/50">support@ascend.app</p>
              </div>
            </a>
            
            <a 
              href="#faq"
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="font-medium">FAQ</p>
                <p className="text-sm text-white/50">Quick answers</p>
              </div>
            </a>
            
            <a 
              href="#getting-started"
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-gold-400/20 flex items-center justify-center">
                <Book className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <p className="font-medium">Getting Started</p>
                <p className="text-sm text-white/50">New user guide</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <main id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
        
        <div className="space-y-8">
          {faqs.map((section) => (
            <div key={section.category}>
              <h3 className="text-lg font-semibold text-ascend-400 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                {section.category}
              </h3>
              <div className="bg-white/[0.02] rounded-xl border border-white/5 overflow-hidden">
                <div className="divide-y divide-white/5">
                  {section.questions.map((faq, index) => (
                    <div key={index} className="px-6">
                      <FAQItem question={faq.q} answer={faq.a} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-ascend-500/10 to-purple-500/10 border border-ascend-500/20 text-center">
          <h3 className="text-xl font-bold mb-2">Still need help?</h3>
          <p className="text-white/60 mb-6">
            Our support team typically responds within 24 hours.
          </p>
          <a 
            href="mailto:support@ascend.app"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                     bg-gradient-to-r from-ascend-500 to-ascend-600 hover:from-ascend-400 hover:to-ascend-500
                     transition-all"
          >
            <Mail className="w-5 h-5" />
            Contact Support
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center text-white/40 text-sm">
          © 2026 ASCEND. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
