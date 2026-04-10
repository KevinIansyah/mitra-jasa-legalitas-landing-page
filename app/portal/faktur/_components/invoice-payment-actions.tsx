"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import type { InvoiceDetail, InvoicePayment } from "@/lib/types/invoice";
import { ApiError } from "@/lib/types/api";
import { toast } from "sonner";
import { InvoicePaymentModal } from "./invoice-payment-modal";

type Props = {
  invoice: InvoiceDetail;
  pdfHref?: string | null;
};

function latestRejected(payments: InvoicePayment[]): InvoicePayment | null {
  const rejected = payments.filter((p) => p.status === "rejected");
  if (rejected.length === 0) return null;
  return [...rejected].sort((a, b) => b.id - a.id)[0] ?? null;
}

const invoiceToolbarSkin =
  "items-center justify-center gap-2 rounded-full bg-brand-blue px-4 py-2.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90";

const invoiceToolbarPrimaryBase = `inline-flex ${invoiceToolbarSkin}`;

const invoiceToolbarRow = "flex flex-wrap items-center gap-2";

function safeInvoiceFileStem(invoiceNumber: string): string {
  return invoiceNumber.replace(/[/\\?%*:|"<>]/g, "-").trim() || "faktur";
}

function InvoicePdfDownloadButton({ pdfHref, invoiceNumber, className }: { pdfHref: string; invoiceNumber: string; className: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      className={className}
      disabled={loading}
      onClick={() => {
        setLoading(true);
        try {
          apiClient.downloadPublicFile(pdfHref, `Faktur-${safeInvoiceFileStem(invoiceNumber)}.pdf`);
        } catch (e) {
          toast.error(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Tidak dapat mengunduh faktur.");
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
          Mengunduh…
        </>
      ) : (
        "Unduh Faktur"
      )}
    </button>
  );
}

export function InvoicePaymentActions({ invoice, pdfHref }: Props) {
  const [modal, setModal] = useState<"create" | "revise" | null>(null);

  const { pendingPayment, reviseTarget, canRecordNew } = useMemo(() => {
    const byId = new Map<number, InvoicePayment>();
    for (const p of invoice.payments ?? []) {
      if (!byId.has(p.id)) byId.set(p.id, p);
    }
    const payments = [...byId.values()];
    const remainingRaw = invoice.remaining_amount ?? 0;
    const hasRemaining =
      typeof remainingRaw === "number" ? remainingRaw > 0 : Number(remainingRaw) > 0;

    const hasPending = payments.some((p) => p.status === "pending");
    const hasRejected = payments.some((p) => p.status === "rejected");
    const rejectedLatest = latestRejected(payments);
    const isCancelled = invoice.status === "cancelled";
    const isFullySettled =
      isCancelled || (invoice.status === "paid" && !hasRemaining);

    const canRecordNew =
      !isFullySettled && hasRemaining && !hasPending && !hasRejected;

    return {
      pendingPayment: hasPending,
      reviseTarget: rejectedLatest,
      canRecordNew,
    };
  }, [invoice]);

  const pdf = pdfHref?.trim();
  const showTopRow = Boolean(pdf || reviseTarget || canRecordNew);

  if (reviseTarget) {
    return (
      <div className="space-y-3">
        {showTopRow ? (
          <div className={invoiceToolbarRow}>
            {pdf ? <InvoicePdfDownloadButton pdfHref={pdf} invoiceNumber={invoice.invoice_number} className={invoiceToolbarPrimaryBase} /> : null}
            <button type="button" className={invoiceToolbarPrimaryBase} onClick={() => setModal("revise")}>
              Revisi pembayaran
            </button>
          </div>
        ) : null}
        <InvoicePaymentModal open={modal === "revise"} onClose={() => setModal(null)} mode="revise" invoice={invoice} revisePayment={reviseTarget} />
      </div>
    );
  }

  if (pendingPayment) {
    return (
      <div className="space-y-4">
        {pdf ? <InvoicePdfDownloadButton pdfHref={pdf} invoiceNumber={invoice.invoice_number} className={invoiceToolbarPrimaryBase} /> : null}
        <p
          className="flex w-full items-center gap-2 rounded-xl border border-emerald-600/25 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
          role="status"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          Berhasil! Bukti pembayaran Anda sedang diverifikasi. Mohon tunggu konfirmasi dari tim kami.
        </p>
      </div>
    );
  }

  if (!canRecordNew) {
    return pdf ? <InvoicePdfDownloadButton pdfHref={pdf} invoiceNumber={invoice.invoice_number} className={invoiceToolbarPrimaryBase} /> : null;
  }

  return (
    <div>
      <div className={invoiceToolbarRow}>
        {pdf ? <InvoicePdfDownloadButton pdfHref={pdf} invoiceNumber={invoice.invoice_number} className={invoiceToolbarPrimaryBase} /> : null}
        <button type="button" className={invoiceToolbarPrimaryBase} onClick={() => setModal("create")}>
          Catat pembayaran
        </button>
      </div>
      <InvoicePaymentModal open={modal === "create"} onClose={() => setModal(null)} mode="create" invoice={invoice} />
    </div>
  );
}
