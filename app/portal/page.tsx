import { getPortalSummary } from "@/lib/api/endpoints/portal-summary.server";
import { PortalSectionHeader } from "./_components/portal-section-header";
import { PortalSummaryView } from "./_components/portal-summary-view";

export default async function PortalRingkasanPage() {
  const summary = await getPortalSummary();

  return (
    <section className="max-w-6xl space-y-8">
      <PortalSectionHeader
        title="Ringkasan"
        description="Gambaran singkat aktivitas dan status terbaru di portal Anda."
      />
      <PortalSummaryView summary={summary} />
    </section>
  );
}
