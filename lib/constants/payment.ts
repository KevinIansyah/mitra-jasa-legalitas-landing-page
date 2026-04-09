
export const PAYMENT_STATUSES = [
  { value: "pending", label: "Menunggu", classes: "bg-yellow-500 text-white" },
  { value: "verified", label: "Terverifikasi", classes: "bg-emerald-500 text-white" },
  { value: "rejected", label: "Ditolak", classes: "bg-red-500 text-white" },
] as const;

export const PAYMENT_STATUSES_MAP = Object.fromEntries(PAYMENT_STATUSES.map((item) => [item.value, item])) as Record<
  string,
  { label: string; classes: string }
>;

export function getPaymentStatusMeta(status: string): { label: string; classes: string } {
  return PAYMENT_STATUSES_MAP[status] ?? { label: status, classes: "bg-slate-500 text-white" };
}
  
export const PAYMENT_METHODS = [
  { value: "transfer", label: "Transfer bank", classes: "bg-blue-600 text-white" },
  { value: "cash", label: "Tunai", classes: "bg-green-600 text-white" },
  { value: "qris", label: "QRIS", classes: "bg-purple-600 text-white" },
  { value: "virtual_account", label: "Virtual account", classes: "bg-indigo-600 text-white" },
  { value: "ewallet", label: "E-wallet", classes: "bg-pink-600 text-white" },
  { value: "credit_card", label: "Kartu kredit", classes: "bg-sky-600 text-white" },
  { value: "debit_card", label: "Kartu debit", classes: "bg-cyan-600 text-white" },
  { value: "other", label: "Lainnya", classes: "bg-gray-500 text-white" },
] as const;

export const PAYMENT_METHODS_MAP = Object.fromEntries(PAYMENT_METHODS.map((item) => [item.value, item])) as Record<
  string,
  { label: string; classes: string }
>;

export function getPaymentMethodLabel(value: string): string {
  return PAYMENT_METHODS_MAP[value]?.label ?? value;
}
