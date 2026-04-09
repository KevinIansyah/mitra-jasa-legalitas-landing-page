import { apiClient } from "@/lib/api/client";
import type { InvoicesListResult } from "@/lib/types/invoice";
import { normalizeInvoicesListResult } from "./invoices-normalize";

export async function fetchInvoicesPage(page = 1): Promise<InvoicesListResult> {
  const search = new URLSearchParams({ page: String(page) });
  const raw = await apiClient.get<unknown>(`/invoices?${search.toString()}`);
  return normalizeInvoicesListResult(raw);
}
