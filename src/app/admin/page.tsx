import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeftRight,
  Bell,
  Calendar,
  CheckCircle2,
  Download,
  FileCheck2,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Tag,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { DonutChart, DonutLegend } from "@/components/charts/donut-chart";
import { VolumeAreaChart } from "@/components/charts/volume-area-chart";
import { StatCard, MiniStat } from "@/components/kit/stat-card";
import { Panel, PanelLink } from "@/components/kit/primitives";
import { VerifiedTick } from "@/components/kit/trader";
import { Button } from "@/components/ui/button";
import { AdminRecentTrades } from "@/components/admin/recent-trades";
import {
  adminKpis,
  adminRecentTrades,
  completionRate,
  dashboardRange,
  kpiSparks,
  kycQueueCounts,
  platformHealth,
  riskEvents,
  systemAnnouncements,
  topMerchants,
  tradeStatusBreakdown,
  volumeTrend,
} from "@/lib/mock/admin";
import { formatDateRange, formatRelative } from "@/lib/date";
import { formatCount, formatNgn, formatRmb } from "@/lib/money";

export const metadata: Metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
            Dashboard <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
            Welcome back! Here&apos;s what&apos;s happening on ScarExchange.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-hairline bg-card px-3.5 text-[13px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            <Calendar className="size-4 text-neutral-400" strokeWidth={1.9} />
            {formatDateRange(dashboardRange.start, dashboardRange.end)}
          </button>
          <Button className="h-10 gap-2 px-4">
            <Download className="size-4" strokeWidth={2.1} />
            Export Report
          </Button>
        </div>
      </header>

      {/* KPI row (PRD §54) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="Total Users"
          value={formatCount(adminKpis.totalUsers)}
          icon={Users}
          tone="brand"
          deltaPercent={adminKpis.totalUsersDelta}
          spark={kpiSparks.totalUsers}
        />
        <StatCard
          label="Active Traders"
          value={formatCount(adminKpis.activeTraders)}
          icon={UserPlus}
          tone="purple"
          deltaPercent={adminKpis.activeTradersDelta}
          spark={kpiSparks.activeTraders}
        />
        <StatCard
          label="Total Trades"
          value={formatCount(adminKpis.totalTrades)}
          icon={ArrowLeftRight}
          tone="success"
          deltaPercent={adminKpis.totalTradesDelta}
          spark={kpiSparks.totalTrades}
        />
        <StatCard
          label="RMB Volume"
          value={formatRmb(adminKpis.rmbVolume)}
          icon={TrendingUp}
          tone="rmb"
          deltaPercent={adminKpis.rmbVolumeDelta}
          spark={kpiSparks.rmbVolume}
        />
        <StatCard
          label="NGN Volume"
          value={formatNgn(adminKpis.ngnVolume)}
          icon={TrendingUp}
          tone="ngn"
          deltaPercent={adminKpis.ngnVolumeDelta}
          spark={kpiSparks.ngnVolume}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column */}
        <div className="min-w-0 space-y-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <Panel
              title="Trading Volume Overview"
              action={
                <span className="rounded-lg border border-hairline px-2.5 py-1 text-[12px] font-medium text-neutral-600 dark:text-neutral-300">
                  Last 30 Days
                </span>
              }
            >
              <VolumeAreaChart data={volumeTrend} />
            </Panel>

            <Panel title="Trade Status Distribution">
              <DonutChart
                segments={tradeStatusBreakdown}
                total={adminKpis.totalTrades}
                totalLabel="Total Trades"
                className="py-2"
              />
              <DonutLegend segments={tradeStatusBreakdown} className="mt-5" />
              <div className="mt-4 border-t border-hairline pt-3">
                <p className="text-[12.5px] text-neutral-500 dark:text-neutral-400">
                  Completion Rate
                </p>
                <p className="mt-0.5 flex items-baseline gap-2">
                  <span className="tabular text-xl font-bold text-success-600 dark:text-success-300">
                    {completionRate.value}%
                  </span>
                  <span className="text-[12px] font-medium text-success-600 dark:text-success-300">
                    ↑ {completionRate.delta}%
                  </span>
                </p>
              </div>
            </Panel>
          </div>

          <AdminRecentTrades trades={adminRecentTrades} />

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel
              title="KYC Verification Queue"
              action={<PanelLink href="/admin/kyc" />}
            >
              <div className="grid grid-cols-3 gap-3">
                <QueueTile
                  label="New Applications"
                  value={kycQueueCounts.newApplications}
                  tone="brand"
                />
                <QueueTile
                  label="Under Review"
                  value={kycQueueCounts.underReview}
                  tone="warning"
                />
                <QueueTile
                  label="Needs Attention"
                  value={kycQueueCounts.needsAttention}
                  tone="danger"
                />
              </div>
            </Panel>

            <Panel
              title="System Announcements"
              action={<PanelLink href="/admin/notifications" />}
            >
              <ul className="space-y-3">
                {systemAnnouncements.map((item) => (
                  <li key={item.id} className="flex items-start gap-2.5">
                    {item.tone === "success" ? (
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-success-500"
                        strokeWidth={2.2}
                      />
                    ) : (
                      <AlertTriangle
                        className="mt-0.5 size-4 shrink-0 text-warning-500"
                        strokeWidth={2.2}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-neutral-500 dark:text-neutral-400">
                        {item.body}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11.5px] text-neutral-400">
                      {formatRelative(item.at)}
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>

        {/* Right rail */}
        <aside className="min-w-0 space-y-5">
          <Panel title="Quick Actions">
            <div className="grid grid-cols-3 gap-2">
              <QuickAction icon={UserPlus} label="Add User" href="/admin/users/new" tone="brand" />
              <QuickAction icon={ShieldCheck} label="Verify KYC" href="/admin/kyc" tone="success" />
              <QuickAction icon={Tag} label="Create Offer" href="/admin/offers" tone="purple" />
              <QuickAction
                icon={AlertTriangle}
                label="Review Dispute"
                href="/admin/disputes"
                tone="warning"
              />
              <QuickAction
                icon={SlidersHorizontal}
                label="Adjust Limits"
                href="/admin/limits"
                tone="brand"
              />
              <QuickAction icon={Bell} label="Send Notice" href="/admin/notifications" tone="danger" />
            </div>
          </Panel>

          <Panel title="Recent Risk Alerts" action={<PanelLink href="/admin/risk" />}>
            <ul className="space-y-3">
              {riskEvents.slice(0, 3).map((alert) => (
                <li key={alert.id} className="flex items-start gap-2.5">
                  <span
                    className={
                      alert.level === "critical"
                        ? "mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-danger-50 text-danger-600 dark:bg-danger-700/20 dark:text-danger-300"
                        : "mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-300"
                    }
                  >
                    {alert.level === "critical" ? (
                      <ShieldCheck className="size-3.5" strokeWidth={2.2} />
                    ) : (
                      <AlertTriangle className="size-3.5" strokeWidth={2.2} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-semibold text-neutral-900 dark:text-white">
                      {alert.title}
                    </p>
                    <p className="mt-0.5 truncate text-[11.5px] text-neutral-500 dark:text-neutral-400">
                      User: @{alert.username}
                      {alert.amountLabel ? ` · ${alert.amountLabel}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="text-[11px] text-neutral-400">
                      {formatRelative(alert.createdAt)}
                    </span>
                    <span
                      className={
                        alert.level === "critical"
                          ? "size-1.5 rounded-full bg-danger-500"
                          : "size-1.5 rounded-full bg-warning-500"
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href="/admin/risk"
              className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-600 dark:text-brand-300"
            >
              See all risk alerts →
            </Link>
          </Panel>

          <Panel title="Platform Health" action={<PanelLink href="/admin/reports" />}>
            <div className="grid grid-cols-2 gap-4">
              <MiniStat
                label="KYC Pending"
                value={formatCount(platformHealth.kycPending.value)}
                delta={platformHealth.kycPending.delta}
                icon={FileCheck2}
                tone="warning"
              />
              <MiniStat
                label="Disputes Open"
                value={formatCount(platformHealth.disputesOpen.value)}
                delta={platformHealth.disputesOpen.delta}
                icon={AlertTriangle}
                tone="danger"
              />
              <MiniStat
                label="Active Offers"
                value={formatCount(platformHealth.activeOffers.value)}
                delta={platformHealth.activeOffers.delta}
                icon={Tag}
                tone="brand"
              />
              <MiniStat
                label="Server Status"
                value={`${platformHealth.serverUptime}%`}
                caption="Uptime"
                icon={Server}
                tone="success"
              />
            </div>
          </Panel>

          <Panel title="Top Trading Merchants" action={<PanelLink href="/admin/merchants" />}>
            <ul className="space-y-3.5">
              {topMerchants.map((merchant) => (
                <li key={merchant.username} className="flex items-center gap-2.5">
                  <span className="text-base" aria-label={`Rank ${merchant.rank}`}>
                    {["🥇", "🥈", "🥉"][merchant.rank - 1]}
                  </span>
                  <span className="flex min-w-0 flex-1 items-center gap-1">
                    <span className="truncate text-[13px] font-semibold text-neutral-900 dark:text-white">
                      {merchant.username}
                    </span>
                    {merchant.verified && <VerifiedTick className="size-3.5" />}
                  </span>
                  <span className="tabular shrink-0 text-[11.5px] text-neutral-500 dark:text-neutral-400">
                    {formatCount(merchant.trades)} trades
                  </span>
                  <span className="tabular shrink-0 text-[12px] font-semibold text-neutral-900 dark:text-white">
                    {formatNgn(merchant.volumeNgn)}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function QueueTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "brand" | "warning" | "danger";
}) {
  const styles = {
    brand: "bg-brand-50 text-brand-700 dark:bg-brand-900/25 dark:text-brand-200",
    warning: "bg-warning-50 text-warning-700 dark:bg-warning-700/20 dark:text-warning-200",
    danger: "bg-danger-50 text-danger-700 dark:bg-danger-700/20 dark:text-danger-200",
  }[tone];

  return (
    <div className={`rounded-xl px-3.5 py-3 ${styles}`}>
      <p className="text-[12px] font-medium">{label}</p>
      <p className="tabular mt-1 text-xl font-bold">{formatCount(value)}</p>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  href,
  tone,
}: {
  icon: typeof UserPlus;
  label: string;
  href: string;
  tone: "brand" | "success" | "warning" | "danger" | "purple";
}) {
  const styles = {
    brand: "text-brand-600 dark:text-brand-300",
    success: "text-success-600 dark:text-success-300",
    warning: "text-warning-600 dark:text-warning-300",
    danger: "text-danger-600 dark:text-danger-300",
    purple: "text-[#7a5af8]",
  }[tone];

  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 rounded-xl border border-hairline px-2 py-3.5 text-center transition-colors hover:bg-surface-subtle dark:hover:bg-neutral-800/60"
    >
      <Icon className={`size-[18px] ${styles}`} strokeWidth={2} />
      <span className="text-[11.5px] font-medium leading-tight text-neutral-700 dark:text-neutral-200">
        {label}
      </span>
    </Link>
  );
}
