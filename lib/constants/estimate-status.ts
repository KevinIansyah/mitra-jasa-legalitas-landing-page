import type { EstimateStatus } from "@/lib/types/estimate";

export const ESTIMATE_STATUS_ENTRIES: ReadonlyArray<{
  value: EstimateStatus;
  label: string;
  classes: string;
}> = [
  { value: "draft", label: "Draft", classes: "bg-slate-600 text-white" },
  { value: "sent", label: "Terkirim", classes: "bg-brand-blue text-white" },
  { value: "accepted", label: "Diterima", classes: "bg-emerald-600 text-white" },
  { value: "rejected", label: "Ditolak", classes: "bg-destructive text-white" },
  { value: "expired", label: "Kedaluwarsa", classes: "bg-amber-600 text-white" },
];

export function getEstimateStatusMeta(status: string): {
  value: EstimateStatus | string;
  label: string;
  classes: string;
} {
  const found = ESTIMATE_STATUS_ENTRIES.find((s) => s.value === status);
  if (found) return found;
  return {
    value: status,
    label: status,
    classes: "bg-slate-500 text-white dark:bg-slate-600",
  };
}
