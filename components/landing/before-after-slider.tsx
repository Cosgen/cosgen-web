"use client";

import React, { useState, useRef } from "react";

// Optimized Cloudinary image URLs for high performance & silky smooth mobile dragging
const BEFORE_IMG = "https://res.cloudinary.com/or0nvx0c/image/upload/f_auto,q_auto,w_1000/v1785416895/before_kcaobw.jpg";
const AFTER_IMG  = "https://res.cloudinary.com/or0nvx0c/image/upload/f_auto,q_auto,w_1000/v1785417346/after_eewuyf.jpg";

export function BeforeAfterSliderSection() {
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging]   = useState(false);
  const animRef                   = useRef<number | null>(null);

  const move = (clientX: number, rect: DOMRect) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(() => {
      const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      setSliderPos(pct);
    });
  };

  return (
    <section id="compare" className="section overflow-hidden w-full max-w-full" style={{ background: "var(--bg)" }}>
      <div className="container overflow-hidden max-w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="section-tag mb-4 inline-flex">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/>
            </svg>
            Perbandingan Langsung
          </div>
          <h2 className="headline" style={{ fontSize: "clamp(24px,3.5vw,44px)", color: "var(--text-1)" }}>
            Before <span style={{ color: "var(--blue)" }}>vs</span> After
          </h2>
          <p className="text-[14px] mt-2 max-w-sm mx-auto" style={{ color: "var(--text-2)", fontFamily: "'Inter',sans-serif" }}>
            Geser slider untuk melihat transformasi foto asli menjadi karya CGI &amp; VFX sinematik.
          </p>
        </div>

        {/* Comparison card container */}
        <div
          className="overflow-hidden mx-auto w-full max-w-full"
          style={{
            maxWidth: 860,
            borderRadius: "var(--r-2xl)",
            border: "1px solid var(--border-md)",
            boxShadow: "var(--shadow-xl)",
            background: "var(--surface)",
          }}
        >
          {/* Image area — Fixed aspect ratio 16:9, touch-action: none for zero-lag dragging */}
          <div
            className="relative select-none w-full max-w-full overflow-hidden"
            style={{
              aspectRatio: "16/9",
              minHeight: "220px",
              maxHeight: "520px",
              cursor: "ew-resize",
              touchAction: "none",
              WebkitTouchCallout: "none",
            }}
            onMouseDown={() => setDragging(true)}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onMouseMove={e => { if (dragging) move(e.clientX, e.currentTarget.getBoundingClientRect()); }}
            onTouchStart={e => move(e.touches[0].clientX, e.currentTarget.getBoundingClientRect())}
            onTouchMove={e => move(e.touches[0].clientX, e.currentTarget.getBoundingClientRect())}
          >
            {/* AFTER — Base Layer */}
            <img
              src={AFTER_IMG}
              alt="After — Hasil CGI"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
                display: "block",
                transform: "translateZ(0)",
                margin: 0,
                padding: 0,
              }}
              draggable={false}
            />
            <div className="absolute top-3 right-3 z-20">
              <span className="label label-blue" style={{ fontSize: "10px" }}>After — CGI Edit</span>
            </div>

            {/* BEFORE — Clipped Layer */}
            <img
              src={BEFORE_IMG}
              alt="Before — Foto Asli"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center center",
                display: "block",
                transform: "translateZ(0)",
                margin: 0,
                padding: 0,
                clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                WebkitClipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                willChange: "clip-path",
              }}
              draggable={false}
            />
            <div
              className="absolute top-3 left-3 z-20 transition-opacity duration-150"
              style={{ opacity: sliderPos > 10 ? 1 : 0 }}
            >
              <span
                className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white"
                style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", borderRadius: "var(--r-xs)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                Before — Original
              </span>
            </div>

            {/* Divider line + handle */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${sliderPos}%`,
                width: 2,
                background: "rgba(255,255,255,0.95)",
                boxShadow: "0 0 14px rgba(0,0,0,0.5)",
                zIndex: 30,
                pointerEvents: "none",
                transform: "translateZ(0)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 40,
                  height: 40,
                  background: "var(--surface)",
                  borderRadius: "var(--r-md)",
                  border: "2.5px solid var(--blue)",
                  boxShadow: "var(--shadow-lg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "auto",
                  cursor: "ew-resize",
                }}
              >
                <svg style={{ color: "var(--blue)", width: 18, height: 18 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/><polyline points="21 18 15 12 21 6"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Range control bar */}
          <div
            className="flex items-center gap-4 px-6 py-3.5"
            style={{ background: "var(--surface-2)", borderTop: "1px solid var(--border)" }}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest w-12 text-right shrink-0" style={{ color: "var(--text-3)", fontFamily: "'Inter',sans-serif" }}>Before</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={e => setSliderPos(Number(e.target.value))}
              className="flex-1 cursor-pointer accent-blue-500"
              style={{ height: 4, borderRadius: 2 }}
            />
            <span className="text-[10px] font-bold uppercase tracking-widest w-12 shrink-0" style={{ color: "var(--blue)", fontFamily: "'Inter',sans-serif" }}>After</span>
          </div>
        </div>
      </div>
    </section>
  );
}
