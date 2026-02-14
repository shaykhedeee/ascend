import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { ThemeProvider } from '@/components/ThemeProvider';
import { GoogleAnalytics } from '@/lib/analytics';
import { CustomCursor } from '@/components/Cursor';
import { ErrorTrackingInit } from '@/components/ErrorTrackingInit';
import { AccessibilityProvider } from '@/components/AccessibilityProvider';
import ConvexClientProvider from '@/components/ConvexClientProvider';
import ClerkProviderWrapper from '@/components/ClerkProviderWrapper';

// Base URL for the application (update for production)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ascend-ashen-seven.vercel.app';

// Optimized font loading via next/font (eliminates render-blocking Google Fonts link)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PRIMARY SEO METADATA
  // ═══════════════════════════════════════════════════════════════════════════
  title: {
    default: 'ASCEND | AI-Powered Habit Tracker & Goal Achievement App',
    template: '%s | ASCEND - Smart Habit Tracker',
  },
  description: 'Build better habits with AI-powered goal decomposition. Track habits, achieve goals, and level up your life with gamified progress tracking. Free habit tracker app with smart analytics.',
  keywords: [
    // Primary Keywords
    'habit tracker', 'habit tracking app', 'goal tracker', 'habit builder',
    // Long-tail Keywords  
    'AI habit tracker', 'smart goal setting app', 'gamified habit tracker',
    'daily habit tracker free', 'best habit tracking app 2026',
    'habit tracker with streaks', 'goal decomposition tool',
    // Related Terms
    'productivity app', 'self improvement app', 'personal development',
    'routine builder', 'streak tracker', 'daily planner',
    // Voice Search Queries
    'how to build good habits', 'track my daily habits',
    'app to help achieve goals', 'free habit tracker',
  ],
  authors: [{ name: 'ASCEND Team', url: siteUrl }],
  creator: 'ASCEND',
  publisher: 'ASCEND',
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CANONICAL & ALTERNATE URLs
  // ═══════════════════════════════════════════════════════════════════════════
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PWA & APP METADATA
  // ═══════════════════════════════════════════════════════════════════════════
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ASCEND',
    startupImage: [
      {
        url: '/icons/splash-1170x2532.png',
        media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)',
      },
    ],
  },
  applicationName: 'ASCEND',
  
  // ═══════════════════════════════════════════════════════════════════════════
  // OPEN GRAPH (FACEBOOK, LINKEDIN, ETC.)
  // ═══════════════════════════════════════════════════════════════════════════
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'ASCEND',
    title: 'ASCEND | AI-Powered Habit Tracker & Goal Achievement',
    description: 'Build lasting habits with AI goal decomposition. Track progress, earn XP, and level up your life. Join 50K+ users achieving their goals.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ASCEND - AI-Powered Habit Tracker with gamified progress tracking',
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 1200,
        height: 1200,
        alt: 'ASCEND Habit Tracker App',
        type: 'image/png',
      },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TWITTER CARD
  // ═══════════════════════════════════════════════════════════════════════════
  twitter: {
    card: 'summary_large_image',
    site: '@ascendapp',
    creator: '@ascendapp',
    title: 'ASCEND | AI Habit Tracker That Makes Goals Achievable',
    description: 'Transform big goals into daily wins. AI-powered decomposition + gamified tracking = unstoppable progress. Try free!',
    images: {
      url: '/twitter-image.png',
      alt: 'ASCEND - Build Better Habits with AI',
    },
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ROBOTS & INDEXING
  // ═══════════════════════════════════════════════════════════════════════════
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification codes — add when available
  // verification: { google: '...', yandex: '...' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // OTHER METADATA
  // ═══════════════════════════════════════════════════════════════════════════
  category: 'productivity',
  classification: 'Habit Tracking Software',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // iTunes app metadata — add when app is published
  // itunes: { appId: 'your-app-store-id', appArgument: siteUrl },
  
  // Additional metadata
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#14B899',
    'msapplication-config': '/browserconfig.xml',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#14B899' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true, // Better accessibility
  viewportFit: 'cover',
  colorScheme: 'dark light',
};

