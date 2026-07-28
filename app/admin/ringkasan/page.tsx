"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  DollarSign,
  PieChart,
  Users,
  Inbox,
} from "lucide-react";
import { getStoredOrders, syncGlobalOrdersFromServer, OrderData } from "@/lib/order-store";

export default function AdminBusinessSummaryPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");

  useEffect(() => {
    setOrders(getStoredOrders());
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

  // Compute dynamic financial metrics from actual orders
  const totalOrders = orders.length;
  const completedOrdersList = orders.filter((o) => o.status === "Selesai");
  const completedCount = completedOrdersList.length;
  
  // Total Revenue from paid/completed orders (or all non-rejected orders)
  const totalIncome = orders
    .filter((o) => o.status !== "Ditolak")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const editorCommission = Math.round(totalIncome * 0.3);

  // Group orders by Date
  const dateMap: { [date: string]: { income: number; count: number; status: string } } = {};
  orders.forEach((o) => {
    const dateKey = (o.createdAt || "").slice(0, 10) || "Hari Ini";
    if (!dateMap[dateKey]) {
      dateMap[dateKey] = { income: 0, count: 0, status: o.status };
    }
    dateMap[dateKey].income += o.totalAmount || 0;
    dateMap[dateKey].count += 1;
  });

  const dailyDetails = Object.keys(dateMap).map((d) => ({
    date: d,
    income: dateMap[d].income,
    orders: dateMap[d].count,
    status: dateMap[d].status,
  }));

  const handleDownloadRecap = (format: "CSV" | "TXT") => {
    const recapContent = `LAPORAN RINGKASAN BISNIS & KEUANGAN COSGEN.ID
===================================================
Total Omset Pendapatan: Rp ${totalIncome.toLocaleString("id-ID")}
Estimasi Komisi Editor (30%): Rp ${editorCommission.toLocaleString("id-ID")}
Total Order Masuk: ${totalOrders} Pesanan
Order Selesai & Lunas: ${completedCount} Pesanan
===================================================

RINCIAN DARI DATABASE:
${dailyDetails.length > 0 ? dailyDetails.map((d) => `${d.date} -> Rp ${d.income.toLocaleString("id-ID")} (${d.orders} Order) - Status: ${d.status}`).join("\n") : "Belum Ada Transaksi."}
===================================================
Laporan Diekspor Pada: ${new Date().toLocaleString("id-ID")}`;

    const blob = new Blob([recapContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan_keuangan_cosgen_${new Date().toISOString().slice(0, 10)}.${format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="p-3 sm:p-5 space-y-4 max-w-5xl mx-auto font-sans text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-200 pb-2.5">
        <div>
          <div className="flex items-center gap-1">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded-full">
              Admin Portal
            </span>
            <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-bold rounded-full">
              Laporan Keuangan Terintegrasi
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mt-0.5">
            Ringkasan Bisnis & Laporan Keuangan
          </h1>
          <p className="text-[10px] sm:text-[11px] text-slate-500">
            Terhubung otomatis dengan transaksi pesanan dari pelanggan secara real-time.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => handleDownloadRecap("CSV")}
            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <FileSpreadsheet className="w-3 h-3" /> Unduh (CSV)
          </button>
          <button
            type="button"
            onClick={() => handleDownloadRecap("TXT")}
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3 h-3" /> Unduh (TXT)
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold rounded-lg flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Laporan Keuangan & Rekapitulasi Bisnis Berhasil Diunduh!</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-center items-center text-center space-y-1 aspect-[1.4/1]">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">
            Total Omset Terdaftar
          </span>
          <div className="text-sm sm:text-base font-black text-slate-900 font-mono">
            Rp {totalIncome.toLocaleString("id-ID")}
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-center items-center text-center space-y-1 aspect-[1.4/1]">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <PieChart className="w-3.5 h-3.5" />
          </div>
          <span className="text-[8px] text-purple-600 font-bold uppercase tracking-wider block">
            Komisi Editor (30%)
          </span>
          <div className="text-sm sm:text-base font-black text-purple-600 font-mono">
            Rp {editorCommission.toLocaleString("id-ID")}
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-center items-center text-center space-y-1 aspect-[1.4/1]">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-3.5 h-3.5" />
          </div>
          <span className="text-[8px] text-blue-600 font-bold uppercase tracking-wider block">
            Total Order Masuk
          </span>
          <div className="text-base font-black text-blue-600 font-mono">
            {totalOrders} Order
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-center items-center text-center space-y-1 aspect-[1.4/1]">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-[8px] text-emerald-600 font-bold uppercase tracking-wider block">
            Order Selesai & Lunas
          </span>
          <div className="text-base font-black text-emerald-600 font-mono">
            {completedCount} Pesanan
          </div>
        </div>
      </div>

      {/* Rincian Transaksi Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3 sm:p-4 space-y-2">
        <h3 className="text-xs font-bold text-slate-900">
          Rincian Transaksi & Omset per Tanggal
        </h3>

        {dailyDetails.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <Inbox className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
            <p className="font-bold text-xs text-slate-600">Belum Ada Transaksi Terdaftar</p>
            <p className="text-[10px] text-slate-400 max-w-sm mx-auto">
              Laporan Keuangan & Omset akan terisi secara otomatis seiring masuknya transaksi pesanan dari pelanggan.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase border-b border-slate-100 text-[8px]">
                <tr>
                  <th className="px-2.5 py-1.5">Tanggal</th>
                  <th className="px-2.5 py-1.5">Pendapatan Omset</th>
                  <th className="px-2.5 py-1.5">Jumlah Order</th>
                  <th className="px-2.5 py-1.5">Status Terakhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[10px]">
                {dailyDetails.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-2.5 py-1.5 font-bold text-slate-900">{row.date}</td>
                    <td className="px-2.5 py-1.5 font-bold font-mono text-emerald-600">
                      Rp {row.income.toLocaleString("id-ID")}
                    </td>
                    <td className="px-2.5 py-1.5 font-mono">{row.orders} Order</td>
                    <td className="px-2.5 py-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
