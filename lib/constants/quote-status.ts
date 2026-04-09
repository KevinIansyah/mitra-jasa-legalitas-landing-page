import type { QuoteStatus } from "@/lib/types/quote-request";

export const QUOTE_STATUSES: ReadonlyArray<{
  value: QuoteStatus;
  label: string;
  classes: string;
}> = [
  { value: "pending", label: "Menunggu konfirmas tim", classes: "bg-amber-600 text-white" },
  { value: "contacted", label: "Tim telah menghubungi", classes: "bg-brand-blue text-white" },
  { value: "estimated", label: "Estimasi sudah dibuat", classes: "bg-violet-600 text-white" },
  { value: "accepted", label: "Permintaan disetujui", classes: "bg-emerald-600 text-white" },
  { value: "rejected", label: "Permintaan ditolak", classes: "bg-destructive text-white" },
  { value: "converted", label: "Sudah menjadi proyek", classes: "bg-teal-600 text-white" },
];

export function getQuoteStatusMeta(status: string): {
  value: QuoteStatus | string;
  label: string;
  classes: string;
} {
  const found = QUOTE_STATUSES.find((s) => s.value === status);
  if (found) return found;
  return {
    value: status,
    label: status,
    classes: "bg-slate-500 text-white dark:bg-slate-600",
  };
}
