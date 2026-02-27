import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — Resurgo',
  description: 'Frequently asked questions about Resurgo productivity platform.',
};

const FAQs = [
  {
    q: 'What is Resurgo?',
    a: 'Resurgo is an AI-powered productivity platform designed for people who are serious about achieving their goals. It combines habit tracking, goal management, AI coaching, focus sessions, and business planning in one integrated terminal-style dashboard.',
  },
  {
    q: 'Is Resurgo free to use?',
    a: 'Yes. Resurgo has a free tier that includes core habit tracking, goals, focus sessions, and AI coaching. Pro users unlock advanced AI models, unlimited goals, business planning tools, API access, and priority support.',
  },
  {
    q: 'How does the AI coaching work?',
    a: 'You select a coach persona (Marcus, Aurora, Titan, Sage, Phoenix, or Nova) and chat with them. Each has a distinct coaching style. The AI remembers context from your recent sessions and tailors advice to your goals and challenges.',
  },
  {
    q: 'Is my data private?',
    a: 'Absolutely. Your journal entries, goals, and personal data are encrypted and never used for advertising or sold to third parties. See our Privacy Policy for full details.',
  },
  {
    q: 'Can I use Resurgo on mobile?',
    a: 'Yes. Resurgo is a Progressive Web App (PWA) — you can install it on iOS or Android. We also have a Telegram bot (@ResurgoBot) for quick habit check-ins on the go.',
  },
  {
    q: 'How do focus sessions work?',
    a: 'Choose a method (Pomodoro 25/5, Deep Work 90 min, Flowtime, or custom), set your intention, and start. The timer tracks your session, logs distractions, and saves your productivity data. You can also activate ambient sounds.',
  },
  {
    q: 'What is the Referral program?',
    a: 'Invite friends using your unique referral link. When 3 friends join and complete onboarding, you get 30 days of Pro free. There\'s no limit on how many referrals you can make.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'Go to Settings → Billing and click Cancel Subscription. You\'ll retain Pro access until the end of your current billing period.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'We offer a 7-day money-back guarantee for new Pro subscribers. Contact support@resurgo.life within 7 days of your first charge.',
  },
  {
    q: 'Is there an API?',
    a: 'Yes. Pro users can generate API keys from the Integrations page. The REST API allows you to read/write goals, habits, and tasks. See /docs for full documentation.',
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-10 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">RESURGO :: FAQ</span>
          </div>
          <div className="p-6 text-center">
            <h1 className="font-mono text-2xl font-bold text-zinc-100">Frequently Asked Questions</h1>
            <p className="mt-2 font-mono text-xs text-zinc-500">Got a question? We probably have the answer.</p>
          </div>
        </div>
        <div className="space-y-3">
          {FAQs.map(({ q, a }, i) => (
            <details key={i} className="group border border-zinc-900 bg-zinc-950">
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-mono text-sm font-bold text-zinc-200 hover:text-zinc-100 select-none">
                {q}
                <span className="ml-4 shrink-0 font-mono text-[9px] text-zinc-400 group-open:hidden">▼</span>
                <span className="ml-4 shrink-0 font-mono text-[9px] text-orange-600 hidden group-open:inline">▲</span>
              </summary>
              <div className="border-t border-zinc-900 px-5 py-4 font-mono text-sm text-zinc-400 leading-relaxed">
                {a}
              </div>
            </details>
          ))}
        </div>
        <div className="mt-8 border border-dashed border-zinc-800 p-6 text-center">
          <p className="font-mono text-sm text-zinc-400">Still have questions?</p>
          <p className="mt-1 font-mono text-sm text-orange-400">support@resurgo.life</p>
        </div>
      </div>
    </main>
  );
}
