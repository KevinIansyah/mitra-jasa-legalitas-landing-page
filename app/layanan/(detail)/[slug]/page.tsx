import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Sparkles, Star, Tag } from 'lucide-react';
import { getCompanyInformation } from '@/lib/api/endpoints/company-information.server';
import { getServiceDetail, getServicesList } from '@/lib/api/endpoints/service.server';
import { ApiUnavailableFallback } from '@/components/api-unavailable-fallback';
import { getApiErrorStatus } from '@/lib/types/api';
import { PackagesSection } from './_components/packages-section';
import { ProcessSection } from './_components/process-section';
import { RequirementsSection } from './_components/requirements-section';
import { ServiceFaqSection } from './_components/service-faq';
import {
  ReadingProgress,
  BackToTop,
} from '../../../blog/[slug]/_components/reading-progress';
import { LegalBasesSection } from './_components/legal-bases-section';
import { ServiceSidebar } from './_components/sidebar';
import { BottomCta } from './_components/bottom-cta';

const BRAND_BLUE = 'oklch(0.3811 0.1315 260.22)';

const getCachedCompanyInformation = cache(getCompanyInformation);

const getCachedServiceDetail = cache(async (slug: string) => {
  try {
    return await getServiceDetail(slug);
  } catch (e: unknown) {
    if (getApiErrorStatus(e) === 404) notFound();
    return null;
  }
});

export async function generateStaticParams() {
  try {
    const data = await getServicesList({ sort: 'popular' });
    return data.services.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getCachedServiceDetail(slug);
  if (!service) return { title: 'Layanan' };

  const seo = service.seo;
  if (!seo?.meta_title && !service.name) return { title: 'Layanan' };

  return {
    title: seo?.meta_title ?? `${service.name} | Mitra Jasa Legalitas`,
    description:
      seo?.meta_description ?? service.short_description ?? undefined,
    robots: seo?.robots,
    openGraph: {
      title: seo?.og_title ?? seo?.meta_title ?? service.name,
      description: seo?.og_description ?? seo?.meta_description ?? undefined,
      images: seo?.og_image ? [{ url: seo.og_image }] : undefined,
    },
    twitter: {
      card:
        (seo?.twitter_card as 'summary_large_image' | 'summary') ??
        'summary_large_image',
      title: seo?.og_title ?? seo?.meta_title ?? undefined,
      description: seo?.og_description ?? seo?.meta_description ?? undefined,
      images: seo?.twitter_image ? [seo.twitter_image] : undefined,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getCachedServiceDetail(slug);

  if (!service) {
    return (
      <ApiUnavailableFallback
        retryHref={`/layanan/${slug}`}
        title="Tidak dapat memuat layanan"
        description="Periksa koneksi internet Anda, lalu muat ulang halaman ini."
      />
    );
  }

  const company = await getCachedCompanyInformation().catch(() => null);
  const whatsapp = company?.contact.whatsapp?.trim() ?? '';

  const categoryColor = service.category?.palette_color?.trim() || BRAND_BLUE;

  return (
    <>
      <ReadingProgress />
      <BackToTop />

      {/* ── Hero ── */}
      <div className="bg-surface-page pt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 mb-6">
            <Link
              href="/"
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Beranda
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href="/layanan"
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Layanan
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-600 dark:text-gray-300 line-clamp-1">
              {service.name}
            </span>
          </nav>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {service.category && (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: categoryColor }}
              >
                <Tag className="w-3 h-3" />
                <span className="sm:mb-0.5">{service.category.name}</span>
              </div>
            )}
            {service.is_popular && (
              <div
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: 'oklch(0.7319 0.1856 52.89)' }}
              >
                <Star className="w-3 h-3 fill-white" />
                <span className="sm:mb-0.5">Populer</span>
              </div>
            )}
            {service.is_featured && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                <Sparkles className="w-3 h-3 fill-purple-700 dark:fill-purple-300" />
                <span className="sm:mb-0.5">Unggulan</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-4 max-w-3xl">
            {service.name}
          </h1>

          {/* Short description */}
          <div className="flex flex-wrap items-end justify-between gap-5">
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
              {service.short_description}
            </p>
          </div>
        </div>

        {/* Featured image */}
        {service.featured_image && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="relative w-full h-[260px] sm:h-[340px] lg:h-[420px] rounded-t-3xl overflow-hidden">
              <Image
                src={service.featured_image}
                alt={service.name}
                fill
                priority
                unoptimized
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1152px"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>
        )}
      </div>

      {/* ── Body  ── */}
      <div className="bg-surface-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main content */}
            <div className="flex-1 min-w-0 space-y-8">
              {service.introduction || service.content ? (
                <>
                  {service.introduction && (
                    <div className="mb-14">
                      <div
                        className="service-prose"
                        dangerouslySetInnerHTML={{
                          __html: service.introduction,
                        }}
                      />
                    </div>
                  )}

                  {service.content && (
                    <div className="pt-6 border-t border-gray-100 dark:border-white/8">
                      <div
                        className="service-prose"
                        dangerouslySetInnerHTML={{ __html: service.content }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                    Layanan ini sedang dalam proses penulisan. Silakan hubungi
                    tim kami untuk informasi lebih lengkap.
                  </p>
                </>
              )}
            </div>

            <ServiceSidebar
              serviceName={service.name}
              whatsapp={whatsapp}
              packages={service.packages}
              processSteps={service.process_steps}
              requirementCategories={service.requirement_categories}
              legalBases={service.legal_bases}
              faqCount={service.faqs.length}
            />
          </div>
        </div>
      </div>

      {service.packages.length > 0 && (
        <PackagesSection packages={service.packages} whatsapp={whatsapp} />
      )}

      {service.process_steps.length > 0 && (
        <ProcessSection steps={service.process_steps} />
      )}

      {service.requirement_categories.length > 0 && (
        <RequirementsSection categories={service.requirement_categories} />
      )}

      {service.legal_bases.length > 0 && (
        <LegalBasesSection bases={service.legal_bases} />
      )}

      {service.faqs.length > 0 && <ServiceFaqSection faqs={service.faqs} />}

      <BottomCta name={service.name} whatsapp={whatsapp} />
    </>
  );
}
