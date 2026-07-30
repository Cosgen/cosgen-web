"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const HERO_BG = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785188133/Pic_1_Aemeath_a6tnw8.jpg";
const WHITE_LOGO = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785184391/Logo_Putih_01_xozs8n.png";

interface HeroProps {
  onOpenOrderModal: () => void;
  onOpenSlotChecker?: () => void;
}

const getCachedHero = () => {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem("cosgen_site_content") || "null")?.hero ?? null; } catch { return null; }
};

export function HeroSection({ onOpenOrderModal, onOpenSlotChecker }: HeroProps) {
  const cached = getCachedHero();
  const [mounted, setMounted] = useState(false);
  const [headline, setHeadline] = useState(cached?.headline || "Ubah Foto Cosplay Jadi Mahakarya");
  const [subheadline, setSubheadline] = useState(cached?.subheadline || "Layanan editing visual profesional — Cosplay, CGI, & Background Premium sinematik.");
  const [ctaText] = useState(cached?.ctaText || "Pesan Sekarang");

  useEffect(() => {
    setMounted(true);
    const load = () => {
      fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" })
        .then(r => r.json())
        .then(d => {
          if (d.content?.hero) {
            if (d.content.hero.headline)    setHeadline(d.content.hero.headline);
            if (d.content.hero.subheadline) setSubheadline(d.content.hero.subheadline);
            try { localStorage.setItem("cosgen_site_content", JSON.stringify(d.content)); } catch {}
          }
        }).catch(() => {});
    };
    load();
    window.addEventListener("cosgen_content_updated", load);
    window.addEventListener("storage", load);
    return () => { window.removeEventListener("cosgen_content_updated", load); window.removeEventListener("storage", load); };
  }, []);

  const scrollTo = (hash: string) => {
    const el = document.querySelector(hash);
    if (el) { el.scrollIntoView({ behavior: "smooth" }); history.replaceState(null, "", hash); }
  };

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "100dvh" }}>

      {/* ── FULL CINEMATIC BG ─────────────────────────────────── */}
      <div className="absolute inset-0 z-0 bg-[#0a0f1e]" />
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${HERO_BG}')`, opacity: 0.35, mixBlendMode: "luminosity" }}
      />
      {/* Deep gradient overlays */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-[#0a0f1e]/80 via-transparent to-[#0a0f1e]" />
      <div className="absolute inset-0 z-1 bg-gradient-to-r from-[#0a0f1e]/80 via-transparent to-transparent" />
      {/* Subtle blue glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 z-1 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%)" }}
      />

      {/* ═══════════════════════════════════════════════════════
          DESKTOP FLOATING NAVBAR
      ═══════════════════════════════════════════════════════ */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img src={WHITE_LOGO} alt="CosGen.id" className="h-8 w-auto object-contain" />
        </Link>

        {/* Center pill */}
        <div
          className="flex items-center gap-0.5 px-1.5 py-1 rounded-full"
          style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {[
            { label: "Portofolio", hash: "#portfolio" },
            { label: "Paket", hash: "#pricelist" },
            { label: "FAQ", hash: "#faq" },
          ].map(item => (
            <button
              key={item.label}
              type="button"
              onClick={() => scrollTo(item.hash)}
              className="text-white/70 hover:text-white hover:bg-white/10 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <Link
            href="/cek-status"
            className="text-white/70 hover:text-white hover:bg-white/10 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all"
          >
            Cek Status
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={onOpenSlotChecker}
            className="text-white/80 hover:text-white text-[13px] font-semibold px-4 py-2 rounded-full transition-all"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            Cek Slot
          </button>
          <button
            type="button"
            onClick={onOpenOrderModal}
            className="tf-btn tf-btn-primary tf-press"
            style={{ minHeight: "40px", padding: "0 20px", fontSize: "14px" }}
          >
            Pesan Sekarang
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════
          MOBILE TOP BAR
      ═══════════════════════════════════════════════════════ */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
        style={{ height: "56px", background: "rgba(10,15,30,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link href="/">
          <img src={WHITE_LOGO} alt="CosGen.id" className="h-7 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/cek-status"
            className="text-[12px] font-bold px-3 py-1.5 rounded-xl"
            style={{ color: "var(--tf-primary)", background: "var(--tf-primary-dim)", border: "1px solid var(--tf-primary-border)" }}
          >
            Status
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          DESKTOP HERO — Cinematic left-aligned
      ═══════════════════════════════════════════════════════ */}
      <div className="hidden md:flex absolute inset-0 z-10 items-center">
        <div className="max-w-6xl mx-auto w-full px-12 flex flex-col items-start gap-7" style={{ paddingTop: "80px" }}>

          {/* Live badge */}
          <div
            className="tf-badge tf-badge-mint tf-animate-fade-in"
            style={{ fontSize: "11px" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" style={{ animation: "tf-pulse-dot 2s ease-in-out infinite" }} />
            Slot Tersedia — Siap Menerima Pesanan
          </div>

          {/* Headline */}
          <h1
            suppressHydrationWarning
            className="font-headline font-black text-white leading-[1.05] tracking-tight"
            style={{
              fontSize: "clamp(44px, 5.5vw, 72px)",
              maxWidth: "700px",
              textShadow: "0 2px 30px rgba(0,0,0,0.8)",
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.25s ease",
              animation: "tf-slide-up 0.45s cubic-bezier(.34,1.56,.64,1) 0.05s both",
            }}
          >
            {headline}
          </h1>

          {/* Sub */}
          <p
            suppressHydrationWarning
            className="text-[16px] leading-relaxed max-w-md"
            style={{
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'DM Sans', sans-serif",
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.25s ease",
              animation: "tf-slide-up 0.45s cubic-bezier(.34,1.56,.64,1) 0.12s both",
            }}
          >
            {subheadline}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap" style={{ animation: "tf-slide-up 0.45s cubic-bezier(.34,1.56,.64,1) 0.2s both" }}>
            <button
              type="button"
              onClick={onOpenOrderModal}
              className="tf-btn tf-btn-primary tf-press"
              style={{ minHeight: "56px", padding: "0 32px", fontSize: "16px" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {ctaText}
            </button>
            <button
              type="button"
              onClick={onOpenSlotChecker}
              className="tf-btn tf-btn-ghost tf-press"
              style={{ minHeight: "56px", padding: "0 28px", fontSize: "15px" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Cek Slot
            </button>
          </div>

          {/* Trust strip */}
          <div className="flex items-center gap-5" style={{ animation: "tf-fade-in 0.5s ease 0.4s both" }}>
            {[
              { color: "#34D399", text: "Respon Cepat" },
              { color: "#3B82F6", text: "Status Transparan" },
              { color: "#F97171", text: "Revisi Termasuk" },
            ].map(b => (
              <span key={b.text} className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: b.color }} />
                {b.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MOBILE HERO — App-native layout
      ═══════════════════════════════════════════════════════ */}
      <div
        className="md:hidden relative z-10 flex flex-col px-5 text-center items-center justify-end"
        style={{
          minHeight: "100dvh",
          paddingTop: "72px",
          paddingBottom: "calc(100px + var(--safe-area-bottom, 0px))",
        }}
      >
        {/* Hero image floating card */}
        <div
          className="w-full rounded-2xl overflow-hidden mb-5 flex-shrink-0"
          style={{ height: "200px", animation: "tf-fade-in 0.4s ease 0.05s both" }}
        >
          <img src={HERO_BG} alt="CosGen work" className="w-full h-full object-cover" />
          <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(to top, rgba(10,15,30,0.8) 0%, transparent 50%)" }} />
          <div className="absolute top-3 left-3 tf-badge tf-badge-mint" style={{ fontSize: "10px" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" style={{ animation: "tf-pulse-dot 2s ease-in-out infinite" }} />
            Live — Slot Tersedia
          </div>
        </div>

        {/* Text */}
        <h1
          suppressHydrationWarning
          className="font-headline font-black text-white leading-tight tracking-tight mb-3"
          style={{
            fontSize: "28px",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.25s ease",
            animation: "tf-slide-up 0.4s cubic-bezier(.34,1.56,.64,1) 0.1s both",
          }}
        >
          {headline}
        </h1>
        <p
          suppressHydrationWarning
          className="text-[13px] leading-relaxed mb-6 max-w-[280px]"
          style={{
            color: "rgba(255,255,255,0.5)",
            fontFamily: "'DM Sans', sans-serif",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}
        >
          {subheadline}
        </p>

        {/* ── 1-TAP ACTIONS ─────────────────────────────────── */}
        <div className="w-full max-w-sm space-y-2.5" style={{ animation: "tf-slide-up 0.4s cubic-bezier(.34,1.56,.64,1) 0.18s both" }}>
          {/* Primary */}
          <button
            type="button"
            onClick={onOpenOrderModal}
            className="w-full flex items-center gap-3 rounded-2xl tf-press"
            style={{ background: "var(--tf-primary)", color: "#fff", padding: "15px 20px", boxShadow: "var(--tf-shadow-blue)", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: "15px" }}
          >
            <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </span>
            <span className="flex-1 text-left">{ctaText}</span>
            <svg className="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          {/* 3-col quick actions */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              {
                label: "Cek Slot", color: "#3B82F6",
                onClick: onOpenSlotChecker,
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
              },
              {
                label: "Status", color: "#34D399",
                href: "/cek-status",
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
              },
              {
                label: "Harga", color: "#F97171",
                onClick: () => scrollTo("#pricelist"),
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
              },
            ].map(item => {
              const inner = (
                <>
                  <span style={{ color: item.color }}>{item.icon}</span>
                  <span className="text-[11px] font-bold text-white">{item.label}</span>
                </>
              );
              const cls = "flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all tf-press-sm";
              const style = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" };
              return item.href
                ? <Link key={item.label} href={item.href} className={cls} style={style}>{inner}</Link>
                : <button key={item.label} type="button" onClick={item.onClick} className={cls} style={style}>{inner}</button>;
            })}
          </div>
        </div>
      </div>

      {/* Bottom fade-to-bg */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 h-32 z-5 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--tf-bg))" }}
      />
    </section>
  );
}

export default HeroSection;
