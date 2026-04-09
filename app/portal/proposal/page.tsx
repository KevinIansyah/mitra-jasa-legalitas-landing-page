import type { Metadata } from "next";
import { getProposalsPage } from "@/lib/api/endpoints/proposals.server";
import { PortalSectionHeader } from "@/app/portal/_components/portal-section-header";
import { ProposalsList } from "./_components/proposals-list";

export const metadata: Metadata = {
  title: "Proposal",
};

export default async function PortalProposalPage() {
  const initial = await getProposalsPage(1);

  return (
    <section className="max-w-6xl">
      <PortalSectionHeader
        title="Proposal"
        description="Daftar proposal layanan untuk akun Anda. Periksa berlaku hingga, total, dan status persetujuan."
      />

      <ProposalsList initial={initial} />
    </section>
  );
}
