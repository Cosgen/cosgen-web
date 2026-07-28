import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaText?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  beforeImage?: string;
  afterImage?: string;
}

export interface SiteContentData {
  hero: HeroContent;
  faqs: FaqItem[];
  portfolio: PortfolioItem[];
}

export const DEFAULT_SITE_CONTENT: SiteContentData = {
  hero: {
    headline: "Ubah Foto Cosplay & Karya Kreatif Jadi Mahakarya Epik",
    subheadline: "Layanan editing visual profesional untuk Cosplay, Generasi AI, & Background Premium dengan sistem alur pemesanan transparan.",
    ctaText: "Pesan Jasa Edit Sekarang",
  },
  faqs: [
    {
      id: "f1",
      question: "Berapa lama estimasi pengerjaan foto cosplay saya?",
      answer: "Estimasi pengerjaan ±3 hari kerja efektif setelah disetujui Admin. Mengikuti antrian, tidak dijamin.",
    },
    {
      id: "f2",
      question: "Bagaimana alur pembayaran pesanan?",
      answer: "Pembayaran dilakukan via Midtrans Snap (QRIS, VA, E-wallet) setelah Admin melakukan ulasan awal & ACC pesanan kamu.",
    },
    {
      id: "f3",
      question: "Berapa kali batas revisi yang diberikan?",
      answer: "Batas revisi disesuaikan dengan paket yang dipilih (Pertalite Max 1x, Pertamax Max 2x, Pertamax Turbo Unlimited). Setiap sesi review diberikan batas waktu 4x24 jam.",
    },
    {
      id: "f4",
      question: "Bagaimana cara pengiriman file foto mentah?",
      answer: "Kamu cukup memberikan 1 link Google Drive berisi foto mentah yang akan diedit + foto referensi pada formulir order.",
    },
  ],
  portfolio: [
    {
      id: "p1",
      title: "Cyberpunk Cyber-Samurai Cosplay",
      category: "Background Premium",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800",
      beforeImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800",
      afterImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800",
    },
    {
      id: "p2",
      title: "Gothic Anime Alchemist",
      category: "Portrait",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800",
      beforeImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800",
      afterImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800",
    },
    {
      id: "p3",
      title: "Fantasy Dragon Realm",
      category: "Background Premium",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800",
      beforeImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800",
      afterImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800",
    },
  ],
};

let globalServerContent: SiteContentData = DEFAULT_SITE_CONTENT;

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET /api/content — fetch live Hero, FAQ, and Portfolio content from Supabase
export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: configRow, error: configErr } = await supabase
        .from("orders")
        .select("brief_text")
        .eq("id", "_config_content")
        .maybeSingle();

      if (!configErr && configRow && configRow.brief_text) {
        try {
          const parsed = JSON.parse(configRow.brief_text);
          if (parsed && (parsed.hero || parsed.faqs || parsed.portfolio)) {
            globalServerContent = {
              hero: { ...DEFAULT_SITE_CONTENT.hero, ...parsed.hero },
              faqs: Array.isArray(parsed.faqs) && parsed.faqs.length > 0 ? parsed.faqs : DEFAULT_SITE_CONTENT.faqs,
              portfolio: Array.isArray(parsed.portfolio) && parsed.portfolio.length > 0 ? parsed.portfolio : DEFAULT_SITE_CONTENT.portfolio,
            };
            return NextResponse.json({ content: globalServerContent, source: "supabase_kv" });
          }
        } catch {}
      }

      // Auto-seed default site content to Supabase on first fetch
      try {
        await supabase.from("orders").upsert({
          id: "_config_content",
          code: "_SYSTEM_CONFIG_",
          official_code: "_SYSTEM_CONFIG_",
          temp_code: "_SYSTEM_CONFIG_",
          customer_name: "SYSTEM_CONFIG",
          brief_text: JSON.stringify(DEFAULT_SITE_CONTENT),
          created_at: new Date().toISOString(),
        });
      } catch {}
    }
  } catch (err) {
    console.warn("Supabase content fetch notice:", err);
  }

  return NextResponse.json({ content: globalServerContent, source: "memory" });
}

// POST /api/content — save updated Hero, FAQ, and Portfolio content set by Admin to Supabase
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content } = body;

    if (content) {
      globalServerContent = {
        hero: { ...DEFAULT_SITE_CONTENT.hero, ...(content.hero || {}) },
        faqs: Array.isArray(content.faqs) ? content.faqs : globalServerContent.faqs,
        portfolio: Array.isArray(content.portfolio) ? content.portfolio : globalServerContent.portfolio,
      };

      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.from("orders").upsert({
            id: "_config_content",
            code: "_SYSTEM_CONFIG_",
            official_code: "_SYSTEM_CONFIG_",
            temp_code: "_SYSTEM_CONFIG_",
            customer_name: "SYSTEM_CONFIG",
            brief_text: JSON.stringify(globalServerContent),
            created_at: new Date().toISOString(),
          });
        } catch (e) {
          console.warn("Supabase content KV save notice:", e);
        }
      }

      return NextResponse.json({ success: true, content: globalServerContent });
    }

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update content" }, { status: 500 });
  }
}
