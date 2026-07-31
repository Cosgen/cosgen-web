import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OrderData, mergeOrders } from "@/lib/order-store";

// Global in-memory server store for immediate multi-client sync
let globalServerOrders: OrderData[] = [];

const DEFAULT_SUPABASE_URL = "https://sqmapdcfyhnpjnjjeary.supabase.co";
const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxbWFwZGNmeWhucGpuamplYXJ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgwMjg2MiwiZXhwIjoyMTAwMzc4ODYyfQ.RQT8QJg3D2OoXp6lOxwPcKi5faFM_VzmB5xWDv0CPSY";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function saveMasterKvBackup(supabase: any, orders: OrderData[]) {
  if (!supabase || !Array.isArray(orders)) return;
  try {
    await supabase.from("orders").upsert({
      id: "_global_all_orders",
      code: "_SYSTEM_CONFIG_",
      customer_name: "SYSTEM_KV_BACKUP",
      brief_text: JSON.stringify(orders),
    });
  } catch (e) {
    console.warn("KV backup upsert notice:", e);
  }
}

async function updateSupabaseOrder(supabase: any, orderId: string, dbPartial: any) {
  try {
    // 1. Try updating by id
    const { data: d1, error: e1 } = await supabase.from("orders").update(dbPartial).eq("id", orderId).select();
    if (!e1 && d1 && d1.length > 0) return true;

    // 2. Try updating by code
    const { data: d2, error: e2 } = await supabase.from("orders").update(dbPartial).eq("code", orderId).select();
    if (!e2 && d2 && d2.length > 0) return true;

    // 3. Try updating by official_code
    const { data: d3, error: e3 } = await supabase.from("orders").update(dbPartial).eq("official_code", orderId).select();
    if (!e3 && d3 && d3.length > 0) return true;

    // 4. Try updating by temp_code
    const { data: d4, error: e4 } = await supabase.from("orders").update(dbPartial).eq("temp_code", orderId).select();
    if (!e4 && d4 && d4.length > 0) return true;
  } catch (e) {
    console.warn("Supabase update helper notice:", e);
  }
  return false;
}

