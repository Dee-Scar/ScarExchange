import type { Metadata } from "next";
import { AdminOffersTable } from "@/components/admin/admin-offers-table";
import { getAllOffers } from "@/lib/api";

export const metadata: Metadata = { title: "Offers Management" };

export default async function AdminOffersPage() {
  const offers = await getAllOffers();

  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <div>
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-neutral-900 dark:text-white">
          Offers Management
        </h1>
        <p className="mt-1 text-[13.5px] text-neutral-500 dark:text-neutral-400">
          Every offer on the platform — active, paused, suspended or expired (PRD §34).
        </p>
      </div>

      <AdminOffersTable offers={offers} />
    </div>
  );
}
