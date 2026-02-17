import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support & FAQ',
  description:
    'Get help with Ascendify. Find answers to common questions about habit tracking, goals, gamification, data privacy, and account management.',
  keywords: ['ascendify support', 'habit tracker help', 'ascendify faq'],
  openGraph: {
    title: 'Ascendify Support & FAQ',
    description: 'Find answers and get help with Ascendify.',
    url: '/support',
  },
  alternates: { canonical: '/support' },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
