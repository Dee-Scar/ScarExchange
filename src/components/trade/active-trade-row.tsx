import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TradeStateBadge } from "@/components/kit/status-badge";
import { TraderAvatar, VerifiedTick } from "@/components/kit/trader";
import { formatNgn, formatRate, formatRmb } from "@/lib/money";
import type { Trade } from "@/lib/types";

/** One in-progress trade, linking into its trade room — shared by the dashboard panel and /trades/active. */
export function ActiveTradeRow({ trade }: { trade: Trade }) {
  const counterparty = trade.side === "buy" ? trade.seller : trade.buyer;

  return (
    <li>
      <Link
        href={`/trades/${trade.reference}`}
        className="flex flex-wrap items-center gap-3 px-5 py-4 transition-colors hover:bg-surface-subtle dark:hover:bg-neutral-800/50"
      >
        <TraderAvatar trader={counterparty} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="tabular text-[13.5px] font-semibold text-neutral-900 dark:text-white">
              {trade.reference}
            </span>
            {counterparty.verified && <VerifiedTick className="size-3.5" />}
          </div>
          <p className="text-[11.5px] text-neutral-500 dark:text-neutral-400">
            {trade.side === "buy" ? "Buying from" : "Selling to"} {counterparty.username}
          </p>
        </div>

        <div className="text-right">
          <p className="tabular text-[13.5px] font-bold text-neutral-900 dark:text-white">
            {formatRmb(trade.amountRmb)}
          </p>
          <p className="tabular text-[11.5px] text-neutral-500 dark:text-neutral-400">
            {formatRate(trade.rate)} = {formatNgn(trade.amountNgn)}
          </p>
        </div>

        <TradeStateBadge state={trade.state} />

        <ArrowRight className="size-4 shrink-0 text-neutral-300" strokeWidth={2.2} />
      </Link>
    </li>
  );
}
