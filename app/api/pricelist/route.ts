import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ServicePackage, INITIAL_PACKAGES } from "@/app/admin/item-jasa/page";

let globalServerPackages: ServicePackage[] = INITIAL_PACKAGES;

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET /api/pricelist — retrieve active packages from Supabase
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      // 1. Try dedicated pricelist_packages table
      try {
        const { data, error } = await supabase.from("pricelist_packages").select("*").order("id", { ascending: true });
        if (!error && data && Array.isArray(data) && data.length > 0) {
          const mapped: ServicePackage[] = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            price: Number(d.price) || 0,
            discountPercent: Number(d.discount_percent ?? d.discountPercent) || 0,
            revisionLimit: d.revision_limit || d.revisionLimit || "Revisi Max 1x",
            description: d.description || "",
            features: Array.isArray(d.features) ? d.features : typeof d.features === "string" ? JSON.parse(d.features) : [],
            isPopular: d.is_popular ?? d.isPopular ?? false,
            isActive: d.is_active ?? d.isActive ?? true,
          }));
          globalServerPackages = mapped;
          return NextResponse.json({ packages: mapped, source: "supabase_table" });
        }
      } catch {}

      // 2. Universal Config Fallback inside Supabase orders table
      const { data: configRow, error: configErr } = await supabase
        .from("orders")
        .select("brief_text")
        .eq("id", "_config_pricelist")
        .maybeSingle();

      if (!configErr && configRow && configRow.brief_text) {
        try {
          const parsed = JSON.parse(configRow.brief_text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            globalServerPackages = parsed;
            return NextResponse.json({ packages: parsed, source: "supabase_kv" });
          }
        } catch {}
      }
    }
  } catch (err) {
    console.warn("Supabase pricelist fetch notice:", err);
  }

  return NextResponse.json({ packages: globalServerPackages, source: "memory" });
}

// POST /api/pricelist — save active packages from Admin to Supabase
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { packages } = body;

    if (Array.isArray(packages)) {
      globalServerPackages = packages;

      const supabase = getSupabaseClient();
      if (supabase) {
        // 1. Universal Config Save inside Supabase
        try {
          await supabase.from("orders").upsert({
            id: "_config_pricelist",
            code: "_SYSTEM_CONFIG_",
            official_code: "_SYSTEM_CONFIG_",
            temp_code: "_SYSTEM_CONFIG_",
            customer_name: "SYSTEM_CONFIG",
            brief_text: JSON.stringify(packages),
            created_at: new Date().toISOString(),
          });
        } catch (e) {
          console.warn("Supabase pricelist KV save notice:", e);
        }

        // 2. Try dedicated table if exists
        try {
          const rows = packages.map((p: ServicePackage) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            discount_percent: p.discountPercent || 0,
            revision_limit: p.revisionLimit,
            description: p.description,
            features: p.features,
            is_popular: p.isPopular || false,
            is_active: p.isActive ?? true,
          }));
          await supabase.from("pricelist_packages").upsert(rows);
        } catch {}
      }

      return NextResponse.json({ success: true, packages: globalServerPackages });
    }

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update pricelist" }, { status: 500 });
  }
}
