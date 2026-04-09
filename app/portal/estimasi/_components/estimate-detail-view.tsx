import type { ReactNode } from "react";
import Link from "next/link";
import { Calculator, ExternalLink } from "lucide-react";
import { getEstimateStatusMeta } from "@/lib/constants/estimate-status";
import type { Estimate } from "@/lib/types/estimate";
import { cn, formatDate, formatIdrFromApi, resolvePublicFileUrl } from "@/lib/utils";
import { PortalDetailSectionHeading } from "@/app/portal/_components/portal-detail-section-heading";
import { PortalEmptyState } from "@/app/portal/_components/portal-empty-state";
import {
  PORTAL_DATA_TABLE,
  PORTAL_DATA_TABLE_BODY,
  PORTAL_DATA_TABLE_HEAD,
  PORTAL_DATA_TABLE_WRAP,
} from "@/app/portal/_components/portal-table-classes";
import { EstimateDetailToolbar } from "./estimate-detail-toolbar";

type Props = {
  estimate: Estimate;
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

function resolveEstimatePdfUrl(e: Estimate): string | null {
  const direct = e.file_url?.trim();
  if (direct && (direct.startsWith("http://") || direct.startsWith("https://"))) {
    return direct;
  }
  return resolvePublicFileUrl(e.file_path);
}

export function EstimateDetailView({ estimate: e }: Props) {
  const statusMeta = getEstimateStatusMeta(e.status);
  const pdfHref = resolveEstimatePdfUrl(e);
  const items = [...(e.items ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const quoteLinkId = e.quote?.id ?? e.quote_id;

  return (
    <div className="space-y-10">
      <EstimateDetailToolbar estimateId={e.id} status={e.status} pdfHref={pdfHref} />

      <section className="space-y-6">
        <PortalDetailSectionHeading
          title="Informasi estimasi"
          description="Nomor, versi, jadwal berlaku, status, dan tautan ke proposal atau permintaan penawaran terkait."
        />
        <Field label="Status">
          <span className={cn("inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold", statusMeta.classes)}>{statusMeta.label}</span>
        </Field>

        <Field label="No. estimasi">
          <span className="font-mono">{e.estimate_number}</span>
        </Field>

        <Field label="Versi">{e.version_label}</Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Tanggal estimasi">{formatDate(e.estimate_date)}</Field>
          <Field label="Berlaku hingga">{formatDate(e.valid_until)}</Field>
        </div>

        <Field label="Versi aktif">{e.is_active ? "Ya" : "Tidak"}</Field>

        {e.proposal ? (
          <>
            <Field label="No. proposal">
              <span className="font-mono">{e.proposal.proposal_number}</span>
            </Field>
            <Field label="Nama proyek">{e.proposal.project_name}</Field>
            <Field label="Proposal">
              <Link
                href={`/portal/proposal/${e.proposal.id}`}
                className="inline-flex items-center gap-1 font-medium text-brand-blue hover:underline"
              >
                Buka detail proposal
                <ExternalLink className="size-3.5 shrink-0" aria-hidden />
              </Link>
            </Field>
          </>
        ) : null}

        {quoteLinkId != null ? (
          <>
            <Field label="No. permintaan penawaran">
              <span className="font-mono">
                {e.quote?.reference_number?.trim() ?? `Permintaan #${quoteLinkId}`}
              </span>
            </Field>
            <Field label="Nama proyek (penawaran)">
              {e.quote?.project_name?.trim() ? e.quote.project_name.trim() : "-"}
            </Field>
            <Field label="Permintaan penawaran">
              <Link
                href={`/portal/permintaan-penawaran/${quoteLinkId}`}
                className="inline-flex items-center gap-1 font-medium text-brand-blue hover:underline"
              >
                Buka detail permintaan penawaran
                <ExternalLink className="size-3.5 shrink-0" aria-hidden />
              </Link>
            </Field>
          </>
        ) : null}

        {e.notes?.trim() ? (
          <Field label="Catatan">
            <p className="whitespace-pre-wrap text-muted-foreground">{e.notes.trim()}</p>
          </Field>
        ) : null}

        {e.rejected_reason?.trim() ? (
          <Field label="Alasan penolakan">
            <p className="whitespace-pre-wrap text-destructive">{e.rejected_reason.trim()}</p>
          </Field>
        ) : null}
      </section>

      <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-white/10">
        <PortalDetailSectionHeading title="Item estimasi" description="Rincian baris biaya, pajak per baris, dan total." />
        {items.length === 0 ? (
          <PortalEmptyState
            icon={Calculator}
            title="Tidak ada baris item"
            description="Estimasi ini belum memiliki rincian pos biaya."
          />
        ) : (
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
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{formatIdrFromApi(e.subtotal)}</td>
                </tr>
                {Number.parseFloat(e.discount_amount) > 0 ? (
                  <tr className="align-middle">
                    <td colSpan={5} className="px-4 py-3 text-sm text-muted-foreground">
                      Diskon ({e.discount_percent}%)
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">−{formatIdrFromApi(e.discount_amount)}</td>
                  </tr>
                ) : null}
                <tr className="align-middle">
                  <td colSpan={5} className="px-4 py-3 text-sm text-muted-foreground">
                    Pajak ({e.tax_percent}%)
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{formatIdrFromApi(e.tax_amount)}</td>
                </tr>
                <tr className="align-middle">
                  <td colSpan={5} className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Total
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{formatIdrFromApi(e.total_amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
