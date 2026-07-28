"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AdminAuthGuard>
      {isLoginPage ? (
        <>{children}</>
      ) : (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto w-full">{children}</main>
        </div>
      )}
    </AdminAuthGuard>
  );
}
