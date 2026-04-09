import type { ReactNode } from "react";
import { Banknote } from "lucide-react";
import { getInvoicePaymentStatusMeta, getInvoiceStatusMeta } from "@/lib/constants/invoice-status";
import { getPaymentMethodLabel } from "@/lib/constants/payment";
import type { InvoiceDetail, InvoicePayment } from "@/lib/types/invoice";
import { cn, formatDate, formatIdrFromApi, resolvePublicFileUrl } from "@/lib/utils";
import { PaymentDocumentLinks } from "./payment-document-links";
import { PaymentTableTooltipShell } from "./payment-table-tooltip-shell";
import { PortalDetailSectionHeading } from "@/app/portal/_components/portal-detail-section-heading";
import { PortalEmptyState } from "@/app/portal/_components/portal-empty-state";
import {
  PORTAL_DATA_TABLE,
  PORTAL_DATA_TABLE_BODY,
  PORTAL_DATA_TABLE_HEAD,
  PORTAL_DATA_TABLE_WRAP,
} from "@/app/portal/_components/portal-table-classes";
import { InvoicePaymentActions } from "./invoice-payment-actions";

function resolveInvoicePdfUrl(inv: InvoiceDetail): string | null {
  const direct = inv.file_url?.trim();
  if (direct && (direct.startsWith("http://") || direct.startsWith("https://"))) return direct;
  return resolvePublicFileUrl(inv.file_path);
}

function formatMoneyNum(n: number | undefined): string {
  if (n === undefined || Number.isNaN(n)) return "-";
  return formatIdrFromApi(String(n));
}

