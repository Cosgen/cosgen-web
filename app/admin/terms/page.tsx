"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, ShieldCheck, FileText, CheckCircle2, RefreshCw } from "lucide-react";

const DEFAULT_TERMS_TEXT = `1. Ketentuan Brief & Referensi
Customer wajib mengisi brief dan/atau melampirkan foto referensi seakurat mungkin. CosGen.id tidak bertanggung jawab atas hasil yang tidak sesuai ekspektasi apabila brief/referensi yang diberikan kurang jelas.

2. Estimasi Waktu Pengerjaan
Estimasi waktu pengerjaan ±3 hari kerja efektif setelah pesanan disetujui (ACC) oleh Admin dan masuk ke antrian resmi (ORD-XXXX). Waktu dapat berubah tergantung tingkat kesulitan dan antrian berjalan.

3. Sistem Pembayaran & Pembayaran Terkunci
Pembayaran dilakukan resmi via Midtrans Snap. Tombol "Bayar Sekarang" akan terkunci (disabled) selama status masih "Review" dan baru aktif setelah Admin menekan tombol "Konfirmasi ACC".

4. Penghapusan Data Otomatis
Foto referensi yang diunggah pelanggan ke Cloudinary akan dihapus secara permanen 2x24 jam (48 jam) setelah status pesanan berubah menjadi Selesai.`;

export default function AdminTermsEditorPage() {
  const [termsContent, setTermsContent] = useState<string>(DEFAULT_TERMS_TEXT);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedText = localStorage.getItem("cosgen_terms_conditions");
    if (savedText) {
      setTermsContent(savedText);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("cosgen_terms_conditions", termsContent);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetDefault = () => {
    setTermsContent(DEFAULT_TERMS_TEXT);
    localStorage.removeItem("cosgen_terms_conditions");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <Link
            href="/admin/pesanan"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Panel Admin
          </Link>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 font-medium text-xs rounded-full">
            Editor Syarat & Ketentuan (T&C)
          </span>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">
                  Pengaturan Teks Syarat & Ketentuan
                </h1>
                <p className="text-xs text-slate-500">
                  Perubahan teks di sini akan langsung tampil pada modal T&C di form pemesanan pelanggan.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetDefault}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset ke Default
            </button>
          </div>

          {/* Success Banner */}
          {isSaved && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Teks Syarat & Ketentuan Berhasil Diperbarui & Disimpan!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" /> Isi Teks Syarat & Ketentuan (Markdown / Plain Text)
              </label>
              <textarea
                rows={12}
                required
                value={termsContent}
                onChange={(e) => setTermsContent(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-200 font-sans text-xs text-slate-800 leading-relaxed focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <p className="text-[11px] text-slate-400">
                Terakhir disunting oleh Admin • Auto-sync ke Form Customer
              </p>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Simpan Perubahan T&C
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
