"use client";

import React from "react";
import Link from "next/link";

const WHITE_LOGO = "https://res.cloudinary.com/or0nvx0c/image/upload/v1785184391/Logo_Putih_01_xozs8n.png";

const LINKS = [
  { href: "#portfolio", label: "Portofolio" },
  { href: "#pricelist", label: "Paket & Harga" },
  { href: "#faq",       label: "FAQ" },
  { href: "/cek-status", label: "Cek Status Pesanan", external: true },
];

export function LandingFooter() {
  const nav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", href);
  };

  return (
    <footer
      className="page-wrap md:pb-0"
      style={{ background: "#070c16", borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Top section */}
      <div className="container pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <img src={WHITE_LOGO} alt="CosGen.id" className="h-7 w-auto mb-4" />
            <p className="text-[13px] leading-relaxed max-w-sm mb-5" style={{ color: "#3d4f6b", fontFamily: "'Inter',sans-serif" }}>
              Platform pemesanan jasa edit foto cosplay dengan visual CGI &amp; VFX sinematik. Hasil premium, proses transparan.
            </p>
            <div className="flex items-center gap-2">
              <span className="pulse-dot w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#34D399" }} />
              <span className="text-[12px] font-semibold" style={{ color: "#34D399", fontFamily: "'Inter',sans-serif" }}>
                Siap Menerima Pesanan
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: "#2a3a52", fontFamily: "'Inter',sans-serif" }}>
              Navigasi
            </h4>
            <ul className="space-y-2.5">
              {LINKS.map(l => (
                <li key={l.href}>
                  {l.external
                    ? <Link href={l.href} className="text-[13px] font-medium transition-colors hover:text-white" style={{ color: "#3d4f6b", fontFamily: "'Inter',sans-serif" }}>{l.label}</Link>
                    : <a href={l.href} onClick={e => nav(e as React.MouseEvent<HTMLAnchorElement>, l.href)} className="text-[13px] font-medium transition-colors hover:text-white" style={{ color: "#3d4f6b", fontFamily: "'Inter',sans-serif" }}>{l.label}</a>
                  }
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <p className="text-[11px]" style={{ color: "#243040", fontFamily: "'Inter',sans-serif" }}>
            © {new Date().getFullYear()} CosGen.id — Hak Cipta Dilindungi.
          </p>
          <p className="text-[11px]" style={{ color: "#243040", fontFamily: "'Inter',sans-serif" }}>
            Made with ♥ for the Cosplay Community
          </p>
        </div>
      </div>
    </footer>
  );
}
