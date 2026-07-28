"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  UploadCloud,
  FileImage,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Search,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";

interface OrderGroup {
  id: string;
  characterName: string;
  brief: string;
  photoCount: number;
}

export default function OrderFormPage() {
  const [step, setStep] = useState<number>(0);

  // Form State
  const [selectedPackage, setSelectedPackage] = useState("Pertamax");
  const [tcAgreed, setTcAgreed] = useState(false);
  const [nickname, setNickname] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");

  // Dynamic Group Inputs
  const [orderGroups, setOrderGroups] = useState<OrderGroup[]>([
    { id: "g-1", characterName: "", brief: "", photoCount: 1 },
  ]);

  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [reqCode, setReqCode] = useState("");

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

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    setReqCode(`REQ-${randomDigits}`);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      <LandingNavbar />

      <main className="max-w-3xl mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
          {/* Header */}
          <div className="border-b border-slate-100 pb-4 text-center">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-200">
              Formulir Order Resmi
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
              Form Pemesanan CosGen.id
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Sisa Slot Bulan Ini: <strong className="text-blue-600">8 / 25 Tersedia</strong>
            </p>
          </div>

          {/* STEP 0: T&C */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">1. Persetujuan Syarat & Ketentuan</h2>
                  <p className="text-xs text-slate-500">Batas toleransi hasil & estimasi pengerjaan ±3 hari kerja.</p>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-3 leading-relaxed">
                <p>
                  <strong>1. Briefing & Foto Referensi:</strong> Customer wajib mengisi brief dan/atau melampirkan foto referensi seakurat mungkin. CosGen.id tidak bertanggung jawab atas ketidaksesuaian apabila brief kurang jelas.
                </p>
                <p>
                  <strong>2. Estimasi Waktu:</strong> Estimasi ±3 hari kerja setelah pesanan disetujui Admin.
                </p>
                <p>
                  <strong>3. Pembayaran via Midtrans:</strong> Pembayaran terkunci hingga Admin klik Konfirmasi ACC.
                </p>
                <p>
                  <strong>4. Hapus Foto Referensi:</strong> Foto referensi di Cloudinary akan terhapus otomatis 2x24 jam setelah Selesai.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <input
                  type="checkbox"
                  id="page-tc-agree"
                  checked={tcAgreed}
                  onChange={(e) => setTcAgreed(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="page-tc-agree" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  Saya menyetujui seluruh Syarat & Ketentuan di atas.
                </label>
              </div>

              <button
                onClick={() => {
                  if (!tcAgreed) {
                    alert("Harap centang persetujuan Syarat & Ketentuan terlebih dahulu.");
                    return;
                  }
                  setStep(1);
                }}
                className={`w-full py-3.5 rounded-xl text-xs font-bold text-white transition-all ${
                  tcAgreed ? "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20" : "bg-slate-300 cursor-not-allowed"
                }`}
              >
                Lanjut ke Tahap 1 (Data Pelanggan)
              </button>
            </div>
          )}

          {/* STEP 1: Data Pelanggan */}
          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!nickname.trim()) return alert("Harap isi Nama Panggilan.");
                setStep(2);
              }}
              className="space-y-5"
            >
              <h2 className="text-lg font-bold text-slate-900">Tahap 1: Data Pelanggan</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Panggilan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Aria"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="085183016367"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username Instagram <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="@aria_cosplay"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Lanjut ke Tahap 2
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Detail Pesanan */}
          {step === 2 && (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Tahap 2: Detail Pesanan & Referensi</h2>

              {orderGroups.map((group, index) => (
                <div key={group.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 uppercase">Karakter #{index + 1}</span>
                    {orderGroups.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOrderGroup(group.id)}
                        className="text-red-500 text-xs font-semibold"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Nama Karakter & Anime / Game"
                    value={group.characterName}
                    onChange={(e) => updateOrderGroup(group.id, "characterName", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                  <textarea
                    rows={2}
                    required
                    placeholder="Brief detail (efek aura, background, warna...)"
                    value={group.brief}
                    onChange={(e) => updateOrderGroup(group.id, "brief", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addOrderGroup}
                className="w-full py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" /> Tambah Kelompok Input Karakter
              </button>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Upload Foto Referensi (Maks 6)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Submit Pesanan
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: REQ Code Display */}
          {step === 3 && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Pesanan Berhasil Disimpan!</h2>
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-xs uppercase font-bold text-slate-400">Kode Order Sementara:</span>
                <div className="text-3xl font-mono font-extrabold text-blue-400">{reqCode}</div>
                <p className="text-xs text-slate-400">Status: Menunggu Konfirmasi Admin</p>
              </div>
              <Link
                href="/cek-status"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
              >
                <Search className="w-4 h-4" /> Cek Status Pesanan
              </Link>
            </div>
          )}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
