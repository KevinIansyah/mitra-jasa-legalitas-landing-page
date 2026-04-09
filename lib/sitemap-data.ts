import type { ServiceListItem } from "@/lib/types/service";
import { getBlogsList } from "@/lib/api/endpoints/blog.server";
import {
  getCities,
  getServiceDetail,
  getServicesList,
} from "@/lib/api/endpoints/service.server";
import { absoluteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";

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
  const { services } = await getServicesList({ sort: "popular" });
  return expandServiceCityPaths(services);
}

async function fetchBlogSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const first = await getBlogsList({ page: 1 });
  const out: MetadataRoute.Sitemap = first.blogs.map((blog) => ({
    url: absoluteUrl(`/blog/${blog.slug}`),
    lastModified: new Date(blog.published_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  for (let page = 2; page <= first.meta.last_page; page++) {
    const data = await getBlogsList({ page });
    out.push(
      ...data.blogs.map((blog) => ({
        url: absoluteUrl(`/blog/${blog.slug}`),
        lastModified: new Date(blog.published_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    );
  }
  return out;
}

function serviceCityPathsToSitemap(
  paths: { slug: string; citySlug: string }[],
): MetadataRoute.Sitemap {
  return paths.map(({ slug, citySlug }) => ({
    url: absoluteUrl(`/layanan/${slug}/${citySlug}`),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));
}

function servicesToDetailEntries(
  services: ServiceListItem[],
): MetadataRoute.Sitemap {
  return services.map((service) => ({
    url: absoluteUrl(`/layanan/${service.slug}`),
    changeFrequency: "weekly",
    priority: 0.85,
  }));
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/layanan"), changeFrequency: "weekly", priority: 0.95 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/kontak"), changeFrequency: "monthly", priority: 0.85 },
    { url: absoluteUrl("/tentang"), changeFrequency: "monthly", priority: 0.85 },
  ];

  try {
    const [{ services }, cities, blogEntries] = await Promise.all([
      getServicesList({ sort: "popular" }),
      getCities(),
      fetchBlogSitemapEntries(),
    ]);
    const serviceCityPaths = await expandServiceCityPaths(services);

    const serviceEntries = servicesToDetailEntries(services);
    const cityEntries: MetadataRoute.Sitemap = cities.map((city) => ({
      url: absoluteUrl(`/layanan/kota/${city.slug}`),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
    const serviceCityEntries = serviceCityPathsToSitemap(serviceCityPaths);

    return [
      ...staticRoutes,
      ...serviceEntries,
      ...cityEntries,
      ...blogEntries,
      ...serviceCityEntries,
    ];
  } catch {
    return staticRoutes;
  }
}
