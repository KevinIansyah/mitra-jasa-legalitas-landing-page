
import { apiClient } from '@/lib/api/client';
import type {
  CityListItem,
  ServiceCategoryOption,
  ServicesByCityData,
  ServicesListData,
} from '@/lib/types/service';

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
  for (const priceRangeId of params.price ?? []) {
    sp.append('price[]', priceRangeId);
  }

  const sortKey = params.sort;
  if (sortKey) {
    const apiSort = SORT_TO_API[sortKey] ?? sortKey;
    sp.set('sort', apiSort);
  }

  const q = sp.toString();
  return `/services${q ? `?${q}` : ''}`;
}
  
export function buildServicesByCityPath(
  citySlug: string,
  params: ServicesListParams,
): string {
  const sp = new URLSearchParams();

  for (const slug of params.category ?? []) {
    sp.append('category[]', slug);
  }
  for (const priceRangeId of params.price ?? []) {
    sp.append('price[]', priceRangeId);
  }

  const sortKey = params.sort;
  if (sortKey) {
    const apiSort = SORT_TO_API[sortKey] ?? sortKey;
    sp.set('sort', apiSort);
  }

  const q = sp.toString();
  return `/services/cities/${encodeURIComponent(citySlug)}${q ? `?${q}` : ''}`;
}

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
