"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Copy, Check, Clock, ChevronRight } from "lucide-react";

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

  const NEXT_STEPS = [
    { step: "01", label: "Admin mengulas brief & foto kamu", color: "text-blue-600 dark:text-blue-400" },
    { step: "02", label: "Pesanan masuk ke antrian resmi (ORD-XXXX)", color: "text-violet-600 dark:text-violet-400" },
    { step: "03", label: "Proses edit CGI & VFX dimulai (~3 hari kerja)", color: "text-amber-600 dark:text-amber-400" },
    { step: "04", label: "Review hasil & pembayaran via Midtrans", color: "text-emerald-600 dark:text-emerald-400" },
  ];

  return (
    <div className="space-y-5 py-2">
      {/* ── TOP: animated checkmark + title ── */}
      <div className="text-center space-y-3">
        {/* Animated ring + checkmark */}
        <div className="relative w-20 h-20 mx-auto">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor"
              strokeWidth="4" className="text-emerald-100 dark:text-emerald-950" />
            <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor"
              strokeWidth="4" strokeLinecap="round" strokeDasharray="226"
              strokeDashoffset="0" className="text-emerald-500 transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-9 h-9 text-emerald-500" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>

        {/* Status pill */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-full border border-amber-200 dark:border-amber-800">
          <Clock className="w-3 h-3" /> Menunggu Konfirmasi Admin
        </span>

        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Pesanan Berhasil Dikirim!
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
            Terima kasih, <strong className="text-slate-700 dark:text-slate-200">{customerName}</strong>! Brief kamu telah diterima sistem CosGen.id.
          </p>
        </div>
      </div>

      {/* ── REQ CODE CARD ── */}
      <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-5 space-y-3 shadow-xl mx-auto max-w-sm">
        <p className="text-[9px] uppercase font-black text-slate-500 tracking-[0.15em] text-center">
          Kode Order Sementara
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl font-mono font-black text-blue-400 tracking-wider">
            {reqCode}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600"
            }`}
          >
            {copied ? (
              <><Check className="w-3.5 h-3.5" /> Tersalin!</>
            ) : (
              <><Copy className="w-3.5 h-3.5" /> Salin</>
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-500 text-center border-t border-slate-700 pt-3 leading-relaxed">
          Simpan kode ini. Setelah ACC Admin, akan menjadi <span className="text-blue-400 font-bold">ORD-XXXX</span>
        </p>
      </div>

      {/* ── NEXT STEPS ── */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 space-y-2.5 border border-slate-100 dark:border-slate-800">
        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
          Apa yang terjadi selanjutnya?
        </p>
        {NEXT_STEPS.map((s) => (
          <div key={s.step} className="flex items-center gap-3">
            <span className={`text-[9px] font-black ${s.color} w-5 shrink-0`}>{s.step}</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── ACTIONS ── */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-1">
        <Link
          href={`/cek-status?code=${reqCode}`}
          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
        >
          <Search className="w-3.5 h-3.5" /> Pantau di Portal Status
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1 transition-all"
          >
            Tutup <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
