"use client";

import { useState } from "react";
import { Coins, ShoppingBag } from "lucide-react";
import { OfferBrowser } from "@/components/marketplace/offer-browser";
import type { Offer, TradeSide } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Marketplace overview (PRD §47) — the same offer book as Buy/Sell RMB, but
 * side-by-side behind one toggle so a trader can compare both directions
 * without leaving the page.
 */
export function MarketplaceBrowser({
  sellOffers,
  buyOffers,
  totalSellers,
  totalBuyers,
}: {
  sellOffers: Offer[];
  buyOffers: Offer[];
  totalSellers: number;
  totalBuyers: number;
}) {
  const [side, setSide] = useState<TradeSide>("sell");

  return (
    <div>
      <div className="mb-4 inline-flex rounded-xl border border-hairline bg-card p-1 shadow-card">
        <SideTab
          active={side === "sell"}
          onClick={() => setSide("sell")}
          icon={ShoppingBag}
          label={`Buy RMB (${sellOffers.length})`}
        />
        <SideTab
          active={side === "buy"}
          onClick={() => setSide("buy")}
          icon={Coins}
          label={`Sell RMB (${buyOffers.length})`}
        />
      </div>

      {side === "sell" ? (
        <OfferBrowser offers={sellOffers} side="sell" totalCount={totalSellers} />
      ) : (
        <OfferBrowser offers={buyOffers} side="buy" totalCount={totalBuyers} />
      )}
    </div>
  );
}

function SideTab({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof ShoppingBag;
  label: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors",
        active
          ? "bg-brand-600 text-white"
          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white",
      )}
    >
      <Icon className="size-3.5" strokeWidth={2.2} />
      {label}
    </button>
  );
}
