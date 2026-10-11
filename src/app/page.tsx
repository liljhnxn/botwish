"use client";

import React, { useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import { Header } from "../components/Header";
import { ContractWarning } from "../components/ContractWarning";
import { NetworkWarning } from "../components/NetworkWarning";
import { StatsSection } from "../components/StatsSection";
import { AddWishForm } from "../components/AddWishForm";
import { Wishlist } from "../components/Wishlist";
import { WishData } from "../components/WishCard";
import { WishVaultABI } from "../abi/WishVaultABI";
import {
  WISH_VAULT_CONTRACT_ADDRESS,
  BOTCHAIN_CHAIN_ID,
  BOTCHAIN_EXPLORER_URL,
  BOTCHAIN_RPC_URL,
} from "../config/constants";
import { ExternalLink, ShieldCheck, Database, Cpu } from "lucide-react";

export default function Home() {
  const { address, isConnected } = useAccount();

  const isContractConfigured = Boolean(
    WISH_VAULT_CONTRACT_ADDRESS &&
      WISH_VAULT_CONTRACT_ADDRESS.startsWith("0x") &&
      WISH_VAULT_CONTRACT_ADDRESS.length === 42
  );

  const {
    data: rawWishes,
    isLoading,
    refetch,
  } = useReadContract({
    address: isContractConfigured ? WISH_VAULT_CONTRACT_ADDRESS : undefined,
    abi: WishVaultABI,
    functionName: "getMyWishes",
    account: address,
    query: {
      enabled: isConnected && isContractConfigured,
    },
  });

  const wishes: WishData[] = useMemo(() => {
    if (!rawWishes || !Array.isArray(rawWishes)) return [];
    return (rawWishes as any[]).map((w) => ({
      id: BigInt(w.id),
      owner: w.owner,
      title: w.title,
      description: w.description,
      createdAt: BigInt(w.createdAt),
      completed: Boolean(w.completed),
    }));
  }, [rawWishes]);

  const total = wishes.length;
  const completed = wishes.filter((w) => w.completed).length;
  const remaining = total - completed;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Network & Configuration Warnings */}
        <NetworkWarning />
        {!isContractConfigured && <ContractWarning />}

        {/* Contract Info Pill if configured */}
        {isContractConfigured && (
          <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Contract:</span>
              <a
                href={`${BOTCHAIN_EXPLORER_URL}/address/${WISH_VAULT_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>{WISH_VAULT_CONTRACT_ADDRESS}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span>Chain ID: {BOTCHAIN_CHAIN_ID}</span>
              <span>Network: Botchain Testnet</span>
            </div>
          </div>
        )}

        {/* Hero & Statistics */}
        <StatsSection
          total={total}
          completed={completed}
          remaining={remaining}
          isConnected={isConnected}
          isLoading={isLoading}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Add Wish Form */}
          <div className="lg:col-span-5 sticky top-28">
            <AddWishForm
              onWishAdded={() => refetch()}
              isContractConfigured={isContractConfigured}
            />

            {/* Quick Informational Card */}
            <div className="mt-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>On-Chain Security &amp; Ownership</span>
              </div>
              <p>
                Each wish is permanently anchored to your wallet address. Only you have the authority to complete your own wishes.
              </p>
            </div>
          </div>

          {/* Right Column: Wishlist */}
          <div className="lg:col-span-7">
            <Wishlist
              wishes={wishes}
              isLoading={isLoading}
              isConnected={isConnected}
              onRefresh={() => refetch()}
              isContractConfigured={isContractConfigured}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 mt-16 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-300">WishVault dApp</p>
              <p className="text-[11px]">Decentralized goal &amp; wishlist vault on Botchain Testnet</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a
              href={BOTCHAIN_RPC_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-400 transition-colors inline-flex items-center gap-1"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>RPC</span>
            </a>
            <a
              href={BOTCHAIN_EXPLORER_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-400 transition-colors inline-flex items-center gap-1"
            >
              <span>Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
