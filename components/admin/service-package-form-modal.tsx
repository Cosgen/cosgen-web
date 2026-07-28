"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Tag, DollarSign, Percent } from "lucide-react";
import { ServicePackage } from "@/app/admin/item-jasa/page";

interface ServicePackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ServicePackage | null;
  onSave: (pkgData: Partial<ServicePackage>) => void;
}

export function ServicePackageFormModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: ServicePackageFormModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [revisionLimit, setRevisionLimit] = useState("");
  const [description, setDescription] = useState("");
  const [featuresStr, setFeaturesStr] = useState("");
  const [isPopular, setIsPopular] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPrice(initialData.price || 0);
      setDiscountPercent((initialData as any).discountPercent || 0);
      setRevisionLimit(initialData.revisionLimit || "");
      setDescription(initialData.description || "");
      setFeaturesStr(initialData.features ? initialData.features.join("\n") : "");
      setIsPopular(initialData.isPopular || false);
    } else {
      setName("");
      setPrice(100000);
      setDiscountPercent(0);
      setRevisionLimit("Revisi Max 2x");
      setDescription("");
      setFeaturesStr("");
      setIsPopular(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Real-time calculated final price
  const discountAmount = Math.round(price * (discountPercent / 100));
  const finalNetPrice = Math.max(0, price - discountAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const features = featuresStr
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    onSave({
      id: initialData?.id,
      name,
      price: Number(price),
      discountPercent: Number(discountPercent),
      revisionLimit,
      description,
      features,
      isPopular,
    } as any);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            {initialData ? "Ubah Data Paket Jasa & Diskon" : "Tambah Paket Jasa Baru"}
          </h3>
          <p className="text-xs text-slate-500">
            Kelola harga dasar, tingkat diskon, dan benefit untuk paket price list.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Paket Jasa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Misal: Pertamax Turbo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Harga Awal Paket (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Diskon Paket (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 font-mono text-emerald-600 font-bold focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Real-time Calculation Box */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Hasil Akumulasi Real-Time Diskon:
            </span>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Harga Awal:</span>
              <span className="font-mono">Rp {price.toLocaleString("id-ID")}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex items-center justify-between text-xs text-red-400">
                <span>Potongan Diskon ({discountPercent}%):</span>
                <span className="font-mono">- Rp {discountAmount.toLocaleString("id-ID")}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-sm font-bold">
              <span className="text-emerald-400">Harga Akhir Setelah Diskon:</span>
              <span className="font-mono text-emerald-400 text-base">
                Rp {finalNetPrice.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Batas Kuantitas Revisi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Misal: Revisi Max 3x"
              value={revisionLimit}
              onChange={(e) => setRevisionLimit(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Deskripsi Singkat Paket
            </label>
            <input
              type="text"
              placeholder="Penjelasan singkat manfaat utama..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Daftar Feature / Benefit (Satu per baris)
            </label>
            <textarea
              rows={3}
              placeholder="Blending Lighting Professional&#10;Efek Aura Sihir 3D&#10;High-Res Output 4K"
              value={featuresStr}
              onChange={(e) => setFeaturesStr(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600/20 focus:outline-none font-sans"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPopular"
              checked={isPopular}
              onChange={(e) => setIsPopular(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="isPopular" className="font-semibold text-slate-800 cursor-pointer">
              Tandai Sebagai "Paling Diminati" (Popular Badge)
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Simpan Data Paket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
