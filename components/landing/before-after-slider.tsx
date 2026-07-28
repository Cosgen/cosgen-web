"use client";

import React, { useState } from "react";

export function BeforeAfterSliderSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const beforeImage =
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80&sat=-100";
  const afterImage =
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80";

  const handleMove = (clientX: number, rect: DOMRect) => {
    let pct = ((clientX - rect.left) / rect.width) * 100;
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    setSliderPosition(pct);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.clientX, e.currentTarget.getBoundingClientRect());
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    handleMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect());
  };

  return (
    <section
      id="compare"
      className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.18em] mb-3">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="12" y1="3" x2="12" y2="21"/>
            </svg>
            Perbandingan Langsung
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Before <span className="text-blue-600">vs</span> After
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
            Geser slider untuk melihat transformasi foto asli menjadi karya CGI & VFX cinematic.
          </p>
        </div>

        {/* Comparison container */}
        <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800">
          {/* Image area */}
          <div
            className="relative w-full h-[300px] sm:h-[480px] select-none cursor-ew-resize"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* After (full width base) */}
            <img
              src={afterImage}
              alt="Hasil Edit CGI (After)"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* After label */}
            <div className="absolute top-4 right-4 z-20">
              <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full shadow-lg tracking-wide uppercase">
                After — CGI Edit
              </span>
            </div>

            {/* Before (clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={beforeImage}
                alt="Foto Asli (Before)"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: "100%", maxWidth: "none" }}
              />
              {/* Before label */}
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-black rounded-full shadow-lg tracking-wide uppercase">
                  Before — Original
                </span>
              </div>
            </div>

            {/* Divider line */}
            <div
              className="absolute top-0 bottom-0 w-px bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.6)] z-30"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Handle */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center ring-4 ring-blue-600/30">
                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                  <polyline points="9 18 3 12 9 6" className="translate-x-3"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Range slider bar */}
          <div className="bg-slate-900 dark:bg-slate-950 px-6 py-4 flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest w-14 text-right shrink-0">Before</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="flex-1 accent-blue-500 cursor-pointer h-1 rounded-full"
            />
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest w-14 shrink-0">After</span>
          </div>
        </div>
      </div>
    </section>
  );
}
