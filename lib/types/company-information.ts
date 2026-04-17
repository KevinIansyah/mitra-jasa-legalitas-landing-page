import type { NavigationSocialMedia } from "@/lib/types/navigation";

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

export type BusinessHoursDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type BusinessHours = Partial<Record<BusinessHoursDay, string | null>>;

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

export interface SeoOpenGraphDefaults {
  "og:type": string;
  "og:site_name": string;
  "og:locale": string;
  "og:image"?: string;
}

export interface SeoTwitterDefaults {
  "twitter:card": string;
  "twitter:image"?: string;
}

export interface SeoJsonLdIds {
  organization: string;
  website: string;
}

export interface SeoJsonLdBase {
  "@context": string;
  "@graph": Record<string, unknown>[];
  _ids: SeoJsonLdIds;
}

export interface SeoDefaults {
  title_template: string;
  default_description: string | null;
  default_keywords: string | null;
  default_og_image: string | null;
  canonical_base: string;
  locale: string;
  language: string;
  site_name: string;
  robots: string;
  hreflang_base: Record<string, string>;
  open_graph_defaults: SeoOpenGraphDefaults;
  twitter_defaults: SeoTwitterDefaults;
  json_ld_base: SeoJsonLdBase;
}

export interface CompanyInformationData {
  company_identity: CompanyIdentity;
  contact: CompanyContactInfo;
  address: CompanyAddressInfo;
  business_hours: BusinessHours;
  stats: CompanyInformationStats;
  legal: CompanyLegalInfo;
  social_media: NavigationSocialMedia | null;
  seo_defaults: SeoDefaults;
}

export interface ContactMessagePayload {
  name: string;
  whatsapp_number: string;
  email?: string | null;
  topic?: string | null;
  message: string;
  cf_turnstile_token: string;
  website?: string;
  company_website?: string;
}

export interface ContactMessageResponse {
  message?: string;
}
