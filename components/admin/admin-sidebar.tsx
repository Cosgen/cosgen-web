"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  Users,
  BarChart3,
  Package,
  FileText,
  MessageSquare,
  LogOut,
  ExternalLink,
  Tag,
  Ticket,
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/admin/login") return null;

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari Admin Dashboard?")) {
      localStorage.removeItem("cosgen_admin_session");
      router.push("/admin/login");
    }
  };

  const navItems = [
    { label: "Dashboard Ringkasan", href: "/admin", icon: LayoutDashboard },
    { label: "Daftar Pesanan (Full)", href: "/admin/pesanan", icon: ShoppingBag },
    { label: "Scheduler & Slot", href: "/admin/scheduler", icon: Calendar },
    { label: "Ringkasan Bisnis", href: "/admin/ringkasan", icon: BarChart3 },
    { label: "Item & Price List", href: "/admin/item-jasa", icon: Tag },
    { label: "Kode Promo", href: "/admin/promo", icon: Ticket },
    { label: "Manajemen Content", href: "/admin/konten", icon: Package },
    { label: "Editor T&C", href: "/admin/terms", icon: FileText },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-4 space-y-4 text-[11px]">
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <img
              src="https://res.cloudinary.com/or0nvx0c/image/upload/v1785184391/Logo_Putih_01_xozs8n.png"
              alt="CosGen.id Logo White"
              className="h-7 w-auto object-contain"
            />
            <div>
              <h2 className="font-extrabold text-[11px] text-white">CosGen.id</h2>
              <span className="text-[8px] text-blue-400 font-bold uppercase tracking-wider block">
                Admin Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-0.5 font-semibold text-[11px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer & Logout */}
      <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 space-y-2">
        <button
          onClick={handleLogout}
          className="w-full py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors text-[10px]"
        >
          <LogOut className="w-3 h-3" />
          <span>Keluar (Logout)</span>
        </button>

        <Link
          href="/"
          target="_blank"
          className="text-blue-400 hover:underline flex items-center justify-center gap-1 font-medium text-[10px]"
        >
          <span>Ke Landing Page</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navbar Bar */}
      <div className="md:hidden bg-slate-900 text-white px-3 py-2 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <img
            src="https://res.cloudinary.com/or0nvx0c/image/upload/v1785184391/Logo_Putih_01_xozs8n.png"
            alt="CosGen.id Logo White"
            className="h-6 w-auto object-contain"
          />
          <span className="font-extrabold text-[11px]">Admin CosGen</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-1 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors flex items-center gap-1 text-[10px] font-bold"
          >
            <Menu className="w-3.5 h-3.5" /> Menu
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-56 max-w-[75vw] bg-slate-900 text-white h-full shadow-2xl z-50 flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-56 bg-slate-900 text-white shrink-0 flex-col min-h-screen border-r border-slate-800">
        {sidebarContent}
      </aside>
    </>
  );
}
