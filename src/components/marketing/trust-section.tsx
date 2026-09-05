import { Headphones, Lock, ShieldCheck, Trophy, Users } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Escrow Protection",
    body: "Your trades are protected with our secure escrow system until both parties are satisfied.",
    tone: "text-brand-600 bg-brand-50 dark:bg-brand-900/30 dark:text-brand-300",
  },
  {
    icon: Users,
    title: "Verified Traders",
    body: "All traders go through strict KYC verification to ensure a safe trading environment.",
    tone: "text-success-600 bg-success-50 dark:bg-success-900/30 dark:text-success-300",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    body: "Your payment information is encrypted and never shared with third parties.",
    tone: "text-[#7a5af8] bg-[#f4f3ff] dark:bg-[#5925dc]/20",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    body: "Our support team is always ready to help you with any issues or questions.",
    tone: "text-warning-600 bg-warning-50 dark:bg-warning-700/20 dark:text-warning-300",
  },
  {
    icon: Trophy,
    title: "Reputation System",
    body: "Trade with confidence using our transparent rating and review system.",
    tone: "text-danger-600 bg-danger-50 dark:bg-danger-700/20 dark:text-danger-300",
  },
];

/** Shared trust pillars, used at the foot of the Buy and Sell marketplace pages. */
export function TrustSection() {
  return (
    <section className="mt-8 rounded-2xl bg-surface-subtle px-6 py-10 dark:bg-neutral-900/40">
      <h2 className="text-center text-[22px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
        Why traders trust ScarExchange
      </h2>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {pillars.map((pillar) => (
          <li key={pillar.title}>
            <span
              className={`grid size-11 place-items-center rounded-2xl ${pillar.tone}`}
            >
              <pillar.icon className="size-5" strokeWidth={1.9} />
            </span>
            <p className="mt-3.5 text-[14px] font-semibold text-neutral-900 dark:text-white">
              {pillar.title}
            </p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              {pillar.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
