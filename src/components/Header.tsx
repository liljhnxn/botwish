"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { BOTCHAIN_CHAIN_ID, BOTCHAIN_EXPLORER_URL } from "../config/constants";
import { Sparkles, Wallet, LogOut, ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react";

export function Header() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [copied, setCopied] = useState(false);

  const isWrongNetwork = isConnected && chainId !== BOTCHAIN_CHAIN_ID;

  const handleCopyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-blue-200 tracking-tight">
                BotWish
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300 border border-blue-700/40">
                dApp
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Your wishes, secured on Botchain.
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Network Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? isWrongNetwork
                    ? "bg-amber-400 animate-pulse"
                    : "bg-emerald-400 shadow-sm shadow-emerald-400"
                  : "bg-slate-500"
              }`}
            />
            <span className="text-slate-300 font-medium">
              {isWrongNetwork ? "Wrong Network" : "Botchain Testnet"}
            </span>
          </div>

          {/* Wallet Actions */}
          {!isConnected ? (
            <button
              id="connect-wallet-button"
              onClick={() => {
                const connector = connectors[0];
                if (connector) {
                  connect({ connector });
                }
              }}
              disabled={isConnecting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 transition-all duration-200 border border-blue-400/20 active:scale-95 disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          ) : isWrongNetwork ? (
            <button
              id="switch-network-button"
              onClick={() => switchChain({ chainId: BOTCHAIN_CHAIN_ID })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Switch to Botchain</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="wallet-address-pill"
                onClick={handleCopyAddress}
                title="Click to copy address"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 text-xs sm:text-sm text-slate-200 transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-mono">{formatAddress(address!)}</span>
                {copied ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-slate-400 uppercase">copy</span>
                )}
              </button>

              <a
                href={`${BOTCHAIN_EXPLORER_URL}/address/${address}`}
                target="_blank"
                rel="noreferrer"
                title="View on Botchain Explorer"
                className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                id="disconnect-wallet-button"
                onClick={() => disconnect()}
                title="Disconnect Wallet"
                className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
