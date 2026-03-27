import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { getCompanyInformation } from '@/lib/api/endpoints/company-information.server';
import {
  getServiceCityPage,
  getServiceDetail,
  getServicesList,
} from '@/lib/api/endpoints/service';
import { ApiUnavailableFallback } from '@/components/api-unavailable-fallback';
import { ApiError } from '@/lib/types/api';
import { ReadingProgress } from '@/app/blog/[slug]/_components/reading-progress';
import { BackToTop } from '@/app/blog/[slug]/_components/reading-progress';
import { ChevronRight, MapPin, Tag } from 'lucide-react';
import { ServiceSidebar } from '../_components/sidebar';
import { PackagesSection } from '../_components/packages-section';
import { ProcessSection } from '../_components/process-section';
import { RequirementsSection } from '../_components/requirements-section';
import { LegalBasesSection } from '../_components/legal-bases-section';
import { ServiceFaqSection } from '../_components/service-faq';
import { BottomCta } from '../_components/bottom-cta';
import Link from 'next/link';
import Image from 'next/image';
import { BRAND_BLUE } from '@/lib/types/service';

const getCachedCompanyInformation = cache(getCompanyInformation);

export async function generateStaticParams() {
  try {
    const { services } = await getServicesList({ sort: 'popular' });
    const out: { slug: string; citySlug: string }[] = [];
    for (const s of services) {
      const detail = await getServiceDetail(s.slug).catch(() => null);
      if (!detail?.city_pages?.length) continue;
      for (const c of detail.city_pages) {
        out.push({ slug: s.slug, citySlug: c.slug });
      }
    }
    return out;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; citySlug: string }>;
}): Promise<Metadata> {
  const { slug, citySlug } = await params;
  try {
    const data = await getServiceCityPage(slug, citySlug);
    const seo = data.seo;
    return {
      title: seo.meta_title ?? `${data.heading} | Mitra Jasa Legalitas`,
      description:
        seo.meta_description ?? data.service.short_description ?? undefined,
      robots: seo.robots,
      openGraph: {
        title: seo.meta_title ?? data.heading,
        description: seo.meta_description ?? undefined,
      },
    };
  } catch {
    return { title: 'Layanan' };
  }
}

export default async function ServiceCityPageRoute({
  params,
}: {
  params: Promise<{ slug: string; citySlug: string }>;
}) {
  const { slug, citySlug } = await params;
  const data = await getServiceCityPage(slug, citySlug).catch((e: unknown) => {
    if (e instanceof ApiError && e.status === 404) notFound();
    return null;
  });

  if (!data) {
    return (
      <ApiUnavailableFallback
        retryHref={`/layanan/${slug}/${citySlug}`}
        title="Tidak dapat memuat halaman layanan"
        description="Periksa koneksi internet Anda, lalu muat ulang halaman ini."
      />
    );
  }

  const company = await getCachedCompanyInformation().catch(() => null);
  const whatsapp = company?.contact.whatsapp?.trim() ?? '';

  const { service, city } = data;
  const categoryColor = service.category?.palette_color?.trim() || BRAND_BLUE;
  const faqsForSection = data.faq.map((f, i) => ({
    ...f,
    sort_order: i,
  }));

  return (
    <>
      <ReadingProgress />
      <BackToTop />

      <div className="bg-surface-page pt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 mb-6 flex-wrap">
            <Link
              href="/"
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link
              href="/layanan"
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Layanan
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link
              href={`/layanan/${service.slug}`}
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors line-clamp-1"
            >
              {service.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-gray-600 dark:text-gray-300 line-clamp-1">
              {city.name}
            </span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: categoryColor }}
            >
              <Tag className="w-3 h-3" />
              <span className="sm:mb-0.5">{service.name}</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-200">
              <MapPin className="w-3 h-3" />
              <span className="sm:mb-0.5">
                {city.name}
                {city.province ? ` · ${city.province}` : ''}
              </span>
            </div>
          </div>

          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-4 max-w-3xl">
            {data.heading}
          </h1>

          <div className="flex flex-wrap items-end justify-between gap-5">
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
              {service.short_description}
            </p>
          </div>
        </div>

        {service.featured_image && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="relative w-full h-[260px] sm:h-[340px] lg:h-[420px] rounded-t-3xl overflow-hidden">
              <Image
                src={service.featured_image}
                alt={data.heading}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1152px"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>
        )}
      </div>

      <div className="bg-surface-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 min-w-0 space-y-8">
              {data.introduction || data.content ? (
                <>
                  {data.introduction && (
                    <div className="mb-14">
                      <div
                        className="service-prose"
                        dangerouslySetInnerHTML={{
                          __html: data.introduction,
                        }}
                      />
                    </div>
                  )}

                  {data.content && (
                    <div className="pt-6 border-t border-gray-100 dark:border-white/8">
                      <div
                        className="service-prose"
                        dangerouslySetInnerHTML={{ __html: data.content }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                  Konten untuk layanan di {city.name} sedang disiapkan. Hubungi
                  tim kami untuk informasi lebih lengkap.
                </p>
              )}
            </div>

            <ServiceSidebar
              serviceName={service.name}
              whatsapp={whatsapp}
              packages={data.packages}
              processSteps={data.process_steps}
              requirementCategories={data.requirement_categories}
              legalBases={data.legal_bases}
              faqCount={data.faq.length}
            />
          </div>
        </div>
      </div>

      {data.packages.length > 0 && (
        <PackagesSection packages={data.packages} whatsapp={whatsapp} />
      )}

      {data.process_steps.length > 0 && (
        <ProcessSection steps={data.process_steps} />
      )}

      {data.requirement_categories.length > 0 && (
        <RequirementsSection categories={data.requirement_categories} />
      )}

      {data.legal_bases.length > 0 && (
        <LegalBasesSection bases={data.legal_bases} />
      )}

      {faqsForSection.length > 0 && <ServiceFaqSection faqs={faqsForSection} />}

      <BottomCta name={data.heading} whatsapp={whatsapp} />
    </>
  );
}
