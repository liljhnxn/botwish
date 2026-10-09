"use client";

import React, { useState } from "react";
import { WishCard, WishData } from "./WishCard";
import { Sparkles, Layers, ListFilter, RefreshCw, Wallet } from "lucide-react";
import { useConnect } from "wagmi";

interface WishlistProps {
  wishes: WishData[];
  isLoading: boolean;
  isConnected: boolean;
  onRefresh: () => void;
  isContractConfigured: boolean;
}

export function Wishlist({
  wishes,
  isLoading,
  isConnected,
  onRefresh,
  isContractConfigured,
}: WishlistProps) {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const { connectors, connect } = useConnect();

  const filteredWishes = wishes.filter((wish) => {
    if (filter === "active") return !wish.completed;
    if (filter === "completed") return wish.completed;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Wishlist Header and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">Your Wishlist</h2>
          {isConnected && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {wishes.length}
            </span>
          )}
        </div>

        {isConnected && wishes.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filter === "all"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All ({wishes.length})
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filter === "active"
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                In Progress ({wishes.filter((w) => !w.completed).length})
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filter === "completed"
                    ? "bg-emerald-600 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Completed ({wishes.filter((w) => w.completed).length})
              </button>
            </div>

            <button
              onClick={onRefresh}
              title="Refresh Wishlist from Chain"
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-400" : ""}`} />
            </button>
          </div>
        )}
      </div>

      {/* States rendering */}
      {!isConnected ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-3">
            <Wallet className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">Connect your wallet</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Connect your Web3 wallet to read your personal wishlist stored on the Botchain Testnet.
          </p>
          <button
            onClick={() => {
              const connector = connectors[0];
              if (connector) connect({ connector });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all"
          >
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet</span>
          </button>
        </div>
      ) : isLoading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
          <h3 className="text-base font-medium text-slate-200">Querying Botchain Testnet...</h3>
          <p className="text-xs text-slate-400 mt-1">Reading smart contract state</p>
        </div>
      ) : wishes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">No wishes found yet</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto mt-1">
            Your on-chain wishlist is currently empty. Use the form above to add your first wish to the blockchain!
          </p>
        </div>
      ) : filteredWishes.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
          <ListFilter className="w-6 h-6 text-slate-500 mx-auto mb-2" />
          <p className="text-sm text-slate-400">
            No wishes match the selected filter (
            <span className="capitalize font-semibold text-slate-300">{filter}</span>).
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredWishes.map((wish) => (
            <WishCard
              key={wish.id.toString()}
              wish={wish}
              onCompletedSuccess={onRefresh}
              isContractConfigured={isContractConfigured}
            />
          ))}
        </div>
      )}
    </div>
  );
}
