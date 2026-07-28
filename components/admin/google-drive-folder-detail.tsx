"use client";

import React, { useState } from "react";
import { Folder, ExternalLink, Copy, Check, ShieldCheck, Lock } from "lucide-react";

interface GoogleDriveFolderDetailProps {
  orderCode: string;
  reviewUrl: string;
  finalUrl: string;
  onUpdateUrls?: (review: string, final: string) => void;
}

export function GoogleDriveFolderDetail({
  orderCode,
  reviewUrl,
  finalUrl,
  onUpdateUrls,
}: GoogleDriveFolderDetailProps) {
  const [copiedReview, setCopiedReview] = useState(false);
  const [copiedFinal, setCopiedFinal] = useState(false);

  const copyToClipboard = (text: string, isReview: boolean) => {
    navigator.clipboard.writeText(text);
    if (isReview) {
      setCopiedReview(true);
      setTimeout(() => setCopiedReview(false), 2000);
    } else {
      setCopiedFinal(true);
      setTimeout(() => setCopiedFinal(false), 2000);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <Folder className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Sinkronisasi Folder Google Drive ({orderCode})
          </h3>
        </div>
        <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full border border-blue-200 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-blue-600" /> Anyone with the link
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Folder Review Card */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              📁 Folder Review (Draft)
            </span>
            <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-semibold">
              Review Status
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono truncate bg-slate-50 p-2 rounded-lg border border-slate-200">
            {reviewUrl}
          </p>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => copyToClipboard(reviewUrl, true)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium flex items-center gap-1"
            >
              {copiedReview ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedReview ? "Tersalin!" : "Salin Link"}</span>
            </button>
            <a
              href={reviewUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" /> Buka GDrive
            </a>
          </div>
        </div>

        {/* Folder Final Card */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              📂 Folder Final (HD No Watermark)
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
              Status Selesai
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono truncate bg-slate-50 p-2 rounded-lg border border-slate-200">
            {finalUrl}
          </p>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => copyToClipboard(finalUrl, false)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium flex items-center gap-1"
            >
              {copiedFinal ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedFinal ? "Tersalin!" : "Salin Link"}</span>
            </button>
            <a
              href={finalUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-bold flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" /> Buka GDrive
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
