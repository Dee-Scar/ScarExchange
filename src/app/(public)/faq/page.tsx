import type { Metadata } from "next";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatRate } from "@/lib/money";
import { marketReferenceRate } from "@/lib/mock/offers";
import { PLATFORM_FEE_BPS } from "@/lib/mock/trades";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers on buying, selling, payments, KYC, security, disputes and merchants.",
};

interface FaqItem {
  q: string;
  a: React.ReactNode;
}

interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

const PLATFORM_FEE_PERCENT = (PLATFORM_FEE_BPS / 100).toFixed(2);

const CATEGORIES: FaqCategory[] = [
  {
    id: "buying",
    title: "Buying RMB",
    items: [
      {
        q: "How do I buy RMB?",
        a: (
          <>
            Browse offers on the{" "}
            <Link href="/buy" className="font-semibold text-brand-600 dark:text-brand-300">
              Buy RMB
            </Link>{" "}
            marketplace, pick a seller, and open a trade at their listed rate — or negotiate a
            better one in the trade&apos;s chat first. Prefer not to compare offers
            yourself?{" "}
            <Link href="/quick-trade" className="font-semibold text-brand-600 dark:text-brand-300">
              Quick Trade
            </Link>{" "}
            finds the best-rate, fastest and top-rated match for your amount automatically.
          </>
        ),
      },
      {
        q: "Is there a minimum or maximum order size?",
        a: "Each seller sets their own minimum and maximum order for their offer — both are shown on the listing before you open a trade, so there's no surprise once you're in.",
      },
    ],
  },
  {
    id: "selling",
    title: "Selling RMB",
    items: [
      {
        q: "How do I list RMB for sale?",
        a: (
          <>
            Open{" "}
            <Link href="/sell/create" className="font-semibold text-brand-600 dark:text-brand-300">
              Create a Sell Offer
            </Link>
            , set your rate, the amount available, your order limits, and which payment method
            you accept (Alipay or WeChat). Publish it and buyers can find and open trades
            against it.
          </>
        ),
      },
      {
        q: "When do I actually get paid?",
        a: "Once you confirm the buyer's RMB has genuinely landed in your Alipay or WeChat account, NGN settlement to your verified bank account begins — never before that confirmation.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    items: [
      {
        q: "What payment methods are supported?",
        a: "Alipay and WeChat Pay for the RMB side of a trade. NGN always settles to a verified Nigerian bank account — never to an unverified third-party account.",
      },
      {
        q: "What fees does ScarExchange charge?",
        a: `A ${PLATFORM_FEE_PERCENT}% platform fee on the trade's NGN value. It's itemised in full before you ever confirm a trade — no hidden charges.`,
      },
    ],
  },
  {
    id: "kyc",
    title: "KYC & Verification",
    items: [
      {
        q: "What are the verification levels?",
        a: "Level 0 Unverified, Level 1 Basic (name, email, phone), Level 2 Identity Verified (government ID, a selfie/liveness check and date of birth), and Level 3 Enhanced (address and source-of-funds information). Each level raises your daily and monthly trading limits.",
      },
      {
        q: "Why do you need my ID and a selfie?",
        a: "To verify your identity, prevent fraud, and comply with financial regulations — the same reason every regulated exchange asks for it.",
      },
    ],
  },
  {
    id: "security",
    title: "Account Security",
    items: [
      {
        q: "What extra protection can I turn on?",
        a: (
          <>
            Two-factor authentication, from{" "}
            <Link href="/security" className="font-semibold text-brand-600 dark:text-brand-300">
              Security settings
            </Link>
            . Separately, changing your password, phone number, bank account or payment method,
            and any large transaction, always requires re-authentication regardless of your 2FA
            setting.
          </>
        ),
      },
      {
        q: "How do I know a message is really from ScarExchange support?",
        a: "Genuine support will never ask for your password or OTP, and will never ask you to pay or receive funds outside an active trade's chat and payment details.",
      },
    ],
  },
  {
    id: "disputes",
    title: "Disputes",
    items: [
      {
        q: "When should I raise a dispute?",
        a: (
          <>
            If payment wasn&apos;t received, the seller hasn&apos;t confirmed, you believe the buyer is
            falsely claiming payment, the wrong amount or account was used, you suspect fraud,
            or anything else about the trade looks wrong. Open it from{" "}
            <Link href="/disputes" className="font-semibold text-brand-600 dark:text-brand-300">
              Disputes
            </Link>{" "}
            on the trade in question.
          </>
        ),
      },
      {
        q: "What happens after I raise one?",
        a: "Settlement on that trade pauses immediately. A compliance officer reviews the evidence and chat from both sides and resolves it in favour of the buyer or seller — every step is logged.",
      },
    ],
  },
  {
    id: "merchants",
    title: "Merchant Accounts",
    items: [
      {
        q: "How do I become a Verified Merchant?",
        a: "Apply from your profile once you're an established trader. Merchant status requires enhanced verification and a compliance review beyond standard KYC.",
      },
      {
        q: "What does merchant status get me?",
        a: "Higher trading limits, a Verified Merchant badge on your offers, better placement in the marketplace, and lower fees on approved pricing tiers.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-[820px] px-4 py-14 sm:px-6">
      <div className="text-center">
        <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-brand-600 dark:text-brand-300">
          FAQ
        </span>
        <h1 className="mt-2 text-[34px] font-bold tracking-[-0.02em] text-neutral-900 sm:text-[40px] dark:text-white">
          Frequently asked questions
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          Can&apos;t find your answer here? The reference rate right now is{" "}
          <span className="tabular font-semibold text-neutral-900 dark:text-white">
            ¥1 = {formatRate(marketReferenceRate)}
          </span>{" "}
          — or reach{" "}
          <Link href="/support" className="font-semibold text-brand-600 dark:text-brand-300">
            Contact Support
          </Link>
          .
        </p>
      </div>

      <div className="mt-12 space-y-10">
        {CATEGORIES.map((category) => (
          <section key={category.id}>
            <h2 className="text-[18px] font-bold text-neutral-900 dark:text-white">
              {category.title}
            </h2>
            <Accordion className="mt-3 rounded-2xl border border-hairline bg-card px-5 shadow-card">
              {category.items.map((item, index) => (
                <AccordionItem key={item.q} value={`${category.id}-${index}`}>
                  <AccordionTrigger className="text-[14px] font-semibold text-neutral-900 dark:text-white">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[13.5px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
    </div>
  );
}
