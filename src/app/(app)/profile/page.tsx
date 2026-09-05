import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Info,
  Mail,
  Pencil,
  Phone,
  Plus,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";
import { UsageMeter } from "@/components/charts/progress-ring";
import { ButtonLink } from "@/components/kit/button-link";
import { RailIcon, railLabel } from "@/components/kit/payment-rail";
import { Callout, DetailRow, Panel, PanelLink } from "@/components/kit/primitives";
import { StatusPill } from "@/components/kit/status-badge";
import { MaskedField } from "@/components/profile/masked-field";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { getBankAccounts, getCurrentUser, getPaymentMethods } from "@/lib/api";
import { currentUserPublicId } from "@/lib/mock/users";
import { formatDate, formatDateTime } from "@/lib/date";
import {
  formatCount,
  formatDuration,
  formatNgn,
  formatPercentValue,
  usageFraction,
} from "@/lib/money";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const [user, paymentMethods, bankAccounts] = await Promise.all([
    getCurrentUser(),
    getPaymentMethods(),
    getBankAccounts(),
  ]);

  const dailyFraction = usageFraction(user.limits.dailyUsedNgn, user.limits.dailyTradeValueNgn);
  const monthlyFraction = usageFraction(
    user.limits.monthlyUsedNgn,
    user.limits.monthlyTradeValueNgn,
  );
  const countFraction = user.limits.dailyTradeCountUsed / user.limits.dailyTradeCount;

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
            Profile
          </h1>
          <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
            Manage your account information and verification.
          </p>
        </div>
        <ButtonLink href="/settings" variant="outline" className="gap-2">
          <Pencil className="size-4" strokeWidth={2.1} />
          Edit Profile
        </ButtonLink>
      </div>

      <ProfileTabs active="overview" />

      {/* Identity + reputation */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="rounded-2xl border border-hairline bg-card p-5 shadow-card">
          <div className="flex items-start gap-4">
            <span className="grid size-20 shrink-0 place-items-center rounded-full bg-[#2f3d8f] text-2xl font-semibold text-white">
              {user.initials}
            </span>
            <div className="min-w-0 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  {user.displayName}
                </h2>
                <StatusPill tone="success" icon={BadgeCheck}>
                  Verified
                </StatusPill>
              </div>
              <p className="mt-2 text-[12px] text-neutral-500 dark:text-neutral-400">
                ScarExchange User ID
              </p>
              <p className="tabular text-[13.5px] font-semibold text-neutral-900 dark:text-white">
                {currentUserPublicId}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 border-t border-hairline pt-4 sm:grid-cols-3">
            <ContactItem
              icon={Phone}
              value={user.phone}
              caption={user.phoneVerified ? "Verified" : "Unverified"}
              verified={user.phoneVerified}
            />
            <ContactItem
              icon={Mail}
              value={user.email}
              caption={user.emailVerified ? "Verified" : "Unverified"}
              verified={user.emailVerified}
            />
            <ContactItem
              icon={CalendarDays}
              value="Joined"
              caption={formatDate(user.stats.memberSince)}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-hairline bg-card p-5 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-success-50 dark:bg-success-900/30">
                <ShieldCheck
                  className="size-5 text-success-600 dark:text-success-300"
                  strokeWidth={2}
                />
              </span>
              <div>
                <p className="text-[15px] font-semibold text-neutral-900 dark:text-white">
                  Verified Trader
                </p>
                <p className="mt-0.5 text-[12.5px] text-neutral-500 dark:text-neutral-400">
                  You are a fully verified trader.
                </p>
              </div>
            </div>
            <ButtonLink href="/merchants/apply" variant="outline" size="sm" className="gap-1.5">
              <BadgeCheck className="size-3.5" strokeWidth={2.2} />
              Become a Merchant
            </ButtonLink>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <ReputationStat
              icon={Star}
              iconClass="text-warning-500"
              value={user.stats.rating.toFixed(2)}
              label="Rating"
            />
            <ReputationStat
              icon={CheckCircle2}
              iconClass="text-brand-600 dark:text-brand-300"
              value={formatCount(user.stats.completedTrades)}
              label="Completed Trades"
            />
            <ReputationStat
              icon={TrendingUp}
              iconClass="text-success-600 dark:text-success-300"
              value={formatNgn(user.stats.totalVolumeNgn)}
              label="Total Volume"
            />
            <ReputationStat
              icon={Clock}
              iconClass="text-[#7a5af8]"
              value={formatDuration(user.stats.avgReleaseTime)}
              label="Avg. Release Time"
            />
          </div>

          <div className="mt-5">
            <UsageMeter fraction={0.95} color="var(--color-success-500)" className="h-2" />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[12px] text-neutral-500 dark:text-neutral-400">
                Excellent! You&apos;re doing great.
              </p>
              <p className="text-[12px] font-medium text-neutral-700 dark:text-neutral-200">
                Top 5% of traders
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Details */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Personal Information">
          <dl className="divide-y divide-hairline">
            <DetailRow label="Full Name" value={user.fullName} />
            <DetailRow label="Username" value={user.username} />
            <DetailRow
              label="Date of Birth"
              value={user.dateOfBirth ? formatDate(user.dateOfBirth) : "—"}
            />
            <DetailRow
              label="Country"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true">{user.countryFlag}</span>
                  {user.country}
                </span>
              }
            />
            <DetailRow label="State" value={user.state ?? "—"} />
            <DetailRow label="City" value={user.city ?? "—"} />
            <DetailRow
              label="BVN"
              value={
                user.bvnLast4 ? (
                  <MaskedField last4={user.bvnLast4} label="BVN" />
                ) : (
                  "Not provided"
                )
              }
            />
          </dl>
        </Panel>

        <Panel
          title="Account Limits"
          action={<PanelLink href="/settings/limits">View Details</PanelLink>}
        >
          <div className="space-y-4">
            <LimitBar
              label="Daily Trading Limit"
              total={formatNgn(user.limits.dailyTradeValueNgn)}
              used={formatNgn(user.limits.dailyUsedNgn)}
              fraction={dailyFraction}
              color="var(--color-success-500)"
            />
            <LimitBar
              label="Monthly Trading Limit"
              total={formatNgn(user.limits.monthlyTradeValueNgn)}
              used={formatNgn(user.limits.monthlyUsedNgn)}
              fraction={monthlyFraction}
              color="var(--color-brand-600)"
            />
            <LimitBar
              label="Daily Transaction Limit"
              total={`${user.limits.dailyTradeCount} Trades`}
              used={`${user.limits.dailyTradeCountUsed} Trades`}
              fraction={countFraction}
              color="#7a5af8"
            />
          </div>

          <Callout tone="brand" icon={Info} className="mt-4">
            Complete KYC Level 3 to increase your limits.
          </Callout>
        </Panel>

        <div className="space-y-5">
          <Panel
            title="Payment Methods"
            action={<PanelLink href="/payment-methods">Manage ›</PanelLink>}
          >
            <ul className="space-y-2">
              {paymentMethods.map((method) => (
                <li key={method.id}>
                  <Link
                    href="/payment-methods"
                    className="flex items-center gap-3 rounded-xl border border-hairline p-3 transition-colors hover:bg-surface-subtle dark:hover:bg-neutral-800/50"
                  >
                    <RailIcon rail={method.rail} className="size-8 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                        {railLabel(method.rail)}
                      </p>
                      <p className="truncate text-[11.5px] text-neutral-500 dark:text-neutral-400">
                        {method.accountLabel}
                      </p>
                    </div>
                    {method.verified && (
                      <span className="text-[11px] font-semibold text-success-600 dark:text-success-300">
                        Verified
                      </span>
                    )}
                    <ChevronRight className="size-4 shrink-0 text-neutral-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Bank Accounts"
            action={<PanelLink href="/bank-accounts">Manage ›</PanelLink>}
          >
            <ul className="space-y-2">
              {bankAccounts.map((account) => (
                <li key={account.id}>
                  <Link
                    href="/bank-accounts"
                    className="flex items-center gap-3 rounded-xl border border-hairline p-3 transition-colors hover:bg-surface-subtle dark:hover:bg-neutral-800/50"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-danger-50 text-[9px] font-bold text-danger-700 dark:bg-danger-700/20 dark:text-danger-200">
                      {account.bankName.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                        {account.bankName}
                      </p>
                      <p className="truncate text-[11.5px] text-neutral-500 dark:text-neutral-400">
                        {account.accountName} · ••••{account.accountNumberLast4}
                      </p>
                    </div>
                    {account.verified && (
                      <span className="text-[11px] font-semibold text-success-600 dark:text-success-300">
                        Verified
                      </span>
                    )}
                    <ChevronRight className="size-4 shrink-0 text-neutral-300" />
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/bank-accounts/new"
              className="mt-2 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-neutral-300 py-3 text-[13px] font-medium text-neutral-600 transition-colors hover:border-brand-300 hover:text-brand-600 dark:border-neutral-700 dark:text-neutral-300"
            >
              <Plus className="size-4" strokeWidth={2.2} />
              Add Bank Account
            </Link>
          </Panel>
        </div>
      </div>

      {/* Activity + safety */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Recent Activity">
          <ul className="space-y-3.5">
            {[
              {
                icon: CheckCircle2,
                tone: "bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-300",
                title: "Trade Completed",
                body: "You completed a trade with TonyFX",
                at: "2026-08-31T10:46:00+01:00",
              },
              {
                icon: ShieldCheck,
                tone: "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300",
                title: "KYC Level 2 Approved",
                body: "Your identity has been verified successfully.",
                at: "2026-08-20T14:32:00+01:00",
              },
              {
                icon: Building2,
                tone: "bg-[#f4f3ff] text-[#7a5af8] dark:bg-[#5925dc]/20",
                title: "Bank Account Added",
                body: "GTBank account ending with 4821 was added.",
                at: "2026-08-18T11:15:00+01:00",
              },
            ].map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${item.tone}`}>
                  <item.icon className="size-4" strokeWidth={2.1} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-neutral-500 dark:text-neutral-400">
                    {item.body}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[11.5px] text-neutral-500 dark:text-neutral-400">
                    {formatDate(item.at)}
                  </p>
                  <p className="tabular text-[11px] text-neutral-400">
                    {formatDateTime(item.at).split(", ")[1]}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Security Tips" action={<PanelLink href="/security" />}>
          <div className="flex items-start gap-6">
            <ul className="min-w-0 flex-1 space-y-2.5">
              {[
                "Enable 2FA to keep your account secure",
                "Never share your password or OTP with anyone",
                "Always trade within ScarExchange",
                "Report suspicious activity immediately",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-success-500"
                    strokeWidth={2.2}
                  />
                  <span className="text-[12.5px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {tip}
                  </span>
                </li>
              ))}
            </ul>

            <span
              className="hidden size-24 shrink-0 place-items-center rounded-2xl bg-brand-50 sm:grid dark:bg-brand-900/25"
              aria-hidden="true"
            >
              <ShieldCheck
                className="size-11 text-brand-600 dark:text-brand-300"
                strokeWidth={1.6}
              />
            </span>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function ContactItem({
  icon: Icon,
  value,
  caption,
  verified,
}: {
  icon: typeof Phone;
  value: string;
  caption: string;
  verified?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-neutral-400" strokeWidth={1.9} />
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-neutral-900 dark:text-white">
          {value}
        </p>
        <p
          className={
            verified
              ? "text-[11.5px] font-medium text-success-600 dark:text-success-300"
              : "text-[11.5px] text-neutral-500 dark:text-neutral-400"
          }
        >
          {caption}
        </p>
      </div>
    </div>
  );
}

function ReputationStat({
  icon: Icon,
  iconClass,
  value,
  label,
}: {
  icon: typeof Star;
  iconClass: string;
  value: string;
  label: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <Icon className={`size-4 shrink-0 ${iconClass}`} strokeWidth={2.1} />
        <span className="tabular text-[15px] font-bold text-neutral-900 dark:text-white">
          {value}
        </span>
      </div>
      <p className="mt-0.5 text-[11.5px] text-neutral-500 dark:text-neutral-400">{label}</p>
    </div>
  );
}

function LimitBar({
  label,
  total,
  used,
  fraction,
  color,
}: {
  label: string;
  total: string;
  used: string;
  fraction: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[12.5px] text-neutral-500 dark:text-neutral-400">{label}</p>
        <p className="text-[11.5px] text-neutral-400">Used</p>
      </div>
      <div className="mt-0.5 flex items-baseline justify-between gap-3">
        <p className="tabular text-[14px] font-bold text-neutral-900 dark:text-white">
          {total}
        </p>
        <p className="tabular text-[12.5px] text-neutral-600 dark:text-neutral-300">
          {used}{" "}
          <span className="text-neutral-400">({formatPercentValue(fraction * 100, 0)})</span>
        </p>
      </div>
      <UsageMeter fraction={fraction} color={color} className="mt-2" />
    </div>
  );
}
