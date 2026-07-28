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

// GET /api/pricelist — fetch global packages set by Admin
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
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
        return NextResponse.json({ packages: mapped, source: "supabase" });
      }
    }
  } catch (err) {
    console.warn("Supabase pricelist fetch notice:", err);
  }

  return NextResponse.json({ packages: globalServerPackages, source: "memory" });
}

// POST /api/pricelist — save global packages set by Admin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { packages } = body;

    if (Array.isArray(packages)) {
      globalServerPackages = packages;

      const supabase = getSupabaseClient();
      if (supabase) {
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
        } catch (e) {
          console.warn("Supabase pricelist upsert notice:", e);
        }
      }

      return NextResponse.json({ success: true, packages: globalServerPackages });
    }

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update pricelist" }, { status: 500 });
  }
}
