"use client";

import React, { useState } from "react";
import { Sliders } from "lucide-react";

export function BeforeAfterSliderSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const beforeImage = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80&sat=-100";
  const afterImage = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80";

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  return (
    <section id="compare" className="py-12 sm:py-16 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 font-sans transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Perbandingan Before & After
          </h2>
        </div>

        {/* Interactive Comparison Slider Box */}
        <div className="bg-slate-900 dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 shadow-xl border border-slate-800 space-y-3">
          <div
            className="relative w-full h-[320px] sm:h-[440px] rounded-xl overflow-hidden select-none cursor-ew-resize"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* After Image */}
            <img
              src={afterImage}
              alt="Hasil Edit CGI (After)"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute top-3 right-3 z-20 px-2.5 py-1 bg-blue-600/90 text-white font-extrabold text-[10px] rounded-full shadow-xs backdrop-blur-xs">
              AFTER (Hasil Edit CGI)
            </span>

            {/* Before Image */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={beforeImage}
                alt="Foto Mentah Studio (Before)"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: "100%", maxWidth: "none" }}
              />
              <span className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-slate-900/90 text-white font-extrabold text-[10px] rounded-full shadow-xs backdrop-blur-xs">
                BEFORE (Foto Asli)
              </span>
            </div>

            {/* Divider Line & Touch Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl z-30"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white text-slate-900 rounded-full shadow-lg border-2 border-blue-600 flex items-center justify-center">
                <Sliders className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Slider Control Range Input */}
          <div className="flex items-center gap-3 px-1">
            <span className="text-[11px] font-bold text-slate-400">BEFORE</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="flex-1 accent-blue-600 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <span className="text-[11px] font-bold text-blue-400">AFTER</span>
          </div>
        </div>
      </div>
    </section>
  );
}
