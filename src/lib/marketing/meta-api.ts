// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Meta Marketing API Integration
// Server-side SDK wrapper for Facebook/Meta Marketing API
// App ID: 26209198785376657 | Business ID: 34829305176654710
// ═══════════════════════════════════════════════════════════════════════════════

const META_API_BASE = 'https://graph.facebook.com';
const META_API_VERSION = process.env.META_API_VERSION || 'v21.0';
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || '';
const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID || '';
const META_BUSINESS_ID = process.env.META_BUSINESS_ID || '';
const META_PIXEL_ID = process.env.META_PIXEL_ID || '';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface MetaCampaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  objective: string;
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  stop_time?: string;
  created_time?: string;
  updated_time?: string;
  buying_type?: string;
  bid_strategy?: string;
  special_ad_categories?: string[];
}

export interface MetaAdSet {
  id: string;
  name: string;
  campaign_id: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  end_time?: string;
  targeting?: MetaTargeting;
  optimization_goal?: string;
  billing_event?: string;
  bid_amount?: number;
}

export interface MetaTargeting {
  age_min?: number;
  age_max?: number;
  genders?: number[];
  geo_locations?: {
    countries?: string[];
    cities?: Array<{ key: string; name?: string }>;
  };
  interests?: Array<{ id: string; name: string }>;
  behaviors?: Array<{ id: string; name: string }>;
  custom_audiences?: Array<{ id: string; name?: string }>;
  excluded_custom_audiences?: Array<{ id: string; name?: string }>;
  publisher_platforms?: string[];
  facebook_positions?: string[];
  instagram_positions?: string[];
  device_platforms?: string[];
}

export interface MetaAdCreative {
  id: string;
  name: string;
  title?: string;
  body?: string;
  image_url?: string;
  link_url?: string;
  call_to_action_type?: string;
  object_story_spec?: Record<string, unknown>;
}

export interface MetaAd {
  id: string;
  name: string;
  adset_id: string;
  creative: { creative_id: string } | MetaAdCreative;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  created_time?: string;
  updated_time?: string;
}

export interface MetaInsight {
  date_start: string;
  date_stop: string;
  campaign_name?: string;
  adset_name?: string;
  ad_name?: string;
  impressions: string;
  clicks?: string;
  spend: string;
  cpc?: string;
  cpm?: string;
  ctr?: string;
  reach?: string;
  frequency?: string;
  actions?: Array<{ action_type: string; value: string }>;
  cost_per_action_type?: Array<{ action_type: string; value: string }>;
  conversions?: Array<{ action_type: string; value: string }>;
}

export interface MetaCustomAudience {
  id: string;
  name: string;
  description?: string;
  subtype: string;
  approximate_count?: number;
  time_created?: string;
  time_updated?: string;
}

export interface MetaApiResponse<T> {
  data: T[];
  paging?: {
    cursors?: { before: string; after: string };
    next?: string;
    previous?: string;
  };
}

export interface MetaApiError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BASE FETCH HELPER
// ─────────────────────────────────────────────────────────────────────────────

async function metaFetch<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'DELETE';
    params?: Record<string, string | number | boolean | undefined>;
    body?: Record<string, unknown>;
  } = {}
): Promise<T> {
  const { method = 'GET', params = {}, body } = options;

  if (!META_ACCESS_TOKEN || META_ACCESS_TOKEN === 'REPLACE_ME_WITH_SYSTEM_USER_TOKEN') {
    throw new Error('[Meta API] Access token not configured. Set META_ACCESS_TOKEN in .env');
  }

  const url = new URL(`${META_API_BASE}/${META_API_VERSION}/${endpoint}`);
  url.searchParams.set('access_token', META_ACCESS_TOKEN);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const fetchOptions: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body && method === 'POST') {
    fetchOptions.body = JSON.stringify(body);
  }

  const res = await fetch(url.toString(), fetchOptions);
  const json = await res.json();

  if (!res.ok || json.error) {
    const err = json as MetaApiError;
    throw new Error(
      `[Meta API] ${err.error?.message || 'Unknown error'} (code: ${err.error?.code}, trace: ${err.error?.fbtrace_id})`
    );
  }

  return json as T;
}

