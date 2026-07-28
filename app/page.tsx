"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ServicePackage, INITIAL_PACKAGES } from "@/app/admin/item-jasa/page";
import { Check, ArrowRight, Menu, X, Star } from "lucide-react";

const HERO_BG = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785188133/Pic_1_Aemeath_a6tnw8.jpg";
const WHITE_LOGO = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785184391/Logo_Putih_01_xozs8n.png";
const COLOR_LOGO = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785184392/Logo_Warna_01_y5dpcm.png";



export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [packages, setPackages] = useState<ServicePackage[]>(INITIAL_PACKAGES);

  useEffect(() => {
    const saved = localStorage.getItem("cosgen_pricelist_packages");
    if (saved) {
      try { setPackages(JSON.parse(saved)); } catch {}
    }
  }, []);

  const activePackages = packages.filter((p) => p.isActive).slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-blue-600 selection:text-white overflow-x-hidden">

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <img src={COLOR_LOGO} alt="CosGen.id" className="h-7 w-auto object-contain dark:hidden" />
            <img src={WHITE_LOGO} alt="CosGen.id" className="h-7 w-auto object-contain hidden dark:block" />
          </Link>

          <div className="hidden md:flex items-center gap-6 text-[12px] font-semibold text-slate-600 dark:text-slate-300">
            <Link href="#portfolio-preview" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Portofolio</Link>
            <Link href="#pricing-preview" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Paket</Link>
            <Link href="/cek-status" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cek Status</Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-1.5 text-slate-600 dark:text-slate-300"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-3 space-y-2 text-[13px] font-semibold text-slate-700 dark:text-slate-300">
            <Link href="#portfolio-preview" onClick={() => setMenuOpen(false)} className="block py-1">Portofolio</Link>
            <Link href="#pricing-preview" onClick={() => setMenuOpen(false)} className="block py-1">Paket</Link>
            <Link href="/cek-status" onClick={() => setMenuOpen(false)} className="block py-1">Cek Status</Link>
            <Link
              href="/home"
              className="block w-full text-center py-2 bg-blue-600 text-white rounded-xl font-bold mt-2"
            >
              Masuk ke Website
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-end overflow-hidden">
        {/* BG image desktop only */}
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('${HERO_BG}')` }}
        />
        {/* Gradient overlay */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-slate-950/60 z-10" />
        {/* Mobile solid background */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 z-0" />

        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center md:items-end text-center md:text-right">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600/90 text-white text-[11px] font-bold rounded-full mb-5 backdrop-blur-sm shadow-md">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Edit Foto Cosplay CGI & VFX Cinematic
          </span>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] mb-4">
            <span className="block italic font-light">Save the World?</span>
            <span className="block">Save the CAT!</span>
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base text-white/80 dark:text-white/70 max-w-md mb-8 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Ubah foto cosplay kamu jadi karya visual sinematik berkualitas tinggi — dengan efek CGI, VFX, dan latar 3D yang memukau.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center md:justify-end">
            <Link
              href="/home"
              className="inline-flex items-center gap-2 px-7 py-3 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold rounded-full backdrop-blur-md transition-all hover:scale-105 active:scale-95 text-sm"
            >
              Lihat Selengkapnya <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick feature strip */}
          <div className="flex items-center justify-center md:justify-end gap-4 mt-8 text-[11px] text-white/70 font-medium">
            <span className="inline-flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Slot Live
            </span>
            <span className="text-white/30">·</span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Cek Status
            </span>
            <span className="text-white/30">·</span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Live Chat
            </span>
          </div>
        </div>
      </section>

      {/* Portfolio preview removed */}

      {/* ── PRICING PREVIEW — Desktop only ───────────────────── */}
      <section id="pricing-preview" className="hidden md:block py-20 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">
              <Star className="w-3.5 h-3.5" /> Pilihan Paket
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Harga Transparan, Kualitas Terjamin
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Mulai dari paket simpel hingga full cinematic CGI compositing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {activePackages.map((pkg) => {
              const disc = pkg.discountPercent || 0;
              const final = Math.round(pkg.price * (1 - disc / 100));
              return (
                <div
                  key={pkg.id}
                  className={`relative rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 ${
                    pkg.isPopular
                      ? "bg-blue-600 text-white shadow-2xl shadow-blue-600/30 ring-2 ring-blue-400"
                      : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg"
                  }`}
                >
                  {pkg.isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-black rounded-full uppercase tracking-wide">
                      Paling Diminati
                    </span>
                  )}
                  <div>
                    <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${pkg.isPopular ? "text-blue-200" : "text-blue-600 dark:text-blue-400"}`}>
                      Paket
                    </p>
                    <h3 className={`text-xl font-black ${pkg.isPopular ? "text-white" : "text-slate-900 dark:text-white"}`}>
                      {pkg.name}
                    </h3>
                    <p className={`text-[12px] mt-1 leading-relaxed ${pkg.isPopular ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}>
                      {pkg.description}
                    </p>
                  </div>

                  <div className={`border-t pt-3 ${pkg.isPopular ? "border-blue-400/40" : "border-slate-200 dark:border-slate-700"}`}>
                    {disc > 0 && (
                      <span className={`text-[11px] line-through block ${pkg.isPopular ? "text-blue-200" : "text-slate-400"}`}>
                        Rp {pkg.price.toLocaleString("id-ID")}
                      </span>
                    )}
                    <span className={`text-2xl font-black font-mono ${pkg.isPopular ? "text-white" : "text-slate-900 dark:text-white"}`}>
                      Rp {final.toLocaleString("id-ID")}
                    </span>
                    {disc > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-black rounded">
                        -{disc}%
                      </span>
                    )}
                  </div>

                  <ul className="space-y-1.5 flex-1">
                    {pkg.features.slice(0, 3).map((f, i) => (
                      <li key={i} className={`flex items-center gap-2 text-[12px] ${pkg.isPopular ? "text-blue-100" : "text-slate-600 dark:text-slate-300"}`}>
                        <Check className={`w-3.5 h-3.5 shrink-0 ${pkg.isPopular ? "text-blue-300" : "text-blue-500"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/home"
                    className={`w-full text-center py-2.5 rounded-xl text-[12px] font-bold transition-all hover:scale-[1.02] active:scale-95 ${
                      pkg.isPopular
                        ? "bg-white text-blue-600 hover:bg-blue-50 shadow-md"
                        : "bg-slate-900 dark:bg-blue-600 text-white hover:bg-slate-800 dark:hover:bg-blue-500"
                    }`}
                  >
                    Pilih Paket {pkg.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white text-center relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
            Siap Mengubah Foto Cosplay Kamu?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base mb-8 leading-relaxed">
            Bergabung dengan komunitas cosplayer yang sudah mempercayakan karya terbaik mereka ke CosGen.id
          </p>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-black rounded-full shadow-2xl hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            Masuk ke Website Penuh <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-blue-200 text-[11px]">
            Lihat portofolio lengkap, paket lengkap, FAQ, dan mulai pemesanan
          </p>
        </div>
      </section>

      {/* ── FOOTER (minimal) ───────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 text-center text-[11px] py-6 border-t border-slate-900">
        <p>© {new Date().getFullYear()} CosGen.id — Platform Edit Foto Cosplay CGI & VFX</p>
      </footer>
    </div>
  );
}
