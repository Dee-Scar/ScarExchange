import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Headphones, Info } from "lucide-react";
import { Breadcrumbs, Callout, DetailRow, Panel } from "@/components/kit/primitives";
import { ButtonLink } from "@/components/kit/button-link";
import { DisputeStatusBadge } from "@/components/kit/status-badge";
import { getDispute } from "@/lib/api";
import { formatDateTimeLong } from "@/lib/date";
import { formatNgn, formatRmb } from "@/lib/money";

const PRIORITY_TONE: Record<string, string> = {
  low: "text-neutral-500 dark:text-neutral-400",
  medium: "text-warning-600 dark:text-warning-300",
  high: "text-warning-700 dark:text-warning-200",
  critical: "text-danger-600 dark:text-danger-300",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ reference: string }>;
}): Promise<Metadata> {
  const { reference } = await params;
  return { title: reference.toUpperCase() };
}

export default async function DisputeDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const dispute = await getDispute(reference);
  if (!dispute) notFound();

  return (
    <div className="mx-auto max-w-[860px] space-y-5">
      <Breadcrumbs
        items={[{ label: "Disputes", href: "/disputes" }, { label: dispute.reference }]}
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="tabular text-[24px] font-bold text-neutral-900 dark:text-white">
              {dispute.reference}
            </h1>
            <DisputeStatusBadge status={dispute.status} size="md" />
          </div>
          <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">
            On trade{" "}
            <a
              href={`/trades/${dispute.tradeReference}`}
              className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
            >
              {dispute.tradeReference}
            </a>{" "}
            · Opened {formatDateTimeLong(dispute.openedAt)}
          </p>
        </div>
        <p className={`text-[13px] font-semibold capitalize ${PRIORITY_TONE[dispute.priority]}`}>
          {dispute.priority} priority
        </p>
      </div>

      <Panel title={dispute.reasonLabel}>
        <p className="text-[13.5px] leading-relaxed text-neutral-700 dark:text-neutral-200">
          {dispute.description}
        </p>
      </Panel>

      <Panel title="Trade in Question">
        <dl className="divide-y divide-hairline">
          <DetailRow label="Trade reference" value={dispute.tradeReference} />
          <DetailRow label="Raised against" value={dispute.againstUsername} />
          <DetailRow label="RMB amount" value={formatRmb(dispute.amountRmb)} />
          <DetailRow label="NGN amount" value={formatNgn(dispute.amountNgn)} />
        </dl>
      </Panel>

      {dispute.resolvedAt ? (
        <Callout tone="success" icon={Info} title="Resolved">
          {dispute.resolutionNote ?? "This dispute has been resolved."}
        </Callout>
      ) : (
        <Callout tone="brand" icon={Info} title="A compliance officer is reviewing this dispute">
          You don&apos;t need to do anything else right now — we&apos;ll notify you the moment
          there&apos;s an update. Reach out to support using the trade ID above and we&apos;ll
          already have the full context.
        </Callout>
      )}

      <div className="flex justify-end">
        <ButtonLink href="/support" variant="outline" className="gap-2">
          <Headphones className="size-4" strokeWidth={2.1} />
          Contact Support
        </ButtonLink>
      </div>
    </div>
  );
}
