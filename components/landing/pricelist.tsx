"use client";

import React, { useState, useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import { ServicePackage, INITIAL_PACKAGES } from "@/app/admin/item-jasa/page";

interface PricelistSectionProps {
  onSelectPackage?: (pkgName: string) => void;
}

export function PricelistSection({ onSelectPackage }: PricelistSectionProps) {
  const [packages, setPackages] = useState<ServicePackage[]>(INITIAL_PACKAGES);

  useEffect(() => {
    const saved = localStorage.getItem("cosgen_pricelist_packages");
    if (saved) {
      try { setPackages(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const activePackages = packages.filter((p) => p.isActive);

  return (
    <section id="pricelist" className="py-16 sm:py-20 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.18em] mb-3">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Paket Layanan
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Pilih Paket Terbaik Kamu
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
            Mulai dari retouch simpel hingga full compositing CGI sinematik. Semua paket garansi revisi.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {activePackages.map((pkg) => {
            const discountPct = pkg.discountPercent || 0;
            const finalPrice = Math.max(0, Math.round(pkg.price * (1 - discountPct / 100)));
            const isPopular = pkg.isPopular;

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col rounded-3xl p-7 transition-all duration-300 ${
                  isPopular
                    ? "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-2xl shadow-blue-600/30 ring-2 ring-blue-400/50 scale-[1.02] z-10"
                    : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-amber-400 text-slate-900 text-[10px] font-black rounded-full uppercase tracking-wide shadow-lg">
                      ✦ Paling Diminati
                    </span>
                  </div>
                )}

                {/* Discount tag */}
                {discountPct > 0 && (
                  <span className={`absolute top-5 right-5 px-2 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wide ${
                    isPopular ? "bg-white/20 text-white" : "bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400"
                  }`}>
                    -{discountPct}%
                  </span>
                )}

                {/* Package name */}
                <div className="mb-5">
                  <p className={`text-[10px] font-black uppercase tracking-[0.15em] mb-1 ${
                    isPopular ? "text-blue-200" : "text-blue-600 dark:text-blue-400"
                  }`}>
                    Paket
                  </p>
                  <h3 className={`text-2xl font-black tracking-tight ${isPopular ? "text-white" : "text-slate-900 dark:text-white"}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-[12px] mt-1.5 leading-relaxed ${isPopular ? "text-blue-100" : "text-slate-500 dark:text-slate-400"}`}>
                    {pkg.description}
                  </p>
                </div>

                {/* Price */}
                <div className={`pb-5 mb-5 border-b ${isPopular ? "border-white/20" : "border-slate-200 dark:border-slate-700"}`}>
                  {discountPct > 0 && (
                    <p className={`text-[11px] font-mono line-through ${isPopular ? "text-blue-200" : "text-slate-400"}`}>
                      Rp {pkg.price.toLocaleString("id-ID")}
                    </p>
                  )}
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className={`text-3xl font-black font-mono tracking-tight ${isPopular ? "text-white" : "text-slate-900 dark:text-white"}`}>
                      Rp {finalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <span className={`text-[11px] font-semibold mt-1 block ${isPopular ? "text-blue-200" : "text-blue-600 dark:text-blue-400"}`}>
                    {pkg.revisionLimit}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 flex-1 mb-7">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isPopular ? "bg-white/20" : "bg-blue-100 dark:bg-blue-950"
                      }`}>
                        <Check className={`w-2.5 h-2.5 ${isPopular ? "text-white" : "text-blue-600 dark:text-blue-400"}`} />
                      </span>
                      <span className={`text-[12px] leading-snug ${isPopular ? "text-blue-50" : "text-slate-600 dark:text-slate-300"}`}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  type="button"
                  onClick={() => onSelectPackage && onSelectPackage(pkg.name)}
                  className={`w-full py-3 rounded-2xl text-[12px] font-black transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${
                    isPopular
                      ? "bg-white text-blue-700 hover:bg-blue-50 shadow-xl"
                      : "bg-slate-900 dark:bg-blue-600 text-white hover:bg-slate-800 dark:hover:bg-blue-500 shadow-md"
                  }`}
                >
                  Mulai dengan {pkg.name} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
