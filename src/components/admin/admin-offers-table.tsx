"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Tags } from "lucide-react";
import { EmptyState } from "@/components/kit/primitives";
import { RailBadge } from "@/components/kit/payment-rail";
import { OfferStatusBadge, SideBadge } from "@/components/kit/status-badge";
import { VerifiedTick } from "@/components/kit/trader";
import { formatDateTime } from "@/lib/date";
import { formatRate, formatRmb } from "@/lib/money";
import type { Offer, OfferStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "all" | OfferStatus;

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "paused", label: "Paused" },
  { id: "suspended", label: "Suspended" },
  { id: "expired", label: "Expired" },
  { id: "filled", label: "Filled" },
];

export function AdminOffersTable({ offers }: { offers: Offer[] }) {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return offers.filter((offer) => {
      if (tab !== "all" && offer.status !== tab) return false;
      if (needle && !offer.trader.username.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [offers, tab, search]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter offers">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-lg px-4 py-2 text-[13px] font-medium transition-colors",
                tab === item.id
                  ? "bg-brand-600 text-white"
                  : "bg-card text-neutral-600 ring-1 ring-inset ring-hairline hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative ml-auto min-w-0 flex-1 sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
            strokeWidth={2}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by trader"
            aria-label="Search offers"
            className="h-10 w-full rounded-xl border border-hairline bg-card pl-10 pr-3 text-[13px] text-neutral-900 outline-none transition-shadow focus:border-brand-300 focus:shadow-focus dark:text-white"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-hairline bg-card shadow-card">
        {rows.length === 0 ? (
          <EmptyState
            icon={Tags}
            title="No offers found"
            description="Nothing matches this filter yet."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-left">
              <thead>
                <tr className="border-b border-hairline bg-surface-subtle dark:bg-neutral-900/50">
                  {["Trader", "Side", "Rate", "Available / Limits", "Payment", "Status", "Updated", ""].map(
                    (heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="px-5 py-3 text-[12px] font-semibold text-neutral-500 dark:text-neutral-400"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((offer) => (
                  <tr
                    key={offer.id}
                    className="border-b border-hairline last:border-0 hover:bg-surface-subtle dark:hover:bg-neutral-900/40"
                  >
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-900 dark:text-white">
                        {offer.trader.username}
                        {offer.trader.verified && <VerifiedTick className="size-3.5" />}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <SideBadge side={offer.side} />
                    </td>
                    <td className="tabular px-5 py-3.5 text-[13px] font-semibold text-neutral-900 dark:text-white">
                      {formatRate(offer.rate)}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="tabular text-[13px] text-neutral-700 dark:text-neutral-200">
                        {formatRmb(offer.availableRmb, { decimals: true })}
                      </p>
                      <p className="tabular mt-0.5 text-[11px] text-neutral-400">
                        Min {formatRmb(offer.minOrderRmb)} · Max {formatRmb(offer.maxOrderRmb)}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {offer.rails.map((rail) => (
                          <RailBadge key={rail} rail={rail} />
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <OfferStatusBadge status={offer.status} />
                    </td>
                    <td className="tabular px-5 py-3.5 text-[12px] text-neutral-400">
                      {formatDateTime(offer.updatedAt)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/offers/${offer.id}`}
                        className="text-[12.5px] font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
