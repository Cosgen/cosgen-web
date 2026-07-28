"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageCircle,
  AlertTriangle,
  Folder,
  DollarSign,
  Circle,
  FileQuestion,
  Lock,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { OrderInvoiceSummary } from "@/components/landing/order-invoice-summary";
import { MidtransSnapModal } from "@/components/landing/midtrans-snap-modal";
import { OrderRevisionChat } from "@/components/landing/order-revision-chat";
import { ReviewStatusBanner } from "@/components/landing/review-status-banner";
import { getStoredOrders, OrderData, updateSingleOrder, syncGlobalOrdersFromServer } from "@/lib/order-store";

// ── Roadmap steps definition ──────────────────────────────────────────────────
const ROADMAP_STEPS = [
  {
    key: "REQ",
    title: "Form Disubmit",
    description: "Brief & foto referensi diterima sistem",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    key: "Menunggu Konfirmasi",
    title: "Konfirmasi Admin",
    description: "Admin mengulas brief dan menyetujui order",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    key: "Dalam Antrian",
    title: "Dalam Antrian",
    description: "Pesanan masuk antrian resmi (ORD-XXXX)",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
  {
    key: "Sedang Dikerjakan",
    title: "Sedang Dikerjakan",
    description: "Proses CGI & VFX editing aktif (~3 hari kerja)",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
  },
  {
    key: "Review",
    title: "Review Hasil",
    description: "Lihat & setujui hasil edit di GDrive",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    key: "Selesai",
    title: "Pembayaran & Selesai",
    description: "Bayar via Midtrans & unduh file HD",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
  },
];

function getStepIndex(status: OrderData["status"]) {
  switch (status) {
    case "Menunggu Konfirmasi": return 1;
    case "Dalam Antrian": return 2;
    case "Sedang Dikerjakan": return 3;
    case "Review": return 4;
    case "Menunggu Pembayaran": return 4;
    case "Selesai": return 5;
    case "Ditolak": return -1;
    default: return 0;
  }
}

// ── Roadmap Card Component ────────────────────────────────────────────────────
function RoadmapCard({ currentStatus }: { currentStatus: OrderData["status"] }) {
  const currentIdx = getStepIndex(currentStatus);
  const isRejected = currentStatus === "Ditolak";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
          Roadmap Pesanan
        </h3>
      </div>

      <div className="p-5">
        {isRejected ? (
          <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-[12px] font-semibold text-red-700 dark:text-red-300">
              Pesanan ditolak oleh Admin
            </span>
          </div>
        ) : (
          <ol className="relative space-y-0">
            {ROADMAP_STEPS.map((step, idx) => {
              const isDone = currentIdx > idx;
              const isCurrent = currentIdx === idx;
              const isFuture = currentIdx < idx;
              const isLast = idx === ROADMAP_STEPS.length - 1;

              return (
                <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
                  {/* Vertical connector */}
                  {!isLast && (
                    <div
                      className={`absolute left-[15px] top-8 bottom-0 w-px transition-all ${
                        isDone
                          ? "bg-blue-500"
                          : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    />
                  )}

                  {/* Step icon */}
                  <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isDone
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : isCurrent
                      ? "bg-blue-600 text-white ring-4 ring-blue-600/20 shadow-lg shadow-blue-600/30"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600"
                  }`}>
                    {isDone
                      ? <CheckCircle2 className="w-4 h-4" />
                      : isCurrent
                      ? <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      : <Circle className="w-3 h-3 opacity-40" />
                    }
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2">
                      <p className={`text-[12px] font-bold transition-colors ${
                        isDone
                          ? "text-blue-600 dark:text-blue-400"
                          : isCurrent
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-400 dark:text-slate-600"
                      }`}>
                        {step.title}
                      </p>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-[9px] font-black rounded-full uppercase tracking-wide animate-pulse">
                          Sekarang
                        </span>
                      )}
                    </div>
                    {(isCurrent || isDone) && (
                      <p className={`text-[10px] mt-0.5 leading-snug ${
                        isDone
                          ? "text-slate-400 dark:text-slate-600"
                          : "text-slate-500 dark:text-slate-400"
                      }`}>
                        {step.description}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

// ── Main page content ─────────────────────────────────────────────────────────
function CekStatusContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams?.get("code") || "";

  const [inputCode, setInputCode] = useState(initialCode);
  const [allOrders, setAllOrders] = useState<OrderData[]>([]);
  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [snapModalOpen, setSnapModalOpen] = useState(false);
  const [revisionChatOpen, setRevisionChatOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = () => {
      const orders = getStoredOrders();
      setAllOrders(orders);

      const target = (inputCode || initialCode).trim().toUpperCase();
      if (target) {
        const found = orders.find(
          (o) =>
            o.code.toUpperCase() === target ||
            (o.officialCode && o.officialCode.toUpperCase() === target) ||
            (o.tempCode && o.tempCode.toUpperCase() === target)
        );
        if (found) {
          setCurrentOrder(found);
        } else {
          setCurrentOrder(null);
        }
      } else {
        setCurrentOrder(null);
      }
    };

    fetchOrders();
    syncGlobalOrdersFromServer().then(() => fetchOrders());
    const handleUpdate = () => fetchOrders();
    window.addEventListener("cosgen_orders_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("cosgen_orders_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [inputCode, initialCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const clean = inputCode.trim().toUpperCase();
    if (!clean) {
      setCurrentOrder(null);
      return;
    }
    const orders = getStoredOrders();
    const found = orders.find(
      (o) =>
        o.code.toUpperCase() === clean ||
        (o.officialCode && o.officialCode.toUpperCase() === clean) ||
        (o.tempCode && o.tempCode.toUpperCase() === clean)
    );
    if (found) {
      setCurrentOrder(found);
    } else {
      setCurrentOrder(null);
      alert(`Kode pesanan "${clean}" tidak ditemukan.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page title */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.18em]">
          <Search className="w-3 h-3" /> Portal Cek Status
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Lacak Progress Pesanan
        </h1>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Masukkan Kode REQ-XXXX atau ORD-XXXX untuk melacak progress edit foto secara real-time.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Ketik Kode: REQ-8942 / ORD-3302"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl text-[12px] font-mono font-bold uppercase focus:ring-2 focus:ring-blue-600/20 focus:border-blue-400 focus:outline-none shadow-sm placeholder-slate-400 placeholder:normal-case placeholder:font-sans placeholder:font-normal"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[12px] font-bold shadow-md shadow-blue-600/20 shrink-0 transition-all hover:scale-[1.02] active:scale-95"
        >
          Cari
        </button>
      </form>

      {/* BLANK / EMPTY STATE when no order is searched */}
      {!currentOrder && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 max-w-md mx-auto my-6">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/60 rounded-2xl flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 shadow-inner">
            <Search className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              {hasSearched ? "Pesanan Tidak Ditemukan" : "Masukkan Kode Pesanan Kamu"}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {hasSearched
                ? `Kode "${inputCode}" belum terdaftar. Pastikan kamu mengetik Kode REQ-XXXX atau ORD-XXXX dengan benar.`
                : "Ketik Kode REQ-XXXX atau ORD-XXXX pada kolom pencarian di atas untuk memantau progress pengerjaan foto kamu."}
            </p>
          </div>
          <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>Kode pesanan kamu didapatkan setelah mengisi Form Pemesanan.</span>
          </div>
        </div>
      )}

      {/* Order status display */}
      {currentOrder && (
        <div className="space-y-4">
          {/* Header card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Kode Penelusuran</p>
                <div className="text-2xl font-mono font-black text-blue-600 dark:text-blue-400 tracking-tight">
                  {currentOrder.officialCode || currentOrder.code}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Atas Nama: <strong className="text-slate-900 dark:text-white">{currentOrder.customerName}</strong>
                  {" · "}Paket <strong className="text-slate-900 dark:text-white">{currentOrder.package}</strong>
                </p>
              </div>
              <span className={`self-start sm:self-center px-3 py-1.5 rounded-full text-[11px] font-black ${
                currentOrder.status === "Menunggu Konfirmasi"
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                  : currentOrder.status === "Review"
                  ? "bg-violet-100 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 border border-violet-300 dark:border-violet-800"
                  : currentOrder.status === "Selesai"
                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                  : currentOrder.status === "Ditolak"
                  ? "bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800"
                  : "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
              }`}>
                {currentOrder.status}
              </span>
            </div>
          </div>

          {/* Rejection alert */}
          {currentOrder.status === "Ditolak" && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 font-black text-[12px] text-red-700 dark:text-red-400">
                <AlertTriangle className="w-4 h-4 text-red-500" /> Pesanan Ditolak Admin
              </div>
              <p className="text-[11px] text-red-800 dark:text-red-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-red-200 dark:border-red-900">
                <strong>Alasan:</strong> "{currentOrder.rejectionReason || "Penolakan oleh admin."}"
              </p>
            </div>
          )}

          {/* Main 2-col layout (roadmap + details) */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Roadmap card — left, 2 cols */}
            <div className="md:col-span-2">
              <RoadmapCard currentStatus={currentOrder.status} />
            </div>

            {/* Right details — 3 cols */}
            <div className="md:col-span-3 space-y-4">
              {/* Review banner */}
              {currentOrder.status === "Review" && (
                <ReviewStatusBanner
                  orderCode={currentOrder.officialCode || currentOrder.code}
                  gdriveReviewUrl={currentOrder.gdriveReviewUrl}
                  reviewStartedAt={currentOrder.reviewStartedAt}
                  createdAt={currentOrder.createdAt}
                />
              )}

              {/* Payment section — Only appears when status is Menunggu Pembayaran */}
              {currentOrder.status === "Menunggu Pembayaran" && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                      Pembayaran Midtrans
                    </h3>
                    <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[9px] font-black rounded-full border border-emerald-300 dark:border-emerald-800">
                      ✓ ACC Admin — Pembayaran Terbuka
                    </span>
                  </div>
                  <div className="p-5 space-y-3">
                    <OrderInvoiceSummary
                      orderCode={currentOrder.officialCode || currentOrder.code}
                      packageName={currentOrder.package}
                      basePrice={currentOrder.totalAmount}
                      totalAmount={currentOrder.totalAmount}
                    />
                    <button
                      type="button"
                      onClick={() => setSnapModalOpen(true)}
                      className="w-full py-3.5 rounded-xl font-bold text-[12px] bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-4 h-4 text-emerald-300" />
                      <span>Bayar Sekarang (Midtrans Snap / QRIS / VA)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Completed — download */}
              {currentOrder.status === "Selesai" && currentOrder.gdriveFinalUrl && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 font-black text-[12px] text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Pesanan Selesai & Lunas!
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
                    Terima kasih telah mempercayai CosGen.id! Unduh file HD tanpa watermark via Google Drive.
                  </p>
                  <a
                    href={currentOrder.gdriveFinalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[12px] rounded-xl shadow-sm transition-all hover:scale-[1.01]"
                  >
                    <Folder className="w-3.5 h-3.5" /> Unduh File Final HD
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </div>
              )}

              {/* Waiting message for pending states */}
              {(currentOrder.status === "Menunggu Konfirmasi" || currentOrder.status === "Dalam Antrian" || currentOrder.status === "Sedang Dikerjakan") && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-2xl p-5 flex items-start gap-3">
                  <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[12px] font-bold text-blue-900 dark:text-blue-200">
                      {currentOrder.status === "Menunggu Konfirmasi" ? "Menunggu ulasan awal Admin..." :
                       currentOrder.status === "Dalam Antrian" ? "Pesanan dalam antrian pengerjaan." :
                       "Foto kamu sedang dalam proses pengerjaan 🎨"}
                    </p>
                    <p className="text-[11px] text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
                      Estimasi selesai ±3 hari kerja sejak ACC. Mengikuti antrian, tidak dijamin.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {currentOrder && (
        <>
          <MidtransSnapModal
            isOpen={snapModalOpen}
            onClose={() => setSnapModalOpen(false)}
            orderCode={currentOrder.officialCode || currentOrder.code}
            totalAmount={currentOrder.totalAmount}
            customerName={currentOrder.customerName}
            packageName={currentOrder.package}
            onPaymentSuccess={() => {
              updateSingleOrder(currentOrder.id, { status: "Selesai" });
              alert("Pembayaran Berhasil! Status berubah menjadi Selesai.");
            }}
          />
          <OrderRevisionChat
            isOpen={revisionChatOpen}
            onClose={() => setRevisionChatOpen(false)}
            orderCode={currentOrder.officialCode || currentOrder.code}
          />
        </>
      )}
    </div>
  );
}

export default function CekStatusPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col transition-colors">
      <LandingNavbar />
      <main className="flex-1 px-4 py-10 w-full">
        <Suspense fallback={
          <div className="text-center text-[12px] text-slate-400 py-16">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Memuat data pesanan...
          </div>
        }>
          <CekStatusContent />
        </Suspense>
      </main>
      <LandingFooter />
    </div>
  );
}
