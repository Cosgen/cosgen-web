"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, X, ArrowRight, AlertCircle, ExternalLink } from "lucide-react";

interface MidtransSnapModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderCode: string;
  totalAmount: number;
  customerName?: string;
  packageName?: string;
  onPaymentSuccess: () => void;
}

export function MidtransSnapModal({
  isOpen,
  onClose,
  orderCode,
  totalAmount,
  customerName = "Pelanggan",
  packageName = "Edit Cosplay",
  onPaymentSuccess,
}: MidtransSnapModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  // Auto-trigger transaction token when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setRedirectUrl(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOpenMidtransSnap = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Fetch official Snap transaction token from Next.js API route
      const res = await fetch("/api/midtrans/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode,
          totalAmount,
          customerName,
          packageName,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Gagal membuat transaksi Midtrans.");
      }

      setRedirectUrl(data.redirect_url);

      // 2. Launch OFFICIAL Midtrans Snap Popup via window.snap.pay(token)
      if (typeof window !== "undefined" && window.snap && data.token) {
        window.snap.pay(data.token, {
          onSuccess: (result) => {
            console.log("Midtrans Payment Success:", result);
            onPaymentSuccess();
            onClose();
          },
          onPending: (result) => {
            console.log("Midtrans Payment Pending:", result);
            alert("Pembayaran Anda sedang diproses (Pending). Status akan diperbarui.");
            onPaymentSuccess();
            onClose();
          },
          onError: (result) => {
            console.error("Midtrans Payment Error:", result);
            setErrorMessage("Pembayaran gagal atau terjadi kesalahan pada Midtrans.");
          },
          onClose: () => {
            console.log("Midtrans Snap Popup ditutup oleh pengguna.");
          },
        });
      } else if (data.redirect_url) {
        // Fallback: If window.snap is not loaded, redirect to Midtrans Snap URL
        window.open(data.redirect_url, "_blank");
      }
    } catch (err: any) {
      console.error("Midtrans Snap Trigger Error:", err);
      setErrorMessage(err.message || "Gagal membuka popup pembayaran Midtrans.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 relative text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold tracking-tight">
              Pembayaran Resmi Midtrans Snap
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order & Amount Box */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center space-y-1">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">
            Kode Pesanan: {orderCode}
          </span>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
            Rp {totalAmount.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
            Paket: <strong className="text-slate-700 dark:text-slate-200">{packageName}</strong>
          </span>
        </div>

        {/* Error message notification */}
        {errorMessage && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl space-y-1 text-left">
            <div className="flex items-center gap-1.5 font-bold text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Gagal Membuka Midtrans Snap</span>
            </div>
            <p className="text-[11px] text-red-700 dark:text-red-300 leading-relaxed">
              {errorMessage}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 border-t border-red-200 dark:border-red-900/60 pt-1.5 mt-1">
              Periksa <code className="font-bold bg-slate-100 dark:bg-slate-800 px-1 rounded">MIDTRANS_SERVER_KEY</code> dan <code className="font-bold bg-slate-100 dark:bg-slate-800 px-1 rounded">NEXT_PUBLIC_MIDTRANS_CLIENT_KEY</code> di file <code className="font-bold">.env.local</code> (ambil dari <a href="https://dashboard.sandbox.midtrans.com" target="_blank" rel="noreferrer" className="underline text-blue-600">dashboard.sandbox.midtrans.com</a>).
            </p>
          </div>
        )}

        {/* Instructions */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
          Klik tombol di bawah untuk membuka popup resmi Midtrans Snap (QRIS, Virtual Account BCA/Mandiri/BNI/BRI, e-Wallet, Kartu Kredit).
        </p>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleOpenMidtransSnap}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memproses Token Midtrans...</span>
              </>
            ) : (
              <>
                <span>Buka Popup Midtrans Snap</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {redirectUrl && (
            <a
              href={redirectUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span>Buka Halaman Midtrans Snap (Tab Baru)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
