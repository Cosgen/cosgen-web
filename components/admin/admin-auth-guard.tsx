"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldAlert, Loader2 } from "lucide-react";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Skip auth guard for login page
    if (pathname === "/admin/login") {
      setIsAuthenticated(true);
      return;
    }

    const session = localStorage.getItem("cosgen_admin_session");
    if (!session) {
      setIsAuthenticated(false);
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 text-xs font-semibold">
        <div className="flex items-center gap-2 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span>Memeriksa Sesi Autentikasi Admin...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-3 max-w-sm">
          <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold">Akses Dibatasi (Login Diperlukan)</h3>
          <p className="text-xs text-slate-400">Mengalihkan Anda ke halaman login admin...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
