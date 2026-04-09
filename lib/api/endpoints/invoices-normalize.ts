import type { Invoice, InvoicesListResult } from "@/lib/types/invoice";

/**
 * GET /invoices kadang hanya mengembalikan `data` sebagai array (tanpa `meta`).
 * `extractData` pada client/server mengembalikan array mentah → perlu dibentuk jadi InvoicesListResult.
 */
export function normalizeInvoicesListResult(raw: unknown): InvoicesListResult {
  if (Array.isArray(raw)) {
    const data = raw as Invoice[];
    const n = data.length;
    return {
      data,
      current_page: 1,
      last_page: 1,
      per_page: Math.max(n, 1),
      total: n,
      from: n ? 1 : null,
      to: n || null,
    };
  }

  if (
    raw &&
    typeof raw === "object" &&
    "data" in raw &&
    Array.isArray((raw as { data: unknown }).data)
  ) {
    const r = raw as Partial<InvoicesListResult> & { data: Invoice[] };
    const data = r.data;
    const n = data.length;
    const hasMeta =
      typeof r.current_page === "number" &&
      typeof r.last_page === "number" &&
      typeof r.total === "number";

    if (hasMeta) {
      return r as InvoicesListResult;
    }

    return {
      ...r,
      data,
      current_page: r.current_page ?? 1,
      last_page: r.last_page ?? 1,
      per_page: r.per_page ?? Math.max(n, 1),
      total: r.total ?? n,
      from: r.from ?? (n ? 1 : null),
      to: r.to ?? (n ? n : null),
    };
  }

  return {
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 0,
    total: 0,
    from: null,
    to: null,
  };
}
