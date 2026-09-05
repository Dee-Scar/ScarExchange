import type { Metadata } from "next";
import { ArrowLeftRight, Coins, Star, Wallet } from "lucide-react";
import { HistoryBrowser } from "@/components/history/history-browser";
import { PageHeader } from "@/components/kit/primitives";
import { StatCard } from "@/components/kit/stat-card";
import { getTrades } from "@/lib/api";
import { historyBanks, historySummary } from "@/lib/mock/trades";
import { formatCount, formatNgn, formatPercent, formatRmb } from "@/lib/money";

export const metadata: Metadata = { title: "Transaction History" };

export default async function HistoryPage() {
  const trades = await getTrades();
  const banks = Object.fromEntries(historyBanks);

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <PageHeader
        title="Transaction History"
        description="View and manage all your RMB ↔ NGN transactions."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Trades"
          value={formatCount(historySummary.totalTrades)}
          icon={ArrowLeftRight}
          tone="success"
          deltaPercent={historySummary.totalTradesDeltaPercent}
        />
        <StatCard
          label="Total Spent (RMB)"
          value={formatRmb(historySummary.totalSpentRmb)}
          icon={Coins}
          tone="rmb"
          deltaPercent={historySummary.totalSpentDeltaPercent}
        />
        <StatCard
          label="Total Received (NGN)"
          value={formatNgn(historySummary.totalReceivedNgn)}
          icon={Wallet}
          tone="purple"
          deltaPercent={historySummary.totalReceivedDeltaPercent}
        />
        <StatCard
          label="Completion Rate"
          value={formatPercent(historySummary.completionRate, 0)}
          icon={Star}
          tone="warning"
          deltaCaption={`${historySummary.completedCount} of ${historySummary.totalTrades} completed`}
        />
      </div>

      <HistoryBrowser trades={trades} banks={banks} />
    </div>
  );
}
