import type { MetadataRoute } from "next";
import {
  getSitemapData,
  type SitemapChangeFreq,
} from "@/lib/api/endpoints/sitemap.server";
import { getServiceDetail, getServicesList } from "@/lib/api/endpoints/service.server";
import type { ServiceListItem } from "@/lib/types/service";
import { absoluteUrl } from "@/lib/site-url";

type SitemapEntry = MetadataRoute.Sitemap[number];

type ChangeFrequency = NonNullable<SitemapEntry["changeFrequency"]>;

function toChangeFrequency(value: SitemapChangeFreq | undefined): ChangeFrequency | undefined {
  if (!value) return undefined;
  const allowed: ChangeFrequency[] = [
    "always",
    "hourly",
    "daily",
    "weekly",
    "monthly",
    "yearly",
    "never",
  ];
  return allowed.includes(value as ChangeFrequency) ? (value as ChangeFrequency) : undefined;
}

function toLastModified(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function toPriority(value: number | undefined): number | undefined {
  if (value === undefined || value === null) return undefined;
  return Number.isFinite(value) ? value : undefined;
}

async function expandServiceCityPaths(
  services: ServiceListItem[],
): Promise<{ slug: string; citySlug: string }[]> {
  const paths: { slug: string; citySlug: string }[] = [];
  for (const service of services) {
    const detail = await getServiceDetail(service.slug).catch(() => null);
    if (!detail?.city_pages?.length) continue;
    for (const city of detail.city_pages) {
      paths.push({ slug: service.slug, citySlug: city.slug });
    }
  }
  return paths;
}

export async function fetchServiceCityPaths(): Promise<
  { slug: string; citySlug: string }[]
> {
  try {
    const data = await getSitemapData();
    return data.service_city_pages.map((entry) => ({
      slug: entry.service_slug,
      citySlug: entry.city_slug,
    }));
  } catch {
    const { services } = await getServicesList({ sort: "popular" });
    return expandServiceCityPaths(services);
  }
}

const FALLBACK_STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
  { url: absoluteUrl("/layanan"), changeFrequency: "weekly", priority: 0.95 },
  { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.9 },
  { url: absoluteUrl("/kontak"), changeFrequency: "monthly", priority: 0.85 },
  { url: absoluteUrl("/tentang"), changeFrequency: "monthly", priority: 0.85 },
  { url: absoluteUrl("/syarat-ketentuan-layanan"), changeFrequency: "yearly", priority: 0.5 },
  { url: absoluteUrl("/kebijakan-privasi"), changeFrequency: "yearly", priority: 0.5 },
];

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const data = await getSitemapData();

    const staticEntries: MetadataRoute.Sitemap = data.static_pages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: toLastModified(page.lastmod),
      changeFrequency: toChangeFrequency(page.changefreq),
      priority: toPriority(page.priority),
    }));

    const serviceEntries: MetadataRoute.Sitemap = data.services.map((service) => ({
      url: absoluteUrl(`/layanan/${service.slug}`),
      lastModified: toLastModified(service.lastmod),
      changeFrequency: toChangeFrequency(service.changefreq),
      priority: toPriority(service.priority),
    }));

    const cityEntries: MetadataRoute.Sitemap = data.cities.map((city) => ({
      url: absoluteUrl(`/layanan/kota/${city.slug}`),
      lastModified: toLastModified(city.lastmod),
      changeFrequency: toChangeFrequency(city.changefreq),
      priority: toPriority(city.priority),
    }));

    const serviceCityEntries: MetadataRoute.Sitemap = data.service_city_pages.map((entry) => ({
      url: absoluteUrl(`/layanan/${entry.service_slug}/${entry.city_slug}`),
      lastModified: toLastModified(entry.lastmod),
      changeFrequency: toChangeFrequency(entry.changefreq),
      priority: toPriority(entry.priority),
    }));

    const blogEntries: MetadataRoute.Sitemap = data.blogs.map((blog) => ({
      url: absoluteUrl(`/blog/${blog.slug}`),
      lastModified: toLastModified(blog.lastmod),
      changeFrequency: toChangeFrequency(blog.changefreq),
      priority: toPriority(blog.priority),
    }));

    return [
      ...staticEntries,
      ...serviceEntries,
      ...cityEntries,
      ...blogEntries,
      ...serviceCityEntries,
    ];
  } catch {
    return FALLBACK_STATIC_ROUTES;
  }
}
