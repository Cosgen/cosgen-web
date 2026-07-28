"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  UploadCloud,
  FileImage,
  X,
  ArrowLeft,
  Tag,
  Layers,
  Folder,
  DollarSign,
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
  uploadedFiles: { name: string; size: string }[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<{ name: string; size: string }[]>>;
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
  uploadedFiles,
  setUploadedFiles,
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (uploadedFiles.length + files.length > 6) {
      alert("Maksimal 6 file foto referensi.");
      return;
    }
    const newFileObjs = files.map((f) => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
    }));
    setUploadedFiles([...uploadedFiles, ...newFileObjs]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={onSubmit} className="max-w-lg mx-auto space-y-3 font-sans text-[11px]">
      <div className="space-y-0.5">
        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 tracking-tight">
          <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Tahap 2: Detail Pesanan & Unggah Referensi
        </h3>
        <p className="text-[10px] text-slate-500 dark:text-slate-400">
          Isi brief detail per karakter, unggah foto referensi, dan periksa ringkasan harga.
        </p>
      </div>

      {/* Dynamic Group Inputs (Compact Height) */}
      <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
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

      {/* Link GDrive File */}
      <div>
        <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5 flex items-center gap-1">
          <Folder className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Link GDrive Foto Mentah <span className="text-slate-400 dark:text-slate-500 font-normal">(Opsional)</span>
        </label>
        <input
          type="url"
          placeholder="https://drive.google.com/..."
          value={customerGdriveUrl}
          onChange={(e) => setCustomerGdriveUrl && setCustomerGdriveUrl(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[11px] focus:ring-2 focus:ring-blue-600/20 focus:outline-none font-mono placeholder-slate-400"
        />
      </div>

      {/* File Upload Section */}
      <div className="space-y-1">
        <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300">
          Unggah Foto Referensi <span className="text-slate-400 dark:text-slate-500 font-normal">(Maks 6 File)</span>
        </label>
        <div className="border border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg p-2 text-center cursor-pointer transition-colors relative">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <UploadCloud className="w-4 h-4 text-blue-600 dark:text-blue-400 mx-auto mb-0.5" />
          <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Klik atau seret file foto ke sini</p>
        </div>

        {/* Uploaded List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-0.5 pt-0.5">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-1 bg-slate-100/80 dark:bg-slate-800 rounded text-[10px]">
                <div className="flex items-center gap-1 overflow-hidden">
                  <FileImage className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="truncate font-medium text-slate-700 dark:text-slate-300">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="w-fit text-red-500 hover:text-red-700 dark:text-red-400 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Promo Code Input */}
      <div>
        <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5 flex items-center gap-1">
          <Tag className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Kode Promo <span className="text-slate-400 dark:text-slate-500 font-normal">(Opsional)</span>
        </label>
        <input
          type="text"
          placeholder="Masukkan Kode Promo"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="w-full sm:max-w-xs px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[11px] focus:ring-2 focus:ring-blue-600/20 focus:outline-none uppercase font-mono font-bold placeholder-slate-400"
        />
        {isPromoApplied && (
          <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
            <Check className="w-2.5 h-2.5" /> Diskon promo tambahan +15% terpasang!
          </p>
        )}
      </div>

      {/* Ringkasan Paket & Harga Box */}
      <div className="p-2.5 bg-slate-900 dark:bg-slate-950 text-white rounded-lg space-y-1.5 shadow-xs border border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-400" /> Ringkasan Paket & Harga
          </span>
          <span className="px-2 py-0.5 bg-blue-600 text-white font-extrabold text-[9px] rounded-full">
            Paket {selectedPackage}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-300">Harga Dasar Paket ({selectedPackage}):</span>
          <span className="font-mono font-bold">Rp {basePrice.toLocaleString("id-ID")}</span>
        </div>

        {totalDiscountPct > 0 && (
          <div className="flex items-center justify-between text-[11px] text-red-400 font-semibold">
            <span>Potongan Diskon ({totalDiscountPct}%):</span>
            <span className="font-mono">- Rp {discountAmount.toLocaleString("id-ID")}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-slate-800 font-bold text-[11px]">
          <span className="text-emerald-400">Total Pembayaran:</span>
          <span className="font-mono text-emerald-400 text-xs">
            Rp {finalPrice.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="w-fit px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-3 h-3 inline mr-0.5" /> Kembali
        </button>
        <button
          type="submit"
          className="w-fit px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold shadow-xs flex items-center gap-1"
        >
          Submit <Sparkles className="w-3 h-3" />
        </button>
      </div>
    </form>
  );
}
