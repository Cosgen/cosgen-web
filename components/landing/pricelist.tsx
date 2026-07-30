"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
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
        .then(r => r.json()).then(d => {
          if (d.packages?.length) { setPackages(d.packages); try { localStorage.setItem("cosgen_pricelist_packages", JSON.stringify(d.packages)); } catch {} }
        }).catch(() => {});
    };
    load();
    window.addEventListener("cosgen_pricelist_updated", load);
    window.addEventListener("storage", load);
    return () => { window.removeEventListener("cosgen_pricelist_updated", load); window.removeEventListener("storage", load); };
  }, []);

  const active = packages.filter(p => p.isActive);

  return (
    <section id="pricelist" className="section" style={{ background: "var(--bg)" }}>
      <div className="container">

        {/* Header */}
        <div className="mb-12">
          <div className="section-tag mb-3">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
            Paket Layanan
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <h2 className="headline" style={{ fontSize: "clamp(24px,3.5vw,44px)", color: "var(--text-1)" }}>
              Pilih Paket Kamu
            </h2>
            <p className="text-[13px] max-w-sm sm:text-right" style={{ color: "var(--text-2)", fontFamily: "'Inter',sans-serif" }}>
              Semua paket sudah termasuk revisi 1x dan pengiriman file resolusi penuh
            </p>
          </div>
        </div>

        {/* CSS override for responsive grid */}
        <style>{`
          @media (max-width: 767px) {
            #pricelist-grid { grid-template-columns: 1fr !important; }
          }
          @media (min-width: 768px) and (max-width: 1023px) {
            #pricelist-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>

        {/* Cards grid */}
        <div
          id="pricelist-grid"
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${Math.min(active.length, 3)}, minmax(0, 1fr))`,
          }}
        >
          {active.map((pkg) => {
            const disc  = pkg.discountPercent || 0;
            const final = Math.round(pkg.price * (1 - disc / 100));
            const pop   = pkg.isPopular;

            return (
              <div
                key={pkg.id}
                className="relative flex flex-col"
                style={pop ? {
                  background: "linear-gradient(160deg, #2563EB 0%, #1d4ed8 100%)",
                  borderRadius: "var(--r-xl)",
                  boxShadow: "var(--shadow-blue-lg), 0 0 0 1px rgba(99,163,255,0.25)",
                  padding: "24px",
                } : {
                  background: "var(--surface)",
                  border: "1px solid var(--border-md)",
                  borderRadius: "var(--r-xl)",
                  padding: "24px",
                }}
              >
                {pop && (
                  <span className="label absolute -top-3.5 left-5" style={{ background: "var(--amber)", color: "#111", border: "none" }}>
                    ✦ Paling Diminati
                  </span>
                )}

                {disc > 0 && (
                  <span className="label w-fit mb-4" style={pop
                    ? { background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }
                    : { background: "var(--coral-dim)", color: "var(--coral)", border: "none" }
                  }>
                    -{disc}% DISKON
                  </span>
                )}

                <div className="mb-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: pop ? "rgba(255,255,255,0.5)" : "var(--text-3)", fontFamily: "'Inter',sans-serif" }}>Paket</p>
                  <h3 className="headline text-xl" style={{ color: pop ? "#fff" : "var(--text-1)" }}>{pkg.name}</h3>
                  <p className="text-[12px] mt-1.5 leading-relaxed" style={{ color: pop ? "rgba(255,255,255,0.6)" : "var(--text-2)", fontFamily: "'Inter',sans-serif" }}>{pkg.description}</p>
                </div>

                <div className="pb-5 mb-5" style={{ borderBottom: `1px solid ${pop ? "rgba(255,255,255,0.15)" : "var(--border)"}` }}>
                  {disc > 0 && (
                    <p className="text-[11px] line-through mb-0.5" style={{ color: pop ? "rgba(255,255,255,0.4)" : "var(--text-4)", fontFamily: "monospace" }}>
                      Rp {pkg.price.toLocaleString("id-ID")}
                    </p>
                  )}
                  <div className="headline text-3xl font-bold" style={{ color: pop ? "#fff" : "var(--text-1)" }}>
                    Rp {final.toLocaleString("id-ID")}
                  </div>
                  <p className="text-[11px] font-semibold mt-1" style={{ color: pop ? "rgba(255,255,255,0.65)" : "var(--blue)", fontFamily: "'Inter',sans-serif" }}>
                    {pkg.revisionLimit}
                  </p>
                </div>

                <ul className="flex-1 space-y-2.5 mb-6">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5"
                        style={pop ? { background: "rgba(255,255,255,0.2)" } : { background: "var(--blue-dim)", border: "1px solid var(--blue-border)" }}>
                        <Check className="w-2.5 h-2.5" style={{ color: pop ? "#fff" : "var(--blue)" }} />
                      </span>
                      <span className="text-[12px] leading-snug" style={{ color: pop ? "rgba(255,255,255,0.75)" : "var(--text-2)", fontFamily: "'Inter',sans-serif" }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => onSelectPackage?.(pkg.name)}
                  className="w-full btn"
                  style={pop ? {
                    background: "#fff", color: "var(--blue-dark)",
                    borderRadius: "var(--r-md)", fontFamily: "'Inter',sans-serif", minHeight: "44px",
                  } : {
                    background: "var(--blue)", color: "#fff",
                    borderRadius: "var(--r-md)", fontFamily: "'Inter',sans-serif",
                    boxShadow: "var(--shadow-blue)", minHeight: "44px",
                  }}
                >
                  Pesan {pkg.name}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-[12px] mt-8" style={{ color: "var(--text-3)", fontFamily: "'Inter',sans-serif" }}>
          Estimasi ±3 hari kerja, mengikuti antrian. Pembayaran setelah ACC.
        </p>
      </div>
    </section>
  );
}
