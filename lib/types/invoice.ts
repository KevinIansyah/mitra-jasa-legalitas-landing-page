import type { PaginationMeta } from "@/lib/types/api";

export type InvoiceProject = {
  id: number;
  name: string;
  status: string;
} | null;

export type InvoiceCustomerBrief = {
  id: number;
  name: string;
  email: string;
} | null;

export type InvoiceProjectDetail = {
  id: number;
  name: string;
  status: string;
  customer_id?: number | null;
} | null;

export type InvoiceLineItem = {
  id: number;
  invoice_id: number;
  expense_id: number | null;
  description: string;
  item_details: string[] | null;
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

export type InvoicePayment = {
  id: number;
  invoice_id: number;
  receipt_number: string | null;
  amount: string;
  payment_date: string;
  payment_method: string;
  reference_number: string | null;
  proof_file: string | null;
  status: string;
  notes: string | null;
  rejection_reason: string | null;
  file_path: string | null;
  verified_by: number | null;
  verified_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  receipt_url: string | null;
  proof_file_url: string | null;
};

export type InvoiceDetail = {
  id: number;
  project_id: number | null;
  customer_id: number | null;
  invoice_number: string;
  type: string;
  invoice_date: string;
  percentage: string;
  subtotal: string;
  tax_percent: string;
  tax_amount: string;
  discount_percent: string;
  discount_amount: string;
  total_amount: string;
  due_date: string;
  paid_at: string | null;
  status: string;
  notes: string | null;
  payment_instructions: string | null;
  file_path: string | null;
  file_url?: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  total_paid?: number;
  remaining_amount?: number;
  formatted_type?: string;
  customer?: InvoiceCustomerBrief;
  project?: InvoiceProjectDetail;
  items: InvoiceLineItem[];
  payments: InvoicePayment[];
};

export type Invoice = {
  id: number;
  project_id: number | null;
  customer_id: number | null;
  invoice_number: string;
  type: string;
  invoice_date: string;
  percentage: string;
  subtotal: string;
  tax_percent: string;
  tax_amount: string;
  discount_percent: string;
  discount_amount: string;
  total_amount: string;
  due_date: string;
  paid_at: string | null;
  status: string;
  notes: string | null;
  payment_instructions: string | null;
  file_path: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  project: InvoiceProject;
};

export type InvoicesListResult = {
  data: Invoice[];
} & PaginationMeta;
