"use client";

import React, { useState } from "react";
import { ShieldCheck, Check } from "lucide-react";

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

  const isPaymentUnlocked = currentStatus === "Menunggu Pembayaran" || currentStatus === "Selesai";

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onAccSuccess();
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <button
      type="button"
      disabled={isConfirming}
      onClick={handleConfirm}
      className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md inline-flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer ${
        isPaymentUnlocked
          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
          : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20 animate-pulse"
      }`}
    >
      <ShieldCheck className="w-4 h-4" />
      <span>
        {isPaymentUnlocked
          ? "✓ ACC Terkonfirmasi (Pembayaran Sudah Terbuka di Pelanggan)"
          : "⚡ ACC Pelanggan Sekarang (Ubah Status ke Menunggu Pembayaran)"}
      </span>
    </button>
  );
}
