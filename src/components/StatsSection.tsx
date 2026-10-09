"use client";

import React from "react";
import { Sparkles, CheckCircle, Clock } from "lucide-react";

interface StatsSectionProps {
  total: number;
  completed: number;
  remaining: number;
  isConnected: boolean;
  isLoading: boolean;
}

export function StatsSection({
  total,
  completed,
  remaining,
  isConnected,
  isLoading,
}: StatsSectionProps) {
  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Decentralized Goal &amp; Wish Tracking</span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
        Your wishlist, your journey.
      </h1>
      <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
        Keep your aspirations immortalized and verifiably completed on the Botchain blockchain.
      </p>

      {/* Real on-chain statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Total Wishes
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-white">
            {!isConnected ? "—" : isLoading ? "..." : total}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {isConnected ? "Stored on-chain" : "Connect wallet"}
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Completed
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-emerald-400">
            {!isConnected ? "—" : isLoading ? "..." : completed}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {isConnected ? "Achieved wishes" : "Connect wallet"}
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Remaining
            </span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold tracking-tight text-indigo-300">
            {!isConnected ? "—" : isLoading ? "..." : remaining}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {isConnected ? "In progress" : "Connect wallet"}
          </span>
        </div>
      </div>
    </div>
  );
}
