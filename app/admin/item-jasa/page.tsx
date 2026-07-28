"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Power, Check, Tag } from "lucide-react";
import { ServicePackageFormModal } from "@/components/admin/service-package-form-modal";

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  discountPercent?: number;
  revisionLimit: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export const INITIAL_PACKAGES: ServicePackage[] = [
  {
    id: "pkg-1",
    name: "Pertalite",
    price: 350000,
    discountPercent: 10,
    revisionLimit: "Revisi Max 1x",
    description: "Cocok untuk edit foto cosplay simpel dengan retouch pencahayaan dasar.",
    features: [
      "Retouch Wajah & Kulit Dasar",
      "Color Grading Natural",
      "Background Cleanup Standard",
      "Format Output JPG HD",
    ],
    isActive: true,
  },
  {
    id: "pkg-2",
    name: "Pertamax",
    price: 650000,
    discountPercent: 15,
    revisionLimit: "Revisi Max 2x",
    description: "Paket paling populer untuk manipulasi latar 3D dan aura energi sihir.",
    features: [
      "Semua Fitur Paket Pertalite",
      "Efek Aura Sihir & Petir 3D",
      "Ganti Latar Belakang (VFX City/Fantasy)",
      "Blending Lighting Realistis & Glow",
    ],
    isPopular: true,
    isActive: true,
  },
  {
    id: "pkg-3",
    name: "Pertamax Turbo",
    price: 1200000,
    discountPercent: 20,
    revisionLimit: "Revisi Bebas (Unlimited)",
    description: "Hasil kualitas bioskop cinematic dengan compositing latar visual kompleks.",
    features: [
      "Semua Fitur Paket Pertamax",
      "Full CGI Compositing & Particle Effects",
      "Perbaikan Prop & Senjata Metalik",
      "Format Lossless PNG 4K + File Master",
    ],
    isActive: true,
  },
];

export default function AdminItemJasaPage() {
  const [packages, setPackages] = useState<ServicePackage[]>(INITIAL_PACKAGES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<ServicePackage | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cosgen_pricelist_packages");
    if (saved) {
      try {
        setPackages(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    fetch(`/api/pricelist?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.packages && Array.isArray(d.packages) && d.packages.length > 0) {
          setPackages(d.packages);
          localStorage.setItem("cosgen_pricelist_packages", JSON.stringify(d.packages));
        }
      })
      .catch(() => {});
  }, []);

  const saveToStorage = async (updated: ServicePackage[]) => {
    setPackages(updated);
    localStorage.setItem("cosgen_pricelist_packages", JSON.stringify(updated));
    window.dispatchEvent(new Event("cosgen_pricelist_updated"));

    try {
      await fetch("/api/pricelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packages: updated }),
      });
    } catch {}
  };

  const handleToggleActive = (id: string) => {
    const updated = packages.map((p) =>
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    saveToStorage(updated);
  };

  const handleDeletePackage = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus paket "${name}"?`)) {
      const updated = packages.filter((p) => p.id !== id);
      saveToStorage(updated);
    }
  };

  const handleSaveModal = (data: Partial<ServicePackage>) => {
    if (editingPkg) {
      const updated = packages.map((p) =>
        p.id === editingPkg.id ? ({ ...p, ...data } as ServicePackage) : p
      );
      saveToStorage(updated);
    } else {
      const newPkg: ServicePackage = {
        id: `pkg-${Date.now()}`,
        name: data.name || "Paket Baru",
        price: data.price || 500000,
        discountPercent: data.discountPercent || 0,
        revisionLimit: data.revisionLimit || "Revisi Max 2x",
        description: data.description || "",
        features: data.features || ["Benefit 1", "Benefit 2"],
        isPopular: data.isPopular || false,
        isActive: true,
      };
      saveToStorage([...packages, newPkg]);
    }
  };

  return (
    <div className="p-3 sm:p-5 space-y-4 max-w-5xl mx-auto font-sans text-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-200 pb-2.5">
        <div>
          <div className="flex items-center gap-1">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded-full">
              Admin Portal
            </span>
            <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-bold rounded-full">
              CMS Pricelist
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mt-0.5">
            Manajemen Item & Price List (Diskon & Benefit)
          </h1>
          <p className="text-[10px] sm:text-[11px] text-slate-500">
            Atur harga dasar, persentase diskon, batas revisi, dan status aktif/nonaktif paket jasa.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingPkg(null);
            setModalOpen(true);
          }}
          className="w-fit px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold shadow-xs flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Tambah Paket Jasa Baru
        </button>
      </div>

      {/* Package Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`rounded-2xl p-4 border space-y-3 flex flex-col justify-between transition-all relative ${
              pkg.isActive
                ? "bg-white border-slate-200/90 shadow-xs"
                : "bg-slate-50 border-slate-200/60 opacity-60"
            }`}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold text-slate-900">{pkg.name}</h3>
                  {pkg.discountPercent && pkg.discountPercent > 0 ? (
                    <span className="px-1.5 py-0.5 bg-red-100 text-red-600 border border-red-200 text-[8px] font-extrabold rounded">
                      Diskon {pkg.discountPercent}%
                    </span>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleActive(pkg.id)}
                  className={`px-2 py-0.5 rounded-full text-[8px] font-bold border transition-colors flex items-center gap-0.5 ${
                    pkg.isActive
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-slate-200 text-slate-600 border-slate-300"
                  }`}
                >
                  <Power className="w-2.5 h-2.5" />
                  <span>{pkg.isActive ? "AKTIF" : "NONAKTIF"}</span>
                </button>
              </div>

              <p className="text-[10px] text-slate-500 min-h-[28px]">{pkg.description}</p>

              <div className="border-t border-b border-slate-100 py-2">
                <span className="text-lg font-black font-mono text-slate-900">
                  Rp {pkg.price.toLocaleString("id-ID")}
                </span>
                <span className="text-[10px] font-semibold text-blue-600 block">
                  ✓ {pkg.revisionLimit}
                </span>
              </div>

              <ul className="space-y-1.5 text-[10px] text-slate-600">
                {pkg.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-blue-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setEditingPkg(pkg);
                  setModalOpen(true);
                }}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1"
              >
                <Edit3 className="w-3 h-3" /> Ubah Data & Diskon
              </button>

              <button
                type="button"
                onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-200"
                title="Hapus Paket"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      <ServicePackageFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingPkg}
        onSave={handleSaveModal}
      />
    </div>
  );
}
