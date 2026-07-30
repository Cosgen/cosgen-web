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
    const load = () => {
      const saved = localStorage.getItem("cosgen_pricelist_packages");
      if (saved) { try { setPackages(JSON.parse(saved)); } catch {} }
      fetch(`/api/pricelist?t=${Date.now()}`, { cache: "no-store" })
        .then(r => r.json())
        .then(d => {
          if (d.packages?.length) {
            setPackages(d.packages);
            localStorage.setItem("cosgen_pricelist_packages", JSON.stringify(d.packages));
          }
        }).catch(() => {});
    };
    load();
    window.addEventListener("cosgen_pricelist_updated", load);
    window.addEventListener("storage", load);
    return () => { window.removeEventListener("cosgen_pricelist_updated", load); window.removeEventListener("storage", load); };
  }, []);

  const activePackages = packages.filter(p => p.isActive);

  return (
    <section id="pricelist" className="py-16 sm:py-24" style={{ background: "var(--tf-bg)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <div className="tf-section-label mb-5 inline-flex">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
            Paket Layanan
          </div>
          <h2
            className="font-headline font-black tracking-tight mb-4"
            style={{ fontSize: "clamp(28px,4.5vw,52px)", color: "var(--tf-text-primary)" }}
          >
            Pilih Paket Terbaik
          </h2>
          <p className="text-[15px] leading-relaxed max-w-md mx-auto" style={{ color: "var(--tf-text-secondary)", fontFamily: "'DM Sans',sans-serif" }}>
            Dari retouch simpel hingga full CGI cinematic. Semua paket termasuk revisi.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {activePackages.map(pkg => {
            const discount = pkg.discountPercent || 0;
            const finalPrice = Math.max(0, Math.round(pkg.price * (1 - discount / 100)));
            const isPopular = pkg.isPopular;

            return (
              <div
                key={pkg.id}
                className="relative flex flex-col rounded-[20px] p-6 sm:p-7 transition-all duration-300"
                style={isPopular ? {
                  background: "linear-gradient(135deg, #2563EB 0%, #4338CA 100%)",
                  boxShadow: "0 16px 48px rgba(59,130,246,0.4), 0 0 0 1px rgba(99,102,241,0.4)",
                  transform: "scale(1.02)",
                  zIndex: 10,
                } : {
                  background: "var(--tf-surface)",
                  border: "1.5px solid var(--tf-border)",
                  boxShadow: "var(--tf-shadow-sm)",
                }}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-[#FBBF24] text-slate-900 text-[10px] font-black rounded-full uppercase tracking-wide shadow-lg">
                      ✦ Paling Diminati
                    </span>
                  </div>
                )}

                {/* Discount tag */}
                {discount > 0 && (
                  <span
                    className="absolute top-5 right-5 px-2.5 py-1 text-[10px] font-black rounded-lg uppercase"
                    style={isPopular
                      ? { background: "rgba(255,255,255,0.2)", color: "#fff" }
                      : { background: "var(--tf-coral-dim)", color: "var(--tf-coral)" }
                    }
                  >
                    -{discount}%
                  </span>
                )}

                {/* Name */}
                <div className="mb-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-1"
                    style={{ color: isPopular ? "rgba(255,255,255,0.6)" : "var(--tf-primary)" }}
                  >Paket</p>
                  <h3 className="font-headline text-2xl font-black"
                    style={{ color: isPopular ? "#fff" : "var(--tf-text-primary)" }}
                  >{pkg.name}</h3>
                  <p className="text-[13px] mt-1.5 leading-relaxed"
                    style={{ color: isPopular ? "rgba(255,255,255,0.65)" : "var(--tf-text-secondary)", fontFamily: "'DM Sans',sans-serif" }}
                  >{pkg.description}</p>
                </div>

                {/* Price */}
                <div className="pb-5 mb-5" style={{ borderBottom: `1px solid ${isPopular ? "rgba(255,255,255,0.15)" : "var(--tf-border)"}` }}>
                  {discount > 0 && (
                    <p className="text-[11px] font-mono line-through mb-0.5"
                      style={{ color: isPopular ? "rgba(255,255,255,0.4)" : "var(--tf-text-muted)" }}
                    >Rp {pkg.price.toLocaleString("id-ID")}</p>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black font-mono tracking-tight"
                      style={{ color: isPopular ? "#fff" : "var(--tf-text-primary)" }}
                    >Rp {finalPrice.toLocaleString("id-ID")}</span>
                  </div>
                  <span className="text-[11px] font-semibold mt-1 block"
                    style={{ color: isPopular ? "rgba(255,255,255,0.7)" : "var(--tf-primary)" }}
                  >{pkg.revisionLimit}</span>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 flex-1 mb-7">
                  {pkg.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span
                        className="w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={isPopular
                          ? { background: "rgba(255,255,255,0.2)" }
                          : { background: "var(--tf-primary-dim)", border: "1px solid var(--tf-primary-border)" }
                        }
                      >
                        <Check className="w-2.5 h-2.5" style={{ color: isPopular ? "#fff" : "var(--tf-primary)" }} />
                      </span>
                      <span className="text-[12px] leading-snug"
                        style={{ color: isPopular ? "rgba(255,255,255,0.8)" : "var(--tf-text-secondary)", fontFamily: "'DM Sans',sans-serif" }}
                      >{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  type="button"
                  onClick={() => onSelectPackage?.(pkg.name)}
                  className="w-full flex items-center justify-center gap-2 rounded-[14px] font-bold text-[14px] tf-press"
                  style={isPopular ? {
                    background: "#fff",
                    color: "#2563EB",
                    padding: "14px 20px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    fontFamily: "'DM Sans',sans-serif",
                  } : {
                    background: "var(--tf-primary)",
                    color: "#fff",
                    padding: "14px 20px",
                    boxShadow: "var(--tf-shadow-blue)",
                    fontFamily: "'DM Sans',sans-serif",
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
