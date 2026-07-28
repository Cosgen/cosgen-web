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

export function PortfolioSection() {
  const [items, setItems] = useState<PortfolioItem[]>(PORTFOLIO_ITEMS);
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  const [filter, setFilter] = useState<"Semua" | "Regular" | "Background Premium">("Semua");

  useEffect(() => {
    const loadContent = () => {
      fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (d.content && Array.isArray(d.content.portfolio) && d.content.portfolio.length > 0) {
            const mapped: PortfolioItem[] = d.content.portfolio.map((p: any, idx: number) => ({
              id: p.id || `p-${idx}`,
              title: p.title,
              category: p.category === "Background Premium" ? "Background Premium" : "Regular",
              imageUrl: p.image || p.imageUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
              aspectRatio: idx % 2 === 0 ? "portrait" : "landscape",
            }));
            setItems(mapped);
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
    <section id="portfolio" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Heading row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.18em] mb-2">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              Portofolio
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              See All Works
            </h2>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2">
            {(["Semua", "Regular", "Background Premium"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                  filter === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              onClick={() => setSelectedImage(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                <span className={`text-[9px] font-black uppercase tracking-widest mb-1 ${
                  item.category === "Background Premium" ? "text-amber-400" : "text-blue-400"
                }`}>
                  {item.category}
                </span>
                <p className="text-white text-[12px] font-bold leading-tight">{item.title}</p>
              </div>
              {/* Category badge */}
              <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide ${
                item.category === "Background Premium"
                  ? "bg-amber-400/90 text-slate-900"
                  : "bg-blue-600/90 text-white"
              }`}>
                {item.category === "Background Premium" ? "Premium" : "Regular"}
              </span>
              {/* Expand button */}
              <button
                type="button"
                className="absolute top-3 right-3 p-1.5 bg-slate-900/60 backdrop-blur-sm rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-900"
                onClick={(e) => { e.stopPropagation(); setSelectedImage(item); }}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-[12px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Lihat Semua Portofolio di Galeri <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
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
