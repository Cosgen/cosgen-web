"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, MessageCircle } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-white font-sans border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <img
                src="https://res.cloudinary.com/or0nvx0c/image/upload/v1785184391/Logo_Putih_01_xozs8n.png"
                alt="CosGen.id Official White Logo"
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Platform SaaS Pemesanan & Kasir khusus Jasa Edit Foto Cosplay dengan visual CGI & VFX tingkat lanjut.
            </p>
          </div>

          {/* Nav Col */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Navigasi Halaman
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link href="/#portfolio" className="hover:text-white transition-colors">
                  Portofolio
                </Link>
              </li>
              <li>
                <Link href="/#compare" className="hover:text-white transition-colors">
                  Compare
                </Link>
              </li>
              <li>
                <Link href="/#pricelist" className="hover:text-white transition-colors">
                  Packet
                </Link>
              </li>
              <li>
                <Link href="/cek-status" className="hover:text-white transition-colors">
                  Cek Status
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Support Col */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Portal Akses
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link
                  href="/admin"
                  className="text-blue-400 hover:underline font-bold flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-500" /> Admin
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-white flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400" /> Live Chat Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-900 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} CosGen.id SaaS — Hak Cipta Dilindungi.</p>
          <p>Powered by Next.js 16 & Turbopack</p>
        </div>
      </div>
    </footer>
  );
}
