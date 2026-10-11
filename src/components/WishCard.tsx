"use client";

import React, { useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { WishVaultABI } from "../abi/WishVaultABI";
import { WISH_VAULT_CONTRACT_ADDRESS, BOTCHAIN_EXPLORER_URL } from "../config/constants";
import { CheckCircle2, Clock, Calendar, Check, Loader2, ExternalLink } from "lucide-react";

export interface WishData {
  id: bigint;
  owner: string;
  title: string;
  description: string;
  createdAt: bigint;
  completed: boolean;
}

interface WishCardProps {
  wish: WishData;
  onCompletedSuccess: () => void;
  isContractConfigured: boolean;
}

export function WishCard({ wish, onCompletedSuccess, isContractConfigured }: WishCardProps) {
  const {
    data: hash,
    isPending: isConfirmingInWallet,
    writeContract,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isWaitingForReceipt,
    isSuccess: isReceiptSuccess,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isReceiptSuccess) {
      onCompletedSuccess();
    }
  }, [isReceiptSuccess, onCompletedSuccess]);

  const handleComplete = () => {
    if (wish.completed || !isContractConfigured) return;
    writeContract({
      address: WISH_VAULT_CONTRACT_ADDRESS,
      abi: WishVaultABI,
      functionName: "completeWish",
      args: [wish.id],
    });
  };

  const formatDate = (timestamp: bigint) => {
    try {
      const date = new Date(Number(timestamp) * 1000);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown";
    }
  };

  const isActionLoading = isConfirmingInWallet || isWaitingForReceipt;

  return (
    <div
      className={`rounded-2xl transition-all duration-300 p-5 border ${
        wish.completed
          ? "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50 shadow-emerald-950/20 shadow-lg"
          : "bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-xl"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left Content */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {wish.completed ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                <Clock className="w-3.5 h-3.5" />
                <span>In Progress</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>Created {formatDate(wish.createdAt)}</span>
            </span>

            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400">
              ID #{wish.id.toString()}
            </span>
          </div>

          <h3
            className={`text-base sm:text-lg font-bold break-words ${
              wish.completed ? "text-emerald-100 line-through decoration-emerald-500/50" : "text-white"
            }`}
          >
            {wish.title}
          </h3>

          {wish.description && (
            <p
              className={`text-sm break-words whitespace-pre-wrap ${
                wish.completed ? "text-emerald-200/60" : "text-slate-300"
              }`}
            >
              {wish.description}
            </p>
          )}

          {hash && (
            <div className="pt-2">
              <a
                href={`${BOTCHAIN_EXPLORER_URL}/tx/${hash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline font-mono"
              >
                <span>Tx: {hash.slice(0, 10)}...{hash.slice(-8)}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {writeError && (
            <p className="text-xs text-rose-400 pt-1">
              Error: {writeError.message.slice(0, 100)}...
            </p>
          )}
        </div>

        {/* Right Action */}
        <div className="shrink-0 sm:self-center">
          {wish.completed ? (
            <button
              disabled
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 opacity-70 cursor-not-allowed"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Wish Fulfilled</span>
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isActionLoading || !isContractConfigured}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 transition-all border border-emerald-400/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConfirmingInWallet ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Confirm in wallet...</span>
                </>
              ) : isWaitingForReceipt ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Confirming...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Completed</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
