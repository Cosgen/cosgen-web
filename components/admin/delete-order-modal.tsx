"use client";

import React from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";

interface DeleteOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderCode: string;
  onConfirmDelete: () => void;
}

export function DeleteOrderModal({
  isOpen,
  onClose,
  orderCode,
  onConfirmDelete,
}: DeleteOrderModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl border border-slate-200 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-900"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <Trash2 className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">Konfirmasi Hapus Pesanan</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Apakah Anda yakin ingin menghapus data pesanan <strong className="font-mono font-bold text-red-600">{orderCode}</strong> secara permanen?
          </p>
          <p className="text-[11px] text-red-600 bg-red-50 p-2 rounded-xl mt-3 border border-red-100 font-medium">
            Tindakan ini tidak dapat dibatalkan. Seluruh riwayat & berkas akan terhapus.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmDelete();
              onClose();
            }}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20"
          >
            Ya, Hapus Permanen
          </button>
        </div>
      </div>
    </div>
  );
}
