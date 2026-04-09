import { apiServer } from "@/lib/api/server";
import type { QuoteRequestDetail, QuotesListResult } from "@/lib/types/quote-request";
import { normalizeQuoteDetail, normalizeQuotesListResult } from "./quotes-normalize";

export async function getQuotesPage(page = 1): Promise<QuotesListResult> {
  const search = new URLSearchParams({ page: String(page) });
  const raw = await apiServer.get<unknown>(`/quotes?${search.toString()}`);
  return normalizeQuotesListResult(raw);
}

export async function getQuoteById(id: string): Promise<QuoteRequestDetail | null> {
  try {
    const raw = await apiServer.get<unknown>(`/quotes/${encodeURIComponent(id)}`);
    return normalizeQuoteDetail(raw);
  } catch {
    return null;
  }
}
