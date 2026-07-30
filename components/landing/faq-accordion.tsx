"use client";

import React, { useState, useEffect } from "react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_DEFAULT: FAQItem[] = [
  { id: "faq-1", category: "Waktu", question: "Berapa lama estimasi pengerjaan foto?", answer: "Estimasi pengerjaan standar adalah ±3 hari kerja efektif setelah pesanan disetujui (ACC) dan masuk antrian resmi (ORD-XXXX)." },
  { id: "faq-2", category: "Kualitas", question: "Format dan resolusi foto seperti apa yang disarankan?", answer: "Disarankan mengunggah file beresolusi tinggi (minimal 2000px atau format DSLR/Mirrorless/RAW). Semakin jelas foto mentah Anda, semakin detail hasil CGI yang dihasilkan." },
  { id: "faq-3", category: "Pembayaran", question: "Mengapa tombol 'Bayar Sekarang' di portal terkunci?", answer: "Tombol pembayaran sengaja terkunci selama status 'Review' untuk memastikan Anda telah memeriksa hasil di GDrive dan menyetujuinya. Setelah Admin menekan 'Konfirmasi ACC', tombol pembayaran langsung terbuka." },
  { id: "faq-4", category: "Privasi", question: "Berapa lama foto referensi disimpan di server?", answer: "Seluruh foto referensi yang diunggah pelanggan dihapus secara otomatis dan permanen 2x24 jam (48 jam) setelah status pesanan berubah menjadi 'Selesai'." },
];

export function FAQSection() {
  const [faqs, setFaqs] = useState<FAQItem[]>(FAQ_DEFAULT);
  const [openId, setOpenId] = useState<string | null>("faq-1");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load cache instantly
    try {
      const cached = localStorage.getItem("cosgen_site_content");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.faqs?.length) {
          setFaqs(parsed.faqs.map((item: any, idx: number) => ({
            id: item.id || `faq-${idx}`, category: item.category || "",
            question: item.question, answer: item.answer,
          })));
        }
      }
    } catch {}

    // Fetch fresh
    const load = () => {
      fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" })
        .then(r => r.json())
        .then(d => {
          if (d.content?.faqs?.length) {
            setFaqs(d.content.faqs.map((item: any, idx: number) => ({
              id: item.id || `faq-${idx}`, category: item.category || "",
              question: item.question, answer: item.answer,
            })));
            try { localStorage.setItem("cosgen_site_content", JSON.stringify(d.content)); } catch {}
          }
        }).catch(() => {});
    };
    load();
    window.addEventListener("cosgen_content_updated", load);
    window.addEventListener("storage", load);
    return () => { window.removeEventListener("cosgen_content_updated", load); window.removeEventListener("storage", load); };
  }, []);

  const filtered = faqs.filter(f =>
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-16 sm:py-24" style={{ background: "var(--tf-surface)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
          <div>
            <div className="tf-section-label mb-4 inline-flex">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              FAQ
            </div>
            <h2 className="font-headline font-black tracking-tight" style={{ fontSize: "clamp(28px,4vw,48px)", color: "var(--tf-text-primary)" }}>
              Ada Pertanyaan?
            </h2>
          </div>
          {/* Search */}
          <div className="relative w-full sm:w-60">
            <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--tf-text-tertiary)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="tf-input pl-10"
              style={{ fontSize: "13px", minHeight: "42px" }}
            />
          </div>
        </div>

        {/* Accordion */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--tf-border)" }}>
          {filtered.length === 0 ? (
            <p className="text-center py-12 text-[14px]" style={{ color: "var(--tf-text-tertiary)" }}>
              Tidak ada hasil untuk &ldquo;{searchQuery}&rdquo;
            </p>
          ) : filtered.map((faq, idx) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} style={{ borderTop: idx > 0 ? `1px solid var(--tf-border)` : undefined }}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left transition-colors"
                  style={{
                    background: isOpen ? "rgba(59,130,246,0.08)" : "transparent",
                    minHeight: "60px",
                  }}
                >
                  <span
                    className="flex-1 text-[14px] font-semibold leading-snug"
                    style={{
                      color: isOpen ? "var(--tf-primary)" : "var(--tf-text-primary)",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    {faq.question}
                  </span>
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isOpen ? "var(--tf-primary)" : "var(--tf-surface-2)",
                      color: isOpen ? "#fff" : "var(--tf-text-secondary)",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 200ms ease, background 200ms ease",
                    }}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div
                    className="px-5 pb-5"
                    style={{ animation: "tf-slide-up 0.22s ease forwards" }}
                  >
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--tf-text-secondary)", fontFamily: "'DM Sans',sans-serif" }}>
                      {faq.answer}
                    </p>
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
