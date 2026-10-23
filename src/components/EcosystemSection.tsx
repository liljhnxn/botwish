"use client";

import React from "react";
import { Globe, Compass, Shield, Cpu, ExternalLink, Zap } from "lucide-react";
import {
  BOTCHAIN_WEBSITE_URL,
  BOTCHAIN_EXPLORER_URL,
  BOTCHAIN_CHAIN_ID,
} from "../config/constants";

export function EcosystemSection() {
  return (
    <section className="mt-16 pt-10 border-t border-slate-800/80">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-blue-950/30 border border-slate-800/90 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left: Ecosystem Brand & Description */}
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
              <Zap className="w-3.5 h-3.5" />
              <span>Ecosystem Partner</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Official BOT Chain Logo Badge */}
              <div className="w-12 h-12 rounded-2xl bg-black border border-slate-700/80 p-1.5 shadow-lg shadow-emerald-500/10 flex items-center justify-center shrink-0">
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Official Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>BOT Chain</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Mainnet Live
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  High-speed EVM-compatible layer for decentralized applications &amp; autonomous intelligence.
                </p>
              </div>
            </div>

            {/* Quick stats tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400 font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                Chain ID: {BOTCHAIN_CHAIN_ID}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                Native Token: BOT
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60">
                Total Supply: 150M BOT
              </span>
            </div>
          </div>

          {/* Right: Ecosystem Action Cards */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            {/* BOT Chain Website Card with Logo at the front */}
            <a
              href={BOTCHAIN_WEBSITE_URL}
              target="_blank"
              rel="noreferrer"
              id="ecosystem-botchain-website"
              className="group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-emerald-500/50 transition-all duration-200 shadow-lg hover:shadow-emerald-500/10 active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-black border border-slate-800 p-1 flex items-center justify-center shrink-0 group-hover:border-emerald-500/40 transition-colors">
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                  <span>BOT Chain Website</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  botchain.ai
                </div>
              </div>
            </a>

            {/* BOT Chain Explorer Card with Logo at the front */}
            <a
              href={BOTCHAIN_EXPLORER_URL}
              target="_blank"
              rel="noreferrer"
              id="ecosystem-botchain-explorer"
              className="group flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/50 transition-all duration-200 shadow-lg hover:shadow-cyan-500/10 active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-black border border-slate-800 p-1 flex items-center justify-center shrink-0 group-hover:border-cyan-500/40 transition-colors">
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                  <span>BOT Chain Explorer</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  scan.botchain.ai
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
