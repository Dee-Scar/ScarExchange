import Link from "next/link";
import {
  ArrowDown,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  Download,
  Gift,
  Headphones,
  RefreshCw,
  ShieldCheck,
  Siren,
} from "lucide-react";
import { ButtonLink } from "@/components/kit/button-link";
import { RailIcon, railLabel } from "@/components/kit/payment-rail";
import { Breadcrumbs, DetailRow, Panel } from "@/components/kit/primitives";
import { TradeStateBadge } from "@/components/kit/status-badge";
import { RateCounterparty } from "@/components/trade/rate-counterparty";
import { Confetti } from "@/components/trade/confetti";
import { formatDateTime, formatDateTimeLong } from "@/lib/date";
import { formatNgn, formatRate, formatRmb, fromScaledRate } from "@/lib/money";
import type { Trade } from "@/lib/types";

/**
 * The settled-trade view (PRD §24).
 *
 * It answers three questions in order: did it work, what exactly happened, and
 * what do I do now — with the money maths shown in full so the rate and fee
 * are never a surprise after the fact.
 */
export function TradeSuccess({
  trade,
  currentUserId,
}: {
  trade: Trade;
  currentUserId: string;
}) {
  const isSeller = trade.seller.id === currentUserId;
  const counterparty = isSeller ? trade.buyer : trade.seller;

  const rateDifference =
    fromScaledRate(trade.rate) - fromScaledRate(trade.marketRate);

  const settlementEvents = trade.events.filter((event) =>
    ["buyer_marked_paid", "payment_verified", "settlement_completed"].includes(event.type),
  );

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <Breadcrumbs
        items={[
          { label: "History", href: "/history" },
          { label: "Trade Details", href: `/trades/${trade.reference}` },
          { label: "Completed" },
        ]}
      />

      {/* Outcome */}
      <section className="relative overflow-hidden rounded-2xl border border-success-200 bg-gradient-to-b from-success-50 to-card px-6 py-10 text-center dark:border-success-700/40 dark:from-success-900/25 dark:to-card">
        <Confetti />
        <div className="relative">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-success-500">
            <CheckCircle2 className="size-9 text-white" strokeWidth={2.4} />
          </span>
          <h1 className="mt-4 text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
            Trade Completed Successfully!
          </h1>
          <p className="mt-1.5 text-[13.5px] text-neutral-600 dark:text-neutral-300">
            The {isSeller ? "buyer has received RMB and you have received Naira" : "seller has received your payment and you have received RMB"}.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <ButtonLink
              href={`/trades/${trade.reference}/receipt`}
              variant="outline"
              className="gap-2 bg-card"
            >
              <Download className="size-4" strokeWidth={2.1} />
              View Receipt
            </ButtonLink>
            <ButtonLink
              href="/dashboard"
              className="gap-2 bg-success-600 hover:bg-success-700"
            >
              Back to Dashboard
            </ButtonLink>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-5">
          <Panel title="Trade Details">
            <div className="grid gap-6 md:grid-cols-2">
              <dl className="divide-y divide-hairline">
                <DetailRow label="Trade ID" value={trade.reference} />
                <DetailRow
                  label="Trade Type"
                  value={isSeller ? "Sell RMB" : "Buy RMB"}
                />
                <DetailRow
                  label="Chinese RMB"
                  value={formatRmb(trade.amountRmb, { decimals: true })}
                />
                <DetailRow
                  label="Agreed Rate"
                  value={`¥1 = ${formatRate(trade.rate)}`}
                />
                <DetailRow
                  label={isSeller ? "Naira Received" : "Naira Paid"}
                  value={
                    <span className="text-success-600 dark:text-success-300">
                      {formatNgn(trade.amountNgn, { decimals: true })}
                    </span>
                  }
                />
                <DetailRow
                  label="Payment Method"
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      <RailIcon rail={trade.rail} className="size-4" />
                      {railLabel(trade.rail)}
                    </span>
                  }
                />
                <DetailRow
                  label="Completed On"
                  value={
                    trade.completedAt ? formatDateTimeLong(trade.completedAt) : "—"
                  }
                />
                <DetailRow
                  label="Status"
                  value={<TradeStateBadge state={trade.state} />}
                />
              </dl>

              {/* Settlement chain — each step confirmed, in order. */}
              <ol className="space-y-2">
                {settlementEvents.map((event, index) => (
                  <li key={event.id}>
                    <div className="flex items-start gap-3 rounded-xl border border-hairline p-3">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-success-50 dark:bg-success-900/30">
                        <CheckCircle2
                          className="size-4 text-success-600 dark:text-success-300"
                          strokeWidth={2.2}
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                          {event.label}
                        </p>
                        {event.description && (
                          <p className="mt-0.5 text-[12px] text-neutral-500 dark:text-neutral-400">
                            {event.description}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="tabular text-[11.5px] text-neutral-500 dark:text-neutral-400">
                          {formatDateTime(event.createdAt)}
                        </p>
                        <CheckCircle2
                          className="ml-auto mt-1 size-3.5 text-success-500"
                          strokeWidth={2.4}
                        />
                      </div>
                    </div>
                    {index < settlementEvents.length - 1 && (
                      <ArrowDown
                        className="mx-auto my-1 size-4 text-neutral-300"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </Panel>

          <Panel title="What happens next?">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Building2,
                  tone: "bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-300",
                  title: "Funds Settled",
                  body: "The Naira has been released to your bank account.",
                },
                {
                  icon: ShieldCheck,
                  tone: "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300",
                  title: "Trade Completed",
                  body: "This trade is now completed and closed.",
                },
                {
                  icon: BarChart3,
                  tone: "bg-[#f4f3ff] text-[#7a5af8] dark:bg-[#5925dc]/20",
                  title: "Build Your Reputation",
                  body: "Keep trading to build your rating and limits.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-xl ${item.tone}`}
                  >
                    <item.icon className="size-[18px]" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Other Actions">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Download,
                  label: "View Receipt",
                  caption: "Download trade receipt",
                  href: `/trades/${trade.reference}/receipt`,
                },
                {
                  icon: Headphones,
                  label: "Contact Support",
                  caption: "Need help? We're here.",
                  href: "/support",
                },
                {
                  icon: Siren,
                  label: "Report Issue",
                  caption: "Something went wrong?",
                  href: `/disputes/new?trade=${trade.reference}`,
                },
                {
                  icon: RefreshCw,
                  label: "Trade Again",
                  caption: "Start a new trade",
                  href: "/marketplace",
                },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-2.5 rounded-xl border border-hairline p-3.5 transition-colors hover:bg-surface-subtle dark:hover:bg-neutral-800/50"
                >
                  <action.icon
                    className="size-4 shrink-0 text-neutral-500 dark:text-neutral-400"
                    strokeWidth={1.9}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-semibold text-neutral-900 dark:text-white">
                      {action.label}
                    </p>
                    <p className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                      {action.caption}
                    </p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-neutral-300" />
                </Link>
              ))}
            </div>
          </Panel>
        </div>

        {/* Rail */}
        <aside className="space-y-5">
          <Panel
            title="Trade Summary"
            action={
              <Link
                href={`/trades/${trade.reference}/receipt`}
                className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-600 dark:text-brand-300"
              >
                View Receipt
                <Download className="size-3.5" strokeWidth={2.1} />
              </Link>
            }
          >
            <dl className="divide-y divide-hairline">
              <DetailRow label="Trade ID" value={trade.reference} />
              <DetailRow label="Trade Type" value={isSeller ? "Sell RMB" : "Buy RMB"} />
              <DetailRow
                label="RMB Amount"
                value={formatRmb(trade.amountRmb, { decimals: true })}
              />
              <DetailRow label="Rate (¥1)" value={formatRate(trade.rate)} />
              <DetailRow
                label="Naira Amount"
                value={formatNgn(trade.amountNgn, { decimals: true })}
              />
              <DetailRow
                label="Payment Method"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <RailIcon rail={trade.rail} className="size-4" />
                    {railLabel(trade.rail)}
                  </span>
                }
              />
            </dl>
          </Panel>

          {/* PRD §31 — the full arithmetic, no hidden charges. */}
          <Panel title="Rate & Earnings">
            <dl className="divide-y divide-hairline">
              <DetailRow
                label="Market Reference Rate"
                value={formatRate(trade.marketRate)}
              />
              <DetailRow label="Your Agreed Rate" value={formatRate(trade.rate)} />
              <DetailRow
                label="Rate Difference"
                value={
                  <span
                    className={
                      rateDifference < 0
                        ? "text-danger-600 dark:text-danger-300"
                        : "text-success-600 dark:text-success-300"
                    }
                  >
                    {rateDifference < 0 ? "-" : "+"}₦
                    {Math.abs(rateDifference).toFixed(2)}
                  </span>
                }
              />
              <DetailRow
                label="ScarExchange Fee"
                value={formatNgn(trade.fees.platformFeeNgn, { decimals: true })}
              />
              {trade.fees.settlementFeeNgn > 0 && (
                <DetailRow
                  label="Settlement Fee"
                  value={formatNgn(trade.fees.settlementFeeNgn, { decimals: true })}
                />
              )}
              <DetailRow
                label={isSeller ? "Net Earnings" : "Total Paid"}
                value={
                  <span className="text-[15px] font-bold text-success-600 dark:text-success-300">
                    {formatNgn(trade.fees.netNgn, { decimals: true })}
                  </span>
                }
              />
            </dl>
          </Panel>

          <RateCounterparty
            counterparty={counterparty}
            role={isSeller ? "Buyer" : "Seller"}
          />

          <div className="relative overflow-hidden rounded-2xl border border-hairline bg-brand-50 p-5 dark:bg-brand-900/25">
            <div className="relative flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-neutral-900 dark:text-white">
                  Refer &amp; Earn
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                  Invite friends and earn up to ₦5,000 when they complete their first
                  trade.
                </p>
                <ButtonLink href="/referrals" size="sm" className="mt-3">
                  Invite Now
                </ButtonLink>
              </div>
              <Gift
                className="size-10 shrink-0 text-brand-400 dark:text-brand-300"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
