import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support & FAQ - Resurgo | Help with setup, billing, sync, and AI',
  description:
    'Get help with Resurgo setup, billing, sync, offline access, AI coaching, and troubleshooting. Browse the FAQ or contact support.',
  keywords: [
    'Resurgo support', 'Resurgo FAQ', 'Resurgo troubleshooting',
    'AI productivity app support', 'Resurgo billing help', 'Resurgo sync help',
    'offline mode help', 'refund policy', 'Resurgo account help',
  ],
  openGraph: {
    title: 'Resurgo Support & FAQ — Get Help',
    description: 'Find answers about setup, billing, AI coaching, sync, and offline behavior.',
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
    description: 'Frequently asked questions about Resurgo, the AI productivity platform.',
    url: 'https://resurgo.life/support',
    mainEntity: [
      { '@type': 'Question', name: 'How does Resurgo handle messy planning?', acceptedAnswer: { '@type': 'Answer', text: 'Resurgo turns goals, tasks, brain dumps, and coaching prompts into a structured execution workflow with AI guidance and dashboards.' } },
      { '@type': 'Question', name: 'Can I use Resurgo offline?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Installed PWA sessions cache key screens and queue supported actions locally until your connection returns, then sync them back to the cloud.' } },
      { '@type': 'Question', name: 'Where is my data stored?', acceptedAnswer: { '@type': 'Answer', text: 'Your account data is stored in the cloud and synced across devices when you sign in with the same account.' } },
      { '@type': 'Question', name: 'What is included in the Free plan?', acceptedAnswer: { '@type': 'Answer', text: 'The free plan includes up to 3 active goals, 5 brain dumps per day, 10 AI coach messages per day, basic habit tracking, basic Telegram notifications, and Emergency Mode.' } },
      { '@type': 'Question', name: 'Can I cancel my subscription anytime?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, you can cancel your Pro subscription at any time. You will continue to have access until the end of your billing period.' } },
      { '@type': 'Question', name: 'Do you offer refunds?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Pro subscriptions have a 14-day refund window, and Lifetime purchases have a 30-day refund window.' } },
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
