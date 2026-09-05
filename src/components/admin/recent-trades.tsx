"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, MoreVertical } from "lucide-react";
import { CopyButton } from "@/components/kit/copy-button";
import { SideBadge, TradeStateBadge } from "@/components/kit/status-badge";
import { VerifiedTick } from "@/components/kit/trader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuLink } from "@/components/kit/menu-link";
import { formatTime } from "@/lib/date";
import type { TradeState } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AdminTradeRow {
  reference: string;
  side: "buy" | "sell";
  username: string;
  verified: boolean;
  rmb: number;
  rate: number;
  ngn: number;
  state: TradeState;
  at: string;
}

const TABS = [
  { id: "all", label: "All Trades" },
  { id: "pending", label: "Pending" },
  { id: "completed", label: "Completed" },
  { id: "disputed", label: "Disputed" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/** Live trade feed on the admin dashboard, filtered by settlement state. */
export function AdminRecentTrades({ trades }: { trades: AdminTradeRow[] }) {
  const [tab, setTab] = useState<TabId>("all");

  const rows = useMemo(() => {
    if (tab === "all") return trades;
    return trades.filter((trade) => {
      if (tab === "completed") return trade.state === "COMPLETED";
      if (tab === "disputed") return trade.state === "DISPUTED";
      return !["COMPLETED", "DISPUTED", "CANCELLED", "FAILED", "EXPIRED"].includes(
        trade.state,
      );
    });
  }, [trades, tab]);

  return (
    <section className="overflow-hidden rounded-2xl border border-hairline bg-card shadow-card">
      <header className="flex items-center justify-between gap-3 px-5 pb-3 pt-4">
        <h2 className="text-[15px] font-semibold text-neutral-900 dark:text-white">
          Recent Trades
        </h2>
        <Link
          href="/admin/trades"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-600 dark:text-brand-300"
        >
          View All Trades <ArrowRight className="size-3.5" strokeWidth={2.4} />
        </Link>
      </header>

      <div className="flex gap-1 px-5 pb-3" role="tablist" aria-label="Trade status filter">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
              tab === item.id
                ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"
                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-left">
          <thead>
            <tr className="border-y border-hairline bg-surface-subtle dark:bg-neutral-900/50">
              {[
                "Trade ID",
                "Type",
                "User",
                "Amount (RMB)",
                "Rate (₦)",
                "NGN Amount",
                "Status",
                "Time",
                "",
              ].map((heading, i) => (
                <th
                  key={heading || `spacer-${i}`}
                  scope="col"
                  className="px-4 py-2.5 text-[12px] font-semibold text-neutral-500 dark:text-neutral-400"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-[13px] text-neutral-500 dark:text-neutral-400"
                >
                  No trades in this state right now.
                </td>
              </tr>
            ) : (
              rows.map((trade) => (
                <tr
                  key={trade.reference}
                  className="border-b border-hairline transition-colors last:border-0 hover:bg-surface-subtle dark:hover:bg-neutral-900/40"
                >
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1">
                      <Link
                        href={`/admin/trades/${trade.reference}`}
                        className="tabular text-[13px] font-medium text-neutral-900 hover:text-brand-600 dark:text-white"
                      >
                        {trade.reference}
                      </Link>
                      <CopyButton value={trade.reference} label="Trade ID" />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <SideBadge side={trade.side} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1">
                      <span className="text-[13px] text-neutral-700 dark:text-neutral-200">
                        @{trade.username}
                      </span>
                      {trade.verified && <VerifiedTick className="size-3.5" />}
                    </span>
                  </td>
                  <td className="tabular px-4 py-3 text-[13px] font-medium text-neutral-900 dark:text-white">
                    ¥{trade.rmb.toLocaleString("en-NG")}
                  </td>
                  <td className="tabular px-4 py-3 text-[13px] text-neutral-700 dark:text-neutral-200">
                    ₦{trade.rate.toFixed(2)}
                  </td>
                  <td className="tabular px-4 py-3 text-[13px] font-medium text-neutral-900 dark:text-white">
                    ₦{trade.ngn.toLocaleString("en-NG")}
                  </td>
                  <td className="px-4 py-3">
                    <TradeStateBadge state={trade.state} />
                  </td>
                  <td className="tabular px-4 py-3 text-[12.5px] text-neutral-500 dark:text-neutral-400">
                    {formatTime(trade.at)}
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label={`Actions for ${trade.reference}`}
                        className="grid size-7 place-items-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
                      >
                        <MoreVertical className="size-4" strokeWidth={2} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <MenuLink href={`/admin/trades/${trade.reference}`}>
                          View trade details
                        </MenuLink>
                        <MenuLink href={`/admin/users/${trade.username}`}>
                          View user
                        </MenuLink>
                        <MenuLink href={`/admin/trades/${trade.reference}?action=review`}>
                          Flag for review
                        </MenuLink>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3">
        <Link
          href="/admin/trades"
          className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-600 dark:text-brand-300"
        >
          View all trades →
        </Link>
      </div>
    </section>
  );
}
