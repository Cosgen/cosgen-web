"use client";

import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

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
    answer: "Estimasi pengerjaan standar adalah ±3 hari kerja efektif setelah pesanan disetujui (ACC) oleh Admin dan masuk ke dalam antrian resmi (ORD-XXXX).",
  },
  {
    id: "faq-2",
    category: "Foto & Kualitas",
    question: "Format dan resolusi foto seperti apa yang disarankan?",
    answer: "Disarankan mengunggah file foto beresolusi tinggi (minimal 2000px atau format kamera DSLR/Mirrorless/RAW). Semakin jelas foto mentah Anda, semakin detail hasil CGI yang dihasilkan.",
  },
  {
    id: "faq-3",
    category: "Pembayaran & Garansi",
    question: "Mengapa tombol 'Bayar Sekarang' di portal terkunci (disabled)?",
    answer: "Tombol pembayaran sengaja terkunci selama status 'Review' untuk memastikan Anda telah memeriksa hasil di GDrive dan menyetujuinya. Setelah Admin menekan 'Konfirmasi ACC', tombol pembayaran akan langsung terbuka.",
  },
  {
    id: "faq-4",
    category: "Privasi & Keamanan",
    question: "Berapa lama foto referensi disimpan di server?",
    answer: "Seluruh foto referensi yang diunggah pelanggan akan dihapus secara otomatis dan permanen 2x24 jam (48 jam) setelah status pesanan berubah menjadi 'Selesai'.",
  },
];

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("faq-1");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = FAQ_LIST.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-12 sm:py-16 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 font-sans transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Section Heading */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Pertanyaan Yang Sering Diajukan (FAQ)
          </h2>
        </div>

        {/* Search Input */}
        <div className="relative max-w-sm mx-auto">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pertanyaan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-blue-600/20 focus:outline-none placeholder-slate-400"
          />
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 text-xs transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800 font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
