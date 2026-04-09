/** Badge solid + teks putih, pola sama seperti proyek / proposal. */
export const INVOICE_STATUSES = [
  { value: "paid", label: "Lunas", classes: "bg-emerald-600 text-white" },
  { value: "sent", label: "Terkirim", classes: "bg-brand-blue text-white" },
  { value: "draft", label: "Draft", classes: "bg-slate-600 text-white" },
  { value: "overdue", label: "Jatuh tempo", classes: "bg-amber-600 text-white" },
  { value: "cancelled", label: "Dibatalkan", classes: "bg-destructive text-white" },
] as const;

export function getInvoiceStatusMeta(status: string): { value: string; label: string; classes: string } {
  const found = INVOICE_STATUSES.find((s) => s.value === status);
  if (found) return found;
  return { value: status, label: status, classes: "bg-slate-500 text-white dark:bg-slate-600" };
}

export { getPaymentStatusMeta as getInvoicePaymentStatusMeta } from "./payment";
