/**
 * Layanan — fetch server (`apiServer`) untuk RSC & metadata.
 */

import { apiServer } from '@/lib/api/server';
import {
  buildServicesByCityPath,
  buildServicesListPath,
  type ServicesListParams,
} from '@/lib/api/endpoints/service';
import type {
  CityListItem,
  ServiceCategoryOption,
  ServiceCityPage,
  ServiceDetail,
  ServicesByCityData,
  ServicesListData,
} from '@/lib/types/service';

export async function getServiceDetail(slug: string): Promise<ServiceDetail> {
  return apiServer.get<ServiceDetail>(`/services/${slug}`);
}

export async function getServiceCityPage(
  serviceSlug: string,
  citySlug: string,
): Promise<ServiceCityPage> {
  return apiServer.get<ServiceCityPage>(`/services/${serviceSlug}/${citySlug}`);
}

export async function getServicesList(
  params: ServicesListParams = {},
): Promise<ServicesListData> {
  return apiServer.get<ServicesListData>(buildServicesListPath(params));
}

export async function getServicesByCity(
  citySlug: string,
  params: ServicesListParams = {},
): Promise<ServicesByCityData> {
  return apiServer.get<ServicesByCityData>(
    buildServicesByCityPath(citySlug, params),
  );
}

export async function getServiceCategories(): Promise<ServiceCategoryOption[]> {
  return apiServer.get<ServiceCategoryOption[]>('/service-categories');
}

export async function getCities(): Promise<CityListItem[]> {
  return apiServer.get<CityListItem[]>('/cities');
}
