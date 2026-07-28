"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Calendar, Menu, X, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface LandingNavbarProps {
  onOpenOrderModal?: () => void;
  onOpenSlotChecker?: () => void;
}

export function LandingNavbar({
  onOpenOrderModal,
  onOpenSlotChecker,
}: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isCekStatus = pathname === "/cek-status";

  const getAnchorHref = (hash: string) => {
    return isHome ? hash : `/${hash}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-all font-sans text-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-5 h-12 flex items-center justify-between">
        {/* Brand Official Logo */}
        <Link href="/" className="flex items-center group">
          <img
            src="https://res.cloudinary.com/or0nvx0c/image/upload/v1785184392/Logo_Warna_01_y5dpcm.png"
            alt="CosGen.id Official Logo"
            className="h-7 sm:h-7.5 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-4 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
          <Link href={getAnchorHref("#portfolio")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Portofolio
          </Link>
          <Link href={getAnchorHref("#compare")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Compare
          </Link>
          <Link href={getAnchorHref("#pricelist")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Packet
          </Link>
          <Link href="/cek-status" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Cek Status
          </Link>
          <Link href={getAnchorHref("#faq")} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            FAQ
          </Link>
          {!isCekStatus && (
            <Link
              href="/admin"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1 text-[10px]"
            >
              <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Admin
            </Link>
          )}
        </nav>

        {/* CTA Buttons & Theme Toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden md:flex items-center gap-2">
            {onOpenSlotChecker && (
              <button
                type="button"
                onClick={onOpenSlotChecker}
                className="px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-blue-300 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-600 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1"
              >
                <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Cek Slot
              </button>
            )}
            {!isCekStatus && onOpenOrderModal && (
              <button
                type="button"
                onClick={onOpenOrderModal}
                className="px-3.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg shadow-xs transition-all hover:scale-[1.02] flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Pesan Sekarang
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 pt-2 pb-3 space-y-2 text-[11px]">
          <nav className="flex flex-col space-y-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <Link href={getAnchorHref("#portfolio")} onClick={() => setMobileMenuOpen(false)}>
              Portofolio
            </Link>
            <Link href={getAnchorHref("#compare")} onClick={() => setMobileMenuOpen(false)}>
              Compare
            </Link>
            <Link href={getAnchorHref("#pricelist")} onClick={() => setMobileMenuOpen(false)}>
              Packet
            </Link>
            <Link href="/cek-status" onClick={() => setMobileMenuOpen(false)}>
              Cek Status
            </Link>
            <Link href={getAnchorHref("#faq")} onClick={() => setMobileMenuOpen(false)}>
              FAQ
            </Link>
            {!isCekStatus && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                Admin
              </Link>
            )}
          </nav>
          <div className="pt-1.5 flex flex-col gap-1.5">
            {onOpenSlotChecker && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSlotChecker();
                }}
                className="w-full py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-lg text-center flex items-center justify-center gap-1"
              >
                <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Cek Slot
              </button>
            )}
            {!isCekStatus && onOpenOrderModal && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenOrderModal) onOpenOrderModal();
                }}
                className="w-full py-1.5 bg-blue-600 text-white font-bold rounded-lg shadow-xs text-center"
              >
                Pesan Sekarang
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
