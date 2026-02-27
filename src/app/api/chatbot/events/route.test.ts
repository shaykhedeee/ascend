/** @jest-environment node */

export {};

const chatbotEventsMutationMock = jest.fn();
const chatbotEventsAuthMock = jest.fn();
const chatbotEventsCurrentUserMock = jest.fn();

jest.mock('convex/browser', () => ({
  ConvexHttpClient: jest.fn().mockImplementation(() => ({
    mutation: chatbotEventsMutationMock,
  })),
}));

jest.mock('../../../../../convex/_generated/api', () => ({
  api: {
    chatbotAnalytics: {
      logChatbotEvent: 'chatbotAnalytics.logChatbotEvent',
      scheduleResolutionFollowUps: 'chatbotAnalytics.scheduleResolutionFollowUps',
    },
  },
}));

jest.mock('@clerk/nextjs/server', () => ({
  auth: (...args: unknown[]) => chatbotEventsAuthMock(...args),
  currentUser: (...args: unknown[]) => chatbotEventsCurrentUserMock(...args),
}));

describe('/api/chatbot/events route', () => {
  beforeEach(() => {
    jest.resetModules();
    chatbotEventsMutationMock.mockReset();
    chatbotEventsAuthMock.mockReset();
    chatbotEventsCurrentUserMock.mockReset();

    process.env.BILLING_WEBHOOK_SYNC_SECRET = 'sync_test';
    process.env.NEXT_PUBLIC_CONVEX_URL = 'https://example.convex.cloud';
  });

  it('returns 401 for unauthenticated users', async () => {
    chatbotEventsAuthMock.mockResolvedValue({ userId: null });

    const { POST } = await import('./route');

    const req = new Request('http://localhost/api/chatbot/events', {
      method: 'POST',
      body: JSON.stringify({ eventName: 'cta_clicked' }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(req as unknown as Parameters<typeof POST>[0]);
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.success).toBe(false);
  });

  it('logs cta_clicked events via Convex mutation', async () => {
    chatbotEventsAuthMock.mockResolvedValue({ userId: 'user_123' });
    chatbotEventsCurrentUserMock.mockResolvedValue({ id: 'clerk_123' });

    const { POST } = await import('./route');

    const req = new Request('http://localhost/api/chatbot/events', {
      method: 'POST',
      body: JSON.stringify({
        eventName: 'cta_clicked',
        conversationId: 'conv-1',
        intent: 'pricing_question',
        cta: { label: 'View plans', href: '/pricing' },
      }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(req as unknown as Parameters<typeof POST>[0]);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(chatbotEventsMutationMock).toHaveBeenCalledWith(
      'chatbotAnalytics.logChatbotEvent',
      expect.objectContaining({
        clerkId: 'clerk_123',
        eventName: 'cta_clicked',
        source: 'client',
        conversationId: 'conv-1',
      })
    );
  });

  it('schedules 24h/72h follow-ups when resolution is confirmed for struggling intents', async () => {
    chatbotEventsAuthMock.mockResolvedValue({ userId: 'user_123' });
    chatbotEventsCurrentUserMock.mockResolvedValue({ id: 'clerk_123' });

    const { POST } = await import('./route');

    const req = new Request('http://localhost/api/chatbot/events', {
      method: 'POST',
      body: JSON.stringify({
        eventName: 'resolution_confirmed',
        conversationId: 'conv-2',
        intent: 'motivation_needed',
      }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(req as unknown as Parameters<typeof POST>[0]);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(chatbotEventsMutationMock).toHaveBeenCalledWith(
      'chatbotAnalytics.scheduleResolutionFollowUps',
      expect.objectContaining({
        clerkId: 'clerk_123',
        intent: 'motivation_needed',
        conversationId: 'conv-2',
      })
    );
  });
});
