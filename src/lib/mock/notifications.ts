import { ago } from "../date";
import type { AppNotification } from "../types";

/** In-app notification feed (PRD §27). */
export const notifications: AppNotification[] = [
  {
    id: "ntf_1",
    category: "trade",
    title: "Buyer joined your trade",
    body: "TonyFX opened trade SCX-84930 for ¥10,000 at ₦219.00.",
    href: "/trades/SCX-84930",
    read: false,
    createdAt: ago(14, "min"),
  },
  {
    id: "ntf_2",
    category: "payment",
    title: "Payment awaiting your confirmation",
    body: "TonyFX marked ¥10,000 as paid on SCX-84930.",
    href: "/trades/SCX-84930",
    read: false,
    createdAt: ago(26, "min"),
  },
  {
    id: "ntf_3",
    category: "security",
    title: "New sign-in detected",
    body: "Chrome on Windows, Kaduna NG. If this wasn't you, secure your account.",
    href: "/security",
    read: false,
    createdAt: ago(4, "hour"),
  },
  {
    id: "ntf_4",
    category: "kyc",
    title: "Selfie verification pending",
    body: "Finish Level 3 verification to raise your daily limit.",
    href: "/kyc",
    read: true,
    createdAt: ago(1, "day"),
  },
  {
    id: "ntf_5",
    category: "trade",
    title: "Trade completed",
    body: "SCX-84921 settled. ₦2,187,810.00 sent to your GTBank account.",
    href: "/trades/SCX-84921",
    read: true,
    createdAt: ago(2, "day"),
  },
  {
    id: "ntf_6",
    category: "dispute",
    title: "Dispute under review",
    body: "A compliance officer is reviewing DSP-1041 on trade SCX-84511.",
    href: "/disputes/DSP-1041",
    read: true,
    createdAt: ago(3, "day"),
  },
];

export const unreadNotificationCount = notifications.filter((n) => !n.read).length;

/** Admin bell count from the dashboard design. */
export const adminUnreadCount = 7;
