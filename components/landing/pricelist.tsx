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
    const loadPackages = () => {
      const saved = localStorage.getItem("cosgen_pricelist_packages");
      if (saved) {
        try { setPackages(JSON.parse(saved)); } catch (e) { console.error(e); }
      }
      fetch(`/api/pricelist?t=${Date.now()}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (d.packages && Array.isArray(d.packages) && d.packages.length > 0) {
            setPackages(d.packages);
            localStorage.setItem("cosgen_pricelist_packages", JSON.stringify(d.packages));
          }
        })
        .catch(() => {});
    };
    loadPackages();
    window.addEventListener("cosgen_pricelist_updated", loadPackages);
    window.addEventListener("storage", loadPackages);
    return () => {
      window.removeEventListener("cosgen_pricelist_updated", loadPackages);
      window.removeEventListener("storage", loadPackages);
    };
  }, []);

  const activePackages = packages.filter((p) => p.isActive);

  return (
    <section id="pricelist" className="py-16 sm:py-24 transition-colors" style={{ background: "var(--tf-surface)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest mb-4"
            style={{ background: "var(--tf-primary-light)", color: "var(--tf-primary)" }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
            Paket Layanan
          </span>
          <h2 className="font-headline text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Pilih Paket Terbaik
          </h2>
          <p className="text-[15px] text-slate-500 dark:text-slate-400 mt-4 max-w-sm mx-auto leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Dari retouch simpel hingga full CGI cinematic. Semua paket include revisi.
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
                className={`relative flex flex-col rounded-[20px] p-6 sm:p-7 transition-all duration-300 ${
                  isPopular
                    ? "text-white scale-[1.02] z-10"
                    : "hover:-translate-y-1"
                }`}
                style={isPopular ? {
                  background: "linear-gradient(135deg, #3B82F6 0%, #4F46E5 100%)",
                  boxShadow: "0 12px 40px rgba(59,130,246,0.35), 0 0 0 2px rgba(99,102,241,0.3)",
                } : {
                  background: "var(--tf-bg)",
                  border: "1.5px solid var(--tf-border)",
                  boxShadow: "var(--tf-shadow-subtle)",
                }}
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
                  className="w-full flex items-center justify-center gap-2 rounded-[14px] font-bold text-[14px] transition-all active:scale-[0.97] tf-press"
                  style={isPopular ? {
                    background: "#fff",
                    color: "#2563EB",
                    padding: "14px 20px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    fontFamily: "'DM Sans', sans-serif",
                  } : {
                    background: "var(--tf-primary)",
                    color: "#fff",
                    padding: "14px 20px",
                    boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Pesan {pkg.name} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
