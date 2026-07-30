"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const HERO_BG  = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785188133/Pic_1_Aemeath_a6tnw8.jpg";
const WHITE_LOGO = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785184391/Logo_Putih_01_xozs8n.png";

interface HeroProps {
  onOpenOrderModal: () => void;
  onOpenSlotChecker?: () => void;
}

export function HeroSection({ onOpenOrderModal, onOpenSlotChecker }: HeroProps) {
  const [mounted, setMounted]       = useState(false);
  const [headline, setHeadline]     = useState("Ubah Foto Cosplay Jadi Mahakarya");
  const [subheadline, setSubheadline] = useState("Layanan editing visual profesional — Cosplay, CGI & Background Premium sinematik.");

  useEffect(() => {
    setMounted(true);
    const load = () => {
      // instant from cache
      try {
        const c = JSON.parse(localStorage.getItem("cosgen_site_content") || "null");
        if (c?.hero) { if (c.hero.headline) setHeadline(c.hero.headline); if (c.hero.subheadline) setSubheadline(c.hero.subheadline); }
      } catch {}
      // fresh from API
      fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" })
        .then(r => r.json()).then(d => {
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
    <section className="relative w-full overflow-hidden" style={{ minHeight: "100dvh", background: "#050a14" }}>

      {/* ── BG IMAGE ──────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${HERO_BG}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.28,
        }}
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(5,10,20,0.7) 0%, rgba(5,10,20,0.2) 40%, rgba(5,10,20,0.9) 80%, #0a0f1a 100%)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(5,10,20,0.6) 0%, transparent 60%)" }} />

      {/* ── DESKTOP NAVBAR ──────────────────────────────────────── */}
      <header
        className="hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between"
        style={{
          height: "60px",
          padding: "0 clamp(16px,4vw,48px)",
          background: "rgba(5,10,20,0.8)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Link href="/">
          <img src={WHITE_LOGO} alt="CosGen.id" className="h-7 w-auto" />
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
              className="px-3 py-1.5 text-[13px] font-medium rounded transition-all cursor-pointer"
              style={{
                color: "rgba(255,255,255,0.55)",
                fontFamily: "'Inter',sans-serif",
                borderRadius: "var(--r-sm)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              {n.label}
            </button>
          ))}
          <Link
            href="/cek-status"
            className="px-3 py-1.5 text-[13px] font-medium transition-all"
            style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Inter',sans-serif", borderRadius: "var(--r-sm)" }}
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
            style={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)" }}
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
          background: "rgba(5,10,20,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Link href="/">
          <img src={WHITE_LOGO} alt="CosGen.id" className="h-6 w-auto" />
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
        {/* Live badge */}
        <div
          className="label label-mint inline-flex w-fit mb-6"
          style={{ animation: "fade-in 0.4s ease both" }}
        >
          <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-[#34D399] inline-block" />
          Slot Tersedia — Buka Pesanan
        </div>

        {/* Headline */}
        <h1
          suppressHydrationWarning
          className="headline text-white leading-[1.08] mb-5"
          style={{
            fontSize: "clamp(36px, 5.5vw, 76px)",
            maxWidth: "740px",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.2s ease",
            animation: "slide-up 0.5s cubic-bezier(.22,1,.36,1) 0.05s both",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {headline}
        </h1>

        {/* Sub */}
        <p
          suppressHydrationWarning
          className="text-[16px] leading-relaxed max-w-lg mb-8"
          style={{
            color: "rgba(255,255,255,0.5)",
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
          <button type="button" onClick={onOpenSlotChecker} className="btn btn-ghost btn-lg" style={{ color: "rgba(255,255,255,0.75)", borderColor: "rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.06)" }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Cek Slot Tersedia
          </button>
          <button type="button" onClick={() => scrollTo("#portfolio")} className="btn btn-sm" style={{ background: "transparent", color: "rgba(255,255,255,0.45)", fontFamily: "'Inter',sans-serif", border: "none", boxShadow: "none" }}>
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
              <div className="headline text-xl font-bold text-white mb-0.5">{s.value}</div>
              <div className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Inter',sans-serif" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MOBILE HERO ──────────────────────────────────────────── */}
      <div
        className="md:hidden relative z-10 flex flex-col"
        style={{
          minHeight: "100dvh",
          paddingTop: "calc(var(--nav-h, 56px) + 16px)",
          paddingBottom: "calc(var(--bnav-h, 64px) + 16px)",
          padding: "calc(var(--nav-h, 56px) + 16px) 16px calc(var(--bnav-h, 64px) + 20px)",
        }}
      >
        {/* Hero image */}
        <div
          className="w-full rounded-[10px] overflow-hidden mb-5 flex-shrink-0 relative"
          style={{ height: "clamp(180px, 45vw, 240px)" }}
        >
          <img src={HERO_BG} alt="CosGen work" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,10,20,0.7) 0%, transparent 50%)" }} />
          <span className="label label-mint absolute top-3 left-3" style={{ fontSize: "9px" }}>
            <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-[#34D399] inline-block" />
            Slot Tersedia
          </span>
        </div>

        {/* Text */}
        <h1
          suppressHydrationWarning
          className="headline text-white leading-tight mb-3"
          style={{
            fontSize: "26px",
            fontFamily: "'Space Grotesk', sans-serif",
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        >
          {headline}
        </h1>
        <p
          suppressHydrationWarning
          className="text-[13px] leading-relaxed mb-6"
          style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Inter',sans-serif", maxWidth: "300px", opacity: mounted ? 1 : 0, transition: "opacity 0.2s ease" }}
        >
          {subheadline}
        </p>

        {/* Quick action grid */}
        <div className="space-y-2.5 w-full max-w-sm">
          {/* Primary CTA */}
          <button
            type="button"
            onClick={onOpenOrderModal}
            className="w-full flex items-center gap-3"
            style={{
              background: "var(--blue)",
              color: "#fff",
              padding: "14px 16px",
              borderRadius: "var(--r-lg)",
              boxShadow: "var(--shadow-blue)",
              fontFamily: "'Inter',sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span
              className="w-9 h-9 flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.18)", borderRadius: "var(--r-sm)" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </span>
            <span className="flex-1 text-left">Pesan Sekarang</span>
            <svg className="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          {/* 3-col sub actions */}
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                label: "Cek Slot",
                color: "#60A5FA",
                onClick: onOpenSlotChecker,
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
              },
              {
                label: "Status",
                color: "#34D399",
                href: "/cek-status",
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
              },
              {
                label: "Harga",
                color: "#FBBF24",
                onClick: () => scrollTo("#pricelist"),
                icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
              },
            ].map(item => {
              const style = {
                display: "flex", flexDirection: "column" as const, alignItems: "center",
                gap: "6px", padding: "12px 8px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "var(--r-lg)",
                cursor: "pointer",
              };
              const inner = <>
                <span style={{ color: item.color }}>{item.icon}</span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#fff", fontFamily: "'Inter',sans-serif" }}>{item.label}</span>
              </>;
              return item.href
                ? <Link key={item.label} href={item.href} style={style}>{inner}</Link>
                : <button key={item.label} type="button" onClick={item.onClick} style={style}>{inner}</button>;
            })}
          </div>
        </div>

        {/* Mini stats */}
        <div className="flex items-center gap-5 mt-6">
          {[{ v: "200+", l: "Selesai" }, { v: "±3 Hari", l: "Estimasi" }, { v: "4.9★", l: "Rating" }].map(s => (
            <div key={s.l} className="text-center">
              <div className="headline font-bold text-white" style={{ fontSize: "16px" }}>{s.v}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "'Inter',sans-serif" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-5"
        style={{ background: "linear-gradient(to bottom, transparent, #0a0f1a)" }} />
    </section>
  );
}

export default HeroSection;
