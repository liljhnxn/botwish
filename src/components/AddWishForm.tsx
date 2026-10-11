"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { WishVaultABI } from "../abi/WishVaultABI";
import {
  WISH_VAULT_CONTRACT_ADDRESS,
  BOTCHAIN_EXPLORER_URL,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from "../config/constants";
import { PlusCircle, Loader2, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";

interface AddWishFormProps {
  onWishAdded: () => void;
  isContractConfigured: boolean;
}

export function AddWishForm({ onWishAdded, isContractConfigured }: AddWishFormProps) {
  const { isConnected } = useAccount();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    data: hash,
    error: writeError,
    isPending: isConfirmingInWallet,
    writeContract,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isWaitingForConfirmation,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // When transaction successfully confirms, trigger refresh and clear inputs
  useEffect(() => {
    if (isConfirmed) {
      onWishAdded();
      setTitle("");
      setDescription("");
      const timer = setTimeout(() => {
        resetWrite();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isConfirmed, onWishAdded, resetWrite]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setValidationError("Please enter a wish title.");
      return;
    }

    if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      setValidationError(`Title cannot exceed ${MAX_TITLE_LENGTH} characters.`);
      return;
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      setValidationError(`Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`);
      return;
    }

    if (!isContractConfigured) {
      setValidationError("WishVault contract is not configured yet.");
      return;
    }

    writeContract({
      address: WISH_VAULT_CONTRACT_ADDRESS,
      abi: WishVaultABI,
      functionName: "addWish",
      args: [trimmedTitle, description],
    });
  };

  const isSubmitting = isConfirmingInWallet || isWaitingForConfirmation;

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
          <PlusCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Make a New Wish</h2>
          <p className="text-xs text-slate-400">
            Write your aspiration into the on-chain vault.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="wish-title" className="text-xs font-semibold text-slate-300">
              Wish Title <span className="text-rose-400">*</span>
            </label>
            <span
              className={`text-[11px] font-mono ${
                title.length > MAX_TITLE_LENGTH ? "text-rose-400 font-bold" : "text-slate-400"
              }`}
            >
              {title.length}/{MAX_TITLE_LENGTH}
            </span>
          </div>
          <input
            id="wish-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="e.g. Master Solidity &amp; Smart Contracts"
            maxLength={MAX_TITLE_LENGTH + 10}
            disabled={!isConnected || isSubmitting || !isContractConfigured}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Description Field */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="wish-description" className="text-xs font-semibold text-slate-300">
              Description <span className="text-slate-500 text-[11px]">(optional)</span>
            </label>
            <span
              className={`text-[11px] font-mono ${
                description.length > MAX_DESCRIPTION_LENGTH
                  ? "text-rose-400 font-bold"
                  : "text-slate-400"
              }`}
            >
              {description.length}/{MAX_DESCRIPTION_LENGTH}
            </span>
          </div>
          <textarea
            id="wish-description"
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Add context, milestones, or reasons why this matters to you..."
            maxLength={MAX_DESCRIPTION_LENGTH + 20}
            disabled={!isConnected || isSubmitting || !isContractConfigured}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Validation or contract errors */}
        {validationError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {writeError && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 break-words">
              <p className="font-semibold">Transaction Rejected / Error:</p>
              <p className="opacity-90">{writeError.message.slice(0, 160)}...</p>
            </div>
          </div>
        )}

        {receiptError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Failed to confirm transaction.</span>
          </div>
        )}

        {/* Transaction States Notification */}
        {isConfirmingInWallet && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Confirm in wallet: Please confirm the transaction in your wallet...</span>
          </div>
        )}

        {isWaitingForConfirmation && hash && (
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs space-y-1">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span className="font-semibold">Transaction submitted. Waiting for confirmation...</span>
            </div>
            <div className="pl-6">
              <a
                href={`${BOTCHAIN_EXPLORER_URL}/tx/${hash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-indigo-200 hover:underline font-mono"
              >
                <span>View on Botchain Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {isConfirmed && hash && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-semibold">Wish added successfully!</span>
            </div>
            <div className="pl-6">
              <a
                href={`${BOTCHAIN_EXPLORER_URL}/tx/${hash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-emerald-200 hover:underline font-mono"
              >
                <span>View confirmed transaction</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          id="add-wish-button"
          type="submit"
          disabled={!isConnected || isSubmitting || !isContractConfigured || title.trim().length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/20 transition-all duration-200 border border-blue-400/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConfirmingInWallet ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Confirm in wallet...</span>
            </>
          ) : isWaitingForConfirmation ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Waiting for confirmation...</span>
            </>
          ) : !isConnected ? (
            <span>Connect Wallet to Add Wish</span>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              <span>Add Wish</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-slate-500">
          Wishes are publicly recorded on the blockchain. Do not post sensitive personal data.
        </p>
      </form>
    </div>
  );
}
