"use client";

import React, { useState, useEffect } from "react";

const NAV_ITEMS = [
  {
    id: "home",
    label: "Home",
    action: "scroll-top",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    iconActive: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    ),
  },
  {
    id: "portfolio",
    label: "Karya",
    action: "scroll-portfolio",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
    iconActive: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]">
        <path d="M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H3l7-8 4 5 3-3 4 6z"/>
      </svg>
    ),
  },
  {
    id: "order",
    label: "Pesan",
    action: "order",
    isPrimary: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
    iconActive: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-[22px] h-[22px]">
        <path d="M18 6L15 2H9L6 6H2v14a2 2 0 002 2h16a2 2 0 002-2V6h-4z"/>
      </svg>
    ),
  },
  {
    id: "price",
    label: "Harga",
    action: "scroll-price",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    iconActive: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
  },
  {
    id: "status",
    label: "Status",
    action: "status",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    iconActive: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
];

interface MobileBottomNavProps {
  activeTab?: string;
  onOrderClick: () => void;
  onSlotClick: () => void;
  onStatusClick: () => void;
  onPortfolioClick: () => void;
  onPriceClick: () => void;
  hidden?: boolean; // for hiding during form fill
}

export function MobileBottomNav({
  activeTab = "home",
  onOrderClick,
  onSlotClick,
  onStatusClick,
  onPortfolioClick,
  onPriceClick,
  hidden = false,
}: MobileBottomNavProps) {
  const [active, setActive] = useState(activeTab);

  const handleTap = (item: typeof NAV_ITEMS[0]) => {
    setActive(item.id);
    if (item.action === "scroll-top") window.scrollTo({ top: 0, behavior: "smooth" });
    else if (item.action === "scroll-portfolio") onPortfolioClick();
    else if (item.action === "order") onOrderClick();
    else if (item.action === "scroll-price") onPriceClick();
    else if (item.action === "status") onStatusClick();
  };

  if (hidden) return null;

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-[100]"
      style={{
        background: "rgba(9,14,26,0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        paddingBottom: "var(--sab, 0px)",
        transform: "translateZ(0)",   /* force GPU layer — never disappears */
        willChange: "auto",
      }}
    >
      <nav
        className="flex items-center justify-around"
        style={{ height: "var(--bnav-h, 64px)" }}
        aria-label="Mobile navigasi utama"
      >
        {NAV_ITEMS.map(item => {
          const isActive = active === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                onClick={() => handleTap(item)}
                className="flex flex-col items-center justify-center relative"
                style={{ minWidth: 56 }}
              >
                {/* Center FAB-style button */}
                <span
                  className="flex items-center justify-center w-12 h-12 text-white -mt-6"
                  style={{
                    background: "var(--blue)",
                    borderRadius: "10px",
                    boxShadow: "var(--shadow-blue-lg)",
                    border: "2px solid rgba(255,255,255,0.12)",
                  }}
                >
                  {item.icon}
                </span>
                <span
                  className="text-[10px] font-semibold mt-1"
                  style={{ color: "var(--blue)", fontFamily: "'Inter',sans-serif" }}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              onClick={() => handleTap(item)}
              className="flex flex-col items-center justify-center gap-[3px]"
              style={{
                minWidth: 52,
                color: isActive ? "var(--blue)" : "var(--text-3)",
                transition: "color 150ms ease",
              }}
            >
              {isActive ? item.iconActive : item.icon}
              <span
                className="text-[10px] font-semibold"
                style={{ fontFamily: "'Inter',sans-serif" }}
              >
                {item.label}
              </span>
              {isActive && (
                <span
                  className="absolute bottom-0 w-5 h-[2px]"
                  style={{ background: "var(--blue)", borderRadius: "1px" }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
