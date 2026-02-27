/** @jest-environment node */

const verifyMock = jest.fn();
const mutationMock = jest.fn();

jest.mock('svix', () => ({
  Webhook: jest.fn().mockImplementation(() => ({
    verify: verifyMock,
  })),
}));

jest.mock('convex/browser', () => ({
  ConvexHttpClient: jest.fn().mockImplementation(() => ({
    mutation: mutationMock,
  })),
}));

jest.mock('../../../../../convex/_generated/api', () => ({
  api: {
    users: {
      updatePlanFromWebhook: 'users.updatePlanFromWebhook',
      logBillingEvent: 'users.logBillingEvent',
    },
  },
}));

describe('Clerk billing webhook route security', () => {
  beforeEach(() => {
    jest.resetModules();
    verifyMock.mockReset();
    mutationMock.mockReset();
    process.env.CLERK_WEBHOOK_SECRET = 'whsec_test';
    process.env.BILLING_WEBHOOK_SYNC_SECRET = 'sync_test';
    process.env.NEXT_PUBLIC_CONVEX_URL = 'https://example.convex.cloud';
    process.env.CLERK_WEBHOOK_MAX_AGE_SECONDS = '300';
  });

  it('rejects requests missing required Svix headers', async () => {
    const { POST } = await import('./route');

    const req = new Request('http://localhost/api/webhooks/clerk-billing', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'content-type': 'application/json',
      },
    });

    const response = await POST(req as unknown as Parameters<typeof POST>[0]);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('Missing svix headers');
    expect(verifyMock).not.toHaveBeenCalled();
    expect(mutationMock).toHaveBeenCalledWith('users.logBillingEvent', expect.objectContaining({
      status: 'failed',
      reason: 'missing_svix_headers',
    }));
  });

  it('rejects stale timestamp before signature verification', async () => {
    const { POST } = await import('./route');

    const staleTs = String(Math.floor(Date.now() / 1000) - 3600);

    const req = new Request('http://localhost/api/webhooks/clerk-billing', {
      method: 'POST',
      body: JSON.stringify({ foo: 'bar' }),
      headers: {
        'svix-id': 'evt_123',
        'svix-timestamp': staleTs,
        'svix-signature': 'v1,test',
      },
    });

    const response = await POST(req as unknown as Parameters<typeof POST>[0]);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('Stale webhook timestamp');
    expect(verifyMock).not.toHaveBeenCalled();
    expect(mutationMock).toHaveBeenCalledWith('users.logBillingEvent', expect.objectContaining({
      status: 'failed',
      reason: 'stale_webhook_timestamp',
    }));
  });

  it('rejects invalid signature payloads', async () => {
    verifyMock.mockImplementationOnce(() => {
      throw new Error('bad signature');
    });

    const { POST } = await import('./route');

    const freshTs = String(Math.floor(Date.now() / 1000));

    const req = new Request('http://localhost/api/webhooks/clerk-billing', {
      method: 'POST',
      body: JSON.stringify({ foo: 'bar' }),
      headers: {
        'svix-id': 'evt_124',
        'svix-timestamp': freshTs,
        'svix-signature': 'v1,bad',
      },
    });

    const response = await POST(req as unknown as Parameters<typeof POST>[0]);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('Invalid signature');
    expect(verifyMock).toHaveBeenCalledTimes(1);
    expect(mutationMock).toHaveBeenCalledWith('users.logBillingEvent', expect.objectContaining({
      status: 'failed',
      reason: 'invalid_signature',
    }));
  });

  it('processes subscription.created and passes event metadata to plan update mutation', async () => {
    verifyMock.mockReturnValueOnce({
      type: 'subscription.created',
      data: {
        user_id: 'clerk_abc123',
        plan_id: 'pro_monthly',
      },
    });
    mutationMock.mockResolvedValueOnce({ applied: true, reason: 'ok' });

    const { POST } = await import('./route');

    const freshTs = String(Math.floor(Date.now() / 1000));
    const req = new Request('http://localhost/api/webhooks/clerk-billing', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'svix-id': 'evt_125',
        'svix-timestamp': freshTs,
        'svix-signature': 'v1,good',
      },
    });

    const response = await POST(req as unknown as Parameters<typeof POST>[0]);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.received).toBe(true);
    expect(mutationMock).toHaveBeenCalledWith(
      'users.updatePlanFromWebhook',
      expect.objectContaining({
        clerkId: 'clerk_abc123',
        plan: 'pro',
        eventId: 'evt_125',
        eventType: 'subscription.created',
        webhookSecret: 'sync_test',
      })
    );
  });

  it('logs and rejects subscription event missing user id', async () => {
    verifyMock.mockReturnValueOnce({
      type: 'subscription.created',
      data: {
        plan_id: 'pro_monthly',
      },
    });

    const { POST } = await import('./route');

    const freshTs = String(Math.floor(Date.now() / 1000));
    const req = new Request('http://localhost/api/webhooks/clerk-billing', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'svix-id': 'evt_126',
        'svix-timestamp': freshTs,
        'svix-signature': 'v1,good',
      },
    });

    const response = await POST(req as unknown as Parameters<typeof POST>[0]);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('Missing user id');
    expect(mutationMock).toHaveBeenCalledWith('users.logBillingEvent', expect.objectContaining({
      eventId: 'evt_126',
      status: 'failed',
      reason: 'missing_user_id',
    }));
  });
});
