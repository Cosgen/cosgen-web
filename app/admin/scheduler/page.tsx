"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Save, Plus, Minus, CheckCircle2 } from "lucide-react";
import { getStoredOrders, syncGlobalOrdersFromServer } from "@/lib/order-store";

export default function AdminSchedulerPage() {
  const [totalSlots, setTotalSlots] = useState<number>(25);
  const [usedSlots, setUsedSlots] = useState<number>(0);
  const [holidays, setHolidays] = useState<number[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // 1. Calculate active used slots dynamically from real orders in database
    const orders = getStoredOrders();
    setUsedSlots(orders.length);

    syncGlobalOrdersFromServer().then((latest) => {
      if (latest && Array.isArray(latest)) setUsedSlots(latest.length);
    });

    const handleUpdate = () => {
      setUsedSlots(getStoredOrders().length);
    };
    window.addEventListener("cosgen_orders_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    // 2. Load custom scheduler settings
    const savedData = localStorage.getItem("cosgen_scheduler_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.totalSlots) setTotalSlots(parsed.totalSlots);
        if (parsed.holidays && Array.isArray(parsed.holidays)) setHolidays(parsed.holidays);
      } catch (e) {
        console.error(e);
      }
    }

    return () => {
      window.removeEventListener("cosgen_orders_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const toggleHoliday = (day: number) => {
    if (holidays.includes(day)) {
      setHolidays(holidays.filter((d) => d !== day));
    } else {
      setHolidays([...holidays, day]);
    }
  };

  const handleSaveScheduler = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { totalSlots, holidays };
    localStorage.setItem("cosgen_scheduler_data", JSON.stringify(data));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const remainingSlots = Math.max(0, totalSlots - usedSlots);

  return (
    <div className="p-3 sm:p-5 space-y-4 max-w-4xl mx-auto font-sans text-xs">
      {/* Header */}
      <div className="border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-1">
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded-full">
            Admin Portal
          </span>
          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-bold rounded-full">
            Scheduler & Kuota Slot Terintegrasi
          </span>
        </div>
        <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mt-0.5">
          Pengaturan Slot & Kalender Libur
        </h1>
        <p className="text-[10px] sm:text-[11px] text-slate-500">
          Atur kuota slot pengerjaan bulan ini. Terhubung otomatis dengan jumlah pesanan pelanggan yang masuk.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold rounded-lg flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Pengaturan Kuota Slot & Kalender Hari Libur Berhasil Disimpan!</span>
        </div>
      )}

      {/* Slot Metrics Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-center items-center text-center space-y-1.5 aspect-[1.3/1]">
          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">
            Total Kuota Slot Studio
          </span>
          <span className="text-xl font-black text-slate-900 font-mono">{totalSlots} Slot</span>
          <div className="flex items-center gap-1 pt-0.5">
            <button
              type="button"
              onClick={() => setTotalSlots(Math.max(1, totalSlots - 1))}
              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shadow-xs"
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setTotalSlots(totalSlots + 1)}
              className="w-6 h-6 rounded-md bg-blue-600 hover:bg-blue-700 flex items-center justify-center font-bold text-white text-xs shadow-xs"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-center items-center text-center space-y-1 aspect-[1.3/1]">
          <span className="text-[8px] text-emerald-600 font-bold uppercase tracking-wider block">
            Sisa Slot Tersedia
          </span>
          <div className="text-xl font-black text-emerald-600 font-mono">{remainingSlots} Slot</div>
          <p className="text-[9px] text-slate-400">Terpakai: {usedSlots} pesanan aktif</p>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-center items-center text-center space-y-1 aspect-[1.3/1]">
          <span className="text-[8px] text-red-500 font-bold uppercase tracking-wider block">
            Hari Libur Ditandai
          </span>
          <div className="text-xl font-black text-red-600 font-mono">{holidays.length} Hari</div>
          <p className="text-[9px] text-slate-400">Klik tanggal untuk toggle libur</p>
        </div>
      </div>

      {/* Calendar Grid Box */}
      <form onSubmit={handleSaveScheduler} className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <h3 className="text-[11px] font-bold text-slate-900">
              Kalender Pengerjaan Studio (Klik Tanggal Untuk Toggle Libur)
            </h3>
          </div>
          <div className="flex items-center gap-2.5 text-[10px] font-semibold">
            <span className="flex items-center gap-1 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-100 border border-blue-300 inline-block" /> Masuk
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-500 border border-red-600 inline-block" /> Libur
            </span>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
            <div key={d} className="text-[9px] font-bold text-slate-400 uppercase py-0.5">
              {d}
            </div>
          ))}

          {daysInMonth.map((day) => {
            const isHoliday = holidays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleHoliday(day)}
                className={`aspect-square rounded-md text-[10px] font-bold transition-all relative border flex flex-col items-center justify-center ${
                  isHoliday
                    ? "bg-red-500 text-white border-red-600 shadow-xs"
                    : "bg-slate-50 hover:bg-blue-50 text-slate-800 border-slate-200/80"
                }`}
              >
                <span>{day}</span>
                {isHoliday && (
                  <span className="block text-[7px] font-normal opacity-90 leading-none">Libur</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <p className="text-[9px] text-slate-400">
            Perubahan slot & hari libur langsung tersimpan di sistem.
          </p>
          <button
            type="submit"
            className="w-fit px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold shadow-xs flex items-center gap-1"
          >
            <Save className="w-3 h-3" /> Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}
