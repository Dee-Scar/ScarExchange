import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  MessageSquare,
  Search,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { ExchangeIllustration } from "@/components/marketing/exchange-illustration";
import { RatesPanel } from "@/components/marketing/rates-panel";
import { marketReferenceRate, marketplaceHighlights } from "@/lib/mock/offers";
import { formatRate } from "@/lib/money";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <TrustStats />
      <RatesPanel />
      <HowItWorks />
      <ClosingCta />
    </>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-20">
      <div>
        <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-[12.5px] font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
          P2P RMB ↔ NGN Exchange
        </span>

        <h1 className="mt-5 text-[40px] font-bold leading-[1.08] tracking-[-0.03em] text-neutral-900 sm:text-[52px] dark:text-white">
          Exchange RMB and
          <br />
          Naira with confidence
        </h1>

        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          ScarExchange connects verified buyers and sellers to trade RMB and Naira
          securely, quickly and at the best rates.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/buy"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Buy RMB
            <ArrowRight className="size-4" strokeWidth={2.4} />
          </Link>
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-card px-6 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:border-brand-800 dark:text-brand-200 dark:hover:bg-brand-900/30"
          >
            Sell RMB
            <ArrowRight className="size-4" strokeWidth={2.4} />
          </Link>
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Secure & Trusted",
              body: "Your security is our priority",
            },
            {
              icon: Zap,
              title: "Fast Transactions",
              body: "Quick payments and settlements",
            },
            {
              icon: BarChart3,
              title: "Best Rates",
              body: "Competitive rates from trusted traders",
            },
          ].map((item) => (
            <li key={item.title}>
              <item.icon className="size-5 text-brand-600 dark:text-brand-300" strokeWidth={1.9} />
              <p className="mt-2.5 text-[13.5px] font-semibold text-neutral-900 dark:text-white">
                {item.title}
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center lg:justify-end">
        <ExchangeIllustration />
      </div>
    </section>
  );
}

function TrustStats() {
  const stats = [
    { icon: Users, value: "12,450+", label: "Active Traders" },
    { icon: BarChart3, value: "¥4.2M+", label: "24h Trading Volume" },
    { icon: CheckCircle2, value: "99.1%", label: "Completion Rate" },
    { icon: ShieldCheck, value: "0.4%", label: "Dispute Rate" },
  ];

  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-6">
      <div className="grid gap-6 rounded-2xl border border-hairline bg-card px-6 py-7 shadow-card sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group flex items-center gap-3 rounded-xl p-1.5 transition-colors duration-200 hover:bg-surface-subtle dark:hover:bg-neutral-900/50"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 transition-transform duration-300 ease-out group-hover:scale-110 dark:bg-brand-900/30">
              <stat.icon
                className="size-[18px] text-brand-600 dark:text-brand-300"
                strokeWidth={2}
              />
            </span>
            <div>
              <p className="tabular text-xl font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-[12.5px] text-neutral-500 dark:text-neutral-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: Users,
      title: "Create an account",
      body: "Sign up, verify your identity and secure your account.",
    },
    {
      icon: Search,
      title: "Find the best offer",
      body: "Choose from trusted sellers with competitive rates.",
    },
    {
      icon: MessageSquare,
      title: "Negotiate & trade",
      body: "Agree on the rate, make payment and share proof.",
    },
    {
      icon: CheckCircle2,
      title: "Get your RMB",
      body: "Seller confirms payment and you receive your RMB.",
    },
  ];

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6">
      <div className="text-center">
        <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-brand-600 dark:text-brand-300">
          How it works
        </span>
        <h2 className="mt-2 text-[30px] font-bold tracking-[-0.02em] text-neutral-900 sm:text-[34px] dark:text-white">
          Simple. Secure. Seamless.
        </h2>
      </div>

      <ol className="mt-12 grid gap-4 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="group relative rounded-2xl border border-hairline bg-card p-6 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover"
          >
            <span className="grid size-7 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
              {index + 1}
            </span>
            <span className="mt-5 grid size-11 place-items-center rounded-2xl bg-brand-50 transition-transform duration-300 ease-out group-hover:scale-110 dark:bg-brand-900/30">
              <step.icon
                className="size-5 text-brand-600 dark:text-brand-300"
                strokeWidth={1.9}
              />
            </span>
            <p className="mt-4 text-[15px] font-semibold text-neutral-900 dark:text-white">
              {step.title}
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              {step.body}
            </p>

            {index < steps.length - 1 && (
              <ArrowRight
                className="absolute -right-[13px] top-1/2 hidden size-5 -translate-y-1/2 text-neutral-300 lg:block"
                strokeWidth={2}
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-20 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 px-6 py-12 text-center sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 size-56 rounded-full bg-brand-400/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-10 size-64 rounded-full bg-success-500/15 blur-3xl"
        />

        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12.5px] font-medium text-brand-100">
            Reference rate
            <span className="tabular font-bold text-white">
              ¥1 = {formatRate(marketReferenceRate)}
            </span>
          </p>
          <h2 className="mt-5 text-[30px] font-bold tracking-[-0.02em] text-white sm:text-[36px]">
            Start trading with {marketplaceHighlights.verifiedMerchants} verified merchants
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[14px] leading-relaxed text-brand-100/85">
            Every trade is escrowed, every trader is verified, and every rate is
            visible before you commit.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-50"
            >
              Create free account
              <ArrowRight className="size-4" strokeWidth={2.4} />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              See how it works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
