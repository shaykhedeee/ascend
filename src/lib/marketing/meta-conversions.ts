// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Meta Conversions API (Server-Side Events)
// Sends high-quality conversion data directly from server → Meta
// Bypasses ad-blockers and iOS ATT restrictions for better attribution
// ═══════════════════════════════════════════════════════════════════════════════

import crypto from 'crypto';

const META_API_BASE = 'https://graph.facebook.com';
const META_API_VERSION = process.env.META_API_VERSION || 'v21.0';
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';
const META_PIXEL_ID = process.env.META_PIXEL_ID || '';
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE || '';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface ServerEvent {
  event_name: string;
  event_time: number;
  event_id?: string;
  event_source_url?: string;
  action_source: 'website' | 'app' | 'email' | 'phone_call' | 'chat' | 'system_generated' | 'other';
  user_data: UserData;
  custom_data?: CustomData;
  opt_out?: boolean;
}

export interface UserData {
  em?: string[];   // SHA256 hashed email(s)
  ph?: string[];   // SHA256 hashed phone(s)
  fn?: string[];   // SHA256 hashed first name(s)
  ln?: string[];   // SHA256 hashed last name(s)
  ct?: string[];   // SHA256 hashed city
  st?: string[];   // SHA256 hashed state
  zp?: string[];   // SHA256 hashed zip
  country?: string[]; // SHA256 hashed country code
  db?: string[];   // SHA256 hashed date of birth
  ge?: string[];   // SHA256 hashed gender
  external_id?: string[]; // SHA256 hashed external ID
  client_ip_address?: string;
  client_user_agent?: string;
  fbc?: string;    // Facebook click ID (from _fbc cookie)
  fbp?: string;    // Facebook browser ID (from _fbp cookie)
}

export interface CustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  num_items?: number;
  order_id?: string;
  search_string?: string;
  status?: string;
  predicted_ltv?: number;
  // Custom properties
  [key: string]: unknown;
}

interface ConversionsApiResponse {
  events_received: number;
  messages: string[];
  fbtrace_id: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HASHING HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

/**
 * Hash user data for Meta Conversions API compliance.
 * All PII must be SHA256-hashed before sending.
 */
export function hashUserData(raw: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  externalId?: string;
  ipAddress?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
}): UserData {
  const ud: UserData = {};

  if (raw.email) ud.em = [sha256(raw.email)];
  if (raw.phone) ud.ph = [sha256(raw.phone.replace(/\D/g, ''))];
  if (raw.firstName) ud.fn = [sha256(raw.firstName)];
  if (raw.lastName) ud.ln = [sha256(raw.lastName)];
  if (raw.city) ud.ct = [sha256(raw.city)];
  if (raw.state) ud.st = [sha256(raw.state)];
  if (raw.zip) ud.zp = [sha256(raw.zip)];
  if (raw.country) ud.country = [sha256(raw.country)];
  if (raw.externalId) ud.external_id = [sha256(raw.externalId)];
  if (raw.ipAddress) ud.client_ip_address = raw.ipAddress; // NOT hashed per Meta docs
  if (raw.userAgent) ud.client_user_agent = raw.userAgent; // NOT hashed per Meta docs
  if (raw.fbc) ud.fbc = raw.fbc; // NOT hashed
  if (raw.fbp) ud.fbp = raw.fbp; // NOT hashed

  return ud;
}

// ─────────────────────────────────────────────────────────────────────────────
// SEND EVENTS TO META CONVERSIONS API
// ─────────────────────────────────────────────────────────────────────────────

export async function sendEvents(events: ServerEvent[]): Promise<ConversionsApiResponse> {
  if (!META_ACCESS_TOKEN || META_ACCESS_TOKEN === 'REPLACE_ME_WITH_SYSTEM_USER_TOKEN') {
    throw new Error('[Meta CAPI] Access token not configured');
  }
  if (!META_PIXEL_ID || META_PIXEL_ID === 'REPLACE_ME_WITH_PIXEL_ID') {
    throw new Error('[Meta CAPI] Pixel ID not configured');
  }

  const url = `${META_API_BASE}/${META_API_VERSION}/${META_PIXEL_ID}/events`;

  const body: Record<string, unknown> = {
    data: events,
    access_token: META_ACCESS_TOKEN,
  };

  // Include test event code if set (for Events Manager debugging)
  if (META_TEST_EVENT_CODE) {
    body.test_event_code = META_TEST_EVENT_CODE;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      `[Meta CAPI] ${json.error?.message || 'Unknown error'} (code: ${json.error?.code})`
    );
  }

  return json as ConversionsApiResponse;
}

// ─────────────────────────────────────────────────────────────────────────────
// HIGH-LEVEL EVENT HELPERS — Resurgo-specific conversion events
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a unique event ID for deduplication between Pixel (client) and CAPI (server).
 */
