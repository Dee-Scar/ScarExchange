import Link from "next/link";
import {
  AlertTriangle,
  ChevronDown,
  FileText,
  Headphones,
  Info,
  ShieldCheck,
} from "lucide-react";
import { ButtonLink } from "@/components/kit/button-link";
import { CopyButton } from "@/components/kit/copy-button";
import { RailIcon, railLabel } from "@/components/kit/payment-rail";
import { Breadcrumbs, Callout, DetailRow, Panel } from "@/components/kit/primitives";
import { StatusPill } from "@/components/kit/status-badge";
import { Stepper } from "@/components/kit/stepper";
import { TraderAvatar, VerifiedTick } from "@/components/kit/trader";
import { Countdown } from "@/components/trade/countdown";
import { TradeChat } from "@/components/trade/trade-chat";
import { Button } from "@/components/ui/button";
import { formatDateTimeLong } from "@/lib/date";
import { secondsUntil } from "@/lib/date";
import { formatNgn, formatRate, formatRmb } from "@/lib/money";
import { resolveTradeStages } from "@/lib/trade-progress";
import type { Trade } from "@/lib/types";

/**
 * The live trade room (PRD §14, §17, §49).
 *
 * Two rules shape this screen: the payment account shown here is the only one
 * a user should ever pay, and marking "paid" is a claim, not a settlement —
 * both are stated on the page rather than assumed.
 */
