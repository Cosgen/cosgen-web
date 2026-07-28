"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  { href: "/home#portfolio", label: "Portofolio" },
  { href: "/portfolio", label: "Galeri Lengkap" },
  { href: "/home#compare", label: "Compare" },
  { href: "/home#pricelist", label: "Paket" },
  { href: "/home#faq", label: "FAQ" },
  { href: "/cek-status", label: "Cek Status" },
];

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800/60 font-sans">
      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 items-start">
          {/* Brand */}
          <div className="space-y-3">
            <img
              src="https://res.cloudinary.com/or0nvx0c/image/upload/v1785184391/Logo_Putih_01_xozs8n.png"
              alt="CosGen.id"
              className="h-8 w-auto object-contain"
            />
            <p className="text-[12px] text-slate-400 leading-relaxed max-w-sm">
              Platform pemesanan jasa edit foto cosplay dengan visual CGI & VFX tingkat sinematik.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-bold">Studio Online — Siap Menerima Pesanan</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3 md:justify-self-end">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Navigasi Utama</h4>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[12px] text-slate-400 hover:text-white transition-colors flex items-center gap-1 group font-medium"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-600">
          <p>© {new Date().getFullYear()} CosGen.id Platform — Hak Cipta Dilindungi.</p>
          <p className="text-slate-700">Made with ♥ for Cosplay Community</p>
        </div>
      </div>
    </footer>
  );
}
