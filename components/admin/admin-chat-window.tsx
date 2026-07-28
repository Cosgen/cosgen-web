"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  User,
  ShieldCheck,
  Bot,
  ExternalLink,
  Sparkles,
  FileText,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { ChatThread } from "@/app/admin/chat/page";

interface AdminChatWindowProps {
  thread: ChatThread;
  onSendMessage: (text: string) => void;
}

export function AdminChatWindow({
  thread,
  onSendMessage,
}: AdminChatWindowProps) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handleInsertQuickTemplate = (template: string) => {
    setInputText(template);
  };

  return (
    <div className="flex flex-col h-full justify-between bg-white">
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-xs">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{thread.customerName}</h3>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="font-mono font-bold text-blue-600">{thread.orderCode}</span>
              <span>•</span>
              <span className="px-2 py-0.5 bg-slate-200 text-slate-700 font-medium rounded-md">
                {thread.channel}
              </span>
            </div>
          </div>
        </div>

        <Link
          href={`/admin/pesanan`}
          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-blue-600 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Buka Detail Order
        </Link>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-50/40 text-xs">
        <div className="text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider my-2">
          Percakapan Langsung Antara Admin & Pelanggan
        </div>

        {thread.messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.sender === "Admin" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3.5 rounded-2xl ${
                m.sender === "Admin"
                  ? "bg-slate-900 text-white rounded-tr-none shadow-xs"
                  : m.sender === "Bot"
                  ? "bg-indigo-50 border border-indigo-200 text-indigo-950 rounded-tl-none shadow-2xs"
                  : "bg-white text-slate-900 border border-slate-200 rounded-tl-none shadow-xs"
              }`}
            >
              <div className="font-bold text-[10px] opacity-80 mb-1 flex items-center gap-1">
                {m.sender === "Admin" ? (
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                ) : m.sender === "Bot" ? (
                  <Bot className="w-3 h-3 text-indigo-600" />
                ) : (
                  <User className="w-3 h-3" />
                )}
                <span>{m.sender}</span>
              </div>
              <p className="leading-relaxed text-xs">{m.text}</p>
            </div>
            <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}
      </div>

      {/* Quick Reply Templates Bar */}
      <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="font-bold text-slate-500 shrink-0">Draft Cepat:</span>
        <button
          type="button"
          onClick={() =>
            handleInsertQuickTemplate(
              `Halo! Hasil review pengerjaan bisa diperiksa pada folder GDrive berikut: https://drive.google.com/drive/folders/cosgen-review-sample`
            )
          }
          className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 rounded-lg shrink-0 font-medium"
        >
          📁 Link GDrive Review
        </button>
        <button
          type="button"
          onClick={() =>
            handleInsertQuickTemplate(
              `Halo kak! Pembayaran telah terbuka, silakan klik tombol "Bayar Sekarang" di portal Cek Status.`
            )
          }
          className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 rounded-lg shrink-0 font-medium"
        >
          💳 Buka Pembayaran ACC
        </button>
        <button
          type="button"
          onClick={() =>
            handleInsertQuickTemplate(
              `Mohon info lebih detail untuk bagian mana yang ingin direvisi kak.`
            )
          }
          className="px-2.5 py-1 bg-white hover:bg-purple-50 text-purple-700 border border-slate-200 rounded-lg shrink-0 font-medium"
        >
          💬 Tanya Detail Revisi
        </button>
      </div>

      {/* Form Input Bar */}
      <form onSubmit={handleSubmit} className="p-3.5 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          placeholder="Ketik pesan atau balasan admin..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
