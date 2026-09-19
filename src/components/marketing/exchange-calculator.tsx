"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, ArrowRight } from "lucide-react";
import { convertNgnToRmb, convertRmbToNgn, formatRate, fromScaledRate, toMinor, toMajor } from "@/lib/money";
import type { ScaledRate } from "@/lib/types";

/** Real conversion math against the live reference rate — not a static mockup. */
export function ExchangeCalculator({ rate }: { rate: ScaledRate }) {
  const [direction, setDirection] = useState<"rmb_to_ngn" | "ngn_to_rmb">("rmb_to_ngn");
  const [amount, setAmount] = useState("1000");

  const parsed = Number(amount);
  const valid = Number.isFinite(parsed) && parsed > 0;

  const result =
    direction === "rmb_to_ngn"
      ? valid
        ? toMajor(convertRmbToNgn(toMinor(parsed), rate))
        : 0
      : valid
        ? toMajor(convertNgnToRmb(toMinor(parsed), rate))
        : 0;

  const sendLabel = direction === "rmb_to_ngn" ? "CNY" : "NGN";
  const receiveLabel = direction === "rmb_to_ngn" ? "NGN" : "CNY";

  return (
    <div className="rounded-2xl border border-hairline bg-card p-5 shadow-card">
      <p className="text-[14px] font-bold text-neutral-900 dark:text-white">
        Calculate your exchange
      </p>
      <p className="mt-0.5 text-[12px] text-neutral-500 dark:text-neutral-400">
        At the reference rate, {formatRate(rate)} = ¥1
      </p>

      <div className="mt-4 space-y-2">
        <div className="rounded-xl border border-hairline bg-surface-subtle p-3 dark:bg-neutral-900/50">
          <div className="flex items-center justify-between text-[11.5px] text-neutral-500 dark:text-neutral-400">
            <span>You send</span>
            <span>{sendLabel}</span>
          </div>
          <input
            type="number"
            min="0"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="tabular mt-1 w-full bg-transparent text-[20px] font-bold text-neutral-900 outline-none dark:text-white"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setDirection((d) => (d === "rmb_to_ngn" ? "ngn_to_rmb" : "rmb_to_ngn"))}
            aria-label="Swap direction"
            className="grid size-8 place-items-center rounded-full border border-hairline bg-card text-neutral-500 transition-colors hover:text-brand-600 dark:text-neutral-400"
          >
            <ArrowLeftRight className="size-3.5" strokeWidth={2.2} />
          </button>
        </div>

        <div className="rounded-xl border border-hairline bg-surface-subtle p-3 dark:bg-neutral-900/50">
          <div className="flex items-center justify-between text-[11.5px] text-neutral-500 dark:text-neutral-400">
            <span>You receive</span>
            <span>{receiveLabel}</span>
          </div>
          <p className="tabular mt-1 text-[20px] font-bold text-neutral-900 dark:text-white">
            {valid ? result.toLocaleString("en-NG", { maximumFractionDigits: 2 }) : "0"}
          </p>
        </div>
      </div>

      <Link
        href={direction === "rmb_to_ngn" ? "/buy" : "/sell"}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Trade now
        <ArrowRight className="size-4" strokeWidth={2.4} />
      </Link>

      <p className="mt-2 text-center text-[10.5px] text-neutral-400">
        Reference rate {fromScaledRate(rate).toFixed(2)} — actual trade rates vary by offer.
      </p>
    </div>
  );
}
