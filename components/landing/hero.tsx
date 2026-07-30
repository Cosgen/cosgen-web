"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const HERO_BG_IMAGE = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785188133/Pic_1_Aemeath_a6tnw8.jpg";
const WHITE_LOGO = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785184391/Logo_Putih_01_xozs8n.png";
const COLOR_LOGO = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785184392/Logo_Warna_01_y5dpcm.png";

interface HeroProps {
  onOpenOrderModal: () => void;
  onOpenSlotChecker?: () => void;
}

const getInitialHeroConfig = () => {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem("cosgen_site_content");
      if (cached) return JSON.parse(cached)?.hero;
    } catch (e) {}
  }
  return null;
};

export function HeroSection({ onOpenOrderModal, onOpenSlotChecker }: HeroProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [headline, setHeadline] = useState(() => getInitialHeroConfig()?.headline || "");
  const [subheadline, setSubheadline] = useState(() => getInitialHeroConfig()?.subheadline || "");
  const [ctaText] = useState(() => getInitialHeroConfig()?.ctaText || "Pesan Sekarang");

  useEffect(() => {
    setIsMounted(true);
    const loadContent = () => {
      fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (d.content?.hero) {
            if (d.content.hero.headline) setHeadline(d.content.hero.headline);
            if (d.content.hero.subheadline) setSubheadline(d.content.hero.subheadline);
            try { localStorage.setItem("cosgen_site_content", JSON.stringify(d.content)); } catch (e) {}
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

  const scrollTo = (hash: string) => {
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", hash);
    }
  };

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "100dvh" }}>

      {/* ── DESKTOP: Cinematic BG ─────────────────────────────────── */}
      <div className="hidden md:block absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-950" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${HERO_BG_IMAGE}')`, opacity: 0.85 }}
        />
        {/* Gradient overlay — text readable on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30" />
      </div>

      {/* ── MOBILE: Clean white/dark bg ───────────────────────────── */}
      <div className="md:hidden absolute inset-0 z-0 bg-white dark:bg-slate-950" />
      {/* Subtle decorative gradient blob mobile */}
      <div
        className="md:hidden absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 dark:opacity-5 z-0"
        style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
      />
      <div
        className="md:hidden absolute bottom-32 left-0 w-56 h-56 rounded-full opacity-10 dark:opacity-5 z-0"
        style={{ background: "radial-gradient(circle, #34D399 0%, transparent 70%)", transform: "translate(-40%, 40%)" }}
      />

      {/* ═══════════════════════════════════════════════════════════
          MOBILE-ONLY NAVBAR (Top bar — desktop handled by TouchFlowNavbar)
      ═══════════════════════════════════════════════════════════ */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <img src={COLOR_LOGO} alt="CosGen.id" className="h-7 w-auto object-contain dark:hidden" />
          <img src={WHITE_LOGO} alt="CosGen.id" className="h-7 w-auto object-contain hidden dark:block" />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/cek-status"
            className="text-[12px] font-semibold px-3 py-1.5 rounded-xl transition-colors"
            style={{ color: "var(--tf-primary)", background: "var(--tf-primary-light)" }}
          >
            Cek Status
          </Link>
        </div>
      </div>
      {/* Dark mobile navbar */}
      <style>{`
        .dark .mobile-topbar {
          background: rgba(15,23,42,0.92) !important;
          border-bottom-color: rgba(255,255,255,0.06) !important;
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════
          DESKTOP NAVBAR (floating pill)
      ═══════════════════════════════════════════════════════════ */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <img src={WHITE_LOGO} alt="CosGen.id" className="h-8 w-auto object-contain" />
        </Link>

        {/* Center pill nav */}
        <div
          className="flex items-center gap-0.5 px-1.5 py-1 rounded-full"
          style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          {[
            { label: "Portofolio", hash: "#portfolio" },
            { label: "Price List", hash: "#pricelist" },
            { label: "FAQ", hash: "#faq" },
            { label: "Cek Status", href: "/cek-status" },
          ].map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className="text-white/80 hover:bg-white/20 hover:text-white px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all"
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                type="button"
                onClick={() => scrollTo(item.hash!)}
                className="text-white/80 hover:bg-white/20 hover:text-white px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer"
              >
                {item.label}
              </button>
            )
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={onOpenSlotChecker}
            className="text-white/80 hover:text-white text-[12px] font-semibold px-4 py-2 rounded-full transition-all"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            Cek Slot
          </button>
          <button
            type="button"
            onClick={onOpenOrderModal}
            className="tf-btn-primary tf-press"
            style={{ minHeight: "40px", padding: "0 20px", fontSize: "13px" }}
          >
            Pesan Sekarang
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          DESKTOP HERO CONTENT — Left-aligned cinematic layout
      ═══════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex absolute inset-0 z-20 items-center">
        <div
          className="max-w-6xl mx-auto w-full px-12 flex flex-col items-start gap-6"
          style={{ paddingTop: "80px" }}
        >
          {/* Eyebrow tag */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest"
            style={{
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.3)",
              color: "#93c5fd",
              animation: "tf-fade-in 0.6s ease forwards",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#34D399", animation: "tf-pulse-dot 2s ease-in-out infinite" }}
            />
            Edit Foto Cosplay & CGI Profesional
          </div>

          {/* Headline */}
          <h1
            suppressHydrationWarning
            className="font-headline text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight"
            style={{
              textShadow: "0 2px 24px rgba(0,0,0,0.8)",
              maxWidth: "700px",
              opacity: isMounted ? 1 : 0,
              transition: "opacity 0.3s ease",
              animation: "tf-slide-up 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both",
            }}
          >
            {headline || "Ubah Foto Cosplay Jadi Mahakarya"}
          </h1>

          {/* Sub */}
          <p
            suppressHydrationWarning
            className="text-base text-white/75 leading-relaxed max-w-md"
            style={{
              opacity: isMounted ? 1 : 0,
              transition: "opacity 0.3s ease",
              animation: "tf-slide-up 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both",
            }}
          >
            {subheadline || "Layanan editing visual profesional untuk Cosplay, Generasi AI, & Background Premium."}
          </p>

          {/* CTA Row */}
          <div
            className="flex items-center gap-3 flex-wrap"
            style={{ animation: "tf-slide-up 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both" }}
          >
            <button
              type="button"
              onClick={onOpenOrderModal}
              className="tf-btn-primary tf-press"
              style={{ minHeight: "52px", padding: "0 28px", fontSize: "15px" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {ctaText}
            </button>
            <button
              type="button"
              onClick={onOpenSlotChecker}
              className="flex items-center gap-2 text-white font-semibold text-[14px] px-6 py-3 rounded-full transition-all hover:bg-white/10"
              style={{ border: "1.5px solid rgba(255,255,255,0.3)", minHeight: "52px" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Cek Slot Tersedia
            </button>
          </div>

          {/* Trust badges */}
          <div
            className="flex items-center gap-4 pt-2"
            style={{ animation: "tf-fade-in 0.6s ease 0.5s both" }}
          >
            {[
              { icon: "✦", text: "Respon Cepat" },
              { icon: "✦", text: "Status Transparan" },
              { icon: "✦", text: "Revisi Termasuk" },
            ].map((b) => (
              <span key={b.text} className="flex items-center gap-1.5 text-[11px] text-white/60 font-medium">
                <span className="text-[#34D399] text-[8px]">{b.icon}</span>
                {b.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE HERO CONTENT — Full-screen app-like
      ═══════════════════════════════════════════════════════════ */}
      <div
        className="md:hidden relative z-10 flex flex-col items-center justify-center text-center px-5"
        style={{
          minHeight: "100dvh",
          paddingTop: "80px",
          paddingBottom: "calc(80px + var(--safe-area-bottom, 0px))",
        }}
      >
        {/* Hero image card (cinematic) */}
        <div
          className="relative w-full rounded-3xl overflow-hidden mb-6"
          style={{ height: "220px", animation: "tf-fade-in 0.5s ease 0.1s both" }}
        >
          <img
            src={HERO_BG_IMAGE}
            alt="CosGen hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          {/* Live badge */}
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#34D399", animation: "tf-pulse-dot 2s ease-in-out infinite" }}
            />
            Slot Tersedia
          </div>
        </div>

        {/* Headline */}
        <h1
          suppressHydrationWarning
          className="font-headline text-[28px] sm:text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-3"
          style={{
            opacity: isMounted ? 1 : 0,
            transition: "opacity 0.3s ease",
            animation: "tf-slide-up 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.15s both",
          }}
        >
          {headline || "Edit Foto Cosplay Profesional"}
        </h1>
        <p
          suppressHydrationWarning
          className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-[300px] mx-auto mb-6"
          style={{
            opacity: isMounted ? 1 : 0,
            transition: "opacity 0.3s ease",
            animation: "tf-slide-up 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s both",
          }}
        >
          {subheadline || "Visual epik untuk cosplayer, kreator & animator."}
        </p>

        {/* ── QUICK ACTIONS — 1 tap ke fitur ──────────────────────── */}
        <div
          className="w-full max-w-sm space-y-2.5"
          style={{ animation: "tf-slide-up 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.25s both" }}
        >
          {/* Primary CTA */}
          <button
            type="button"
            id="mobile-order-btn"
            onClick={onOpenOrderModal}
            className="w-full flex items-center gap-3 rounded-2xl transition-all active:scale-[0.97]"
            style={{
              background: "var(--tf-primary)",
              color: "#fff",
              padding: "14px 20px",
              boxShadow: "0 6px 20px rgba(59,130,246,0.35)",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </span>
            <span className="flex-1 text-left">{ctaText}</span>
            <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Secondary actions grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={onOpenSlotChecker}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all active:scale-95"
              style={{
                background: "var(--tf-surface)",
                border: "1.5px solid var(--tf-border)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span className="text-blue-500">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Cek Slot</span>
            </button>

            <Link
              href="/cek-status"
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all active:scale-95"
              style={{
                background: "var(--tf-surface)",
                border: "1.5px solid var(--tf-border)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span className="text-mint-500" style={{ color: "#34D399" }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Cek Status</span>
            </Link>

            <button
              type="button"
              onClick={() => scrollTo("#pricelist")}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all active:scale-95"
              style={{
                background: "var(--tf-surface)",
                border: "1.5px solid var(--tf-border)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span style={{ color: "#F97171" }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </span>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Harga</span>
            </button>
          </div>
        </div>

        {/* Feature strip */}
        <div
          className="flex items-center justify-center gap-3 mt-6 text-[10px] text-slate-400 font-medium"
          style={{ animation: "tf-fade-in 0.5s ease 0.4s both" }}
        >
          <span>⚡ Respon Cepat</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span>🔍 Transparan</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span>✨ Revisi Termasuk</span>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
