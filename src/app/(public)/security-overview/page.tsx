import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  FileCheck2,
  IdCard,
  Landmark,
  Lock,
  ScanFace,
  User,
} from "lucide-react";
import { Callout } from "@/components/kit/primitives";
import { TrustSection } from "@/components/marketing/trust-section";
import { SENSITIVE_ACTIONS } from "@/components/security/sensitive-actions";

export const metadata: Metadata = {
  title: "Security",
  description: "How ScarExchange verifies traders, protects payments and screens for risk.",
};

const KYC_LEVELS = [
  {
    level: 0,
    label: "Unverified",
    icon: User,
    body: "Signed up, not yet verified. Browsing only — trading limits are effectively zero until Level 1.",
  },
  {
    level: 1,
    label: "Basic",
    icon: FileCheck2,
    body: "Name, email and phone confirmed. Unlocks small-value trading.",
  },
  {
    level: 2,
    label: "Identity Verified",
    icon: IdCard,
    body: "Government ID plus a selfie/liveness check and date of birth on file. This is the level most active traders sit at.",
  },
  {
    level: 3,
    label: "Enhanced",
    icon: ScanFace,
    body: "Address and source-of-funds information added, for the highest trading limits and merchant eligibility.",
  },
];

const RISK_BANDS = [
  { range: "0–30", label: "Low", tone: "text-success-600 dark:text-success-300" },
  { range: "31–60", label: "Medium", tone: "text-warning-600 dark:text-warning-300" },
  { range: "61–80", label: "High", tone: "text-warning-700 dark:text-warning-200" },
  { range: "81–100", label: "Critical", tone: "text-danger-600 dark:text-danger-300" },
];

export default function SecurityOverviewPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6">
      <div className="text-center">
        <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-brand-600 dark:text-brand-300">
          Security
        </span>
        <h1 className="mt-2 text-[34px] font-bold tracking-[-0.02em] text-neutral-900 sm:text-[40px] dark:text-white">
          Built for a marketplace where real money moves
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          Verification, risk scoring and a two-step payment handshake — the same controls run
          on every trade, whether it&apos;s ¥1,000 or ¥100,000.
        </p>
      </div>

      <Callout tone="danger" icon={Lock} title="Never send funds outside a trade" className="mt-8">
        ScarExchange support will never ask for your password or OTP. Only ever use the payment
        details shown inside your active trade — anyone asking you to pay outside the platform
        is not a legitimate counterparty.
      </Callout>

      <section className="mt-14">
        <h2 className="text-[22px] font-bold text-neutral-900 dark:text-white">
          Verification levels
        </h2>
        <p className="mt-1.5 text-[13.5px] text-neutral-500 dark:text-neutral-400">
          Higher KYC levels unlock higher trading limits.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KYC_LEVELS.map((item) => (
            <div key={item.level} className="rounded-2xl border border-hairline bg-card p-4 shadow-card">
              <span className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
                <item.icon className="size-4" strokeWidth={2} />
              </span>
              <p className="mt-3 text-[13px] font-semibold text-neutral-900 dark:text-white">
                Level {item.level} — {item.label}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-[22px] font-bold text-neutral-900 dark:text-white">
            Extra authentication, every time
          </h2>
          <p className="mt-1.5 text-[13.5px] text-neutral-500 dark:text-neutral-400">
            These always require you to re-authenticate, no exceptions:
          </p>
          <ul className="mt-4 space-y-2.5">
            {SENSITIVE_ACTIONS.map((item) => (
              <li key={item.label} className="flex items-center gap-2.5">
                <item.icon className="size-4 shrink-0 text-brand-600 dark:text-brand-300" strokeWidth={2} />
                <span className="text-[13.5px] text-neutral-700 dark:text-neutral-200">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[22px] font-bold text-neutral-900 dark:text-white">
            Risk scoring
          </h2>
          <p className="mt-1.5 text-[13.5px] text-neutral-500 dark:text-neutral-400">
            Every account and trade carries a risk score from 0–100. High-risk trades enter
            manual review automatically before they can settle.
          </p>
          <ul className="mt-4 space-y-2">
            {RISK_BANDS.map((band) => (
              <li
                key={band.label}
                className="flex items-center justify-between rounded-xl border border-hairline bg-card px-4 py-2.5"
              >
                <span className="tabular text-[13px] text-neutral-500 dark:text-neutral-400">
                  {band.range}
                </span>
                <span className={`text-[13px] font-bold ${band.tone}`}>{band.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-hairline bg-surface-subtle p-6 dark:bg-neutral-900/40">
        <div className="flex items-start gap-3.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
            <Landmark className="size-[18px]" strokeWidth={2} />
          </span>
          <div>
            <p className="text-[15px] font-bold text-neutral-900 dark:text-white">
              A payment isn&apos;t confirmed just because someone clicked a button
            </p>
            <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-neutral-600 dark:text-neutral-300">
              Buyer marking &quot;I&apos;ve paid&quot; and seller confirming receipt are two
              separate, independent actions on every trade. Settlement only follows both of
              them — never one side&apos;s word alone.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-14">
        <TrustSection />
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <Link
          href="/security"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Sign in to manage security settings
          <ArrowRight className="size-4" strokeWidth={2.4} />
        </Link>
        <Link
          href="/disputes"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-300"
        >
          <AlertTriangle className="size-4" strokeWidth={2} />
          Something go wrong? See Disputes
        </Link>
      </div>
    </div>
  );
}
