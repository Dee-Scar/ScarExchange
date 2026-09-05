import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Info, Lock, Star } from "lucide-react";
import { Breadcrumbs, Callout, DetailRow, Panel } from "@/components/kit/primitives";
import { RailBadge } from "@/components/kit/payment-rail";
import { MerchantBadge, TraderAvatar, VerifiedTick } from "@/components/kit/trader";
import { OfferCtaButton } from "@/components/marketplace/offer-cta-button";
import { getOffer } from "@/lib/api";
import { formatCount, formatDuration, formatPercent, formatRate, formatRmb } from "@/lib/money";
import { formatDate } from "@/lib/date";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const offer = await getOffer(id);
  return { title: offer ? `${offer.trader.username}'s offer` : "Offer" };
}

export default async function OfferDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await getOffer(id);
  if (!offer) notFound();

  // "sell"-side offers are sellers of RMB, so the visiting buyer... buys.
  const action = offer.side === "sell" ? "Buy" : "Sell";
  const marketplaceHref = offer.side === "sell" ? "/buy" : "/sell";
  const marketplaceLabel = offer.side === "sell" ? "Buy RMB" : "Sell RMB";

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <Breadcrumbs
        items={[{ label: marketplaceLabel, href: marketplaceHref }, { label: "Offer details" }]}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-5">
          <section className="rounded-2xl border border-hairline bg-card p-5 shadow-card">
            <div className="flex items-start gap-4">
              <TraderAvatar trader={offer.trader} size="xl" />
              <div className="min-w-0 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                    {offer.trader.username}
                  </h1>
                  {offer.trader.verified && <VerifiedTick />}
                  {offer.trader.isMerchant && <MerchantBadge />}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[13.5px]">
                  <Star className="size-4 fill-warning-500 text-warning-500" />
                  <span className="tabular font-semibold text-neutral-900 dark:text-white">
                    {offer.trader.rating.toFixed(2)}
                  </span>
                  <span className="text-neutral-400">
                    ({formatCount(offer.trader.completedTrades)} trades)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4 border-t border-hairline pt-4">
              <Stat label="Completion Rate" value={formatPercent(offer.trader.completionRate)} />
              <Stat label="Completed Trades" value={formatCount(offer.trader.completedTrades)} />
              <Stat label="Avg. Release Time" value={formatDuration(offer.trader.avgReleaseTime)} />
            </div>
          </section>

          <Panel title="Payment Methods">
            <div className="flex flex-wrap gap-2">
              {offer.rails.map((rail) => (
                <RailBadge
                  key={rail}
                  rail={rail}
                  className="rounded-lg border border-hairline px-3 py-2"
                />
              ))}
            </div>
          </Panel>

          {offer.terms && (
            <Panel title="Terms from Trader">
              <p className="text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                {offer.terms}
              </p>
            </Panel>
          )}

          <Callout tone="brand" icon={Lock}>
            Never send funds outside this transaction. ScarExchange support will never ask for
            your password or OTP — only use payment details displayed inside the active trade.
          </Callout>
        </div>

        <aside className="min-w-0 space-y-5">
          <div className="rounded-2xl border border-hairline bg-card p-5 shadow-card">
            <p className="text-[12px] text-neutral-500 dark:text-neutral-400">Rate</p>
            <p className="tabular mt-1 text-[30px] font-bold leading-none text-neutral-900 dark:text-white">
              {formatRate(offer.rate)}
              <span className="text-[15px] font-medium text-neutral-400"> /RMB</span>
            </p>

            <dl className="mt-4 divide-y divide-hairline border-t border-hairline">
              <DetailRow label="Available" value={formatRmb(offer.availableRmb, { decimals: true })} />
              <DetailRow label="Minimum Order" value={formatRmb(offer.minOrderRmb)} />
              <DetailRow label="Maximum Order" value={formatRmb(offer.maxOrderRmb)} />
              <DetailRow
                label="Offer Updated"
                value={
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5 text-neutral-400" />
                    {formatDate(offer.updatedAt)}
                  </span>
                }
              />
            </dl>

            <div className="mt-5">
              <OfferCtaButton label={`${action} ${formatRmb(offer.availableRmb)}`} />
            </div>

            <p className="mt-3 flex items-start gap-1.5 text-[11.5px] text-neutral-400">
              <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
              The rate locks once you open a trade — it won&apos;t change while you pay.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="tabular text-[15px] font-bold text-neutral-900 dark:text-white">{value}</p>
      <p className="mt-0.5 text-[11.5px] text-neutral-500 dark:text-neutral-400">{label}</p>
    </div>
  );
}
