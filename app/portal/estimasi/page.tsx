import type { Metadata } from "next";
import { getEstimatesPage } from "@/lib/api/endpoints/estimates.server";
import { PortalSectionHeader } from "@/app/portal/_components/portal-section-header";
import { EstimatesList } from "./_components/estimates-list";

export const metadata: Metadata = {
  title: "Estimasi",
};

export default async function PortalEstimasiPage() {
  const initial = await getEstimatesPage(1);

  return (
    <section className="max-w-6xl">
      <PortalSectionHeader
        title="Estimasi"
        description="Daftar estimasi biaya untuk akun Anda. Periksa berlaku hingga, status, dan tautan ke proposal terkait."
      />

      <EstimatesList initial={initial} />
    </section>
  );
}
