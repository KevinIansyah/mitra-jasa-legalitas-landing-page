
export type ServiceCompactCategory = {
  id: number;
  name: string;
  slug: string;
  palette_color: string;
};

export type ServiceCompact = {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  is_featured: boolean;
  is_popular: boolean;
  category: ServiceCompactCategory;
};

export type ServicePackagesMeta = {
  id: number;
  name: string;
  slug: string;
};

export type ServicePackageOption = {
  id: number;
  name: string;
  price: string;
  original_price: string | null;
  duration: string;
  duration_days: number;
  short_description: string | null;
  is_highlighted: boolean;
  badge: string | null;
  sort_order: number;
};

export type ServicePackagesResponse = {
  service: ServicePackagesMeta;
  packages: ServicePackageOption[];
};
