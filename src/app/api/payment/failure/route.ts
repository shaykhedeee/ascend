// ═══════════════════════════════════════════════════════════════════════════════
// ASCENDIFY - PayU Payment Failure Callback
// Handles failed payment confirmation from PayU
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // PayU sends form data
    const formData = await request.formData();
    const params: Record<string, string> = {};
    
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    console.log('PayU Failure Callback:', {
      txnid: params.txnid,
      status: params.status,
      error_Message: params.error_Message,
    });

    // Log the failed payment for analysis
    const errorReason = params.error_Message || params.status || 'unknown';

    // Redirect to failure page with error info
    const failureUrl = new URL(`${APP_URL}/payment/failed`);
    failureUrl.searchParams.set('reason', errorReason);
    if (params.txnid) {
      failureUrl.searchParams.set('txnid', params.txnid);
    }

    return NextResponse.redirect(failureUrl.toString());
  } catch (error) {
    console.error('Payment failure callback error:', error);
    return NextResponse.redirect(`${APP_URL}/payment/failed?reason=callback_error`);
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const reason = request.nextUrl.searchParams.get('reason') || 'unknown';
  return NextResponse.redirect(`${APP_URL}/payment/failed?reason=${reason}`);
}
