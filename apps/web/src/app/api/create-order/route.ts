export const runtime = "nodejs";

import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

// Generate unique receipt ID
function generateUniqueReceipt(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `receipt_${timestamp}_${random}`;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body to get amount (optional - default to 1000 paise = ₹10)
    const body = await request.json().catch(() => ({}));
    const amount = body.amount || 1000; // Amount in paise

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Generate unique receipt ID
    const uniqueReceipt = generateUniqueReceipt();

    console.log(`📝 Creating order with receipt: ${uniqueReceipt}`);

    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: uniqueReceipt,
    });

    console.log(`✅ Order created successfully: ${order.id}`);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      receipt: uniqueReceipt,
      currency: order.currency,
      created_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error(`❌ Error creating order:`, error.message);
    
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}