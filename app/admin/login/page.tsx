"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white text-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 relative">
        {/* Back Link */}
        <Link
          href="/"
          className="text-xs font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke CosGen.id
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Login Admin CosGen.id
          </h1>
          <p className="text-xs text-slate-500">
            Masukan akun administrator resmi untuk mengelola antrian pesanan & kasir.
          </p>
        </div>

        {/* Auth Form */}
        <AdminLoginForm />
      </div>
    </div>
  );
}
