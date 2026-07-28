"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, X, Check } from "lucide-react";

interface TermsConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const DEFAULT_TERMS_TEXT = `1. Ketentuan Brief & Referensi
Customer wajib mengisi brief dan/atau melampirkan foto referensi seakurat mungkin. CosGen.id tidak bertanggung jawab atas hasil yang tidak sesuai ekspektasi apabila brief/referensi yang diberikan kurang jelas.

2. Estimasi Waktu Pengerjaan
Estimasi waktu pengerjaan ±3 hari kerja efektif setelah pesanan disetujui (ACC) oleh Admin dan masuk ke antrian resmi (ORD-XXXX). Waktu dapat berubah tergantung tingkat kesulitan dan antrian berjalan.

3. Sistem Pembayaran & Pembayaran Terkunci
Pembayaran dilakukan resmi via Midtrans Snap. Tombol "Bayar Sekarang" akan terkunci (disabled) selama status masih "Review" dan baru aktif setelah Admin menekan tombol "Konfirmasi ACC".

4. Penghapusan Data Otomatis
Foto referensi yang diunggah pelanggan ke Cloudinary akan dihapus secara permanen 2x24 jam (48 jam) setelah status pesanan berubah menjadi Selesai.`;

export function TermsConditionsModal({
  isOpen,
  onClose,
  onAgree,
}: TermsConditionsModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [tcText, setTcText] = useState(DEFAULT_TERMS_TEXT);

  useEffect(() => {
    const savedText = localStorage.getItem("cosgen_terms_conditions");
    if (savedText) {
      setTcText(savedText);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans text-xs">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl max-w-lg w-full p-4 sm:p-5 space-y-4 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="p-2 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Syarat & Ketentuan Pemesanan (T&C)
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              CosGen.id Creative Studio SaaS Platform (Terbaru)
            </p>
          </div>
        </div>

        {/* Terms Content Box */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line font-sans">
          {tcText}
        </div>

        {/* Checkbox Agreement */}
        <div className="flex items-center gap-2.5 bg-blue-50 dark:bg-slate-800/60 p-3 rounded-xl border border-blue-100 dark:border-slate-700">
          <input
            type="checkbox"
            id="standalone-tc-agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-3.5 h-3.5 text-blue-600 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="standalone-tc-agree" className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
            Saya telah membaca dan menyetujui seluruh Syarat & Ketentuan di atas.
          </label>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-fit px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              if (!agreed) {
                alert("Harap centang persetujuan Syarat & Ketentuan terlebih dahulu.");
                return;
              }
              onAgree();
            }}
            className={`w-fit px-5 py-2 rounded-xl text-xs font-bold text-white transition-all ${
              agreed
                ? "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20"
                : "bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-600 cursor-not-allowed"
            }`}
          >
            Setujui & Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}