export function TradeRoom({
  trade,
  currentUserId,
}: {
  trade: Trade;
  currentUserId: string;
}) {
  const isSeller = trade.seller.id === currentUserId;
  const counterparty = isSeller ? trade.buyer : trade.seller;
  const stages = resolveTradeStages(trade);
  const deadlineSeconds = trade.paymentDeadline ? secondsUntil(trade.paymentDeadline) : null;

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <Breadcrumbs
        items={[
          { label: "Active Trades", href: "/trades/active" },
          { label: "Trade Details" },
        ]}
      />

      {/* Trade header */}
      <section className="rounded-2xl border border-hairline bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[12px] text-neutral-500 dark:text-neutral-400">Trade ID</p>
            <div className="mt-0.5 flex items-center gap-2">
              <h1 className="tabular text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
                {trade.reference}
              </h1>
              <CopyButton value={trade.reference} label="Trade ID" className="size-7" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl bg-success-50 px-3.5 py-2 dark:bg-success-900/25">
              <p className="flex items-center gap-1.5 text-[13px] font-semibold text-success-700 dark:text-success-200">
                <ShieldCheck className="size-4" strokeWidth={2.2} />
                RMB Secured
              </p>
              <p className="mt-0.5 text-[11.5px] text-success-700/80 dark:text-success-200/80">
                Awaiting payment from {isSeller ? "buyer" : "seller"}
              </p>
            </div>
            <ButtonLink href="/support" variant="outline" size="sm" className="gap-1.5">
              <Headphones className="size-3.5" strokeWidth={2.1} />
              Need Help?
            </ButtonLink>
          </div>
        </div>

        <div className="mt-5 grid gap-5 border-t border-hairline pt-5 sm:grid-cols-3">
          <div>
            <p className="text-[12px] text-neutral-500 dark:text-neutral-400">
              You are {isSeller ? "selling" : "buying"}
            </p>
            <p className="tabular mt-1 text-[22px] font-bold text-neutral-900 dark:text-white">
              {formatRmb(trade.amountRmb, { decimals: true })}
            </p>
            <p className="text-[11.5px] text-neutral-500 dark:text-neutral-400">Chinese RMB</p>
          </div>
          <div>
            <p className="text-[12px] text-neutral-500 dark:text-neutral-400">Agreed Rate</p>
            <p className="tabular mt-1 text-[22px] font-bold text-success-600 dark:text-success-300">
              ¥1 = {formatRate(trade.rate)}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-neutral-500 dark:text-neutral-400">
              You will {isSeller ? "receive" : "pay"}
            </p>
            <p className="tabular mt-1 text-[22px] font-bold text-neutral-900 dark:text-white">
              {formatNgn(trade.amountNgn, { decimals: true })}
            </p>
            <p className="text-[11.5px] text-neutral-500 dark:text-neutral-400">Nigerian Naira</p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 border-t border-hairline pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-[12px] text-neutral-500 dark:text-neutral-400">
              {isSeller ? "Buyer" : "Seller"}
            </p>
            <span className="mt-1.5 flex items-center gap-1.5">
              <TraderAvatar trader={counterparty} size="xs" />
              <span className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                {counterparty.username}
              </span>
              {counterparty.verified && <VerifiedTick className="size-3.5" />}
            </span>
          </div>
          <div>
            <p className="text-[12px] text-neutral-500 dark:text-neutral-400">Payment Method</p>
            <span className="mt-1.5 flex items-center gap-1.5">
              <RailIcon rail={trade.rail} />
              <span className="text-[13px] font-medium text-neutral-900 dark:text-white">
                {railLabel(trade.rail)}
              </span>
            </span>
          </div>
          <div>
            <p className="text-[12px] text-neutral-500 dark:text-neutral-400">Created Time</p>
            <p className="tabular mt-1.5 text-[13px] font-medium text-neutral-900 dark:text-white">
              {formatDateTimeLong(trade.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-neutral-500 dark:text-neutral-400">
              Payment Time Limit
            </p>
            {deadlineSeconds != null ? (
              <Countdown seconds={deadlineSeconds} className="mt-1.5 text-[15px]" />
            ) : (
              <p className="mt-1.5 text-[13px] text-neutral-400">—</p>
            )}
          </div>
        </div>
      </section>

      {/* Payment instructions + chat */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_320px]">
        <section className="rounded-2xl border border-hairline bg-card p-5 shadow-card">
          <h2 className="text-[15px] font-semibold text-neutral-900 dark:text-white">
            1. {isSeller ? "Buyer Pays (RMB)" : "You Pay (RMB)"}
          </h2>
          <p className="mt-1 text-[12.5px] text-neutral-500 dark:text-neutral-400">
            {isSeller
              ? `Please provide your ${railLabel(trade.rail)} account below for the buyer to make payment.`
              : `Send the exact amount to the ${railLabel(trade.rail)} account below.`}
          </p>

          <Callout tone="brand" icon={Info} className="mt-3">
            You will receive the exact amount above. Make sure your{" "}
            {railLabel(trade.rail)} account is correct.
          </Callout>

          <div className="mt-3 rounded-xl border border-hairline p-3.5">
            <div className="flex items-start gap-3">
              <RailIcon rail={trade.rail} className="size-8 rounded-lg" />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                  {railLabel(trade.rail)} Account
                </p>
                <span className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-[13px] text-neutral-700 dark:text-neutral-200">
                    {trade.payeeLabel}
                  </span>
                  <StatusPill tone="success">Verified</StatusPill>
                </span>
                <span className="mt-1 flex items-center gap-1">
                  <span className="tabular text-[12.5px] text-neutral-600 dark:text-neutral-300">
                    Account: {trade.payeeAccount}
                  </span>
                  {trade.payeeAccount && (
                    <CopyButton value={trade.payeeAccount} label="Account number" />
                  )}
                </span>
              </div>
              <QrPlaceholder />
            </div>
          </div>

          <p className="mt-3 text-[12px] text-neutral-500 dark:text-neutral-400">
            Ask the {isSeller ? "buyer" : "seller"} to send payment to the above{" "}
            {railLabel(trade.rail)} account.
          </p>

          <Disclosure title="Trade Instructions">
            <ol className="list-decimal space-y-1.5 pl-4 text-[12.5px] text-neutral-600 dark:text-neutral-300">
              <li>Confirm the account name matches the one shown above.</li>
              <li>Send the exact RMB amount — partial payments are rejected.</li>
              <li>Upload your payment receipt as evidence.</li>
              <li>Wait for confirmation before closing this screen.</li>
            </ol>
          </Disclosure>

          <Disclosure title={`Terms from ${isSeller ? "Buyer" : "Seller"}`}>
            <p className="text-[12.5px] leading-relaxed text-neutral-600 dark:text-neutral-300">
              Please pay within the time limit shown. Send the exact amount and include no
              reference note. Payments from third-party accounts will be returned.
            </p>
          </Disclosure>
        </section>

        <TradeChat trade={trade} currentUserId={currentUserId} />

        {/* Summary rail */}
        <aside className="space-y-5">
          <Panel
            title="Trade Summary"
            action={
              <Link
                href={`/trades/${trade.reference}/receipt`}
                className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-600 dark:text-brand-300"
              >
                View Receipt
                <FileText className="size-3.5" strokeWidth={2.1} />
              </Link>
            }
          >
            <dl className="divide-y divide-hairline">
              <DetailRow label="Trade ID" value={trade.reference} />
              <DetailRow label="Rate (¥1)" value={formatRate(trade.rate)} />
              <DetailRow label="RMB Amount" value={formatRmb(trade.amountRmb, { decimals: true })} />
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
              <DetailRow
                label="Payment Time Limit"
                value={
                  deadlineSeconds != null ? (
                    <Countdown seconds={deadlineSeconds} showIcon={false} />
                  ) : (
                    "—"
                  )
                }
              />
            </dl>
          </Panel>

          <div className="rounded-2xl bg-warning-50 p-4 dark:bg-warning-700/15">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-warning-800 dark:text-warning-200">
              <AlertTriangle className="size-4" strokeWidth={2.2} />
              Important
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[12px] leading-relaxed text-warning-800/90 dark:text-warning-200/90">
              <li>Only accept payment from the buyer name shown.</li>
              <li>Do not release Naira until you have received the exact RMB amount.</li>
              <li>Contact support if you need any help.</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-success-50 p-4 dark:bg-success-900/20">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-success-800 dark:text-success-200">
              <ShieldCheck className="size-4" strokeWidth={2.2} />
              Safety Tips
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[12px] leading-relaxed text-success-800/90 dark:text-success-200/90">
              <li>Never trade outside ScarExchange.</li>
              <li>Do not share your personal bank details.</li>
              <li>Report suspicious activity immediately.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              Cancel Trade
            </Button>
            <ButtonLink
              href={`/disputes/new?trade=${trade.reference}`}
              variant="destructive"
              className="w-full"
            >
              Raise Dispute
            </ButtonLink>
          </div>
        </aside>
      </div>

      <Panel title="Trade Progress">
        <div className="overflow-x-auto pb-1 pt-2">
          <Stepper steps={stages} size="sm" className="min-w-[760px]" />
        </div>
      </Panel>
    </div>
  );
}

function Disclosure({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group mt-2.5 border-t border-hairline pt-2.5">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] font-medium text-neutral-800 dark:text-neutral-100">
        {title}
        <ChevronDown
          className="size-4 text-neutral-400 transition-transform group-open:rotate-180"
          strokeWidth={2}
        />
      </summary>
      <div className="mt-2.5">{children}</div>
    </details>
  );
}

/**
 * Stand-in for the provider-issued payment QR. The real code comes from the
 * payment service per trade and is never generated client-side.
 */
function QrPlaceholder() {
  return (
    <span
      className="hidden size-16 shrink-0 rounded-lg border border-hairline bg-white p-1.5 sm:block"
      aria-label="Payment QR code"
    >
      <svg viewBox="0 0 40 40" className="size-full" aria-hidden="true">
        <rect width="40" height="40" fill="#fff" />
        {[
          [2, 2],
          [26, 2],
          [2, 26],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="12" height="12" fill="none" stroke="#101828" strokeWidth="2.5" />
            <rect x={x + 4} y={y + 4} width="4" height="4" fill="#101828" />
          </g>
        ))}
        {[
          [18, 4], [22, 8], [18, 12], [26, 18], [30, 22], [20, 20],
          [24, 26], [18, 30], [28, 32], [34, 28], [22, 34], [32, 14],
        ].map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" fill="#101828" />
        ))}
      </svg>
    </span>
  );
}
