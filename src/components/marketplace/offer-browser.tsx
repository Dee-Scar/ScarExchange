"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Search, SlidersHorizontal, Store } from "lucide-react";
import { ButtonLink } from "@/components/kit/button-link";
import { RailBadge } from "@/components/kit/payment-rail";
import { EmptyState } from "@/components/kit/primitives";
import { Rating, TraderAvatar, VerifiedTick } from "@/components/kit/trader";
import {
  OfferFilters,
  emptyFilters,
  type OfferFilterState,
} from "@/components/marketplace/offer-filters";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatCount,
  formatDuration,
  formatPercent,
  formatRate,
  formatRmb,
  fromScaledRate,
  toMinor,
  toScaledRate,
} from "@/lib/money";
import type { Offer, TradeSide } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey = "best_rate" | "fastest" | "highest_rated" | "most_trades";

const SORT_LABELS: Record<SortKey, string> = {
  best_rate: "Best Rate",
  fastest: "Fastest Release",
  highest_rated: "Highest Rated",
  most_trades: "Most Trades",
};

const PAGE_SIZE = 5;

/**
 * The offer book (PRD §10, §11).
 *
 * Filtering and sorting run client-side over the offers the server supplied —
 * when the real endpoint lands, the same state object becomes the query string
 * and this component only loses its local filter step.
 */
