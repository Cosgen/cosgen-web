"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function AdminBusinessSummaryPage() {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");

  const mockMonthlyData = {
    month: "Juli 2026",
    totalIncome: 14850000,
    totalOrders: 18,
    completedOrders: 14,
    inProgressOrders: 4,
    commissionPayout: 4455000,
    remainingSlots: 7,
  };

  const dailyDetails = [
    { date: "27 Jul (Sen)", income: 1300000, orders: 2, status: "2 Selesai" },
    { date: "26 Jul (Min)", income: 650000, orders: 1, status: "1 Dikerjakan" },
    { date: "25 Jul (Sab)", income: 2400000, orders: 3, status: "3 Selesai" },
    { date: "24 Jul (Jum)", income: 1000000, orders: 2, status: "2 Selesai" },
    { date: "23 Jul (Kam)", income: 1650000, orders: 2, status: "1 Selesai, 1 Review" },
    { date: "22 Jul (Rab)", income: 1350000, orders: 2, status: "2 Selesai" },
    { date: "21 Jul (Sel)", income: 650000, orders: 1, status: "1 Selesai" },
  ];

  const weeklyDetails = [
    { week: "Minggu 4 (22 - 31 Jul)", income: 4250000, orders: 5, growth: "+12%" },
    { week: "Minggu 3 (15 - 21 Jul)", income: 3900000, orders: 5, growth: "+8%" },
    { week: "Minggu 2 (8 - 14 Jul)", income: 3800000, orders: 5, growth: "+15%" },
    { week: "Minggu 1 (1 - 7 Jul)", income: 2900000, orders: 3, growth: "Awal" },
  ];

  const handleDownloadRecap = (format: "CSV" | "JSON") => {
    const recapContent = `LAPORAN RINGKASAN BISNIS & KEUANGAN COSGEN.ID - ${mockMonthlyData.month}
===================================================
Total Pendapatan (Omset): Rp ${mockMonthlyData.totalIncome.toLocaleString("id-ID")}
Komisi Editor (30%): Rp ${mockMonthlyData.commissionPayout.toLocaleString("id-ID")}
Total Order Masuk: ${mockMonthlyData.totalOrders} Pesanan
Sisa Slot Kuota: ${mockMonthlyData.remainingSlots} Slot
===================================================

DETAIL HARIAN (7 HARI TERAKHIR):
${dailyDetails.map((d) => `${d.date} -> Rp ${d.income.toLocaleString("id-ID")} (${d.orders} Order) - ${d.status}`).join("\n")}

DETAIL MINGGUAN:
${weeklyDetails.map((w) => `${w.week} -> Rp ${w.income.toLocaleString("id-ID")} (${w.orders} Order)`).join("\n")}
===================================================
Laporan Diekspor Pada: ${new Date().toLocaleString("id-ID")}`;

    const blob = new Blob([recapContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan_keuangan_cosgen_${mockMonthlyData.month.toLowerCase().replace(" ", "_")}.${format.toLowerCase()}`;
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
              Ringkasan Bisnis & Keuangan
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mt-0.5">
            Ringkasan Bisnis & Laporan Keuangan
          </h1>
          <p className="text-[10px] sm:text-[11px] text-slate-500">
            Pantau rincian omset perhari, perminggu, grafik fluktuasi, dan unduh rekapitulasi data keuangan.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => handleDownloadRecap("CSV")}
            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-xs flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3 h-3" /> Unduh (CSV)
          </button>
          <button
            type="button"
            onClick={() => handleDownloadRecap("JSON")}
            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold shadow-xs flex items-center gap-1"
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

      {/* Metrics Cards (Consistent Balanced Square / Box Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-center items-center text-center space-y-1 aspect-[1.4/1]">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">
            Total Omset Bulan Ini
          </span>
          <div className="text-sm sm:text-base font-black text-slate-900 font-mono">
            Rp {mockMonthlyData.totalIncome.toLocaleString("id-ID")}
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
            Rp {mockMonthlyData.commissionPayout.toLocaleString("id-ID")}
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
            {mockMonthlyData.totalOrders} Order
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-center items-center text-center space-y-1 aspect-[1.4/1]">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <span className="text-[8px] text-emerald-600 font-bold uppercase tracking-wider block">
            Sisa Kuota Slot
          </span>
          <div className="text-base font-black text-emerald-600 font-mono">
            {mockMonthlyData.remainingSlots} Slot
          </div>
        </div>
      </div>

      {/* Fluctuation Graph Box (Compact Height) */}
      <div className="bg-slate-900 text-white rounded-xl p-3 sm:p-4 border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <h3 className="text-[11px] font-bold text-white">
              Grafik Fluktuasi Pendapatan ({viewMode === "daily" ? "Harian" : "Mingguan"})
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-md">
            <button
              onClick={() => setViewMode("daily")}
              className={`px-2 py-0.5 rounded text-[9px] font-bold transition-colors ${
                viewMode === "daily" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Perhari
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={`px-2 py-0.5 rounded text-[9px] font-bold transition-colors ${
                viewMode === "weekly" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Mingguan
            </button>
          </div>
        </div>

        {/* Visual Bar Chart (Compact Height) */}
        <div className="h-28 sm:h-32 flex items-end justify-between gap-1.5 pt-2 px-1 border-b border-slate-800 pb-2">
          {(viewMode === "daily" ? dailyDetails : weeklyDetails).map((item: any, idx: number) => {
            const maxIncome = 2400000;
            const heightPct = Math.min(100, Math.max(15, (item.income / maxIncome) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                <span className="text-[8px] text-emerald-400 font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {(item.income / 1000).toFixed(0)}k
                </span>
                <div
                  style={{ height: `${heightPct}%` }}
                  className="w-full max-w-[28px] bg-gradient-to-t from-blue-600 to-emerald-400 rounded-t-sm transition-all group-hover:brightness-125"
                />
                <span className="text-[8px] text-slate-400 truncate w-full text-center">
                  {viewMode === "daily" ? item.date.split(" ")[0] : `Mgt ${idx + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rincian Perhari & Mingguan Table Box */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-3 sm:p-4 space-y-2">
        <h3 className="text-xs font-bold text-slate-900">
          Detail Laporan Pendapatan ({viewMode === "daily" ? "Harian" : "Mingguan"})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase border-b border-slate-100 text-[8px]">
              <tr>
                <th className="px-2.5 py-1.5">{viewMode === "daily" ? "Tanggal" : "Periode Minggu"}</th>
                <th className="px-2.5 py-1.5">Pendapatan</th>
                <th className="px-2.5 py-1.5">Jumlah Order</th>
                <th className="px-2.5 py-1.5">Keterangan / Pertumbuhan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[10px]">
              {(viewMode === "daily" ? dailyDetails : weeklyDetails).map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-2.5 py-1.5 font-bold text-slate-900">{row.date || row.week}</td>
                  <td className="px-2.5 py-1.5 font-bold font-mono text-emerald-600">
                    Rp {row.income.toLocaleString("id-ID")}
                  </td>
                  <td className="px-2.5 py-1.5 font-mono">{row.orders} Order</td>
                  <td className="px-2.5 py-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {row.status || row.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
