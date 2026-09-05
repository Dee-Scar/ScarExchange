import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TradeRoom } from "@/components/trade/trade-room";
import { TradeSuccess } from "@/components/trade/trade-success";
import { getCurrentUser, getTrade } from "@/lib/api";

type Params = { reference: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { reference } = await params;
  return { title: `Trade ${reference.toUpperCase()}` };
}

/**
 * One route, two views.
 *
 * A trade's screen is a function of its state — the live room while it is in
 * flight, the settlement summary once it is done. Splitting these into
 * separate URLs would mean a completed trade's link stops working.
 */
export default async function TradeDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { reference } = await params;
  const [trade, user] = await Promise.all([getTrade(reference), getCurrentUser()]);

  if (!trade) notFound();

  if (trade.state === "COMPLETED") {
    return <TradeSuccess trade={trade} currentUserId={user.id} />;
  }

  return <TradeRoom trade={trade} currentUserId={user.id} />;
}
