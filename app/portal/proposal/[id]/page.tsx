import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProposalById } from "@/lib/api/endpoints/proposals.server";
import { PortalSectionHeader } from "@/app/portal/_components/portal-section-header";
import { ProposalDetailView } from "../_components/proposal-detail-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const proposal = await getProposalById(id);
  if (!proposal) {
    return { title: "Proposal" };
  }
  return {
    title: `${proposal.proposal_number} · Proposal`,
    description: proposal.project_name,
  };
}

export default async function PortalProposalDetailPage({ params }: PageProps) {
  const { id } = await params;
  const proposal = await getProposalById(id);

  if (!proposal) {
    notFound();
  }

  return (
    <section className="max-w-6xl">
      <PortalSectionHeader title="Detail proposal" description="Ringkasan proposal, baris item, dan unduhan dokumen." />
      <div className="border-t border-gray-200 pt-10 dark:border-white/10">
        <ProposalDetailView proposal={proposal} />
      </div>
    </section>
  );
}
