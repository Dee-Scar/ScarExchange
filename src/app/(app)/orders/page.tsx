import type { Metadata } from "next";
import { Coins, PauseCircle, Plus, Tags } from "lucide-react";
import { ButtonLink } from "@/components/kit/button-link";
import { RailBadge } from "@/components/kit/payment-rail";
import { EmptyState, PageHeader } from "@/components/kit/primitives";
import { StatCard } from "@/components/kit/stat-card";
import { OfferStatusBadge, SideBadge } from "@/components/kit/status-badge";
import { getMyOffers } from "@/lib/api";
import { formatDateTime } from "@/lib/date";
import { formatCount, formatRate, formatRmb } from "@/lib/money";

export const metadata: Metadata = { title: "My Offers" };

/** The signed-in user's own posted offers (PRD §22 "My Offers" — the dashboard quick action links here). */
export default async function OrdersPage() {
  const offers = await getMyOffers();

  const active = offers.filter((o) => o.status === "active");
  const paused = offers.filter((o) => o.status === "paused");
  const liveRmb = active.reduce((sum, o) => sum + o.availableRmb, 0);

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <PageHeader
        title="My Offers"
        description="The buy and sell offers you've posted to the marketplace."
        actions={
          <ButtonLink href="/sell/create" className="gap-2">
            <Plus className="size-4" strokeWidth={2.2} />
            Create Offer
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active Offers" value={formatCount(active.length)} icon={Tags} tone="success" />
        <StatCard label="Paused Offers" value={formatCount(paused.length)} icon={PauseCircle} tone="warning" />
        <StatCard
          label="RMB Live in Market"
          value={formatRmb(liveRmb)}
          icon={Coins}
          tone="rmb"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-hairline bg-card shadow-card">
        {offers.length === 0 ? (
          <EmptyState
            icon={Tags}
            title="You haven't posted any offers yet"
            description="Create an offer to start receiving trades at your own rate."
            action={
              <ButtonLink href="/sell/create" size="sm">
                Create Offer
              </ButtonLink>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="border-b border-hairline bg-surface-subtle dark:bg-neutral-900/50">
                  {["Type", "Rate", "Available / Limits", "Payment", "Status", "Posted", "Updated"].map(
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
                {offers.map((offer) => (
                  <tr
                    key={offer.id}
                    className="border-b border-hairline last:border-0 hover:bg-surface-subtle dark:hover:bg-neutral-900/40"
                  >
                    <td className="px-5 py-4">
                      <SideBadge side={offer.side} />
                    </td>
                    <td className="tabular px-5 py-4 text-[13.5px] font-semibold text-neutral-900 dark:text-white">
                      {formatRate(offer.rate)}
                      <span className="text-[11px] font-normal text-neutral-400"> /RMB</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="tabular text-[13px] text-neutral-700 dark:text-neutral-200">
                        {formatRmb(offer.availableRmb, { decimals: true })}
                      </p>
                      <p className="tabular mt-0.5 text-[11px] text-neutral-400">
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
                      <OfferStatusBadge status={offer.status} />
                    </td>
                    <td className="tabular px-5 py-4 text-[12px] text-neutral-500 dark:text-neutral-400">
                      {formatDateTime(offer.createdAt)}
                    </td>
                    <td className="tabular px-5 py-4 text-[12px] text-neutral-500 dark:text-neutral-400">
                      {formatDateTime(offer.updatedAt)}
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