// GET /api/orders — retrieve all global orders from Supabase as single source of truth
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (!error && data && Array.isArray(data)) {
        let masterKvOrders: OrderData[] = [];
        const kvRow = data.find((d: any) => d.id === "_global_all_orders");
        if (kvRow && kvRow.brief_text) {
          try {
            const parsed = JSON.parse(kvRow.brief_text);
            if (Array.isArray(parsed)) masterKvOrders = parsed;
          } catch {}
        }

        const mappedOrders: OrderData[] = data
          .filter((d: any) => !d.id?.startsWith("_config_") && !d.id?.startsWith("_global_") && d.code !== "_SYSTEM_CONFIG_")
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
            reviewStartedAt: d.review_started_at || d.reviewStartedAt,
            createdAt: d.created_at || d.createdAt || new Date().toISOString(),
          }));

        // Combine individual database rows with master KV backup orders
        const combined = mergeOrders(mappedOrders, masterKvOrders);

        if (globalServerOrders.length > 0) {
          globalServerOrders = mergeOrders(combined, globalServerOrders);
        } else {
          globalServerOrders = combined;
        }

        return NextResponse.json({ orders: globalServerOrders, source: "supabase" });
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
    const { action, order, orders, orderId, partial } = body;

    // Action: BATCH SYNC ORDERS
    if (action === "sync" && Array.isArray(orders)) {
      const supabase = getSupabaseClient();
      globalServerOrders = mergeOrders(globalServerOrders, orders);

      if (supabase && orders.length > 0) {
        try {
          const rows = orders.map((o: OrderData) => ({
            id: o.id,
            code: o.code,
            official_code: o.officialCode || o.code,
            temp_code: o.tempCode || o.code,
            customer_name: o.customerName,
            whatsapp: o.whatsapp,
            instagram: o.instagram,
            package: o.package,
            photo_count: o.photoCount,
            total_amount: o.totalAmount,
            status: o.status,
            is_acc_by_admin: o.isAccByAdmin ?? false,
            rejection_reason: o.rejectionReason || null,
            customer_gdrive_url: o.customerGdriveUrl || null,
            gdrive_review_url: o.gdriveReviewUrl || null,
            gdrive_final_url: o.gdriveFinalUrl || null,
            brief_text: o.briefText || null,
            review_started_at: o.reviewStartedAt || null,
            created_at: o.createdAt || new Date().toISOString(),
          }));
          await supabase.from("orders").upsert(rows);
        } catch (e) {
          console.warn("Supabase batch sync notice:", e);
        }
        await saveMasterKvBackup(supabase, globalServerOrders);
      }

      return NextResponse.json({ success: true, orders: globalServerOrders });
    }

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
      globalServerOrders = globalServerOrders.filter(
        (o) =>
          o.id !== orderId &&
          o.code !== orderId &&
          (o.officialCode ? o.officialCode !== orderId : true) &&
          (o.tempCode ? o.tempCode !== orderId : true)
      );

      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from("orders").delete().eq("id", orderId);
        } catch (e) {
          console.warn("Supabase delete by id notice:", e);
        }
        try {
          await supabase.from("orders").delete().eq("code", orderId);
        } catch (e) {
          console.warn("Supabase delete by code notice:", e);
        }
        try {
          await supabase.from("orders").delete().eq("official_code", orderId);
        } catch (e) {
          console.warn("Supabase delete by official_code notice:", e);
        }
        try {
          await supabase.from("orders").delete().eq("temp_code", orderId);
        } catch (e) {
          console.warn("Supabase delete by temp_code notice:", e);
        }
        await saveMasterKvBackup(supabase, globalServerOrders);
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
            is_acc_by_admin: order.isAccByAdmin ?? false,
            rejection_reason: order.rejectionReason || null,
            customer_gdrive_url: order.customerGdriveUrl || null,
            gdrive_review_url: order.gdriveReviewUrl || null,
            gdrive_final_url: order.gdriveFinalUrl || null,
            brief_text: order.briefText || null,
            review_started_at: order.reviewStartedAt || null,
            created_at: order.createdAt || new Date().toISOString(),
          });
          if (upsertErr) console.error("Supabase upsert error:", upsertErr);
        } catch (e) {
          console.warn("Supabase upsert exception:", e);
        }
        await saveMasterKvBackup(supabase, globalServerOrders);
      }

      return NextResponse.json({ success: true, order, orders: globalServerOrders });
    }

    // Action: UPDATE ORDER
    if (action === "update" && orderId && partial) {
      const idx = globalServerOrders.findIndex(
        (o) =>
          o.id === orderId ||
          o.code === orderId ||
          (o.officialCode && o.officialCode === orderId) ||
          (o.tempCode && o.tempCode === orderId)
      );
      if (idx >= 0) {
        globalServerOrders[idx] = { ...globalServerOrders[idx], ...partial };
      }

      const supabase = getSupabaseClient();
      if (supabase) {
        const dbPartial: any = {};
        if (partial.status !== undefined) dbPartial.status = partial.status;
        if (partial.code !== undefined) dbPartial.code = partial.code;
        if (partial.officialCode !== undefined) dbPartial.official_code = partial.officialCode;
        if (partial.tempCode !== undefined) dbPartial.temp_code = partial.tempCode;
        if (partial.isAccByAdmin !== undefined) dbPartial.is_acc_by_admin = partial.isAccByAdmin;
        if (partial.rejectionReason !== undefined) dbPartial.rejection_reason = partial.rejectionReason;
        if (partial.customerGdriveUrl !== undefined) dbPartial.customer_gdrive_url = partial.customerGdriveUrl;
        if (partial.gdriveReviewUrl !== undefined) dbPartial.gdrive_review_url = partial.gdriveReviewUrl;
        if (partial.gdriveFinalUrl !== undefined) dbPartial.gdrive_final_url = partial.gdriveFinalUrl;
        if (partial.subStatus !== undefined) dbPartial.sub_status = partial.subStatus;
        if (partial.photoCount !== undefined) dbPartial.photo_count = partial.photoCount;
        if (partial.totalAmount !== undefined) dbPartial.total_amount = partial.totalAmount;
        if (partial.briefText !== undefined) dbPartial.brief_text = partial.briefText;
        if (partial.reviewStartedAt !== undefined) dbPartial.review_started_at = partial.reviewStartedAt;

        await updateSupabaseOrder(supabase, orderId, dbPartial);
        await saveMasterKvBackup(supabase, globalServerOrders);
      }

      return NextResponse.json({ success: true, orders: globalServerOrders });
    }

    return NextResponse.json({ error: "Invalid action or parameters" }, { status: 400 });
  } catch (err: any) {
    console.error("Global Order API error:", err);
    return NextResponse.json({ error: err.message || "Failed to process global order" }, { status: 500 });
  }
}
