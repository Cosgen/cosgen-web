"use client";

import React, { useState } from "react";
import { Bot, Sparkles, CheckCircle2, RefreshCw, Power } from "lucide-react";

export function InstagramBotStatusWidget() {
  const [isBotActive, setIsBotActive] = useState(true);

  const mockBotLogs = [
    {
      id: "log-1",
      user: "@coser_aya",
      query: "Cek progress order REQ-8942",
      response: "Mengirim link /cek-status?code=REQ-8942",
      time: "10 menit lalu",
    },
    {
      id: "log-2",
      user: "@kaeya_cos",
      query: "Berapa pricelist paket Pertamax?",
      response: "Mengirim link /#pricelist (Rp 1.000.000)",
      time: "25 menit lalu",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-slate-800 space-y-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">
            Indikator Status Bot Instagram (n8n AI / UChat)
          </h3>
        </div>
        <button
          onClick={() => setIsBotActive(!isBotActive)}
          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${
            isBotActive
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-red-500/20 text-red-300 border border-red-500/30"
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{isBotActive ? "ONLINE (Active)" : "OFFLINE (Disabled)"}</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">
            Otomatisasi n8n DM
          </span>
          <span className="text-lg font-bold text-indigo-400 font-mono">142 Pesan</span>
        </div>
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">
            Respon Terkirim
          </span>
          <span className="text-lg font-bold text-emerald-400 font-mono">100% Instan</span>
        </div>
      </div>

      {/* Log summary */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 block">
          Log Ringkasan Interaksi Bot Terbaru:
        </span>
        <div className="space-y-1.5 text-[11px]">
          {mockBotLogs.map((log) => (
            <div
              key={log.id}
              className="p-2 bg-slate-800/40 rounded-lg border border-slate-800 flex items-center justify-between text-slate-300"
            >
              <div>
                <span className="font-bold text-indigo-300">{log.user}: </span>
                <span>"{log.query}"</span>
                <p className="text-[10px] text-emerald-400 font-medium">{log.response}</p>
              </div>
              <span className="text-[9px] text-slate-500 shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
