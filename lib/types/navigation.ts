export interface NavigationService {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  is_featured: boolean;
  is_popular: boolean;
}

export interface NavigationServiceCategory {
  id: number;
  name: string;
  slug: string;
  services: NavigationService[];
}

export interface NavigationFeaturedService {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  featured_image: string | null;
  is_popular: boolean;
}

export interface NavigationWhatsapp {
  phone_display: string;
  wa_me: string;
  wa_me_with_message: string;
}

export interface NavigationSocialMedia {
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
  threads?: string;
}

export interface NavigationCompany {
  name: string;
  tagline?: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
}

export interface NavigationData {
  service_categories: NavigationServiceCategory[];
  featured_services: NavigationFeaturedService[];
  whatsapp: NavigationWhatsapp | null;
  social_media?: NavigationSocialMedia | null;
  company?: NavigationCompany | null;
}

/** Dipakai saat API tidak terjangkau (mis. jaringan mati) agar layout tetap render. */
export const EMPTY_NAVIGATION: NavigationData = {
  service_categories: [],
  featured_services: [],
  whatsapp: null,
  social_media: null,
  company: null,
};
