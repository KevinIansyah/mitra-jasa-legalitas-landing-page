import { apiClient } from "@/lib/api/client";
import type { QuoteRequest, QuoteRequestDetail, QuotesListResult } from "@/lib/types/quote-request";
import { normalizeQuoteDetail, normalizeQuotesListResult } from "./quotes-normalize";

export type CreateQuotePayload = {
  service_id: number;
  service_package_id: number;
  project_name: string;
  description: string;
  business_type: string;
  business_legal_status: string;
  timeline: string;
  budget_range: string;
  source: "portal";
  notes?: string | null;
};

export async function postQuote(body: CreateQuotePayload): Promise<QuoteRequest> {
  return apiClient.post<QuoteRequest>("/quotes", body);
}

export async function fetchQuotesPage(page = 1): Promise<QuotesListResult> {
  const search = new URLSearchParams({ page: String(page) });
  const raw = await apiClient.get<unknown>(`/quotes?${search.toString()}`);
  return normalizeQuotesListResult(raw);
}

export async function fetchQuoteById(id: string): Promise<QuoteRequestDetail | null> {
  try {
    const raw = await apiClient.get<unknown>(`/quotes/${encodeURIComponent(id)}`);
    return normalizeQuoteDetail(raw);
  } catch {
    return null;
  }
}
