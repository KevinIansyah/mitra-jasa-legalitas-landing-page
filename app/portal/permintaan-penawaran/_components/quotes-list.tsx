"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { AlertCircle, ChevronRight, Eye, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { fetchQuotesPage } from "@/lib/api/endpoints/quotes";
import type { QuoteRequest, QuotesListResult } from "@/lib/types/quote-request";
import { ApiError } from "@/lib/types/api";
import { getQuoteBudgetLabel, getQuoteTimelineLabel } from "@/lib/constants/quote-request-labels";
import { getQuoteStatusMeta } from "@/lib/constants/quote-status";
import { cn, formatDate } from "@/lib/utils";
import { PortalEmptyState } from "@/app/portal/_components/portal-empty-state";
import { PORTAL_DATA_TABLE, PORTAL_DATA_TABLE_BODY, PORTAL_DATA_TABLE_HEAD, PORTAL_DATA_TABLE_WRAP } from "@/app/portal/_components/portal-table-classes";
import { QuoteRequestModal } from "./quote-request-modal";

function QuoteCard({ row }: { row: QuoteRequest }) {
  const statusMeta = getQuoteStatusMeta(row.status);
  return (
    <Link
      href={`/portal/permintaan-penawaran/${row.id}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-brand-blue/40 dark:border-white/10 dark:bg-surface-card dark:hover:border-brand-blue/30 md:hidden"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1.5">
          <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{row.reference_number}</p>
          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{row.project_name}</p>
        </div>
        <span className={cn("shrink-0 inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold", statusMeta.classes)}>{statusMeta.label}</span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2 border-t border-gray-100 pt-4 dark:border-white/8">
        <div className="space-y-1.5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Dibuat</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{formatDate(row.created_at)}</p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
      </div>
    </Link>
  );
}

type Props = {
  initial: QuotesListResult;
};

function normalizeMeta(initial: QuotesListResult) {
  const len = initial.data?.length ?? 0;
  return {
    current_page: initial.current_page ?? 1,
    last_page: initial.last_page ?? 1,
    total: initial.total ?? len,
  };
}

export function QuotesList({ initial }: Props) {
  const [rows, setRows] = useState<QuoteRequest[]>(() => initial.data ?? []);
  const [meta, setMeta] = useState(() => normalizeMeta(initial));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const hasMore = meta.current_page < meta.last_page;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const next: QuotesListResult = await fetchQuotesPage(meta.current_page + 1);
      setRows((prev) => [...prev, ...(next.data ?? [])]);
      setMeta(normalizeMeta(next));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Gagal memuat permintaan penawaran.");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, meta.current_page]);

  const refetchFirstPage = useCallback(async () => {
    setError(null);
    const next: QuotesListResult = await fetchQuotesPage(1);
    setRows(next.data ?? []);
    setMeta(normalizeMeta(next));
  }, []);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <Button type="button" className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90" onClick={() => setQuoteModalOpen(true)}>
            Ajukan permintaan
          </Button>
        </div>
        <QuoteRequestModal open={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} onSubmitted={refetchFirstPage} />

        {error && (
          <p className="mt-4 text-sm text-destructive bg-destructive/10 border border-destructive/25 rounded-xl px-3 py-2.5 flex items-center gap-2" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
            {error}
          </p>
        )}

        {rows.length === 0 ? (
          <PortalEmptyState icon={MessageSquare} title="Belum ada permintaan" description="Permintaan penawaran yang Anda kirim dari portal akan tampil di sini." />
        ) : (
          <>
            <div className={cn("hidden md:block", PORTAL_DATA_TABLE_WRAP)}>
              <table className={PORTAL_DATA_TABLE}>
                <thead className={PORTAL_DATA_TABLE_HEAD}>
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Referensi</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Nama proyek</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Layanan</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Paket</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Jadwal / anggaran</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Diajukan</th>
                    <th className="w-10 px-4 py-3" />
                  </tr>
                </thead>
                <tbody className={PORTAL_DATA_TABLE_BODY}>
                  {rows.map((row) => {
                    const statusMeta = getQuoteStatusMeta(row.status);
                    return (
                      <tr key={row.id} className="align-middle">
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-sm font-medium text-gray-900 dark:text-white">{row.reference_number}</td>
                        <td className="max-w-[220px] px-4 py-3 text-sm text-gray-900 dark:text-white">{row.project_name}</td>
                        <td className="max-w-[200px] px-4 py-3 text-sm text-muted-foreground">{row.service?.name ?? "-"}</td>
                        <td className="max-w-[180px] px-4 py-3 text-sm text-muted-foreground">{row.service_package?.name ?? "-"}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                          {getQuoteTimelineLabel(row.timeline)} · {getQuoteBudgetLabel(row.budget_range)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap", statusMeta.classes)}>{statusMeta.label}</span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{formatDate(row.created_at)}</td>
                        <td className="px-4 py-3">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button asChild variant="secondary" size="icon" className="rounded-md">
                                <Link href={`/portal/permintaan-penawaran/${row.id}`} aria-label={`Lihat detail ${row.reference_number}`}>
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

            <ul className="space-y-4 md:hidden">
              {rows.map((row) => (
                <li key={row.id}>
                  <QuoteCard row={row} />
                </li>
              ))}
            </ul>
          </>
        )}

        {hasMore && rows.length > 0 && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={loadMore}
              disabled={loading}
              className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:border-brand-blue hover:text-brand-blue disabled:opacity-50 dark:border-white/15 dark:bg-surface-card dark:text-gray-200 dark:hover:border-brand-blue"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Memuat...
                </>
              ) : (
                "Muat lebih banyak"
              )}
            </button>
          </div>
        )}

        {rows.length > 0 && (
          <p className="text-center text-xs text-muted-foreground">
            Menampilkan {rows.length} dari {meta.total} permintaan
          </p>
        )}
      </div>
    </TooltipProvider>
  );
}
