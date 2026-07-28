"use client";

import React, { useState } from "react";
import { MessageSquare, Send, X, User, ShieldCheck, Sparkles, RefreshCw } from "lucide-react";

export interface ChatMessage {
  id: string;
  sender: "Customer" | "Admin";
  text: string;
  timestamp: string;
}

interface OrderRevisionChatProps {
  isOpen: boolean;
  onClose: () => void;
  orderCode: string;
  onRevisionSubmitted?: (note: string) => void;
}

export function OrderRevisionChat({
  isOpen,
  onClose,
  orderCode,
  onRevisionSubmitted,
}: OrderRevisionChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "Admin",
      text: `Halo kak! Pesanan ${orderCode} sudah selesai tahap awal dan bisa dicek pada link GDrive Review.`,
      timestamp: "16:30 WIB",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "Customer",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB",
    };

    setMessages((prev) => [...prev, newMsg]);

    const sentText = inputMessage;
    setInputMessage("");

    // Simulate Admin Response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: "Admin",
          text: `Baik kak, catatan revisi ("${sentText}") telah kami terima dan pesanan akan dikembalikan ke status 'Sedang Dikerjakan'.`,
          timestamp: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }) + " WIB",
        },
      ]);

      if (onRevisionSubmitted) {
        onRevisionSubmitted(sentText);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[520px] flex flex-col justify-between shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Chat Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Diskusi & Revisi Order ({orderCode})</h3>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Support Admin Online
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
          <div className="text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider my-2">
            Percakapan Langsung Tanpa Login
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "Customer" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl ${
                  msg.sender === "Customer"
                    ? "bg-blue-600 text-white rounded-tr-none shadow-xs"
                    : "bg-white text-slate-900 border border-slate-200/80 rounded-tl-none shadow-xs"
                }`}
              >
                <div className="font-bold text-[10px] opacity-80 mb-0.5 flex items-center gap-1">
                  {msg.sender === "Admin" ? <ShieldCheck className="w-3 h-3 text-blue-600" /> : <User className="w-3 h-3" />}
                  <span>{msg.sender}</span>
                </div>
                <p className="leading-relaxed text-xs">{msg.text}</p>
              </div>
              <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
          <input
            type="text"
            placeholder="Tulis pesan revisi / pertanyaan..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
