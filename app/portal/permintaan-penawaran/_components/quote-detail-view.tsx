"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Calculator, ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getEstimateStatusMeta } from "@/lib/constants/estimate-status";
import { getBusinessCategoryMeta, getLegalStatusMeta } from "@/lib/constants/quote-business-context";
import { getQuoteBudgetLabel, getQuoteSourceLabel, getQuoteTimelineLabel } from "@/lib/constants/quote-request-labels";
import { getQuoteStatusMeta } from "@/lib/constants/quote-status";
import type { QuoteNestedEstimate, QuoteRequestDetail } from "@/lib/types/quote-request";
import { cn, formatDate, formatIdrFromApi } from "@/lib/utils";
import { PortalDetailSectionHeading } from "@/app/portal/_components/portal-detail-section-heading";
import { PortalEmptyState } from "@/app/portal/_components/portal-empty-state";
import { PORTAL_DATA_TABLE, PORTAL_DATA_TABLE_BODY, PORTAL_DATA_TABLE_HEAD, PORTAL_DATA_TABLE_WRAP } from "@/app/portal/_components/portal-table-classes";

type Props = {
  quote: QuoteRequestDetail;
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

function EstimateRows({ rows }: { rows: QuoteNestedEstimate[] }) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className={PORTAL_DATA_TABLE_WRAP}>
        <table className={PORTAL_DATA_TABLE}>
          <thead className={PORTAL_DATA_TABLE_HEAD}>
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">No. estimasi</th>
              <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Versi</th>
              <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Total</th>
              <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Berlaku s/d</th>
              <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Status</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody className={PORTAL_DATA_TABLE_BODY}>
            {rows.map((row) => {
              const estStatus = getEstimateStatusMeta(row.status);
              return (
                <tr key={row.id} className="align-middle">
                  <td className="px-4 py-3 font-mono font-medium text-gray-900 dark:text-white">{row.estimate_number}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{row.version_label}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900 dark:text-white">{formatIdrFromApi(row.total_amount)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(row.valid_until)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold", estStatus.classes)}>{estStatus.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button asChild variant="secondary" size="icon" className="rounded-md">
                          <Link href={`/portal/estimasi/${row.id}`} aria-label={`Lihat detail estimasi ${row.estimate_number}`}>
                            <Eye className="size-3.5" aria-hidden />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Lihat detail</TooltipContent>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </TooltipProvider>
  );
}

export function QuoteDetailView({ quote: q }: Props) {
  const statusMeta = getQuoteStatusMeta(q.status);
  const pkg = q.service_package;
  const businessMeta = getBusinessCategoryMeta(q.business_type);
  const legalMeta = getLegalStatusMeta(q.business_legal_status);

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        <PortalDetailSectionHeading title="Permintaan penawaran" description="Ringkasan kebutuhan, status, dan konteks bisnis yang Anda ajukan." />
        <Field label="Status">
          <span className={cn("inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold", statusMeta.classes)}>{statusMeta.label}</span>
        </Field>
        <Field label="Referensi">
          <span className="font-mono">{q.reference_number}</span>
        </Field>
        <Field label="Nama proyek">{q.project_name}</Field>
        <Field label="Deskripsi kebutuhan">
          {q.description?.trim() ? <p className="whitespace-pre-wrap text-muted-foreground">{q.description.trim()}</p> : <span className="text-muted-foreground">-</span>}
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Jenis usaha">{businessMeta.label}</Field>
          <Field label="Bentuk badan hukum">{legalMeta.label}</Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Jadwal">{getQuoteTimelineLabel(q.timeline)}</Field>
          <Field label="Rentang anggaran">{getQuoteBudgetLabel(q.budget_range)}</Field>
        </div>

        <Field label="Sumber">{getQuoteSourceLabel(q.source)}</Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Diajukan">{formatDate(q.created_at)}</Field>
          <Field label="Diperbarui">{formatDate(q.updated_at)}</Field>
        </div>

        {q.contacted_at ? <Field label="Dihubungi pada">{formatDate(q.contacted_at)}</Field> : null}
        {q.converted_at ? <Field label="Dikonversi pada">{formatDate(q.converted_at)}</Field> : null}

        {q.rejected_reason?.trim() ? (
          <Field label="Alasan penolakan">
            <p className="whitespace-pre-wrap text-destructive">{q.rejected_reason.trim()}</p>
          </Field>
        ) : null}
        {q.notes?.trim() ? (
          <Field label="Catatan internal">
            <p className="whitespace-pre-wrap text-muted-foreground">{q.notes.trim()}</p>
          </Field>
        ) : null}
      </section>

      <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-white/10">
        <PortalDetailSectionHeading title="Layanan & paket" description="Layanan yang dipilih dan paket terkait." />
        {q.service ? (
          <div className="space-y-4">
            <Field label="Layanan">
              <div className="space-y-2">
                <Link href={`/layanan/${q.service.slug}`} className="inline-flex items-center gap-1 font-medium text-brand-blue hover:underline">
                  {q.service.name}
                  <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                </Link>
                {q.service.short_description?.trim() ? <p className="text-muted-foreground">{q.service.short_description.trim()}</p> : null}
              </div>
            </Field>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Data layanan tidak tersedia.</p>
        )}

        {pkg ? (
          <div className="space-y-3">
            <Field label="Nama paket">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-white">{pkg.name}</span>
                {pkg.badge?.trim() ? <span className="inline-flex rounded-full bg-brand-blue px-2.5 py-1.5 text-xs font-semibold text-white">{pkg.badge.trim()}</span> : null}
              </div>
            </Field>
            <Field label="Estimasi durasi">{pkg.duration}</Field>
            {pkg.short_description?.trim() ? (
              <Field label="Ringkasan paket">
                <p className="text-muted-foreground">{pkg.short_description.trim()}</p>
              </Field>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Data paket tidak tersedia.</p>
        )}
      </section>

      {q.active_estimate ? (
        <section className="space-y-4 border-t border-gray-200 pt-10 dark:border-white/10">
          <PortalDetailSectionHeading title="Estimasi aktif" description="Estimasi yang saat ini terikat pada permintaan ini." />
          <div className="rounded-xl border border-brand-blue/25 bg-brand-blue/5 p-5 dark:border-brand-blue/30 dark:bg-brand-blue/10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{q.active_estimate.estimate_number}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Total {formatIdrFromApi(q.active_estimate.total_amount)} · berlaku s/d {formatDate(q.active_estimate.valid_until)}
                </p>
              </div>
              <Link href={`/portal/permintaan-penawaran/${q.active_estimate.id}`} className="inline-flex items-center gap-1 font-medium text-brand-blue hover:underline">
                Buka estimasi
                <ExternalLink className="size-3.5 shrink-0" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-white/10">
        <PortalDetailSectionHeading title="Riwayat estimasi" description="Semua estimasi yang terhubung dengan permintaan penawaran ini." />
        {q.estimates.length === 0 ? (
          <PortalEmptyState icon={Calculator} title="Belum ada estimasi" description="Estimasi yang diterbitkan untuk permintaan ini akan muncul di sini." />
        ) : (
          <EstimateRows rows={q.estimates} />
        )}
      </section>
    </div>
  );
}
