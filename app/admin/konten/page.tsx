"use client";

import React, { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  HelpCircle,
  Tag,
  Sliders,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { SiteContentData, DEFAULT_SITE_CONTENT, PortfolioItem, FaqItem, HeroContent } from "@/app/api/content/route";

const getAdminCachedContent = () => {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem("cosgen_site_content");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
  }
  return null;
};

export default function AdminContentManagementPage() {
  const [activeTab, setActiveTab] = useState<"galeri" | "faq" | "hero">("hero");

  // Site Content State
  const [hero, setHero] = useState<HeroContent>(() => getAdminCachedContent()?.hero || { headline: "", subheadline: "", ctaText: "" });
  const [faqs, setFaqs] = useState<FaqItem[]>(() => getAdminCachedContent()?.faqs || []);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() => getAdminCachedContent()?.portfolio || []);
  const [savedNotice, setSavedNotice] = useState(false);

  // Form states for adding items
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Background Premium");
  const [newImageUrl, setNewImageUrl] = useState("");

  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  // Load content from server API on mount
  useEffect(() => {
    fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.content) {
          if (d.content.hero) setHero(d.content.hero);
          if (Array.isArray(d.content.faqs)) setFaqs(d.content.faqs);
          if (Array.isArray(d.content.portfolio)) setPortfolioItems(d.content.portfolio);
          try {
            localStorage.setItem("cosgen_site_content", JSON.stringify(d.content));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  const saveContentToCloud = async (updatedContent: SiteContentData) => {
    try {
      try {
        localStorage.setItem("cosgen_site_content", JSON.stringify(updatedContent));
      } catch (e) {}
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: updatedContent }),
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cosgen_content_updated"));
      }
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    } catch (e) {
      console.error("Failed to save content:", e);
    }
  };

  // Save Hero Section Text
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteContentData = {
      hero,
      faqs,
      portfolio: portfolioItems,
    };
    saveContentToCloud(updated);
  };

  // Add Portfolio Item
  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newItem: PortfolioItem = {
      id: `p-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      image: newImageUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800",
      beforeImage: newImageUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800",
      afterImage: newImageUrl || "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800",
    };
    const updatedPortfolio = [...portfolioItems, newItem];
    setPortfolioItems(updatedPortfolio);
    setNewTitle("");
    setNewImageUrl("");

    saveContentToCloud({
      hero,
      faqs,
      portfolio: updatedPortfolio,
    });
  };

  // Delete Portfolio Item
  const handleDeletePortfolio = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus karya portofolio ini?")) {
      const updatedPortfolio = portfolioItems.filter((i) => i.id !== id);
      setPortfolioItems(updatedPortfolio);
      saveContentToCloud({
        hero,
        faqs,
        portfolio: updatedPortfolio,
      });
    }
  };

  // Add FAQ Item
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    const newFaq: FaqItem = {
      id: `f-${Date.now()}`,
      question: newFaqQ,
      answer: newFaqA,
    };
    const updatedFaqs = [...faqs, newFaq];
    setFaqs(updatedFaqs);
    setNewFaqQ("");
    setNewFaqA("");

    saveContentToCloud({
      hero,
      faqs: updatedFaqs,
      portfolio: portfolioItems,
    });
  };

  // Delete FAQ Item
  const handleDeleteFaq = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pertanyaan FAQ ini?")) {
      const updatedFaqs = faqs.filter((f) => f.id !== id);
      setFaqs(updatedFaqs);
      saveContentToCloud({
        hero,
        faqs: updatedFaqs,
        portfolio: portfolioItems,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 sm:p-10 text-xs">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 font-bold text-[10px] rounded-full">
                Admin CMS
              </span>
              <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 font-bold text-[10px] rounded-full">
                Manajemen Konten Landing Page
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Kelola Headline Hero, Galeri & FAQ
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Setiap perubahan judul, sub-headline, galeri portofolio, & FAQ di sini akan <strong>otomatis tersambung & sinkron live</strong> ke Landing Page pelanggan.
            </p>
          </div>

          {savedNotice && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 flex items-center gap-1.5 shadow-xs animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Konten Berhasil Dipublis Ke Landing Page!
            </span>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          {[
            { id: "hero", label: "Hero & Headline Utama", icon: Sliders },
            { id: "galeri", label: "Galeri Portofolio & Slider", icon: ImageIcon },
            { id: "faq", label: "FAQ Pertanyaan Umum", icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
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

        {/* TAB 1: Hero & Headline */}
        {activeTab === "hero" && (
          <form onSubmit={handleSaveHero} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600" /> Pengaturan Headline Utama & Sub-Headline Landing Page
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Ubah teks judul utama yang pertama kali dilihat oleh pengunjung website.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Headline Utama (H1) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={hero.headline}
                onChange={(e) => setHero({ ...hero, headline: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-extrabold focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sub-Headline Deskripsi Singkat <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={hero.subheadline}
                onChange={(e) => setHero({ ...hero, subheadline: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600/20 focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Gaya Font Headline Utama & Sub-Headline
              </label>
              <select
                value={hero.fontFamily || "sans"}
                onChange={(e) => setHero({ ...hero, fontFamily: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-blue-600/20 focus:outline-none cursor-pointer"
              >
                <option value="sans">Sans-Serif Modern (Inter / Outfit / Clean)</option>
                <option value="playfair">Playfair Display (Serif Classic Epik)</option>
                <option value="poppins">Poppins / Montserrat (Cinematic Bold Display)</option>
                <option value="serif">Merriweather / Georgia (Elegant Serif)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teks Tombol CTA Utama
              </label>
              <input
                type="text"
                value={hero.ctaText || "Pesan Jasa Edit Sekarang"}
                onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <Save className="w-4 h-4" /> Simpan & Publis Teks Hero Ke Landing Page
            </button>
          </form>
        )}

        {/* TAB 2: Galeri & Portofolio */}
        {activeTab === "galeri" && (
          <div className="space-y-6">
            {/* Form Add */}
            <form onSubmit={handleAddPortfolio} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" /> Tambah Karya Portofolio Baru
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Karya <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Cyberpunk Samurai Cosplay"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Portofolio</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                  >
                    <option value="Background Premium">Background Premium (CGI/VFX)</option>
                    <option value="Portrait">Portrait Retouching</option>
                    <option value="Fantasy">Fantasy & Magic Effect</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL Gambar Hasil Edit</label>
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
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                + Tambah & Publis Ke Portofolio
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
                      type="button"
                      onClick={() => handleDeletePortfolio(item.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 pt-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus Karya Ini
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FAQ */}
        {activeTab === "faq" && (
          <div className="space-y-6">
            <form onSubmit={handleAddFaq} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" /> Tambah Pertanyaan FAQ Baru
              </h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pertanyaan FAQ <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Berapa lama estimasi pengerjaan?"
                  value={newFaqQ}
                  onChange={(e) => setNewFaqQ(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jawaban FAQ <span className="text-red-500">*</span></label>
                <textarea
                  rows={2}
                  required
                  placeholder="Jawaban penjelasan..."
                  value={newFaqA}
                  onChange={(e) => setNewFaqA(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                />
              </div>
              <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer">
                + Tambah FAQ & Publis
              </button>
            </form>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-white p-4.5 rounded-2xl border border-slate-200 flex items-start justify-between gap-4 shadow-xs">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">{faq.question}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
