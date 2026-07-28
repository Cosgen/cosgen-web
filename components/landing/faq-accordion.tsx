"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Minus } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    id: "faq-1",
    category: "Pemesanan & Waktu",
    question: "Berapa lama estimasi pengerjaan foto?",
    answer:
      "Estimasi pengerjaan standar adalah ±3 hari kerja efektif setelah pesanan disetujui (ACC) oleh Admin dan masuk ke dalam antrian resmi (ORD-XXXX).",
  },
  {
    id: "faq-2",
    category: "Foto & Kualitas",
    question: "Format dan resolusi foto seperti apa yang disarankan?",
    answer:
      "Disarankan mengunggah file foto beresolusi tinggi (minimal 2000px atau format kamera DSLR/Mirrorless/RAW). Semakin jelas foto mentah Anda, semakin detail hasil CGI yang dihasilkan.",
  },
  {
    id: "faq-3",
    category: "Pembayaran & Garansi",
    question: "Mengapa tombol 'Bayar Sekarang' di portal terkunci?",
    answer:
      "Tombol pembayaran sengaja terkunci selama status 'Review' untuk memastikan Anda telah memeriksa hasil di GDrive dan menyetujuinya. Setelah Admin menekan 'Konfirmasi ACC', tombol pembayaran akan langsung terbuka.",
  },
  {
    id: "faq-4",
    category: "Privasi & Keamanan",
    question: "Berapa lama foto referensi disimpan di server?",
    answer:
      "Seluruh foto referensi yang diunggah pelanggan akan dihapus secara otomatis dan permanen 2x24 jam (48 jam) setelah status pesanan berubah menjadi 'Selesai'.",
  },
];

export function FAQSection() {
  const [faqs, setFaqs] = useState<FAQItem[]>(FAQ_LIST);
  const [openId, setOpenId] = useState<string | null>("faq-1");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // 1. Instant cache load (0ms flicker)
    try {
      const cached = localStorage.getItem("cosgen_site_content");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.faqs && Array.isArray(parsed.faqs) && parsed.faqs.length > 0) {
          const mapped: FAQItem[] = parsed.faqs.map((item: any, idx: number) => ({
            id: item.id || `faq-${idx}`,
            category: item.category || "",
            question: item.question,
            answer: item.answer,
          }));
          setFaqs(mapped);
        }
      }
    } catch (e) {}

    // 2. Fetch fresh content from cloud
    const loadContent = () => {
      fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (d.content && Array.isArray(d.content.faqs) && d.content.faqs.length > 0) {
            const mapped: FAQItem[] = d.content.faqs.map((item: any, idx: number) => ({
              id: item.id || `faq-${idx}`,
              category: item.category || "",
              question: item.question,
              answer: item.answer,
            }));
            setFaqs(mapped);
            try {
              localStorage.setItem("cosgen_site_content", JSON.stringify(d.content));
            } catch (e) {}
          }
        })
        .catch(() => {});
    };
    loadContent();
    window.addEventListener("cosgen_content_updated", loadContent);
    window.addEventListener("storage", loadContent);
    return () => {
      window.removeEventListener("cosgen_content_updated", loadContent);
      window.removeEventListener("storage", loadContent);
    };
  }, []);

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section
      id="faq"
      className="py-16 sm:py-20 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 transition-colors"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.18em] mb-3">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              FAQ
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Pertanyaan Umum
            </h2>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-[12px] focus:ring-2 focus:ring-blue-600/20 focus:border-blue-400 focus:outline-none placeholder-slate-400 dark:placeholder-slate-600"
            />
          </div>
        </div>

        {/* Accordion */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredFaqs.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-10">
              Tidak ada hasil untuk "{searchQuery}"
            </p>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id} className="group">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full py-5 flex items-start justify-between gap-4 text-left"
                  >
                    <div className="flex-1">
                      <span className={`text-[13px] sm:text-sm font-bold leading-snug transition-colors ${
                        isOpen
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      }`}>
                        {faq.question}
                      </span>
                    </div>
                    <span className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isOpen
                        ? "bg-blue-600 text-white rotate-0"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}>
                      {isOpen
                        ? <Minus className="w-3 h-3" />
                        : <Plus className="w-3 h-3" />
                      }
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pb-5 -mt-1">
                      <p className="text-[12px] sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
