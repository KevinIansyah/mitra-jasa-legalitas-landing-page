import type { ReactNode } from "react";
import { getProposalStatusMeta } from "@/lib/constants/proposal-status";
import type { Proposal } from "@/lib/types/proposal";
import { cn, formatDate, formatIdrFromApi, resolvePublicFileUrl } from "@/lib/utils";
import { PortalDetailSectionHeading } from "@/app/portal/_components/portal-detail-section-heading";
import {
  PORTAL_DATA_TABLE,
  PORTAL_DATA_TABLE_BODY,
  PORTAL_DATA_TABLE_HEAD,
  PORTAL_DATA_TABLE_WRAP,
} from "@/app/portal/_components/portal-table-classes";
import { ProposalDetailToolbar } from "./proposal-detail-toolbar";

function resolveProposalPdfUrl(p: Proposal): string | null {
  const direct = p.file_url?.trim();
  if (direct && (direct.startsWith("http://") || direct.startsWith("https://"))) {
    return direct;
  }
  return resolvePublicFileUrl(p.file_path);
}

type Props = {
  proposal: Proposal;
};

const FIELD_TEXT = "text-sm leading-relaxed";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={cn("space-y-1.5", FIELD_TEXT)}>
      <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
      <div className="font-normal text-gray-800 dark:text-gray-200">{children}</div>
    </div>
  );
}

export function ProposalDetailView({ proposal: p }: Props) {
  const pdfHref = resolveProposalPdfUrl(p);
  const statusMeta = getProposalStatusMeta(p.status);
  const items = [...(p.items ?? [])].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-10">
      <ProposalDetailToolbar proposalId={p.id} status={p.status} pdfHref={pdfHref} />

      <section className="space-y-6">
        <PortalDetailSectionHeading
          title="Informasi proposal"
          description="Nomor, jadwal berlaku, status, dan ringkasan penawaran."
        />
        <Field label="Status">
          <span className={cn("inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold", statusMeta.classes)}>{statusMeta.label}</span>
        </Field>

        <Field label="No. proposal">
          <span className="font-mono">{p.proposal_number}</span>
        </Field>

        <Field label="Nama">{p.project_name}</Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Tanggal proposal">{formatDate(p.proposal_date)}</Field>
          <Field label="Berlaku hingga">{formatDate(p.valid_until)}</Field>
        </div>

        <Field label="Deskripsi">
          {p.notes?.trim() ? <p className="whitespace-pre-wrap text-muted-foreground">{p.notes}</p> : <span className="text-muted-foreground">Tidak ada catatan.</span>}
        </Field>

        {p.rejected_reason?.trim() ? (
          <Field label="Alasan penolakan">
            <p className="whitespace-pre-wrap text-muted-foreground">{p.rejected_reason}</p>
          </Field>
        ) : null}
      </section>

      <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-white/10">
        <PortalDetailSectionHeading
          title="Item proposal"
          description="Rincian baris penawaran, harga, dan total."
        />
        <div className={PORTAL_DATA_TABLE_WRAP}>
          <table className={PORTAL_DATA_TABLE}>
            <thead className={PORTAL_DATA_TABLE_HEAD}>
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Deskripsi</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Qty</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Harga satuan</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Subtotal</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Pajak</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Total baris</th>
              </tr>
            </thead>
            <tbody className={PORTAL_DATA_TABLE_BODY}>
              {items.map((row) => (
                <tr key={row.id} className="align-middle">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{row.description}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{row.quantity}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{formatIdrFromApi(row.unit_price)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{formatIdrFromApi(row.subtotal)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{formatIdrFromApi(row.tax_amount)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{formatIdrFromApi(row.total_amount)}</td>
                </tr>
              ))}
              <tr className="align-middle">
                <td colSpan={5} className="px-4 py-3 text-sm text-muted-foreground">
                  Subtotal
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{formatIdrFromApi(p.subtotal)}</td>
              </tr>
              {Number.parseFloat(p.discount_amount) > 0 ? (
                <tr className="align-middle">
                  <td colSpan={5} className="px-4 py-3 text-sm text-muted-foreground">
                    Diskon ({p.discount_percent}%)
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">−{formatIdrFromApi(p.discount_amount)}</td>
                </tr>
              ) : null}
              <tr className="align-middle">
                <td colSpan={5} className="px-4 py-3 text-sm text-muted-foreground">
                  Pajak ({p.tax_percent}%)
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{formatIdrFromApi(p.tax_amount)}</td>
              </tr>
              <tr className="align-middle">
                <td colSpan={5} className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Total
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{formatIdrFromApi(p.total_amount)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
