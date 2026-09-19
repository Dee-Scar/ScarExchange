import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  ChevronRight,
  Receipt,
  Wallet as WalletIcon,
} from "lucide-react";
import { EmptyState, Panel } from "@/components/kit/primitives";
import { RailBadge } from "@/components/kit/payment-rail";
import { TransferButton } from "@/components/wallet/transfer-button";
import { WalletActions } from "@/components/wallet/wallet-actions";
import { WalletBalanceCard } from "@/components/wallet/wallet-balance-card";
import { getBankAccounts, getOffers, getWallet } from "@/lib/api";
import { formatDateTime } from "@/lib/date";
import { formatNgn, formatRate } from "@/lib/money";
import { RMB_RAILS, rateComparisonRows } from "@/lib/mock/offers";
import type { WalletEntry } from "@/lib/types";

export const metadata: Metadata = { title: "Wallet" };

export default async function WalletPage() {
  const [{ balanceNgn, entries }, bankAccounts, sellOffers] = await Promise.all([
    getWallet(),
    getBankAccounts(),
    getOffers({ side: "sell" }),
  ]);
  const defaultAccount = bankAccounts.find((a) => a.isDefault) ?? bankAccounts[0];

  const totalDeposited = entries
    .filter((e) => e.type === "deposit")
    .reduce((sum, e) => sum + e.amountNgn, 0);
  const totalWithdrawn = entries
    .filter((e) => e.type === "withdrawal")
    .reduce((sum, e) => sum + e.amountNgn, 0);

  const railRates = RMB_RAILS.map((rail) => {
    const matching = sellOffers.filter((o) => o.rails.includes(rail));
    const bestRate = matching.length ? Math.min(...matching.map((o) => o.rate)) : null;
    const row = rateComparisonRows.find((r) => r.rail === rail);
    return { rail, bestRate, changePercent: row?.changePercent ?? null };
  });

  return (
    <div className="mx-auto max-w-[1100px] space-y-5">
      <nav className="flex items-center gap-1.5 text-[12.5px] text-neutral-500 dark:text-neutral-400">
        <Link href="/dashboard" className="hover:text-neutral-700 dark:hover:text-neutral-200">
          Dashboard
        </Link>
        <ChevronRight className="size-3.5" strokeWidth={2} />
        <span className="font-medium text-neutral-700 dark:text-neutral-200">Wallet</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
            My Wallet
          </h1>
          <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
            A separate NGN balance you fund from your bank — trade settlements still go straight
            to your bank account, unaffected by this.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="#wallet-actions"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-brand-600 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-brand-700"
          >
            <ArrowDownToLine className="size-4" strokeWidth={2.2} />
            Add Funds
          </a>
          <a
            href="#wallet-actions"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-hairline bg-card px-4 text-[13px] font-semibold text-neutral-700 transition-colors hover:bg-surface-subtle dark:text-neutral-200"
          >
            <ArrowUpFromLine className="size-4" strokeWidth={2.2} />
            Withdraw
          </a>
          <TransferButton />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-5">
          <WalletBalanceCard balanceNgn={balanceNgn} />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile icon={WalletIcon} label="Available Balance" value={formatNgn(balanceNgn)} />
            <StatTile icon={ArrowDownToLine} label="Total Deposited" value={formatNgn(totalDeposited)} />
            <StatTile icon={ArrowUpFromLine} label="Total Withdrawn" value={formatNgn(totalWithdrawn)} />
            <StatTile icon={Receipt} label="Transactions" value={String(entries.length)} />
          </div>

          <Panel title="Wallet Balances" padded={false}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-hairline bg-surface-subtle dark:bg-neutral-900/50">
                    {["Currency", "Balance", "Action"].map((heading) => (
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
                  <tr>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-[11px] font-bold text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
                          ₦
                        </span>
                        <div>
                          <p className="text-[13.5px] font-semibold text-neutral-900 dark:text-white">NGN</p>
                          <p className="text-[11.5px] text-neutral-500 dark:text-neutral-400">
                            Nigerian Naira
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="tabular px-5 py-4 text-[14px] font-bold text-neutral-900 dark:text-white">
                      {formatNgn(balanceNgn)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <a
                          href="#wallet-actions"
                          className="rounded-lg bg-brand-600 px-3 py-1.5 text-[12.5px] font-semibold text-white transition-colors hover:bg-brand-700"
                        >
                          Deposit
                        </a>
                        <a
                          href="#wallet-actions"
                          className="rounded-lg border border-hairline px-3 py-1.5 text-[12.5px] font-semibold text-neutral-700 transition-colors hover:bg-surface-subtle dark:text-neutral-200"
                        >
                          Withdraw
                        </a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Panel>

          <div id="ledger" className="scroll-mt-20">
            <Panel title="Transaction Ledger">
              {entries.length === 0 ? (
                <EmptyState
                  icon={WalletIcon}
                  title="No wallet activity yet"
                  description="Deposits and withdrawals you make will show up here."
                />
              ) : (
                <ul className="divide-y divide-hairline">
                  {entries.map((entry) => (
                    <EntryRow key={entry.id} entry={entry} />
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </div>

        <aside className="min-w-0 space-y-5">
          {defaultAccount ? (
            <WalletActions account={defaultAccount} balanceNgn={balanceNgn} />
          ) : (
            <div className="rounded-2xl border border-hairline bg-card p-5 text-center shadow-card">
              <p className="text-[13px] text-neutral-500 dark:text-neutral-400">
                Add a bank account before funding your wallet.
              </p>
              <Link
                href="/bank-accounts"
                className="mt-3 inline-block text-[13px] font-semibold text-brand-600 dark:text-brand-300"
              >
                Add a bank account →
              </Link>
            </div>
          )}

          <Panel
            title="Exchange Rates"
            action={
              <Link
                href="/rates"
                className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
              >
                View All
                <ArrowRight className="size-3.5" strokeWidth={2.4} />
              </Link>
            }
          >
            <ul className="space-y-1">
              {railRates.map(({ rail, bestRate, changePercent }) => (
                <li key={rail} className="flex items-center justify-between py-2">
                  <RailBadge rail={rail} />
                  <div className="flex items-center gap-2">
                    <span className="tabular text-[13.5px] font-bold text-neutral-900 dark:text-white">
                      {bestRate != null ? `${formatRate(bestRate)}/RMB` : "—"}
                    </span>
                    {changePercent != null && (
                      <span
                        className={
                          changePercent >= 0
                            ? "rounded-md bg-success-50 px-1.5 py-0.5 text-[11px] font-semibold text-success-600 dark:bg-success-900/30 dark:text-success-300"
                            : "rounded-md bg-danger-50 px-1.5 py-0.5 text-[11px] font-semibold text-danger-600 dark:bg-danger-900/30 dark:text-danger-300"
                        }
                      >
                        {changePercent >= 0 ? "+" : ""}
                        {changePercent.toFixed(2)}%
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="Recent Activity"
            action={
              entries.length > 0 && (
                <a
                  href="#ledger"
                  className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
                >
                  View All
                  <ArrowRight className="size-3.5" strokeWidth={2.4} />
                </a>
              )
            }
          >
            {entries.length === 0 ? (
              <EmptyState
                icon={WalletIcon}
                title="No activity yet"
                description="Deposits and withdrawals you make will show up here."
              />
            ) : (
              <ul className="divide-y divide-hairline">
                {entries.slice(0, 4).map((entry) => (
                  <EntryRow key={entry.id} entry={entry} />
                ))}
              </ul>
            )}
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function EntryRow({ entry }: { entry: WalletEntry }) {
  return (
    <li className="flex items-center gap-3 py-3.5">
      <span
        className={
          entry.type === "deposit"
            ? "grid size-9 shrink-0 place-items-center rounded-xl bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-300"
            : "grid size-9 shrink-0 place-items-center rounded-xl bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-300"
        }
      >
        {entry.type === "deposit" ? (
          <ArrowDownToLine className="size-4" strokeWidth={2.1} />
        ) : (
          <ArrowUpFromLine className="size-4" strokeWidth={2.1} />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-semibold text-neutral-900 dark:text-white">
          {entry.type === "deposit" ? "Wallet Deposit" : "Wallet Withdrawal"}
        </p>
        <p className="text-[11.5px] text-neutral-500 dark:text-neutral-400">
          {formatDateTime(entry.createdAt)}
        </p>
      </div>
      <p
        className={
          entry.type === "deposit"
            ? "tabular text-[14px] font-bold text-success-600 dark:text-success-300"
            : "tabular text-[14px] font-bold text-neutral-900 dark:text-white"
        }
      >
        {entry.type === "deposit" ? "+" : "−"}
        {formatNgn(entry.amountNgn)}
      </p>
    </li>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof WalletIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-card p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11.5px] text-neutral-500 dark:text-neutral-400">{label}</p>
          <p className="tabular mt-1 truncate text-[16px] font-bold text-neutral-900 dark:text-white">
            {value}
          </p>
        </div>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
          <Icon className="size-4" strokeWidth={2.1} />
        </span>
      </div>
    </div>
  );
}
