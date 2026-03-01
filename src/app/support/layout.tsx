import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support & FAQ — Resurgo | Get Help with Habits, Goals & Account',
  description:
    'Get help with Resurgo. Browse 14+ FAQs on habit tracking, AI goal decomposition, habit stacking, XP system, billing, data recovery, and troubleshooting. Email support within 24 hours.',
  keywords: [
    'Resurgo support', 'habit tracker help', 'Resurgo FAQ', 'Resurgo troubleshooting',
    'habit stacking help', 'AI goal decomposition', 'XP system guide', 'Resurgo billing help',
    'productivity app support', 'Resurgo account help', 'data recovery', 'refund policy',
  ],
  openGraph: {
    title: 'Resurgo Support & FAQ — Get Help',
    description: 'Find answers to common questions about habits, goals, billing, and account management.',
    type: 'website',
    url: 'https://resurgo.life/support',
  },
  twitter: {
    card: 'summary',
    title: 'Resurgo Support & FAQ',
    description: 'Find answers and get help with the Resurgo productivity platform.',
  },
  alternates: { canonical: 'https://resurgo.life/support' },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  const supportJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: 'Resurgo Support & FAQ',
    description: 'Frequently asked questions about Resurgo habit tracker and productivity platform.',
    url: 'https://resurgo.life/support',
    mainEntity: [
      { '@type': 'Question', name: 'How does AI Goal Decomposition work?', acceptedAnswer: { '@type': 'Answer', text: 'When you enter your ultimate goal, our AI analyzes it and breaks it down into achievable milestones, weekly objectives, and daily tasks based on your timeline and available time.' } },
      { '@type': 'Question', name: 'Can I use Resurgo offline?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Resurgo is a Progressive Web App (PWA) that works offline. Install it to your home screen for the best experience.' } },
      { '@type': 'Question', name: 'What is Habit Stacking?', acceptedAnswer: { '@type': 'Answer', text: 'Habit Stacking links a new habit to an existing one. For example: After I pour my morning coffee, I will meditate for 2 minutes. This creates powerful habit chains.' } },
      { '@type': 'Question', name: 'What is included in the Free plan?', acceptedAnswer: { '@type': 'Answer', text: 'Free plan includes up to 5 habits, 2 goals, 14-day history, basic analytics, Pomodoro timer, and all core tracking features.' } },
      { '@type': 'Question', name: 'Can I cancel my subscription anytime?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, you can cancel your Pro subscription at any time. You will continue to have access until the end of your billing period.' } },
      { '@type': 'Question', name: 'Do you offer refunds?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! 14-day refund for Pro subscriptions and 30-day refund for Lifetime purchases if you have not extensively used premium features.' } },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(supportJsonLd) }}
      />
      {children}
    </>
  );
}
