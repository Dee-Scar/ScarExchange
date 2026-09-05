"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Banknote,
  Building2,
  CreditCard,
  KeyRound,
  Laptop,
  Lock,
  Phone,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";
import { Panel } from "@/components/kit/primitives";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { formatRelative } from "@/lib/date";

const SENSITIVE_ACTIONS = [
  { icon: Lock, label: "Changing your password" },
  { icon: Phone, label: "Changing your phone number" },
  { icon: Building2, label: "Changing your bank account" },
  { icon: CreditCard, label: "Changing a payment account" },
  { icon: Banknote, label: "Large transactions" },
  { icon: Wallet, label: "Withdrawals and settlements" },
];

/** Security & account settings (PRD §28). No backend yet — toggles are local. */
export function SecuritySettings({
  twoFactorEnabled: initialTwoFactor,
  lastSignIn,
}: {
  twoFactorEnabled: boolean;
  lastSignIn: string;
}) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(initialTwoFactor);

  function handleTwoFactorChange(checked: boolean) {
    setTwoFactorEnabled(checked);
    toast.success(checked ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
  }

  function notWiredUp(action: string) {
    toast.info(`${action} requires re-verifying your identity — not wired up in this preview yet.`);
  }

  return (
    <div className="space-y-5">
      <Panel title="Two-Factor Authentication">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-success-50 dark:bg-success-900/30">
              <Smartphone className="size-4 text-success-600 dark:text-success-300" strokeWidth={2} />
            </span>
            <div>
              <p className="text-[13.5px] font-semibold text-neutral-900 dark:text-white">
                Authenticator app
              </p>
              <p className="mt-0.5 max-w-md text-[12.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                Require a one-time code from your authenticator app every time you sign in.
              </p>
            </div>
          </div>
          <Switch checked={twoFactorEnabled} onCheckedChange={handleTwoFactorChange} />
        </div>
      </Panel>

      <Panel title="Password & Recovery">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 dark:bg-brand-900/30">
                <KeyRound className="size-4 text-brand-600 dark:text-brand-300" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[13.5px] font-semibold text-neutral-900 dark:text-white">
                  Password
                </p>
                <p className="mt-0.5 text-[12px] text-neutral-500 dark:text-neutral-400">
                  Last changed 3 months ago
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => notWiredUp("Changing your password")}>
              Change
            </Button>
          </div>
        </div>
      </Panel>

      <Panel title="Recent Sign-In Activity">
        <ul>
          <li className="flex items-center gap-3 rounded-xl bg-surface-subtle p-3 dark:bg-neutral-900">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-card dark:bg-neutral-800">
              <Laptop className="size-4 text-neutral-500 dark:text-neutral-300" strokeWidth={1.9} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                Chrome on Windows
              </p>
              <p className="text-[11.5px] text-neutral-500 dark:text-neutral-400">
                Kaduna, Nigeria · {formatRelative(lastSignIn)}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-success-600 dark:text-success-300">
              <span className="size-1.5 rounded-full bg-success-500" />
              This device
            </span>
          </li>
        </ul>
      </Panel>

      <Panel title="Actions That Require Extra Verification">
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {SENSITIVE_ACTIONS.map((item) => (
            <li key={item.label} className="flex items-center gap-2.5">
              <item.icon className="size-4 shrink-0 text-neutral-400" strokeWidth={1.9} />
              <span className="text-[12.5px] text-neutral-600 dark:text-neutral-300">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="flex items-start gap-3 rounded-xl bg-brand-50 px-3.5 py-3 text-[13px] text-brand-800 dark:bg-brand-900/25 dark:text-brand-200">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" strokeWidth={2.2} />
        <p className="leading-relaxed">
          Never send funds outside an active trade. ScarExchange support will never ask for your
          password or OTP — only use payment details displayed inside the trade itself.
        </p>
      </div>
    </div>
  );
}
