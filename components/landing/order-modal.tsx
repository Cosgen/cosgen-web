"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { CustomerStep1Form } from "./customer-step1-form";
import { OrderStep2Form, OrderGroup } from "./order-step2-form";
import { OrderSuccessScreen } from "./order-success-screen";
import { TermsConditionsModal } from "./terms-conditions-modal";

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

  // Selected package state (user can change inside form)
  const [currentPackage, setCurrentPackage] = useState(initialPackage);

  // Step 1 State
  const [nickname, setNickname] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");

  // Step 2 State
  const [orderGroups, setOrderGroups] = useState<OrderGroup[]>([
    { id: "g-1", characterName: "", brief: "", photoCount: 1 },
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string }[]>([]);
  const [customerGdriveUrl, setCustomerGdriveUrl] = useState("");
  const [promoCode, setPromoCode] = useState("");

  // Generated REQ Code
  const [reqCode, setReqCode] = useState("");

  if (!isOpen) return null;

  const handleAgreeTc = () => {
    setStep(1);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `REQ-${randomNum}`;
    setReqCode(code);
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
