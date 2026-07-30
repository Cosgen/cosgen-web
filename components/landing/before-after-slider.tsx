"use client";

import React, { useState } from "react";

export function BeforeAfterSliderSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const beforeImage = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80&sat=-100";
  const afterImage  = "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80";

  const handleMove = (clientX: number, rect: DOMRect) => {
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    setSliderPosition(pct);
  };

  return (
    <section id="compare" className="py-16 sm:py-24" style={{ background: "var(--tf-bg)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <div className="text-center mb-10">
          <div className="tf-section-label mb-5 inline-flex">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/>
            </svg>
            Perbandingan Langsung
          </div>
          <h2
            className="font-headline font-black tracking-tight mb-3"
            style={{ fontSize: "clamp(26px,4vw,44px)", color: "var(--tf-text-primary)" }}
          >
            Before <span style={{ color: "var(--tf-primary)" }}>vs</span> After
          </h2>
          <p className="text-[14px] max-w-sm mx-auto leading-relaxed" style={{ color: "var(--tf-text-secondary)", fontFamily: "'DM Sans',sans-serif" }}>
            Geser slider untuk melihat transformasi foto asli menjadi karya CGI &amp; VFX cinematic.
          </p>
        </div>

        {/* Comparison card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ boxShadow: "var(--tf-shadow-xl)", border: "1px solid var(--tf-border)" }}
        >
          {/* Image area */}
          <div
            className="relative w-full select-none cursor-ew-resize"
            style={{ height: "clamp(240px, 45vw, 460px)" }}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={e => { if (isDragging) handleMove(e.clientX, e.currentTarget.getBoundingClientRect()); }}
            onTouchMove={e => handleMove(e.touches[0].clientX, e.currentTarget.getBoundingClientRect())}
          >
            {/* After — full base */}
            <img src={afterImage} alt="Hasil Edit CGI (After)" className="absolute inset-0 w-full h-full object-cover" />

            {/* After label */}
            <div className="absolute top-3 right-3 z-20">
              <span
                className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide text-white"
                style={{ background: "rgba(59,130,246,0.85)", backdropFilter: "blur(8px)", border: "1px solid rgba(99,159,255,0.4)" }}
              >
                After — CGI Edit
              </span>
            </div>

            {/* Before — clipped */}
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
              <img src={beforeImage} alt="Foto Asli (Before)" className="absolute inset-0 w-full h-full object-cover" style={{ width: "100%", maxWidth: "none" }} />
              <div className="absolute top-3 left-3 z-20">
                <span
                  className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide text-white"
                  style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  Before — Original
                </span>
              </div>
            </div>

            {/* Divider line */}
            <div
              className="absolute top-0 bottom-0 z-30 pointer-events-none"
              style={{ left: `${sliderPosition}%`, width: "2px", background: "rgba(255,255,255,0.9)", boxShadow: "0 0 14px rgba(255,255,255,0.6)" }}
            >
              {/* Drag handle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full flex items-center justify-center pointer-events-auto cursor-ew-resize"
                style={{ background: "#fff", boxShadow: "0 4px 24px rgba(0,0,0,0.5)", border: "3px solid var(--tf-primary)" }}
              >
                <svg className="w-5 h-5" style={{ color: "var(--tf-primary)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/><polyline points="21 18 15 12 21 6"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Range control bar */}
          <div
            className="flex items-center gap-4 px-6 py-4"
            style={{ background: "var(--tf-surface)", borderTop: "1px solid var(--tf-border)" }}
          >
            <span className="text-[10px] font-black uppercase tracking-widest w-14 text-right shrink-0" style={{ color: "var(--tf-text-muted)" }}>
              Before
            </span>
            <input
              type="range" min="0" max="100"
              value={sliderPosition}
              onChange={e => setSliderPosition(Number(e.target.value))}
              className="flex-1 cursor-pointer h-1.5 rounded-full accent-blue-500"
            />
            <span className="text-[10px] font-black uppercase tracking-widest w-14 shrink-0" style={{ color: "var(--tf-primary)" }}>
              After
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
