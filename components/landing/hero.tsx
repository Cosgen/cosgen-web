"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const HERO_BG_IMAGE = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785188133/Pic_1_Aemeath_a6tnw8.jpg";
const WHITE_LOGO = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785184391/Logo_Putih_01_xozs8n.png";
const COLOR_LOGO = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785184392/Logo_Warna_01_y5dpcm.png";

interface HeroProps {
  onOpenOrderModal?: () => void;
  onOpenSlotChecker?: () => void;
}

export function HeroSection({ onOpenOrderModal, onOpenSlotChecker }: HeroProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section
      className="relative w-full overflow-hidden select-none"
      style={{ height: "100dvh" }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,500;1,600&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
      ` }} />

      {/* ── DESKTOP ONLY: Dark overlay + background image ─────── */}
      <div className="hidden md:block absolute inset-0 bg-slate-950 z-0" />
      <div
        className="hidden md:block absolute inset-0 bg-center bg-cover bg-no-repeat z-10"
        style={{ backgroundImage: `url('${HERO_BG_IMAGE}')` }}
      />

      {/* ── MOBILE ONLY: Plain theme-aware background ─────────── */}
      <div className="md:hidden absolute inset-0 bg-white dark:bg-slate-950 z-0" />

      {/* ── FLOATING PILL NAVBAR (DESKTOP) ────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-3 sm:p-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer z-10">
          {/* Desktop: always white logo (dark bg image) */}
          <img
            src={WHITE_LOGO}
            alt="CosGen.id"
            className="hidden md:block h-7 sm:h-8 w-auto object-contain"
          />
          {/* Mobile: color logo in light, white logo in dark */}
          <img
            src={COLOR_LOGO}
            alt="CosGen.id"
            className="md:hidden dark:hidden h-7 w-auto object-contain"
          />
          <img
            src={WHITE_LOGO}
            alt="CosGen.id"
            className="md:hidden hidden dark:block h-7 w-auto object-contain"
          />
        </Link>

        {/* Center Glass Pill Nav (Desktop) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-slate-900/60 backdrop-blur-md border border-white/15 rounded-full px-1.5 py-1 items-center gap-0.5 shadow-lg">
          <Link href="#portfolio" className="text-white hover:bg-white/20 px-3.5 py-1 rounded-full text-[11px] font-semibold transition-colors">
            Portofolio
          </Link>
          <Link href="#compare" className="text-white/80 hover:bg-white/20 hover:text-white px-3.5 py-1 rounded-full text-[11px] font-semibold transition-colors">
            Compare
          </Link>
          <Link href="#pricelist" className="text-white/80 hover:bg-white/20 hover:text-white px-3.5 py-1 rounded-full text-[11px] font-semibold transition-colors">
            Paket
          </Link>
          <Link href="/cek-status" className="text-white/80 hover:bg-white/20 hover:text-white px-3.5 py-1 rounded-full text-[11px] font-semibold transition-colors">
            Cek Status
          </Link>
          <Link href="#faq" className="text-white/80 hover:bg-white/20 hover:text-white px-3.5 py-1 rounded-full text-[11px] font-semibold transition-colors">
            FAQ
          </Link>
        </div>

        {/* Right: Theme Toggle + Mobile Hamburger */}
        <div className="flex items-center gap-2 z-10">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg border border-slate-200 dark:border-white/20 bg-white/80 dark:bg-slate-900/60 text-slate-700 dark:text-white backdrop-blur-sm"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ─────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md p-6 flex flex-col justify-center items-center space-y-5 md:hidden">
          <Link href="#portfolio" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-slate-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">Portofolio</Link>
          <Link href="#compare"   onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-slate-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">Compare</Link>
          <Link href="#pricelist" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-slate-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">Paket</Link>
          <Link href="/cek-status" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-slate-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">Cek Status</Link>
          <Link href="#faq"       onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-slate-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">FAQ</Link>
        </div>
      )}

      {/* ── DESKTOP HERO CONTENT (right-aligned, dark text on image) ── */}
      <div className="hidden md:flex absolute top-[16%] right-12 flex-col items-end text-right z-30 space-y-3 max-w-2xl">
        <span
          className="block font-playfair italic font-normal text-5xl text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]"
          style={{ letterSpacing: "-0.04em" }}
        >
          Save the World?
        </span>
        <span
          className="block font-normal text-5xl text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)] -mt-1.5"
          style={{ letterSpacing: "-0.06em" }}
        >
          Save the CAT!
        </span>

        <div className="flex flex-wrap items-center justify-end gap-2 w-full max-w-sm pt-0.5">
          <button
            type="button"
            onClick={onOpenOrderModal}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/30 border border-blue-400/20"
          >
            Pesan Sekarang
          </button>
          {onOpenSlotChecker && (
            <button
              type="button"
              onClick={onOpenSlotChecker}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-bold px-5 py-2 rounded-full transition-all hover:scale-105 active:scale-95 backdrop-blur-md shadow-md"
            >
              Cek Slot
            </button>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 text-[11px] text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] pt-1 font-semibold">
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>Slot Live
          </span>
          <span className="text-white/40">•</span>
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>Cek Status
          </span>
          <span className="text-white/40">•</span>
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <circle cx="9" cy="10" r="0.7" fill="currentColor"/><circle cx="12" cy="10" r="0.7" fill="currentColor"/><circle cx="15" cy="10" r="0.7" fill="currentColor"/>
            </svg>Live Chat
          </span>
        </div>
      </div>

      {/* ── MOBILE HERO CONTENT (centered, CTA-focused, theme-aware) ── */}
      <div className="md:hidden absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center space-y-6 pt-16">
        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[11px] font-bold rounded-full border border-blue-200 dark:border-blue-700/50">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Edit Foto Cosplay CGI & VFX Cinematic
        </span>

        {/* CTA Headline */}
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight leading-[1.05] text-slate-900 dark:text-white">
            Ubah Foto Cosplay<br />
            <span className="text-blue-600 dark:text-blue-400">Jadi Karya Sinematik</span>
          </h1>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed mt-2">
            Edit CGI & VFX berkualitas studio. Slot terbatas, pesan sekarang.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            type="button"
            onClick={onOpenOrderModal}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-[14px] rounded-2xl shadow-xl shadow-blue-600/25 transition-all active:scale-95"
          >
            Pesan Sekarang
          </button>
          {onOpenSlotChecker && (
            <button
              type="button"
              onClick={onOpenSlotChecker}
              className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-[13px] rounded-2xl border border-slate-200 dark:border-slate-700 transition-all active:scale-95"
            >
              Cek Slot Tersedia
            </button>
          )}
        </div>

        {/* Secondary nav buttons */}
        <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs">
          <Link
            href="#pricelist"
            className="py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[12px] font-semibold rounded-xl text-center hover:border-blue-300 dark:hover:border-blue-600 transition-all active:scale-95"
          >
            Lihat Paket
          </Link>
          <Link
            href="/cek-status"
            className="py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[12px] font-semibold rounded-xl text-center hover:border-blue-300 dark:hover:border-blue-600 transition-all active:scale-95"
          >
            Cek Status
          </Link>
        </div>

        {/* Feature strip */}
        <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 dark:text-slate-500 font-medium pt-1">
          <span>⚡ Slot Live</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span>🔍 Lacak Status</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span>💬 Live Chat</span>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
