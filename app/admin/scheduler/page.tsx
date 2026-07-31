"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Save, Plus, Minus, CheckCircle2 } from "lucide-react";
import { getStoredOrders, syncGlobalOrdersFromServer } from "@/lib/order-store";

export default function AdminSchedulerPage() {
  const [totalSlots, setTotalSlots] = useState<number>(5);
  const [usedSlots, setUsedSlots]   = useState<number>(0);
  const [holidays, setHolidays]     = useState<number[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Client-side calendar data to ensure accurate month & weekday alignment
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

  // Dynamic Month & Calendar Calculation
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
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

    // Weekday of 1st day of month (0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat)
    const firstDayWeekday = new Date(year, month, 1).getDay();

    // Convert to Monday-first grid index: Mon(1)->0, Tue(2)->1, Wed(3)->2, Thu(4)->3, Fri(5)->4, Sat(6)->5, Sun(0)->6
    const paddingOffset = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;
    const paddingArray = Array.from({ length: paddingOffset }, (_, i) => i);

    setCalendarData({
      currentMonthLabel,
      days,
      paddingArray,
      todayDate,
    });
  }, []);

  useEffect(() => {
    // 1. Fetch real-time active order count directly from server DB
    const loadRealtimeData = async () => {
      try {
        const res = await fetch(`/api/orders?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.orders && Array.isArray(json.orders)) {
            const activeOrders = json.orders.filter((o: any) => o.status !== "Ditolak");
            setUsedSlots(activeOrders.length);
          }
        }
      } catch (e) {
        const orders = getStoredOrders();
        setUsedSlots(orders.filter((o) => o.status !== "Ditolak").length);
      }

      // 2. Load scheduler settings from server API
      try {
        const res = await fetch(`/api/scheduler?t=${Date.now()}`, { cache: "no-store" });
        const d = await res.json();
        if (d && d.settings) {
          if (typeof d.settings.totalSlots === "number") setTotalSlots(d.settings.totalSlots);
          if (Array.isArray(d.settings.holidays)) setHolidays(d.settings.holidays);
          localStorage.setItem("cosgen_scheduler_data", JSON.stringify(d.settings));
        }
      } catch (e) {
        const savedData = localStorage.getItem("cosgen_scheduler_data");
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            if (typeof parsed.totalSlots === "number") setTotalSlots(parsed.totalSlots);
            if (parsed.holidays && Array.isArray(parsed.holidays)) setHolidays(parsed.holidays);
          } catch {}
        }
      }
    };

    loadRealtimeData();

    const handleUpdate = () => {
      loadRealtimeData();
    };
    window.addEventListener("cosgen_orders_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

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

    try {
      fetch("/api/scheduler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => {});
    } catch {}

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

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
          Pengaturan Slot & Kalender Libur ({calendarData.currentMonthLabel})
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
              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shadow-xs cursor-pointer"
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setTotalSlots(totalSlots + 1)}
              className="w-6 h-6 rounded-md bg-blue-600 hover:bg-blue-700 flex items-center justify-center font-bold text-white text-xs shadow-xs cursor-pointer"
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
              Kalender Pengerjaan Studio ({calendarData.currentMonthLabel})
            </h3>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-semibold flex-wrap">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block" /> Hari Ini
            </span>
            <span className="flex items-center gap-1 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 border border-slate-300 inline-block" /> Masuk
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" /> Libur
            </span>
            <span className="flex items-center gap-1 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-emerald-500 via-emerald-500 50% to-red-500 50% inline-block" /> Hari Ini (Libur)
            </span>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
            <div key={d} className="text-[9px] font-extrabold text-slate-500 uppercase py-0.5">
              {d}
            </div>
          ))}

          {/* Empty padding cells before 1st day of month */}
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
              boxClass = "bg-slate-50 hover:bg-blue-50 text-slate-800 border-slate-200/80";
            }

            return (
              <button
                key={day}
                type="button"
                style={boxStyle}
                onClick={() => toggleHoliday(day)}
                className={`aspect-square rounded-lg text-[10px] transition-all relative border flex flex-col items-center justify-center cursor-pointer ${boxClass}`}
              >
                <span className="leading-none">{day}</span>
                {isToday && isHoliday && (
                  <span className="block text-[6.5px] font-bold mt-0.5 bg-black/40 px-1 rounded text-white leading-none">
                    Hari Ini (Libur)
                  </span>
                )}
                {isToday && !isHoliday && (
                  <span className="block text-[6.5px] font-bold mt-0.5 opacity-90 leading-none">
                    Hari Ini
                  </span>
                )}
                {!isToday && isHoliday && (
                  <span className="block text-[7px] font-normal opacity-90 leading-none">
                    Libur
                  </span>
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
            className="w-fit px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Save className="w-3 h-3" /> Simpan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}
