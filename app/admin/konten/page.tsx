"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  HelpCircle,
  Tag,
  Sliders,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";

export default function AdminContentManagementPage() {
  const [activeTab, setActiveTab] = useState<"galeri" | "pricelist" | "faq" | "hero">("galeri");

  // Mock Portfolio Content State
  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: "p1",
      title: "Cyberpunk Cyber-Samurai Cosplay",
      category: "Background Premium",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800",
    },
    {
      id: "p2",
      title: "Gothic Anime Alchemist",
      category: "Portrait",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800",
    },
    {
      id: "p3",
      title: "Fantasy Dragon Realm",
      category: "Background Premium",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800",
    },
  ]);

  // Mock FAQ Content State
  const [faqs, setFaqs] = useState([
    {
      id: "f1",
      question: "Berapa lama estimasi pengerjaan foto cosplay saya?",
      answer: "Estimasi pengerjaan ±3 hari kerja efektif setelah disetujui Admin.",
    },
    {
      id: "f2",
      question: "Bagaimana cara pembayaran?",
      answer: "Pembayaran via Midtrans Snap (QRIS, E-wallet, Transfer) setelah ACC Admin.",
    },
  ]);

  // Mock Price List Content State
  const [packages, setPackages] = useState([
    { id: "pkg-1", name: "Pertalite", price: "750000", desc: "Standard Retouching" },
    { id: "pkg-2", name: "Pertamax", price: "1000000", desc: "Fantasy VFX & Cinematic" },
    { id: "pkg-3", name: "Pertamax Turbo", price: "1500000", desc: "Full 3D Background Premium" },
  ]);

  // Form states for adding items
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Background Premium");
  const [newImageUrl, setNewImageUrl] = useState("");

  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  // Add Portfolio Item
  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newItem = {
      id: `p-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      image: newImageUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800",
    };
    setPortfolioItems([...portfolioItems, newItem]);
    setNewTitle("");
    setNewImageUrl("");
    alert("Karya portofolio berhasil ditambahkan!");
  };

  // Add FAQ Item
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    setFaqs([...faqs, { id: `f-${Date.now()}`, question: newFaqQ, answer: newFaqA }]);
    setNewFaqQ("");
    setNewFaqA("");
    alert("FAQ berhasil ditambahkan!");
  };

  // Delete Portfolio
  const handleDeletePortfolio = (id: string) => {
    setPortfolioItems(portfolioItems.filter((i) => i.id !== id));
  };

  // Delete FAQ
  const handleDeleteFaq = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 font-medium text-xs rounded-full">
                Admin CMS
              </span>
              <span className="px-3 py-1 bg-slate-200 text-slate-700 font-medium text-xs rounded-full">
                Manajemen Konten Landing Page
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">
              Kelola Galeri, FAQ & Price List
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Pembaruan di halaman ini akan langsung diperbarui di tampilan Landing Page pelanggan.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          {[
            { id: "galeri", label: "Galeri & Background Premium", icon: ImageIcon },
            { id: "pricelist", label: "Paket & Price List", icon: Tag },
            { id: "faq", label: "FAQ Pertanyaan", icon: HelpCircle },
            { id: "hero", label: "Hero & Slider", icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Galeri & Background Premium */}
        {activeTab === "galeri" && (
          <div className="space-y-6">
            {/* Form Add */}
            <form onSubmit={handleAddPortfolio} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" /> Tambah Item Galeri Portofolio
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Karya</label>
                  <input
                    type="text"
                    required
                    placeholder="Judul foto..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Sub-Bagian</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                  >
                    <option value="Background Premium">Background Premium (Sub-Khusus)</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Landscape">Landscape</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">URL Gambar</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Simpan ke Galeri
              </button>
            </form>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {portfolioItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs relative">
                  <img src={item.image} alt={item.title} className="w-full h-44 object-cover" />
                  <div className="p-4 space-y-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                    <button
                      onClick={() => handleDeletePortfolio(item.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 pt-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus Karya
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Price List */}
        {activeTab === "pricelist" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900">Manajemen Paket & Harga (Price List)</h3>
            <div className="space-y-4">
              {packages.map((pkg, idx) => (
                <div key={pkg.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div>
                    <span className="text-xs font-bold text-blue-600">Paket #{idx + 1}</span>
                    <h4 className="text-sm font-bold text-slate-900">{pkg.name}</h4>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500">Harga (Rp)</label>
                    <input
                      type="number"
                      value={pkg.price}
                      onChange={(e) =>
                        setPackages(
                          packages.map((p) => (p.id === pkg.id ? { ...p, price: e.target.value } : p))
                        )
                      }
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500">Deskripsi Ringkas</label>
                    <input
                      type="text"
                      value={pkg.desc}
                      onChange={(e) =>
                        setPackages(
                          packages.map((p) => (p.id === pkg.id ? { ...p, desc: e.target.value } : p))
                        )
                      }
                      className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-700"
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => alert("Perubahan paket berhasil disimpan!")}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Simpan Perubahan Harga
            </button>
          </div>
        )}

        {/* TAB 3: FAQ */}
        {activeTab === "faq" && (
          <div className="space-y-6">
            <form onSubmit={handleAddFaq} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900">Tambah FAQ Baru</h3>
              <input
                type="text"
                required
                placeholder="Pertanyaan..."
                value={newFaqQ}
                onChange={(e) => setNewFaqQ(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
              <textarea
                rows={2}
                required
                placeholder="Jawaban..."
                value={newFaqA}
                onChange={(e) => setNewFaqA(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
              <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold">
                Tambah FAQ
              </button>
            </form>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">{faq.question}</h4>
                    <p className="text-xs text-slate-600">{faq.answer}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="text-red-500 hover:text-red-700 p-1 text-xs shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Hero & Slider */}
        {activeTab === "hero" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900">Hero Section & Headline Text</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Headline Utama</label>
              <input
                type="text"
                defaultValue="Ubah Foto Cosplay & Karya Kreatif Jadi Mahakarya Epik"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sub-Headline</label>
              <textarea
                rows={2}
                defaultValue="Layanan editing visual profesional untuk Cosplay, Generasi AI, & Background Premium dengan sistem alur pemesanan transparan."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <button
              onClick={() => alert("Pengaturan Hero berhasil disimpan!")}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              Simpan Teks Hero
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
