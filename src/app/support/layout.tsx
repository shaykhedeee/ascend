import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support & FAQ',
  description:
    'Get help with ASCEND. Find answers to common questions about habit tracking, goals, gamification, data privacy, and account management.',
  keywords: ['ascend support', 'habit tracker help', 'ascend faq'],
  openGraph: {
    title: 'ASCEND Support & FAQ',
    description: 'Find answers and get help with ASCEND.',
    url: '/support',
  },
  alternates: { canonical: '/support' },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
