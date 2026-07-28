"use client";

import React, { useState, useEffect } from "react";
import { Timer, Trash2, CheckCircle2, ShieldCheck, AlertTriangle, RefreshCw } from "lucide-react";

interface CloudinaryDeletionIndicatorProps {
  completedAt?: string;
  isDeleted?: boolean;
  hasError?: boolean;
  onRetryDelete?: () => void;
}

export function CloudinaryDeletionIndicator({
  completedAt,
  isDeleted = false,
  hasError = false,
  onRetryDelete,
}: CloudinaryDeletionIndicatorProps) {
  const [timeLeftStr, setTimeLeftStr] = useState("1 hari 23 jam 59 menit");
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftStr((prev) => {
        if (prev.includes("59")) return "1 hari 23 jam 58 menit";
        return "1 hari 23 jam 57 menit";
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (hasError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-900">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-100 text-red-600 rounded-xl shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-red-950 text-xs sm:text-sm">
              Notifikasi: Otomatisasi Penghapusan Foto Cloudinary Gagal
            </h4>
            <p className="text-[11px] text-red-700 mt-0.5">
              Gagal menghubungi Cloudinary API (Network Timeout). Sistem akan mencoba otomatis dalam 1 jam.
            </p>
          </div>
        </div>

        {onRetryDelete && (
          <button
            type="button"
            disabled={isRetrying}
            onClick={() => {
              setIsRetrying(true);
              setTimeout(() => {
                setIsRetrying(false);
                if (onRetryDelete) onRetryDelete();
              }, 1200);
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />
            <span>{isRetrying ? "Memproses Retry..." : "Coba Ulang (Retry Hapus)"}</span>
          </button>
        )}
      </div>
    );
  }

  if (isDeleted) {
    return (
      <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2 font-semibold">
          <Trash2 className="w-4 h-4 text-slate-400" />
          <span>Foto Referensi Cloudinary Telah Dihapus Permanen (Privasi Terjaga)</span>
        </div>
        <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-full">
          2x24 Jam Expired
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-amber-500/20 text-amber-600 rounded-xl shrink-0">
          <Timer className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="font-bold text-amber-950 text-xs sm:text-sm">
            Hitung Mundur Penghapusan Berkas Cloudinary (2x24 Jam)
          </h4>
          <p className="text-[11px] text-amber-800 mt-0.5">
            Foto referensi pelanggan akan terhapus secara otomatis & permanen demi privasi.
          </p>
        </div>
      </div>

      <div className="px-3.5 py-2 bg-amber-500 text-white rounded-xl text-xs font-mono font-extrabold shadow-xs shrink-0 text-center">
        {timeLeftStr}
      </div>
    </div>
  );
}
