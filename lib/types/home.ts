import { BlogCard } from './blog';
import { ServiceCategory } from './service';

// ============================================================================
// STATS
// ============================================================================

export interface HomeStats {
  total_clients: number;
  total_documents: number;
  rating: number;
  total_reviews: number;
  years_experience: number;
  total_services: number;
}

// ============================================================================
// SERVICE CATEGORY (with count)
// ============================================================================

export interface HomeServiceCategory extends ServiceCategory {
  published_services_count: number;
}

// ============================================================================
// HOME - ALL SERVICES (summary)
// ============================================================================

export interface HomeServiceSummary {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

// ============================================================================
// FEATURED SERVICE (home payload)
// ============================================================================

export interface HomeFeaturedCategory extends ServiceCategory {
  palette_color: string | null;
}

export interface HomeCheapestPackage {
  id: number;
  name: string;
  slug: string | null;
  price: string;
  duration: string;
  duration_days: number;
}

export interface HomeIncludedFeature {
  id: number;
  feature_name: string;
  is_included: boolean;
  sort_order: number;
}

export interface HomeFeaturedService {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  featured_image: string | null;
  is_featured: boolean;
  is_popular: boolean;
  category: HomeFeaturedCategory | null;
  cheapest_package: HomeCheapestPackage | null;
  included_features: HomeIncludedFeature[] | null;
}

// ============================================================================
// TESTIMONIAL
// ============================================================================

export interface TestimonialService {
  id: number;
  name: string;
  slug: string;
}

export interface Testimonial {
  id: number;
  client_name: string;
  client_position: string | null;
  client_company: string | null;
  client_avatar: string | null;
  rating: number;
  content: string;
  service: TestimonialService | null;
}

// ============================================================================
// FAQ
// ============================================================================

export interface Faq {
  id: number;
  question: string;
  answer: string;
}

// ============================================================================
// CLIENT SUCCESS STORY
// ============================================================================

export interface SuccessStoryStat {
  value: string;
  label: string;
}

export interface ClientSuccessStory {
  id: number;
  client_name: string;
  industry: string | null;
  client_logo: string | null;
  metric_value: string | null;
  metric_label: string | null;
  challenge: string | null;
  solution: string | null;
  stat_1: SuccessStoryStat | null;
  stat_2: SuccessStoryStat | null;
  stat_3: SuccessStoryStat | null;
}

// ============================================================================
// WHATSAPP CTA
// ============================================================================

export interface WhatsappCta {
  label: string;
  phone_display: string;
  wa_me: string;
  default_message: string;
  wa_me_with_message: string;
}

// ============================================================================
// SEO
// ============================================================================

export interface OpenGraph {
  'og:type': string;
  'og:site_name': string;
  'og:title': string;
  'og:description': string;
  'og:url': string;
  'og:locale': string;
  'og:image'?: string | null;
}

export interface TwitterCard {
  'twitter:card': string;
  'twitter:title': string;
  'twitter:description': string;
  'twitter:image'?: string | null;
}

export interface HomeSeo {
  meta_title: string;
  meta_description: string;
  keywords: string | null;
  canonical_url: string;
  robots: string;
  in_sitemap: boolean;
  sitemap_priority: string;
  hreflang: Record<string, string>;
  open_graph: OpenGraph;
  twitter: TwitterCard;
  json_ld: Record<string, unknown>;
}

// ============================================================================
// CLIENT COMPANIES (logo strip / trust section)
// ============================================================================

export interface ClientCompany {
  id: number;
  name: string;
  logo: string | null;
}

// ============================================================================
// HOME DATA
// ============================================================================

export interface HomeData {
  stats: HomeStats;
  featured_services: HomeFeaturedService[];
  all_services?: HomeServiceSummary[];
  service_categories: HomeServiceCategory[];
  testimonials: Testimonial[];
  faqs: Faq[];
  client_success_stories: ClientSuccessStory[];
  client_companies?: ClientCompany[];
  latest_blogs: BlogCard[];
  whatsapp_cta: WhatsappCta | null;
  seo: HomeSeo;
}

/** Dipakai saat API tidak terjangkau agar beranda tetap tampil (konten minimal). */
export const EMPTY_HOME_DATA: HomeData = {
  stats: {
    total_clients: 0,
    total_documents: 0,
    rating: 0,
    total_reviews: 0,
    years_experience: 0,
    total_services: 0,
  },
  featured_services: [],
  all_services: [],
  service_categories: [],
  testimonials: [],
  faqs: [],
  client_success_stories: [],
  client_companies: [],
  latest_blogs: [],
  whatsapp_cta: null,
  seo: {
    meta_title: 'Mitra Jasa Legalitas',
    meta_description: 'Konsultan legalitas bisnis profesional.',
    keywords: null,
    canonical_url: '',
    robots: 'noindex,nofollow',
    in_sitemap: false,
    sitemap_priority: '0',
    hreflang: {},
    open_graph: {
      'og:type': 'website',
      'og:site_name': 'Mitra Jasa Legalitas',
      'og:title': 'Mitra Jasa Legalitas',
      'og:description': 'Konsultan legalitas bisnis profesional.',
      'og:url': '',
      'og:locale': 'id_ID',
    },
    twitter: {
      'twitter:card': 'summary_large_image',
      'twitter:title': 'Mitra Jasa Legalitas',
      'twitter:description': 'Konsultan legalitas bisnis profesional.',
    },
    json_ld: {},
  },
};
