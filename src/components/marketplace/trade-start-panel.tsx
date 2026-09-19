"use client";

import { useId, useState, useTransition } from "react";
import { Loader2, Lock } from "lucide-react";
import { createTradeAction } from "@/lib/actions/trades";
import { convertRmbToNgn, formatNgn, formatRate, formatRmb, toMajor, toMinor } from "@/lib/money";
import {
  counterRate,
  proposalBounds,
  type NegotiationResult,
  type NegotiationRole,
  type NegotiationTurn,
} from "@/lib/negotiation";
import type { Offer, ScaledRate } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NegotiationPhase = "idle" | "proposing" | "thinking" | "countered" | "locked";

/**
 * The real "Buy"/"Sell" form on an offer's detail page. Includes PRD §13's
 * Rate Negotiation — buyer offer → seller counter → accept → RATE LOCKED —
 * before the amount form (which uses whatever rate that negotiation lands
 * on, or the listed rate if skipped) creates a genuine trade (see
 * lib/actions/trades.ts) and lands the trader in its real trade room.
 */
export function TradeStartPanel({ offer, action }: { offer: Offer; action: "Buy" | "Sell" }) {
  const youRole: NegotiationRole = action === "Buy" ? "buyer" : "seller";
  const themRole: NegotiationRole = youRole === "buyer" ? "seller" : "buyer";
  const bounds = proposalBounds(offer.rate, action);

  const [phase, setPhase] = useState<NegotiationPhase>("idle");
  const [transcript, setTranscript] = useState<NegotiationTurn[]>([]);
  const [lockedRate, setLockedRate] = useState<ScaledRate>(offer.rate);
  const [proposalInput, setProposalInput] = useState("");
  const [proposalError, setProposalError] = useState<string | null>(null);

  const negotiated = phase === "locked" && transcript.length > 0;

  function handlePropose(event: React.FormEvent) {
    event.preventDefault();
    const parsed = Number(proposalInput);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setProposalError("Enter a rate.");
      return;
    }
    const proposed = Math.round(parsed * 10_000) as ScaledRate;
    if (proposed < bounds.min || proposed > bounds.max || proposed === offer.rate) {
      setProposalError(
        action === "Buy"
          ? `Propose between ${formatRate(bounds.min)} and just under ${formatRate(offer.rate)}.`
          : `Propose between just over ${formatRate(offer.rate)} and ${formatRate(bounds.max)}.`,
      );
      return;
    }

    setProposalError(null);
    setPhase("thinking");
    const counter = counterRate(offer.rate, proposed);
    window.setTimeout(() => {
      setTranscript([
        { by: youRole, rate: proposed },
        { by: themRole, rate: counter },
      ]);
      setPhase("countered");
    }, 550);
  }

  function handleAcceptCounter() {
    const counterTurn = transcript[transcript.length - 1];
    if (!counterTurn) return;
    setLockedRate(counterTurn.rate);
    setPhase("locked");
  }

  function handleKeepListed() {
    setTranscript([]);
    setLockedRate(offer.rate);
    setPhase("locked");
  }

  function handleCancelNegotiation() {
    setTranscript([]);
    setProposalInput("");
    setProposalError(null);
    setPhase("idle");
  }

  return (
    <div className="space-y-3.5">
      {phase === "idle" && (
        <button
          type="button"
          onClick={() => setPhase("proposing")}
          className="text-[12.5px] font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
        >
          Propose a different rate →
        </button>
      )}

      {(phase === "proposing" || phase === "thinking" || phase === "countered") && (
        <div className="space-y-2 rounded-xl border border-hairline bg-surface-subtle p-3.5 dark:bg-neutral-900/50">
          <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400">
            Rate negotiation
          </p>

          <ChatBubble from="them" label={offer.trader.username}>
            {formatRate(offer.rate)}/RMB
          </ChatBubble>

          {transcript.map((turn, i) => {
            const isYou = turn.by === youRole;
            const isFinal = i === transcript.length - 1 && !isYou;
            return (
              <ChatBubble key={i} from={isYou ? "you" : "them"} label={isYou ? "You" : offer.trader.username}>
                {isFinal ? `${formatRate(turn.rate)} — final` : `Can you do ${formatRate(turn.rate)}?`}
              </ChatBubble>
            );
          })}

          {phase === "thinking" && (
            <ChatBubble from="them" label={offer.trader.username} muted>
              · · ·
            </ChatBubble>
          )}

          {phase === "proposing" && (
            <form onSubmit={handlePropose} className="flex gap-2 pt-1">
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder={toMajor(bounds.min).toString()}
                value={proposalInput}
                onChange={(e) => {
                  setProposalInput(e.target.value);
                  setProposalError(null);
                }}
                className="tabular h-9 w-full rounded-lg border border-hairline bg-card px-2.5 text-[13px] font-semibold text-neutral-900 outline-none focus:border-brand-300 focus:shadow-focus dark:text-white"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-brand-600 px-3 text-[12.5px] font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Send
              </button>
            </form>
          )}

          {phase === "countered" && (
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={handleAcceptCounter}
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Accept {formatRate(transcript[transcript.length - 1]?.rate ?? offer.rate)}
              </button>
              <button
                type="button"
                onClick={handleKeepListed}
                className="rounded-lg border border-hairline px-3 py-1.5 text-[12.5px] font-semibold text-neutral-700 transition-colors hover:bg-card dark:text-neutral-200"
              >
                Keep listed rate
              </button>
            </div>
          )}

          {proposalError && <p className="text-[12px] text-danger-600 dark:text-danger-300">{proposalError}</p>}

          {phase !== "thinking" && (
            <button
              type="button"
              onClick={handleCancelNegotiation}
              className="text-[11.5px] text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {phase === "locked" && negotiated && (
        <p className="flex items-center gap-1.5 rounded-xl bg-success-50 px-3 py-2 text-[12.5px] font-semibold text-success-700 dark:bg-success-900/30 dark:text-success-300">
          <Lock className="size-3.5" strokeWidth={2.3} />
          Rate locked at {formatRate(lockedRate)}/RMB
        </p>
      )}

      <AmountForm
        offer={offer}
        action={action}
        rate={lockedRate}
        negotiation={negotiated ? { finalRate: lockedRate, transcript } : undefined}
      />
    </div>
  );
}

function ChatBubble({
  from,
  label,
  muted,
  children,
}: {
  from: "you" | "them";
  label: string;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col", from === "you" && "items-end")}>
      <span className="text-[10.5px] font-medium text-neutral-400">{label}</span>
      <span
        className={cn(
          "tabular mt-0.5 max-w-[85%] rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold",
          from === "you"
            ? "bg-brand-600 text-white"
            : "bg-card text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",
          muted && "opacity-60",
        )}
      >
        {children}
      </span>
    </div>
  );
}

function AmountForm({
  offer,
  action,
  rate,
  negotiation,
}: {
  offer: Offer;
  action: "Buy" | "Sell";
  rate: ScaledRate;
  negotiation?: NegotiationResult;
}) {
  const ceiling = Math.min(offer.maxOrderRmb, offer.availableRmb);
  const [amount, setAmount] = useState(() => toMajor(offer.minOrderRmb).toString());
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputId = useId();

  const parsed = Number(amount);
  const amountMinor = Number.isFinite(parsed) ? toMinor(parsed) : 0;
  const withinRange = amountMinor >= offer.minOrderRmb && amountMinor <= ceiling;
  const ngnTotal = withinRange ? convertRmbToNgn(amountMinor, rate) : null;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!withinRange) {
      setError(`Enter an amount between ${formatRmb(offer.minOrderRmb)} and ${formatRmb(ceiling)}.`);
      return;
    }
    setError(null);
    startTransition(() => {
      createTradeAction(offer.id, amountMinor, negotiation);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor={inputId} className="text-[12px] font-semibold text-neutral-700 dark:text-neutral-200">
          Amount (¥)
        </label>
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          min={0}
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError(null);
          }}
          className="tabular mt-1.5 h-11 w-full rounded-xl border border-hairline bg-transparent px-3 text-[14px] font-semibold text-neutral-900 outline-none transition-shadow focus:border-brand-300 focus:shadow-focus dark:text-white"
        />
        <p className="tabular mt-1 text-[11px] text-neutral-400">
          Min {formatRmb(offer.minOrderRmb)} · Max {formatRmb(ceiling)}
        </p>
      </div>

      {ngnTotal != null && (
        <div className="rounded-xl bg-surface-subtle px-3.5 py-2.5 dark:bg-neutral-900/50">
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            You&apos;ll {action === "Buy" ? "pay" : "receive"}
          </p>
          <p className="tabular text-[18px] font-bold text-neutral-900 dark:text-white">
            {formatNgn(ngnTotal)}
          </p>
        </div>
      )}

      {error && <p className="text-[12px] text-danger-600 dark:text-danger-300">{error}</p>}

      <Button type="submit" disabled={pending} className="h-12 w-full gap-2 text-[14px]">
        {pending && <Loader2 className="size-4 animate-spin" strokeWidth={2.2} />}
        {pending ? "Opening trade…" : `${action} RMB`}
      </Button>
    </form>
  );
}
