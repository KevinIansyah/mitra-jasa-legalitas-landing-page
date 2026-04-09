import type { PaginationMeta } from "@/lib/types/api";

export type ProposalStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";

export type ProposalItem = {
  id: number;
  proposal_id: number;
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

export type Proposal = {
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
  status: ProposalStatus;
  notes: string | null;
  rejected_reason: string | null;
  file_path: string | null;
  file_url?: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  items: ProposalItem[];
};

export type ProposalsListResult = {
  data: Proposal[];
} & Partial<PaginationMeta> &
  Partial<Pick<PaginationMeta, "current_page" | "last_page" | "total" | "per_page" | "from" | "to">>;
