"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, MessageCircle, ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  { href: "/home#portfolio", label: "Portofolio" },
  { href: "/portfolio", label: "Galeri Lengkap" },
  { href: "/home#compare", label: "Compare" },
  { href: "/home#pricelist", label: "Paket" },
  { href: "/home#faq", label: "FAQ" },
  { href: "/cek-status", label: "Cek Status" },
];

const PORTAL_LINKS = [
  { href: "/admin", label: "Admin Panel", icon: ShieldCheck, color: "text-blue-400" },
  { href: "/chat", label: "Live Chat Support", icon: MessageCircle, color: "text-emerald-400" },
];

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800/60">
      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <img
              src="https://res.cloudinary.com/or0nvx0c/image/upload/v1785184391/Logo_Putih_01_xozs8n.png"
              alt="CosGen.id"
              className="h-8 w-auto object-contain"
            />
            <p className="text-[12px] text-slate-400 leading-relaxed max-w-xs">
              Platform SaaS pemesanan jasa edit foto cosplay dengan visual CGI & VFX tingkat sinematik.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-bold">Studio Online — Siap Menerima Pesanan</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Navigasi</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[12px] text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portal Access */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">Portal Akses</h4>
            <ul className="space-y-3">
              {PORTAL_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2.5 text-[12px] text-slate-400 hover:text-white transition-colors group"
                    >
                      <span className={`p-1.5 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors`}>
                        <Icon className={`w-3.5 h-3.5 ${link.color}`} />
                      </span>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Tech badges */}
            <div className="pt-2 flex flex-wrap gap-1.5">
              {["Next.js 16", "Turbopack", "Tailwind v4"].map((t) => (
                <span key={t} className="px-2 py-0.5 bg-slate-800 text-slate-500 text-[9px] font-bold rounded-md">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-600">
          <p>© {new Date().getFullYear()} CosGen.id SaaS Platform — Hak Cipta Dilindungi.</p>
          <p className="text-slate-700">Made with ♥ for cosplay community</p>
        </div>
      </div>
    </footer>
  );
}
