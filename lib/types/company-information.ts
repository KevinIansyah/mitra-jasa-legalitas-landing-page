import type { NavigationSocialMedia } from '@/lib/types/navigation';

export interface CompanyIdentity {
  name: string;
  tagline: string | null;
  logo: string | null;
  favicon: string | null;
  website: string | null;
}

export interface CompanyContactInfo {
  phone: string;
  phone_alt: string | null;
  whatsapp: string;
  email: string;
  email_support: string | null;
}

export interface CompanyAddressInfo {
  full: string;
  street: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  maps_embed_url: string | null;
  maps_coordinates: string | null;
  maps_place_id: string | null;
}

export type BusinessHoursDay =
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat'
  | 'sun';

export type BusinessHours = Partial<
  Record<BusinessHoursDay, string | null>
>;

export interface CompanyInformationStats {
  total_clients: number;
  total_documents: number;
  rating: number;
  total_reviews: number;
  years_experience: number;
  total_services: number;
}

export interface CompanyLegalInfo {
  entity_type: string;
  npwp: string | null;
  registration_number: string | null;
  nib: string | null;
}

export interface CompanyInformationData {
  company_identity: CompanyIdentity;
  contact: CompanyContactInfo;
  address: CompanyAddressInfo;
  business_hours: BusinessHours;
  stats: CompanyInformationStats;
  legal: CompanyLegalInfo;
  social_media: NavigationSocialMedia | null;
  schema_org: Record<string, unknown> | null;
}

export interface ContactMessagePayload {
  name: string;
  whatsapp_number: string;
  email?: string | null;
  topic?: string | null;
  message: string;
}
