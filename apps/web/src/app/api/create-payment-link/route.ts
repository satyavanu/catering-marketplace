// app/api/create-payment-link/route.ts

import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Dummy data (or from frontend)
    const {
      amount = 799900, // in paise (₹7999)
      customerName = "Test User",
      email = "test@example.com",
      contact = "9999999999",
    } = body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log("Creating payment link with data:", {
      amount,
      customerName,
      email,
      contact,
    });

    console.log("RAZOR KEY_ID:", process.env.RAZORPAY_KEY_ID);
    console.log("RAZOR KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

    const paymentLink = await razorpay.paymentLink.create({
      amount: 1000,
      currency: "INR",
      description: "Droooly Meal Plan Subscription",
      customer: {
        "name": "Test Customer",
        "email": "test@example.com",
        "contact": "9876543210",
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      callback_url: "http://localhost:3000/payment-success",
      callback_method: "get",
    });

    return NextResponse.json({
      success: true,
      payment_link: paymentLink.short_url,
    });
  } catch (error: any) {
    console.log(        "Error creating payment link:", error.message);
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}