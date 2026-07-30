"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CustomerStep1Form } from "./customer-step1-form";
import { OrderStep2Form, OrderGroup } from "./order-step2-form";
import { OrderSuccessScreen } from "./order-success-screen";
import { TermsConditionsModal } from "./terms-conditions-modal";
import { saveNewSingleOrder, OrderData } from "@/lib/order-store";
import { INITIAL_PACKAGES, ServicePackage } from "@/app/admin/item-jasa/page";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPackage?: string;
}

export function OrderModal({
  isOpen,
  onClose,
  initialPackage = "Pertamax",
}: OrderModalProps) {
  // Step 0: T&C, Step 1: Customer Info, Step 2: Order Detail, Step 3: Success REQ
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  // Selected package state
  const [currentPackage, setCurrentPackage] = useState(initialPackage);
  const [packages, setPackages]             = useState<ServicePackage[]>(INITIAL_PACKAGES);

  // Step 1 State
  const [nickname, setNickname]   = useState("");
  const [whatsapp, setWhatsapp]   = useState("");
  const [instagram, setInstagram] = useState("");

  // Step 2 State
  const [orderGroups, setOrderGroups] = useState<OrderGroup[]>([
    { id: "g-1", characterName: "", brief: "", photoCount: 1 },
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);
  const [customerGdriveUrl, setCustomerGdriveUrl] = useState("");
  const [promoCode, setPromoCode]                 = useState("");

  // Generated REQ Code
  const [reqCode, setReqCode] = useState("");

  // Synchronize dynamic packages from Item & Price List
  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem("cosgen_pricelist_packages");
      if (saved) {
        try { setPackages(JSON.parse(saved)); } catch {}
      }
      fetch(`/api/pricelist?t=${Date.now()}`, { cache: "no-store" })
        .then(r => r.json()).then(d => {
          if (d.packages?.length) setPackages(d.packages);
        }).catch(() => {});
    };
    load();
    window.addEventListener("cosgen_pricelist_updated", load);
    return () => window.removeEventListener("cosgen_pricelist_updated", load);
  }, []);

  if (!isOpen) return null;

  const handleAgreeTc = () => {
    setStep(1);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Generate unique REQ Code
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `REQ-${randomNum}`;
    setReqCode(code);

    // 2. Calculate Package Price & Discounts using live active packages from Item & Price List
    const pkgData = packages.find((p) => p.name === currentPackage) || packages[1] || packages[0];
    const basePrice = pkgData?.price || 650000;
    const adminDiscountPct = pkgData?.discountPercent || 0;
    const isPromoApplied = promoCode.trim().toUpperCase() === "COSGENFIRST";
    const promoDiscountPct = isPromoApplied ? 15 : 0;
    const totalDiscountPct = Math.min(100, adminDiscountPct + promoDiscountPct);
    const discountAmount = Math.round(basePrice * (totalDiscountPct / 100));
    const unitPrice = Math.max(0, basePrice - discountAmount);

    const totalPhotoCount = orderGroups.reduce((sum, g) => sum + (g.photoCount || 1), 0);
    const calculatedTotal = unitPrice * Math.max(1, totalPhotoCount);

    const compiledBrief = orderGroups
      .map((g, idx) => `[Foto ${idx + 1}] Karakter: ${g.characterName || "-"}. Brief: ${g.brief || "-"}`)
      .join(" | ");

    // 3. Create & Save New Order to Storage / DB
    const newOrder: OrderData = {
      id: `ord-${Date.now()}`,
      code: code,
      tempCode: code,
      customerName: nickname.trim() || "Pelanggan Baru",
      whatsapp: whatsapp.trim() || "-",
      instagram: instagram.trim() || "-",
      package: currentPackage,
      photoCount: totalPhotoCount,
      totalAmount: calculatedTotal,
      status: "Menunggu Konfirmasi",
      customerGdriveUrl: customerGdriveUrl || undefined,
      briefText: compiledBrief,
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
    };

    saveNewSingleOrder(newOrder);

    // 4. Move to Success step
    setStep(3);
  };

  return (
    <>
      {step === 0 && (
        <TermsConditionsModal
          isOpen={true}
          onClose={onClose}
          onAgree={handleAgreeTc}
        />
      )}

      {step > 0 && (
        <div className="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 font-sans text-xs">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-slate-100 dark:border-slate-800 relative max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Step Indicators */}
            {step < 3 && (
              <div className="flex items-center gap-1.5 mb-4">
                <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"}`} />
                <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"}`} />
              </div>
            )}

            {step === 1 && (
              <CustomerStep1Form
                selectedPackage={currentPackage}
                setSelectedPackage={setCurrentPackage}
                nickname={nickname}
                setNickname={setNickname}
                whatsapp={whatsapp}
                setWhatsapp={setWhatsapp}
                instagram={instagram}
                setInstagram={setInstagram}
                onNext={() => setStep(2)}
                onBack={onClose}
              />
            )}

            {step === 2 && (
              <OrderStep2Form
                selectedPackage={currentPackage}
                orderGroups={orderGroups}
                setOrderGroups={setOrderGroups}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                customerGdriveUrl={customerGdriveUrl}
                setCustomerGdriveUrl={setCustomerGdriveUrl}
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                onSubmit={handleStep2Submit}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <OrderSuccessScreen
                reqCode={reqCode}
                customerName={nickname}
                onClose={onClose}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
