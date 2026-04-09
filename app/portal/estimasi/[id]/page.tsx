import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEstimateListContext } from "@/lib/estimate-list-context";
import { getEstimateById } from "@/lib/api/endpoints/estimates.server";
import { PortalSectionHeader } from "@/app/portal/_components/portal-section-header";
import { EstimateDetailView } from "../_components/estimate-detail-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const estimate = await getEstimateById(id);
  if (!estimate) {
    return { title: "Estimasi" };
  }
  const description = getEstimateListContext(estimate);
  return {
    title: `${estimate.estimate_number} · Estimasi`,
    description: description !== "-" ? description : estimate.estimate_number,
  };
}

export default async function PortalEstimasiDetailPage({ params }: PageProps) {
  const { id } = await params;
  const estimate = await getEstimateById(id);

  if (!estimate) {
    notFound();
  }

  return (
    <section className="max-w-6xl">
      <PortalSectionHeader title="Detail estimasi" description="Ringkasan biaya, status, baris item, dan unduhan PDF." />
      <div className="border-t border-gray-200 pt-10 dark:border-white/10">
        <EstimateDetailView estimate={estimate} />
      </div>
    </section>
  );
}
