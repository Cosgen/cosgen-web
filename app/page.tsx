"use client";

import React, { useState } from "react";
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
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [slotCheckerOpen, setSlotCheckerOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("Pertamax");

  const handleOpenOrder = (pkgName?: string) => {
    if (pkgName) setSelectedPackage(pkgName);
    setOrderModalOpen(true);
  };

  const scrollToSection = (hash: string) => {
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", hash);
    }
  };

  return (
    <div className="min-h-screen selection:bg-blue-500 selection:text-white">
      {/* Hero — has its own top navbar (mobile) + desktop floating nav */}
      <HeroSection
        onOpenOrderModal={() => handleOpenOrder()}
        onOpenSlotChecker={() => setSlotCheckerOpen(true)}
      />

      {/* Portfolio */}
      <PortfolioSection />

      {/* Before & After */}
      <BeforeAfterSliderSection />

      {/* Pricelist */}
      <PricelistSection onSelectPackage={(pkg) => handleOpenOrder(pkg)} />

      {/* FAQ */}
      <FAQSection />

      {/* Footer */}
      <LandingFooter />

      {/* Modals */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        initialPackage={selectedPackage}
      />

      <SlotAvailabilityChecker
        isOpen={slotCheckerOpen}
        onClose={() => setSlotCheckerOpen(false)}
        onProceedOrder={() => {
          setSlotCheckerOpen(false);
          setOrderModalOpen(true);
        }}
      />

      {/* Mobile Bottom Nav (mobile only ≤768px) */}
      <MobileBottomNav
        onOrderClick={() => handleOpenOrder()}
        onSlotClick={() => setSlotCheckerOpen(true)}
        onStatusClick={() => { window.location.href = "/cek-status"; }}
        onPortfolioClick={() => scrollToSection("#portfolio")}
        onPriceClick={() => scrollToSection("#pricelist")}
      />
    </div>
  );
}
