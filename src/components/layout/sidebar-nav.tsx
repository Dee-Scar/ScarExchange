"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive, type NavSection } from "@/config/navigation";
import { cn } from "@/lib/utils";

const badgeTones = {
  brand: "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200",
  danger: "bg-danger-50 text-danger-700 dark:bg-danger-700/30 dark:text-danger-200",
  warning: "bg-warning-50 text-warning-700 dark:bg-warning-700/30 dark:text-warning-200",
  success: "bg-success-50 text-success-700 dark:bg-success-900/40 dark:text-success-200",
} as const;

/**
 * The grouped sidebar navigation shared by the user app and the admin console.
 * Grouping is what keeps a 19-item admin menu scannable.
 */
export function SidebarNav({
  sections,
  onNavigate,
  className,
}: {
  sections: NavSection[];
  /** Close the mobile drawer after a tap. */
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav className={cn("px-3 pb-6", className)}>
      {sections.map((section, index) => (
        <div key={section.label ?? `group-${index}`}>
          {section.label && (
            <p className="nav-section-label">{section.label}</p>
          )}
          <ul className={cn("space-y-0.5", !section.label && "pt-2")}>
            {section.items.map((item) => {
              const active = isNavActive(item, pathname);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-neutral-50 hover:text-neutral-900 dark:hover:bg-neutral-800/60 dark:hover:text-white",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-[18px] shrink-0 transition-colors",
                        active
                          ? "text-brand-600 dark:text-brand-300"
                          : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300",
                      )}
                      strokeWidth={1.9}
                    />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge != null && (
                      <span
                        className={cn(
                          "tabular grid h-5 min-w-5 shrink-0 place-items-center rounded-full px-1.5 text-[11px] font-semibold",
                          badgeTones[item.badgeTone ?? "brand"],
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
