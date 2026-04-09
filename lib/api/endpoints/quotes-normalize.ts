import type { EstimateStatus } from "@/lib/types/estimate";
import type {
  QuoteBudgetRange,
  QuoteNestedEstimate,
  QuoteRequest,
  QuoteRequestDetail,
  QuoteRequestPackageDetail,
  QuoteRequestPackageSummary,
  QuoteRequestServiceSummary,
  QuotesListResult,
  QuoteSource,
  QuoteStatus,
  QuoteTimeline,
} from "@/lib/types/quote-request";

function num(v: unknown, fallback = 0): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function str(v: unknown): string {
  return v == null ? "" : String(v);
}

function strNull(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function slimQuoteService(raw: unknown): QuoteRequestServiceSummary | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  return {
    id: num(r.id),
    name: str(r.name),
    slug: str(r.slug),
    short_description: strNull(r.short_description),
  };
}

function slimPackage(raw: unknown): QuoteRequestPackageSummary | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  return {
    id: num(r.id),
    name: str(r.name),
    price: str(r.price),
    duration: str(r.duration),
    duration_days: num(r.duration_days),
    short_description: strNull(r.short_description),
  };
}

function slimPackageDetail(raw: unknown): QuoteRequestPackageDetail | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  return {
    id: num(r.id),
    service_id: num(r.service_id),
    name: str(r.name),
    price: str(r.price),
    original_price: strNull(r.original_price),
    duration: str(r.duration),
    duration_days: num(r.duration_days),
    short_description: strNull(r.short_description),
    is_highlighted: Boolean(r.is_highlighted),
    badge: strNull(r.badge),
    sort_order: num(r.sort_order),
    status: str(r.status),
    created_at: str(r.created_at),
    updated_at: str(r.updated_at),
  };
}

function normalizeNestedEstimate(raw: unknown): QuoteNestedEstimate | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (r.id == null) return null;
  return {
    id: num(r.id),
    estimate_number: str(r.estimate_number),
    quote_id: r.quote_id == null ? null : num(r.quote_id),
    proposal_id: r.proposal_id == null ? null : num(r.proposal_id),
    customer_id: r.customer_id == null ? null : num(r.customer_id),
    version: num(r.version),
    is_active: Boolean(r.is_active),
    estimate_date: str(r.estimate_date),
    subtotal: str(r.subtotal),
    tax_percent: str(r.tax_percent),
    tax_amount: str(r.tax_amount),
    discount_percent: str(r.discount_percent),
    discount_amount: str(r.discount_amount),
    total_amount: str(r.total_amount),
    valid_until: str(r.valid_until),
    status: str(r.status) as EstimateStatus,
    notes: strNull(r.notes),
    rejected_reason: strNull(r.rejected_reason),
    file_path: strNull(r.file_path),
    deleted_at: strNull(r.deleted_at),
    created_at: str(r.created_at),
    updated_at: str(r.updated_at),
    version_label: str(r.version_label),
  };
}

export function normalizeQuoteDetail(raw: unknown): QuoteRequestDetail | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (r.id == null) return null;

  const base = normalizeQuoteRequestRow(raw);
  const estimatesRaw = r.estimates;
  const estimates: QuoteNestedEstimate[] = Array.isArray(estimatesRaw)
    ? estimatesRaw.map((row) => normalizeNestedEstimate(row)).filter((e): e is QuoteNestedEstimate => e != null)
    : [];

  return {
    ...base,
    service_package: slimPackageDetail(r.service_package ?? r.servicePackage),
    estimates,
    active_estimate: normalizeNestedEstimate(r.active_estimate ?? r.activeEstimate),
  };
}

export function normalizeQuoteRequestRow(raw: unknown): QuoteRequest {
  const r = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    id: num(r.id),
    reference_number: str(r.reference_number),
    user_id: num(r.user_id),
    customer_id: r.customer_id == null ? null : num(r.customer_id),
    project_id: r.project_id == null ? null : num(r.project_id),
    service_id: num(r.service_id),
    service_package_id: num(r.service_package_id),
    project_name: str(r.project_name),
    description: str(r.description),
    business_type: str(r.business_type),
    business_legal_status: str(r.business_legal_status),
    timeline: str(r.timeline) as QuoteTimeline,
    budget_range: str(r.budget_range) as QuoteBudgetRange,
    source: str(r.source) as QuoteSource,
    status: str(r.status) as QuoteStatus,
    rejected_reason: strNull(r.rejected_reason),
    contacted_at: strNull(r.contacted_at),
    converted_at: strNull(r.converted_at),
    notes: strNull(r.notes),
    deleted_at: strNull(r.deleted_at),
    created_at: str(r.created_at),
    updated_at: str(r.updated_at),
    is_convertible: Boolean(r.is_convertible),
    service: slimQuoteService(r.service),
    service_package: slimPackage(r.service_package ?? r.servicePackage),
    active_estimate: r.active_estimate ?? r.activeEstimate ?? null,
  };
}

export function normalizeQuotesListResult(raw: unknown): QuotesListResult {
  const mapRows = (rows: unknown[]): QuoteRequest[] => rows.map((row) => normalizeQuoteRequestRow(row));

  if (Array.isArray(raw)) {
    const data = mapRows(raw);
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

  if (raw && typeof raw === "object" && "data" in raw && Array.isArray((raw as { data: unknown }).data)) {
    const r = raw as Partial<QuotesListResult> & { data: unknown[] };
    const data = mapRows(r.data);
    const n = data.length;
    const hasMeta =
      typeof r.current_page === "number" && typeof r.last_page === "number" && typeof r.total === "number";

    if (hasMeta) {
      return { ...r, data } as QuotesListResult;
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
