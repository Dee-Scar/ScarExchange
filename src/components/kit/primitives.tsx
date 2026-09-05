import Link from "next/link";
import { ChevronRight, Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Page title, supporting line, and right-aligned actions. */
export function PageHeader({
  title,
  description,
  actions,
  emoji,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  emoji?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <h1 className="flex items-center gap-2 text-[26px] font-bold leading-tight tracking-[-0.02em] text-neutral-900 dark:text-white">
          {title}
          {emoji && <span aria-hidden="true">{emoji}</span>}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Breadcrumb trail. The last item renders as plain text. */
export function Breadcrumbs({
  items,
  className,
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-[13px]", className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-neutral-500 transition-colors hover:text-brand-600 dark:text-neutral-400"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "font-medium text-neutral-900 dark:text-white"
                    : "text-neutral-500 dark:text-neutral-400"
                }
              >
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="size-3.5 text-neutral-300" />}
          </span>
        );
      })}
    </nav>
  );
}

/** The standard white panel: header row, optional action, body. */
export function Panel({
  title,
  action,
  children,
  className,
  bodyClassName,
  headerClassName,
  padded = true,
}: {
  title?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-hairline bg-card shadow-card",
        className,
      )}
    >
      {(title || action) && (
        <header
          className={cn(
            "flex items-center justify-between gap-3 px-5 pb-3 pt-4",
            headerClassName,
          )}
        >
          {typeof title === "string" ? (
            <h2 className="text-[15px] font-semibold text-neutral-900 dark:text-white">
              {title}
            </h2>
          ) : (
            title
          )}
          {action}
        </header>
      )}
      <div className={cn(padded ? "px-5 pb-5" : undefined, bodyClassName)}>{children}</div>
    </section>
  );
}

/** "View All →" link used in panel headers. */
export function PanelLink({
  href,
  children = "View All",
  className,
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 text-[13px] font-semibold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** A labelled value row — the workhorse of every detail panel. */
export function DetailRow({
  label,
  value,
  className,
  valueClassName,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 py-2.5", className)}>
      <dt className="shrink-0 text-[13px] text-neutral-500 dark:text-neutral-400">{label}</dt>
      <dd
        className={cn(
          "text-right text-[13px] font-medium text-neutral-900 dark:text-white",
          valueClassName,
        )}
      >
        {value}
      </dd>
    </div>
  );
}

export type BannerTone = "info" | "success" | "warning" | "danger" | "brand";

const bannerStyles: Record<BannerTone, string> = {
  info: "bg-neutral-50 text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-300",
  brand: "bg-brand-50 text-brand-800 dark:bg-brand-900/25 dark:text-brand-200",
  success: "bg-success-50 text-success-700 dark:bg-success-900/25 dark:text-success-200",
  warning: "bg-warning-50 text-warning-700 dark:bg-warning-700/20 dark:text-warning-200",
  danger: "bg-danger-50 text-danger-700 dark:bg-danger-700/20 dark:text-danger-200",
};

const bannerIconStyles: Record<BannerTone, string> = {
  info: "text-neutral-400",
  brand: "text-brand-600 dark:text-brand-300",
  success: "text-success-600 dark:text-success-300",
  warning: "text-warning-600 dark:text-warning-300",
  danger: "text-danger-600 dark:text-danger-300",
};

/** Inline advisory strip — never a modal for something the user can read past. */
export function Callout({
  tone = "info",
  icon: Icon = Info,
  title,
  children,
  action,
  className,
}: {
  tone?: BannerTone;
  icon?: LucideIcon | null;
  title?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl px-3.5 py-3 text-[13px]",
        bannerStyles[tone],
        className,
      )}
    >
      {Icon && (
        <Icon
          className={cn("mt-0.5 size-4 shrink-0", bannerIconStyles[tone])}
          strokeWidth={2.2}
        />
      )}
      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && "mt-0.5", "leading-relaxed")}>{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-14 text-center", className)}>
      <span className="grid size-12 place-items-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
        <Icon className="size-5 text-neutral-400" strokeWidth={1.8} />
      </span>
      <p className="mt-4 text-[15px] font-semibold text-neutral-900 dark:text-white">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-[13px] text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Uppercase micro-label above a group of fields. */
export function FieldGroupLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.06em] text-neutral-400",
        className,
      )}
    >
      {children}
    </p>
  );
}
