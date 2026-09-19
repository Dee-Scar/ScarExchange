import { Banknote, Building2, CreditCard, Lock, Phone, Wallet } from "lucide-react";

/**
 * PRD §28 — actions that always require re-authentication, regardless of the
 * account's 2FA setting. Shared by the account Security settings
 * (`components/security/security-settings.tsx`, a client component) and the
 * public Security overview page (a server component) — kept in its own
 * plain module, with no "use client" directive, because a server component
 * can't import a named value export back out of a client-marked module.
 */
export const SENSITIVE_ACTIONS = [
  { icon: Lock, label: "Changing your password" },
  { icon: Phone, label: "Changing your phone number" },
  { icon: Building2, label: "Changing your bank account" },
  { icon: CreditCard, label: "Changing a payment account" },
  { icon: Banknote, label: "Large transactions" },
  { icon: Wallet, label: "Withdrawals and settlements" },
];
