import { z } from 'zod';

const BRAVE_ENDPOINT = 'https://api.search.brave.com/res/v1/web/search';
const CACHE_TTL_MS = 1000 * 60 * 30;

const BraveResultSchema = z.object({
  title: z.string().optional(),
  url: z.string().url(),
  description: z.string().optional(),
  age: z.string().optional(),
  page_age: z.string().optional(),
  language: z.string().optional(),
});

const BraveResponseSchema = z.object({
  web: z.object({
    results: z.array(BraveResultSchema).default([]),
  }).optional(),
});

export interface ResearchSnippet {
  title: string;
  url: string;
  snippet: string;
  age?: string;
  language?: string;
}

export interface BraveSearchResponse {
  query: string;
  snippets: ResearchSnippet[];
  cached: boolean;
  rateLimit?: {
    limit?: number;
    remaining?: number;
    reset?: number;
    policy?: string;
  };
}

const searchCache = new Map<string, { expiresAt: number; data: BraveSearchResponse }>();

function getRateLimit(headers: Headers) {
  const toNumber = (value: string | null) => {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  return {
    limit: toNumber(headers.get('X-RateLimit-Limit')),
    remaining: toNumber(headers.get('X-RateLimit-Remaining')),
    reset: toNumber(headers.get('X-RateLimit-Reset')),
    policy: headers.get('X-RateLimit-Policy') ?? undefined,
  };
}

function cacheKey(query: string, count: number) {
  return `${query.toLowerCase().trim()}::${count}`;
}

export async function searchBrave(query: string, count = 5): Promise<BraveSearchResponse> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    throw new Error('BRAVE_SEARCH_API_KEY not configured');
  }

  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    throw new Error('Search query is required');
  }

  const key = cacheKey(normalizedQuery, count);
  const cached = searchCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return {
      ...cached.data,
      cached: true,
    };
  }

  const url = new URL(BRAVE_ENDPOINT);
  url.searchParams.set('q', normalizedQuery);
  url.searchParams.set('count', String(Math.min(Math.max(count, 1), 10)));
  url.searchParams.set('country', 'us');
  url.searchParams.set('search_lang', 'en');
  url.searchParams.set('text_decorations', 'false');
  url.searchParams.set('spellcheck', 'true');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-Subscription-Token': apiKey,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Brave Search failed with status ${response.status}`);
  }

  const json = await response.json();
  const parsed = BraveResponseSchema.parse(json);
  const data: BraveSearchResponse = {
    query: normalizedQuery,
    snippets: (parsed.web?.results ?? []).map((result) => ({
      title: result.title ?? result.url,
      url: result.url,
      snippet: result.description ?? '',
      age: result.age ?? result.page_age,
      language: result.language,
    })),
    cached: false,
    rateLimit: getRateLimit(response.headers),
  };

  searchCache.set(key, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    data,
  });

  return data;
}
