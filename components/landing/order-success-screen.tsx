"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Search, Copy, Check, Clock, ShieldCheck } from "lucide-react";

interface OrderSuccessScreenProps {
  reqCode: string;
  customerName?: string;
  onClose?: () => void;
}

export function OrderSuccessScreen({
  reqCode,
  customerName = "Pelanggan",
  onClose,
}: OrderSuccessScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(reqCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="text-center space-y-6 py-4">
      {/* Icon */}
      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <span className="px-3.5 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full border border-amber-300 inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-700" /> Status: Menunggu Konfirmasi Admin
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
          Pesanan Berhasil Disimpan!
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Terima kasih, <strong>{customerName}</strong>! Pesanan Anda telah diterima oleh sistem CosGen.id.
        </p>
      </div>

      {/* REQ Code Display Box */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-3 shadow-xl max-w-md mx-auto relative">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
          Kode Order Sementara Anda:
        </span>
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl sm:text-4xl font-mono font-extrabold text-blue-400 tracking-wider">
            {reqCode}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors text-xs flex items-center gap-1 border border-slate-700"
            title="Salin Kode Order"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
          Simpan kode ini. Setelah disetujui Admin, kode akan otomatis dikonversi menjadi <strong>ORD-XXXX</strong> (Kode Antrian Resmi).
        </p>
      </div>

      {/* Actions */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={`/cek-status?code=${reqCode}`}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" /> Pantau Status di Portal
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Tutup Halaman
          </button>
        )}
      </div>
    </div>
  );
}
