"use client";

import React, { useState } from "react";
import { Maximize2, X, Sparkles } from "lucide-react";

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
    title: "Genshin Impact - Raiden Shogun",
    category: "Regular",
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "portrait",
  },
  {
    id: "p-2",
    title: "Background Premium - Neon Cyberpunk Temple",
    category: "Background Premium",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "landscape",
  },
  {
    id: "p-3",
    title: "Honkai Star Rail - Kafka VFX",
    category: "Regular",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "portrait",
  },
  {
    id: "p-4",
    title: "Background Premium - Sacred Sakura Shrine",
    category: "Background Premium",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "landscape",
  },
  {
    id: "p-5",
    title: "Fate/Stay Night - Saber Excalibur CGI",
    category: "Regular",
    imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "portrait",
  },
  {
    id: "p-6",
    title: "Background Premium - Celestial Space Galaxy",
    category: "Background Premium",
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "landscape",
  },
];

export function PortfolioSection() {
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);

  return (
    <section id="portfolio" className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 font-sans transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Portofolio Hasil Edit
          </h2>
        </div>

        {/* Dynamic Masonry Image Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {PORTFOLIO_ITEMS.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <img
                src={item.imageUrl}
                alt="CosGen.id Portfolio Image"
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  item.aspectRatio === "portrait" ? "h-72 sm:h-[380px]" : "h-48 sm:h-56"
                }`}
              />

              {/* Background Premium Special Tag */}
              {item.category === "Background Premium" && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-0.5 bg-amber-500/90 text-white text-[9px] font-extrabold rounded-full backdrop-blur-md shadow-xs flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-200" /> Background Premium
                  </span>
                </div>
              )}

              {/* Hover Overlay with Zoom Button ONLY */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setSelectedImage(item)}
                  className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white rounded-full transition-transform hover:scale-110 shadow-lg"
                  title="Lihat Lebih Jelas (Zoom)"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-red-400 p-2 rounded-full bg-white/10 backdrop-blur-md transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="w-full h-full object-contain max-h-[85vh]"
            />
          </div>
        </div>
      )}
    </section>
  );
}
