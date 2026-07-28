import { NextResponse } from "next/server";
import crypto from "crypto";
// @ts-ignore - midtrans-client ES import compatibility
import midtransClient from "midtrans-client";
import { INITIAL_PACKAGES } from "@/app/admin/item-jasa/page";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderCode,
      totalAmount: clientAmount,
      customerName,
      customerEmail,
      customerPhone,
      packageName,
    } = body;

    // 1. Input Sanitization & Validation
    if (!orderCode || typeof orderCode !== "string") {
      return NextResponse.json(
        { error: "Kode order (orderCode) wajib diisi." },
        { status: 400 }
      );
    }

    // Sanitize orderCode to prevent injection
    const sanitizedOrderCode = orderCode.trim().replace(/[^a-zA-Z0-9-]/g, "");

    // 2. Server-side Price Verification (Anti-Tampering)
    // Find package or fallback to minimum verified price, avoiding client-side price tampering
    let verifiedAmount = Number(clientAmount);
    const matchedPackage = INITIAL_PACKAGES.find(
      (p) => p.name.toLowerCase() === (packageName || "").toLowerCase()
    );

    if (matchedPackage) {
      const discount = matchedPackage.discountPercent || 0;
      verifiedAmount = Math.round(matchedPackage.price * (1 - discount / 100));
    }

    if (!verifiedAmount || isNaN(verifiedAmount) || verifiedAmount <= 0) {
      return NextResponse.json(
        { error: "Jumlah tagihan (totalAmount) tidak valid." },
        { status: 400 }
      );
    }

    const serverKey = (process.env.MIDTRANS_SERVER_KEY || "").trim();
    const clientKey = (process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "").trim();
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_ENV === "production";

    if (!serverKey) {
      return NextResponse.json(
        { error: "MIDTRANS_SERVER_KEY belum diisi di .env.local" },
        { status: 500 }
      );
    }

    const snap = new midtransClient.Snap({
      isProduction,
      serverKey,
      clientKey,
    });

    // Create unique Midtrans transaction order_id
    const midtransOrderId = `${sanitizedOrderCode}-${Date.now().toString().slice(-6)}`;

    const parameter = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: verifiedAmount,
      },
      item_details: [
        {
          id: sanitizedOrderCode,
          price: verifiedAmount,
          quantity: 1,
          name: `Jasa Edit Cosplay - ${packageName || "Paket CosGen"}`,
        },
      ],
      customer_details: {
        first_name: (customerName || "Pelanggan").slice(0, 50),
        email: customerEmail || "customer@cosgen.id",
        phone: customerPhone || "081234567890",
      },
      credit_card: {
        secure: true,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    // Return strictly token & redirect_url
    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: midtransOrderId,
    });
  } catch (err: any) {
    console.error("Midtrans Snap API Error:", err);
    const errMsg =
      err?.ApiResponse?.error_messages?.join(", ") ||
      err?.message ||
      "Gagal membuat transaksi Midtrans. Periksa MIDTRANS_SERVER_KEY di .env.local";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
