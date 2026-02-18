// ═══════════════════════════════════════════════════════════════════════════════
// ASCENDIFY - PayU Payment Initiation API Route
// Creates a PayU payment and returns the payment form data
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { auth, currentUser } from '@clerk/nextjs/server';

// PayU configuration from environment
const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || '';
const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || '';
const PAYU_MODE = process.env.PAYU_MODE || 'sandbox';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const PAYU_URLS = {
  sandbox: 'https://sandboxsecure.payu.in/_payment',
  production: 'https://secure.payu.in/_payment',
};

interface PaymentRequest {
  planType: 'pro' | 'lifetime';
  userPhone?: string;
}

interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  formData?: Record<string, string>;
  error?: string;
}

// Plan pricing (in INR)
const PLAN_PRICES = {
  pro: 199, // Per month
  lifetime: 999, // One-time
};

const PLAN_NAMES = {
  pro: 'Ascendify Pro - Monthly',
  lifetime: 'Ascendify Lifetime Access',
};

// Generate PayU hash
function generateHash(params: Record<string, string>): string {
  // PayU hash format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
  const hashString = [
    PAYU_MERCHANT_KEY,
    params.txnid,
    params.amount,
    params.productinfo,
    params.firstname,
    params.email,
    '', '', '', '', '', // udf1-5 (empty)
    '', '', '', '', '', // reserved (empty)
    PAYU_MERCHANT_SALT,
  ].join('|');

  return crypto.createHash('sha512').update(hashString).digest('hex');
}

// Generate unique transaction ID
function generateTxnId(): string {
  return `ASCEND_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export async function POST(request: NextRequest): Promise<NextResponse<PaymentResponse>> {
  try {
    // Enforce authentication for payment initiation.
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await currentUser();

    // Validate configuration
    if (!PAYU_MERCHANT_KEY || !PAYU_MERCHANT_SALT) {
      console.error('PayU credentials not configured');
      return NextResponse.json(
        { success: false, error: 'Payment system not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const body = await request.json() as PaymentRequest;
  const { planType, userPhone } = body;

  // Derive payer identity from trusted auth context, not client payload.
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';
  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || user?.username || 'User';

    // Validate request
    if (!planType || !['pro', 'lifetime'].includes(planType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    if (!userEmail || !userName) {
      return NextResponse.json(
        { success: false, error: 'Authenticated user profile is incomplete (email/name required)' },
        { status: 400 }
      );
    }

    const txnid = generateTxnId();
    const amount = PLAN_PRICES[planType].toFixed(2);
    const productinfo = PLAN_NAMES[planType];

    // Payment parameters
    const paymentParams: Record<string, string> = {
      key: PAYU_MERCHANT_KEY,
      txnid,
      amount,
      productinfo,
      firstname: userName.split(' ')[0],
      email: userEmail,
      phone: userPhone || '',
      surl: `${APP_URL}/api/payment/success`, // Success callback
      furl: `${APP_URL}/api/payment/failure`, // Failure callback
      curl: `${APP_URL}/api/payment/cancel`, // Cancel callback (optional)
      udf1: planType, // Store plan type for verification
      udf2: '', 
      udf3: '',
      udf4: '',
      udf5: '',
    };

    // Generate hash
    paymentParams.hash = generateHash(paymentParams);

    const payuUrl = PAYU_MODE === 'production' 
      ? PAYU_URLS.production 
      : PAYU_URLS.sandbox;

    return NextResponse.json({
      success: true,
      paymentUrl: payuUrl,
      formData: paymentParams,
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
