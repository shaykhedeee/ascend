// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Content Marketing Metrics Tracker
// Implements the "Metrics that matter most" from MARKETING-SEO-GROWTH-SYSTEM-2026
//
// Tracked metrics:
// 1. sign-up assists from content
// 2. pricing clicks from content
// 3. internal-link depth
// 4. article-to-article continuation rate
// 5. branded search growth (via GA4)
// 6. AI visibility checks (manual → logged)
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Types ───────────────────────────────────────────────────────────────────

export type ContentMetricEvent =
  | 'content_signup_assist'     // user visits content → signs up
  | 'content_pricing_click'     // pricing CTA clicked from a content page
  | 'content_internal_link'     // internal link clicked (track depth)
  | 'content_continuation'      // article → article navigation
  | 'content_cta_click'         // any CTA click on content pages
  | 'content_scroll_depth'      // how far user scrolled (25/50/75/100)
  | 'content_time_on_page'      // time spent reading
  | 'content_exit_intent'       // about to leave
  | 'ai_visibility_check';      // manual AI visibility result logged

export interface ContentMetricPayload {
  event: ContentMetricEvent;
  /** The page path where the event occurred */
  path: string;
  /** Additional properties */
  properties?: Record<string, string | number | boolean>;
}

// ─── Session tracking ────────────────────────────────────────────────────────

let _sessionId: string | null = null;
let _contentJourney: string[] = [];
let _pageEntryTime = 0;
let _scrollMilestones = new Set<number>();

function getSessionId(): string {
  if (_sessionId) return _sessionId;
  if (typeof window === 'undefined') return 'ssr';
  _sessionId = sessionStorage.getItem('rsrg_session') ??
    `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  sessionStorage.setItem('rsrg_session', _sessionId);
  return _sessionId;
}

// ─── Core send function ──────────────────────────────────────────────────────

async function sendMetric(payload: ContentMetricPayload): Promise<void> {
  try {
    // 1. Send to our backend
    await fetch('/api/analytics/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        sessionId: getSessionId(),
        journey: _contentJourney.slice(-5),
        timestamp: Date.now(),
      }),
    }).catch(() => {});

    // 2. Also fire to GA4 if available
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).gtag) {
      const gtag = (window as unknown as Record<string, (...args: unknown[]) => void>).gtag;
      gtag('event', payload.event, {
        event_category: 'content_metrics',
        event_label: payload.path,
        ...(payload.properties ?? {}),
      });
    }
  } catch {
    // Silent fail — analytics should never break UX
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Track a sign-up assist from content. Call when a user on a content page
 * clicks a signup CTA or completes signup.
 */
export function trackSignupAssist(sourcePath: string, ctaLabel?: string) {
  sendMetric({
    event: 'content_signup_assist',
    path: sourcePath,
    properties: { cta_label: ctaLabel ?? 'unknown', link_depth: _contentJourney.length },
  });
}

/**
 * Track pricing page click from content.
 */
export function trackPricingClick(sourcePath: string, ctaLabel?: string) {
  sendMetric({
    event: 'content_pricing_click',
    path: sourcePath,
    properties: { cta_label: ctaLabel ?? 'unknown' },
  });
}

/**
 * Track an internal link click with depth tracking.
 */
export function trackInternalLink(fromPath: string, toPath: string) {
  _contentJourney.push(fromPath);
  sendMetric({
    event: 'content_internal_link',
    path: fromPath,
    properties: {
      destination: toPath,
      link_depth: _contentJourney.length,
    },
  });
}

/**
 * Track article-to-article continuation (related reads, next article).
 */
export function trackContinuation(fromArticle: string, toArticle: string) {
  sendMetric({
    event: 'content_continuation',
    path: fromArticle,
    properties: {
      next_article: toArticle,
      continuation_depth: _contentJourney.filter((p) => p.startsWith('/blog')).length + 1,
    },
  });
}

/**
 * Track any CTA click on a content page.
 */
export function trackContentCTA(path: string, ctaLabel: string, destination: string) {
  sendMetric({
    event: 'content_cta_click',
    path,
    properties: { cta_label: ctaLabel, destination },
  });
}

/**
 * Log an AI visibility check result (manual or automated).
 */
export function trackAIVisibility(query: string, appeared: boolean, position?: number) {
  sendMetric({
    event: 'ai_visibility_check',
    path: '/admin/ai-visibility',
    properties: { query, appeared, position: position ?? -1 },
  });
}

// ─── Automated page-level tracking ──────────────────────────────────────────

/**
 * Call this on every content page mount. Sets up scroll depth + time tracking.
 * Returns a cleanup function for useEffect.
 */
export function initPageTracking(path: string): () => void {
  if (typeof window === 'undefined') return () => {};

  _pageEntryTime = Date.now();
  _scrollMilestones = new Set();
  _contentJourney.push(path);

  // Scroll depth tracking
  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const pct = Math.round((scrollTop / docHeight) * 100);

    for (const milestone of [25, 50, 75, 100]) {
      if (pct >= milestone && !_scrollMilestones.has(milestone)) {
        _scrollMilestones.add(milestone);
        sendMetric({
          event: 'content_scroll_depth',
          path,
          properties: { depth_pct: milestone },
        });
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // Time on page — fire at 30s, 60s, 120s, 300s
  const timers = [30, 60, 120, 300].map((sec) =>
    setTimeout(() => {
      sendMetric({
        event: 'content_time_on_page',
        path,
        properties: { seconds: sec },
      });
    }, sec * 1000)
  );

  return () => {
    window.removeEventListener('scroll', onScroll);
    timers.forEach(clearTimeout);

    // On unmount, fire final time spent
    const elapsed = Math.round((Date.now() - _pageEntryTime) / 1000);
    if (elapsed > 5) {
      sendMetric({
        event: 'content_time_on_page',
        path,
        properties: { seconds: elapsed, final: true },
      });
    }
  };
}

// ─── Link click interceptor (for internal link depth tracking) ───────────────

/**
 * Wrap internal links in content pages with this handler.
 * Usage: <a href="/blog/..." onClick={handleContentLink}>
 */
export function handleContentLink(e: React.MouseEvent<HTMLAnchorElement>) {
  const href = e.currentTarget.getAttribute('href');
  if (!href) return;
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  if (href.startsWith('/')) {
    trackInternalLink(currentPath, href);

    // Check if it's article-to-article
    if (currentPath.startsWith('/blog') && href.startsWith('/blog')) {
      trackContinuation(currentPath, href);
    }
    // Check if going to pricing
    if (href.includes('/pricing')) {
      trackPricingClick(currentPath, e.currentTarget.textContent ?? undefined);
    }
    // Check if going to signup
    if (href.includes('/sign-up') || href.includes('/get-started')) {
      trackSignupAssist(currentPath, e.currentTarget.textContent ?? undefined);
    }
  }
}
