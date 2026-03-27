import { apiServer } from '@/lib/api/server';
import type { CompanyInformationData } from '@/lib/types/company-information';

export async function getCompanyInformation(): Promise<CompanyInformationData> {
  return apiServer.get<CompanyInformationData>('/company-information');
}
