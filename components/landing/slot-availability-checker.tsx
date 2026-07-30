"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { getStoredOrders, syncGlobalOrdersFromServer } from "@/lib/order-store";

interface SlotAvailabilityCheckerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedOrder: () => void;
}

export function SlotAvailabilityChecker({ isOpen, onClose, onProceedOrder }: SlotAvailabilityCheckerProps) {
  const [totalSlots, setTotalSlots] = useState(25);
  const [usedSlots, setUsedSlots]   = useState(0);
  const [holidays, setHolidays]     = useState<number[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const loadRealtimeSlots = async () => {
      // 1. Calculate active orders from local storage
      const orders = getStoredOrders();
      const activeLocal = orders.filter((o) => o.status !== "Ditolak");
      setUsedSlots(activeLocal.length);

      // 2. Fetch latest orders from server to ensure 100% database sync
      try {
        const latest = await syncGlobalOrdersFromServer();
        if (latest && Array.isArray(latest)) {
          const activeLatest = latest.filter((o) => o.status !== "Ditolak");
          setUsedSlots(activeLatest.length);
        }
      } catch (e) {
        console.warn("Order sync notice:", e);
      }

      // 3. Load scheduler settings from API / localStorage
      try {
        const res = await fetch(`/api/scheduler?t=${Date.now()}`, { cache: "no-store" });
        const d = await res.json();
        if (d && d.settings) {
          if (d.settings.totalSlots) setTotalSlots(d.settings.totalSlots);
          if (Array.isArray(d.settings.holidays)) setHolidays(d.settings.holidays);
          localStorage.setItem("cosgen_scheduler_data", JSON.stringify(d.settings));
        }
      } catch (e) {
        const saved = localStorage.getItem("cosgen_scheduler_data");
        if (saved) {
          try {
            const p = JSON.parse(saved);
            if (p.totalSlots) setTotalSlots(p.totalSlots);
            if (p.holidays && Array.isArray(p.holidays)) setHolidays(p.holidays);
          } catch (err) {
            console.error(err);
          }
        }
      }
    };

    loadRealtimeSlots();
  }, [isOpen]);

  if (!isOpen) return null;

  const remaining = Math.max(0, totalSlots - usedSlots);
  const pct = Math.round((usedSlots / totalSlots) * 100);

  // Dynamic Month & Calendar Calculation
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed (0 = Jan, 6 = July)

  const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const currentMonthLabel = `${MONTH_NAMES[month]} ${year}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Weekday of 1st day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDayWeekday = new Date(year, month, 1).getDay();

  // Convert to Monday-first grid index: Mon(1)->0, Tue(2)->1, Wed(3)->2, Thu(4)->3, Fri(5)->4, Sat(6)->5, Sun(0)->6
  const paddingOffset = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;
  const paddingArray = Array.from({ length: paddingOffset }, (_, i) => i);

  const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 rounded-xl">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Cek Slot Pengerjaan</h3>
              <p className="text-[10px] text-slate-400">Kapasitas {currentMonthLabel} secara real-time</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4 font-sans">
          {/* Slot metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 text-center">
              <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Sisa Slot</p>
              <p className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">{remaining}</p>
              <p className="text-[9px] text-emerald-700 dark:text-emerald-300 font-semibold mt-0.5">Siap Menerima</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Kuota</p>
              <p className="text-3xl font-black font-mono text-slate-900 dark:text-white">{totalSlots}</p>
              <p className="text-[9px] text-slate-400 mt-0.5">Terisi: {usedSlots}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-slate-500 dark:text-slate-400">Kapasitas terpakai</span>
              <span className={pct >= 80 ? "text-red-500" : "text-blue-600 dark:text-blue-400"}>{pct}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${pct >= 80 ? "bg-red-500" : "bg-blue-600"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Calendar Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">
                Jadwal Studio ({currentMonthLabel})
              </p>
              <div className="flex items-center gap-1.5 text-[9px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Libur
              </div>
            </div>

            {/* Day labels: Senin first */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {DAY_LABELS.map((d) => (
                <div key={d} className="text-[9px] font-black text-slate-400 dark:text-slate-600 py-0.5">{d}</div>
              ))}
            </div>

            {/* Days grid with dynamic weekday padding */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty padding cells before 1st of month */}
              {paddingArray.map((p) => (
                <div key={`pad-${p}`} className="aspect-square" />
              ))}

              {/* Actual month days */}
              {days.map((day) => {
                const isHoliday = holidays.includes(day);
                const isToday = day === now.getDate();
                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg text-[9px] font-bold flex items-center justify-center transition-all ${
                      isHoliday
                        ? "bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-900"
                        : isToday
                        ? "bg-blue-600 text-white shadow-md font-extrabold"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="shrink-0 border-t border-slate-100 dark:border-slate-800 px-5 py-4 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={onProceedOrder}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[12px] font-black shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            {remaining > 0 ? `${remaining} Slot Tersedia — Pesan Sekarang` : "Daftar Waitlist"}
          </button>
        </div>
      </div>
    </div>
  );
}
