"use client";

import React, { useState } from "react";
import { ShieldCheck, X, QrCode, CreditCard, Landmark, CheckCircle2, ArrowRight } from "lucide-react";

interface MidtransSnapModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderCode: string;
  totalAmount: number;
  onPaymentSuccess: () => void;
}

export function MidtransSnapModal({
  isOpen,
  onClose,
  orderCode,
  totalAmount,
  onPaymentSuccess,
}: MidtransSnapModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"qris" | "va" | "card">("qris");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-slate-200 relative">
        {/* Midtrans Official Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold text-slate-900 tracking-tight">
              Midtrans Snap Payment Gateway
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invoice Amount Display */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Order: {orderCode}
          </span>
          <div className="text-3xl font-extrabold text-blue-600 font-mono">
            Rp {totalAmount.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            ✓ Status Konfirmasi Admin: ACC Verified
          </span>
        </div>

        {/* Method Selection */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 block">Pilih Metode Pembayaran:</span>

          <div
            onClick={() => setSelectedMethod("qris")}
            className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              selectedMethod === "qris"
                ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <QrCode className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-900">QRIS (Instant QR)</h4>
                <p className="text-[10px] text-slate-500">GoPay, ShopeePay, OVO, DANA, BCA Mobile</p>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMethod === "qris" ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"}`}>
              {selectedMethod === "qris" && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
          </div>

          <div
            onClick={() => setSelectedMethod("va")}
            className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              selectedMethod === "va"
                ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20"
                : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Landmark className="w-5 h-5 text-indigo-600" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-slate-900">Virtual Account (Bank Transfer)</h4>
                <p className="text-[10px] text-slate-500">BCA, Mandiri, BNI, BRI, Permata</p>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedMethod === "va" ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300"}`}>
              {selectedMethod === "va" && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
          </div>
        </div>

        {/* Submit Simulation */}
        <button
          disabled={isProcessing}
          onClick={handlePayNow}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
        >
          {isProcessing ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Memproses Pembayaran...</span>
            </>
          ) : (
            <>
              <span>Simulasi Bayar Lunas Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
