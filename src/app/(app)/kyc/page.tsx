import type { Metadata } from "next";
import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  ChevronRight,
  Circle,
  Headphones,
  IdCard,
  Image as ImageIcon,
  Info,
  Lock,
  ScanFace,
  ShieldCheck,
  Smartphone,
  Store,
  Sun,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { ProgressRing } from "@/components/charts/progress-ring";
import { ButtonLink } from "@/components/kit/button-link";
import { Breadcrumbs, Callout, Panel } from "@/components/kit/primitives";
import { Stepper, type StepItem } from "@/components/kit/stepper";
import { Button } from "@/components/ui/button";
import { getKycStatus } from "@/lib/api";
import type { KycStepStatus } from "@/lib/types";

export const metadata: Metadata = { title: "KYC Verification" };

const STEP_ICONS = {
  basic_information: User,
  identity_document: IdCard,
  selfie_verification: ScanFace,
  review_approval: ShieldCheck,
} as const;

const STATUS_CAPTION: Record<KycStepStatus, string> = {
  completed: "Completed",
  in_progress: "In Progress",
  pending: "Pending",
  rejected: "Rejected",
};

export default async function KycPage() {
  const kyc = await getKycStatus();

  const steps: StepItem[] = kyc.steps.map((step) => ({
    id: step.id,
    label: step.label,
    caption: STATUS_CAPTION[step.status],
    state:
      step.status === "completed"
        ? "completed"
        : step.status === "in_progress"
          ? "current"
          : step.status === "rejected"
            ? "rejected"
            : "pending",
    icon: STEP_ICONS[step.id],
  }));

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <Breadcrumbs
        items={[
          { label: "Profile", href: "/profile" },
          { label: "KYC Verification" },
        ]}
      />

      <div>
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
          KYC Verification
        </h1>
        <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
          Complete identity verification to unlock higher limits and all platform features.
        </p>
      </div>

      <div className="rounded-2xl border border-hairline bg-card px-6 py-7 shadow-card">
        <Stepper steps={steps} numbered />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <section className="rounded-2xl border border-hairline bg-card p-5 shadow-card">
            <h2 className="text-[17px] font-bold text-neutral-900 dark:text-white">
              Selfie Verification
            </h2>
            <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">
              Take a clear selfie to verify your identity. Make sure your face is well lit
              and clearly visible.
            </p>

            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <div>
                <SelfieFrame />
                <Callout tone="brand" icon={Info} className="mt-3">
                  Position your face in the oval and look directly at the camera.
                </Callout>
              </div>

              <div className="flex flex-col">
                <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                  Requirements
                </p>
                <ul className="mt-2.5 space-y-2">
                  {[
                    "Use a well-lit area",
                    "Remove hat, glasses or face coverings",
                    "Ensure your full face is visible",
                    "Do not edit or filter your photo",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-success-500"
                        strokeWidth={2.2}
                      />
                      <span className="text-[12.5px] text-neutral-600 dark:text-neutral-300">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mt-5 text-[13px] font-semibold text-neutral-900 dark:text-white">
                  Tips
                </p>
                <ul className="mt-2.5 space-y-2">
                  {[
                    { icon: Sun, label: "Face a light source" },
                    { icon: ImageIcon, label: "Use a plain background" },
                    { icon: Smartphone, label: "Hold your phone at eye level" },
                  ].map((tip) => (
                    <li key={tip.label} className="flex items-start gap-2">
                      <tip.icon
                        className="mt-0.5 size-4 shrink-0 text-neutral-400"
                        strokeWidth={1.9}
                      />
                      <span className="text-[12.5px] text-neutral-600 dark:text-neutral-300">
                        {tip.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <Button className="h-12 w-full gap-2 text-[14px]">
                    <Camera className="size-4" strokeWidth={2.1} />
                    Take Selfie
                  </Button>
                  <Link
                    href="/dashboard"
                    className="mt-3 block text-center text-[13px] font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
                  >
                    I&apos;ll do this later
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <div className="rounded-2xl border border-hairline bg-card p-4 shadow-card">
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 dark:bg-brand-900/30">
                <ShieldCheck
                  className="size-4 text-brand-600 dark:text-brand-300"
                  strokeWidth={2.1}
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                  Why we need this information?
                </p>
                <p className="mt-0.5 text-[12.5px] text-neutral-500 dark:text-neutral-400">
                  We collect this information to verify your identity, prevent fraud, and
                  comply with financial regulations.
                </p>
              </div>
              <Link
                href="/help/kyc"
                className="inline-flex shrink-0 items-center gap-1 text-[12.5px] font-semibold text-brand-600 dark:text-brand-300"
              >
                Learn more about KYC
                <ChevronRight className="size-3.5" strokeWidth={2.4} />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-hairline bg-success-50/60 p-4 dark:bg-success-900/15">
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-success-100 dark:bg-success-900/40">
                <Headphones
                  className="size-4 text-success-700 dark:text-success-300"
                  strokeWidth={2.1}
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                  Need help?
                </p>
                <p className="mt-0.5 text-[12.5px] text-neutral-600 dark:text-neutral-300">
                  If you&apos;re having trouble completing verification, our support team is
                  here to help.
                </p>
              </div>
              <ButtonLink href="/support" variant="outline" size="sm" className="gap-1.5">
                <Headphones className="size-3.5" strokeWidth={2.1} />
                Contact Support
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <aside className="min-w-0 space-y-5">
          <Panel title="Current Verification Level">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-success-50 dark:bg-success-900/30">
                <ShieldCheck
                  className="size-5 text-success-600 dark:text-success-300"
                  strokeWidth={2}
                />
              </span>
              <div>
                <p className="text-[15px] font-bold text-neutral-900 dark:text-white">
                  Level {kyc.level}
                </p>
                <p className="text-[13px] text-neutral-600 dark:text-neutral-300">
                  {kyc.levelLabel}
                </p>
              </div>
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              You can increase your limits by completing Level {kyc.level + 1} verification.
            </p>
            <ButtonLink
              href="/kyc/benefits"
              variant="outline"
              className="mt-4 w-full"
            >
              View Benefits
            </ButtonLink>
          </Panel>

          <Panel title="Your Verification Progress">
            <div className="flex justify-center py-2">
              <ProgressRing value={kyc.progressPercent} label="Completed" />
            </div>

            <ul className="mt-4 space-y-2.5">
              {kyc.steps.map((step) => (
                <li key={step.id} className="flex items-center gap-2.5">
                  {step.status === "completed" ? (
                    <CheckCircle2
                      className="size-4 shrink-0 text-success-500"
                      strokeWidth={2.2}
                    />
                  ) : step.status === "in_progress" ? (
                    <Circle className="size-4 shrink-0 fill-brand-600 text-brand-600" />
                  ) : (
                    <Circle className="size-4 shrink-0 text-neutral-300" strokeWidth={2} />
                  )}
                  <span className="min-w-0 flex-1 truncate text-[12.5px] text-neutral-700 dark:text-neutral-200">
                    {step.label}
                  </span>
                  <span
                    className={
                      step.status === "completed"
                        ? "shrink-0 text-[11.5px] font-medium text-success-600 dark:text-success-300"
                        : step.status === "in_progress"
                          ? "shrink-0 text-[11.5px] font-medium text-brand-600 dark:text-brand-300"
                          : "shrink-0 text-[11.5px] text-neutral-400"
                    }
                  >
                    {STATUS_CAPTION[step.status]}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Verification Benefits">
            <ul className="space-y-3.5">
              {[
                {
                  icon: TrendingUp,
                  tone: "bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-300",
                  title: "Higher Trading Limits",
                  body: "Increase your daily and monthly limits",
                },
                {
                  icon: Zap,
                  tone: "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300",
                  title: "Faster Transactions",
                  body: "Enjoy faster payment processing",
                },
                {
                  icon: Lock,
                  tone: "bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-300",
                  title: "More Security",
                  body: "Protect your account and trades",
                },
                {
                  icon: Store,
                  tone: "bg-[#f4f3ff] text-[#7a5af8] dark:bg-[#5925dc]/20",
                  title: "Merchant Access",
                  body: "Qualify to become a verified merchant",
                },
              ].map((benefit) => (
                <li key={benefit.title} className="flex items-start gap-2.5">
                  <span
                    className={`grid size-8 shrink-0 place-items-center rounded-lg ${benefit.tone}`}
                  >
                    <benefit.icon className="size-4" strokeWidth={2.1} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-neutral-900 dark:text-white">
                      {benefit.title}
                    </p>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {benefit.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

/**
 * The capture target. Corner brackets and an oval guide communicate framing
 * before the camera is ever opened.
 */
function SelfieFrame() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-brand-50 to-brand-100/60 dark:from-brand-900/25 dark:to-brand-900/10">
      {/* Corner brackets */}
      {[
        "left-4 top-4 border-l-2 border-t-2 rounded-tl-lg",
        "right-4 top-4 border-r-2 border-t-2 rounded-tr-lg",
        "left-4 bottom-4 border-b-2 border-l-2 rounded-bl-lg",
        "right-4 bottom-4 border-b-2 border-r-2 rounded-br-lg",
      ].map((position) => (
        <span
          key={position}
          aria-hidden="true"
          className={`absolute size-8 border-brand-400/70 ${position}`}
        />
      ))}

      <div className="absolute inset-0 grid place-items-center">
        <div className="relative grid h-[74%] w-[46%] place-items-center overflow-hidden rounded-[50%] border-2 border-dashed border-brand-400/70">
          <AvatarIllustration className="absolute inset-0 size-full" />
          <ScanFace
            className="pointer-events-none absolute -bottom-1 -right-1 size-7 rounded-full bg-white p-1 text-brand-500 shadow-sm dark:bg-neutral-900 dark:text-brand-300"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>
      </div>

      <span className="sr-only">
        Selfie capture area. Position your face inside the oval guide.
      </span>
    </div>
  );
}

/** A simple flat placeholder avatar — stands in for the live camera preview. */
function AvatarIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" className={className} aria-hidden="true">
      <rect width="100" height="130" fill="#EAF1FE" />
      {/* shoulders / shirt */}
      <path d="M0 130v-14c0-16 22-27 50-27s50 11 50 27v14H0Z" fill="#1652F0" />
      {/* neck */}
      <rect x="42" y="78" width="16" height="18" rx="6" fill="#C58B5F" />
      {/* head */}
      <ellipse cx="50" cy="56" rx="24" ry="27" fill="#C58B5F" />
      {/* hair */}
      <path
        d="M25 52c-1-19 11-32 25-32s26 13 25 32c-3-6-9-9-14-6-3-9-9-11-11-11s-8 2-11 11c-5-3-11 0-14 6Z"
        fill="#241A12"
      />
    </svg>
  );
}
