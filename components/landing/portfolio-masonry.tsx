"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface PortfolioItem {
  id: string;
  title: string;
  category: "Regular" | "Background Premium";
  imageUrl: string;
  aspectRatio?: "portrait" | "landscape";
}

// 10 Official CosGen Cloudinary Portfolio Images
export const OFFICIAL_10_PORTFOLIO: PortfolioItem[] = [
  { id: "p1",  title: "Cosplay VFX Sinematik",          category: "Regular",            imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785183996/Pic_2_sbrbuc.jpg" },
  { id: "p2",  title: "Background Premium — Cinematic", category: "Background Premium", imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785188133/Pic_1_Aemeath_a6tnw8.jpg" },
  { id: "p3",  title: "Full CGI Edit",                  category: "Regular",            imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785414586/Final_oa3n4x.jpg" },
  { id: "p4",  title: "Clean Visual Edit",              category: "Regular",            imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785414651/Final_Clean_m20ri7.jpg" },
  { id: "p5",  title: "Portrait Retouch",               category: "Regular",            imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785414847/david_szbhpi.png" },
  { id: "p6",  title: "VFX Compositing",                category: "Background Premium", imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785414987/Edit_wfui7l.png" },
  { id: "p7",  title: "Cosplay CGI Final",              category: "Regular",            imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785415103/Final_rqbqbj.jpg" },
  { id: "p8",  title: "Scene Render Final",             category: "Background Premium", imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785415206/Final_nsc3k5.jpg" },
  { id: "p9",  title: "Before-After Compare",           category: "Regular",            imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785415274/Final_2_Compare_csw7vk.jpg" },
  { id: "p10", title: "Final Edit Master",             category: "Background Premium", imageUrl: "https://res.cloudinary.com/or0nvx0c/image/upload/v1785415340/Final_01_e3s5sw.jpg" },
];

const ITEMS_PER_PAGE = 6;

export function PortfolioSection() {
  const [mounted,     setMounted]     = useState(false);
  const [items,       setItems]       = useState<PortfolioItem[]>(OFFICIAL_10_PORTFOLIO);
  const [filter,      setFilter]      = useState<"Semua" | "Regular" | "Background Premium">("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [lightbox,    setLightbox]    = useState<PortfolioItem | null>(null);

  useEffect(() => {
    setMounted(true);
    const load = () => {
      fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" })
        .then(r => r.json()).then(d => {
          if (d.content?.portfolio?.length) {
            const mapped = d.content.portfolio.map((p: any, i: number) => ({
              id: p.id || `p-${i}`, title: p.title,
              category: p.category === "Background Premium" ? "Background Premium" : "Regular",
              imageUrl: p.image || p.imageUrl || "",
            }));
            setItems(mapped);
          }
        }).catch(() => {});
    };
    load();
    window.addEventListener("cosgen_content_updated", load);
    window.addEventListener("storage", load);
    return () => { window.removeEventListener("cosgen_content_updated", load); window.removeEventListener("storage", load); };
  }, []);

  // Filter items
  const filtered = filter === "Semua" ? items : items.filter(p => p.category === filter);

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const safePage   = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const pageItems  = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when filter changes
  const handleFilterChange = (cat: "Semua" | "Regular" | "Background Premium") => {
    setFilter(cat);
    setCurrentPage(1);
  };

  // Bento spans for 6-card grid
  const bentoSpans = [
    "col-span-2 row-span-2", // 0: Big highlight (top left)
    "col-span-1 row-span-1", // 1: Standard
    "col-span-1 row-span-2", // 2: Tall (right)
    "col-span-1 row-span-1", // 3: Standard
    "col-span-2 row-span-1", // 4: Wide (bottom)
    "col-span-1 row-span-1", // 5: Standard
  ];

  return (
    <section id="portfolio" className="section" style={{ background: "var(--bg-1)" }}>
      <div className="container">

        {/* ── Header row ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
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

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {(["Semua", "Regular", "Background Premium"] as const).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => handleFilterChange(cat)}
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

        {/* ── BENTO GRID ──────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <p className="text-center py-20 text-[14px]" style={{ color: "var(--text-3)" }}>
            Belum ada karya untuk kategori ini.
          </p>
        ) : (
          <>
            {/* Desktop Bento Grid (4-column layout with varied spans) */}
            <div
              className="hidden md:grid gap-3 mb-8"
              style={{
                gridTemplateColumns: "repeat(4, 1fr)",
                gridAutoRows: "190px",
                opacity: mounted ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              {pageItems.map((item, idx) => {
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
                      className="absolute inset-0 flex flex-col justify-end p-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: "linear-gradient(to top, rgba(5,10,20,0.88) 0%, transparent 55%)" }}
                    >
                      <span
                        className="label w-fit mb-1.5"
                        style={item.category === "Background Premium"
                          ? { background: "rgba(251,191,36,.15)", color: "#FBBF24", border: "1px solid rgba(251,191,36,.25)" }
                          : { background: "var(--blue-dim)", color: "var(--blue)", border: "1px solid var(--blue-border)" }
                        }
                      >
                        {item.category === "Background Premium" ? "Premium" : "Regular"}
                      </span>
                      <p className="text-white font-semibold text-[13px] leading-snug">{item.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Grid (2-column uniform layout) */}
            <div
              className="grid md:hidden gap-2.5 mb-6"
              style={{
                gridTemplateColumns: "repeat(2, 1fr)",
                opacity: mounted ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            >
              {pageItems.map(item => (
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
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  <div
                    className="absolute inset-x-0 bottom-0 p-2"
                    style={{ background: "linear-gradient(to top, rgba(5,10,20,0.8), transparent)" }}
                  >
                    <p className="text-white text-[10px] font-semibold leading-snug">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── PAGINATION CONTROLS (Halaman 1 / Halaman 2) ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <p className="text-[12px]" style={{ color: "var(--text-3)", fontFamily: "'Inter',sans-serif" }}>
                  Menampilkan {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} dari {filtered.length} karya
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={safePage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="btn btn-sm btn-ghost"
                    style={{ opacity: safePage === 1 ? 0.4 : 1, cursor: safePage === 1 ? "not-allowed" : "pointer" }}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Sebelumnya</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      const isCurrent = pageNum === safePage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 rounded text-[12px] font-semibold flex items-center justify-center transition-all cursor-pointer"
                          style={isCurrent
                            ? { background: "var(--blue)", color: "#fff", boxShadow: "var(--shadow-blue)" }
                            : { background: "var(--surface)", color: "var(--text-2)", border: "1px solid var(--border)" }
                          }
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    disabled={safePage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="btn btn-sm btn-ghost"
                    style={{ opacity: safePage === totalPages ? 0.4 : 1, cursor: safePage === totalPages ? "not-allowed" : "pointer" }}
                  >
                    <span>Selanjutnya</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox Modal */}
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
