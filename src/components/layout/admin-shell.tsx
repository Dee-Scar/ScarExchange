"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, UserCog } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { ThemeToggle } from "@/components/layout/theme";
import { MenuLink } from "@/components/kit/menu-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { adminNav } from "@/config/navigation";
import { currentAdmin } from "@/lib/mock/admin";
import { adminUnreadCount } from "@/lib/mock/notifications";

/**
 * The admin console frame.
 *
 * Nineteen destinations across four concerns, so the sidebar is grouped and
 * the header carries a single global search rather than per-page filters.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-52 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <AdminBrand />
        <div className="scrollbar-slim flex-1 overflow-y-auto">
          <SidebarNav sections={adminNav} />
        </div>
        <AdminIdentityCard />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-52">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-hairline bg-card/95 px-4 backdrop-blur sm:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="grid size-9 shrink-0 place-items-center rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              aria-label="Toggle navigation"
            >
              <Menu className="size-5" strokeWidth={1.9} />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Admin navigation</SheetTitle>
              <AdminBrand />
              <div className="scrollbar-slim h-[calc(100vh-9rem)] overflow-y-auto">
                <SidebarNav sections={adminNav} onNavigate={() => setMobileOpen(false)} />
              </div>
              <AdminIdentityCard />
            </SheetContent>
          </Sheet>

          <Link href="/admin" className="lg:hidden" aria-label="Admin home">
            <LogoMark height={28} />
          </Link>

          <div className="relative hidden min-w-0 max-w-md flex-1 sm:block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
              strokeWidth={2}
            />
            <input
              type="search"
              placeholder="Search users, trades, transactions, IDs..."
              aria-label="Global search"
              className="h-10 w-full rounded-xl border border-hairline bg-surface-subtle pl-9 pr-3 text-[13.5px] text-neutral-900 outline-none transition-shadow placeholder:text-neutral-400 focus:border-brand-300 focus:shadow-focus dark:bg-neutral-900 dark:text-white"
            />
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link
              href="/admin/notifications"
              aria-label={`Notifications, ${adminUnreadCount} unread`}
              className="relative grid size-9 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              <Bell className="size-[18px]" strokeWidth={1.9} />
              <span className="tabular absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-danger-500 text-[10px] font-bold text-white ring-2 ring-card">
                {adminUnreadCount}
              </span>
            </Link>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <span className="relative">
                  <span className="grid size-9 place-items-center rounded-full bg-brand-800 text-xs font-semibold text-white">
                    {currentAdmin.initials}
                  </span>
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-success-500 ring-2 ring-card" />
                </span>
                <span className="hidden text-left leading-tight sm:block">
                  <span className="block text-[13px] font-semibold text-neutral-900 dark:text-white">
                    {currentAdmin.name}
                  </span>
                  <span className="block text-[11px] text-neutral-500 dark:text-neutral-400">
                    {currentAdmin.roleLabel}
                  </span>
                </span>
                <ChevronDown className="hidden size-4 text-neutral-400 sm:block" strokeWidth={2} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                      {currentAdmin.name}
                    </p>
                    <p className="text-xs text-neutral-500">{currentAdmin.email}</p>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <MenuLink href="/admin/team" icon={UserCog}>
                  Admin Management
                </MenuLink>
                <MenuLink href="/admin/settings" icon={Settings}>
                  System Settings
                </MenuLink>
                <DropdownMenuSeparator />
                <MenuLink href="/" icon={LogOut} danger>
                  Sign out
                </MenuLink>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 pb-10 pt-5 sm:px-6 lg:pt-6">{children}</main>
      </div>
    </div>
  );
}

function AdminBrand() {
  return (
    <div className="flex h-16 shrink-0 items-center gap-2 px-5">
      <Link href="/admin" aria-label="ScarExchange admin home">
        <Logo height={36} />
      </Link>
      <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
        Admin
      </span>
    </div>
  );
}

function AdminIdentityCard() {
  return (
    <div className="shrink-0 border-t border-sidebar-border p-3">
      <div className="flex items-center gap-2.5 rounded-xl bg-surface-subtle p-2.5 dark:bg-neutral-900">
        <span className="relative shrink-0">
          <span className="grid size-9 place-items-center rounded-full bg-brand-800 text-xs font-semibold text-white">
            {currentAdmin.initials}
          </span>
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-success-500 ring-2 ring-surface-subtle dark:ring-neutral-900" />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[13px] font-semibold text-neutral-900 dark:text-white">
            {currentAdmin.name}
          </p>
          <p className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
            {currentAdmin.roleLabel}
          </p>
          <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium text-success-600 dark:text-success-300">
            <span className="size-1.5 rounded-full bg-success-500" />
            Online
          </p>
        </div>
      </div>
    </div>
  );
}