// ═══════════════════════════════════════════════════════════════════════════════
// JSON-LD STRUCTURED DATA
// ═══════════════════════════════════════════════════════════════════════════════
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // Software Application Schema
    {
      '@type': 'SoftwareApplication',
      'name': 'ASCEND',
      'applicationCategory': 'LifestyleApplication',
      'applicationSubCategory': 'Productivity',
      'operatingSystem': 'Web, iOS, Android',
      'offers': [
        {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD',
          'name': 'Free Plan',
          'description': 'Basic habit tracking with up to 3 habits',
        },
        {
          '@type': 'Offer',
          'price': '9',
          'priceCurrency': 'USD',
          'name': 'Pro Plan',
          'priceValidUntil': '2026-12-31',
          'description': 'Unlimited habits, AI goal decomposition, advanced analytics',
        },
        {
          '@type': 'Offer',
          'price': '149',
          'priceCurrency': 'USD',
          'name': 'Lifetime Access',
          'description': 'One-time payment for lifetime access to all features',
        },
      ],
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'ratingCount': '2847',
        'bestRating': '5',
        'worstRating': '1',
      },
      'description': 'AI-powered habit tracker with goal decomposition, gamified progress tracking, and detailed analytics.',
      'featureList': [
        'AI Goal Decomposition',
        'Habit Streak Tracking',
        'Gamified Progress with XP and Levels',
        'Advanced Analytics Dashboard',
        'Calendar View',
        'Data Export',
        'Dark/Light Theme',
      ],
      'screenshot': 'https://ascend.app/screenshots/dashboard.png',
      'softwareVersion': '2.0',
    },
    // Organization Schema
    {
      '@type': 'Organization',
      'name': 'ASCEND',
      'url': 'https://ascend.app',
      'logo': 'https://ascend.app/icons/icon.svg',
      'sameAs': [
        'https://twitter.com/ascendapp',
        'https://linkedin.com/company/ascendapp',
        'https://instagram.com/ascendapp',
      ],
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'customer support',
        'email': 'support@ascend.app',
      },
    },
    // WebSite Schema for Sitelinks Search Box
    {
      '@type': 'WebSite',
      'name': 'ASCEND',
      'url': 'https://ascend.app',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://ascend.app/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    // FAQ Schema for common questions
    {
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is ASCEND?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'ASCEND is an AI-powered habit tracking app that helps you break down big goals into achievable daily tasks. It features gamified progress tracking with XP and levels, detailed analytics, and privacy-first design.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Is ASCEND free to use?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes! ASCEND offers a free plan with up to 3 habits and basic analytics. Pro plans start at $9/month for unlimited features, and lifetime access is available for a one-time payment of $149.',
          },
        },
        {
          '@type': 'Question',
          'name': 'How does AI goal decomposition work?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Our AI analyzes your ultimate goal and breaks it down into achievable milestones, weekly objectives, and daily tasks. This makes even the most ambitious goals feel manageable and actionable.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProviderWrapper>
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        {/* Font loaded via next/font - no render-blocking link needed */}
        {/* Puter.js for FREE AI - No API key needed! */}
        <script src="https://js.puter.com/v2/" async />
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('ascend-theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
          {/* Error Tracking */}
          <ErrorTrackingInit />
          
          {/* Google Analytics */}
          <GoogleAnalytics />
          
          {/* Custom Cursor - Desktop Only */}
          <CustomCursor />

          {/* Auth Controls */}
          <header className="fixed top-4 right-4 z-[60] flex items-center gap-2">
            <SignedOut>
              <SignInButton>
                <button className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-sm font-medium hover:bg-[var(--surface-hover)] transition-colors cursor-pointer">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="px-3 py-1.5 rounded-full bg-gradient-to-r from-ascend-500 to-gold-400 text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer">
                  Get started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/billing"
                className="px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-sm font-medium hover:bg-[var(--surface-hover)] transition-colors"
              >
                Billing
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </header>
          
          <ThemeProvider>
            <AccessibilityProvider>
              <ConvexClientProvider>
                {children}
              </ConvexClientProvider>
            </AccessibilityProvider>
          </ThemeProvider>
      </body>
    </html>
    </ClerkProviderWrapper>
  );
}