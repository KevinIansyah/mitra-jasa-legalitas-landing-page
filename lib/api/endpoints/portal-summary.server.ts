import { apiServer } from "@/lib/api/server";
import type { PortalSummary } from "@/lib/types/portal-summary";

export async function getPortalSummary(): Promise<PortalSummary | null> {
  try {
    return await apiServer.get<PortalSummary>("/summary");
  } catch {
    return null;
  }
}
