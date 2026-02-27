import { sanitizeString } from '@/lib/security';

export type RawPaymentSearchParams = Record<string, string | string[] | undefined>;

export interface SanitizedPaymentParams {
  sessionId?: string;
  status?: string;
  plan?: string;
  reason?: string;
  error?: string;
}

function getFirst(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function sanitizeParam(value: string | undefined, maxLength: number): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return sanitizeString(trimmed, { maxLength, allowNewlines: false });
}

export function sanitizePaymentParams(searchParams: RawPaymentSearchParams): SanitizedPaymentParams {
  return {
    sessionId: sanitizeParam(getFirst(searchParams.session_id), 128),
    status: sanitizeParam(getFirst(searchParams.status), 32),
    plan: sanitizeParam(getFirst(searchParams.plan), 32),
    reason: sanitizeParam(getFirst(searchParams.reason), 160),
    error: sanitizeParam(getFirst(searchParams.error), 160),
  };
}
