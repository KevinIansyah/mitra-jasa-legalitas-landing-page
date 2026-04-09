import type { Proposal, ProposalsListResult } from "@/lib/types/proposal";

/**
 * GET /proposals tanpa `meta` → `extractData` mengembalikan array mentah.
 */
export function normalizeProposalsListResult(raw: unknown): ProposalsListResult {
  if (Array.isArray(raw)) {
    const data = raw as Proposal[];
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
    const r = raw as Partial<ProposalsListResult> & { data: Proposal[] };
    const data = r.data;
    const n = data.length;
    const hasMeta =
      typeof r.current_page === "number" &&
      typeof r.last_page === "number" &&
      typeof r.total === "number";

    if (hasMeta) {
      return r as ProposalsListResult;
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
