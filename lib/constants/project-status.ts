export const PROJECT_STATUSES = [
  { value: "planning", label: "Perencanaan", classes: "bg-brand-blue text-white" },
  { value: "in_progress", label: "Berlangsung", classes: "bg-amber-500 text-white dark:bg-amber-600" },
  { value: "on_hold", label: "Ditangguhkan", classes: "bg-slate-400 text-white dark:bg-slate-500" },
  { value: "completed", label: "Selesai", classes: "bg-emerald-500 text-white dark:bg-emerald-600" },
  { value: "cancelled", label: "Dibatalkan", classes: "bg-destructive text-white" },
] as const;

export type ProjectStatusValue = (typeof PROJECT_STATUSES)[number]["value"];

export function getProjectStatusMeta(status: string) {
  const found = PROJECT_STATUSES.find((s) => s.value === status);
  return found ?? { value: status as ProjectStatusValue, label: status, classes: "bg-slate-500 text-white" };
}
