/**
 * Layanan — path builder & fetch klien (`apiClient`), dipakai komponen `'use client'`.
 * Untuk RSC / Server Actions gunakan `service.server.ts`.
 */

import { apiClient } from '@/lib/api/client';
import type {
  CityListItem,
  ServiceCategoryOption,
  ServicesByCityData,
  ServicesListData,
} from '@/lib/types/service';

// ── Query GET /services (list layanan) ─────────────────────────────────────

export type ServicesListParams = {
  category?: string[];
  price?: string[];
  sort?: string;
};

const SORT_TO_API: Record<string, string> = {
  popular: 'popular',
  name: 'name_asc',
  price_asc: 'price_asc',
  price_desc: 'price_desc',
  latest: 'latest',
};

export function buildServicesListPath(params: ServicesListParams): string {
  const sp = new URLSearchParams();

  for (const slug of params.category ?? []) {
    sp.append('category[]', slug);
  }
  for (const p of params.price ?? []) {
    sp.append('price[]', p);
  }

  const sortKey = params.sort;
  if (sortKey) {
    const apiSort = SORT_TO_API[sortKey] ?? sortKey;
    sp.set('sort', apiSort);
  }

  const q = sp.toString();
  return `/services${q ? `?${q}` : ''}`;
}

/** GET /services/cities/{citySlug} — query sama seperti list global */
export function buildServicesByCityPath(
  citySlug: string,
  params: ServicesListParams,
): string {
  const sp = new URLSearchParams();

  for (const slug of params.category ?? []) {
    sp.append('category[]', slug);
  }
  for (const p of params.price ?? []) {
    sp.append('price[]', p);
  }

  const sortKey = params.sort;
  if (sortKey) {
    const apiSort = SORT_TO_API[sortKey] ?? sortKey;
    sp.set('sort', apiSort);
  }

  const q = sp.toString();
  return `/services/cities/${encodeURIComponent(citySlug)}${q ? `?${q}` : ''}`;
}

// ── Client API ─────────────────────────────────────────────────────────────

export async function fetchServicesList(
  params: ServicesListParams = {},
): Promise<ServicesListData> {
  return apiClient.get<ServicesListData>(buildServicesListPath(params));
}

export async function fetchServicesByCity(
  citySlug: string,
  params: ServicesListParams = {},
): Promise<ServicesByCityData> {
  return apiClient.get<ServicesByCityData>(
    buildServicesByCityPath(citySlug, params),
  );
}

export async function fetchServiceCategories(): Promise<ServiceCategoryOption[]> {
  return apiClient.get<ServiceCategoryOption[]>('/service-categories');
}

export async function fetchCities(): Promise<CityListItem[]> {
  return apiClient.get<CityListItem[]>('/cities');
}