// ─────────────────────────────────────────────────────────────────────────────
// CAMPAIGNS
// ─────────────────────────────────────────────────────────────────────────────

export async function listCampaigns(
  fields: string = 'id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time,created_time,updated_time',
  limit: number = 50
): Promise<MetaApiResponse<MetaCampaign>> {
  return metaFetch(`${META_AD_ACCOUNT_ID}/campaigns`, {
    params: { fields, limit },
  });
}

export async function getCampaign(campaignId: string): Promise<MetaCampaign> {
  return metaFetch(campaignId, {
    params: {
      fields: 'id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time,created_time,updated_time,buying_type,bid_strategy,special_ad_categories',
    },
  });
}

export async function createCampaign(params: {
  name: string;
  objective: string;
  status?: 'ACTIVE' | 'PAUSED';
  daily_budget?: number;
  lifetime_budget?: number;
  special_ad_categories?: string[];
  start_time?: string;
  stop_time?: string;
  bid_strategy?: string;
}): Promise<{ id: string }> {
  const body: Record<string, unknown> = {
    name: params.name,
    objective: params.objective,
    status: params.status || 'PAUSED',
    special_ad_categories: params.special_ad_categories || [],
  };

  if (params.daily_budget) body.daily_budget = params.daily_budget;
  if (params.lifetime_budget) body.lifetime_budget = params.lifetime_budget;
  if (params.start_time) body.start_time = params.start_time;
  if (params.stop_time) body.stop_time = params.stop_time;
  if (params.bid_strategy) body.bid_strategy = params.bid_strategy;

  return metaFetch(`${META_AD_ACCOUNT_ID}/campaigns`, { method: 'POST', body });
}

export async function updateCampaign(
  campaignId: string,
  updates: Partial<Pick<MetaCampaign, 'name' | 'status' | 'daily_budget' | 'lifetime_budget'>>
): Promise<{ success: boolean }> {
  return metaFetch(campaignId, { method: 'POST', body: updates as Record<string, unknown> });
}

// ─────────────────────────────────────────────────────────────────────────────
// AD SETS
// ─────────────────────────────────────────────────────────────────────────────

export async function listAdSets(
  campaignId?: string,
  limit: number = 50
): Promise<MetaApiResponse<MetaAdSet>> {
  const endpoint = campaignId
    ? `${campaignId}/adsets`
    : `${META_AD_ACCOUNT_ID}/adsets`;

  return metaFetch(endpoint, {
    params: {
      fields: 'id,name,campaign_id,status,daily_budget,lifetime_budget,start_time,end_time,optimization_goal,billing_event,targeting',
      limit,
    },
  });
}