export function OfferBrowser({
  offers,
  side,
  /** Total across all pages, from the server. */
  totalCount,
}: {
  offers: Offer[];
  side: TradeSide;
  totalCount?: number;
}) {
  const [filters, setFilters] = useState<OfferFilterState>(emptyFilters);
  const [sort, setSort] = useState<SortKey>("best_rate");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const visible = useMemo(() => {
    const rateMin = filters.rateMin ? toScaledRate(Number(filters.rateMin)) : null;
    const rateMax = filters.rateMax ? toScaledRate(Number(filters.rateMax)) : null;
    const amountMin = filters.amountMin ? toMinor(Number(filters.amountMin)) : null;
    const amountMax = filters.amountMax ? toMinor(Number(filters.amountMax)) : null;
    const minCompletion = filters.minCompletion ? Number(filters.minCompletion) / 100 : null;
    const needle = search.trim().toLowerCase();

    const filtered = offers.filter((offer) => {
      if (filters.rails.length && !offer.rails.some((r) => filters.rails.includes(r))) {
        return false;
      }
      if (rateMin != null && offer.rate < rateMin) return false;
      if (rateMax != null && offer.rate > rateMax) return false;
      if (amountMin != null && offer.availableRmb < amountMin) return false;
      if (amountMax != null && offer.availableRmb > amountMax) return false;
      if (filters.merchantsOnly && !offer.trader.isMerchant) return false;
      if (minCompletion != null && offer.trader.completionRate < minCompletion) return false;
      if (needle && !offer.trader.username.toLowerCase().includes(needle)) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "best_rate":
          return side === "sell" ? a.rate - b.rate : b.rate - a.rate;
        case "fastest":
          return a.trader.avgReleaseTime - b.trader.avgReleaseTime;
        case "highest_rated":
          return b.trader.rating - a.trader.rating;
        case "most_trades":
          return b.trader.completedTrades - a.trader.completedTrades;
      }
    });
  }, [offers, filters, sort, search, side]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = visible.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  // The single best rate on the board, so it can be called out.
  const bestRate = visible.length
    ? side === "sell"
      ? Math.min(...visible.map((o) => o.rate))
      : Math.max(...visible.map((o) => o.rate))
    : null;

  const shownTotal = totalCount ?? visible.length;
  const firstIndex = visible.length === 0 ? 0 : safePage * PAGE_SIZE + 1;
  const lastIndex = safePage * PAGE_SIZE + pageRows.length;

  function updateFilters(next: OfferFilterState) {
    setFilters(next);
    setPage(0);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[264px_minmax(0,1fr)]">
      <div className="hidden lg:block">
        <OfferFilters value={filters} onChange={updateFilters} />
      </div>

      <div className="min-w-0">
        {/* Search, sort, and the mobile filter drawer trigger. */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
              strokeWidth={2}
            />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Search by username or amount"
              aria-label="Search offers"
              className="h-11 w-full rounded-xl border border-hairline bg-card pl-10 pr-3 text-[13.5px] text-neutral-900 outline-none transition-shadow placeholder:text-neutral-400 focus:border-brand-300 focus:shadow-focus dark:text-white"
            />
          </div>

          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="h-11 w-[190px] rounded-xl border-hairline bg-card text-[13.5px]">
              <span className="text-neutral-500">Sort by:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {SORT_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-hairline bg-card text-neutral-500 transition-colors hover:text-neutral-900 lg:hidden"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="size-4" strokeWidth={2} />
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] overflow-y-auto p-4">
              <SheetTitle className="sr-only">Filters</SheetTitle>
              <OfferFilters
                value={filters}
                onChange={updateFilters}
                onApply={() => setDrawerOpen(false)}
                className="border-0 p-0 shadow-none"
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="overflow-hidden rounded-2xl border border-hairline bg-card shadow-card">
          {pageRows.length === 0 ? (
            <EmptyState
              icon={Store}
              title="No offers match your filters"
              description="Try widening the rate range or clearing a payment method."
              action={
                <Button variant="outline" onClick={() => updateFilters(emptyFilters)}>
                  Clear all filters
                </Button>
              }
            />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[860px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-hairline bg-surface-subtle dark:bg-neutral-900/50">
                      {["Seller", "Rate (₦/RMB)", "Available / Limits", "Payment Method", "Completion", "Action"].map(
                        (heading) => (
                          <th
                            key={heading}
                            scope="col"
                            className={cn(
                              "px-5 py-3 text-[12px] font-semibold text-neutral-500 dark:text-neutral-400",
                              heading === "Action" && "text-right",
                            )}
                          >
                            {heading}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((offer) => (
                      <OfferRow
                        key={offer.id}
                        offer={offer}
                        side={side}
                        isBest={offer.rate === bestRate}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards — a 6-column table cannot be read on a phone. */}
              <ul className="divide-y divide-hairline md:hidden">
                {pageRows.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    side={side}
                    isBest={offer.rate === bestRate}
                  />
                ))}
              </ul>
            </>
          )}

          {pageRows.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline px-5 py-3.5">
              <p className="text-[12.5px] text-neutral-500 dark:text-neutral-400">
                Showing {firstIndex} to {lastIndex} of {formatCount(shownTotal)}{" "}
                {side === "sell" ? "sellers" : "buyers"}
              </p>
              <Pagination page={safePage} pageCount={pageCount} onChange={setPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OfferRow({
  offer,
  side,
  isBest,
}: {
  offer: Offer;
  side: TradeSide;
  isBest: boolean;
}) {
  const action = side === "sell" ? "Buy" : "Sell";

  return (
    <tr className="border-b border-hairline transition-colors last:border-0 hover:bg-surface-subtle dark:hover:bg-neutral-900/40">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <TraderAvatar trader={offer.trader} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[13.5px] font-semibold text-neutral-900 dark:text-white">
                {offer.trader.username}
              </span>
              {offer.trader.verified && <VerifiedTick />}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              {offer.trader.isMerchant && (
                <span className="text-[11px] font-semibold text-brand-700 dark:text-brand-300">
                  Verified Merchant
                </span>
              )}
              <Rating value={offer.trader.rating} className="text-[11px]" />
            </div>
            <p className="tabular mt-0.5 text-[11px] text-neutral-400">
              {formatCount(offer.trader.completedTrades)} trades ·{" "}
              {formatPercent(offer.trader.completionRate)}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <p
          className={cn(
            "tabular text-[15px] font-bold",
            isBest ? "text-success-600 dark:text-success-300" : "text-neutral-900 dark:text-white",
          )}
        >
          {formatRate(offer.rate)}
        </p>
        {isBest && (
          <span className="mt-1 inline-block rounded bg-success-50 px-1.5 py-0.5 text-[10px] font-bold text-success-700 dark:bg-success-900/40 dark:text-success-200">
            Best Rate
          </span>
        )}
      </td>

      <td className="px-5 py-4">
        <p className="tabular text-[13.5px] font-semibold text-neutral-900 dark:text-white">
          {formatRmb(offer.availableRmb, { decimals: true })}
        </p>
        <p className="tabular mt-0.5 text-[11.5px] text-neutral-500 dark:text-neutral-400">
          Min {formatRmb(offer.minOrderRmb)} · Max {formatRmb(offer.maxOrderRmb)}
        </p>
      </td>

      <td className="px-5 py-4">
        <div className="flex flex-wrap gap-1.5">
          {offer.rails.map((rail) => (
            <RailBadge key={rail} rail={rail} />
          ))}
        </div>
      </td>

      <td className="px-5 py-4">
        <p className="tabular text-[13.5px] font-semibold text-neutral-900 dark:text-white">
          {formatPercent(offer.trader.completionRate)}
        </p>
        <p className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] text-neutral-500 dark:text-neutral-400">
          {formatDuration(offer.trader.avgReleaseTime)} avg
          <Clock className="size-3" strokeWidth={2} />
        </p>
      </td>

      <td className="px-5 py-4 text-right">
        <ButtonLink href={`/offers/${offer.id}`} size="sm" className="px-6">
          {action}
        </ButtonLink>
      </td>
    </tr>
  );
}

function OfferCard({
  offer,
  side,
  isBest,
}: {
  offer: Offer;
  side: TradeSide;
  isBest: boolean;
}) {
  return (
    <li className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <TraderAvatar trader={offer.trader} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-[13.5px] font-semibold text-neutral-900 dark:text-white">
                {offer.trader.username}
              </span>
              {offer.trader.verified && <VerifiedTick />}
            </div>
            <p className="tabular text-[11px] text-neutral-500 dark:text-neutral-400">
              {formatPercent(offer.trader.completionRate)} ·{" "}
              {formatCount(offer.trader.completedTrades)} trades
            </p>
          </div>
        </div>
        <div className="text-right">
          <p
            className={cn(
              "tabular text-[17px] font-bold leading-none",
              isBest ? "text-success-600 dark:text-success-300" : "text-neutral-900 dark:text-white",
            )}
          >
            {formatRate(offer.rate)}
          </p>
          <p className="mt-0.5 text-[11px] text-neutral-400">/RMB</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {offer.rails.map((rail) => (
          <RailBadge key={rail} rail={rail} />
        ))}
        <span className="tabular ml-auto text-[11.5px] text-neutral-500 dark:text-neutral-400">
          Available {formatRmb(offer.availableRmb)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="tabular text-[11.5px] text-neutral-500 dark:text-neutral-400">
          Min {formatRmb(offer.minOrderRmb)} · Max {formatRmb(offer.maxOrderRmb)}
        </p>
        <ButtonLink href={`/offers/${offer.id}`} size="sm">
          {side === "sell" ? "Buy" : "Sell"}
        </ButtonLink>
      </div>
    </li>
  );
}

function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  // Show up to four numbers, then an ellipsis and the last page.
  const numbers: (number | "gap")[] = [];
  if (pageCount <= 5) {
    for (let i = 0; i < pageCount; i += 1) numbers.push(i);
  } else {
    numbers.push(0, 1, 2, "gap", pageCount - 1);
  }

  return (
    <nav className="flex items-center gap-1" aria-label="Pagination">
      <PageButton
        onClick={() => onChange(Math.max(0, page - 1))}
        disabled={page === 0}
        label="Previous page"
      >
        <ChevronLeft className="size-4" strokeWidth={2.2} />
      </PageButton>

      {numbers.map((n, i) =>
        n === "gap" ? (
          <span key={`gap-${i}`} className="px-1.5 text-[13px] text-neutral-400">
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page ? "page" : undefined}
            className={cn(
              "tabular grid size-8 place-items-center rounded-lg text-[13px] font-medium transition-colors",
              n === page
                ? "bg-brand-600 text-white"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
            )}
          >
            {n + 1}
          </button>
        ),
      )}

      <PageButton
        onClick={() => onChange(Math.min(pageCount - 1, page + 1))}
        disabled={page >= pageCount - 1}
        label="Next page"
      >
        <ChevronRight className="size-4" strokeWidth={2.2} />
      </PageButton>
    </nav>
  );
}

function PageButton({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-8 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-300 dark:hover:bg-neutral-800 dark:disabled:text-neutral-600"
    >
      {children}
    </button>
  );
}

export { fromScaledRate };