export function generateEventId(): string {
  return `resurgo_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}

/**
 * Track a new user sign-up (CompleteRegistration standard event)
 */
export async function trackSignUp(params: {
  email?: string;
  userId?: string;
  method?: string;
  ipAddress?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
  sourceUrl?: string;
}): Promise<ConversionsApiResponse> {
  const eventId = generateEventId();

  return sendEvents([
    {
      event_name: 'CompleteRegistration',
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: params.sourceUrl || 'https://resurgo.life/sign-up',
      action_source: 'website',
      user_data: hashUserData({
        email: params.email,
        externalId: params.userId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        fbc: params.fbc,
        fbp: params.fbp,
      }),
      custom_data: {
        content_name: 'Resurgo Free Account',
        status: 'completed',
        registration_method: params.method || 'email',
      },
    },
  ]);
}

/**
 * Track pricing page view (ViewContent standard event)
 */
export async function trackViewPricing(params: {
  email?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
}): Promise<ConversionsApiResponse> {
  return sendEvents([
    {
      event_name: 'ViewContent',
      event_time: Math.floor(Date.now() / 1000),
      event_id: generateEventId(),
      event_source_url: 'https://resurgo.life/pricing',
      action_source: 'website',
      user_data: hashUserData({
        email: params.email,
        externalId: params.userId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        fbc: params.fbc,
        fbp: params.fbp,
      }),
      custom_data: {
        content_name: 'Pricing Page',
        content_category: 'pricing',
        content_type: 'product',
      },
    },
  ]);
}

/**
 * Track beginning of checkout (InitiateCheckout standard event)
 */
export async function trackInitiateCheckout(params: {
  plan: string;
  value: number;
  currency?: string;
  email?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
}): Promise<ConversionsApiResponse> {
  return sendEvents([
    {
      event_name: 'InitiateCheckout',
      event_time: Math.floor(Date.now() / 1000),
      event_id: generateEventId(),
      event_source_url: 'https://resurgo.life/billing',
      action_source: 'website',
      user_data: hashUserData({
        email: params.email,
        externalId: params.userId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        fbc: params.fbc,
        fbp: params.fbp,
      }),
      custom_data: {
        content_name: `Resurgo ${params.plan}`,
        content_category: 'subscription',
        content_ids: [params.plan],
        content_type: 'product',
        value: params.value,
        currency: params.currency || 'USD',
        num_items: 1,
      },
    },
  ]);
}

/**
 * Track completed purchase (Purchase standard event)
 */
export async function trackPurchase(params: {
  plan: string;
  value: number;
  currency?: string;
  orderId?: string;
  email?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
}): Promise<ConversionsApiResponse> {
  return sendEvents([
    {
      event_name: 'Purchase',
      event_time: Math.floor(Date.now() / 1000),
      event_id: generateEventId(),
      event_source_url: 'https://resurgo.life/billing',
      action_source: 'website',
      user_data: hashUserData({
        email: params.email,
        externalId: params.userId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        fbc: params.fbc,
        fbp: params.fbp,
      }),
      custom_data: {
        content_name: `Resurgo ${params.plan}`,
        content_category: 'subscription',
        content_ids: [params.plan],
        content_type: 'product',
        value: params.value,
        currency: params.currency || 'USD',
        num_items: 1,
        order_id: params.orderId,
      },
    },
  ]);
}

/**
 * Track lead generation (Lead standard event) — e.g. email capture on marketing pages
 */
export async function trackLead(params: {
  email: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
  sourceUrl?: string;
}): Promise<ConversionsApiResponse> {
  return sendEvents([
    {
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: generateEventId(),
      event_source_url: params.sourceUrl || 'https://resurgo.life',
      action_source: 'website',
      user_data: hashUserData({
        email: params.email,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        fbc: params.fbc,
        fbp: params.fbp,
      }),
      custom_data: {
        content_name: 'Email Capture',
        content_category: params.source || 'marketing',
      },
    },
  ]);
}

/**
 * Track content view for blog/article pages (ViewContent custom event)
 */
export async function trackContentView(params: {
  contentName: string;
  contentCategory: string;
  contentUrl: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
}): Promise<ConversionsApiResponse> {
  return sendEvents([
    {
      event_name: 'ViewContent',
      event_time: Math.floor(Date.now() / 1000),
      event_id: generateEventId(),
      event_source_url: params.contentUrl,
      action_source: 'website',
      user_data: hashUserData({
        externalId: params.userId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        fbc: params.fbc,
        fbp: params.fbp,
      }),
      custom_data: {
        content_name: params.contentName,
        content_category: params.contentCategory,
        content_type: 'article',
      },
    },
  ]);
}

/**
 * Track app install / PWA install (custom event)
 */
export async function trackAppInstall(params: {
  userId?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  fbc?: string;
  fbp?: string;
}): Promise<ConversionsApiResponse> {
  return sendEvents([
    {
      event_name: 'AppInstall',
      event_time: Math.floor(Date.now() / 1000),
      event_id: generateEventId(),
      event_source_url: 'https://resurgo.life',
      action_source: 'website',
      user_data: hashUserData({
        email: params.email,
        externalId: params.userId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        fbc: params.fbc,
        fbp: params.fbp,
      }),
      custom_data: {
        content_name: 'PWA Install',
        content_category: 'app',
      },
    },
  ]);
}
