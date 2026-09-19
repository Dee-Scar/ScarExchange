"use client";

import { useId, useState, useTransition } from "react";
import { ArrowDownToLine, ArrowLeftRight, ArrowUpFromLine, Bitcoin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { depositAction, withdrawAction } from "@/lib/actions/wallet";
import { formatNgn, toMinor } from "@/lib/money";
import type { BankAccount } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Quick Actions grid + the real deposit/withdraw form — one client component
 * since Add Funds / Withdraw in the grid need to drive the form's mode.
 * Transfer and Buy Crypto aren't real features (no internal-transfer or
 * crypto rail exists — see project memory), so they're honest "not wired up"
 * toasts rather than either a dead button or a faked flow.
 */
export function WalletActions({
  account,
  balanceNgn,
}: {
  account: BankAccount;
  balanceNgn: number;
}) {
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");

  function jumpToForm(next: "deposit" | "withdraw") {
    setMode(next);
    document.getElementById("wallet-actions")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <div className="rounded-2xl border border-hairline bg-card p-5 shadow-card">
        <h2 className="text-[15px] font-semibold text-neutral-900 dark:text-white">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <QuickActionTile
            icon={ArrowDownToLine}
            label="Add Funds"
            tone="brand"
            onClick={() => jumpToForm("deposit")}
          />
          <QuickActionTile
            icon={ArrowUpFromLine}
            label="Withdraw"
            tone="success"
            onClick={() => jumpToForm("withdraw")}
          />
          <QuickActionTile
            icon={ArrowLeftRight}
            label="Transfer"
            tone="violet"
            onClick={() => toast.info("Internal transfers aren't wired up in this preview yet.")}
          />
          <QuickActionTile
            icon={Bitcoin}
            label="Buy Crypto"
            tone="warning"
            onClick={() => toast.info("Crypto isn't supported on ScarExchange — RMB/NGN only.")}
          />
        </div>
      </div>

      <div
        id="wallet-actions"
        className="scroll-mt-20 rounded-2xl border border-hairline bg-card p-5 shadow-card"
      >
        <div className="inline-flex rounded-xl bg-surface-subtle p-1 dark:bg-neutral-900">
          <ModeButton active={mode === "deposit"} onClick={() => setMode("deposit")} icon={ArrowDownToLine} label="Deposit" />
          <ModeButton active={mode === "withdraw"} onClick={() => setMode("withdraw")} icon={ArrowUpFromLine} label="Withdraw" />
        </div>

        <p className="mt-4 text-[12.5px] text-neutral-500 dark:text-neutral-400">
          {mode === "deposit" ? "From" : "To"}{" "}
          <span className="font-semibold text-neutral-900 dark:text-white">
            {account.bankName} ••••{account.accountNumberLast4}
          </span>
        </p>

        <AmountForm mode={mode} account={account} balanceNgn={balanceNgn} />
      </div>
    </>
  );
}

const TONE_CLASSES = {
  brand: "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300",
  success: "bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-300",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300",
  warning: "bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-300",
} as const;

function QuickActionTile({
  icon: Icon,
  label,
  tone,
  onClick,
}: {
  icon: typeof ArrowDownToLine;
  label: string;
  tone: keyof typeof TONE_CLASSES;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 rounded-xl py-2 text-center transition-colors hover:bg-surface-subtle dark:hover:bg-neutral-900/60"
    >
      <span className={cn("grid size-11 place-items-center rounded-full", TONE_CLASSES[tone])}>
        <Icon className="size-4.5" strokeWidth={2.1} />
      </span>
      <span className="text-[12px] font-semibold text-neutral-700 dark:text-neutral-200">{label}</span>
    </button>
  );
}

function ModeButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof ArrowDownToLine;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors",
        active
          ? "bg-brand-600 text-white"
          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white",
      )}
    >
      <Icon className="size-4" strokeWidth={2} />
      {label}
    </button>
  );
}

function AmountForm({
  mode,
  account,
  balanceNgn,
}: {
  mode: "deposit" | "withdraw";
  account: BankAccount;
  balanceNgn: number;
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputId = useId();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Enter an amount greater than ₦0.");
      return;
    }
    const amountNgn = toMinor(parsed);
    if (mode === "withdraw" && amountNgn > balanceNgn) {
      setError("That's more than your available balance.");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        if (mode === "deposit") {
          await depositAction(account.id, amountNgn);
        } else {
          await withdrawAction(account.id, amountNgn);
        }
        setAmount("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3">
      <div>
        <label htmlFor={inputId} className="text-[12px] font-semibold text-neutral-700 dark:text-neutral-200">
          Amount (₦)
        </label>
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          min={0}
          placeholder="0.00"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError(null);
          }}
          className="tabular mt-1.5 h-11 w-full rounded-xl border border-hairline bg-transparent px-3 text-[14px] font-semibold text-neutral-900 outline-none transition-shadow focus:border-brand-300 focus:shadow-focus dark:text-white"
        />
        {mode === "withdraw" && (
          <p className="tabular mt-1 text-[11px] text-neutral-400">
            Available {formatNgn(balanceNgn)}
          </p>
        )}
      </div>

      {error && <p className="text-[12px] text-danger-600 dark:text-danger-300">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-[14px] font-semibold text-white transition-colors hover:bg-brand-700 disabled:pointer-events-none disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" strokeWidth={2.2} />}
        {pending ? "Processing…" : mode === "deposit" ? "Deposit" : "Withdraw"}
      </button>
    </form>
  );
}
