"use client";

import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

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

export function TermsConditionsModal({ isOpen, onClose, onAgree }: TermsConditionsModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [tcText, setTcText] = useState(DEFAULT_TERMS_TEXT);

  useEffect(() => {
    const saved = localStorage.getItem("cosgen_terms_conditions");
    if (saved) setTcText(saved);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
      {/* Sheet / Dialog */}
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl flex flex-col max-h-[88vh] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">

        {/* Header — sticky */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 rounded-xl">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Syarat & Ketentuan</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">CosGen.id Platform — T&C</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="text-[12px] text-slate-600 dark:text-slate-300 leading-[1.8] whitespace-pre-line">
            {tcText}
          </div>
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 border-t border-slate-100 dark:border-slate-800 px-5 pt-4 pb-5 space-y-3 bg-white dark:bg-slate-900">
          {/* Checkbox */}
          <label
            htmlFor="tc-agree"
            className={`flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
              agreed
                ? "bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-300 dark:ring-blue-800"
                : "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750"
            }`}
          >
            <div className={`mt-0.5 w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-all ${
              agreed ? "bg-blue-600 border-blue-600" : "border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
            }`}>
              {agreed && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
            </div>
            <input
              type="checkbox"
              id="tc-agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="sr-only"
            />
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
              Saya telah membaca dan menyetujui seluruh Syarat & Ketentuan di atas.
            </span>
          </label>

          {/* Action buttons */}
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-[12px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
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
              className={`flex-1 py-2.5 rounded-2xl text-[12px] font-black transition-all ${
                agreed
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 hover:scale-[1.01]"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
              }`}
            >
              Setujui & Lanjutkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
