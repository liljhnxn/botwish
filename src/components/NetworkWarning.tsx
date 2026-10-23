"use client";

import React from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { BOTCHAIN_CHAIN_ID } from "../config/constants";
import { AlertCircle, RefreshCw } from "lucide-react";

export function NetworkWarning() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === BOTCHAIN_CHAIN_ID) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 backdrop-blur-sm shadow-lg mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-rose-200">
              Incorrect Network Detected
            </h2>
            <p className="text-xs sm:text-sm text-rose-300/80 mt-0.5">
              Please switch your wallet to BotChain Mainnet (Chain ID: {BOTCHAIN_CHAIN_ID}) to interact with your wishlist.
            </p>
          </div>
        </div>

        <button
          onClick={() => switchChain({ chainId: BOTCHAIN_CHAIN_ID })}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
          <span>{isPending ? "Switching..." : "Switch to BotChain Mainnet"}</span>
        </button>
      </div>
    </div>
  );
}
