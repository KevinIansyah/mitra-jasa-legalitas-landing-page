import { apiClient } from "@/lib/api/client";
import type { Estimate, EstimatesListResult } from "@/lib/types/estimate";
import { normalizeEstimatesListResult } from "./estimates-normalize";

export async function fetchEstimatesPage(page = 1): Promise<EstimatesListResult> {
  const search = new URLSearchParams({ page: String(page) });
  const raw = await apiClient.get<unknown>(`/estimates?${search.toString()}`);
  return normalizeEstimatesListResult(raw);
}

export async function fetchEstimateById(id: string): Promise<Estimate | null> {
  try {
    return await apiClient.get<Estimate>(`/estimates/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}

export type UpdateEstimateStatusPayload = {
  status: "accepted" | "rejected";
  rejected_reason?: string | null;
};

export async function patchEstimateStatus(
  estimateId: number | string,
  payload: UpdateEstimateStatusPayload,
): Promise<Estimate> {
  return apiClient.patch<Estimate>(`/estimates/${encodeURIComponent(String(estimateId))}/status`, payload);
}
