"use client";

import React, { useState, useEffect } from "react";
import { Ticket, Plus, Edit2, Trash2, Save, Power, CheckCircle2, Copy, Check } from "lucide-react";

export interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  maxUsage: number;
  usedCount: number;
  validUntil: string;
  isActive: boolean;
}

const INITIAL_PROMO_CODES: PromoCode[] = [
  {
    id: "p-1",
    code: "COSGENFIRST",
    discountPercent: 15,
    maxUsage: 100,
    usedCount: 42,
    validUntil: "2026-12-31",
    isActive: true,
  },
  {
    id: "p-2",
    code: "PROMOCOSPLAY20",
    discountPercent: 20,
    maxUsage: 50,
    usedCount: 18,
    validUntil: "2026-10-15",
    isActive: true,
  },
  {
    id: "p-3",
    code: "SPECIALJULY",
    discountPercent: 10,
    maxUsage: 200,
    usedCount: 195,
    validUntil: "2026-07-31",
    isActive: false,
  },
];

export default function AdminPromoCodePage() {
  const [promoList, setPromoList] = useState<PromoCode[]>(INITIAL_PROMO_CODES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(10);
  const [maxUsage, setMaxUsage] = useState(100);
  const [validUntil, setValidUntil] = useState("2026-12-31");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cosgen_promo_codes");
    if (saved) {
      try {
        setPromoList(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveToStorage = (updated: PromoCode[]) => {
    setPromoList(updated);
    localStorage.setItem("cosgen_promo_codes", JSON.stringify(updated));
  };

  const handleOpenModal = (promo?: PromoCode) => {
    if (promo) {
      setEditingPromo(promo);
      setCode(promo.code);
      setDiscountPercent(promo.discountPercent);
      setMaxUsage(promo.maxUsage);
      setValidUntil(promo.validUntil);
    } else {
      setEditingPromo(null);
      setCode("");
      setDiscountPercent(15);
      setMaxUsage(100);
      setValidUntil("2026-12-31");
    }
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedCode = code.trim().toUpperCase();

    if (editingPromo) {
      const updated = promoList.map((p) =>
        p.id === editingPromo.id
          ? {
              ...p,
              code: formattedCode,
              discountPercent: Number(discountPercent),
              maxUsage: Number(maxUsage),
              validUntil,
            }
          : p
      );
      saveToStorage(updated);
    } else {
      const newPromo: PromoCode = {
        id: `promo-${Date.now()}`,
        code: formattedCode,
        discountPercent: Number(discountPercent),
        maxUsage: Number(maxUsage),
        usedCount: 0,
        validUntil,
        isActive: true,
      };
      saveToStorage([...promoList, newPromo]);
    }
    setIsModalOpen(false);
  };

  const handleToggleActive = (id: string) => {
    const updated = promoList.map((p) =>
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    saveToStorage(updated);
  };

  const handleDelete = (id: string, promoCodeStr: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus kode promo "${promoCodeStr}"?`)) {
      const updated = promoList.filter((p) => p.id !== id);
      saveToStorage(updated);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
              Admin Portal
            </span>
            <span className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-full">
              Kode Promo & Diskon
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Kelola Kode Promo Aktif
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Buat, ubah, dan nonaktifkan kupon diskon promosi untuk digunakan pelanggan saat pemesanan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Buat Kode Promo Baru
        </button>
      </div>

      {/* Promo Code Cards / Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Daftar Kode Promo Studio</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Total Promo: {promoList.length} Voucher
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Kode Promo</th>
                <th className="px-5 py-3.5">Besar Diskon</th>
                <th className="px-5 py-3.5">Penggunaan</th>
                <th className="px-5 py-3.5">Masa Berlaku</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {promoList.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-mono font-bold text-blue-600">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                        {p.code}
                      </span>
                      <button
                        onClick={() => copyToClipboard(p.code)}
                        className="text-slate-400 hover:text-slate-700"
                        title="Salin Kode Promo"
                      >
                        {copiedCode === p.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-extrabold text-emerald-600 text-sm">
                    {p.discountPercent}% OFF
                  </td>
                  <td className="px-5 py-4 font-medium">
                    {p.usedCount} / {p.maxUsage} Terpakai
                  </td>
                  <td className="px-5 py-4 text-slate-500 font-mono">
                    s/d {p.validUntil}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleActive(p.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                        p.isActive
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-slate-200 text-slate-600 border-slate-300"
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{p.isActive ? "AKTIF" : "NONAKTIF"}</span>
                    </button>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(p)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200"
                        title="Ubah Promo"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.code)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                        title="Hapus Promo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Create/Edit Promo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-blue-600" />
                {editingPromo ? "Edit Kode Promo" : "Buat Kode Promo Baru"}
              </h3>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Kode Promo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: COSGENNEW20"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 font-mono uppercase font-bold focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Diskon (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 font-mono text-emerald-600 font-bold focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Maks Kuota Pemakaian
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={maxUsage}
                    onChange={(e) => setMaxUsage(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Berlaku Sampai Tanggal
                </label>
                <input
                  type="date"
                  required
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Simpan Kode Promo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
