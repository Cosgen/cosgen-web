"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const HERO_BG_IMAGE = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785188133/Pic_1_Aemeath_a6tnw8.jpg";
const WHITE_LOGO = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785184391/Logo_Putih_01_xozs8n.png";

interface HeroProps {
  onOpenOrderModal?: () => void;
  onOpenSlotChecker?: () => void;
}

export function HeroSection({ onOpenOrderModal, onOpenSlotChecker }: HeroProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 dark:bg-black text-white font-sans tracking-[-0.02em] select-none" style={{ height: "100dvh" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@1,400;1,500;1,600&display=swap');
        .font-playfair { font-family: 'Playfair Display', serif; }
      ` }} />

      {/* Single Static Background Image (DESKTOP ONLY: HIDDEN ON MOBILE) */}
      <div
        className="hidden md:block absolute inset-0 bg-center bg-cover bg-no-repeat z-10"
        style={{ backgroundImage: `url('${HERO_BG_IMAGE}')` }}
      />

      {/* Fixed Top Pill Navigation Overlay */}
      <nav className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-3 sm:p-4">
        {/* Brand Logo Left */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer z-10">
          <img
            src={WHITE_LOGO}
            alt="CosGen.id Official White Logo"
            className="h-7 sm:h-8 w-auto object-contain"
          />
        </Link>

        {/* Center Glass Pill Nav (Desktop) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-slate-900/60 backdrop-blur-md border border-white/15 rounded-full px-1.5 py-1 items-center gap-0.5 shadow-lg">
          <Link
            href="#portfolio"
            className="text-white hover:bg-white/20 px-3.5 py-1 rounded-full text-[11px] font-semibold transition-colors"
          >
            Portofolio
          </Link>
          <Link
            href="#compare"
            className="text-white/80 hover:bg-white/20 hover:text-white px-3.5 py-1 rounded-full text-[11px] font-semibold transition-colors"
          >
            Compare
          </Link>
          <Link
            href="#pricelist"
            className="text-white/80 hover:bg-white/20 hover:text-white px-3.5 py-1 rounded-full text-[11px] font-semibold transition-colors"
          >
            Packet
          </Link>
          <Link
            href="/cek-status"
            className="text-white/80 hover:bg-white/20 hover:text-white px-3.5 py-1 rounded-full text-[11px] font-semibold transition-colors"
          >
            Cek Status
          </Link>
          <Link
            href="#faq"
            className="text-white/80 hover:bg-white/20 hover:text-white px-3.5 py-1 rounded-full text-[11px] font-semibold transition-colors"
          >
            FAQ
          </Link>
        </div>

        {/* Right Nav Action (Theme Toggle + Mobile Hamburger) */}
        <div className="flex items-center gap-2 z-10">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-1.5 bg-slate-900/60 rounded-lg backdrop-blur-sm border border-white/20"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/90 backdrop-blur-md p-6 flex flex-col justify-center items-center space-y-4 text-white md:hidden">
          <Link
            href="#portfolio"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-bold hover:text-blue-400"
          >
            Portofolio
          </Link>
          <Link
            href="#compare"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-bold hover:text-blue-400"
          >
            Compare
          </Link>
          <Link
            href="#pricelist"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-bold hover:text-blue-400"
          >
            Packet
          </Link>
          <Link
            href="/cek-status"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-bold hover:text-blue-400"
          >
            Cek Status
          </Link>
          <Link
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-bold hover:text-blue-400"
          >
            FAQ
          </Link>
        </div>
      )}

      {/* Hero Content Box: Centered on Mobile, Right-Top on Desktop */}
      <div className="absolute top-[18%] sm:top-[22%] md:top-[16%] left-0 right-0 md:left-auto md:right-12 flex flex-col items-center md:items-end text-center md:text-right px-4 sm:px-8 z-30 space-y-3 max-w-2xl mx-auto md:mx-0">
        {/* Title Line 1: Save the World? */}
        <span
          className="block font-playfair italic font-normal text-3xl sm:text-4xl md:text-5xl text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)] pointer-events-none"
          style={{ letterSpacing: "-0.04em" }}
        >
          Save the World?
        </span>

        {/* Title Line 2: Save the CAT! */}
        <span
          className="block font-normal text-3xl sm:text-4xl md:text-5xl text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)] pointer-events-none -mt-1.5"
          style={{ letterSpacing: "-0.06em" }}
        >
          Save the CAT!
        </span>

        {/* Action Buttons: Centered on Mobile, Right-aligned on Desktop */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 w-full max-w-sm pt-0.5">
          <button
            type="button"
            onClick={onOpenOrderModal}
            className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] sm:text-xs font-bold px-5 py-2 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/30 border border-blue-400/20"
          >
            Pesan Sekarang
          </button>

          {onOpenSlotChecker && (
            <button
              type="button"
              onClick={onOpenSlotChecker}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white text-[11px] sm:text-xs font-bold px-5 py-2 rounded-full transition-all hover:scale-105 active:scale-95 backdrop-blur-md shadow-md"
            >
              Cek Slot
            </button>
          )}
        </div>

        {/* Precise Function Features with Pure Monochrome White SVG Vector Icons */}
        <div className="flex items-center justify-center md:justify-end gap-2.5 sm:gap-4 text-[10px] sm:text-[11px] text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] pt-1 font-semibold max-w-full">
          {/* Feature 1: Slot Live (Monochrome Calendar SVG) */}
          <span className="inline-flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-white shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Slot Live
          </span>

          <span className="text-white/40">•</span>

          {/* Feature 2: Cek Status (Monochrome Tracking Search SVG) */}
          <span className="inline-flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-white shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Cek Status
          </span>

          <span className="text-white/40">•</span>

          {/* Feature 3: Live Chat (Monochrome Customer Support Chat SVG) */}
          <span className="inline-flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-white shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="0.7" fill="currentColor" />
              <circle cx="12" cy="10" r="0.7" fill="currentColor" />
              <circle cx="15" cy="10" r="0.7" fill="currentColor" />
            </svg>
            Live Chat
          </span>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
