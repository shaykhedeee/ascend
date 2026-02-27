import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support & FAQ',
  description:
    'Get help with Resurgo. Find answers to common questions about habit tracking, goals, gamification, data privacy, and account management.',
  keywords: ['Resurgo support', 'habit tracker help', 'Resurgo faq'],
  openGraph: {
    title: 'Resurgo Support & FAQ',
    description: 'Find answers and get help with Resurgo.',
    url: '/support',
  },
  alternates: { canonical: '/support' },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
