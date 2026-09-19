import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageSquare, ShieldCheck } from "lucide-react";
import { Callout } from "@/components/kit/primitives";
import { TRADE_STAGES } from "@/lib/trade-progress";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Exactly what happens, step by step, when you buy or sell RMB on ScarExchange.",
};

const STAGE_DETAIL: Record<string, string> = {
  created:
    "You accept an offer from the marketplace (or let Quick Trade find the best one), and a trade record is created with its own reference, like SCX-84921.",
  rate_locked:
    "Buyer and seller agree the final rate in the trade's chat — either accepting the offer's listed rate outright or negotiating a counter-offer — before anything moves.",
  funds_reserved:
    "The seller's RMB is reserved against this trade, so it can't be double-sold while the buyer arranges payment.",
  buyer_paid:
    "The buyer sends RMB to the seller's Alipay or WeChat account shown inside the trade, then marks “I've Paid.”",
  payment_confirmed:
    "The seller checks their account and confirms the RMB actually arrived — this is a separate action from the buyer's, on purpose (see below).",
  naira_released:
    "With both sides confirmed, NGN settlement to the seller's verified bank account is initiated.",
  completed:
    "The trade closes out, both sides can rate each other, and it moves into your transaction history.",
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6">
      <div className="text-center">
        <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-brand-600 dark:text-brand-300">
          How it works
        </span>
        <h1 className="mt-2 text-[34px] font-bold tracking-[-0.02em] text-neutral-900 sm:text-[40px] dark:text-white">
          From offer to settlement, in seven stages
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          Every ScarExchange trade — whether you&apos;re buying or selling — walks through the
          same state machine. Nothing skips a step, and nobody can mark a stage done on the
          other person&apos;s behalf.
        </p>
      </div>

      <ol className="mt-14 space-y-6">
        {TRADE_STAGES.map((stage, index) => (
          <li key={stage.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
                <stage.icon className="size-[18px]" strokeWidth={2} />
              </span>
              {index < TRADE_STAGES.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-hairline" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0 flex-1 pb-2">
              <p className="text-[12px] font-semibold uppercase tracking-[0.05em] text-neutral-400">
                Stage {index + 1}
              </p>
              <p className="mt-0.5 text-[16px] font-bold text-neutral-900 dark:text-white">
                {stage.label}
              </p>
              <p className="mt-1 max-w-lg text-[13.5px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                {STAGE_DETAIL[stage.id]}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-hairline bg-card p-5 shadow-card">
          <p className="text-[14px] font-bold text-neutral-900 dark:text-white">
            Buying RMB? Your one job is Stage 4.
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-300">
            Send the exact amount to the account shown in the trade, then mark it paid. You
            can&apos;t confirm receipt for the seller — that step is theirs.
          </p>
        </div>
        <div className="rounded-2xl border border-hairline bg-card p-5 shadow-card">
          <p className="text-[14px] font-bold text-neutral-900 dark:text-white">
            Selling RMB? Your one job is Stage 5.
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-300">
            Once the buyer&apos;s RMB genuinely lands in your account, confirm it. Settlement
            only moves after that — never on the buyer&apos;s say-so alone.
          </p>
        </div>
      </div>

      <Callout tone="brand" icon={MessageSquare} title="Why two separate confirmations?" className="mt-6">
        A single &quot;Payment Successful&quot; button — pressed by whoever&apos;s in a hurry —
        is how P2P trading gets exploited. ScarExchange never releases anything on one
        side&apos;s word alone:
        the buyer says they paid, the seller separately confirms they received it, and only
        then does settlement move.
      </Callout>

      <div className="mt-10 rounded-2xl border border-hairline bg-surface-subtle p-5 dark:bg-neutral-900/40">
        <p className="text-[14px] font-bold text-neutral-900 dark:text-white">
          Negotiating the rate
        </p>
        <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          Every offer&apos;s listed rate is a starting point, not a fixed price. Open an offer
          and use its chat to counter — &quot;Can you do ₦218?&quot; — and once the other side
          accepts, the rate locks for that trade and can&apos;t drift while payment is in
          progress.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/buy"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Buy RMB
          <ArrowRight className="size-4" strokeWidth={2.4} />
        </Link>
        <Link
          href="/sell"
          className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-card px-6 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:border-brand-800 dark:text-brand-200 dark:hover:bg-brand-900/30"
        >
          Sell RMB
          <ArrowRight className="size-4" strokeWidth={2.4} />
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px]">
        <Link
          href="/security-overview"
          className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
        >
          <ShieldCheck className="size-4" strokeWidth={2} />
          How ScarExchange keeps trades safe
        </Link>
        <Link
          href="/faq"
          className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
        >
          Read the FAQ
        </Link>
      </div>
    </div>
  );
}
