import { apiServer } from "@/lib/api/server";
import type { Estimate, EstimatesListResult } from "@/lib/types/estimate";
import { normalizeEstimatesListResult } from "./estimates-normalize";

export async function getEstimatesPage(page = 1): Promise<EstimatesListResult> {
  const search = new URLSearchParams({ page: String(page) });
  const raw = await apiServer.get<unknown>(`/estimates?${search.toString()}`);
  return normalizeEstimatesListResult(raw);
}

export async function getEstimateById(id: string): Promise<Estimate | null> {
  try {
    return await apiServer.get<Estimate>(`/estimates/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}
