import type { Metadata } from "next";
import { Clock, Plus, ShieldAlert, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/kit/button-link";
import { Callout } from "@/components/kit/primitives";
import { getBankAccounts } from "@/lib/api";
import { formatDate, formatDateTime, NOW } from "@/lib/date";
import type { BankAccount } from "@/lib/types";

export const metadata: Metadata = { title: "Bank Accounts" };

export default async function BankAccountsPage() {
  const accounts = await getBankAccounts();

  return (
    <div className="mx-auto max-w-[860px] space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
            Bank Accounts
          </h1>
          <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
            Where NGN settlement is sent when you sell RMB.
          </p>
        </div>
        <ButtonLink href="/bank-accounts/new" className="gap-2">
          <Plus className="size-4" strokeWidth={2.2} />
          Add Bank Account
        </ButtonLink>
      </div>

      <div className="space-y-3">
        {accounts.map((account) => (
          <BankAccountCard key={account.id} account={account} />
        ))}
      </div>

      <Callout tone="warning" icon={ShieldAlert}>
        For your security, a new or changed bank account can&apos;t receive settlement for a
        short cooling-off period after it&apos;s added, and always requires re-authentication to
        change.
      </Callout>
    </div>
  );
}

function BankAccountCard({ account }: { account: BankAccount }) {
  const onHold = account.usableFrom != null && new Date(account.usableFrom) > NOW;

  return (
    <div className="rounded-2xl border border-hairline bg-card p-4 shadow-card">
      <div className="flex flex-wrap items-center gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-danger-50 text-[11px] font-bold text-danger-700 dark:bg-danger-700/20 dark:text-danger-200">
          {account.bankName.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[14px] font-semibold text-neutral-900 dark:text-white">
              {account.bankName}
            </p>
            {account.isDefault && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
                Default
              </span>
            )}
            {onHold ? (
              <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-warning-600 dark:text-warning-300">
                <Clock className="size-3.5" strokeWidth={2.2} />
                Usable from {formatDateTime(account.usableFrom!)}
              </span>
            ) : account.verified ? (
              <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-success-600 dark:text-success-300">
                <ShieldCheck className="size-3.5" strokeWidth={2.2} />
                Verified
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[13px] text-neutral-600 dark:text-neutral-300">
            {account.accountName} · ••••{account.accountNumberLast4}
          </p>
          <p className="mt-0.5 text-[11.5px] text-neutral-400">
            Added {formatDate(account.addedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
