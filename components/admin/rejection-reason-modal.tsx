"use client";

import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface RejectionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderCode: string;
  onConfirmRejection: (reason: string) => void;
}

export function RejectionReasonModal({
  isOpen,
  onClose,
  orderCode,
  onConfirmRejection,
}: RejectionReasonModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert("Alasan penolakan WAJIB diisi.");
      return;
    }
    onConfirmRejection(reason);
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-900"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-100 text-red-600 rounded-2xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Alasan Penolakan Pesanan</h3>
            <p className="text-xs text-slate-500 font-mono">Kode Order: {orderCode}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alasan Penolakan <span className="text-red-500">* (Wajib Diisi)</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Contoh: Foto referensi terlalu miring dan resolusi tidak memenuhi batas minimal kamera..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-red-500/20 focus:outline-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Alasan ini akan langsung tersimpan dan dapat dilihat pelanggan pada halaman Cek Status.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20"
            >
              Simpan Penolakan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
