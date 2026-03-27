import type { Metadata } from 'next';
import { Suspense } from 'react';
import { cache } from 'react';
import { ServiceHero } from './_components/service-hero';
import {
  getServiceCategories,
  getServicesList,
} from '@/lib/api/endpoints/service';
import { ServiceList } from './_components/service-list';

const getCachedServicesList = cache(() => getServicesList({ sort: 'popular' }));

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { seo } = await getCachedServicesList();
    const og = seo.open_graph ?? {};
    const tw = seo.twitter ?? {};
    return {
      title: seo.meta_title ?? 'Layanan - Mitra Jasa Legalitas',
      description: seo.meta_description ?? undefined,
      alternates: seo.canonical_url
        ? { canonical: seo.canonical_url }
        : undefined,
      robots: seo.robots ?? undefined,
      openGraph: {
        type: 'website',
        siteName: og['og:site_name'] ?? undefined,
        title: og['og:title'] ?? seo.meta_title ?? undefined,
        description: og['og:description'] ?? seo.meta_description ?? undefined,
        url: og['og:url'] ?? undefined,
        locale: og['og:locale'] ?? 'id_ID',
      },
      twitter: {
        card: 'summary_large_image',
        title: tw['twitter:title'] ?? seo.meta_title ?? undefined,
        description:
          tw['twitter:description'] ?? seo.meta_description ?? undefined,
      },
    };
  } catch {
    return {
      title: 'Layanan – Mitra Jasa Legalitas',
      description: 'Temukan semua layanan legalitas bisnis kami.',
    };
  }
}

export default async function LayananPage() {
  const [listData, cats] = await Promise.allSettled([
    getCachedServicesList(),
    getServiceCategories(),
  ]);

  const serviceCount =
    listData.status === 'fulfilled' ? listData.value.services.length : 0;
  const categoryCount = cats.status === 'fulfilled' ? cats.value.length : 0;
  const jsonLd =
    listData.status === 'fulfilled' ? listData.value.seo.json_ld : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ServiceHero serviceCount={serviceCount} categoryCount={categoryCount} />
      <Suspense
        fallback={
          <div className="min-h-[50vh] bg-gray-50 dark:bg-surface-subtle animate-pulse" />
        }
      >
        <ServiceList />
      </Suspense>
    </>
  );
}
