"use client";

import React from "react";
import { AlertTriangle, Terminal } from "lucide-react";

export function ContractWarning() {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 backdrop-blur-sm shadow-lg mb-8">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold text-amber-200">
            BotWish contract is not configured yet.
          </h2>
          <p className="text-sm text-amber-300/80 mt-1">
            To enable full on-chain interaction, deploy the contract to Botchain Testnet and set{" "}
            <code className="px-1.5 py-0.5 rounded bg-amber-950/60 font-mono text-xs text-amber-200 border border-amber-500/20">
              NEXT_PUBLIC_BOT_WISH_ADDRESS
            </code>{" "}
            in your environment.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-400/90 font-mono bg-black/40 px-3 py-2 rounded-lg border border-amber-500/15">
            <Terminal className="w-3.5 h-3.5 shrink-0" />
            <span>npm run deploy &amp;&amp; update NEXT_PUBLIC_BOT_WISH_ADDRESS in .env</span>
          </div>
        </div>
      </div>
    </div>
  );
}
