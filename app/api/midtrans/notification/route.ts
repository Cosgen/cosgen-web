import { NextResponse } from "next/server";
import crypto from "crypto";
// @ts-ignore - midtrans-client ES import compatibility
import midtransClient from "midtrans-client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, status_code, gross_amount, signature_key } = body;

    const serverKey = (process.env.MIDTRANS_SERVER_KEY || "").trim();
    const clientKey = (process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "").trim();
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_ENV === "production";

    if (!serverKey) {
      return NextResponse.json({ error: "Missing MIDTRANS_SERVER_KEY" }, { status: 500 });
    }

    // 1. SHA-512 Webhook Signature Verification (Anti-Forgery)
    if (signature_key && order_id && status_code && gross_amount) {
      const payload = `${order_id}${status_code}${gross_amount}${serverKey}`;
      const calculatedSignature = crypto
        .createHash("sha512")
        .update(payload)
        .digest("hex");

      if (signature_key !== calculatedSignature) {
        console.error("Midtrans Security Alert: Invalid Webhook Signature Key detected!");
        return NextResponse.json({ error: "Forbidden: Invalid signature key" }, { status: 403 });
      }
    }

    // 2. Official SDK Notification Status Parse
    const snap = new midtransClient.Snap({
      isProduction,
      serverKey,
      clientKey,
    });

    const statusResponse = await (snap as any).transaction.notification(body);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Verified Midtrans Webhook for Order: ${orderId}, Status: ${transactionStatus}`);

    let isSuccess = false;

    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        isSuccess = true;
      }
    } else if (transactionStatus === "settlement") {
      isSuccess = true;
    }

    return NextResponse.json({
      status: "ok",
      orderId,
      transactionStatus,
      isSuccess,
    });
  } catch (err: any) {
    console.error("Midtrans Notification Error:", err);
    return NextResponse.json({ error: err.message || "Notification handling failed" }, { status: 500 });
  }
}
