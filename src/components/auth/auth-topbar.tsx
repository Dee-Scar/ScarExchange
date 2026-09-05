import Link from "next/link";
import { ChevronDown, Globe, Headphones } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Language switcher + support link, shown above the form on both auth screens. */
export function AuthTopBar() {
  return (
    <div className="flex items-center justify-end gap-5 px-4 py-5 sm:px-8">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white">
          <Globe className="size-4" strokeWidth={1.9} />
          English
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
        href="/support"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-300"
      >
        <Headphones className="size-4" strokeWidth={1.9} />
        Need help?
      </Link>
    </div>
  );
}
