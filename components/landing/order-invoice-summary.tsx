"use client";

import React from "react";
import { FileText, CheckCircle2 } from "lucide-react";

interface OrderInvoiceSummaryProps {
  orderCode: string;
  packageName: string;
  basePrice: number;
  discountAmount?: number;
  totalAmount: number;
}

export function OrderInvoiceSummary({
  orderCode,
  packageName,
  basePrice,
  discountAmount = 0,
  totalAmount,
}: OrderInvoiceSummaryProps) {
  return (
    <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-2 border border-slate-800 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
          <FileText className="w-3.5 h-3.5 text-blue-400" /> Rincian Tagihan Invoice ({orderCode})
        </span>
        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
          <CheckCircle2 className="w-3 h-3" /> Resi Verified
        </span>
      </div>

      <div className="space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span className="text-slate-400">Paket Edit Cosplay ({packageName}):</span>
          <span className="font-mono font-bold text-white">Rp {basePrice.toLocaleString("id-ID")}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-red-400 font-semibold">
            <span>Potongan Diskon Promo:</span>
            <span className="font-mono">- Rp {discountAmount.toLocaleString("id-ID")}</span>
          </div>
        )}

        <div className="flex justify-between pt-1.5 border-t border-slate-800 font-bold text-xs">
          <span className="text-emerald-400">Total Yang Harus Dibayar:</span>
          <span className="font-mono text-emerald-400 text-sm">
            Rp {totalAmount.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    </div>
  );
}
