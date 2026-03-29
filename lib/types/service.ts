// ============================================================================
// SHARED
// ============================================================================

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ServiceCategoryOption {
  id: number;
  name: string;
  slug: string;
}

export interface City {
  id: number;
  name: string;
  slug: string;
  province?: string;
}

export type CityListItem = Pick<City, 'id' | 'name' | 'slug'>;

// ============================================================================
// SERVICE CARD (list / featured)
// ============================================================================

export interface ServiceCard {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  featured_image: string | null;
  is_featured: boolean;
  is_popular: boolean;
  category: ServiceCategory | null;
}

// ============================================================================
// SERVICE DETAIL
// ============================================================================

export interface ServicePackageFeature {
  feature_name: string;
  description: string | null;
  is_included: boolean;
  sort_order: number;
}

export interface ServicePackage {
  name: string;
  price: string;
  original_price?: string | null;
  duration: string;
  duration_days: number;
  short_description: string | null;
  is_highlighted: boolean;
  badge?: string | null;
  sort_order: number;
  features: ServicePackageFeature[];
}

// ============================================================================
// SERVICES LIST (GET /services)
// ============================================================================

export interface ServiceListCityPageRef {
  id: number;
  name: string;
}

export interface ServiceListCheapestPackage {
  id: number;
  name: string;
  price: string;
  duration: string;
  duration_days: number;
  short_description: string | null;
  features: ServicePackageFeature[];
}

export interface ServiceListItem {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  featured_image: string | null;
  is_featured: boolean;
  is_popular: boolean;
  category: (ServiceCategory & { palette_color?: string | null }) | null;
  cheapest_package: ServiceListCheapestPackage | null;
  city_pages: ServiceListCityPageRef[];
}

export interface ServicesListSeo {
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  robots: string | null;
  in_sitemap?: boolean;
  sitemap_priority?: string | null;
  open_graph?: Record<string, string | undefined>;
  twitter?: Record<string, string | undefined>;
  json_ld?: Record<string, unknown>;
}

export interface ServicesListData {
  seo: ServicesListSeo;
  services: ServiceListItem[];
}

export interface ServiceListCityApiItem {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  featured_image: string | null;
  is_featured: boolean;
  is_popular: boolean;
  category: (ServiceCategory & { palette_color?: string | null }) | null;
  packages: ServiceListCheapestPackage | null;
  city_page?: {
    heading: string;
    meta_description: string | null;
  };
}

export interface ServicesByCityData {
  city: City;
  seo: ServicesListSeo;
  services: ServiceListCityApiItem[];
}

export interface ServiceProcessStep {
  title: string;
  description: string;
  duration: string;
  duration_days: number;
  required_documents: string[] | null;
  notes: string | null;
  icon: string | null;
  sort_order: number;
}

export interface ServiceRequirement {
  name: string;
  description: string | null;
  is_required: boolean;
  document_format: string;
  notes: string | null;
  sort_order: number;
}

export interface ServiceRequirementCategory {
  name: string;
  description: string | null;
  sort_order: number;
  requirements: ServiceRequirement[];
}

export interface ServiceLegalBasis {
  document_type: string;
  document_number: string;
  title: string;
  issued_date: string;
  url: string | null;
  description: string | null;
  sort_order: number;
}

export interface ServiceFaq {
  question: string;
  answer: string;
  sort_order: number;
}

export interface ServiceSeo {
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_card: string | null;
  twitter_image: string | null;
  robots: string;
  in_sitemap: boolean;
  sitemap_priority: string;
  schema_markup: Record<string, unknown> | null;
}

export interface ServiceDetailCityPage {
  id: number;
  name: string;
  slug: string;
  province?: string | null;
}

export interface ServiceDetail {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  introduction: string | null;
  content: string | null;
  featured_image: string | null;
  is_featured: boolean;
  is_popular: boolean;
  category: (ServiceCategory & { palette_color?: string | null }) | null;
  city_pages?: ServiceDetailCityPage[];
  seo: ServiceSeo | null;
  packages: ServicePackage[];
  process_steps: ServiceProcessStep[];
  requirement_categories: ServiceRequirementCategory[];
  legal_bases: ServiceLegalBasis[];
  faqs: ServiceFaq[];
}

// ============================================================================
// SERVICE CITY PAGE
// ============================================================================

export interface ServiceCityFaq {
  question: string;
  answer: string;
}

export interface ServiceCityPageSeo {
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  schema_markup: Record<string, unknown> | null;
  robots: string;
  in_sitemap: boolean;
  sitemap_priority: string;
}

export interface ServiceCityPage {
  heading: string;
  introduction: string | null;
  content: string | null;
  faq: ServiceCityFaq[];
  seo: ServiceCityPageSeo;
  service: Pick<
    ServiceDetail,
    'id' | 'name' | 'slug' | 'short_description' | 'featured_image'
  > & {
    category?: ServiceDetail['category'];
  };
  city: City;
  packages: ServicePackage[];
  process_steps: ServiceProcessStep[];
  requirement_categories: ServiceRequirementCategory[];
  legal_bases: ServiceLegalBasis[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const SORT_OPTIONS = [
  { id: 'popular', label: 'Paling Populer' },
  { id: 'name', label: 'Nama A-Z' },
  { id: 'price_asc', label: 'Harga Terendah' },
  { id: 'price_desc', label: 'Harga Tertinggi' },
  { id: 'latest', label: 'Terbaru' },
];

export const PRICE_RANGES = [
  { id: '1', label: '< Rp 1 juta' },
  { id: '2', label: 'Rp 1.000.000 - Rp 2.999.999' },
  { id: '3', label: 'Rp 3.000.000 - Rp 4.999.999' },
  { id: '4', label: 'Rp 5.000.000 - Rp 9.999.999' },
  { id: '5', label: '≥ Rp 10 juta' },
];
