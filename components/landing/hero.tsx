"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const HERO_BG    = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785188133/Pic_1_Aemeath_a6tnw8.jpg";
const WHITE_LOGO = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785184391/Logo_Putih_01_xozs8n.png";
const COLOR_LOGO = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785184392/Logo_Warna_01_y5dpcm.png";

interface HeroProps {
  onOpenOrderModal: () => void;
  onOpenSlotChecker?: () => void;
}

export function HeroSection({ onOpenOrderModal, onOpenSlotChecker }: HeroProps) {
  const [mounted, setMounted]           = useState(false);
  const [headline, setHeadline]         = useState("Ubah Foto Cosplay Jadi Mahakarya");
  const [subheadline, setSubheadline]   = useState("Platform Order Interaktif");

  useEffect(() => {
    setMounted(true);
    const load = () => {
      try {
        const c = JSON.parse(localStorage.getItem("cosgen_site_content") || "null");
        if (c?.hero) {
          if (c.hero.headline) setHeadline(c.hero.headline);
          if (c.hero.subheadline) setSubheadline(c.hero.subheadline);
        }
      } catch {}
      fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" })
        .then(r => r.json()).then(d => {
          if (d.content?.hero) {
            if (d.content.hero.headline) setHeadline(d.content.hero.headline);
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
    <section className="relative w-full overflow-hidden" style={{ minHeight: "100dvh", background: "var(--bg)" }}>

      {/* ── BG IMAGE ──────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${HERO_BG}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.18,
        }}
      />
      {/* Gradient overlays adaptive to theme */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, var(--bg) 0%, transparent 40%, var(--bg) 85%)" }}
      />

      {/* ── DESKTOP NAVBAR ──────────────────────────────────────── */}
      <header
        className="hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between"
        style={{
          height: "60px",
          padding: "0 clamp(16px,4vw,48px)",
          background: "var(--surface)",
          opacity: 0.96,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link href="/">
          <img src={COLOR_LOGO} alt="CosGen.id" className="h-7 w-auto dark:hidden" />
          <img src={WHITE_LOGO} alt="CosGen.id" className="h-7 w-auto hidden dark:block" />
        </Link>

        <nav className="flex items-center gap-1">
          {[
            { label: "Portofolio", hash: "#portfolio" },
            { label: "Paket", hash: "#pricelist" },
            { label: "FAQ", hash: "#faq" },
          ].map(n => (
            <button
              key={n.label}
              type="button"
              onClick={() => scrollTo(n.hash)}
              className="px-3 py-1.5 text-[13px] font-medium transition-all cursor-pointer"
              style={{
                color: "var(--text-2)",
                fontFamily: "'Inter',sans-serif",
                borderRadius: "var(--r-sm)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-1)"; (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-2)"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              {n.label}
            </button>
          ))}
          <Link
            href="/cek-status"
            className="px-3 py-1.5 text-[13px] font-medium transition-all"
            style={{ color: "var(--text-2)", fontFamily: "'Inter',sans-serif", borderRadius: "var(--r-sm)" }}
          >
            Cek Status
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={onOpenSlotChecker}
            className="btn btn-ghost btn-sm"
          >
            Cek Slot
          </button>
          <button type="button" onClick={onOpenOrderModal} className="btn btn-primary btn-sm">
            Pesan Sekarang
          </button>
        </div>
      </header>

      {/* ── MOBILE TOP BAR ──────────────────────────────────────── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        style={{
          height: "var(--nav-h, 56px)",
          padding: "0 16px",
          background: "var(--surface)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link href="/">
          <img src={COLOR_LOGO} alt="CosGen.id" className="h-6 w-auto dark:hidden" />
          <img src={WHITE_LOGO} alt="CosGen.id" className="h-6 w-auto hidden dark:block" />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/cek-status"
            className="btn btn-sm"
            style={{ background: "var(--blue-dim)", color: "var(--blue)", border: "1px solid var(--blue-border)", fontSize: "12px", minHeight: "32px", padding: "0 10px" }}
          >
            Status
          </Link>
        </div>
      </div>

      {/* ── DESKTOP HERO CONTENT ─────────────────────────────────── */}
      <div
        className="hidden md:flex relative z-10 flex-col justify-center"
        style={{
          minHeight: "100dvh",
          paddingTop: "60px",
          maxWidth: "var(--page-max)",
          margin: "0 auto",
          padding: "60px clamp(16px,4vw,48px) 80px",
        }}
      >
        {/* Headline */}
        <h1
          suppressHydrationWarning
          className="headline leading-[1.08] mb-3"
          style={{
            fontSize: "clamp(36px, 5.5vw, 76px)",
            maxWidth: "740px",
            color: "var(--text-1)",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.2s ease",
            animation: "slide-up 0.5s cubic-bezier(.22,1,.36,1) 0.05s both",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {headline}
        </h1>

        {/* Sub-headline: Platform Order Interaktif */}
        <p
          suppressHydrationWarning
          className="text-[18px] font-semibold leading-relaxed max-w-lg mb-8"
          style={{
            color: "var(--blue)",
            fontFamily: "'Inter',sans-serif",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.2s ease",
            animation: "slide-up 0.5s cubic-bezier(.22,1,.36,1) 0.12s both",
          }}
        >
          {subheadline}
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3 flex-wrap mb-10" style={{ animation: "slide-up 0.5s cubic-bezier(.22,1,.36,1) 0.2s both" }}>
          <button type="button" onClick={onOpenOrderModal} className="btn btn-primary btn-lg">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Pesan Sekarang
          </button>
          <button type="button" onClick={onOpenSlotChecker} className="btn btn-ghost btn-lg">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Cek Slot Tersedia
          </button>
          <button type="button" onClick={() => scrollTo("#portfolio")} className="btn btn-sm" style={{ background: "transparent", color: "var(--text-3)", fontFamily: "'Inter',sans-serif", border: "none", boxShadow: "none" }}>
            Lihat Portofolio →
          </button>
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-8" style={{ animation: "fade-in 0.5s ease 0.35s both" }}>
          {[
            { value: "200+", label: "Pesanan Selesai" },
            { value: "±3 Hari", label: "Estimasi Kerja" },
            { value: "4.9★", label: "Rating Kepuasan" },
          ].map(s => (
            <div key={s.label}>
              <div className="headline text-xl font-bold mb-0.5" style={{ color: "var(--text-1)" }}>{s.value}</div>
              <div className="text-[11px] font-medium" style={{ color: "var(--text-3)", fontFamily: "'Inter',sans-serif" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MOBILE HERO ──────────────────────────────────────────── */}
      <div
        className="md:hidden relative z-10 flex flex-col justify-center"
        style={{
          minHeight: "100dvh",
          paddingTop: "calc(var(--nav-h, 56px) + 24px)",
          paddingBottom: "calc(var(--bnav-h, 64px) + 24px)",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        {/* Text */}
        <h1
          suppressHydrationWarning
          className="headline leading-tight mb-2"
          style={{
            fontSize: "28px",
            color: "var(--text-1)",
            fontFamily: "'Space Grotesk', sans-serif",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        >
          {headline}
        </h1>

        {/* Sub-headline: Platform Order Interaktif */}
        <p
          suppressHydrationWarning
          className="text-[15px] font-semibold leading-relaxed mb-6"
          style={{ color: "var(--blue)", fontFamily: "'Inter',sans-serif", maxWidth: "320px", opacity: mounted ? 1 : 0, transition: "opacity 0.2s ease" }}
        >
          {subheadline}
        </p>

        {/* Quick action grid */}
        <div className="space-y-2.5 w-full max-w-sm">
          {/* Primary CTA */}
          <button
            type="button"
            onClick={onOpenOrderModal}
            className="w-full btn btn-primary btn-lg"
            style={{
              justifyContent: "flex-start",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >
            <span
              className="w-9 h-9 flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.2)", borderRadius: "var(--r-xs)" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </span>
            <span className="flex-1 text-left font-semibold">Pesan Sekarang</span>
            <svg className="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          {/* 3-col sub actions */}
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                label: "Cek Slot",
                color: "var(--blue)",
                onClick: onOpenSlotChecker,
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
              },
              {
                label: "Status",
                color: "var(--mint)",
                href: "/cek-status",
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
              },
              {
                label: "Harga",
                color: "var(--amber)",
                onClick: () => scrollTo("#pricelist"),
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
              },
            ].map(item => {
              const style = {
                display: "flex", flexDirection: "column" as const, alignItems: "center",
                gap: "6px", padding: "12px 8px",
                background: "var(--surface)",
                border: "1px solid var(--border-md)",
                borderRadius: "var(--r-lg)",
                cursor: "pointer",
              };
              const inner = <>
                <span style={{ color: item.color }}>{item.icon}</span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-1)", fontFamily: "'Inter',sans-serif" }}>{item.label}</span>
              </>;
              return item.href
                ? <Link key={item.label} href={item.href} style={style}>{inner}</Link>
                : <button key={item.label} type="button" onClick={item.onClick} style={style}>{inner}</button>;
            })}
          </div>
        </div>

        {/* Mini stats */}
        <div className="flex items-center gap-6 mt-8">
          {[{ v: "200+", l: "Selesai" }, { v: "±3 Hari", l: "Estimasi" }, { v: "4.9★", l: "Rating" }].map(s => (
            <div key={s.l} className="text-center">
              <div className="headline font-bold" style={{ fontSize: "16px", color: "var(--text-1)" }}>{s.v}</div>
              <div style={{ fontSize: "10px", color: "var(--text-3)", fontFamily: "'Inter',sans-serif" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

export default HeroSection;
