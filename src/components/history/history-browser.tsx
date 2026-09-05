"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Eraser, Filter, Receipt, Search } from "lucide-react";
import { ButtonLink } from "@/components/kit/button-link";
import { CopyButton } from "@/components/kit/copy-button";
import { BankChip, RailIcon, railLabel } from "@/components/kit/payment-rail";
import { EmptyState } from "@/components/kit/primitives";
import { SideBadge, TradeStateBadge } from "@/components/kit/status-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, formatTime } from "@/lib/date";
import { formatCount, formatNgn, formatRate, formatRmb } from "@/lib/money";
import type { PaymentRail, Trade, TradeSide } from "@/lib/types";
import { cn } from "@/lib/utils";

type StatusKey = "completed" | "pending" | "cancelled" | "disputed";
type CurrencyKey = "all" | "RMB" | "NGN";

const STATUS_OPTIONS: { id: StatusKey; label: string }[] = [
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Pending" },
  { id: "cancelled", label: "Cancelled" },
  { id: "disputed", label: "Disputed" },
];

const RAIL_OPTIONS: PaymentRail[] = ["alipay", "wechat", "bank_transfer"];

const TABS = [
  { id: "all", label: "All" },
  { id: "buy", label: "Buy" },
  { id: "sell", label: "Sell" },
  { id: "completed", label: "Completed" },
  { id: "pending", label: "Pending" },
  { id: "cancelled", label: "Cancelled" },
  { id: "disputed", label: "Disputed" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const PAGE_SIZE = 7;

/** Map the full state machine onto the four buckets users filter by. */
function bucketOf(trade: Trade): StatusKey {
  switch (trade.state) {
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
    case "EXPIRED":
    case "FAILED":
      return "cancelled";
    case "DISPUTED":
    case "UNDER_REVIEW":
      return "disputed";
    default:
      return "pending";
  }
}

export function HistoryBrowser({
  trades,
  banks,
}: {
  trades: Trade[];
  /** Settlement bank per trade reference, shown beneath the amount. */
  banks: Record<string, string>;
}) {
  const [tab, setTab] = useState<TabId>("all");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | TradeSide>("all");
  const [statuses, setStatuses] = useState<StatusKey[]>([]);
  const [rails, setRails] = useState<PaymentRail[]>([]);
  const [currency, setCurrency] = useState<CurrencyKey>("all");
  const [range, setRange] = useState("30d");
  const [page, setPage] = useState(0);

  const rows = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return trades.filter((trade) => {
      // Tab and the sidebar type control are two routes to the same filter.
      if (tab === "buy" || tab === "sell") {
        if (trade.side !== tab) return false;
      } else if (tab !== "all" && bucketOf(trade) !== tab) {
        return false;
      }

      if (typeFilter !== "all" && trade.side !== typeFilter) return false;
      if (statuses.length && !statuses.includes(bucketOf(trade))) return false;
      if (rails.length && !rails.includes(trade.rail)) return false;

      if (needle) {
        const haystack = `${trade.reference} ${trade.buyer.username} ${trade.seller.username}`;
        if (!haystack.toLowerCase().includes(needle)) return false;
      }
      return true;
    });
  }, [trades, tab, typeFilter, statuses, rails, search]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = rows.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  function reset() {
    setTypeFilter("all");
    setStatuses([]);
    setRails([]);
    setCurrency("all");
    setSearch("");
    setRange("30d");
    setTab("all");
    setPage(0);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_296px]">
      <div className="min-w-0">
        {/* Tabs */}
        <div
          className="mb-4 flex flex-wrap gap-1.5"
          role="tablist"
          aria-label="Filter transactions"
        >
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => {
                setTab(item.id);
                setPage(0);
              }}
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

        <div className="overflow-hidden rounded-2xl border border-hairline bg-card shadow-card">
          {pageRows.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No transactions found"
              description="Nothing matches these filters yet. Try clearing one of them."
              action={
                <Button variant="outline" onClick={reset}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[920px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-hairline bg-surface-subtle dark:bg-neutral-900/50">
                      {["Trade ID", "Type", "Amount", "Rate", "Total (NGN)", "Status", "Date", "Action"].map(
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
                    {pageRows.map((trade) => (
                      <tr
                        key={trade.reference}
                        className="border-b border-hairline transition-colors last:border-0 hover:bg-surface-subtle dark:hover:bg-neutral-900/40"
                      >
                        <td className="px-5 py-4">
                          <span className="flex items-center gap-1">
                            <span className="tabular text-[13px] font-medium text-neutral-900 dark:text-white">
                              {trade.reference}
                            </span>
                            <CopyButton value={trade.reference} label="Trade ID" />
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <SideBadge side={trade.side} />
                        </td>
                        <td className="px-5 py-4">
                          <p className="tabular text-[13.5px] font-semibold text-neutral-900 dark:text-white">
                            {formatRmb(trade.amountRmb)}
                          </p>
                          <span className="mt-1 flex items-center gap-2">
                            <span className="inline-flex items-center gap-1">
                              <RailIcon rail={trade.rail} className="size-4" />
                              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                {railLabel(trade.rail)}
                              </span>
                            </span>
                            {banks[trade.reference] && (
                              <BankChip
                                name={banks[trade.reference]}
                                className="[&_span:last-child]:text-[11px] [&_span:first-child]:size-4 [&_span:first-child]:text-[8px]"
                              />
                            )}
                          </span>
                        </td>
                        <td className="tabular px-5 py-4 text-[13px] text-neutral-700 dark:text-neutral-200">
                          {formatRate(trade.rate)}/RMB
                        </td>
                        <td className="tabular px-5 py-4 text-[13.5px] font-semibold text-neutral-900 dark:text-white">
                          {formatNgn(trade.amountNgn)}
                        </td>
                        <td className="px-5 py-4">
                          <TradeStateBadge state={trade.state} />
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-[12.5px] text-neutral-700 dark:text-neutral-200">
                            {formatDate(trade.createdAt)}
                          </p>
                          <p className="tabular mt-0.5 text-[11.5px] text-neutral-400">
                            {formatTime(trade.createdAt)}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <ButtonLink
                            href={`/trades/${trade.reference}`}
                            variant="outline"
                            size="sm"
                            className="gap-1.5"
                          >
                            View
                            <ArrowRight className="size-3.5" strokeWidth={2.4} />
                          </ButtonLink>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <ul className="divide-y divide-hairline md:hidden">
                {pageRows.map((trade) => (
                  <li key={trade.reference} className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5">
                        <span className="tabular text-[13px] font-semibold text-neutral-900 dark:text-white">
                          {trade.reference}
                        </span>
                        <SideBadge side={trade.side} />
                      </span>
                      <TradeStateBadge state={trade.state} />
                    </div>
                    <div className="mt-2.5 flex items-end justify-between gap-3">
                      <div>
                        <p className="tabular text-[17px] font-bold text-neutral-900 dark:text-white">
                          {formatNgn(trade.amountNgn)}
                        </p>
                        <p className="tabular mt-0.5 text-[11.5px] text-neutral-500 dark:text-neutral-400">
                          {formatRmb(trade.amountRmb)} @ {formatRate(trade.rate)}
                        </p>
                      </div>
                      <ButtonLink
                        href={`/trades/${trade.reference}`}
                        variant="outline"
                        size="sm"
                      >
                        View
                      </ButtonLink>
                    </div>
                    <p className="tabular mt-2 text-[11.5px] text-neutral-400">
                      {formatDate(trade.createdAt)} · {formatTime(trade.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline px-5 py-3.5">
                <p className="text-[12.5px] text-neutral-500 dark:text-neutral-400">
                  Showing {safePage * PAGE_SIZE + 1}-{safePage * PAGE_SIZE + pageRows.length} of{" "}
                  {formatCount(rows.length)} transactions
                </p>
                <nav className="flex items-center gap-1" aria-label="Pagination">
                  <button
                    type="button"
                    onClick={() => setPage(Math.max(0, safePage - 1))}
                    disabled={safePage === 0}
                    aria-label="Previous page"
                    className="grid size-8 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 disabled:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    <ChevronLeft className="size-4" strokeWidth={2.2} />
                  </button>
                  {Array.from({ length: pageCount }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPage(i)}
                      aria-current={i === safePage ? "page" : undefined}
                      className={cn(
                        "tabular grid size-8 place-items-center rounded-lg text-[13px] font-medium transition-colors",
                        i === safePage
                          ? "bg-brand-600 text-white"
                          : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPage(Math.min(pageCount - 1, safePage + 1))}
                    disabled={safePage >= pageCount - 1}
                    aria-label="Next page"
                    className="grid size-8 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 disabled:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    <ChevronRight className="size-4" strokeWidth={2.2} />
                  </button>
                </nav>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filter rail */}
      <aside className="rounded-2xl border border-hairline bg-card p-5 shadow-card">
        <h2 className="text-[15px] font-semibold text-neutral-900 dark:text-white">
          Filter &amp; Search
        </h2>

        <div className="relative mt-4">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
            strokeWidth={2}
          />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Search by Trade ID, amount, or user..."
            aria-label="Search transactions"
            className="h-10 w-full rounded-lg border border-hairline bg-card pl-9 pr-3 text-[13px] text-neutral-900 outline-none transition-shadow placeholder:text-neutral-400 focus:border-brand-300 focus:shadow-focus dark:text-white"
          />
        </div>

        <FilterBlock label="Transaction Type">
          <Segmented
            options={[
              { id: "all", label: "All" },
              { id: "buy", label: "Buy" },
              { id: "sell", label: "Sell" },
            ]}
            value={typeFilter}
            onChange={(v) => {
              setTypeFilter(v as "all" | TradeSide);
              setPage(0);
            }}
          />
        </FilterBlock>

        <FilterBlock label="Status">
          {STATUS_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-2.5 py-1.5"
            >
              <Checkbox
                checked={statuses.includes(option.id)}
                onCheckedChange={(checked) => {
                  setStatuses((prev) =>
                    checked ? [...prev, option.id] : prev.filter((s) => s !== option.id),
                  );
                  setPage(0);
                }}
              />
              <span className="text-[13px] text-neutral-700 dark:text-neutral-200">
                {option.label}
              </span>
            </label>
          ))}
        </FilterBlock>

        <FilterBlock label="Date Range">
          <Select value={range} onValueChange={(v) => setRange(v ?? "30d")}>
            <SelectTrigger className="h-10 w-full rounded-lg border-hairline text-[13px]">
              <Calendar className="size-4 text-neutral-400" strokeWidth={2} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </FilterBlock>

        <FilterBlock label="Payment Method">
          {RAIL_OPTIONS.map((rail) => (
            <label key={rail} className="flex cursor-pointer items-center gap-2.5 py-1.5">
              <Checkbox
                checked={rails.includes(rail)}
                onCheckedChange={(checked) => {
                  setRails((prev) =>
                    checked ? [...prev, rail] : prev.filter((r) => r !== rail),
                  );
                  setPage(0);
                }}
              />
              <span className="text-[13px] text-neutral-700 dark:text-neutral-200">
                {railLabel(rail)}
              </span>
            </label>
          ))}
        </FilterBlock>

        <FilterBlock label="Currency">
          <Segmented
            options={[
              { id: "all", label: "All" },
              { id: "RMB", label: "RMB" },
              { id: "NGN", label: "NGN" },
            ]}
            value={currency}
            onChange={(v) => setCurrency(v as CurrencyKey)}
          />
        </FilterBlock>

        <div className="mt-5 space-y-2">
          <Button className="w-full gap-2">
            <Filter className="size-4" strokeWidth={2.1} />
            Apply Filters
          </Button>
          <Button variant="outline" className="w-full gap-2" onClick={reset}>
            <Eraser className="size-4" strokeWidth={2.1} />
            Clear Filters
          </Button>
        </div>
      </aside>
    </div>
  );
}

function FilterBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-[13px] font-semibold text-neutral-900 dark:text-white">
        {label}
      </p>
      {children}
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
          className={cn(
            "rounded-lg py-2 text-[12.5px] font-medium transition-colors",
            value === option.id
              ? "bg-brand-600 text-white"
              : "bg-surface-subtle text-neutral-600 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
