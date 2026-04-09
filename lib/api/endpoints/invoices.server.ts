import { apiServer } from "@/lib/api/server";
import type { InvoiceDetail, InvoicesListResult } from "@/lib/types/invoice";
import { normalizeInvoicesListResult } from "./invoices-normalize";

export async function getInvoicesPage(page = 1): Promise<InvoicesListResult> {
  const search = new URLSearchParams({ page: String(page) });
  const raw = await apiServer.get<unknown>(`/invoices?${search.toString()}`);
  return normalizeInvoicesListResult(raw);
}

export async function getInvoiceById(id: string): Promise<InvoiceDetail | null> {
  try {
    return await apiServer.get<InvoiceDetail>(`/invoices/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}
