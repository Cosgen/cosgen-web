"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Maximize2, X, ChevronRight } from "lucide-react";

export interface PortfolioItem {
  id: string;
  title: string;
  category: "Regular" | "Background Premium";
  imageUrl: string;
  aspectRatio: "portrait" | "landscape";
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "p-1",
    title: "Genshin Impact — Raiden Shogun",
    category: "Regular",
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "portrait",
  },
  {
    id: "p-2",
    title: "Neon Cyberpunk Temple",
    category: "Background Premium",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "landscape",
  },
  {
    id: "p-3",
    title: "Honkai Star Rail — Kafka VFX",
    category: "Regular",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "portrait",
  },
  {
    id: "p-4",
    title: "Sacred Sakura Shrine",
    category: "Background Premium",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "landscape",
  },
  {
    id: "p-5",
    title: "Fate/Stay Night — Saber Excalibur",
    category: "Regular",
    imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "portrait",
  },
  {
    id: "p-6",
    title: "Celestial Space Galaxy",
    category: "Background Premium",
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "landscape",
  },
];

const getInitialPortfolioState = () => {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem("cosgen_site_content");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.portfolio && Array.isArray(parsed.portfolio)) {
          return parsed.portfolio.map((p: any, idx: number) => ({
            id: p.id || `p-${idx}`,
            title: p.title,
            category: p.category === "Background Premium" ? "Background Premium" : "Regular",
            imageUrl: p.image || p.imageUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
            aspectRatio: idx % 2 === 0 ? "portrait" : "landscape",
          }));
        }
      }
    } catch (e) {}
  }
  return [];
};

export function PortfolioSection() {
  const [isMounted, setIsMounted] = useState(false);
  const [items, setItems] = useState<PortfolioItem[]>(() => getInitialPortfolioState());
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  const [filter, setFilter] = useState<"Semua" | "Regular" | "Background Premium">("Semua");

  useEffect(() => {
    setIsMounted(true);
    const loadContent = () => {
      fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (d.content && Array.isArray(d.content.portfolio)) {
            const mapped: PortfolioItem[] = d.content.portfolio.map((p: any, idx: number) => ({
              id: p.id || `p-${idx}`,
              title: p.title,
              category: p.category === "Background Premium" ? "Background Premium" : "Regular",
              imageUrl: p.image || p.imageUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
              aspectRatio: idx % 2 === 0 ? "portrait" : "landscape",
            }));
            setItems(mapped);
            try {
              localStorage.setItem("cosgen_site_content", JSON.stringify(d.content));
            } catch (e) {}
          }
        })
        .catch(() => {});
    };
    loadContent();
    window.addEventListener("cosgen_content_updated", loadContent);
    window.addEventListener("storage", loadContent);
    return () => {
      window.removeEventListener("cosgen_content_updated", loadContent);
      window.removeEventListener("storage", loadContent);
    };
  }, []);

  const filtered =
    filter === "Semua" ? items : items.filter((p) => p.category === filter);

  return (
    <section id="portfolio" className="py-16 sm:py-24" style={{ background: "var(--tf-surface)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Heading row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="tf-section-label mb-4">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              Portofolio
            </div>
            <h2 className="font-headline font-black tracking-tight" style={{ fontSize: "clamp(28px,4vw,48px)", color: "var(--tf-text-primary)" }}>
              Karya Terbaik
            </h2>
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {(["Semua", "Regular", "Background Premium"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className="tf-chip tf-press-sm"
                style={filter === cat
                  ? { background: "var(--tf-primary-dim)", color: "var(--tf-primary)", border: "1.5px solid var(--tf-primary-border)" }
                  : { background: "var(--tf-surface-2)", color: "var(--tf-text-secondary)", border: "1.5px solid var(--tf-border)" }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[14px]" style={{ color: "var(--tf-text-tertiary)" }}>Belum ada karya — tambahkan dari panel admin.</p>
          </div>
        ) : (
          <div className={`columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 transition-opacity duration-300 ${isMounted ? "opacity-100" : "opacity-0"}`}>
            {filtered.map((item) => (
              <div
                key={item.id}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer tf-press"
                style={{ boxShadow: "var(--tf-shadow-sm)", transition: "transform 250ms ease, box-shadow 250ms ease" }}
                onClick={() => setSelectedImage(item)}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--tf-shadow-lg)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--tf-shadow-sm)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Persistent dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,15,30,0.85)] via-[rgba(10,15,30,0.1)] to-transparent" />
                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span
                    className="text-[9px] font-black uppercase tracking-widest block mb-1"
                    style={{ color: item.category === "Background Premium" ? "#FBBF24" : "#60A5FA" }}
                  >
                    {item.category}
                  </span>
                  <p className="text-white text-[12px] font-bold leading-tight">{item.title}</p>
                </div>
                {/* Expand icon */}
                <button
                  type="button"
                  aria-label="Perbesar"
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all"
                  style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
                  onClick={e => { e.stopPropagation(); setSelectedImage(item); }}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950/80 to-transparent">
              <p className="text-white font-bold text-sm">{selectedImage.title}</p>
              <span className="text-slate-300 text-[11px]">{selectedImage.category}</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 p-2 bg-slate-900/70 backdrop-blur-sm rounded-full text-white hover:bg-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
