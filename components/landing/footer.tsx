"use client";

import React from "react";
import Link from "next/link";

const WHITE_LOGO = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785184391/Logo_Putih_01_xozs8n.png";

const LINKS = [
  { href: "#portfolio", label: "Portofolio" },
  { href: "#pricelist", label: "Paket & Harga" },
  { href: "#faq", label: "FAQ" },
  { href: "/cek-status", label: "Cek Status Pesanan" },
];

export function LandingFooter() {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) { el.scrollIntoView({ behavior: "smooth" }); history.replaceState(null, "", href); }
  };

  return (
    <footer
      className="tf-page-safe-bottom md:pb-0"
      style={{ background: "#070d1a", borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-12 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-10 mb-10">

          {/* Brand col */}
          <div className="space-y-4 max-w-xs">
            <img src={WHITE_LOGO} alt="CosGen.id" className="h-7 w-auto object-contain" />
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "#4a5568", fontFamily: "'DM Sans',sans-serif" }}
            >
              Platform pemesanan jasa edit foto cosplay dengan visual CGI & VFX cinematic.
            </p>
            {/* Live dot */}
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "#34D399", animation: "tf-pulse-dot 2s ease-in-out infinite" }}
              />
              <span className="text-[12px] font-semibold" style={{ color: "#34D399" }}>
                Siap Menerima Pesanan
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.18em] mb-4" style={{ color: "#374151" }}>
              Navigasi
            </h4>
            <ul className="flex flex-col gap-3">
              {LINKS.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={e => handleNav(e as React.MouseEvent<HTMLAnchorElement>, link.href)}
                    className="text-[13px] font-medium transition-colors hover:text-white"
                    style={{ color: "#4a5568", fontFamily: "'DM Sans',sans-serif" }}
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
          className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)", fontFamily: "'DM Sans',sans-serif" }}
        >
          <p className="text-[11px]" style={{ color: "#2d3748" }}>
            © {new Date().getFullYear()} CosGen.id — Hak Cipta Dilindungi.
          </p>
          <p className="text-[11px]" style={{ color: "#2d3748" }}>
            Made with ♥ for the Cosplay Community
          </p>
        </div>
      </div>
    </footer>
  );
}
