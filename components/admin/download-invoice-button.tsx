"use client";

import React, { useState } from "react";
import { Download, FileImage } from "lucide-react";
import { OrderData } from "@/lib/order-store";

interface DownloadInvoiceButtonProps {
  order: OrderData;
}

export function DownloadInvoiceButton({ order }: DownloadInvoiceButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadImageInvoice = () => {
    setIsGenerating(true);

    const canvas = document.createElement("canvas");
    canvas.width = 650;
    canvas.height = 780;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // White background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Outer border
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 10;
      ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

      // Top Header bar
      ctx.fillStyle = "#0F172A"; // Slate 900
      ctx.fillRect(20, 20, canvas.width - 40, 90);

      // Title inside Header
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText("COSGEN.ID — RESI INVOICE RESMI", 40, 60);

      ctx.fillStyle = "#94A3B8";
      ctx.font = "12px sans-serif";
      ctx.fillText("Platform Jasa Edit Foto Cosplay CGI & VFX Next-Gen", 40, 85);

      // Invoice Info Section
      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(`KODE ORDER : ${order.officialCode || order.code}`, 40, 150);

      ctx.fillStyle = "#64748B";
      ctx.font = "12px sans-serif";
      ctx.fillText(`Tanggal Transaksi : ${order.createdAt}`, 40, 175);
      ctx.fillText(`Nama Pelanggan    : ${order.customerName}`, 40, 195);
      ctx.fillText(`Kontak WhatsApp   : ${order.whatsapp}`, 40, 215);
      ctx.fillText(`Username Instagram: ${order.instagram}`, 40, 235);

      // Divider line
      ctx.strokeStyle = "#CBD5E1";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, 260);
      ctx.lineTo(canvas.width - 40, 260);
      ctx.stroke();

      // Rincian Item Table Header
      ctx.fillStyle = "#F8FAFC";
      ctx.fillRect(40, 280, canvas.width - 80, 35);
      ctx.fillStyle = "#334155";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("ITEM / DESKRIPSI PAKET JASA", 55, 302);
      ctx.fillText("JUMLAH FOTO", 380, 302);
      ctx.fillText("SUBTOTAL (RP)", 490, 302);

      // Rincian Row
      ctx.fillStyle = "#0F172A";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(`Paket Edit Cosplay - ${order.package}`, 55, 340);
      ctx.font = "13px sans-serif";
      ctx.fillText(`${order.photoCount} Foto`, 395, 340);
      ctx.font = "bold 13px monospace";
      ctx.fillText(`Rp ${order.totalAmount.toLocaleString("id-ID")}`, 490, 340);

      // Divider line
      ctx.beginPath();
      ctx.moveTo(40, 375);
      ctx.lineTo(canvas.width - 40, 375);
      ctx.stroke();

      // Total Summary Box
      ctx.fillStyle = "#F1F5F9";
      ctx.fillRect(40, 395, canvas.width - 80, 70);

      ctx.fillStyle = "#334155";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("TOTAL PEMBAYARAN :", 60, 435);

      ctx.fillStyle = "#059669"; // Emerald 600
      ctx.font = "bold 20px monospace";
      ctx.fillText(`Rp ${order.totalAmount.toLocaleString("id-ID")}`, 440, 437);

      // Status stamp
      const isPaid = order.status === "Selesai" || order.status === "Menunggu Pembayaran";
      ctx.fillStyle = isPaid ? "#059669" : "#D97706";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(`STATUS: ${order.status.toUpperCase()}`, 40, 505);

      // Disclaimer Notes
      ctx.fillStyle = "#64748B";
      ctx.font = "11px sans-serif";
      ctx.fillText("• Berkas foto referensi dihapus otomatis 2x24 jam setelah status Selesai.", 40, 545);
      ctx.fillText("• Garansi revisi berlaku sesuai ketentuan batas revisi paket yang dipilih.", 40, 565);
      ctx.fillText("• Resi sah diterbitkan secara komputerisasi oleh CosGen.id.", 40, 585);

      // Footer bar
      ctx.fillStyle = "#0F172A";
      ctx.fillRect(20, canvas.height - 70, canvas.width - 40, 50);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("CosGen.id SaaS v2.0 — www.cosgen.id", 40, canvas.height - 40);

      // Download trigger
      const imageURI = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.href = imageURI;
      link.download = `Invoice_CosGen_${order.officialCode || order.code}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setTimeout(() => {
      setIsGenerating(false);
    }, 500);
  };

  return (
    <button
      type="button"
      onClick={handleDownloadImageInvoice}
      disabled={isGenerating}
      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 border border-slate-300 transition-colors"
      title="Unduh Resi Invoice Gambar JPG (Latar Putih)"
    >
      <FileImage className="w-3 h-3 text-blue-600" />
      <span>{isGenerating ? "Memproses..." : "Invoice JPG"}</span>
    </button>
  );
}
