import type { DocumentStatus } from "@/lib/types/project";

/** Badge solid + teks putih, pola sama seperti faktur / proposal. */
const DOCUMENT_STATUSES: ReadonlyArray<{
  value: DocumentStatus;
  label: string;
  classes: string;
}> = [
  { value: "not_uploaded", label: "Belum diunggah", classes: "bg-slate-600 text-white" },
  { value: "pending_review", label: "Menunggu review", classes: "bg-amber-600 text-white" },
  { value: "uploaded", label: "Terunggah", classes: "bg-brand-blue text-white" },
  { value: "verified", label: "Terverifikasi", classes: "bg-emerald-600 text-white" },
  { value: "rejected", label: "Ditolak", classes: "bg-red-500 text-white" },
];

export function getProjectDocumentStatusMeta(status: string): {
  value: DocumentStatus | string;
  label: string;
  classes: string;
} {
  const found = DOCUMENT_STATUSES.find((s) => s.value === status);
  if (found) return found;
  return {
    value: status,
    label: status.replaceAll("_", " "),
    classes: "bg-slate-500 text-white dark:bg-slate-600",
  };
}
