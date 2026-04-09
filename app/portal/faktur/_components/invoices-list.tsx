"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ChevronRight, Eye, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { fetchInvoicesPage } from "@/lib/api/endpoints/invoices";
import { getInvoiceStatusMeta } from "@/lib/constants/invoice-status";
import type { Invoice, InvoicesListResult } from "@/lib/types/invoice";
import { ApiError } from "@/lib/types/api";
import { cn, formatDate, formatIdrFromApi } from "@/lib/utils";
import { PortalEmptyState } from "@/app/portal/_components/portal-empty-state";
import {
  PORTAL_DATA_TABLE,
  PORTAL_DATA_TABLE_BODY,
  PORTAL_DATA_TABLE_HEAD,
  PORTAL_DATA_TABLE_WRAP,
} from "@/app/portal/_components/portal-table-classes";

function typeLabel(type: string): string {
  if (type === "dp") return "DP";
  if (type === "additional") return "Tambahan";
  return type;
}

function InvoiceCard({ row }: { row: Invoice }) {
  const statusMeta = getInvoiceStatusMeta(row.status);
  return (
    <Link
      href={`/portal/faktur/${row.id}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-brand-blue/40 dark:border-white/10 dark:bg-surface-card dark:hover:border-brand-blue/30 md:hidden"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1.5">
          <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">{row.invoice_number}</p>
          <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{row.project?.name ?? "Tanpa proyek"}</p>
        </div>
        <span className={cn("shrink-0 inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold", statusMeta.classes)}>{statusMeta.label}</span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2 border-t border-gray-100 pt-4 dark:border-white/8">
        <div className="space-y-1.5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Total</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">{formatIdrFromApi(row.total_amount)}</p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
      </div>
    </Link>
  );
}

type Props = {
  initial: InvoicesListResult;
};

export function InvoicesList({ initial }: Props) {
  const [rows, setRows] = useState<Invoice[]>(initial.data);
  const [meta, setMeta] = useState({
    current_page: initial.current_page,
    last_page: initial.last_page,
    total: initial.total,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = meta.current_page < meta.last_page;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const next: InvoicesListResult = await fetchInvoicesPage(meta.current_page + 1);
      setRows((prev) => [...prev, ...next.data]);
      setMeta({
        current_page: next.current_page,
        last_page: next.last_page,
        total: next.total,
      });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Gagal memuat faktur.");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, meta.current_page]);

  return (
    <TooltipProvider delayDuration={200}>
    <div className="space-y-6">
      {error && (
        <p className="rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {rows.length === 0 ? (
        <PortalEmptyState
          icon={FileText}
          title="Belum ada faktur"
          description="Faktur yang diterbitkan untuk akun Anda akan tampil di sini."
        />
      ) : (
        <>
          <div className={cn("hidden md:block", PORTAL_DATA_TABLE_WRAP)}>
            <table className={PORTAL_DATA_TABLE}>
              <thead className={PORTAL_DATA_TABLE_HEAD}>
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">No. faktur</th>
                  <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Proyek</th>
                  <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Jenis</th>
                  <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Jatuh tempo</th>
                  <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Total</th>
                  <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="w-10 px-4 py-3" />
                </tr>
              </thead>
              <tbody className={PORTAL_DATA_TABLE_BODY}>
                {rows.map((row) => {
                  const statusMeta = getInvoiceStatusMeta(row.status);
                  return (
                  <tr key={row.id} className="align-middle">
                    <td className="px-4 py-3 font-mono font-medium text-gray-900 dark:text-white">{row.invoice_number}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-muted-foreground">{row.project?.name ?? "-"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{typeLabel(row.type)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(row.due_date)}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900 dark:text-white">{formatIdrFromApi(row.total_amount)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold", statusMeta.classes)}>{statusMeta.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button asChild variant="secondary" size="icon" className="rounded-md">
                            <Link href={`/portal/faktur/${row.id}`} aria-label={`Lihat detail faktur ${row.invoice_number}`}>
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
                <InvoiceCard row={row} />
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
          Menampilkan {rows.length} dari {meta.total} faktur
        </p>
      )}
    </div>
    </TooltipProvider>
  );
}
