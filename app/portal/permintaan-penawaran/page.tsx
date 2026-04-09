import type { Metadata } from "next";
import { getQuotesPage } from "@/lib/api/endpoints/quotes.server";
import { PortalSectionHeader } from "@/app/portal/_components/portal-section-header";
import { QuotesList } from "./_components/quotes-list";

export const metadata: Metadata = {
  title: "Permintaan penawaran",
};

export default async function PortalPermintaanPenawaranPage() {
  const initial = await getQuotesPage(1);

  return (
    <section className="w-full max-w-6xl">
      <PortalSectionHeader
        title="Permintaan penawaran"
        description="Permintaan penawaran harga atau informasi layanan yang Anda ajukan."
      />

      <QuotesList initial={initial} />
    </section>
  );
}
