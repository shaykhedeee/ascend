/** @jest-environment node */

import { NextResponse } from 'next/server';
import { addSecurityHeaders, SECURITY_HEADERS } from '@/lib/security';

describe('security headers', () => {
  it('applies all configured headers to API responses', () => {
    const response = NextResponse.json({ ok: true });
    const secured = addSecurityHeaders(response);

    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      expect(secured.headers.get(key)).toBe(value);
    }
  });
});