export async function createAdSet(params: {
  campaign_id: string;
  name: string;
  daily_budget?: number;
  lifetime_budget?: number;
  start_time?: string;
  end_time?: string;
  targeting: MetaTargeting;
  optimization_goal: string;
  billing_event: string;
  bid_amount?: number;
  status?: 'ACTIVE' | 'PAUSED';
}): Promise<{ id: string }> {
  return metaFetch(`${META_AD_ACCOUNT_ID}/adsets`, {
    method: 'POST',
    body: {
      ...params,
      status: params.status || 'PAUSED',
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// AD CREATIVES
// ─────────────────────────────────────────────────────────────────────────────

export async function listAdCreatives(
  limit: number = 50
): Promise<MetaApiResponse<MetaAdCreative>> {
  return metaFetch(`${META_AD_ACCOUNT_ID}/adcreatives`, {
    params: {
      fields: 'id,name,title,body,image_url,link_url,call_to_action_type,object_story_spec',
      limit,
    },
  });
}

export async function createAdCreative(params: {
  name: string;
  object_story_spec: {
    page_id: string;
    link_data?: {
      link: string;
      message: string;
      name?: string;
      description?: string;
      image_hash?: string;
      call_to_action?: { type: string; value?: { link: string } };
    };
  };
}): Promise<{ id: string }> {
  return metaFetch(`${META_AD_ACCOUNT_ID}/adcreatives`, {
    method: 'POST',
    body: params as unknown as Record<string, unknown>,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ADS
// ─────────────────────────────────────────────────────────────────────────────

export async function listAds(
  adSetId?: string,
  limit: number = 50
): Promise<MetaApiResponse<MetaAd>> {
  const endpoint = adSetId
    ? `${adSetId}/ads`
    : `${META_AD_ACCOUNT_ID}/ads`;

  return metaFetch(endpoint, {
    params: {
      fields: 'id,name,adset_id,status,creative{id,name,title,body},created_time,updated_time',
      limit,
    },
  });
}

export async function createAd(params: {
  name: string;
  adset_id: string;
  creative: { creative_id: string };
  status?: 'ACTIVE' | 'PAUSED';
}): Promise<{ id: string }> {
  return metaFetch(`${META_AD_ACCOUNT_ID}/ads`, {
    method: 'POST',
    body: {
      ...params,
      status: params.status || 'PAUSED',
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// INSIGHTS / REPORTING
// ─────────────────────────────────────────────────────────────────────────────

export async function getInsights(params: {
  objectId?: string;
  level?: 'campaign' | 'adset' | 'ad';
  date_preset?: string;
  time_range?: { since: string; until: string };
  fields?: string;
  limit?: number;
}): Promise<MetaApiResponse<MetaInsight>> {
  const endpoint = params.objectId
    ? `${params.objectId}/insights`
    : `${META_AD_ACCOUNT_ID}/insights`;

  const queryParams: Record<string, string | number | boolean | undefined> = {
    fields:
      params.fields ||
      'date_start,date_stop,campaign_name,adset_name,ad_name,impressions,clicks,spend,cpc,cpm,ctr,reach,frequency,actions,cost_per_action_type,conversions',
    limit: params.limit || 50,
  };

  if (params.level) queryParams.level = params.level;
  if (params.date_preset) queryParams.date_preset = params.date_preset;
  if (params.time_range) {
    queryParams.time_range = JSON.stringify(params.time_range) as unknown as string;
  }

  return metaFetch(endpoint, { params: queryParams });
}

export async function getAccountInsightsSummary(
  datePreset: string = 'last_7d'
): Promise<MetaInsight | null> {
  const result = await getInsights({
    date_preset: datePreset,
    fields: 'impressions,clicks,spend,cpc,cpm,ctr,reach,frequency,actions,conversions',
  });
  return result.data?.[0] || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM AUDIENCES
// ─────────────────────────────────────────────────────────────────────────────

export async function listCustomAudiences(
  limit: number = 50
): Promise<MetaApiResponse<MetaCustomAudience>> {
  return metaFetch(`${META_AD_ACCOUNT_ID}/customaudiences`, {
    params: {
      fields: 'id,name,description,subtype,approximate_count,time_created,time_updated',
      limit,
    },
  });
}

export async function createCustomAudience(params: {
  name: string;
  description?: string;
  subtype: 'CUSTOM' | 'WEBSITE' | 'APP' | 'OFFLINE' | 'LOOKALIKE';
  customer_file_source?: 'USER_PROVIDED_ONLY' | 'PARTNER_PROVIDED_ONLY' | 'BOTH_USER_AND_PARTNER_PROVIDED';
  rule?: Record<string, unknown>;
  lookalike_spec?: {
    origin_audience_id: string;
    starting_ratio?: number;
    ratio?: number;
    country?: string;
  };
}): Promise<{ id: string }> {
  return metaFetch(`${META_AD_ACCOUNT_ID}/customaudiences`, {
    method: 'POST',
    body: params as unknown as Record<string, unknown>,
  });
}

export async function addUsersToAudience(
  audienceId: string,
  emails: string[]
): Promise<{ audience_id: string; num_received: number; num_invalid_entries: number }> {
  // Meta requires SHA256-hashed emails for CUSTOM audiences
  const crypto = await import('crypto');
  const hashedEmails = emails.map((e) =>
    crypto.createHash('sha256').update(e.trim().toLowerCase()).digest('hex')
  );

  return metaFetch(`${audienceId}/users`, {
    method: 'POST',
    body: {
      payload: {
        schema: ['EMAIL'],
        data: hashedEmails.map((h) => [h]),
      },
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBSITE CUSTOM AUDIENCES (Pixel-based retargeting)
// ─────────────────────────────────────────────────────────────────────────────

export async function createWebsiteAudience(params: {
  name: string;
  description?: string;
  retention_days?: number;
  rule: {
    inclusions: {
      operator: 'or' | 'and';
      rules: Array<{
        event_sources: Array<{ id: string; type: 'pixel' }>;
        retention_seconds: number;
        filter: {
          operator: 'or' | 'and';
          filters: Array<{
            field: string;
            operator: 'i_contains' | 'eq' | 'i_not_contains';
            value: string;
          }>;
        };
      }>;
    };
  };
}): Promise<{ id: string }> {
  return metaFetch(`${META_AD_ACCOUNT_ID}/customaudiences`, {
    method: 'POST',
    body: {
      name: params.name,
      description: params.description,
      subtype: 'WEBSITE',
      retention_days: params.retention_days || 30,
      rule: JSON.stringify(params.rule),
      pixel_id: META_PIXEL_ID,
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PRESET AUDIENCES FOR RESURGO
// ─────────────────────────────────────────────────────────────────────────────

export function getResurgoTargetingPresets(): Record<string, MetaTargeting> {
  return {
    // Persona 1: "Ambitious Alex" — career-focused professionals 25-35
    ambitiousAlex: {
      age_min: 25,
      age_max: 35,
      geo_locations: { countries: ['US', 'GB', 'CA', 'AU'] },
      interests: [
        { id: '6003139266461', name: 'Productivity' },
        { id: '6003156082557', name: 'Self-improvement' },
        { id: '6003384131581', name: 'Entrepreneurship' },
        { id: '6003020834693', name: 'Goal setting' },
      ],
      publisher_platforms: ['facebook', 'instagram'],
      facebook_positions: ['feed', 'instant_article'],
      instagram_positions: ['stream', 'story', 'explore'],
    },

    // Persona 2: "Fitness Fiona" — health & wellness 20-40
    fitnessFiona: {
      age_min: 20,
      age_max: 40,
      geo_locations: { countries: ['US', 'GB', 'CA', 'AU'] },
      interests: [
        { id: '6003107902433', name: 'Physical fitness' },
        { id: '6003295857780', name: 'Health and wellness' },
        { id: '6003384781981', name: 'Weight loss' },
        { id: '6003246450223', name: 'Healthy eating' },
      ],
      publisher_platforms: ['facebook', 'instagram'],
      instagram_positions: ['stream', 'story', 'explore', 'reels'],
    },

    // Persona 3: "Student Sam" — students 18-25
    studentSam: {
      age_min: 18,
      age_max: 25,
      geo_locations: { countries: ['US', 'GB', 'CA', 'AU', 'IN'] },
      interests: [
        { id: '6003139266461', name: 'Productivity' },
        { id: '6003397425735', name: 'Study skills' },
        { id: '6003156082557', name: 'Self-improvement' },
        { id: '6003355791831', name: 'Mobile games' },
      ],
      publisher_platforms: ['facebook', 'instagram'],
      instagram_positions: ['stream', 'story', 'reels'],
    },

    // ADHD audience — from SEO strategy doc
    adhdProductivity: {
      age_min: 18,
      age_max: 45,
      geo_locations: { countries: ['US', 'GB', 'CA', 'AU'] },
      interests: [
        { id: '6003107406140', name: 'Attention deficit hyperactivity disorder' },
        { id: '6003139266461', name: 'Productivity' },
        { id: '6003156082557', name: 'Self-improvement' },
      ],
      publisher_platforms: ['facebook', 'instagram'],
    },

    // Broad retargeting — all site visitors
    retargetingSiteVisitors: {
      age_min: 18,
      age_max: 65,
      geo_locations: { countries: ['US', 'GB', 'CA', 'AU', 'IN', 'DE', 'FR'] },
      // custom_audiences will be added dynamically from Website Custom Audience
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CAMPAIGN TEMPLATES FOR RESURGO
// ─────────────────────────────────────────────────────────────────────────────

export function getResurgoCampaignTemplates() {
  return {
    // Content promotion — drive traffic to blog posts
    contentPromotion: {
      name: 'Resurgo — Content Promotion',
      objective: 'OUTCOME_TRAFFIC',
      daily_budget: 500, // $5.00 in cents
      special_ad_categories: [] as string[],
    },

    // Sign-up acquisition — drive free sign-ups
    signupAcquisition: {
      name: 'Resurgo — Sign-Up Acquisition',
      objective: 'OUTCOME_LEADS',
      daily_budget: 1000, // $10.00 in cents
      special_ad_categories: [] as string[],
    },

    // Pro conversion — retarget free users to upgrade
    proConversion: {
      name: 'Resurgo — Pro Conversion',
      objective: 'OUTCOME_SALES',
      daily_budget: 1500, // $15.00 in cents
      special_ad_categories: [] as string[],
    },

    // Brand awareness — top of funnel
    brandAwareness: {
      name: 'Resurgo — Brand Awareness',
      objective: 'OUTCOME_AWARENESS',
      daily_budget: 300, // $3.00 in cents
      special_ad_categories: [] as string[],
    },

    // App installs — drive PWA installs
    appInstalls: {
      name: 'Resurgo — App Installs',
      objective: 'OUTCOME_APP_PROMOTION',
      daily_budget: 800, // $8.00 in cents
      special_ad_categories: [] as string[],
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────────────────────────────────────

export async function checkMetaApiHealth(): Promise<{
  configured: boolean;
  tokenValid: boolean;
  adAccountAccessible: boolean;
  pixelConfigured: boolean;
  errors: string[];
}> {
  const errors: string[] = [];
  let tokenValid = false;
  let adAccountAccessible = false;
  const pixelConfigured = !!META_PIXEL_ID && META_PIXEL_ID !== 'REPLACE_ME_WITH_PIXEL_ID';

  const configured =
    !!META_ACCESS_TOKEN &&
    META_ACCESS_TOKEN !== 'REPLACE_ME_WITH_SYSTEM_USER_TOKEN' &&
    !!META_AD_ACCOUNT_ID &&
    META_AD_ACCOUNT_ID !== 'REPLACE_ME_WITH_AD_ACCOUNT_ID';

  if (!configured) {
    errors.push('Meta API credentials not fully configured in .env');
    return { configured, tokenValid, adAccountAccessible, pixelConfigured, errors };
  }

  try {
    await metaFetch<{ id: string; name: string }>('me', {
      params: { fields: 'id,name' },
    });
    tokenValid = true;
  } catch (e) {
    errors.push(`Token validation failed: ${(e as Error).message}`);
  }

  try {
    await metaFetch<{ id: string; name: string }>(META_AD_ACCOUNT_ID, {
      params: { fields: 'id,name' },
    });
    adAccountAccessible = true;
  } catch (e) {
    errors.push(`Ad account not accessible: ${(e as Error).message}`);
  }

  return { configured, tokenValid, adAccountAccessible, pixelConfigured, errors };
}
