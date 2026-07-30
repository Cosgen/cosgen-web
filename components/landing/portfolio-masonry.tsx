"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export interface PortfolioItem {
  id: string;
  title: string;
  category: "Regular" | "Background Premium";
  imageUrl: string;
  aspectRatio?: "portrait" | "landscape";
}

// Default real CosGen images — shown when no admin content yet
const DEFAULT_ITEMS: PortfolioItem[] = [
  { id: "d1", title: "Cosplay VFX Sinematik",           category: "Regular",             imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785183996/Pic_2_sbrbuc.jpg" },
  { id: "d2", title: "Background Premium — Cinematic",  category: "Background Premium",  imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785188133/Pic_1_Aemeath_a6tnw8.jpg" },
  { id: "d3", title: "Full CGI Edit",                   category: "Regular",             imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785414586/Final_oa3n4x.jpg" },
  { id: "d4", title: "Clean Visual Edit",               category: "Regular",             imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785414651/Final_Clean_m20ri7.jpg" },
  { id: "d5", title: "Portrait Retouch",                category: "Regular",             imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785414847/david_szbhpi.png" },
  { id: "d6", title: "VFX Compositing",                 category: "Background Premium",  imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785414987/Edit_wfui7l.png" },
  { id: "d7", title: "Cosplay CGI Final",               category: "Regular",             imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785415103/Final_rqbqbj.jpg" },
  { id: "d8", title: "Scene Render Final",              category: "Background Premium",  imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785415206/Final_nsc3k5.jpg" },
  { id: "d9", title: "Before-After Compare",            category: "Regular",             imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785415274/Final_2_Compare_csw7vk.jpg" },
  { id: "d10", title: "Final Edit Master",              category: "Background Premium",  imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785415340/Final_01_e3s5sw.jpg" },
];

const getInitialPortfolio = (): PortfolioItem[] => {
  if (typeof window === "undefined") return DEFAULT_ITEMS;
  try {
    const c = JSON.parse(localStorage.getItem("cosgen_site_content") || "null");
    if (c?.portfolio?.length) return c.portfolio.map((p: any, i: number) => ({
      id: p.id || `p-${i}`, title: p.title,
      category: p.category === "Background Premium" ? "Background Premium" : "Regular",
      imageUrl: p.image || p.imageUrl || "",
    }));
  } catch {}
  return DEFAULT_ITEMS;
};

export function PortfolioSection() {
  const [mounted,  setMounted]  = useState(false);
  const [items,    setItems]    = useState<PortfolioItem[]>(getInitialPortfolio);
  const [filter,   setFilter]   = useState<"Semua" | "Regular" | "Background Premium">("Semua");
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    setMounted(true);
    const load = () => {
      fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" })
        .then(r => r.json()).then(d => {
          if (d.content?.portfolio?.length) {
            setItems(d.content.portfolio.map((p: any, i: number) => ({
              id: p.id || `p-${i}`, title: p.title,
              category: p.category === "Background Premium" ? "Background Premium" : "Regular",
              imageUrl: p.image || p.imageUrl || "",
            })));
            try { localStorage.setItem("cosgen_site_content", JSON.stringify(d.content)); } catch {}
          }
        }).catch(() => {});
    };
    load();
    window.addEventListener("cosgen_content_updated", load);
    window.addEventListener("storage", load);
    return () => { window.removeEventListener("cosgen_content_updated", load); window.removeEventListener("storage", load); };
  }, []);

  const filtered = filter === "Semua" ? items : items.filter(p => p.category === filter);

  // Bento grid spans — cycles through layout pattern
  const bentoSpans = [
    "col-span-2 row-span-2",  // big
    "col-span-1 row-span-1",  // sm
    "col-span-1 row-span-2",  // tall
    "col-span-1 row-span-1",  // sm
    "col-span-1 row-span-1",  // sm
    "col-span-2 row-span-1",  // wide
    "col-span-1 row-span-1",  // sm
    "col-span-1 row-span-1",  // sm
    "col-span-1 row-span-1",  // sm
    "col-span-1 row-span-1",  // sm
  ];

  return (
    <section id="portfolio" className="section" style={{ background: "var(--bg-1)" }}>
      <div className="container">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div>
            <div className="section-tag mb-3">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
              Portofolio
            </div>
            <h2 className="headline" style={{ fontSize: "clamp(24px,3.5vw,44px)", color: "var(--text-1)" }}>
              Karya Terbaik
            </h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["Semua", "Regular", "Background Premium"] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className="btn btn-sm"
                style={filter === cat
                  ? { background: "var(--blue-dim)", color: "var(--blue)", border: "1px solid var(--blue-border)" }
                  : { background: "var(--surface)", color: "var(--text-2)", border: "1px solid var(--border)" }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── BENTO GRID (desktop 4-col, tablet 2-col, mobile 2-col) ── */}
        {filtered.length === 0 ? (
          <p className="text-center py-20 text-[14px]" style={{ color: "var(--text-3)" }}>
            Belum ada karya — tambahkan dari admin panel.
          </p>
        ) : (
          <>
            {/* Desktop bento — hidden on mobile */}
            <div
              className="hidden md:grid gap-3"
              style={{
                gridTemplateColumns: "repeat(4, 1fr)",
                gridAutoRows: "180px",
                opacity: mounted ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              {filtered.map((item, idx) => {
                const span = bentoSpans[idx % bentoSpans.length];
                return (
                  <div
                    key={item.id}
                    className={`${span} group relative overflow-hidden cursor-pointer`}
                    style={{
                      borderRadius: "var(--r-xl)",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                    }}
                    onClick={() => setLightbox(item)}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div
                      className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: "linear-gradient(to top, rgba(5,10,20,0.88) 0%, transparent 55%)" }}
                    >
                      <span
                        className="label w-fit mb-1"
                        style={item.category === "Background Premium"
                          ? { background: "rgba(251,191,36,.15)", color: "#FBBF24", border: "1px solid rgba(251,191,36,.25)" }
                          : { background: "var(--blue-dim)", color: "var(--blue)", border: "1px solid var(--blue-border)" }
                        }
                      >
                        {item.category === "Background Premium" ? "Premium" : "Regular"}
                      </span>
                      <p className="text-white font-semibold text-[12px] leading-snug">{item.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile grid — 2 col, uniform */}
            <div
              className="grid md:hidden gap-2.5"
              style={{
                gridTemplateColumns: "repeat(2, 1fr)",
                opacity: mounted ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              {filtered.map((item, idx) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden cursor-pointer"
                  style={{
                    aspectRatio: "1/1",
                    borderRadius: "var(--r-lg)",
                    background: "var(--surface)",
                  }}
                  onClick={() => setLightbox(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 p-2"
                    style={{ background: "linear-gradient(to top, rgba(5,10,20,0.8), transparent)" }}
                  >
                    <p className="text-white text-[10px] font-semibold leading-snug">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)" }}
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-3xl w-full overflow-hidden"
            style={{ borderRadius: "var(--r-2xl)", boxShadow: "var(--shadow-xl)" }}
            onClick={e => e.stopPropagation()}
          >
            <img src={lightbox.imageUrl} alt={lightbox.title} className="w-full h-auto" />
            <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
              <p className="text-white font-semibold text-[13px]">{lightbox.title}</p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>{lightbox.category}</p>
            </div>
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-white"
              style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", borderRadius: "var(--r-sm)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
