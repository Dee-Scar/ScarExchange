import {
  AlertTriangle,
  ArrowLeftRight,
  Ban,
  BarChart3,
  Bell,
  Building2,
  CircleDollarSign,
  ClipboardList,
  Clock,
  Coins,
  CreditCard,
  FileText,
  Gauge,
  Home,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  Percent,
  Receipt,
  ScrollText,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Store,
  Tags,
  User,
  UserCog,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Numeric badge, or a short word like "New". */
  badge?: number | string;
  badgeTone?: "brand" | "danger" | "warning" | "success";
  /** Match child routes too (e.g. /trades/SCX-1 highlights /trades). */
  matchPrefix?: boolean;
}

export interface NavSection {
  /** Uppercase micro-label. Omit for the first, unlabelled group. */
  label?: string;
  items: NavItem[];
}

// ---------------------------------------------------------------------------
// User app
// ---------------------------------------------------------------------------

export const userNav: NavSection[] = [
  {
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Marketplace", href: "/marketplace", icon: Store, matchPrefix: true },
      { label: "Buy RMB", href: "/buy", icon: ShoppingBag, matchPrefix: true },
      { label: "Sell RMB", href: "/sell", icon: Coins, matchPrefix: true },
      { label: "Create Offer", href: "/sell/create", icon: Tags },
      { label: "Quick Trade", href: "/quick-trade", icon: Zap },
    ],
  },
  {
    label: "Trades",
    items: [
      { label: "Active Trades", href: "/trades/active", icon: ArrowLeftRight, badge: 2, badgeTone: "brand" },
      { label: "Orders", href: "/orders", icon: ClipboardList, matchPrefix: true },
      { label: "History", href: "/history", icon: Clock, matchPrefix: true },
      { label: "Disputes", href: "/disputes", icon: AlertTriangle, matchPrefix: true },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Wallet", href: "/wallet", icon: Wallet },
      { label: "Payment Methods", href: "/payment-methods", icon: CreditCard },
      { label: "Bank Accounts", href: "/bank-accounts", icon: Building2 },
      { label: "Profile", href: "/profile", icon: User, matchPrefix: true },
      { label: "Security", href: "/security", icon: Shield },
      { label: "Notifications", href: "/notifications", icon: Bell, badge: 3, badgeTone: "brand" },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

/** Top navigation inside the signed-in app. */
export const userTopNav = [
  { label: "Buy RMB", href: "/buy" },
  { label: "Sell RMB", href: "/sell" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Merchants", href: "/merchants" },
  { label: "Rates", href: "/rates" },
];

export const helpMenu = [
  { label: "Help Centre", href: "/help", icon: LifeBuoy },
  { label: "How it works", href: "/how-it-works", icon: ListChecks },
  { label: "Security", href: "/security-overview", icon: ShieldCheck },
  { label: "Contact Support", href: "/support", icon: LifeBuoy },
];

/** Mobile tab bar (PRD §48). */
export const mobileTabs: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Markets", href: "/marketplace", icon: BarChart3, matchPrefix: true },
  { label: "Trade", href: "/quick-trade", icon: ArrowLeftRight },
  { label: "Orders", href: "/orders", icon: ClipboardList, matchPrefix: true },
  { label: "Profile", href: "/profile", icon: User, matchPrefix: true },
];

// ---------------------------------------------------------------------------
// Public marketing site
// ---------------------------------------------------------------------------

export const publicNav = [
  { label: "Buy RMB", href: "/buy" },
  { label: "Sell RMB", href: "/sell" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Merchants", href: "/merchants", badge: "New" },
  { label: "Rates", href: "/rates" },
];

export const footerNav = [
  {
    title: "Product",
    links: [
      { label: "Buy RMB", href: "/buy" },
      { label: "Sell RMB", href: "/sell" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Quick Trade", href: "/quick-trade" },
      { label: "Rates", href: "/rates" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Security", href: "/security-overview" },
      { label: "Verified Merchants", href: "/merchants" },
      { label: "Dispute Resolution", href: "/help/disputes" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Centre", href: "/help" },
      { label: "Contact Support", href: "/support" },
      { label: "FAQ", href: "/faq" },
      { label: "Become a Merchant", href: "/merchants/apply" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "AML Policy", href: "/legal/aml" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Admin console (PRD §34)
// ---------------------------------------------------------------------------

export const adminNav: NavSection[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Users", href: "/admin/users", icon: Users, matchPrefix: true },
      { label: "Traders & Merchants", href: "/admin/merchants", icon: Store, matchPrefix: true },
      { label: "KYC Verification", href: "/admin/kyc", icon: ShieldCheck, matchPrefix: true },
      { label: "Offers Management", href: "/admin/offers", icon: Tags, matchPrefix: true },
      { label: "Trades", href: "/admin/trades", icon: ArrowLeftRight, matchPrefix: true },
      { label: "Transactions", href: "/admin/transactions", icon: Receipt, matchPrefix: true },
      { label: "Disputes", href: "/admin/disputes", icon: AlertTriangle, badge: 5, badgeTone: "danger", matchPrefix: true },
    ],
  },
  {
    label: "Financial",
    items: [
      { label: "Settlements", href: "/admin/settlements", icon: CircleDollarSign, matchPrefix: true },
      { label: "Fees & Charges", href: "/admin/fees", icon: Percent },
      { label: "Rates & Limits", href: "/admin/limits", icon: SlidersHorizontal },
      { label: "Reports", href: "/admin/reports", icon: FileText, matchPrefix: true },
    ],
  },
  {
    label: "Risk & Compliance",
    items: [
      { label: "Risk Alerts", href: "/admin/risk", icon: Gauge, badge: 12, badgeTone: "warning", matchPrefix: true },
      { label: "Suspicious Activity", href: "/admin/suspicious", icon: AlertTriangle },
      { label: "Audit Logs", href: "/admin/audit", icon: ScrollText },
      { label: "Restrictions", href: "/admin/restrictions", icon: Ban },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
      { label: "System Settings", href: "/admin/settings", icon: Settings },
      { label: "Admin Management", href: "/admin/team", icon: UserCog, matchPrefix: true },
    ],
  },
];

/** Decide whether a nav item should render as active for the current path. */
export function isNavActive(item: NavItem, pathname: string): boolean {
  if (pathname === item.href) return true;
  if (!item.matchPrefix) return false;
  return pathname.startsWith(`${item.href}/`);
}
