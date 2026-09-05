"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  Shield,
  User as UserIcon,
  Wallet,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/logo";
import { MerchantCta } from "@/components/layout/merchant-cta";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ThemeToggle } from "@/components/layout/theme";
import { MenuLink } from "@/components/kit/menu-link";
import { TraderAvatar } from "@/components/kit/trader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { helpMenu, mobileTabs, userNav, userTopNav, isNavActive } from "@/config/navigation";
import { currentUser } from "@/lib/mock/users";
import { unreadNotificationCount } from "@/lib/mock/notifications";
import { cn } from "@/lib/utils";

/**
 * The signed-in application frame.
 *
 * The designs carry both a top nav (market actions) and a left sidebar
 * (account surface). Keeping both means trading actions stay one click away
 * from anywhere in the account area.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-52 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="flex h-16 shrink-0 items-center px-5">
          <Link href="/dashboard" aria-label="ScarExchange home">
            <Logo height={40} />
          </Link>
        </div>
        <div className="scrollbar-slim flex-1 overflow-y-auto">
          <SidebarNav sections={userNav} />
        </div>
        <div className="shrink-0 p-3">
          <MerchantCta />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-52">
        <AppHeader onOpenMobileNav={() => setMobileOpen(true)} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main className="min-w-0 flex-1 px-4 pb-24 pt-5 sm:px-6 lg:pb-10 lg:pt-6">
          {children}
        </main>
      </div>

      <MobileTabBar />
    </div>
  );
}

function AppHeader({
  onOpenMobileNav,
  mobileOpen,
  setMobileOpen,
}: {
  onOpenMobileNav: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-hairline bg-card/95 px-4 backdrop-blur sm:px-6">
      {/* Mobile: drawer trigger + logo */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger
          onClick={onOpenMobileNav}
          className="grid size-9 shrink-0 place-items-center rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-5" strokeWidth={1.9} />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-16 items-center px-5">
            <Logo height={40} />
          </div>
          <div className="scrollbar-slim h-[calc(100vh-9rem)] overflow-y-auto">
            <SidebarNav sections={userNav} onNavigate={() => setMobileOpen(false)} />
          </div>
          <div className="p-3">
            <MerchantCta />
          </div>
        </SheetContent>
      </Sheet>

      <Link href="/dashboard" className="lg:hidden" aria-label="ScarExchange home">
        <LogoMark height={28} />
      </Link>

      {/* Desktop top nav */}
      <nav className="hidden items-center gap-1 lg:flex">
        {userTopNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
                active
                  ? "text-brand-600 dark:text-brand-300"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white",
              )}
            >
              {item.label}
              {active && (
                <span className="absolute inset-x-3 -bottom-[21px] h-0.5 rounded-full bg-brand-600" />
              )}
            </Link>
          );
        })}

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[13.5px] font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white">
            Help
            <ChevronDown className="size-3.5" strokeWidth={2.2} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {helpMenu.map((item) => (
              <MenuLink key={item.href} href={item.href} icon={item.icon}>
                {item.label}
              </MenuLink>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <ThemeToggle />

        <Link
          href="/notifications"
          aria-label={`Notifications, ${unreadNotificationCount} unread`}
          className="relative grid size-9 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
        >
          <Bell className="size-[18px]" strokeWidth={1.9} />
          {unreadNotificationCount > 0 && (
            <span className="tabular absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-danger-500 text-[10px] font-bold text-white ring-2 ring-card">
              {unreadNotificationCount}
            </span>
          )}
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <TraderAvatar
              trader={{
                initials: currentUser.initials,
                avatarColor: "#2f3d8f",
                username: currentUser.username,
              }}
              size="md"
            />
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-[13px] font-semibold text-neutral-900 dark:text-white">
                {currentUser.displayName}
              </span>
              <span className="block text-[11px] font-medium text-success-600 dark:text-success-300">
                Verified
              </span>
            </span>
            <ChevronDown className="hidden size-4 text-neutral-400 sm:block" strokeWidth={2} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel className="font-normal">
              <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                {currentUser.fullName}
              </p>
              <p className="text-xs text-neutral-500">@{currentUser.username}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <MenuLink href="/profile" icon={UserIcon}>
              Profile
            </MenuLink>
            <MenuLink href="/wallet" icon={Wallet}>
              Wallet
            </MenuLink>
            <MenuLink href="/security" icon={Shield}>
              Security
            </MenuLink>
            <MenuLink href="/settings" icon={Settings}>
              Settings
            </MenuLink>
            <DropdownMenuSeparator />
            <MenuLink href="/" icon={LogOut} danger>
              Log out
            </MenuLink>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

/** PRD §48 — mobile-first bottom navigation. */
function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-hairline bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      {mobileTabs.map((tab) => {
        const active = isNavActive(tab, pathname);
        const isCenter = tab.label === "Trade";

        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className="flex flex-1 flex-col items-center gap-1 py-2.5"
          >
            <span
              className={cn(
                "grid place-items-center rounded-full transition-colors",
                isCenter
                  ? "size-9 bg-brand-600 text-white"
                  : active
                    ? "size-7 text-brand-600 dark:text-brand-300"
                    : "size-7 text-neutral-400",
              )}
            >
              <tab.icon className="size-[18px]" strokeWidth={2} />
            </span>
            <span
              className={cn(
                "text-[10px] font-medium",
                active
                  ? "text-brand-600 dark:text-brand-300"
                  : "text-neutral-500 dark:text-neutral-400",
              )}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
