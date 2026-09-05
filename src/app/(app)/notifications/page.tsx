import type { Metadata } from "next";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { getNotifications } from "@/lib/api";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <div className="mx-auto max-w-[900px] space-y-5">
      <div>
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
          Notifications
        </h1>
        <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
          Stay updated on your trades, payments and account activity.
        </p>
      </div>

      <NotificationsList initial={notifications} />
    </div>
  );
}
