import type { PaginationMeta } from "@/lib/types/api";
import type { EstimateStatus } from "@/lib/types/estimate";

export type QuoteStatus = "pending" | "contacted" | "estimated" | "accepted" | "rejected" | "converted";
export type QuoteTimeline = "normal" | "priority" | "express";
export type QuoteBudgetRange = "under_5jt" | "5_10jt" | "10_25jt" | "25_50jt" | "above_50jt";
export type QuoteSource = "portal" | "whatsapp" | "referral" | "other";

export type QuoteRequestServiceSummary = {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
};

export type QuoteRequestPackageSummary = {
  id: number;
  name: string;
  price: string;
  duration: string;
  duration_days: number;
  short_description: string | null;
};

export type QuoteRequest = {
  id: number;
  reference_number: string;
  user_id: number;
  customer_id: number | null;
  project_id: number | null;
  service_id: number;
  service_package_id: number;
  project_name: string;
  description: string;
  business_type: string;
  business_legal_status: string;
  timeline: QuoteTimeline;
  budget_range: QuoteBudgetRange;
  source: QuoteSource;
  status: QuoteStatus;
  rejected_reason: string | null;
  contacted_at: string | null;
  converted_at: string | null;
  notes: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  is_convertible: boolean;
  service: QuoteRequestServiceSummary | null;
  service_package: QuoteRequestPackageSummary | null;
  active_estimate: unknown | null;
};

export type QuotesListResult = {
  data: QuoteRequest[];
} & Partial<PaginationMeta> &
  Partial<Pick<PaginationMeta, "current_page" | "last_page" | "total" | "per_page" | "from" | "to">>;

export type QuoteRequestPackageDetail = {
  id: number;
  service_id: number;
  name: string;
  price: string;
  original_price: string | null;
  duration: string;
  duration_days: number;
  short_description: string | null;
  is_highlighted: boolean;
  badge: string | null;
  sort_order: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type QuoteNestedEstimate = {
  id: number;
  estimate_number: string;
  quote_id: number | null;
  proposal_id: number | null;
  customer_id: number | null;
  version: number;
  is_active: boolean;
  estimate_date: string;
  subtotal: string;
  tax_percent: string;
  tax_amount: string;
  discount_percent: string;
  discount_amount: string;
  total_amount: string;
  valid_until: string;
  status: EstimateStatus;
  notes: string | null;
  rejected_reason: string | null;
  file_path: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  version_label: string;
};

export type QuoteRequestDetail = Omit<QuoteRequest, "service_package" | "active_estimate"> & {
  service_package: QuoteRequestPackageDetail | null;
  estimates: QuoteNestedEstimate[];
  active_estimate: QuoteNestedEstimate | null;
};
