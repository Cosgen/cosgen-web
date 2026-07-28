"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Timer, Folder, MessageCircle, Lock } from "lucide-react";

interface ReviewStatusBannerProps {
  orderCode: string;
  gdriveReviewUrl?: string;
  onOpenRevisionChat?: () => void;
}

export function ReviewStatusBanner({
  orderCode,
  gdriveReviewUrl,
  onOpenRevisionChat,
}: ReviewStatusBannerProps) {
  // 4x24 hours countdown = 96 hours (345600 seconds)
  const [secondsLeft, setSecondsLeft] = useState<number>(345600);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = Math.floor(secondsLeft / (24 * 3600));
  const hours = Math.floor((secondsLeft % (24 * 3600)) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const formattedTime = `${days} hari ${hours} jam ${minutes}m ${seconds}s`;

  return (
    <div className="p-5 bg-red-600 text-white rounded-2xl space-y-3 shadow-lg border border-red-700 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-500/80 pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
          <h4 className="font-extrabold text-xs sm:text-sm text-white">
            PERINGATAN BATAS WAKTU REVIEW PELANGGAN (4x24 JAM)
          </h4>
        </div>
        <div className="px-3 py-1 bg-white text-red-700 rounded-full font-mono font-black text-xs flex items-center gap-1 shadow-xs self-start sm:self-auto">
          <Timer className="w-3.5 h-3.5 text-red-600 animate-spin" />
          <span>Sisa Waktu: {formattedTime}</span>
        </div>
      </div>

      <p className="text-xs text-red-100 leading-relaxed">
        Harap periksa berkas foto di folder GDrive Review dan sampaikan revisi/persetujuan Anda. Apabila dalam waktu <strong>4x24 jam (96 jam)</strong> tidak ada tanggapan revisi dari pelanggan, kuota revisi gratis dianggap <strong>hangus</strong> dan sistem akan secara otomatis memindahkan status ke <strong>"Menunggu Pembayaran"</strong> dengan hasil review terakhir sebagai hasil final.
      </p>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {gdriveReviewUrl && (
          <a
            href={gdriveReviewUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-white text-red-700 hover:bg-red-50 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <Folder className="w-3.5 h-3.5 text-red-600" /> Buka Folder Review GDrive
          </a>
        )}
        {onOpenRevisionChat && (
          <button
            type="button"
            onClick={onOpenRevisionChat}
            className="px-3.5 py-2 bg-red-950 hover:bg-slate-900 text-white border border-red-400/40 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> Ajukan Diskusi Revisi
          </button>
        )}
      </div>
    </div>
  );
}
