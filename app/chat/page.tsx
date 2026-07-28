"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Send, ArrowLeft, ShieldCheck, User, Sparkles, Bot } from "lucide-react";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";

interface ChatMsg {
  id: string;
  sender: "Customer" | "Admin" | "CosGen AI Bot";
  text: string;
  timestamp: string;
}

function LiveChatContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "ORD-2204";

  const [orderCode, setOrderCode] = useState(initialCode);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "bot-1",
      sender: "CosGen AI Bot",
      text: `Halo kak! Selamat datang di Live Chat CosGen.id. Ada yang bisa kami bantu terkait pesanan ${initialCode}?`,
      timestamp: "14:00 WIB",
    },
    {
      id: "adm-1",
      sender: "Admin",
      text: "Halo kak, kami online! Silakan tuliskan pertanyaan atau detail revisi foto Anda di sini.",
      timestamp: "14:02 WIB",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const newMsg: ChatMsg = {
      id: `usr-${Date.now()}`,
      sender: "Customer",
      text: userText,
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");

    // Simulate AI / Admin Auto response
    setTimeout(() => {
      let replyText = `Terima kasih! Pesan Anda "${userText}" telah diteruskan ke Admin CosGen.id.`;
      if (userText.toLowerCase().includes("harga") || userText.toLowerCase().includes("paket")) {
        replyText = "Untuk daftar harga paket lengkap (Pertalite, Pertamax, Pertamax Turbo), silakan cek di landing page bagian Paket PriceList.";
      } else if (userText.toLowerCase().includes("status") || userText.toLowerCase().includes("progres")) {
        replyText = `Status pesanan ${orderCode} saat ini sedang dalam proses review GDrive.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: "CosGen AI Bot",
          text: replyText,
          timestamp: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          href={`/cek-status?code=${orderCode}`}
          className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Cek Status ({orderCode})
        </Link>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Support Online
        </span>
      </div>

      {/* Main Chat Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden h-[540px] flex flex-col justify-between">
        {/* Chat Title bar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold">Live Chat CosGen.id</h2>
              <p className="text-[10px] text-slate-400 font-mono">Kode Referensi: {orderCode}</p>
            </div>
          </div>
          <span className="text-[10px] bg-slate-800 text-blue-400 px-3 py-1 rounded-full font-bold border border-slate-700">
            Bebas Login (Guest Mode)
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/60 text-xs">
          <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider my-2">
            Pesan Terenkripsi • Terhubung Langsung ke Dashboard Admin
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "Customer" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl ${
                  msg.sender === "Customer"
                    ? "bg-blue-600 text-white rounded-tr-none shadow-sm"
                    : msg.sender === "CosGen AI Bot"
                    ? "bg-indigo-50 border border-indigo-200 text-indigo-950 rounded-tl-none shadow-2xs"
                    : "bg-white text-slate-900 border border-slate-200 rounded-tl-none shadow-2xs"
                }`}
              >
                <div className="font-bold text-[10px] opacity-80 mb-1 flex items-center gap-1">
                  {msg.sender === "Admin" ? (
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                  ) : msg.sender === "CosGen AI Bot" ? (
                    <Bot className="w-3 h-3 text-indigo-600" />
                  ) : (
                    <User className="w-3 h-3" />
                  )}
                  <span>{msg.sender}</span>
                </div>
                <p className="leading-relaxed text-xs">{msg.text}</p>
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3.5 bg-white border-t border-slate-100 flex gap-2">
          <input
            type="text"
            placeholder="Ketik pesan atau pertanyaan untuk Admin..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
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
    </div>
  );
}

export default function CustomerLiveChatPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      <LandingNavbar />
      <Suspense fallback={<div className="text-center py-12 text-xs text-slate-400">Loading chat...</div>}>
        <LiveChatContent />
      </Suspense>
      <LandingFooter />
    </div>
  );
}
