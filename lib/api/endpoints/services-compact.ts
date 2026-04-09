import { apiClient } from "@/lib/api/client";
import type { ServiceCompact, ServicePackagesResponse } from "@/lib/types/services-compact";

/** GET /services/compact */
export async function fetchServicesCompact(): Promise<{ services: ServiceCompact[] }> {
  return apiClient.get<{ services: ServiceCompact[] }>("/services/compact");
}

/** GET /services/:id/packages */
export async function fetchServicePackages(serviceId: number): Promise<ServicePackagesResponse> {
  return apiClient.get<ServicePackagesResponse>(`/services/${serviceId}/packages`);
}
