import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeftRight,
  Bell,
  CheckCircle2,
  ClipboardList,
  Clock,
  Coins,
  Info,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { ButtonLink } from "@/components/kit/button-link";
import { EmptyState, Panel, PanelLink } from "@/components/kit/primitives";
import { StatCard } from "@/components/kit/stat-card";
import { ActiveTradeRow } from "@/components/trade/active-trade-row";
import { getActiveTrades, getCurrentUser, getNotifications } from "@/lib/api";
import { formatRelative, formatTime } from "@/lib/date";
import { formatCount, formatNgn, formatRate } from "@/lib/money";
import { marketRateUpdatedAt, marketReferenceRate, marketRateLow, marketRateHigh, marketRateChangePercent } from "@/lib/mock/offers";
import type { NotificationCategory } from "@/lib/types";

export const metadata: Metadata = { title: "Dashboard" };

const NOTIFICATION_ICON: Record<NotificationCategory, typeof Bell> = {
  trade: ArrowLeftRight,
  payment: Coins,
  security: Info,
  kyc: CheckCircle2,
  dispute: Info,
  system: Bell,
};

export default async function DashboardPage() {
  const [user, activeTrades, notifications] = await Promise.all([
    getCurrentUser(),
    getActiveTrades(),
    getNotifications(),
  ]);

  const pendingActions = notifications.filter((n) => !n.read);
  const firstName = user.displayName.split(" ")[0];

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <div>
        <h1 className="flex items-center gap-2 text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
          Dashboard <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
          Welcome back, {firstName}! Here&apos;s what&apos;s happening with your trades.
        </p>
      </div>

      {/* Quick Actions (PRD §22) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickAction href="/buy" icon={ShoppingBag} label="Buy RMB" tone="brand" />
        <QuickAction href="/sell" icon={Coins} label="Sell RMB" tone="success" />
        <QuickAction href="/orders" icon={ClipboardList} label="My Offers" tone="purple" />
        <QuickAction href="/history" icon={Clock} label="Transactions" tone="warning" />
      </div>

      {/* Overview (PRD §22) */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Trades"
          value={formatCount(activeTrades.length)}
          icon={ArrowLeftRight}
          tone="brand"
        />
        <StatCard
          label="Completed Trades"
          value={formatCount(user.stats.completedTrades)}
          icon={CheckCircle2}
          tone="success"
        />
        <StatCard
          label="Total Volume"
          value={formatNgn(user.stats.totalVolumeNgn, { compact: true })}
          icon={TrendingUp}
          tone="ngn"
        />
        <StatCard label="Best Rate" value={formatRate(marketReferenceRate)} icon={Coins} tone="rmb" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <Panel title="Active Trades" action={<PanelLink href="/trades/active" />}>
            {activeTrades.length === 0 ? (
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
                {activeTrades.map((trade) => (
                  <ActiveTradeRow key={trade.id} trade={trade} />
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <aside className="min-w-0 space-y-5">
          <Panel title="Current Rate">
            <p className="flex items-center gap-1 text-[11.5px] text-neutral-500 dark:text-neutral-400">
              Reference Rate
              <Info className="size-3 text-neutral-400" strokeWidth={2} />
            </p>
            <p className="tabular mt-1 text-2xl font-bold text-success-600 dark:text-success-300">
              {formatRate(marketReferenceRate)}
            </p>
            <p className="tabular mt-1 text-[12px] text-neutral-500 dark:text-neutral-400">
              Range {formatRate(marketRateLow)} – {formatRate(marketRateHigh)} ·{" "}
              <span className="font-medium text-success-600 dark:text-success-300">
                ↑ {marketRateChangePercent}%
              </span>
            </p>
            <p className="mt-2 text-[11px] text-neutral-400">
              Last updated: {formatTime(marketRateUpdatedAt)}
            </p>
          </Panel>

          <Panel title="Pending Actions" action={<PanelLink href="/notifications" />}>
            {pendingActions.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="You're all caught up"
                description="Nothing needs your attention right now."
              />
            ) : (
              <ul className="space-y-3">
                {pendingActions.slice(0, 4).map((item) => {
                  const Icon = NOTIFICATION_ICON[item.category];
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href ?? "/notifications"}
                        className="flex items-start gap-2.5 rounded-lg transition-colors hover:bg-surface-subtle dark:hover:bg-neutral-800/50"
                      >
                        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
                          <Icon className="size-3.5" strokeWidth={2.2} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12.5px] font-semibold text-neutral-900 dark:text-white">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-[11.5px] text-neutral-400">
                            {formatRelative(item.createdAt)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
  tone,
}: {
  href: string;
  icon: typeof ShoppingBag;
  label: string;
  tone: "brand" | "success" | "warning" | "purple";
}) {
  const styles = {
    brand: "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300",
    success: "bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-300",
    warning: "bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-300",
    purple: "bg-[#f4f3ff] text-[#7a5af8] dark:bg-[#5925dc]/20",
  }[tone];

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-hairline bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${styles}`}>
        <Icon className="size-[18px]" strokeWidth={2} />
      </span>
      <span className="text-[13.5px] font-semibold text-neutral-900 dark:text-white">
        {label}
      </span>
    </Link>
  );
}
