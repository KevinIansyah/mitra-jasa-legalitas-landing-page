import type { PaginationMeta } from "@/lib/types/api";

export type EstimateStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";

export type EstimateItem = {
  id: number;
  estimate_id: number;
  description: string;
  quantity: string;
  unit_price: string;
  tax_percent: string;
  discount_percent: string;
  subtotal: string;
  discount_amount: string;
  tax_amount: string;
  total_amount: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type EstimateProposalSummary = {
  id: number;
  proposal_number: string;
  customer_id: number | null;
  project_name: string;
  subtotal: string;
  tax_percent: string;
  tax_amount: string;
  discount_percent: string;
  discount_amount: string;
  total_amount: string;
  proposal_date: string;
  valid_until: string;
  status: string;
  notes: string | null;
  rejected_reason: string | null;
  file_path: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
} | null;

export type EstimateQuoteSummary = {
  id: number;
  reference_number?: string | null;
  project_name?: string | null;
} | null;

export type Estimate = {
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
  file_url?: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  version_label: string;
  items: EstimateItem[];
  proposal: EstimateProposalSummary;
  quote: EstimateQuoteSummary;
};

export type EstimatesListResult = {
  data: Estimate[];
} & Partial<PaginationMeta> &
  Partial<Pick<PaginationMeta, "current_page" | "last_page" | "total" | "per_page" | "from" | "to">>;
