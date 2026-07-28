"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageSquare,
  Search,
  User,
  ShieldCheck,
  Bot,
  Send,
  Sparkles,
  Layers,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export interface ChatThread {
  id: string;
  orderCode: string;
  customerName: string;
  channel: "Live Chat Guest" | "Instagram Bot (n8n)";
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: {
    id: string;
    sender: "Customer" | "Admin" | "Bot";
    text: string;
    timestamp: string;
  }[];
}

const MOCK_CHAT_THREADS: ChatThread[] = [
  {
    id: "thread-1",
    orderCode: "ORD-2204",
    customerName: "Budi Santoso",
    channel: "Live Chat Guest",
    lastMessage: "Min, tolong warna auranya dibuat lebih terang ya!",
    timestamp: "16:35 WIB",
    unreadCount: 1,
    messages: [
      {
        id: "m-1",
        sender: "Admin",
        text: "Berikut link review GDrive: drive.google.com/drive/folders/cosgen-review-sample",
        timestamp: "16:30 WIB",
      },
      {
        id: "m-2",
        sender: "Customer",
        text: "Min, tolong warna auranya dibuat lebih terang ya!",
        timestamp: "16:35 WIB",
      },
    ],
  },
  {
    id: "thread-2",
    orderCode: "REQ-8942",
    customerName: "Aria Pratama",
    channel: "Live Chat Guest",
    lastMessage: "Apakah pesanan saya REQ-8942 sudah disetujui?",
    timestamp: "15:20 WIB",
    unreadCount: 0,
    messages: [
      {
        id: "m-3",
        sender: "Customer",
        text: "Apakah pesanan saya REQ-8942 sudah disetujui?",
        timestamp: "15:20 WIB",
      },
      {
        id: "m-4",
        sender: "Bot",
        text: "Halo kak Aria! Pesanan REQ-8942 sedang dalam antrian konfirmasi Admin.",
        timestamp: "15:21 WIB",
      },
    ],
  },
  {
    id: "thread-3",
    orderCode: "ORD-3301",
    customerName: "@siti_rahma (IG DM)",
    channel: "Instagram Bot (n8n)",
    lastMessage: "Berapa biaya paket Pertamax Turbo kak?",
    timestamp: "12:10 WIB",
    unreadCount: 0,
    messages: [
      {
        id: "m-5",
        sender: "Customer",
        text: "Berapa biaya paket Pertamax Turbo kak?",
        timestamp: "12:10 WIB",
      },
      {
        id: "m-6",
        sender: "Bot",
        text: "Halo! Paket Pertamax Turbo seharga Rp 1.500.000 (Cinematic VFX 3D). Cek selengkapnya di cosgen.id/order",
        timestamp: "12:10 WIB",
      },
    ],
  },
];

export default function AdminLiveChatDashboardPage() {
  const [threads, setThreads] = useState<ChatThread[]>(MOCK_CHAT_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>("thread-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [adminInputMsg, setAdminInputMsg] = useState("");

  const activeThread =
    threads.find((t) => t.id === activeThreadId) || threads[0];

  const filteredThreads = threads.filter(
    (t) =>
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.orderCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminInputMsg.trim() || !activeThread) return;

    const newMsg = {
      id: `adm-${Date.now()}`,
      sender: "Admin" as const,
      text: adminInputMsg,
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB",
    };

    const updated = threads.map((t) =>
      t.id === activeThread.id
        ? {
            ...t,
            lastMessage: adminInputMsg,
            timestamp: newMsg.timestamp,
            messages: [...t.messages, newMsg],
          }
        : t
    );

    setThreads(updated);
    setAdminInputMsg("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 sm:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <Link
            href="/admin/pesanan"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard Admin
          </Link>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 font-medium text-xs rounded-full flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Live Chat Support & Hermes Agent Integrasi
          </span>
        </div>

        {/* Dual Pane Layout */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[650px]">
          {/* Left Pane: Conversation List */}
          <div className="md:col-span-5 border-r border-slate-200 flex flex-col justify-between bg-slate-50/50">
            {/* Search header */}
            <div className="p-4 border-b border-slate-200 bg-white space-y-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" /> Percakapan Pelanggan
              </h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari kode REQ/ORD atau nama..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
                />
              </div>
            </div>

            {/* List Threads */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredThreads.map((th) => (
                <div
                  key={th.id}
                  onClick={() => setActiveThreadId(th.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    activeThreadId === th.id
                      ? "bg-blue-50/80 border-l-4 border-blue-600"
                      : "hover:bg-slate-100/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      {th.customerName}
                    </span>
                    <span className="text-[10px] text-slate-400">{th.timestamp}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-blue-600 font-bold">
                      {th.orderCode}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                        th.channel === "Instagram Bot (n8n)"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {th.channel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 truncate mt-1.5">{th.lastMessage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Pane: Active Conversation Window */}
          <div className="md:col-span-7 flex flex-col justify-between bg-white">
            {/* Active Thread Title */}
            {activeThread && (
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xs">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{activeThread.customerName}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Order: {activeThread.orderCode} • {activeThread.channel}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/admin/pesanan/ord-3`}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-blue-600 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Detail Order
                </Link>
              </div>
            )}

            {/* Messages Thread */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-50/30 text-xs">
              {activeThread?.messages.map((m) => (
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
                        ? "bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-tl-none"
                        : "bg-white text-slate-900 border border-slate-200 rounded-tl-none shadow-xs"
                    }`}
                  >
                    <div className="font-bold text-[10px] opacity-75 mb-0.5 flex items-center gap-1">
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

            {/* Admin Input Bar */}
            <form onSubmit={handleSendAdminReply} className="p-3.5 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="Balas pesan pelanggan sebagai Admin..."
                value={adminInputMsg}
                onChange={(e) => setAdminInputMsg(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Balas
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
