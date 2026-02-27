/** @jest-environment node */

export {};

const chatbotRouteMutationMock = jest.fn();
const chatbotRouteQueryMock = jest.fn();
const chatbotRouteAuthMock = jest.fn();
const chatbotRouteCurrentUserMock = jest.fn();

jest.mock('convex/browser', () => ({
  ConvexHttpClient: jest.fn().mockImplementation(() => ({
    mutation: chatbotRouteMutationMock,
    query: chatbotRouteQueryMock,
  })),
}));

jest.mock('../../../../convex/_generated/api', () => ({
  api: {
    chatbotAnalytics: {
      logChatbotEvent: 'chatbotAnalytics.logChatbotEvent',
      getDueFollowUps: 'chatbotAnalytics.getDueFollowUps',
      markFollowUpsSent: 'chatbotAnalytics.markFollowUpsSent',
    },
  },
}));

jest.mock('@clerk/nextjs/server', () => ({
  auth: (...args: unknown[]) => chatbotRouteAuthMock(...args),
  currentUser: (...args: unknown[]) => chatbotRouteCurrentUserMock(...args),
}));

describe('/api/chatbot route', () => {
  beforeEach(() => {
    jest.resetModules();
    chatbotRouteMutationMock.mockReset();
    chatbotRouteQueryMock.mockReset();
    chatbotRouteAuthMock.mockReset();
    chatbotRouteCurrentUserMock.mockReset();

    process.env.BILLING_WEBHOOK_SYNC_SECRET = 'sync_test';
    process.env.NEXT_PUBLIC_CONVEX_URL = 'https://example.convex.cloud';
    process.env.AIML_API_KEY = '';
    process.env.GROQ_API_KEY = '';
    process.env.GOOGLE_AI_STUDIO_KEY = '';
    process.env.OPENROUTER_API_KEY = '';

    chatbotRouteAuthMock.mockResolvedValue({ userId: 'user_123' });
    chatbotRouteCurrentUserMock.mockResolvedValue({
      id: 'clerk_123',
      publicMetadata: { plan: 'free' },
    });
    chatbotRouteQueryMock.mockResolvedValue([]);
  });

  it('returns 400 for invalid payload shape', async () => {
    const { POST } = await import('./route');

    const req = new Request('http://localhost/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({ history: [] }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(req as unknown as Parameters<typeof POST>[0]);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe('Message is required');
  });

  it('returns structured quick pricing response and logs intent + cta impressions', async () => {
    const { POST } = await import('./route');

    const req = new Request('http://localhost/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message: 'What are your pricing plans?',
        history: [],
        conversationId: 'conv-abc',
      }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(req as unknown as Parameters<typeof POST>[0]);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.source).toBe('quick');
    expect(payload.intent).toBe('pricing_question');
    expect(Array.isArray(payload.suggestions)).toBe(true);
    expect(payload.cta).toEqual({ label: 'View plans', href: '/pricing' });

    expect(chatbotRouteMutationMock).toHaveBeenCalledWith(
      'chatbotAnalytics.logChatbotEvent',
      expect.objectContaining({
        eventName: 'intent_detected',
        clerkId: 'clerk_123',
      })
    );

    expect(chatbotRouteMutationMock).toHaveBeenCalledWith(
      'chatbotAnalytics.logChatbotEvent',
      expect.objectContaining({
        eventName: 'cta_shown',
        clerkId: 'clerk_123',
      })
    );
  });

  it('applies deterministic safety filter to unsafe AI output', async () => {
    process.env.AIML_API_KEY = 'aiml_key';

    const originalFetch = global.fetch;
    global.fetch = jest.fn(async () => ({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: 'You should stop eating for days to lose weight fast.' } }],
        }),
      } as unknown as Response)) as unknown as typeof fetch;

    const { POST } = await import('./route');

    const req = new Request('http://localhost/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message: 'blorpt nimbus flux strategy please',
        history: [],
      }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(req as unknown as Parameters<typeof POST>[0]);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.source).toBe('ai');
    expect(payload.message).toContain('harmful or extreme advice');

    global.fetch = originalFetch;
  });

  it('does not show upsell CTA for non-pricing help intents', async () => {
    const { POST } = await import('./route');

    const req = new Request('http://localhost/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message: 'How do I organize my morning routine?',
        history: [],
      }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(req as unknown as Parameters<typeof POST>[0]);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.cta).toBeNull();
  });

  it('injects due 24h/72h follow-up prompts into suggestions', async () => {
    chatbotRouteQueryMock.mockResolvedValueOnce([
      {
        _id: 'follow_1',
        reason: 'checkback_24h',
        intent: 'motivation_needed',
      },
      {
        _id: 'follow_2',
        reason: 'checkback_72h',
        intent: 'motivation_needed',
      },
    ]);

    const { POST } = await import('./route');

    const req = new Request('http://localhost/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message: 'How much does pro cost?',
        history: [],
      }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(req as unknown as Parameters<typeof POST>[0]);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.suggestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: '24h check-in' }),
        expect.objectContaining({ label: '72h reset review' }),
      ])
    );
    expect(chatbotRouteMutationMock).toHaveBeenCalledWith(
      'chatbotAnalytics.markFollowUpsSent',
      expect.objectContaining({
        followUpIds: ['follow_1', 'follow_2'],
      })
    );
  });
});
