import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export interface HeroContent {
  headline: string;
  subheadline: string;
  description?: string;
  ctaText?: string;
  fontFamily?: string;
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

export const OFFICIAL_10_PORTFOLIO: PortfolioItem[] = [
  { id: "p1",  title: "Cosplay 01", category: "Regular",            image: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785183996/Pic_2_sbrbuc.jpg" },
  { id: "p2",  title: "Cosplay 02", category: "Background Premium", image: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785188133/Pic_1_Aemeath_a6tnw8.jpg" },
  { id: "p3",  title: "Cosplay 03", category: "Regular",            image: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785414586/Final_oa3n4x.jpg" },
  { id: "p4",  title: "Cosplay 04", category: "Regular",            image: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785414651/Final_Clean_m20ri7.jpg" },
  { id: "p5",  title: "Cosplay 05", category: "Regular",            image: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785414847/david_szbhpi.png" },
  { id: "p6",  title: "Cosplay 06", category: "Background Premium", image: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785414987/Edit_wfui7l.png" },
  { id: "p7",  title: "Cosplay 07", category: "Regular",            image: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785415103/Final_rqbqbj.jpg" },
  { id: "p8",  title: "Cosplay 08", category: "Background Premium", image: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785415206/Final_nsc3k5.jpg" },
  { id: "p9",  title: "Cosplay 09", category: "Regular",            image: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785415274/Final_2_Compare_csw7vk.jpg" },
  { id: "p10", title: "Cosplay 10", category: "Background Premium", image: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785415340/Final_01_e3s5sw.jpg" },
];

export const DEFAULT_SITE_CONTENT: SiteContentData = {
  hero: {
    headline: "Platform Interaktif",
    subheadline: "CosplayGenerative",
    description: "Transformasi foto cosplay dengan background premium serta sistem pemesanan yang jelas untuk memastikan setiap proses dapat dipantau dengan mudah.",
    ctaText: "Pesan Sekarang",
  },
  faqs: [
    {
      id: "f1",
      question: "Berapa lama estimasi pengerjaan foto cosplay saya?",
      answer: "Estimasi pengerjaan ±3 hari kerja efektif setelah disetujui Admin. Mengikuti antrian.",
    },
    {
      id: "f2",
      question: "Bagaimana alur pembayaran pesanan?",
      answer: "Pembayaran dilakukan via Midtrans Snap (QRIS, VA, E-wallet) setelah Admin melakukan ACC pesanan kamu.",
    },
    {
      id: "f3",
      question: "Berapa kali batas revisi yang diberikan?",
      answer: "Setiap paket sudah termasuk 1x revisi dan pengiriman file resolusi penuh.",
    },
    {
      id: "f4",
      question: "Bagaimana cara pengiriman file foto mentah?",
      answer: "Kamu cukup memberikan 1 link Google Drive berisi foto mentah yang akan diedit pada formulir order.",
    },
  ],
  portfolio: OFFICIAL_10_PORTFOLIO,
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
            // Filter out old unsplash images
            const filteredPortfolio = Array.isArray(parsed.portfolio)
              ? parsed.portfolio.filter((p: any) => p.image && p.image.includes("cloudinary.com"))
              : [];

            globalServerContent = {
              hero: { ...DEFAULT_SITE_CONTENT.hero, ...parsed.hero },
              faqs: Array.isArray(parsed.faqs) && parsed.faqs.length ? parsed.faqs : DEFAULT_SITE_CONTENT.faqs,
              portfolio: filteredPortfolio.length ? filteredPortfolio : OFFICIAL_10_PORTFOLIO,
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
