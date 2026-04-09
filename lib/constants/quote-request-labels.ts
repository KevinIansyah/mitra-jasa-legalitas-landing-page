import type { QuoteBudgetRange, QuoteSource, QuoteTimeline } from "@/lib/types/quote-request";

const TIMELINE_LABELS: Record<QuoteTimeline, string> = {
  normal: "Normal",
  priority: "Prioritas",
  express: "Ekspres",
};

export function getQuoteTimelineLabel(code: string): string {
  return TIMELINE_LABELS[code as QuoteTimeline] ?? code;
}

const BUDGET_LABELS: Record<QuoteBudgetRange, string> = {
  under_5jt: "< Rp5 jt",
  "5_10jt": "Rp5–10 jt",
  "10_25jt": "Rp10–25 jt",
  "25_50jt": "Rp25–50 jt",
  above_50jt: "> Rp50 jt",
};

export function getQuoteBudgetLabel(code: string): string {
  return BUDGET_LABELS[code as QuoteBudgetRange] ?? code;
}

const SOURCE_LABELS: Record<QuoteSource, string> = {
  portal: "Portal",
  whatsapp: "WhatsApp",
  referral: "Rujukan",
  other: "Lainnya",
};

export function getQuoteSourceLabel(code: string): string {
  return SOURCE_LABELS[code as QuoteSource] ?? code;
}
