import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { EmptyState } from "@/components/kit/primitives";
import { DisputeStatusBadge } from "@/components/kit/status-badge";
import { getMyDisputes } from "@/lib/api";
import { formatDate } from "@/lib/date";
import { formatNgn, formatRmb } from "@/lib/money";

export const metadata: Metadata = { title: "Disputes" };

export default async function DisputesPage() {
  const disputes = await getMyDisputes();

  return (
    <div className="mx-auto max-w-[1000px] space-y-5">
      <div>
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
          Dispute Centre
        </h1>
        <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
          Trades you&apos;ve raised a dispute on, and where each one stands.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-hairline bg-card shadow-card">
        {disputes.length === 0 ? (
          <EmptyState
            icon={AlertTriangle}
            title="No disputes"
            description="You haven't raised a dispute on any trade. Most issues are resolved right inside the trade chat before it gets to this."
          />
        ) : (
          <ul className="divide-y divide-hairline">
            {disputes.map((dispute) => (
              <li key={dispute.id}>
                <Link
                  href={`/disputes/${dispute.reference}`}
                  className="flex flex-wrap items-center gap-3 px-5 py-4 transition-colors hover:bg-surface-subtle dark:hover:bg-neutral-800/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="tabular text-[13.5px] font-semibold text-neutral-900 dark:text-white">
                        {dispute.reference}
                      </span>
                      <span className="text-[11.5px] text-neutral-400">
                        · Trade {dispute.tradeReference}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[12.5px] text-neutral-500 dark:text-neutral-400">
                      {dispute.reasonLabel} — against {dispute.againstUsername}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="tabular text-[13px] font-semibold text-neutral-900 dark:text-white">
                      {formatRmb(dispute.amountRmb)}
                    </p>
                    <p className="tabular text-[11.5px] text-neutral-500 dark:text-neutral-400">
                      {formatNgn(dispute.amountNgn)}
                    </p>
                  </div>

                  <DisputeStatusBadge status={dispute.status} />

                  <span className="hidden text-[11.5px] text-neutral-400 sm:block">
                    Opened {formatDate(dispute.openedAt)}
                  </span>

                  <ChevronRight className="size-4 shrink-0 text-neutral-300" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
