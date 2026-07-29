"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";

interface AdminLoginFormProps {
  onSuccess?: () => void;
}

export function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (failedAttempts >= 5) {
      setErrorMessage("Akun terkunci sementara karena 5x percobaan gagal (Brute-Force Protection). Silakan tunggu 15 menit.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (email.trim().toLowerCase() === "admin@cosgen.id" && password === "admin123") {
        localStorage.setItem("cosgen_admin_session", "authenticated_session_token");
        if (onSuccess) onSuccess();
        router.push("/admin");
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        if (nextAttempts >= 5) {
          setErrorMessage("Akun terkunci sementara karena 5x percobaan gagal (Brute-Force Protection).");
        } else {
          setErrorMessage(`Email atau Password salah! (Percobaan ${nextAttempts}/5)`);
        }
      }
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Email Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Email Admin <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            required
            placeholder="admin@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || failedAttempts >= 5}
        className={`w-full py-3.5 rounded-2xl text-xs font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
          failedAttempts >= 5
            ? "bg-slate-300 cursor-not-allowed shadow-none"
            : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/25"
        }`}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Memverifikasi Autentikasi...</span>
          </>
        ) : (
          <>
            <span>Masuk ke Dashboard Admin</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
