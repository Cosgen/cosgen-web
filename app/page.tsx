"use client";

import React, { useState, useEffect } from "react";
import { HeroSection } from "@/components/landing/hero";
import { PortfolioSection } from "@/components/landing/portfolio-masonry";
import { BeforeAfterSliderSection } from "@/components/landing/before-after-slider";
import { PricelistSection } from "@/components/landing/pricelist";
import { FAQSection } from "@/components/landing/faq-accordion";
import { LandingFooter } from "@/components/landing/footer";
import { OrderModal } from "@/components/landing/order-modal";
import { SlotAvailabilityChecker } from "@/components/landing/slot-availability-checker";
import { MobileBottomNav } from "@/components/landing/mobile-bottom-nav";

export default function RootPage() {
  const [orderOpen, setOrderOpen]   = useState(false);
  const [slotOpen, setSlotOpen]     = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("Pertamax");

  // Force scroll to top on refresh (prevents mobile browser restoring scroll to #compare)
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.location.hash) {
        if ("scrollRestoration" in window.history) {
          window.history.scrollRestoration = "manual";
        }
        window.scrollTo(0, 0);
      }
    }
  }, []);

  const openOrder = (pkgName?: string) => {
    if (pkgName) setSelectedPkg(pkgName);
    setOrderOpen(true);
  };

  const scrollTo = (hash: string) => {
    const el = document.querySelector(hash);
    if (el) { el.scrollIntoView({ behavior: "smooth" }); history.replaceState(null, "", hash); }
  };

  // Hide mobile nav when any modal/form is open
  const navHidden = orderOpen || slotOpen;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden relative">
      <HeroSection
        onOpenOrderModal={() => openOrder()}
        onOpenSlotChecker={() => setSlotOpen(true)}
      />

      <PortfolioSection />
      <BeforeAfterSliderSection />
      <PricelistSection onSelectPackage={(pkg) => openOrder(pkg)} />
      <FAQSection />
      <LandingFooter />

      {/* Modals */}
      <OrderModal
        isOpen={orderOpen}
        onClose={() => setOrderOpen(false)}
        initialPackage={selectedPkg}
      />
      <SlotAvailabilityChecker
        isOpen={slotOpen}
        onClose={() => setSlotOpen(false)}
        onProceedOrder={() => { setSlotOpen(false); setOrderOpen(true); }}
      />

      {/* Mobile Bottom Nav — always visible, hidden during form fill */}
      <MobileBottomNav
        hidden={navHidden}
        onOrderClick={() => openOrder()}
        onSlotClick={() => setSlotOpen(true)}
        onStatusClick={() => { window.location.href = "/cek-status"; }}
        onPortfolioClick={() => scrollTo("#portfolio")}
        onPriceClick={() => scrollTo("#pricelist")}
      />
    </div>
  );
}
