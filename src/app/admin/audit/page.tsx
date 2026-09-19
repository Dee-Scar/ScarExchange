import type { Metadata } from "next";
import { ScrollText } from "lucide-react";
import { EmptyState } from "@/components/kit/primitives";
import { getAuditLog } from "@/lib/api";
import { formatTimestamp } from "@/lib/date";

export const metadata: Metadata = { title: "Audit Logs" };

const TARGET_TYPE_LABEL: Record<string, string> = {
  trade: "Trade",
  user: "User",
  setting: "Setting",
  offer: "Offer",
  dispute: "Dispute",
  settlement: "Settlement",
};

export default async function AdminAuditLogPage() {
  const entries = await getAuditLog();

  return (
    <div className="mx-auto max-w-[1300px] space-y-5">
      <div>
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
          Audit Logs
        </h1>
        <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
          Every sensitive admin action, recorded (PRD §36). Tamper-resistant once written.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-hairline bg-card shadow-card">
        {entries.length === 0 ? (
          <EmptyState icon={ScrollText} title="No audit entries yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-hairline bg-surface-subtle dark:bg-neutral-900/50">
                  {["Admin", "Action", "Target", "Reason", "IP Address", "Timestamp"].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-5 py-3 text-[12px] font-semibold text-neutral-500 dark:text-neutral-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-hairline last:border-0 hover:bg-surface-subtle dark:hover:bg-neutral-900/40"
                  >
                    <td className="px-5 py-3.5 text-[13px] font-semibold text-neutral-900 dark:text-white">
                      {entry.adminLabel}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-neutral-700 dark:text-neutral-200">
                      {entry.action}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="tabular text-[13px] text-neutral-900 dark:text-white">
                        {entry.target}
                      </span>
                      <span className="ml-1.5 text-[11px] text-neutral-400">
                        {TARGET_TYPE_LABEL[entry.targetType] ?? entry.targetType}
                      </span>
                    </td>
                    <td className="max-w-[280px] px-5 py-3.5 text-[12.5px] text-neutral-500 dark:text-neutral-400">
                      {entry.reason}
                    </td>
                    <td className="tabular px-5 py-3.5 text-[12px] text-neutral-400">
                      {entry.ipAddress}
                    </td>
                    <td className="tabular px-5 py-3.5 text-[12px] text-neutral-400">
                      {formatTimestamp(entry.createdAt)}
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
