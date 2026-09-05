"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeftRight,
  Bell,
  BellOff,
  CheckCheck,
  Coins,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/kit/primitives";
import { formatRelative } from "@/lib/date";
import type { AppNotification, NotificationCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_META: Record<NotificationCategory, { icon: LucideIcon; tone: string; label: string }> = {
  trade: { icon: ArrowLeftRight, tone: "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300", label: "Trade" },
  payment: { icon: Coins, tone: "bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-300", label: "Payment" },
  security: { icon: ShieldAlert, tone: "bg-danger-50 text-danger-600 dark:bg-danger-700/20 dark:text-danger-300", label: "Security" },
  kyc: { icon: ShieldCheck, tone: "bg-warning-50 text-warning-600 dark:bg-warning-700/20 dark:text-warning-300", label: "KYC" },
  dispute: { icon: AlertTriangle, tone: "bg-[#f4f3ff] text-[#7a5af8] dark:bg-[#5925dc]/20", label: "Dispute" },
  system: { icon: Bell, tone: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300", label: "System" },
};

const TABS: { id: "all" | "unread" | NotificationCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "trade", label: "Trade" },
  { id: "payment", label: "Payment" },
  { id: "security", label: "Security" },
  { id: "kyc", label: "KYC" },
  { id: "dispute", label: "Dispute" },
];

/**
 * In-app notification centre (PRD §27). No backend yet, so read state is
 * local to this view — it does not persist across a reload.
 */
export function NotificationsList({ initial }: { initial: AppNotification[] }) {
  const [items, setItems] = useState(initial);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");

  const unreadCount = items.filter((n) => !n.read).length;

  const rows = useMemo(() => {
    if (tab === "all") return items;
    if (tab === "unread") return items.filter((n) => !n.read);
    return items.filter((n) => n.category === tab);
  }, [items, tab]);

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter notifications">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-lg px-4 py-2 text-[13px] font-medium transition-colors",
                tab === item.id
                  ? "bg-brand-600 text-white"
                  : "bg-card text-neutral-600 ring-1 ring-inset ring-hairline hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white",
              )}
            >
              {item.label}
              {item.id === "unread" && unreadCount > 0 && (
                <span className="tabular ml-1.5 rounded-full bg-danger-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-brand-600 transition-colors hover:text-brand-700 disabled:pointer-events-none disabled:text-neutral-300 dark:text-brand-300 dark:disabled:text-neutral-600"
        >
          <CheckCheck className="size-4" strokeWidth={2.2} />
          Mark all as read
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-hairline bg-card shadow-card">
        {rows.length === 0 ? (
          <EmptyState
            icon={BellOff}
            title="No notifications here"
            description="Nothing matches this filter yet."
          />
        ) : (
          <ul className="divide-y divide-hairline">
            {rows.map((item) => {
              const meta = CATEGORY_META[item.category];
              return (
                <li key={item.id} className={cn(!item.read && "bg-brand-50/40 dark:bg-brand-900/10")}>
                  <Link
                    href={item.href ?? "/notifications"}
                    onClick={() => markRead(item.id)}
                    className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-surface-subtle dark:hover:bg-neutral-800/50"
                  >
                    <span className={cn("mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl", meta.tone)}>
                      <meta.icon className="size-4" strokeWidth={2.1} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            "text-[13.5px] text-neutral-900 dark:text-white",
                            item.read ? "font-medium" : "font-bold",
                          )}
                        >
                          {item.title}
                        </p>
                        {!item.read && (
                          <span className="size-1.5 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />
                        )}
                      </div>
                      <p className="mt-0.5 text-[12.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                        {item.body}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11.5px] text-neutral-400">
                      {formatRelative(item.createdAt)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
