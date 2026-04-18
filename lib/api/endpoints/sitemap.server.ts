import { apiServer } from "@/lib/api/server";

export type SitemapChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapStaticPage {
  path: string;
  lastmod: string;
  changefreq: SitemapChangeFreq;
  priority: number;
}

export interface SitemapServiceEntry {
  slug: string;
  lastmod: string;
  changefreq: SitemapChangeFreq;
  priority: number;
}

export interface SitemapCityEntry {
  slug: string;
  lastmod: string;
  changefreq: SitemapChangeFreq;
  priority: number;
}

export interface SitemapServiceCityEntry {
  service_slug: string;
  city_slug: string;
  lastmod: string;
  changefreq: SitemapChangeFreq;
  priority: number;
}

export interface SitemapBlogEntry {
  slug: string;
  lastmod: string;
  changefreq: SitemapChangeFreq;
  priority: number;
}

export interface SitemapData {
  generated_at: string;
  static_pages: SitemapStaticPage[];
  services: SitemapServiceEntry[];
  cities: SitemapCityEntry[];
  service_city_pages: SitemapServiceCityEntry[];
  blogs: SitemapBlogEntry[];
}

export async function getSitemapData(): Promise<SitemapData> {
  return apiServer.get<SitemapData>("/sitemap");
}
