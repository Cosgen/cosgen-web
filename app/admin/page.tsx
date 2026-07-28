"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Users, Clock, CheckCircle2, AlertCircle, Inbox } from "lucide-react";
import { getStoredOrders, syncGlobalOrdersFromServer, OrderData } from "@/lib/order-store";
import { DownloadInvoiceButton } from "@/components/admin/download-invoice-button";

export default function AdminDashboardMainPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);

  useEffect(() => {
    setOrders(getStoredOrders());
    // Global Cloud Fetch from /api/orders
    syncGlobalOrdersFromServer().then((latest) => {
      if (latest && Array.isArray(latest)) setOrders(latest);
    });

    const handleUpdate = () => setOrders(getStoredOrders());
    window.addEventListener("cosgen_orders_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("cosgen_orders_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <div className="p-3 sm:p-5 space-y-4 max-w-5xl mx-auto font-sans text-xs">
      {/* Top Header */}
      <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            Dashboard Utama Admin CosGen.id
          </h1>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
            Ringkasan status antrian pesanan, konfirmasi ACC pelanggan, dan akses fitur kasir.
          </p>
        </div>
        <Link
          href="/admin/pesanan"
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[10px] shadow-xs shrink-0"
        >
          Lihat Semua Pesanan →
        </Link>
      </div>

      {/* Quick Stats Widget */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-col items-center justify-center text-center space-y-1 aspect-[1.4/1]">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-3.5 h-3.5" />
          </div>
          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">
            Total Order
          </span>
          <div className="text-lg font-black text-slate-900 font-mono">{orders.length}</div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-col items-center justify-center text-center space-y-1 aspect-[1.4/1]">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span className="text-[8px] text-amber-600 font-bold uppercase tracking-wider block">
            REQ Konfirmasi
          </span>
          <div className="text-lg font-black text-amber-600 font-mono">
            {orders.filter((o) => o.status === "Menunggu Konfirmasi").length}
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-col items-center justify-center text-center space-y-1 aspect-[1.4/1]">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
          <span className="text-[8px] text-purple-600 font-bold uppercase tracking-wider block">
            Review Phase
          </span>
          <div className="text-lg font-black text-purple-600 font-mono">
            {orders.filter((o) => o.status === "Review").length}
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-col items-center justify-center text-center space-y-1 aspect-[1.4/1]">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-[8px] text-emerald-600 font-bold uppercase tracking-wider block">
            Order Selesai
          </span>
          <div className="text-lg font-black text-emerald-600 font-mono">
            {orders.filter((o) => o.status === "Selesai").length}
          </div>
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden space-y-2.5 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">
            Daftar Pesanan Berjalan
          </h3>
          {orders.length > 0 && (
            <Link href="/admin/pesanan" className="text-[10px] text-blue-600 font-bold hover:underline">
              Lihat Selengkapnya ({orders.length}) →
            </Link>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Inbox className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
            <p className="font-bold text-xs text-slate-600">Belum Ada Pesanan Masuk</p>
            <p className="text-[10px] text-slate-400 max-w-sm mx-auto">
              Pesanan baru yang dikirim oleh pelanggan dari website akan otomatis tampil secara real-time di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase border-b border-slate-100 text-[8px]">
                <tr>
                  <th className="px-2.5 py-1.5">Kode Order</th>
                  <th className="px-2.5 py-1.5">Nama Pelanggan</th>
                  <th className="px-2.5 py-1.5">Paket Jasa</th>
                  <th className="px-2.5 py-1.5">Total Biaya</th>
                  <th className="px-2.5 py-1.5">Status</th>
                  <th className="px-2.5 py-1.5 text-center">Kelola / Resi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[10px]">
                {orders.slice(0, 10).map((ord) => {
                  const displayCode = ord.officialCode || ord.code;
                  const isReqCode = displayCode.startsWith("REQ-");

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50">
                      <td className="px-2.5 py-1.5 font-mono font-bold">
                        <span className={isReqCode ? "text-red-600 font-bold" : "text-blue-600 font-bold"}>
                          {displayCode}
                        </span>
                      </td>
                      <td className="px-2.5 py-1.5 font-bold text-slate-900">
                        {ord.customerName}
                      </td>
                      <td className="px-2.5 py-1.5">{ord.package}</td>
                      <td className="px-2.5 py-1.5 font-bold font-mono text-slate-900">
                        Rp {ord.totalAmount.toLocaleString("id-ID")}
                      </td>
                      <td className="px-2.5 py-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-blue-100 text-blue-800">
                          {ord.status}
                        </span>
                      </td>
                      <td className="px-2.5 py-1.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            href={`/admin/pesanan/${ord.id}`}
                            className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold inline-flex items-center gap-1 text-[8px]"
                          >
                            <Eye className="w-2.5 h-2.5" /> Detail
                          </Link>
                          <DownloadInvoiceButton order={ord} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
