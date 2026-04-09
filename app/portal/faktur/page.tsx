import type { Metadata } from "next";
import { getInvoicesPage } from "@/lib/api/endpoints/invoices.server";
import { PortalSectionHeader } from "@/app/portal/_components/portal-section-header";
import { InvoicesList } from "./_components/invoices-list";

export const metadata: Metadata = {
  title: "Faktur",
};

export default async function PortalFakturPage() {
  const initial = await getInvoicesPage(1);

  return (
    <section className="max-w-6xl">
      <PortalSectionHeader
        title="Faktur"
        description="Daftar faktur yang diterbitkan untuk akun Anda. Periksa jatuh tempo, status pembayaran, dan detail proyek terkait."
      />

      <InvoicesList initial={initial} />
    </section>
  );
}
