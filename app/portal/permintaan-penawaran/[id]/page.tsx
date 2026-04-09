import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getQuoteById } from "@/lib/api/endpoints/quotes.server";
import { PortalSectionHeader } from "@/app/portal/_components/portal-section-header";
import { QuoteDetailView } from "../_components/quote-detail-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const quote = await getQuoteById(id);
  if (!quote) {
    return { title: "Permintaan penawaran" };
  }
  return {
    title: `${quote.reference_number} · Permintaan penawaran`,
    description: quote.project_name,
  };
}

export default async function PortalPermintaanPenawaranDetailPage({ params }: PageProps) {
  const { id } = await params;
  const quote = await getQuoteById(id);

  if (!quote) {
    notFound();
  }

  return (
    <section className="max-w-6xl">
      <PortalSectionHeader
        title="Detail permintaan penawaran"
        description="Ringkasan kebutuhan, layanan & paket, serta estimasi terkait."
      />
      <div className="border-t border-gray-200 pt-10 dark:border-white/10">
        <QuoteDetailView quote={quote} />
      </div>
    </section>
  );
}
