import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInvoiceById } from "@/lib/api/endpoints/invoices.server";
import { PortalSectionHeader } from "@/app/portal/_components/portal-section-header";
import { InvoiceDetailView } from "../_components/invoice-detail-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) {
    return { title: "Faktur" };
  }
  return {
    title: `${invoice.invoice_number} · Faktur`,
    description: invoice.project?.name ?? invoice.invoice_number,
  };
}

export default async function PortalFakturDetailPage({ params }: PageProps) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  return (
    <section className="max-w-6xl">
      <PortalSectionHeader title="Detail faktur" description="Ringkasan tagihan, baris item, dan riwayat pembayaran." />
      <div className="border-t border-gray-200 pt-10 dark:border-white/10">
        <InvoiceDetailView invoice={invoice} />
      </div>
    </section>
  );
}
