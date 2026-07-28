import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OrderData } from "@/lib/order-store";

// Global in-memory server store for immediate multi-client sync
let globalServerOrders: OrderData[] = [];

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET /api/orders — retrieve all global orders from Supabase as single source of truth
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (!error && data && Array.isArray(data)) {
        const mappedOrders: OrderData[] = data
          .filter((d: any) => !d.id?.startsWith("_config_") && d.code !== "_SYSTEM_CONFIG_")
          .map((d: any) => ({
          id: d.id,
          code: d.code,
          officialCode: d.official_code || d.officialCode || d.code,
          tempCode: d.temp_code || d.tempCode || d.code,
          customerName: d.customer_name || d.customerName || "Pelanggan",
          whatsapp: d.whatsapp || "-",
          instagram: d.instagram || "-",
          package: d.package || "Pertamax",
          photoCount: d.photo_count || d.photoCount || 1,
          totalAmount: d.total_amount || d.totalAmount || 0,
          status: d.status || "Menunggu Konfirmasi",
          isAccByAdmin: d.is_acc_by_admin ?? d.isAccByAdmin ?? false,
          rejectionReason: d.rejection_reason || d.rejectionReason,
          customerGdriveUrl: d.customer_gdrive_url || d.customerGdriveUrl,
          gdriveReviewUrl: d.gdrive_review_url || d.gdriveReviewUrl,
          gdriveFinalUrl: d.gdrive_final_url || d.gdriveFinalUrl,
          subStatus: d.sub_status || d.subStatus,
          briefText: d.brief_text || d.briefText,
          createdAt: d.created_at || d.createdAt || new Date().toISOString(),
        }));
        globalServerOrders = mappedOrders;
        return NextResponse.json({ orders: mappedOrders, source: "supabase" });
      }
    }
  } catch (err) {
    console.warn("Supabase fetch notice, using global server memory:", err);
  }

  return NextResponse.json({ orders: globalServerOrders, source: "memory" });
}

// POST /api/orders — save, update, delete, or clear orders globally
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, order, orderId, partial } = body;

    // Action: CLEAR ALL ORDERS
    if (action === "clear") {
      globalServerOrders = [];
      const supabase = getSupabaseClient();
      if (supabase) {
        try { await supabase.from("orders").delete().neq("id", "0"); } catch {}
      }
      return NextResponse.json({ success: true, orders: [] });
    }

    // Action: DELETE SINGLE ORDER
    if (action === "delete" && orderId) {
      globalServerOrders = globalServerOrders.filter((o) => o.id !== orderId);
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from("orders").delete().eq("id", orderId);
        } catch (e) {
          console.warn("Supabase delete notice:", e);
        }
      }
      return NextResponse.json({ success: true, orders: globalServerOrders });
    }

    // Action: CREATE NEW ORDER
    if (action === "create" && order) {
      const idx = globalServerOrders.findIndex((o) => o.id === order.id || o.code === order.code);
      if (idx >= 0) {
        globalServerOrders[idx] = { ...globalServerOrders[idx], ...order };
      } else {
        globalServerOrders.unshift(order);
      }

      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { error: upsertErr } = await supabase.from("orders").upsert({
            id: order.id,
            code: order.code,
            official_code: order.officialCode || order.code,
            temp_code: order.tempCode || order.code,
            customer_name: order.customerName,
            whatsapp: order.whatsapp,
            instagram: order.instagram,
            package: order.package,
            photo_count: order.photoCount,
            total_amount: order.totalAmount,
            status: order.status,
            customer_gdrive_url: order.customerGdriveUrl || null,
            brief_text: order.briefText || null,
            created_at: new Date().toISOString(),
          });
          if (upsertErr) console.error("Supabase upsert error:", upsertErr);
        } catch (e) {
          console.warn("Supabase upsert exception:", e);
        }
      }

      return NextResponse.json({ success: true, order, orders: globalServerOrders });
    }

    // Action: UPDATE ORDER
    if (action === "update" && orderId && partial) {
      const idx = globalServerOrders.findIndex((o) => o.id === orderId);
      if (idx >= 0) {
        globalServerOrders[idx] = { ...globalServerOrders[idx], ...partial };
      }

      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const dbPartial: any = {};
          if (partial.status !== undefined) dbPartial.status = partial.status;
          if (partial.officialCode !== undefined) dbPartial.official_code = partial.officialCode;
          if (partial.isAccByAdmin !== undefined) dbPartial.is_acc_by_admin = partial.isAccByAdmin;
          if (partial.rejectionReason !== undefined) dbPartial.rejection_reason = partial.rejectionReason;
          if (partial.gdriveReviewUrl !== undefined) dbPartial.gdrive_review_url = partial.gdriveReviewUrl;
          if (partial.gdriveFinalUrl !== undefined) dbPartial.gdrive_final_url = partial.gdriveFinalUrl;
          if (partial.subStatus !== undefined) dbPartial.sub_status = partial.subStatus;

          await supabase.from("orders").update(dbPartial).eq("id", orderId);
        } catch {}
      }

      return NextResponse.json({ success: true, orders: globalServerOrders });
    }

    return NextResponse.json({ error: "Invalid action or parameters" }, { status: 400 });
  } catch (err: any) {
    console.error("Global Order API error:", err);
    return NextResponse.json({ error: err.message || "Failed to process global order" }, { status: 500 });
  }
}