type Props = {
  invoice: InvoiceDetail;
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

export function InvoiceDetailView({ invoice: inv }: Props) {
  const pdfHref = resolveInvoicePdfUrl(inv);
  const statusMeta = getInvoiceStatusMeta(inv.status);
  const items = [...(inv.items ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const paymentById = new Map<number, InvoicePayment>();
  for (const p of inv.payments ?? []) {
    if (!paymentById.has(p.id)) paymentById.set(p.id, p);
  }
  const payments = [...paymentById.values()].sort((a, b) => a.id - b.id);

  const typeLabel = inv.formatted_type?.trim() || (inv.type === "dp" ? "Down Payment" : inv.type === "additional" ? "Tambahan" : inv.type);

  return (
    <div className="space-y-10">
      <InvoicePaymentActions invoice={inv} pdfHref={pdfHref} />

      <section className="space-y-6">
        <PortalDetailSectionHeading
          title="Informasi faktur"
          description="Identitas tagihan, jadwal, nominal, dan instruksi pembayaran."
        />
        <Field label="Status">
          <span className={cn("inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold", statusMeta.classes)}>{statusMeta.label}</span>
        </Field>

        <Field label="No. faktur">
          <span className="font-mono">{inv.invoice_number}</span>
        </Field>

        <Field label="Jenis">
          <span>{typeLabel}</span>
        </Field>

        {inv.project?.name ? (
          <Field label="Proyek">
            <span>{inv.project.name}</span>
          </Field>
        ) : null}

        {inv.customer?.name ? (
          <Field label="Pelanggan">
            <div>
              <p>{inv.customer.name}</p>
              {inv.customer.email ? <p className="text-muted-foreground">{inv.customer.email}</p> : null}
            </div>
          </Field>
        ) : null}

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Tanggal faktur">{formatDate(inv.invoice_date)}</Field>
          <Field label="Jatuh tempo">{formatDate(inv.due_date)}</Field>
        </div>

        {inv.paid_at ? <Field label="Dibayar pada">{formatDate(inv.paid_at)}</Field> : null}

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Total tagihan">{formatIdrFromApi(inv.total_amount)}</Field>
          <Field label="Total terbayar">{formatMoneyNum(inv.total_paid)}</Field>
        </div>

        <Field label="Sisa tagihan">{formatMoneyNum(inv.remaining_amount)}</Field>

        {inv.payment_instructions?.trim() ? (
          <Field label="Instruksi pembayaran">
            <p className="whitespace-pre-wrap text-muted-foreground">{inv.payment_instructions}</p>
          </Field>
        ) : null}

        {inv.notes?.trim() ? (
          <Field label="Catatan">
            <p className="whitespace-pre-wrap text-muted-foreground">{inv.notes}</p>
          </Field>
        ) : null}
      </section>

      <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-white/10">
        <PortalDetailSectionHeading
          title="Item faktur"
          description="Rincian layanan atau barang, kuantitas, dan perhitungan subtotal hingga total."
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
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <div>{row.description}</div>
                    {Array.isArray(row.item_details) && row.item_details.length > 0 ? (
                      <ul className="mt-1.5 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        {row.item_details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    ) : null}
                  </td>
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
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{formatIdrFromApi(inv.subtotal)}</td>
              </tr>
              {Number.parseFloat(inv.discount_amount) > 0 ? (
                <tr className="align-middle">
                  <td colSpan={5} className="px-4 py-3 text-sm text-muted-foreground">
                    Diskon ({inv.discount_percent}%)
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">−{formatIdrFromApi(inv.discount_amount)}</td>
                </tr>
              ) : null}
              <tr className="align-middle">
                <td colSpan={5} className="px-4 py-3 text-sm text-muted-foreground">
                  Pajak ({inv.tax_percent}%)
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{formatIdrFromApi(inv.tax_amount)}</td>
              </tr>
              <tr className="align-middle">
                <td colSpan={5} className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Total
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{formatIdrFromApi(inv.total_amount)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-white/10">
        <PortalDetailSectionHeading
          title="Pembayaran"
          description="Riwayat pembayaran yang dicatat beserta status verifikasi dan dokumen pendukung."
        />
        {payments.length === 0 ? (
          <PortalEmptyState
            icon={Banknote}
            title="Belum ada pembayaran"
            description="Pembayaran yang Anda kirim akan muncul di sini setelah dicatat."
          />
        ) : (
          <PaymentTableTooltipShell>
            <div className={PORTAL_DATA_TABLE_WRAP}>
              <table className={cn(PORTAL_DATA_TABLE, "min-w-[960px]")}>
                <thead className={PORTAL_DATA_TABLE_HEAD}>
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Jumlah</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Tanggal</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Metode</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Referensi</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">No. kuitansi</th>
                    <th className="min-w-[200px] px-4 py-3 font-semibold text-gray-900 dark:text-white">Catatan</th>
                    <th className="w-[88px] px-4 py-3 font-semibold text-gray-900 dark:text-white">Dokumen</th>
                  </tr>
                </thead>
                <tbody className={PORTAL_DATA_TABLE_BODY}>
                  {payments.map((pay) => {
                    const payStatus = getInvoicePaymentStatusMeta(pay.status);
                    return (
                      <tr key={pay.id} className="align-middle">
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold", payStatus.classes)}>{payStatus.label}</span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 dark:text-white">{formatIdrFromApi(pay.amount)}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(pay.payment_date)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{getPaymentMethodLabel(pay.payment_method)}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{pay.reference_number ?? "-"}</td>
                        <td className="px-4 py-3 font-mono text-sm text-muted-foreground">{pay.receipt_number?.trim() ?? "-"}</td>
                        <td className="max-w-[240px] px-4 py-3 text-sm">
                          {pay.status === "rejected" && pay.rejection_reason?.trim() ? (
                            <p className="whitespace-pre-wrap text-destructive">{pay.rejection_reason.trim()}</p>
                          ) : pay.notes?.trim() ? (
                            <p className="whitespace-pre-wrap text-muted-foreground">{pay.notes.trim()}</p>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <PaymentDocumentLinks pay={pay} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </PaymentTableTooltipShell>
        )}
      </section>
    </div>
  );
}
