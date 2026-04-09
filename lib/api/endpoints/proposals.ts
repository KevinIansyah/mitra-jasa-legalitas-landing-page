import { apiClient } from "@/lib/api/client";
import type { Proposal, ProposalsListResult } from "@/lib/types/proposal";
import { normalizeProposalsListResult } from "./proposals-normalize";

export async function fetchProposalsPage(page = 1): Promise<ProposalsListResult> {
  const search = new URLSearchParams({ page: String(page) });
  const raw = await apiClient.get<unknown>(`/proposals?${search.toString()}`);
  return normalizeProposalsListResult(raw);
}

export async function fetchProposalById(id: string): Promise<Proposal | null> {
  try {
    return await apiClient.get<Proposal>(`/proposals/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}

export type UpdateProposalStatusPayload = {
  status: "accepted" | "rejected";
  rejected_reason?: string | null;
};

export async function patchProposalStatus(
  proposalId: number | string,
  payload: UpdateProposalStatusPayload,
): Promise<Proposal> {
  return apiClient.patch<Proposal>(`/proposals/${encodeURIComponent(String(proposalId))}/status`, payload);
}
