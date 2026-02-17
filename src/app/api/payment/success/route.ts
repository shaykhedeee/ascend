// ═══════════════════════════════════════════════════════════════════════════════
// ASCENDIFY - PayU Payment Success Callback
// Handles successful payment confirmation from PayU
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Verify PayU response hash
function verifyHash(params: Record<string, string>): boolean {
  if (!PAYU_MERCHANT_SALT) return false;

  // Reverse hash format: salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
  const hashString = [
    PAYU_MERCHANT_SALT,
    params.status,
    '', '', '', '', '', // Reserved fields
    params.udf5 || '',
    params.udf4 || '',
    params.udf3 || '',
    params.udf2 || '',
    params.udf1 || '',
    params.email,
    params.firstname,
    params.productinfo,
    params.amount,
    params.txnid,
    params.key,
  ].join('|');

  const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
  return calculatedHash === params.hash;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // PayU sends form data
    const formData = await request.formData();
    const params: Record<string, string> = {};
    
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    console.log('PayU Success Callback:', {
      txnid: params.txnid,
      status: params.status,
      amount: params.amount,
      productinfo: params.productinfo,
      planType: params.udf1,
    });

    // Verify the hash
    if (!verifyHash(params)) {
      console.error('Hash verification failed');
      return NextResponse.redirect(`${APP_URL}/payment/failed?reason=invalid_hash`);
    }

    // Check payment status
    if (params.status !== 'success') {
      console.error('Payment not successful:', params.status);
      return NextResponse.redirect(`${APP_URL}/payment/failed?reason=${params.status}`);
    }

    const planType = params.udf1 as 'pro' | 'lifetime';
    const txnid = params.txnid;
    const amount = params.amount;

    // In a production app, you would:
    // 1. Store the transaction in your database
    // 2. Update the user's subscription status
    // 3. Send confirmation email
    // 4. Log the payment for accounting

    // Redirect to success page with plan info
    const successUrl = new URL(`${APP_URL}/payment/success`);
    successUrl.searchParams.set('plan', planType);
    successUrl.searchParams.set('txnid', txnid);
    successUrl.searchParams.set('amount', amount);

    return NextResponse.redirect(successUrl.toString());
  } catch (error) {
    console.error('Payment success callback error:', error);
    return NextResponse.redirect(`${APP_URL}/payment/failed?reason=error`);
  }
}

// Also handle GET for browser redirects
export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const planType = searchParams.get('plan') || 'pro';
  
  // This handles direct success redirects
  return NextResponse.redirect(`${APP_URL}/payment/success?plan=${planType}`);
}
