export const runtime = 'nodejs';

import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';

// Generate unique receipt ID
function generateUniqueReceipt(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `receipt_${timestamp}_${random}`;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: '/api/create-order',
    method: 'POST',
    message:
      'Use POST with amount, currency, and notes to create a Razorpay order.',
  });
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body to get amount (optional - default to 1000 paise = INR 10).
    const body = await request.json().catch(() => ({}));
    const amount = Math.max(Number(body.amount) || 1000, 100); // Amount in minor units.
    const currency =
      typeof body.currency === 'string' && body.currency.trim()
        ? body.currency.trim().toUpperCase()
        : 'INR';
    const receipt =
      typeof body.receipt === 'string' && body.receipt.trim()
        ? body.receipt.trim().slice(0, 40)
        : generateUniqueReceipt();
    const notes =
      body.notes && typeof body.notes === 'object' ? body.notes : undefined;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    console.log(`Creating Razorpay order with receipt: ${receipt}`);

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      notes,
    });

    console.log(`Razorpay order created successfully: ${order.id}`);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      receipt,
      currency: order.currency,
      created_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error(`Error creating Razorpay order:`, error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
