"use client";

import { useMemo, useState } from "react";
import type { InvoiceDetail, InvoicePayment } from "@/lib/types/invoice";
import { InvoicePaymentModal } from "./invoice-payment-modal";
import { CheckCircle2 } from "lucide-react";

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
            {pdf ? (
              <a href={pdf} target="_blank" rel="noopener noreferrer" className={invoiceToolbarPrimaryBase}>
                Unduh Faktur
              </a>
            ) : null}
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
        {pdf ? (
          <a href={pdf} target="_blank" rel="noopener noreferrer" className={invoiceToolbarPrimaryBase}>
            Unduh Faktur
          </a>
        ) : null}
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
    return pdf ? (
      <a href={pdf} target="_blank" rel="noopener noreferrer" className={invoiceToolbarPrimaryBase}>
        Unduh Faktur
      </a>
    ) : null;
  }

  return (
    <div>
      <div className={invoiceToolbarRow}>
        {pdf ? (
          <a href={pdf} target="_blank" rel="noopener noreferrer" className={invoiceToolbarPrimaryBase}>
            Unduh Faktur
          </a>
        ) : null}
        <button type="button" className={invoiceToolbarPrimaryBase} onClick={() => setModal("create")}>
          Catat pembayaran
        </button>
      </div>
      <InvoicePaymentModal open={modal === "create"} onClose={() => setModal(null)} mode="create" invoice={invoice} />
    </div>
  );
}
