"use client";

import React, { useState, useEffect } from "react";
import { Check, Sparkles, Zap } from "lucide-react";
import { ServicePackage, INITIAL_PACKAGES } from "@/app/admin/item-jasa/page";

interface PricelistSectionProps {
  onSelectPackage?: (pkgName: string) => void;
}

export function PricelistSection({ onSelectPackage }: PricelistSectionProps) {
  const [packages, setPackages] = useState<ServicePackage[]>(INITIAL_PACKAGES);

  useEffect(() => {
    const saved = localStorage.getItem("cosgen_pricelist_packages");
    if (saved) {
      try {
        setPackages(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const activePackages = packages.filter((p) => p.isActive);

  return (
    <section id="pricelist" className="py-10 sm:py-14 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 font-sans text-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pilihan Paket Edit Cosplay
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Dapatkan garansi revisi memuaskan dan manipulasi CGI tingkat tinggi.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {activePackages.map((pkg) => {
            const discountPct = pkg.discountPercent || 0;
            const discountAmount = Math.round(pkg.price * (discountPct / 100));
            const finalPrice = Math.max(0, pkg.price - discountAmount);

            return (
              <div
                key={pkg.id}
                className={`rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative ${
                  pkg.isPopular
                    ? "bg-slate-900 dark:bg-slate-900 text-white shadow-lg border-2 border-blue-500"
                    : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md"
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-2.5 py-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-extrabold rounded-full shadow-xs flex items-center gap-1 uppercase tracking-wider">
                      <Sparkles className="w-2.5 h-2.5" /> Paling Diminati
                    </span>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-black ${pkg.isPopular ? "text-white" : "text-slate-900 dark:text-white"}`}>
                      {pkg.name}
                    </h3>
                    {discountPct > 0 && (
                      <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-extrabold rounded-md shadow-xs">
                        Diskon {discountPct}%
                      </span>
                    )}
                  </div>

                  <p className={`text-[11px] leading-relaxed ${pkg.isPopular ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>
                    {pkg.description}
                  </p>

                  {/* Price Display */}
                  <div className="border-t border-b py-2.5 border-slate-200/40 dark:border-slate-800 space-y-0.5">
                    {discountPct > 0 && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through font-mono block">
                        Rp {pkg.price.toLocaleString("id-ID")}
                      </span>
                    )}
                    <span className="text-xl sm:text-2xl font-mono font-extrabold tracking-tight block">
                      Rp {finalPrice.toLocaleString("id-ID")}
                    </span>
                    <span className={`text-[11px] font-semibold block ${pkg.isPopular ? "text-blue-400" : "text-blue-600 dark:text-blue-400"}`}>
                      ✓ {pkg.revisionLimit}
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-1.5 text-[11px]">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <div className={`p-0.5 rounded-full mt-0.5 shrink-0 ${pkg.isPopular ? "bg-blue-500 text-white" : "bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400"}`}>
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className={pkg.isPopular ? "text-slate-200" : "text-slate-700 dark:text-slate-300"}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => onSelectPackage && onSelectPackage(pkg.name)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                      pkg.isPopular
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30"
                        : "bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" /> Pesan Paket {pkg.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
