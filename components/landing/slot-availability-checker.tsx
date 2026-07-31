"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { getStoredOrders } from "@/lib/order-store";

interface SlotAvailabilityCheckerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedOrder: () => void;
}

export function SlotAvailabilityChecker({ isOpen, onClose, onProceedOrder }: SlotAvailabilityCheckerProps) {
  const [totalSlots, setTotalSlots] = useState(5);
  const [usedSlots, setUsedSlots]   = useState(0);
  const [holidays, setHolidays]     = useState<number[]>([]);

  // Client-calculated calendar state to guarantee exact day-1 weekday placement
  const [calendarData, setCalendarData] = useState<{
    currentMonthLabel: string;
    days: number[];
    paddingArray: number[];
    todayDate: number;
  }>({
    currentMonthLabel: "Bulan Ini",
    days: Array.from({ length: 31 }, (_, i) => i + 1),
    paddingArray: [],
    todayDate: new Date().getDate(),
  });

  // Calculate exact calendar date offset on client side
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed: 0 = Jan, 6 = July
    const todayDate = now.getDate();

    const MONTH_NAMES = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const currentMonthLabel = `${MONTH_NAMES[month]} ${year}`;

    // Total days in current month (28, 29, 30, 31)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Weekday of the 1st of current month (0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat)
    const firstDayWeekday = new Date(year, month, 1).getDay();

    // Convert to Monday-first grid padding: Mon(1)->0, Tue(2)->1, Wed(3)->2, Thu(4)->3, Fri(5)->4, Sat(6)->5, Sun(0)->6
    const paddingOffset = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;
    const paddingArray = Array.from({ length: paddingOffset }, (_, i) => i);

    setCalendarData({
      currentMonthLabel,
      days,
      paddingArray,
      todayDate,
    });
  }, []);

  // Fetch live real-time slots directly from server API whenever opened
  useEffect(() => {
    if (!isOpen) return;

    const loadRealtimeSlots = async () => {
      let ordersToCount: any[] = [];

      // Fetch DIRECTLY from server API — bypasses localStorage for full mobile compatibility
      try {
        const res = await fetch(`/api/orders?t=${Date.now()}&r=${Math.random()}`, {
          method: "GET",
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.orders)) {
            ordersToCount = data.orders;
          }
        }
      } catch (e) {
        console.warn("Direct order fetch notice:", e);
      }

      // Fallback to stored orders if API unavailable
      if (ordersToCount.length === 0) {
        const local = getStoredOrders();
        if (local.length > 0) {
          ordersToCount = local;
        }
      }

      const activeOrders = ordersToCount.filter((o: any) => o.status !== "Ditolak");
      const totalPhotosUsed = activeOrders.reduce(
        (sum: number, o: any) => sum + Math.max(1, Number(o.photo_count || o.photoCount) || 1),
        0
      );
      setUsedSlots(totalPhotosUsed);

      // 2. Load scheduler settings from server API
      try {
        const res = await fetch(`/api/scheduler?t=${Date.now()}`, { cache: "no-store" });
        const d = await res.json();
        if (d && d.settings) {
          if (typeof d.settings.totalSlots === "number" && d.settings.totalSlots > 0) {
            setTotalSlots(d.settings.totalSlots);
          }
          if (Array.isArray(d.settings.holidays)) setHolidays(d.settings.holidays);
          localStorage.setItem("cosgen_scheduler_data", JSON.stringify(d.settings));
        }
      } catch (e) {
        const saved = localStorage.getItem("cosgen_scheduler_data");
        if (saved) {
          try {
            const p = JSON.parse(saved);
            if (typeof p.totalSlots === "number") setTotalSlots(p.totalSlots);
            if (p.holidays && Array.isArray(p.holidays)) setHolidays(p.holidays);
          } catch {}
        }
      }
    };

    loadRealtimeSlots();

    const interval = setInterval(loadRealtimeSlots, 3000);
    const handleUpdate = () => loadRealtimeSlots();
    window.addEventListener("cosgen_orders_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("cosgen_orders_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const remaining = Math.max(0, totalSlots - usedSlots);
  const pct = Math.round((usedSlots / totalSlots) * 100);
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
              <p className="text-[10px] text-slate-400">Kapasitas {calendarData.currentMonthLabel} secara real-time</p>
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
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">
                Jadwal Studio ({calendarData.currentMonthLabel})
              </p>
              <div className="flex items-center gap-2 text-[8.5px] font-semibold text-slate-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-emerald-600 inline-block" /> Hari Ini
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-red-400 inline-block" /> Libur
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-gradient-to-br from-emerald-500 via-emerald-500 50% to-red-500 50% inline-block" /> Today Libur
                </span>
              </div>
            </div>

            {/* Day labels: Senin first */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {DAY_LABELS.map((d) => (
                <div key={d} className="text-[9px] font-black text-slate-400 dark:text-slate-600 py-0.5">{d}</div>
              ))}
            </div>

            {/* Days grid with client-computed padding */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty padding cells before 1st of month */}
              {calendarData.paddingArray.map((p) => (
                <div key={`pad-${p}`} className="aspect-square" />
              ))}

              {/* Actual month days */}
              {calendarData.days.map((day) => {
                const isHoliday = holidays.includes(day);
                const isToday = day === calendarData.todayDate;

                let boxClass = "";
                let boxStyle: React.CSSProperties = {};

                if (isToday && isHoliday) {
                  boxStyle = {
                    background: "linear-gradient(135deg, #10b981 50%, #ef4444 50%)",
                    color: "#ffffff",
                  };
                  boxClass = "text-white font-extrabold shadow-md ring-2 ring-emerald-400 border-0";
                } else if (isToday) {
                  boxClass = "bg-emerald-600 text-white font-extrabold shadow-md ring-2 ring-emerald-400 border-emerald-500";
                } else if (isHoliday) {
                  boxClass = "bg-red-500 text-white font-bold border-red-600 shadow-xs";
                } else {
                  boxClass = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700";
                }

                return (
                  <div
                    key={day}
                    style={boxStyle}
                    className={`aspect-square rounded-lg text-[9px] font-bold flex flex-col items-center justify-center transition-all ${boxClass}`}
                  >
                    <span>{day}</span>
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
