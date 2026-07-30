"use client";

import React, { useState, useEffect } from "react";
import { Maximize2, X } from "lucide-react";

export interface PortfolioItem {
  id: string;
  title: string;
  category: "Regular" | "Background Premium";
  imageUrl: string;
  aspectRatio?: "portrait" | "landscape"; // kept for backward compat
}

const getInitialPortfolio = (): PortfolioItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const c = JSON.parse(localStorage.getItem("cosgen_site_content") || "null");
    if (c?.portfolio?.length) return c.portfolio.map((p: any, i: number) => ({
      id: p.id || `p-${i}`, title: p.title,
      category: p.category === "Background Premium" ? "Background Premium" : "Regular",
      imageUrl: p.image || p.imageUrl || "",
    }));
  } catch {}
  return [];
};

export function PortfolioSection() {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<PortfolioItem[]>(getInitialPortfolio);
  const [filter, setFilter] = useState<"Semua" | "Regular" | "Background Premium">("Semua");
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    setMounted(true);
    const load = () => {
      fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" })
        .then(r => r.json()).then(d => {
          if (d.content?.portfolio?.length) {
            const mapped: PortfolioItem[] = d.content.portfolio.map((p: any, i: number) => ({
              id: p.id || `p-${i}`, title: p.title,
              category: p.category === "Background Premium" ? "Background Premium" : "Regular",
              imageUrl: p.image || p.imageUrl || "",
            }));
            setItems(mapped);
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

  return (
    <section id="portfolio" className="section" style={{ background: "var(--bg-1)" }}>
      <div className="container">

        {/* ── Header row ─────────────────────────────────────── */}
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

          {/* Filter */}
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

        {/* ── Grid ───────────────────────────────────────────── */}
        {!mounted || filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[14px]" style={{ color: "var(--text-3)" }}>
              {!mounted ? "Memuat karya..." : "Belum ada karya — tambahkan dari admin panel."}
            </p>
          </div>
        ) : (
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            {filtered.map((item, idx) => (
              <div
                key={item.id}
                className="group relative overflow-hidden cursor-pointer"
                style={{
                  borderRadius: "var(--r-xl)",
                  aspectRatio: idx % 3 === 0 ? "3/4" : idx % 3 === 1 ? "1/1" : "4/3",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  transition: "transform 200ms ease, box-shadow 200ms ease",
                }}
                onClick={() => setLightbox(item)}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-lg)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
              >
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {/* Overlay */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: "linear-gradient(to top, rgba(5,10,20,0.9) 0%, transparent 60%)" }}
                >
                  <span
                    className="label mb-1 w-fit"
                    style={item.category === "Background Premium"
                      ? { background: "rgba(251,191,36,0.15)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.25)" }
                      : { background: "var(--blue-dim)", color: "var(--blue)", border: "1px solid var(--blue-border)" }
                    }
                  >
                    {item.category === "Background Premium" ? "Premium" : "Regular"}
                  </span>
                  <p className="text-white font-semibold text-[12px] leading-snug">{item.title}</p>
                </div>
                {/* Expand */}
                <button
                  type="button"
                  aria-label="Perbesar"
                  className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-all text-white"
                  style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", borderRadius: "var(--r-sm)" }}
                  onClick={e => { e.stopPropagation(); setLightbox(item); }}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ───────────────────────────────────────── */}
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
