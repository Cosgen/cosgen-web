"use client";

import React, { useState, useEffect } from "react";

interface FAQItem { id: string; question: string; answer: string; }

const DEFAULTS: FAQItem[] = [
  { id: "1", question: "Berapa lama estimasi pengerjaan?", answer: "Estimasi ±3 hari kerja efektif setelah pesanan ACC dan masuk antrian resmi. Tidak dijamin karena mengikuti antrian." },
  { id: "2", question: "Format dan resolusi foto yang disarankan?", answer: "Minimal 2000px, format DSLR/Mirrorless/RAW. Semakin jernih foto asli, semakin detail hasil CGI-nya." },
  { id: "3", question: "Kenapa tombol 'Bayar' terkunci?", answer: "Tombol pembayaran terbuka setelah kamu melihat preview di GDrive dan Admin menekan 'Konfirmasi ACC'." },
  { id: "4", question: "Berapa lama foto disimpan di server?", answer: "Foto referensi dihapus otomatis 48 jam setelah status pesanan berubah jadi 'Selesai'." },
  { id: "5", question: "Bagaimana jika hasil tidak sesuai ekspektasi?", answer: "Kami menyediakan revisi sesuai paket yang dipilih. Pastikan brief awal sudah jelas untuk hasil optimal." },
];

export function FAQSection() {
  const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULTS);
  const [openId, setOpenId] = useState<string | null>("1");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem("cosgen_site_content") || "null");
      if (c?.faqs?.length) setFaqs(c.faqs.map((f: any, i: number) => ({ id: f.id || `f${i}`, question: f.question, answer: f.answer })));
    } catch {}
    const load = () => {
      fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" })
        .then(r => r.json()).then(d => {
          if (d.content?.faqs?.length) {
            setFaqs(d.content.faqs.map((f: any, i: number) => ({ id: f.id || `f${i}`, question: f.question, answer: f.answer })));
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
    f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="faq" className="section" style={{ background: "var(--bg-1)" }}>
      <div className="container">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
          <div className="md:w-1/2">
            <div className="section-tag mb-3">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              FAQ
            </div>
            <h2 className="headline" style={{ fontSize: "clamp(24px,3.5vw,44px)", color: "var(--text-1)" }}>
              Pertanyaan<br />yang Sering Ditanya
            </h2>
          </div>

          <div className="md:w-[320px]">
            {/* Search */}
            <div className="relative mb-3">
              <svg className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-3)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Cari pertanyaan..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pl-10"
                style={{ fontSize: "13px", minHeight: "40px" }}
              />
            </div>
            <p className="text-[12px]" style={{ color: "var(--text-3)", fontFamily: "'Inter',sans-serif" }}>
              {filtered.length} pertanyaan tersedia
            </p>
          </div>
        </div>

        {/* ── Accordion ───────────────────────────────────────── */}
        <div
          className="divide-y"
          style={{ borderRadius: "var(--r-xl)", border: "1px solid var(--border)", overflow: "hidden" }}
        >
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-[13px]" style={{ color: "var(--text-3)" }}>
              Tidak ditemukan untuk &ldquo;{search}&rdquo;
            </p>
          ) : filtered.map((faq, idx) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} style={{ borderTop: idx > 0 ? "1px solid var(--border)" : undefined }}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                  style={{
                    background: isOpen ? "rgba(59,130,246,0.06)" : "var(--surface)",
                    minHeight: "58px",
                    transition: "background 140ms ease",
                  }}
                >
                  <span
                    className="text-[13px] font-semibold flex-1 leading-snug"
                    style={{ color: isOpen ? "var(--blue)" : "var(--text-1)", fontFamily: "'Inter',sans-serif" }}
                  >
                    {faq.question}
                  </span>
                  <span
                    className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isOpen ? "var(--blue)" : "var(--surface-2)",
                      borderRadius: "var(--r-xs)",
                      color: isOpen ? "#fff" : "var(--text-2)",
                      transition: "all 160ms ease",
                      transform: isOpen ? "rotate(45deg)" : "none",
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
                    style={{
                      background: "rgba(59,130,246,0.04)",
                      animation: "slide-up 0.2s ease forwards",
                    }}
                  >
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)", fontFamily: "'Inter',sans-serif" }}>
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
