import type { NotificationCategory, NotificationChannel, NotificationPreferences } from "../types";

export const NOTIFICATION_CATEGORIES: readonly NotificationCategory[] = [
  "trade",
  "payment",
  "dispute",
  "kyc",
  "security",
  "system",
];

export const NOTIFICATION_CHANNELS: readonly NotificationChannel[] = ["in_app", "push", "email", "sms"];

/**
 * The signed-in user's notification preferences (PRD §27). A mutable
 * module-level record — real in-memory server state for this process, the
 * same footing as `walletEntries` and `createdTrades` (see lib/api.ts's
 * header comment). Defaults follow the PRD's own "SMS where appropriate":
 * SMS only for the two categories where a missed message costs money.
 */
export const notificationPreferences: NotificationPreferences = {
  trade: { in_app: true, push: true, email: true, sms: false },
  payment: { in_app: true, push: true, email: true, sms: true },
  dispute: { in_app: true, push: true, email: true, sms: false },
  kyc: { in_app: true, push: false, email: true, sms: false },
  security: { in_app: true, push: true, email: true, sms: true },
  system: { in_app: true, push: false, email: false, sms: false },
};
