"use client";

import React, { useState, useEffect } from "react";

interface NavItem {
  id: string;
  label: string;
  href?: string;
  action?: () => void;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

interface MobileBottomNavProps {
  activeTab?: string;
  onOrderClick: () => void;
  onSlotClick: () => void;
  onStatusClick: () => void;
  onPortfolioClick: () => void;
  onPriceClick: () => void;
}

// SVG Icons (Outline)
const IconHome = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconHomeFilled = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const IconShoppingBag = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const IconShoppingBagFilled = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18 6L15 2H9L6 6H2v14a2 2 0 002 2h16a2 2 0 002-2V6h-4zM12 17a4 4 0 110-8 4 4 0 010 8z" />
  </svg>
);

const IconImage = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const IconImageFilled = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H3l7-8 4 5 3-3 4 6z" />
  </svg>
);

const IconTag = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const IconTagFilled = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M21.41 11.58l-9-9A2 2 0 0011 2H4a2 2 0 00-2 2v7a2 2 0 00.59 1.42l9 9A2 2 0 0013 22a2 2 0 001.41-.59l7-7A2 2 0 0022 13a2 2 0 00-.59-1.42zM5.5 7A1.5 1.5 0 117 5.5 1.5 1.5 0 015.5 7z" />
  </svg>
);

const IconClipboard = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const IconClipboardFilled = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18 2h-3a2 2 0 00-4 0H8a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2z" />
  </svg>
);

export function MobileBottomNav({
  activeTab = "home",
  onOrderClick,
  onSlotClick,
  onStatusClick,
  onPortfolioClick,
  onPriceClick,
}: MobileBottomNavProps) {
  const [active, setActive] = useState(activeTab);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide on scroll down, show on scroll up (UX: more screen real estate)
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScrollY && current > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleTab = (tabId: string, action?: () => void) => {
    setActive(tabId);
    action?.();
  };

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: IconHome,
      activeIcon: IconHomeFilled,
      action: () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    },
    {
      id: "order",
      label: "Pesan",
      icon: IconShoppingBag,
      activeIcon: IconShoppingBagFilled,
      action: onOrderClick,
    },
    {
      id: "portfolio",
      label: "Karya",
      icon: IconImage,
      activeIcon: IconImageFilled,
      action: onPortfolioClick,
    },
    {
      id: "price",
      label: "Harga",
      icon: IconTag,
      activeIcon: IconTagFilled,
      action: onPriceClick,
    },
    {
      id: "status",
      label: "Status",
      icon: IconClipboard,
      activeIcon: IconClipboardFilled,
      action: onStatusClick,
    },
  ];

  return (
    <div
      className={`
        tf-bottom-nav md:hidden
        transition-transform duration-300 ease-out
        ${visible ? "translate-y-0" : "translate-y-full"}
      `}
      style={{ animation: "tf-slide-bottom 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
    >
      {/* Blur backdrop — dark first */}
      <div
        className="absolute inset-0 backdrop-blur-xl"
        style={{
          background: "rgba(10,15,30,0.92)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      />

      {/* Nav items */}
      <nav
        className="relative flex items-center justify-around px-2 pt-2"
        style={{ height: "64px" }}
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              onClick={() => handleTab(item.id, item.action)}
              className={`
                flex flex-col items-center justify-center gap-0.5
                min-w-[56px] min-h-[48px] px-2 rounded-2xl
                transition-all duration-200 ease-out tf-press-sm
                relative
              `}
              style={{
                color: isActive ? "var(--tf-primary)" : "var(--tf-text-secondary)",
              }}
            >
              {/* Active pill background */}
              {isActive && (
                <span
                  className="absolute inset-x-0 mx-2 top-1 bottom-1 rounded-xl"
                  style={{
                    background: "var(--tf-primary-light)",
                    animation: "tf-scale-in 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards",
                  }}
                />
              )}

              <span className="relative z-10">
                {isActive ? item.activeIcon : item.icon}
              </span>
              <span
                className="relative z-10 text-[10px] font-semibold leading-none"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* iOS safe area spacer */}
      <div style={{ height: "var(--safe-area-bottom, 0px)" }} />
    </div>
  );
}
