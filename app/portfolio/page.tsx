"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PortfolioItem } from "@/components/landing/portfolio-masonry";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { X, Maximize2, ArrowLeft, Layers } from "lucide-react";

const ALL_PORTFOLIO_ITEMS: (PortfolioItem & { size?: "big" | "wide" | "tall" | "sm" })[] = [
  {
    id: "p-1",
    title: "Genshin Impact — Raiden Shogun",
    category: "Regular",
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "portrait",
    size: "big",
  },
  {
    id: "p-2",
    title: "Neon Cyberpunk Temple",
    category: "Background Premium",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "landscape",
    size: "wide",
  },
  {
    id: "p-3",
    title: "Honkai Star Rail — Kafka VFX",
    category: "Regular",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "portrait",
    size: "sm",
  },
  {
    id: "p-4",
    title: "Sacred Sakura Shrine",
    category: "Background Premium",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "landscape",
    size: "tall",
  },
  {
    id: "p-5",
    title: "Fate/Stay Night — Saber Excalibur",
    category: "Regular",
    imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "portrait",
    size: "sm",
  },
  {
    id: "p-6",
    title: "Celestial Space Galaxy",
    category: "Background Premium",
    imageUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "landscape",
    size: "wide",
  },
  {
    id: "p-7",
    title: "Demon Slayer — Nezuko CGI",
    category: "Regular",
    imageUrl: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "portrait",
    size: "big",
  },
  {
    id: "p-8",
    title: "Fantasy Forest VFX",
    category: "Background Premium",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
    aspectRatio: "landscape",
    size: "sm",
  },
];

const CATEGORIES = ["Semua", "Regular", "Background Premium"] as const;

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);

  const filtered =
    activeCategory === "Semua"
      ? ALL_PORTFOLIO_ITEMS
      : ALL_PORTFOLIO_ITEMS.filter((i) => i.category === activeCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <LandingNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Landing
        </Link>

        {/* Page header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">
            <Layers className="w-3.5 h-3.5" /> Portofolio Lengkap
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            Karya Visual CGI & VFX
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">
            Semua hasil edit foto cosplay dengan efek cinematic, compositing CGI, dan latar 3D premium.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-3 sm:gap-4">
          {filtered.map((item) => {
            const colSpan =
              item.size === "big" ? "md:col-span-2 md:row-span-2" :
              item.size === "wide" ? "md:col-span-2" :
              item.size === "tall" ? "md:row-span-2" :
              "";

            return (
              <div
                key={item.id}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 ${colSpan}`}
                onClick={() => setLightboxItem(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                  <span className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${
                    item.category === "Background Premium" ? "text-amber-400" : "text-blue-400"
                  }`}>
                    {item.category}
                  </span>
                  <p className="text-white text-[12px] font-bold leading-tight">{item.title}</p>
                </div>
                {/* Expand icon */}
                <button
                  type="button"
                  className="absolute top-3 right-3 p-1.5 bg-slate-900/60 backdrop-blur-sm rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-slate-900"
                  onClick={(e) => { e.stopPropagation(); setLightboxItem(item); }}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                {/* Category badge always visible */}
                <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  item.category === "Background Premium"
                    ? "bg-amber-400/90 text-slate-900"
                    : "bg-blue-600/90 text-white"
                }`}>
                  {item.category === "Background Premium" ? "Premium" : "Regular"}
                </span>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center">
          <h2 className="text-xl sm:text-2xl font-black mb-2">Tertarik dengan Kualitas Ini?</h2>
          <p className="text-blue-100 text-sm mb-5">Mulai pemesanan sekarang dan dapatkan karya sinematik terbaik.</p>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-black rounded-full shadow-md hover:bg-blue-50 transition-all hover:scale-105 text-sm"
          >
            Pesan Sekarang
          </Link>
        </div>
      </main>

      <LandingFooter />

      {/* Lightbox */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxItem.imageUrl}
              alt={lightboxItem.title}
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950/80 to-transparent">
              <p className="text-white font-bold text-sm">{lightboxItem.title}</p>
              <span className="text-slate-300 text-[11px]">{lightboxItem.category}</span>
            </div>
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              className="absolute top-3 right-3 p-2 bg-slate-900/70 backdrop-blur-sm rounded-full text-white hover:bg-slate-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
