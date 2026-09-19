"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/layout/theme";
import { MenuLink } from "@/components/kit/menu-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { footerNav, helpMenu, publicNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

/** Marketing and pre-login frame: top nav, no sidebar, full footer. */
export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}

function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:px-6">
        <Link href="/" aria-label="ScarExchange home">
          <Logo height={42} className="translate-y-[6px]" />
        </Link>

        <nav className="ml-12 hidden items-center gap-1 lg:flex">
          {publicNav.map((item) => {
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
                {"badge" in item && item.badge && (
                  <span className="ml-1.5 rounded-full bg-success-50 px-1.5 py-0.5 text-[10px] font-bold text-success-700 dark:bg-success-900/40 dark:text-success-200">
                    {item.badge}
                  </span>
                )}
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

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle className="hidden sm:grid" />

          <DropdownMenu>
            <DropdownMenuTrigger className="hidden items-center gap-1 rounded-lg px-2 py-2 text-[13px] font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 sm:inline-flex">
              <Globe className="size-4" strokeWidth={1.9} />
              EN
              <ChevronDown className="size-3.5" strokeWidth={2.2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>中文</DropdownMenuItem>
              <DropdownMenuItem>Hausa</DropdownMenuItem>
              <DropdownMenuItem>Yorùbá</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/login"
            className="hidden rounded-lg px-3 py-2 text-[13.5px] font-semibold text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-200 sm:block"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-brand-600 px-4 py-2 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Sign up
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid size-9 place-items-center rounded-lg text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-hairline bg-card px-4 py-3 lg:hidden">
          <ul className="space-y-1">
            {[...publicNav, { label: "Help Centre", href: "/help" }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-lg border border-hairline px-3 py-2.5 text-center text-sm font-semibold text-neutral-800 dark:text-neutral-100"
              >
                Log in
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="border-t border-hairline bg-card">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              A structured P2P marketplace for RMB ↔ NGN exchange, built on verified
              traders, escrowed trades and transparent rates.
            </p>
          </div>

          {footerNav.map((group) => (
            <div key={group.title}>
              <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                {group.title}
              </p>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-neutral-500 transition-colors hover:text-brand-600 dark:text-neutral-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* PRD's opening constraint, stated where users and stakeholders see it. */}
        <div className="mt-10 rounded-xl bg-surface-subtle p-4 text-[12px] leading-relaxed text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
          <strong className="font-semibold text-neutral-700 dark:text-neutral-200">
            Regulatory notice.
          </strong>{" "}
          ScarExchange provides marketplace, verification and dispute infrastructure.
          Custody and movement of customer funds are performed by appropriately
          authorised partners. This product is a pre-launch preview and is not yet an
          operating money-transmission service.
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-hairline pt-6 sm:flex-row">
          <p className="text-[12px] text-neutral-400">
            © 2026 ScarExchange. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/legal/terms" className="text-[12px] text-neutral-400 hover:text-brand-600">
              Terms
            </Link>
            <Link href="/legal/privacy" className="text-[12px] text-neutral-400 hover:text-brand-600">
              Privacy
            </Link>
            <LogoMark height={20} />
          </div>
        </div>
      </div>
    </footer>
  );
}
