import type { PurchasePageAggregateData } from "./types";
import { getPurchasePageData } from "./_server/getPurchasePageData";
import PurchasePageClient from "./_components/PurchasePageClient";

interface PurchasePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PurchasePage({ params }: PurchasePageProps) {
  const { slug } = await params;
  const aggregateData = (await getPurchasePageData(slug)) as PurchasePageAggregateData | null;
  if (!aggregateData) {
    // minimal not-found handling without importing next/navigation to keep scope tight
    return null;
  }

  return <PurchasePageClient aggregateData={aggregateData} />;
}

