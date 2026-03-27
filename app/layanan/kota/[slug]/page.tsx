import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { getCities, getServicesByCity } from '@/lib/api/endpoints/service';
import { ApiUnavailableFallback } from '@/components/api-unavailable-fallback';
import { ApiError } from '@/lib/types/api';
import { CityHero } from './_components/city-hero';
import { CityServiceList } from './_components/city-service-list';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const getCityData = cache(async (slug: string) => {
  return getServicesByCity(slug, { sort: 'popular' });
});

export async function generateStaticParams() {
  try {
    const cities = await getCities();
    return cities.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { seo } = await getCityData(slug);
    const og = seo.open_graph ?? {};
    const tw = seo.twitter ?? {};
    return {
      title: seo.meta_title ?? `Layanan — ${slug}`,
      description: seo.meta_description ?? undefined,
      alternates: seo.canonical_url
        ? { canonical: seo.canonical_url }
        : undefined,
      openGraph: {
        type: 'website',
        siteName: og['og:site_name'] ?? undefined,
        title: og['og:title'] ?? seo.meta_title ?? undefined,
        description: og['og:description'] ?? seo.meta_description ?? undefined,
        url: og['og:url'] ?? undefined,
        images: og['og:image'] ? [og['og:image']] : undefined,
        locale: og['og:locale'] ?? 'id_ID',
      },
      twitter: {
        card: 'summary_large_image',
        title: tw['twitter:title'] ?? seo.meta_title ?? undefined,
        description:
          tw['twitter:description'] ?? seo.meta_description ?? undefined,
        images: tw['twitter:image'] ? [tw['twitter:image']] : undefined,
      },
    };
  } catch {
    return { title: 'Layanan per kota – Mitra Jasa Legalitas' };
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const cityPayload = await getCityData(slug).catch((e: unknown) => {
    if (e instanceof ApiError && e.status === 404) notFound();
    return null;
  });

  if (!cityPayload) {
    return (
      <ApiUnavailableFallback
        retryHref={`/layanan/kota/${slug}`}
        title="Tidak dapat memuat halaman kota"
        description="Periksa koneksi internet Anda, lalu muat ulang halaman ini."
      />
    );
  }

  const { city } = cityPayload;

  return (
    <div>
      <CityHero city={city} />
      <Suspense
        fallback={
          <div className="min-h-[50vh] bg-gray-50 dark:bg-surface-subtle animate-pulse" />
        }
      >
        <CityServiceList citySlug={slug} />
      </Suspense>
    </div>
  );
}
