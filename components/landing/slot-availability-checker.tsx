"use client";

import React, { useState, useEffect } from "react";
import { Calendar, X, Sparkles } from "lucide-react";

interface SlotAvailabilityCheckerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedOrder: () => void;
}

export function SlotAvailabilityChecker({
  isOpen,
  onClose,
  onProceedOrder,
}: SlotAvailabilityCheckerProps) {
  const [totalSlots, setTotalSlots] = useState(25);
  const [usedSlots] = useState(17);
  const [holidays, setHolidays] = useState<number[]>([5, 12, 17, 26]);

  useEffect(() => {
    const savedData = localStorage.getItem("cosgen_scheduler_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.totalSlots) setTotalSlots(parsed.totalSlots);
        if (parsed.holidays) setHolidays(parsed.holidays);
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const remainingSlots = Math.max(0, totalSlots - usedSlots);
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans text-xs">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl max-w-sm w-full p-4 sm:p-5 shadow-2xl border border-slate-100 dark:border-slate-800 relative space-y-3 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-0.5 text-center">
          <div className="w-8 h-8 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mx-auto shadow-xs">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Cek Ketersediaan Slot Pengerjaan
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Kapasitas pengerjaan foto cosplay bulan ini dipantau secara real-time.
          </p>
        </div>

        {/* Status Metrics Box (Compact Balanced Square Cards) */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center flex flex-col items-center justify-center space-y-0.5 aspect-[1.2/1]">
            <span className="text-[9px] font-bold uppercase text-emerald-700 dark:text-emerald-400 tracking-wider block">
              Sisa Slot
            </span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {remainingSlots} Slot
            </div>
            <span className="text-[9px] text-emerald-800 dark:text-emerald-300 font-semibold block">
              Siap Menerima
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-center flex flex-col items-center justify-center space-y-0.5 aspect-[1.2/1]">
            <span className="text-[9px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider block">
              Total Kuota
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {totalSlots} Slot
            </div>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 block">
              Terisi: {usedSlots}
            </span>
          </div>
        </div>

        {/* Calendar View (Balanced Square Days) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 dark:text-slate-300">
            <span>Jadwal Studio:</span>
            <span className="text-[9px] text-red-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> Merah = Libur
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
            {["S", "S", "R", "K", "J", "S", "M"].map((d, i) => (
              <div key={i} className="font-bold text-slate-400 dark:text-slate-500 py-0.5">
                {d}
              </div>
            ))}

            {daysInMonth.map((day) => {
              const isHoliday = holidays.includes(day);
              return (
                <div
                  key={day}
                  className={`aspect-square rounded-md font-bold text-[9px] flex items-center justify-center ${
                    isHoliday
                      ? "bg-red-500 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action CTA */}
        <div className="pt-0.5">
          <button
            type="button"
            onClick={onProceedOrder}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Slot Tersedia — Pesan Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
