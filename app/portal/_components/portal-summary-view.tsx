import type { PortalSummary } from "@/lib/types/portal-summary";
import { PortalSummaryMetricCard } from "./portal-summary-metric-card";

type Props = {
  summary: PortalSummary | null;
};

export function PortalSummaryView({ summary }: Props) {
  if (!summary) {
    return (
      <p className="rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200/90">
        Ringkasan belum dapat dimuat. Silakan muat ulang halaman atau coba lagi nanti.
      </p>
    );
  }

  const q = summary.quotes;
  const pr = summary.proposals;
  const e = summary.estimates;
  const p = summary.projects;
  const inv = summary.invoices;
  const d = summary.documents;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <PortalSummaryMetricCard
        href="/portal/proyek"
        title="Proyek"
        value={p.total}
        highlight={
          p.active > 0
            ? `${p.active} proyek aktif sedang berjalan.`
            : "Belum ada proyek yang ditandai aktif."
        }
        footer={`Aktif: ${p.active} · total: ${p.total} · pantau milestone di halaman proyek.`}
        trend={
          p.active > 0 ? { tone: "up", label: `${p.active} aktif` } : { tone: "neutral", label: "- 0%" }
        }
      />

      <PortalSummaryMetricCard
        href="/portal/permintaan-penawaran"
        title="Permintaan penawaran"
        value={q.total}
        highlight={
          q.open > 0
            ? `${q.open} permintaan masih terbuka dan dapat ditindaklanjuti.`
            : "Tidak ada permintaan yang berstatus terbuka."
        }
        footer={`Terbuka: ${q.open} · dari total ${q.total} permintaan Anda.`}
        trend={
          q.open > 0 ? { tone: "up", label: `${q.open} terbuka` } : { tone: "neutral", label: "- 0%" }
        }
      />

      <PortalSummaryMetricCard
        href="/portal/faktur"
        title="Faktur"
        value={inv.total}
        highlight={
          inv.overdue > 0
            ? `${inv.overdue} faktur melewati jatuh tempo - segera selesaikan.`
            : inv.unpaid > 0
              ? `${inv.unpaid} faktur belum lunas.`
              : "Tidak ada faktur yang menunggu pembayaran."
        }
        footer={`Belum lunas: ${inv.unpaid} · jatuh tempo: ${inv.overdue} · total faktur: ${inv.total}.`}
        trend={
          inv.overdue > 0
            ? { tone: "down", label: `${inv.overdue} lewat` }
            : inv.unpaid > 0
              ? { tone: "neutral", label: `${inv.unpaid} belum lunas` }
              : { tone: "neutral", label: "- 0%" }
        }
      />

      <PortalSummaryMetricCard
        href="/portal/proposal"
        title="Proposal"
        value={pr.total}
        highlight={
          pr.awaiting_response > 0
            ? `${pr.awaiting_response} proposal menunggu keputusan Anda.`
            : "Tidak ada proposal yang menunggu tanggapan."
        }
        footer={`Menunggu tanggapan: ${pr.awaiting_response} · total proposal: ${pr.total}.`}
        trend={
          pr.awaiting_response > 0
            ? { tone: "up", label: `${pr.awaiting_response} tunggu` }
            : { tone: "neutral", label: "- 0%" }
        }
      />

      <PortalSummaryMetricCard
        href="/portal/estimasi"
        title="Estimasi"
        value={e.total}
        highlight={
          e.awaiting_response > 0
            ? `${e.awaiting_response} estimasi perlu disetujui atau ditolak.`
            : "Tidak ada estimasi yang menunggu tanggapan."
        }
        footer={`Menunggu tanggapan: ${e.awaiting_response} · total estimasi: ${e.total}.`}
        trend={
          e.awaiting_response > 0
            ? { tone: "up", label: `${e.awaiting_response} tunggu` }
            : { tone: "neutral", label: "- 0%" }
        }
      />

      <PortalSummaryMetricCard
        href="/portal/proyek"
        title="Dokumen proyek"
        value={d.pending_review + d.rejected}
        highlight={
          d.pending_review + d.rejected > 0
            ? `${d.pending_review} dokumen menunggu review tim · ${d.rejected} perlu perbaikan.`
            : "Tidak ada dokumen yang menunggu tindakan."
        }
        footer={`Menunggu review: ${d.pending_review} · ditolak: ${d.rejected} · kelola unggahan di tiap proyek.`}
        trend={
          d.pending_review > 0
            ? { tone: "up", label: `${d.pending_review} review` }
            : d.rejected > 0
              ? { tone: "down", label: `${d.rejected} tolak` }
              : { tone: "neutral", label: "- 0%" }
        }
      />
    </div>
  );
}
