import { apiServer } from "@/lib/api/server";
import type { Proposal, ProposalsListResult } from "@/lib/types/proposal";
import { normalizeProposalsListResult } from "./proposals-normalize";

export async function getProposalsPage(page = 1): Promise<ProposalsListResult> {
  const search = new URLSearchParams({ page: String(page) });
  const raw = await apiServer.get<unknown>(`/proposals?${search.toString()}`);
  return normalizeProposalsListResult(raw);
}

export async function getProposalById(id: string): Promise<Proposal | null> {
  try {
    return await apiServer.get<Proposal>(`/proposals/${encodeURIComponent(id)}`);
  } catch {
    return null;
  }
}
