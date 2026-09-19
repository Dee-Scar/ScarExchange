import type { Metadata } from "next";
import { Percent, ScrollText } from "lucide-react";
import { Callout, Panel } from "@/components/kit/primitives";
import { getAuditLog } from "@/lib/api";
import { formatDateTime } from "@/lib/date";
import { convertRmbToNgn, formatNgn, formatRate, formatRmb, toMinor } from "@/lib/money";
import { marketReferenceRate } from "@/lib/mock/offers";
import { computeFees, PLATFORM_FEE_BPS, SETTLEMENT_FEE_NGN } from "@/lib/mock/trades";

export const metadata: Metadata = { title: "Fees & Charges" };

// A round worked example, priced at the current reference rate — not a real trade.
const EXAMPLE_RMB = toMinor(10_000);
const exampleGross = convertRmbToNgn(EXAMPLE_RMB, marketReferenceRate);
const exampleFees = computeFees(exampleGross);

export default async function AdminFeesPage() {
  const auditLog = await getAuditLog();
  const feeHistory = auditLog.filter((entry) => entry.targetType === "setting" && entry.target.startsWith("fees."));

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <div>
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
          Fees &amp; Charges
        </h1>
        <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
          Configurable per PRD §30 — never hard-coded into the trade engine itself.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Current Rates">
          <dl className="divide-y divide-hairline">
            <div className="flex items-center justify-between py-3">
              <dt className="text-[13px] text-neutral-500 dark:text-neutral-400">Platform fee</dt>
              <dd className="tabular text-[15px] font-bold text-neutral-900 dark:text-white">
                {(PLATFORM_FEE_BPS / 100).toFixed(2)}%
                <span className="ml-1.5 text-[11.5px] font-normal text-neutral-400">
                  ({PLATFORM_FEE_BPS} bps)
                </span>
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[13px] text-neutral-500 dark:text-neutral-400">Settlement fee</dt>
              <dd className="tabular text-[15px] font-bold text-neutral-900 dark:text-white">
                {formatNgn(SETTLEMENT_FEE_NGN)}
              </dd>
            </div>
          </dl>
          <Callout tone="brand" icon={Percent} className="mt-4">
            The platform fee applies to every completed trade&apos;s gross NGN value. It&apos;s
            itemised on the trade before either side confirms — never a hidden deduction.
          </Callout>
        </Panel>

        <Panel title="Worked Example">
          <p className="text-[12.5px] text-neutral-500 dark:text-neutral-400">
            ¥10,000 at the current reference rate ({formatRate(marketReferenceRate)}):
          </p>
          <dl className="mt-3 divide-y divide-hairline">
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-[13px] text-neutral-500 dark:text-neutral-400">RMB amount</dt>
              <dd className="tabular text-[13px] font-semibold text-neutral-900 dark:text-white">
                {formatRmb(EXAMPLE_RMB)}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-[13px] text-neutral-500 dark:text-neutral-400">Gross value</dt>
              <dd className="tabular text-[13px] font-semibold text-neutral-900 dark:text-white">
                {formatNgn(exampleFees.grossNgn)}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-[13px] text-neutral-500 dark:text-neutral-400">Platform fee</dt>
              <dd className="tabular text-[13px] font-semibold text-danger-600 dark:text-danger-300">
                −{formatNgn(exampleFees.platformFeeNgn)}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-[13px] text-neutral-500 dark:text-neutral-400">Settlement fee</dt>
              <dd className="tabular text-[13px] font-semibold text-danger-600 dark:text-danger-300">
                −{formatNgn(exampleFees.settlementFeeNgn)}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-[13px] font-bold text-neutral-900 dark:text-white">
                Seller receives
              </dt>
              <dd className="tabular text-[15px] font-bold text-success-600 dark:text-success-300">
                {formatNgn(exampleFees.netNgn)}
              </dd>
            </div>
          </dl>
        </Panel>
      </div>

      <Panel title="Rate Changes" action={<ScrollText className="size-4 text-neutral-400" />}>
        {feeHistory.length === 0 ? (
          <p className="py-2 text-[13px] text-neutral-500 dark:text-neutral-400">
            No fee changes have been logged yet.
          </p>
        ) : (
          <ul className="divide-y divide-hairline">
            {feeHistory.map((entry) => (
              <li key={entry.id} className="py-3">
                <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                  {entry.action}
                </p>
                <p className="mt-0.5 text-[12.5px] text-neutral-500 dark:text-neutral-400">
                  {entry.reason}
                </p>
                <p className="tabular mt-0.5 text-[11px] text-neutral-400">
                  {entry.adminLabel} · {formatDateTime(entry.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
