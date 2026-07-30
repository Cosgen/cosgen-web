"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const WHITE_LOGO = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785184391/Logo_Putih_01_xozs8n.png";
const COLOR_LOGO = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785184392/Logo_Warna_01_y5dpcm.png";

interface TouchFlowNavbarProps {
  onOrderClick: () => void;
  onSlotClick: () => void;
}

const navLinks = [
  { label: "Portofolio", href: "#portfolio" },
  { label: "Price List", href: "#pricelist" },
  { label: "FAQ", href: "#faq" },
];

export function TouchFlowNavbar({ onOrderClick, onSlotClick }: TouchFlowNavbarProps) {
  const handleHashNav = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", hash);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 hidden md:block"
      style={{
        paddingTop: "var(--safe-area-top, 0px)",
      }}
    >
      <div
        className="mx-4 mt-3 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "var(--tf-shadow-medium)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={COLOR_LOGO} alt="CosGen.id" className="h-7 w-auto object-contain dark:hidden" />
            <img src={WHITE_LOGO} alt="CosGen.id" className="h-7 w-auto object-contain hidden dark:block" />
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleHashNav(e, link.href)}
                className="px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-150 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
                style={{
                  color: "var(--tf-text-secondary)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/cek-status"
              className="px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-150 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
              style={{
                color: "var(--tf-text-secondary)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Cek Status
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={onSlotClick}
              className="px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-150"
              style={{
                background: "var(--tf-surface-2)",
                color: "var(--tf-primary)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Cek Slot
            </button>
            <button
              type="button"
              onClick={onOrderClick}
              className="tf-btn-primary tf-press"
              style={{ minHeight: "38px", padding: "0 20px", fontSize: "13px" }}
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Dark mode overlay */}
      <style>{`
        .dark header > div > div {
          background: rgba(15, 23, 42, 0.85) !important;
          border-color: rgba(255,255,255,0.08) !important;
        }
      `}</style>
    </header>
  );
}
