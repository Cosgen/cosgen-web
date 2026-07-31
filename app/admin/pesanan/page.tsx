"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Eye, Download, Trash2, Inbox } from "lucide-react";
import { getStoredOrders, saveOrdersToStorage, OrderData, clearAllOrders, syncGlobalOrdersFromServer, deleteSingleOrder } from "@/lib/order-store";
import { DownloadInvoiceButton } from "@/components/admin/download-invoice-button";

export type AdminOrder = OrderData;
export { INITIAL_SHARED_ORDERS as INITIAL_ADMIN_ORDERS } from "@/lib/order-store";

export default function AdminPesananListPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  useEffect(() => {
    setOrders(getStoredOrders());
    syncGlobalOrdersFromServer().then((latest) => {
      if (latest && Array.isArray(latest)) setOrders(latest);
    });
    const handleUpdate = () => {
      setOrders(getStoredOrders());
      syncGlobalOrdersFromServer().then((latest) => {
        if (latest && Array.isArray(latest)) setOrders(latest);
      });
    };
    window.addEventListener("cosgen_orders_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("cosgen_orders_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleClearOrders = () => {
    if (confirm("Apakah kamu yakin ingin mengosongkan semua data pesanan? Data yang dihapus tidak dapat dikembalikan.")) {
      clearAllOrders();
      setOrders([]);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const codeToSearch = (o.officialCode || o.code).toLowerCase();
    const nameToSearch = (o.customerName || "").toLowerCase();
    const waToSearch   = (o.whatsapp || "").toLowerCase();
    const igToSearch   = (o.instagram || "").toLowerCase();
    const query        = searchQuery.toLowerCase();
    const matchesSearch =
      codeToSearch.includes(query) ||
      nameToSearch.includes(query) ||
      waToSearch.includes(query) ||
      igToSearch.includes(query);

    const matchesStatus =
      statusFilter === "Semua" || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-6xl mx-auto font-sans text-xs">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
              Admin Portal
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-full">
              Manajemen Pesanan Real-Time
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Daftar Pesanan & Brief
          </h1>
          <p className="text-slate-500 text-[11px]">
            Kelola status REQ/ORD, konfirmasi ACC, unduh invoice PDF/TXT, dan atur detail pesanan.
          </p>
        </div>

        {/* Clear All Action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearOrders}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Kosongkan Semua Pesanan</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
        {/* Search & Status Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari Kode, Nama, WhatsApp, Instagram..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-400 focus:outline-none"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 flex-wrap">
            {[
              "Semua",
              "Menunggu Konfirmasi",
              "Dalam Antrian",
              "Sedang Dikerjakan",
              "Review",
              "Menunggu Pembayaran",
              "Selesai",
              "Ditolak",
            ].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Inbox className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
            <p className="font-bold text-slate-600 text-xs">Belum Ada Pesanan Ditemukan</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Pesanan baru dari form pelanggan akan otomatis muncul di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase border-b border-slate-100 text-[10px]">
                <tr>
                  <th className="px-3.5 py-2.5">Kode Order</th>
                  <th className="px-3.5 py-2.5">Nama Pelanggan</th>
                  <th className="px-3.5 py-2.5">Kontak WA</th>
                  <th className="px-3.5 py-2.5">Instagram</th>
                  <th className="px-3.5 py-2.5">Paket Jasa</th>
                  <th className="px-3.5 py-2.5">Total Biaya</th>
                  <th className="px-3.5 py-2.5">Status Pesanan</th>
                  <th className="px-3.5 py-2.5 text-center">Aksi / Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {filteredOrders.map((ord) => {
                  const displayCode = ord.officialCode || ord.code;
                  const isReqCode = displayCode.startsWith("REQ-");
                  const formattedIg = ord.instagram && ord.instagram !== "-"
                    ? (ord.instagram.startsWith("@") ? ord.instagram : `@${ord.instagram}`)
                    : "-";

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-3.5 py-3 font-mono">
                        <span
                          className={`font-bold text-[11px] ${
                            isReqCode ? "text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200" : "text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                          }`}
                        >
                          {displayCode}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 font-bold text-slate-900">
                        {ord.customerName}
                      </td>
                      <td className="px-3.5 py-3 font-medium">{ord.whatsapp}</td>
                      <td className="px-3.5 py-3 font-semibold text-purple-700">{formattedIg}</td>
                      <td className="px-3.5 py-3">{ord.package} ({ord.photoCount} Foto)</td>
                      <td className="px-3.5 py-3 font-bold text-slate-900 font-mono">
                        Rp {ord.totalAmount.toLocaleString("id-ID")}
                      </td>
                      <td className="px-3.5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold inline-block ${
                            ord.status === "Menunggu Konfirmasi"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : ord.status === "Review"
                              ? "bg-purple-100 text-purple-800 border border-purple-300"
                              : ord.status === "Selesai"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : ord.status === "Ditolak"
                              ? "bg-red-100 text-red-800 border border-red-300"
                              : "bg-blue-100 text-blue-800 border border-blue-300"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/admin/pesanan/${ord.id}`}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold inline-flex items-center gap-1 shadow-xs text-[10px]"
                          >
                            <Eye className="w-3 h-3" /> Detail
                          </Link>
                          <DownloadInvoiceButton order={ord} />
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus pesanan ${displayCode} (${ord.customerName})?`)) {
                                deleteSingleOrder(ord.id);
                                setOrders(orders.filter((o) => o.id !== ord.id));
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Hapus Pesanan Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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
