// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Meta Pixel (Facebook Pixel) Client-Side Integration
// Loads the fbq pixel and exposes standard + custom event tracking
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import Script from 'next/script';
import { useEffect, useCallback } from 'react';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
const PIXEL_ENABLED =
  typeof window !== 'undefined' &&
  !!PIXEL_ID &&
  PIXEL_ID !== 'REPLACE_ME_WITH_PIXEL_ID';

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DECLARATIONS
// ─────────────────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    fbq: (
      type: string,
      eventName: string,
      params?: Record<string, unknown>,
      options?: { eventID?: string }
    ) => void;
    _fbq: typeof Window.prototype.fbq;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// META PIXEL SCRIPT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Renders the Meta Pixel base code. Place in RootLayout alongside GoogleAnalytics.
 * Only renders when NEXT_PUBLIC_META_PIXEL_ID is set.
 */
export function MetaPixel() {
  if (!PIXEL_ID || PIXEL_ID === 'REPLACE_ME_WITH_PIXEL_ID') {
    return null;
  }

  return (
    <>
      {/* Meta Pixel base code */}
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      {/* Meta Pixel noscript fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT-SIDE EVENT TRACKING FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Track a standard Meta Pixel event.
 * Uses `track` for standard events, `trackCustom` for custom events.
 */
export function fbqTrack(
  eventName: string,
  params?: Record<string, unknown>,
  eventId?: string
): void {
  if (typeof window === 'undefined' || !window.fbq || !PIXEL_ENABLED) return;

  const options = eventId ? { eventID: eventId } : undefined;

  // Standard events that Meta recognizes
  const standardEvents = [
    'AddPaymentInfo',
    'AddToCart',
    'AddToWishlist',
    'CompleteRegistration',
    'Contact',
    'CustomizeProduct',
    'Donate',
    'FindLocation',
    'InitiateCheckout',
    'Lead',
    'PageView',
    'Purchase',
    'Schedule',
    'Search',
    'StartTrial',
    'SubmitApplication',
    'Subscribe',
    'ViewContent',
  ];

  if (standardEvents.includes(eventName)) {
    window.fbq('track', eventName, params, options);
  } else {
    window.fbq('trackCustom', eventName, params, options);
  }
}

/**
 * Track a page view (call on SPA route changes)
 */
export function fbqPageView(): void {
  if (typeof window === 'undefined' || !window.fbq || !PIXEL_ENABLED) return;
  window.fbq('track', 'PageView');
}

// ─────────────────────────────────────────────────────────────────────────────
// RESURGO-SPECIFIC PIXEL EVENTS
// ─────────────────────────────────────────────────────────────────────────────

export const metaPixelEvents = {
  /** User completes sign-up */
  signUp: (method: string = 'email') => {
    fbqTrack('CompleteRegistration', {
      content_name: 'Resurgo Free Account',
      status: 'completed',
      registration_method: method,
    });
  },

  /** User views pricing page */
  viewPricing: () => {
    fbqTrack('ViewContent', {
      content_name: 'Pricing Page',
      content_category: 'pricing',
      content_type: 'product',
    });
  },

  /** User starts checkout for a plan */
  initiateCheckout: (plan: string, value: number, currency: string = 'USD') => {
    fbqTrack('InitiateCheckout', {
      content_name: `Resurgo ${plan}`,
      content_category: 'subscription',
      content_ids: [plan],
      content_type: 'product',
      value,
      currency,
      num_items: 1,
    });
  },

  /** User completes purchase */
  purchase: (plan: string, value: number, currency: string = 'USD', orderId?: string) => {
    fbqTrack('Purchase', {
      content_name: `Resurgo ${plan}`,
      content_category: 'subscription',
      content_ids: [plan],
      content_type: 'product',
      value,
      currency,
      num_items: 1,
      order_id: orderId,
    });
  },

  /** User starts a trial */
  startTrial: (plan: string) => {
    fbqTrack('StartTrial', {
      content_name: `Resurgo ${plan} Trial`,
      content_category: 'subscription',
      value: 0,
      currency: 'USD',
    });
  },

  /** Email capture / lead gen */
  lead: (source: string = 'marketing') => {
    fbqTrack('Lead', {
      content_name: 'Email Capture',
      content_category: source,
    });
  },

  /** User views a blog article or content page */
  viewContent: (contentName: string, contentCategory: string = 'blog') => {
    fbqTrack('ViewContent', {
      content_name: contentName,
      content_category: contentCategory,
      content_type: 'article',
    });
  },

  /** User installs PWA */
  appInstall: () => {
    fbqTrack('AppInstall', {
      content_name: 'PWA Install',
      content_category: 'app',
    });
  },

  /** User clicks a CTA button */
  ctaClick: (ctaName: string, page: string) => {
    fbqTrack('CTAClick', {
      content_name: ctaName,
      content_category: page,
    });
  },

  /** User completes onboarding */
  completeOnboarding: (step: number) => {
    fbqTrack('CompleteOnboarding', {
      content_name: `Onboarding Step ${step}`,
      status: 'completed',
    });
  },

  /** User creates their first goal */
  createFirstGoal: () => {
    fbqTrack('CreateFirstGoal', {
      content_name: 'First Goal Created',
      content_category: 'activation',
    });
  },

  /** User hits 7-day streak */
  weekStreak: () => {
    fbqTrack('WeekStreak', {
      content_name: '7-Day Streak',
      content_category: 'engagement',
    });
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE CHANGE TRACKER HOOK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook that fires PageView on mount. Use in route-level layouts/pages
 * to track SPA navigations.
 */
export function useMetaPixelPageView(): void {
  useEffect(() => {
    fbqPageView();
  }, []);
}

// ─────────────────────────────────────────────────────────────────────────────
// COOKIE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extract Meta cookie values for server-side deduplication (CAPI).
 * Call this client-side and send to your API route.
 */
export function getMetaCookies(): { fbc: string | null; fbp: string | null } {
  if (typeof document === 'undefined') return { fbc: null, fbp: null };

  const cookies = document.cookie.split(';').reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );

  return {
    fbc: cookies['_fbc'] || null,
    fbp: cookies['_fbp'] || null,
  };
}

/**
 * Hook that provides a callback to send both Pixel + CAPI events together.
 * Pass this to conversion points for maximum signal quality.
 */
export function useMetaDualTrack() {
  const dualTrack = useCallback(
    async (
      eventName: string,
      params?: Record<string, unknown>,
      serverParams?: Record<string, unknown>
    ) => {
      // 1. Fire client-side pixel event
      fbqTrack(eventName, params);

      // 2. Send server-side CAPI event for deduplication
      const { fbc, fbp } = getMetaCookies();

      try {
        await fetch('/api/marketing/meta/conversions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_name: eventName,
            params: { ...params, ...serverParams },
            fbc,
            fbp,
            source_url: window.location.href,
          }),
          keepalive: true,
        });
      } catch {
        // Fire-and-forget — don't block UI for analytics
      }
    },
    []
  );

  return { dualTrack };
}
