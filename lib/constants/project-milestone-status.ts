import type { MilestoneStatus } from "@/lib/types/project";

/** Badge solid + teks putih, pola sama seperti faktur / proposal. */
const MILESTONE_STATUSES: ReadonlyArray<{
  value: MilestoneStatus;
  label: string;
  classes: string;
}> = [
  { value: "not_started", label: "Belum dimulai", classes: "bg-slate-600 text-white" },
  { value: "in_progress", label: "Berlangsung", classes: "bg-brand-blue text-white" },
  { value: "completed", label: "Selesai", classes: "bg-emerald-600 text-white" },
  { value: "blocked", label: "Terhambat", classes: "bg-amber-600 text-white" },
  { value: "cancelled", label: "Dibatalkan", classes: "bg-destructive text-white" },
];

export function getProjectMilestoneStatusMeta(status: string): {
  value: MilestoneStatus | string;
  label: string;
  classes: string;
} {
  const found = MILESTONE_STATUSES.find((s) => s.value === status);
  if (found) return found;
  return {
    value: status,
    label: status.replaceAll("_", " "),
    classes: "bg-slate-500 text-white dark:bg-slate-600",
  };
}
