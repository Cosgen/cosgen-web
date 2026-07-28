"use client";

import React, { useState } from "react";
import { ShieldCheck, Check, Sparkles } from "lucide-react";

interface ConfirmAccButtonProps {
  orderId: string;
  orderCode: string;
  currentStatus: string;
  isAccByAdmin: boolean;
  onAccSuccess: () => void;
}

export function ConfirmAccButton({
  orderId,
  orderCode,
  currentStatus,
  isAccByAdmin,
  onAccSuccess,
}: ConfirmAccButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (isAccByAdmin || currentStatus === "Menunggu Pembayaran" || currentStatus === "Selesai") {
    return (
      <span className="px-4 py-2 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs">
        <Check className="w-4 h-4 text-emerald-600" /> ACC Terkonfirmasi (Pembayaran Terbuka)
      </span>
    );
  }

  const handleConfirm = () => {
    if (
      window.confirm(
        `Konfirmasi ACC Pelanggan untuk ${orderCode}?\n\nStatus akan berubah dari 'Review' menjadi 'Menunggu Pembayaran' dan tombol bayar di sisi pelanggan akan langsung terbuka.`
      )
    ) {
      setIsConfirming(true);
      setTimeout(() => {
        setIsConfirming(false);
        onAccSuccess();
      }, 500);
    }
  };

  return (
    <button
      type="button"
      disabled={isConfirming}
      onClick={handleConfirm}
      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 inline-flex items-center gap-2 transition-all hover:scale-[1.02]"
    >
      <ShieldCheck className="w-4 h-4" />
      <span>Konfirmasi Pelanggan ACC (Buka Kunci Pembayaran)</span>
    </button>
  );
}
