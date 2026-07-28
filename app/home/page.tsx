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

export default function HomePage() {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [slotCheckerOpen, setSlotCheckerOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("Pertamax");

  const handleOpenOrder = (pkgName?: string) => {
    if (pkgName) setSelectedPackage(pkgName);
    setOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-blue-600 selection:text-white">
      {/* Hero Section with Integrated Glass Pill Navbar */}
      <HeroSection
        onOpenOrderModal={() => handleOpenOrder()}
        onOpenSlotChecker={() => setSlotCheckerOpen(true)}
      />

      {/* Portfolio Section */}
      <PortfolioSection />

      {/* Before & After Section */}
      <BeforeAfterSliderSection />

      {/* Pricelist Section */}
      <PricelistSection onSelectPackage={(pkg) => handleOpenOrder(pkg)} />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <LandingFooter />

      {/* Order Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        initialPackage={selectedPackage}
      />

      {/* Slot Availability Checker Modal */}
      <SlotAvailabilityChecker
        isOpen={slotCheckerOpen}
        onClose={() => setSlotCheckerOpen(false)}
        onProceedOrder={() => {
          setSlotCheckerOpen(false);
          setOrderModalOpen(true);
        }}
      />
    </div>
  );
}
