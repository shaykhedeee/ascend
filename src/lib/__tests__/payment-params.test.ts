/** @jest-environment node */

import { sanitizePaymentParams } from '@/lib/payment-params';

describe('sanitizePaymentParams', () => {
  it('sanitizes potentially unsafe query values', () => {
    const result = sanitizePaymentParams({
      session_id: ' sess_123 ',
      error: '<script>alert(1)</script>',
      reason: 'payment declined',
      status: 'failed',
      plan: 'pro',
    });

    expect(result.sessionId).toBe('sess_123');
    expect(result.error).toContain('&lt;script&gt;');
    expect(result.reason).toBe('payment declined');
    expect(result.status).toBe('failed');
    expect(result.plan).toBe('pro');
  });

  it('handles missing and array params safely', () => {
    const result = sanitizePaymentParams({
      session_id: ['sess_aaa', 'sess_bbb'],
      error: undefined,
    });

    expect(result.sessionId).toBe('sess_aaa');
    expect(result.error).toBeUndefined();
  });
});
