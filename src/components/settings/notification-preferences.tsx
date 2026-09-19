"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { setNotificationPreferenceAction } from "@/lib/actions/preferences";
import type { NotificationCategory, NotificationChannel, NotificationPreferences } from "@/lib/types";

const CHANNELS: { id: NotificationChannel; label: string }[] = [
  { id: "in_app", label: "In-app" },
  { id: "push", label: "Push" },
  { id: "email", label: "Email" },
  { id: "sms", label: "SMS" },
];

// Descriptions are the PRD §27 notification events, grouped by the app's existing categories.
const CATEGORIES: { id: NotificationCategory; label: string; description: string }[] = [
  { id: "trade", label: "Trades", description: "Trade accepted, rate negotiated, trade completed" },
  {
    id: "payment",
    label: "Payments",
    description: "Payment required, submitted and confirmed; settlement initiated",
  },
  { id: "dispute", label: "Disputes", description: "Dispute opened, dispute resolved" },
  { id: "kyc", label: "Verification", description: "KYC approved" },
  { id: "security", label: "Security", description: "Security alerts about your account" },
  { id: "system", label: "Platform updates", description: "Announcements from ScarExchange" },
];

/** Real, persisted (for this server process) — each toggle saves through a Server Action. */
export function NotificationPreferencesForm({ initial }: { initial: NotificationPreferences }) {
  const [prefs, setPrefs] = useState(initial);
  const [, startTransition] = useTransition();

  function handleToggle(category: NotificationCategory, channel: NotificationChannel, enabled: boolean) {
    setPrefs((prev) => ({ ...prev, [category]: { ...prev[category], [channel]: enabled } }));

    startTransition(async () => {
      try {
        await setNotificationPreferenceAction(category, channel, enabled);
      } catch {
        setPrefs((prev) => ({ ...prev, [category]: { ...prev[category], [channel]: !enabled } }));
        toast.error("Couldn't save that change — try again.");
      }
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-left">
        <thead>
          <tr className="border-b border-hairline">
            <th scope="col" className="pb-3 text-[12px] font-semibold text-neutral-500 dark:text-neutral-400">
              Notify me about
            </th>
            {CHANNELS.map((channel) => (
              <th
                key={channel.id}
                scope="col"
                className="w-[76px] pb-3 text-center text-[12px] font-semibold text-neutral-500 dark:text-neutral-400"
              >
                {channel.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CATEGORIES.map((category) => (
            <tr key={category.id} className="border-b border-hairline last:border-0">
              <td className="py-3.5 pr-3">
                <p className="text-[13.5px] font-semibold text-neutral-900 dark:text-white">
                  {category.label}
                </p>
                <p className="mt-0.5 text-[12px] text-neutral-500 dark:text-neutral-400">
                  {category.description}
                </p>
              </td>
              {CHANNELS.map((channel) => (
                <td key={channel.id} className="py-3.5 text-center">
                  <Switch
                    checked={prefs[category.id][channel.id]}
                    onCheckedChange={(checked) => handleToggle(category.id, channel.id, checked)}
                    aria-label={`${category.label} — ${channel.label}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
