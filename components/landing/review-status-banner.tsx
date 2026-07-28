"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Timer, Folder, Lock, ExternalLink } from "lucide-react";

interface ReviewStatusBannerProps {
  orderCode: string;
  gdriveReviewUrl?: string;
  reviewStartedAt?: string;
  createdAt?: string;
}

export function ReviewStatusBanner({
  orderCode,
  gdriveReviewUrl,
  reviewStartedAt,
  createdAt,
}: ReviewStatusBannerProps) {
  const calculateSecondsLeft = () => {
    const TOTAL_SECONDS = 96 * 3600; // 4x24 hours = 345,600 seconds
    const startIso = reviewStartedAt || createdAt;
    if (!startIso) return TOTAL_SECONDS;
    const startMs = new Date(startIso).getTime();
    if (isNaN(startMs)) return TOTAL_SECONDS;
    const elapsedSec = Math.floor((Date.now() - startMs) / 1000);
    return Math.max(0, TOTAL_SECONDS - elapsedSec);
  };

  const [secondsLeft, setSecondsLeft] = useState<number>(calculateSecondsLeft);

  useEffect(() => {
    setSecondsLeft(calculateSecondsLeft());
    const timer = setInterval(() => {
      setSecondsLeft(calculateSecondsLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [reviewStartedAt, createdAt]);

  const days = Math.floor(secondsLeft / (24 * 3600));
  const hours = Math.floor((secondsLeft % (24 * 3600)) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const formattedTime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

  return (
    <div className="p-5 bg-red-600 text-white rounded-2xl space-y-3.5 shadow-xl border border-red-700 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-500/80 pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
          <h4 className="font-black text-xs sm:text-sm text-white tracking-tight">
            PERINGATAN BATAS WAKTU REVIEW PELANGGAN (4x24 JAM)
          </h4>
        </div>
        <div className="px-3 py-1 bg-white text-red-700 rounded-full font-mono font-black text-xs flex items-center gap-1 shadow-xs self-start sm:self-auto">
          <Timer className="w-3.5 h-3.5 text-red-600 animate-spin" />
          <span>Sisa Waktu: {formattedTime}</span>
        </div>
      </div>

      <p className="text-xs text-red-100 leading-relaxed">
        Harap periksa berkas foto di <strong>Folder Review GDrive</strong> dan sampaikan revisi/persetujuan Anda. Apabila dalam waktu <strong>4x24 jam (96 jam)</strong> tidak ada tanggapan revisi dari pelanggan, kuota revisi gratis dianggap <strong>hangus</strong> dan sistem akan otomatis memindahkan status ke <strong>"Menunggu Pembayaran"</strong>.
      </p>

      {/* Lock Notice */}
      <div className="p-3 bg-red-950/80 rounded-xl border border-red-400/40 flex items-center gap-2 text-xs font-semibold text-red-200">
        <Lock className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Pembayaran Terkunci:</strong> Tombol bayar baru akan aktif setelah Admin menyetujui ACC & mengubah status ke Menunggu Pembayaran.
        </span>
      </div>

      {/* Interactive Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {gdriveReviewUrl ? (
          <a
            href={gdriveReviewUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-white text-red-700 hover:bg-red-50 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all hover:scale-[1.01]"
          >
            <Folder className="w-4 h-4 text-red-600" /> Buka Folder Review GDrive
            <ExternalLink className="w-3 h-3 text-red-500 opacity-75" />
          </a>
        ) : (
          <span className="px-3.5 py-2 bg-red-900/60 text-red-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-red-500/30">
            <Folder className="w-3.5 h-3.5 text-amber-300" /> Menunggu Link Review GDrive dari Admin...
          </span>
        )}

        {/* Instagram DM Button */}
        <a
          href="https://ig.me/m/cosgen.id"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:brightness-110 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all hover:scale-[1.01]"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span>Diskusi via Instagram DM</span>
        </a>
      </div>
    </div>
  );
}
