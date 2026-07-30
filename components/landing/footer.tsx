"use client";

import React from "react";
import Link from "next/link";

const WHITE_LOGO = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785184391/Logo_Putih_01_xozs8n.png";

const QUICK_LINKS = [
  { href: "#portfolio", label: "Portofolio" },
  { href: "#pricelist", label: "Paket & Harga" },
  { href: "#faq", label: "FAQ" },
  { href: "/cek-status", label: "Cek Status" },
];

export function LandingFooter() {
  const handleHashNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) { el.scrollIntoView({ behavior: "smooth" }); history.replaceState(null, "", href); }
    }
  };

  return (
    <footer
      className="tf-page-with-bottom-nav md:pb-0"
      style={{ background: "#0f172a", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-10">
        {/* Brand + Links row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <img src={WHITE_LOGO} alt="CosGen.id" className="h-7 w-auto object-contain" />
            <p
              className="text-[13px] leading-relaxed max-w-[260px]"
              style={{ color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}
            >
              Platform pemesanan jasa edit foto cosplay dengan visual CGI & VFX cinematic.
            </p>
            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "#34D399", animation: "tf-pulse-dot 2s ease-in-out infinite" }}
              />
              <span className="text-[11px] font-semibold" style={{ color: "#34D399" }}>
                Siap Menerima Pesanan
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4
              className="text-[10px] font-black uppercase tracking-[0.15em] mb-3"
              style={{ color: "#475569" }}
            >
              Navigasi
            </h4>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleHashNav(e, link.href)}
                    className="text-[13px] font-medium transition-colors hover:text-white"
                    style={{ color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "#475569", fontFamily: "'DM Sans', sans-serif" }}
        >
          <p>© {new Date().getFullYear()} CosGen.id — Hak Cipta Dilindungi.</p>
          <p>Made with ♥ for the Cosplay Community</p>
        </div>
      </div>
    </footer>
  );
}
