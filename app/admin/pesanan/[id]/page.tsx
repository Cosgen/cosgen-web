"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Trash2,
  Save,
  User,
  Phone,
  Folder,
  FileText,
} from "lucide-react";
import { getStoredOrders, updateSingleOrder, saveOrdersToStorage, OrderData } from "@/lib/order-store";
import { RejectionReasonModal } from "@/components/admin/rejection-reason-modal";
import { ConfirmAccButton } from "@/components/admin/confirm-acc-button";
import { EditPhotoCountForm } from "@/components/admin/edit-photo-count-form";
import { DeleteOrderModal } from "@/components/admin/delete-order-modal";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.id as string) || "ord-3";

  const [order, setOrder] = useState<OrderData | null>(null);

  // Modals state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [savedStatusNotice, setSavedStatusNotice] = useState(false);

  // Form Inputs
  const [customerGdriveInput, setCustomerGdriveInput] = useState("");
  const [gdriveReviewInput, setGdriveReviewInput] = useState("");
  const [gdriveFinalInput, setGdriveFinalInput] = useState("");

  useEffect(() => {
    const orders = getStoredOrders();
    const found = orders.find((o) => o.id === orderId) || orders[2];
    setOrder(found);
    if (found) {
      setCustomerGdriveInput(found.customerGdriveUrl || "");
      setGdriveReviewInput(found.gdriveReviewUrl || "");
      setGdriveFinalInput(found.gdriveFinalUrl || "");
    }
  }, [orderId]);

  if (!order) return null;

  const saveChanges = (partial: Partial<OrderData>) => {
    const updated = updateSingleOrder(order.id, partial);
    if (updated) setOrder(updated);
    setSavedStatusNotice(true);
    setTimeout(() => setSavedStatusNotice(false), 2500);
  };

  const handleStatusDropdownChange = (newStatus: OrderData["status"]) => {
    saveChanges({
      status: newStatus,
      isAccByAdmin:
        newStatus === "Menunggu Pembayaran" || newStatus === "Selesai"
          ? true
          : order.isAccByAdmin,
    });
  };

  const handleExplicitSave = () => {
    saveChanges({
      customerGdriveUrl: customerGdriveInput,
      gdriveReviewUrl: gdriveReviewInput,
      gdriveFinalUrl: gdriveFinalInput,
    });
  };

  const handleApproveOrder = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const officialCode = `ORD-${randomDigits}`;
    saveChanges({
      officialCode,
      code: officialCode,
      status: "Dalam Antrian",
    });
  };

  const handleConfirmRejection = (reason: string) => {
    saveChanges({
      status: "Ditolak",
      rejectionReason: reason,
    });
  };

  const handleAccSuccess = () => {
    saveChanges({
      status: "Menunggu Pembayaran",
      isAccByAdmin: true,
    });
  };

  return (
    <div className="p-5 sm:p-8 space-y-5 max-w-5xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs">
        <Link
          href="/admin/pesanan"
          className="font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Pesanan
        </Link>
        <div className="flex items-center gap-2">
          {savedStatusNotice && (
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Otomatis Tersimpan & Tersinkron!
            </span>
          )}
          <span className="font-bold text-slate-400 font-mono text-[11px]">
            Database ID: {order.id}
          </span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-md space-y-5">
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black font-mono text-blue-600">
                {order.officialCode || order.code}
              </span>
              {order.tempCode && (
                <span className="text-xs text-slate-400 font-mono">
                  (Awal REQ: {order.tempCode})
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Tanggal Dibuat: {order.createdAt}
            </p>
          </div>

          {/* Status Dropdown Picker for Admin */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 shrink-0">
              Status Order:
            </label>
            <select
              value={order.status}
              onChange={(e) =>
                handleStatusDropdownChange(e.target.value as OrderData["status"])
              }
              className="px-3 py-1.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
            >
              <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
              <option value="Dalam Antrian">Dalam Antrian</option>
              <option value="Sedang Dikerjakan">Sedang Dikerjakan</option>
              <option value="Review">Review</option>
              <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Customer Details & Brief Box */}
        <div className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-slate-400 font-semibold uppercase block text-[10px] mb-0.5">
                Data Pelanggan
              </span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" /> {order.customerName}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold uppercase block text-[10px] mb-0.5">
                Kontak WhatsApp
              </span>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> {order.whatsapp}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold uppercase block text-[10px] mb-0.5">
                Instagram & Paket Jasa
              </span>
              <p className="font-semibold text-slate-800">
                {order.instagram} • Paket {order.package}
              </p>
            </div>
          </div>

          {/* Customer Brief Text */}
          <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl space-y-1">
            <span className="font-bold text-blue-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" /> Deskripsi Brief Pelanggan:
            </span>
            <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-blue-100/80">
              {order.briefText || "Tidak ada deskripsi brief tambahan."}
            </p>
          </div>

          {/* Customer GDrive Link for Raw Files */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Folder className="w-4 h-4 text-blue-600" /> Link GDrive Berkas Mentah Pelanggan:
              </span>
              {customerGdriveInput && (
                <a
                  href={customerGdriveInput}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Buka GDrive Pelanggan
                </a>
              )}
            </div>
            <input
              type="url"
              value={customerGdriveInput}
              onChange={(e) => setCustomerGdriveInput(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/..."
              className="w-full p-2 bg-white rounded-lg border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Dynamic Action Buttons */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Aksi Cepat Admin:
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {order.status === "Menunggu Konfirmasi" && (
              <button
                type="button"
                onClick={handleApproveOrder}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Setujui Order (Ubah ke ORD-XXXX)
              </button>
            )}

            {order.status === "Review" && (
              <ConfirmAccButton
                orderId={order.id}
                orderCode={order.code}
                currentStatus={order.status}
                isAccByAdmin={Boolean(order.isAccByAdmin)}
                onAccSuccess={handleAccSuccess}
              />
            )}

            {order.status !== "Ditolak" && order.status !== "Selesai" && (
              <button
                type="button"
                onClick={() => setRejectModalOpen(true)}
                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 rounded-lg text-xs font-bold"
              >
                <XCircle className="w-3.5 h-3.5 inline mr-1" /> Tolak Pesanan
              </button>
            )}

            {/* Explicit Save Changes Button */}
            <button
              type="button"
              onClick={handleExplicitSave}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 ml-auto"
            >
              <Save className="w-3.5 h-3.5 text-blue-400" /> Simpan Perubahan
            </button>
          </div>
        </div>

        {/* Edit Photo Count */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <EditPhotoCountForm
            currentPhotoCount={order.photoCount}
            onSave={(newCount) => {
              saveChanges({ photoCount: newCount });
            }}
          />
        </div>

        {/* GDrive Links Editor */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
            <ExternalLink className="w-4 h-4 text-blue-600" /> Link GDrive Hasil Edit (Review & Final)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                1. Link GDrive Review (Review Phase)
              </label>
              <input
                type="url"
                value={gdriveReviewInput}
                onChange={(e) => setGdriveReviewInput(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                2. Link GDrive Final (Status Selesai)
              </label>
              <input
                type="url"
                value={gdriveFinalInput}
                onChange={(e) => setGdriveFinalInput(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Delete Action */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold border border-red-200 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Hapus Pesanan
          </button>
        </div>
      </div>

      {/* Modals */}
      <RejectionReasonModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        orderCode={order.code}
        onConfirmRejection={handleConfirmRejection}
      />

      <DeleteOrderModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        orderCode={order.code}
        onConfirmDelete={() => {
          const current = getStoredOrders().filter((o) => o.id !== order.id);
          saveOrdersToStorage(current);
          router.push("/admin/pesanan");
        }}
      />
    </div>
  );
}
