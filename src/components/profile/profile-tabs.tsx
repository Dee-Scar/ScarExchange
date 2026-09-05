import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview", label: "Overview", href: "/profile" },
  { id: "kyc", label: "Verification (KYC)", href: "/kyc" },
  { id: "security", label: "Security", href: "/security" },
  { id: "preferences", label: "Preferences", href: "/settings" },
  { id: "activity", label: "Activity", href: "/profile/activity" },
] as const;

/**
 * Profile section tabs.
 *
 * These are links rather than client-side panels — each section is a real
 * route with its own data, so it can be deep-linked and refreshed.
 */
export function ProfileTabs({ active }: { active: (typeof TABS)[number]["id"] }) {
  return (
    <nav className="border-b border-hairline" aria-label="Profile sections">
      <ul className="scrollbar-slim -mb-px flex gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <li key={tab.id}>
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-block whitespace-nowrap border-b-2 px-3 pb-2.5 pt-1 text-[13.5px] font-medium transition-colors",
                  isActive
                    ? "border-brand-600 text-brand-600 dark:text-brand-300"
                    : "border-transparent text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
