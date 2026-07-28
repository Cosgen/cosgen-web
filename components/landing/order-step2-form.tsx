"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Tag,
  Folder,
  Check,
} from "lucide-react";
import { ServicePackage, INITIAL_PACKAGES } from "@/app/admin/item-jasa/page";

export interface OrderGroup {
  id: string;
  characterName: string;
  brief: string;
  photoCount: number;
}

interface OrderStep2FormProps {
  selectedPackage?: string;
  orderGroups: OrderGroup[];
  setOrderGroups: React.Dispatch<React.SetStateAction<OrderGroup[]>>;
  uploadedFiles?: { name: string; size: string }[];
  setUploadedFiles?: React.Dispatch<React.SetStateAction<{ name: string; size: string }[]>>;
  customerGdriveUrl?: string;
  setCustomerGdriveUrl?: (val: string) => void;
  promoCode: string;
  setPromoCode: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function OrderStep2Form({
  selectedPackage = "Pertamax",
  orderGroups,
  setOrderGroups,
  customerGdriveUrl = "",
  setCustomerGdriveUrl,
  promoCode,
  setPromoCode,
  onSubmit,
  onBack,
}: OrderStep2FormProps) {
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

  const pkgData = packages.find((p) => p.name === selectedPackage) || packages[1];
  const basePrice = pkgData?.price || 650000;
  const adminDiscountPct = pkgData?.discountPercent || 0;

  const isPromoApplied = promoCode.trim().toUpperCase() === "COSGENFIRST";
  const promoDiscountPct = isPromoApplied ? 15 : 0;
  const totalDiscountPct = Math.min(100, adminDiscountPct + promoDiscountPct);

  const discountAmount = Math.round(basePrice * (totalDiscountPct / 100));
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const addOrderGroup = () => {
    setOrderGroups([
      ...orderGroups,
      { id: `g-${Date.now()}`, characterName: "", brief: "", photoCount: 1 },
    ]);
  };

  const removeOrderGroup = (id: string) => {
    if (orderGroups.length === 1) return;
    setOrderGroups(orderGroups.filter((g) => g.id !== id));
  };

  const updateOrderGroup = (id: string, field: keyof OrderGroup, value: any) => {
    setOrderGroups(
      orderGroups.map((g) => (g.id === id ? { ...g, [field]: value } : g))
    );
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 font-sans text-xs">
      <div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Detail Order & Link Foto
          </h3>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400">
          Isi brief detail per karakter dan berikan 1 link Google Drive berisi foto mentah & referensi.
        </p>
      </div>

      {/* Dynamic Group Inputs */}
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {orderGroups.map((group, index) => (
          <div
            key={group.id}
            className="p-2.5 bg-slate-50/70 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-700 space-y-2 relative"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Kelompok Karakter #{index + 1}
              </span>
              {orderGroups.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOrderGroup(group.id)}
                  className="w-fit text-red-500 hover:text-red-700 dark:text-red-400 p-0.5 text-[10px] font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Hapus
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                  Nama Karakter & Anime / Game <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Raiden Shogun (Genshin)"
                  value={group.characterName}
                  onChange={(e) => updateOrderGroup(group.id, "characterName", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[11px] focus:ring-2 focus:ring-blue-600/20 focus:outline-none placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                  Jumlah Foto
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={group.photoCount}
                  onChange={(e) => updateOrderGroup(group.id, "photoCount", Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[11px] focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Deskripsi Brief / Keinginan Edit <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={1}
                required
                placeholder="Nuansa warna, efek aura, background..."
                value={group.brief}
                onChange={(e) => updateOrderGroup(group.id, "brief", e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[11px] focus:ring-2 focus:ring-blue-600/20 focus:outline-none placeholder-slate-400"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Group Button '+' */}
      <button
        type="button"
        onClick={addOrderGroup}
        className="w-full py-1.5 bg-blue-50/80 dark:bg-slate-800/80 hover:bg-blue-100/80 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-slate-700 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
      >
        <Plus className="w-3 h-3" /> Tambah Kelompok Karakter / Brief Lainnya (+)
      </button>

      {/* Single Google Drive Link Input (Replacing Individual File Upload) */}
      <div className="space-y-1 bg-blue-50/60 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-200/80 dark:border-blue-900">
        <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Folder className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>Link Google Drive (Foto Mentah & Referensi)</span>
          <span className="text-red-500">*</span>
        </label>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
          Masukkan 1 link Google Drive yang berisi foto mentah yang akan diedit + foto referensi kamu (pastikan akses folder diset ke <strong>"Siapa saja yang memiliki link"</strong>).
        </p>
        <input
          type="url"
          required
          placeholder="https://drive.google.com/drive/folders/..."
          value={customerGdriveUrl}
          onChange={(e) => setCustomerGdriveUrl && setCustomerGdriveUrl(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[11px] focus:ring-2 focus:ring-blue-600/20 focus:outline-none font-mono placeholder-slate-400 mt-1"
        />
      </div>

      {/* Promo Code Input */}
      <div>
        <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5 flex items-center gap-1">
          <Tag className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Kode Promo <span className="text-slate-400 dark:text-slate-500 font-normal">(Diskon Tambahan)</span>
        </label>
        <div className="flex gap-1.5">
          <input
            type="text"
            placeholder=""
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[11px] focus:ring-2 focus:ring-blue-600/20 focus:outline-none uppercase font-mono placeholder-slate-400"
          />
          {isPromoApplied && (
            <span className="px-2 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-md text-[10px] font-bold flex items-center gap-1">
              <Check className="w-3 h-3" /> Diskon 15%
            </span>
          )}
        </div>
      </div>

      {/* Summary Box */}
      <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1 shadow-md">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Paket: {selectedPackage}</span>
          <span className="font-mono text-slate-300 line-through text-[10px]">
            {totalDiscountPct > 0 ? `Rp ${basePrice.toLocaleString("id-ID")}` : ""}
          </span>
        </div>
        <div className="flex items-center justify-between font-bold text-sm">
          <span>Total Estimasi Biaya</span>
          <span className="text-blue-400 font-mono text-base">
            Rp {finalPrice.toLocaleString("id-ID")}
          </span>
        </div>
        {totalDiscountPct > 0 && (
          <span className="text-[9px] text-emerald-400 block text-right font-medium">
            ✓ Total Hemat {totalDiscountPct}% (Rp {discountAmount.toLocaleString("id-ID")})
          </span>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold text-[11px] transition-colors"
        >
          Kembali
        </button>
        <button
          type="submit"
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[11px] shadow-md shadow-blue-600/20 transition-all hover:scale-[1.01]"
        >
          Kirim Order & Dapatkan Kode REQ
        </button>
      </div>
    </form>
  );
}
