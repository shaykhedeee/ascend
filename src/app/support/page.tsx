'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PixelIcon } from '@/components/PixelIcon';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { TermLinkButton } from '@/components/ui/TermButton';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'What does Resurgo actually help me do?',
        a: 'Resurgo helps you turn messy goals, tasks, and brain dumps into a clear execution system. You can plan with AI, track habits and tasks, review progress, and keep everything synced in one place.',
      },
      {
        q: 'Is my data stored online or locally?',
        a: 'Your account data is stored in the cloud and syncs across devices when you sign into the same account. Installed PWA sessions can still cache key screens and queue supported actions while you are offline.',
      },
      {
        q: 'Can I use RESURGO offline?',
        a: 'Yes. Install Resurgo as a PWA for the best experience. Key screens stay available offline, and supported actions such as queued planning updates sync when your connection comes back.',
      },
    ],
  },
  {
    category: 'Features',
    questions: [
      {
        q: 'How do the AI coaches work?',
        a: 'Resurgo includes multiple AI coaching personas for planning, focus, wellness, finances, resilience, and systems thinking. Free users get limited daily usage, while paid plans unlock the full coaching roster and higher-volume workflows.',
      },
      {
        q: 'What is included on the Free plan?',
        a: 'The Free plan includes up to 3 active goals, 5 brain dumps per day, 10 AI coach messages per day, basic habit tracking, basic Telegram notifications, and Emergency Mode.',
      },
      {
        q: 'What do paid plans unlock?',
        a: 'Paid plans unlock unlimited goals, habits, and brain dumps, the full set of AI coaches, advanced analytics, wellness and budget tracking, weekly AI reviews, and premium integrations like richer Telegram workflows.',
      },
      {
        q: 'Can I install it like an app?',
        a: 'Yes. Resurgo is installable as a Progressive Web App on desktop and mobile, and Android users can also use the packaged release when one is published.',
      },
    ],
  },
  {
    category: 'Subscription & Billing',
    questions: [
      {
        q: 'What\'s included in the Free plan?',
        a: 'The Free plan includes up to 3 active goals, 5 brain dumps per day, 10 AI coach messages per day, basic habit tracking, basic Telegram notifications, and Emergency Mode.',
      },
      {
        q: 'What extra features do Pro users get?',
        a: 'Pro unlocks unlimited goals, habits, and brain dumps, all AI coaches, advanced analytics, export tools, premium planning workflows, and faster support.',
      },
      {
        q: 'Can I cancel my subscription anytime?',
        a: 'Yes, you can cancel your Pro subscription at any time. You\'ll continue to have access until the end of your billing period. Lifetime purchases are non-recurring and never expire.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'Yes. We offer a 14-day refund window for Pro subscriptions and a 30-day refund window for Lifetime purchases. Contact support and we will help quickly.',
      },
    ],
  },
  {
    category: 'Troubleshooting',
    questions: [
      {
        q: 'My dashboard looks empty. How do I recover it?',
        a: 'First confirm you are signed into the correct account. Because data syncs through the cloud, logging into the same account on another device is the fastest way to verify whether the issue is local cache or account related.',
      },
      {
        q: 'The app isn\'t loading properly.',
        a: 'Try these steps: 1) hard refresh the page, 2) sign out and back in, 3) update your browser, 4) reinstall the PWA if you use it, and 5) disable conflicting extensions. If that still fails, email support with screenshots and device details.',
      },
      {
        q: 'How do I export or delete my data?',
        a: 'Use Settings for export and account-management actions. If you want help before deleting anything, contact support and we can point you to the safest path first.',
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
        <PixelIcon
          name="chevron-right"
          size={16}
          className={cn(
            'text-white/50 flex-shrink-0 transition-transform',
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
      <MarketingHeader
        navLinks={[
          { href: '/features', label: 'Features', icon: 'grid' },
          { href: '/pricing', label: 'Pricing', icon: 'star' },
          { href: '/guides', label: 'Guides', icon: 'plan' },
          { href: '/blog', label: 'Blog', icon: 'terminal' },
          { href: '/support', label: 'Support', icon: 'message' },
        ]}
        tickerText="RESURGO.life :: SUPPORT_TERMINAL_READY :: HUMAN_REPLY_WINDOW_24H"
      />

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
              href="mailto:support@resurgo.life"
              className="flex items-center gap-4 p-4 border border-zinc-800 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-900 transition-all"
            >
              <div className="w-10 h-10 border border-orange-900 bg-orange-950/30 flex items-center justify-center">
                <PixelIcon name="message" size={18} className="text-orange-400" />
              </div>
              <div>
                <p className="font-mono text-sm font-bold text-zinc-200">Email Support</p>
                <p className="font-mono text-xs text-zinc-500">support@resurgo.life</p>
              </div>
            </a>
            
            <a 
              href="#faq"
              className="flex items-center gap-4 p-4 border border-zinc-800 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-900 transition-all"
            >
              <div className="w-10 h-10 border border-purple-900 bg-purple-950/30 flex items-center justify-center">
                <PixelIcon name="terminal" size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="font-mono text-sm font-bold text-zinc-200">FAQ</p>
                <p className="font-mono text-xs text-zinc-500">Quick answers</p>
              </div>
            </a>
            
            <a 
              href="/download"
              className="flex items-center gap-4 p-4 border border-zinc-800 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-900 transition-all"
            >
              <div className="w-10 h-10 border border-amber-900 bg-amber-950/30 flex items-center justify-center">
                <PixelIcon name="arrow-down" size={18} className="text-amber-400" />
              </div>
              <div>
                <p className="font-mono text-sm font-bold text-zinc-200">Install Guide</p>
                <p className="font-mono text-xs text-zinc-500">PWA and Android setup</p>
              </div>
            </a>

            <a 
              href="/pricing"
              className="flex items-center gap-4 p-4 border border-zinc-800 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-900 transition-all sm:col-span-3"
            >
              <div className="w-10 h-10 border border-green-900 bg-green-950/30 flex items-center justify-center">
                <PixelIcon name="star" size={18} className="text-green-400" />
              </div>
              <div>
                <p className="font-mono text-sm font-bold text-zinc-200">Billing and plan options</p>
                <p className="font-mono text-xs text-zinc-500">Compare Free, Pro, Yearly, and Lifetime</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <main id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-mono text-2xl font-bold text-zinc-100 mb-8">Frequently Asked Questions</h2>
        
        <div className="space-y-8">
          {faqs.map((section) => (
            <div key={section.category}>
              <h3 className="font-mono text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
                <PixelIcon name="zap" size={16} />
                {section.category}
              </h3>
              <div className="border border-zinc-800 bg-zinc-950 overflow-hidden">
                <div className="divide-y divide-zinc-800">
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
        <div className="mt-12 border border-orange-900/40 bg-orange-950/10 p-8 text-center">
          <h3 className="font-mono text-xl font-bold text-zinc-100 mb-2">Still need help?</h3>
          <p className="font-mono text-sm text-zinc-400 mb-6">
            Our support team typically replies within one business day.
          </p>
          <TermLinkButton
            href="mailto:support@resurgo.life"
            variant="primary"
            size="lg"
            icon={<PixelIcon name="message" size={16} />}
          >
            Contact Support
          </TermLinkButton>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
