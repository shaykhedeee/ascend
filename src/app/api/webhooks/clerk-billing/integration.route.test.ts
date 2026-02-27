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

describe('Webhook route integration (node)', () => {
  beforeEach(() => {
    jest.resetModules();
    verifyMock.mockReset();
    mutationMock.mockReset();

    process.env.CLERK_WEBHOOK_SECRET = 'whsec_test';
    process.env.BILLING_WEBHOOK_SYNC_SECRET = 'sync_test';
    process.env.NEXT_PUBLIC_CONVEX_URL = 'https://example.convex.cloud';
    process.env.CLERK_WEBHOOK_MAX_AGE_SECONDS = '300';
  });

  it('handles subscription.deleted and calls updatePlanFromWebhook', async () => {
    verifyMock.mockReturnValueOnce({
      type: 'subscription.deleted',
      data: { user_id: 'clerk_test_1', plan_id: 'pro_monthly' },
    });

    mutationMock.mockResolvedValueOnce({ applied: true, reason: 'ok' });

    const { POST } = await import('./route');

    const freshTs = String(Math.floor(Date.now() / 1000));
    const req = new Request('http://localhost/api/webhooks/clerk-billing', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'svix-id': 'evt_integ_2',
        'svix-timestamp': freshTs,
        'svix-signature': 'v1,good',
        'content-type': 'application/json',
      },
    });

    const response = await POST(req as unknown as Parameters<typeof POST>[0]);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.received).toBe(true);

    expect(mutationMock).toHaveBeenCalledWith(
      'users.updatePlanFromWebhook',
      expect.objectContaining({
        clerkId: 'clerk_test_1',
        plan: 'free',
        eventId: 'evt_integ_2',
        eventType: 'subscription.deleted',
        webhookSecret: 'sync_test',
      })
    );
  });
});
