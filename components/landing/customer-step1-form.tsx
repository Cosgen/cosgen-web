"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, ArrowRight, Tag } from "lucide-react";
import { ServicePackage, INITIAL_PACKAGES } from "@/app/admin/item-jasa/page";

interface CustomerStep1FormProps {
  selectedPackage?: string;
  setSelectedPackage?: (val: string) => void;
  nickname: string;
  setNickname: (val: string) => void;
  whatsapp: string;
  setWhatsapp: (val: string) => void;
  instagram: string;
  setInstagram: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CustomerStep1Form({
  selectedPackage = "Pertamax",
  setSelectedPackage,
  nickname,
  setNickname,
  whatsapp,
  setWhatsapp,
  instagram,
  setInstagram,
  onNext,
  onBack,
}: CustomerStep1FormProps) {
  const [packages, setPackages] = useState<ServicePackage[]>(INITIAL_PACKAGES);

  useEffect(() => {
    const loadPackages = () => {
      const saved = localStorage.getItem("cosgen_pricelist_packages");
      if (saved) {
        try {
          setPackages(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return alert("Harap isi Nama Panggilan.");
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3 font-sans text-[11px]">
      <div className="space-y-1">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 tracking-tight">
            <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Tahap 1: Data Identitas Pelanggan
          </h3>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400">
          Pilih paket jasa yang diinginkan dan isi data kontak Anda.
        </p>
      </div>

      <div className="space-y-2.5">
        {/* Interactive Package Selector */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5 flex items-center gap-1">
            <Tag className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Pilih Paket Jasa <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedPackage}
            onChange={(e) => setSelectedPackage && setSelectedPackage(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-bold focus:ring-2 focus:ring-blue-600/20 focus:outline-none bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            {activePackages.map((pkg) => {
              const discountPct = pkg.discountPercent || 0;
              const finalPrice = discountPct > 0 ? pkg.price * (1 - discountPct / 100) : pkg.price;
              return (
                <option key={pkg.id} value={pkg.name}>
                  Paket {pkg.name} — Rp {finalPrice.toLocaleString("id-ID")} {discountPct > 0 ? `(Diskon ${discountPct}%)` : ""}
                </option>
              );
            })}
          </select>
        </div>

        {/* Nickname Input */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Nama Panggilan <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="Misal: Aria Pratama"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] focus:ring-2 focus:ring-blue-600/20 focus:outline-none bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* WhatsApp Input */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Nomor WhatsApp <span className="text-slate-400 dark:text-slate-500 font-normal">(Opsional)</span>
          </label>
          <div className="relative">
            <Phone className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              placeholder="085183016367"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] focus:ring-2 focus:ring-blue-600/20 focus:outline-none bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Instagram Input */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
            Username Instagram <span className="text-slate-400 dark:text-slate-500 font-normal">(Opsional)</span>
          </label>
          <div className="relative">
            <svg
              className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <input
              type="text"
              placeholder="@aria_cosplay"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] focus:ring-2 focus:ring-blue-600/20 focus:outline-none bg-slate-50/50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="w-fit px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Batal
        </button>
        <button
          type="submit"
          className="w-fit px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold shadow-xs flex items-center gap-1"
        >
          <span>Lanjut ke Tahap 2</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </form>
  );
}
