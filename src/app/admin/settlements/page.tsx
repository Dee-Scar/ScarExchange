import type { Metadata } from "next";
import Link from "next/link";
import { CircleDollarSign } from "lucide-react";
import { EmptyState } from "@/components/kit/primitives";
import { StatCard } from "@/components/kit/stat-card";
import { SettlementStatusBadge } from "@/components/kit/status-badge";
import { getSettlements } from "@/lib/api";
import { formatDateTime } from "@/lib/date";
import { formatCount, formatMoney } from "@/lib/money";
import type { SettlementStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Settlements" };

function countByStatus(settlements: { status: SettlementStatus }[], status: SettlementStatus) {
  return settlements.filter((s) => s.status === status).length;
}

export default async function AdminSettlementsPage() {
  const settlements = await getSettlements();

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
          Settlements
        </h1>
        <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
          NGN settlement requests to their providers, one per completed trade (PRD §37, §43).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Completed"
          value={formatCount(countByStatus(settlements, "completed"))}
          icon={CircleDollarSign}
          tone="success"
        />
        <StatCard
          label="Processing"
          value={formatCount(countByStatus(settlements, "processing"))}
          icon={CircleDollarSign}
          tone="brand"
        />
        <StatCard
          label="Queued"
          value={formatCount(countByStatus(settlements, "queued"))}
          icon={CircleDollarSign}
          tone="purple"
        />
        <StatCard
          label="Failed"
          value={formatCount(countByStatus(settlements, "failed"))}
          icon={CircleDollarSign}
          tone="danger"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-hairline bg-card shadow-card">
        {settlements.length === 0 ? (
          <EmptyState icon={CircleDollarSign} title="No settlements yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-hairline bg-surface-subtle dark:bg-neutral-900/50">
                  {["Reference", "Trade", "Provider", "Amount", "Status", "Created", "Settled"].map(
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
                {settlements.map((settlement) => (
                  <tr
                    key={settlement.id}
                    className="border-b border-hairline last:border-0 hover:bg-surface-subtle dark:hover:bg-neutral-900/40"
                  >
                    <td className="tabular px-5 py-3.5 text-[13px] font-semibold text-neutral-900 dark:text-white">
                      {settlement.reference}
                    </td>
                    <td className="px-5 py-3.5 text-[13px]">
                      <Link
                        href={`/trades/${settlement.tradeReference}`}
                        className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
                      >
                        {settlement.tradeReference}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-neutral-700 dark:text-neutral-200">
                      {settlement.provider}
                    </td>
                    <td className="tabular px-5 py-3.5 text-[13px] font-semibold text-neutral-900 dark:text-white">
                      {formatMoney(settlement.amount, settlement.currency)}
                    </td>
                    <td className="px-5 py-3.5">
                      <SettlementStatusBadge status={settlement.status} />
                      {settlement.failureReason && (
                        <p className="mt-1 max-w-[220px] text-[11.5px] text-danger-600 dark:text-danger-300">
                          {settlement.failureReason}
                        </p>
                      )}
                    </td>
                    <td className="tabular px-5 py-3.5 text-[12px] text-neutral-400">
                      {formatDateTime(settlement.createdAt)}
                    </td>
                    <td className="tabular px-5 py-3.5 text-[12px] text-neutral-400">
                      {settlement.settledAt ? formatDateTime(settlement.settledAt) : "—"}
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
