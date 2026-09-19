import type { Metadata } from "next";
import { ArrowLeftRight, Clock } from "lucide-react";
import { ButtonLink } from "@/components/kit/button-link";
import { EmptyState, PageHeader, Panel } from "@/components/kit/primitives";
import { ActiveTradeRow } from "@/components/trade/active-trade-row";
import { getActiveTrades } from "@/lib/api";
import { formatCount } from "@/lib/money";

export const metadata: Metadata = { title: "Active Trades" };

// Reads trades opened at runtime (createdTrades) — a build-time prerender would freeze this list.
export const dynamic = "force-dynamic";

export default async function ActiveTradesPage() {
  const trades = await getActiveTrades();

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <PageHeader
        title="Active Trades"
        description="Trades still in progress — open one to pay, confirm or chat with the other party."
        actions={
          <>
            <ButtonLink href="/history" variant="outline" className="gap-2">
              <Clock className="size-4" strokeWidth={2.1} />
              Trade history
            </ButtonLink>
            <ButtonLink href="/buy" className="gap-2">
              <ArrowLeftRight className="size-4" strokeWidth={2.1} />
              Start a trade
            </ButtonLink>
          </>
        }
      />

      <Panel
        title={`In progress (${formatCount(trades.length)})`}
        padded={false}
        headerClassName="pb-2"
      >
        {trades.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No active trades"
            description="Trades you open will show up here while they're in progress."
            action={
              <ButtonLink href="/buy" size="sm">
                Start a trade
              </ButtonLink>
            }
          />
        ) : (
          <ul className="divide-y divide-hairline">
            {trades.map((trade) => (
              <ActiveTradeRow key={trade.id} trade={trade} />
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
