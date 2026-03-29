import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getCompanyInformation } from "@/lib/api/endpoints/company-information.server";
import { getServiceCityPage, getServiceDetail, getServicesList } from "@/lib/api/endpoints/service.server";
import { ApiUnavailableFallback } from "@/components/api-unavailable-fallback";
import { getApiErrorStatus } from "@/lib/types/api";
import { ReadingProgress, BackToTop } from "@/app/blog/[slug]/_components/reading-progress";
import { PackagesSection } from "../_components/packages-section";
import { ProcessSection } from "../_components/process-section";
import { RequirementsSection } from "../_components/requirements-section";
import { LegalBasesSection } from "../_components/legal-bases-section";
import { FaqSection } from "../_components/faq-section";
import { BottomCta } from "../_components/bottom-cta";
import { BRAND_BLUE } from "@/lib/types/constants";
import { DetailBody } from "./_components/detail-body";
import { DetailHero } from "./_components/detail-hero";
import type { ServiceCityPageSeo } from "@/lib/types/service";

const getCachedCompanyInformation = cache(getCompanyInformation);

const getCachedServiceCityPage = cache(async (slug: string, citySlug: string) => {
  try {
    return await getServiceCityPage(slug, citySlug);
  } catch (e: unknown) {
    if (getApiErrorStatus(e) === 404) notFound();
    return null;
  }
});

export async function generateStaticParams() {
  try {
    const { services } = await getServicesList({ sort: "popular" });
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

function ServiceCityJsonLd({ seo }: { seo: ServiceCityPageSeo | null }) {
  if (!seo?.schema_markup) return null;

  const graph = [seo.schema_markup.webpage, seo.schema_markup.faq, seo.schema_markup.breadcrumb].filter(Boolean).map((schema) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { "@context": _, ...rest } = schema as Record<string, unknown>;
    return rest;
  });

  if (!graph.length) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graph,
        }),
      }}
    />
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; citySlug: string }> }): Promise<Metadata> {
  const { slug, citySlug } = await params;
  const data = await getCachedServiceCityPage(slug, citySlug);
  if (!data) return { title: "Layanan" };

  const seo = data.seo;

  const canonical = (seo.schema_markup?.breadcrumb as { itemListElement: { item: string }[] } | undefined)?.itemListElement.at(-1)?.item ?? undefined;

  const keywords = seo.focus_keyword ? [seo.focus_keyword] : undefined;

  return {
    title: seo.meta_title ?? `${data.heading} | Mitra Jasa Legalitas`,
    description: seo.meta_description ?? data.service.short_description ?? undefined,
    keywords,
    alternates: canonical ? { canonical } : undefined,
    robots: seo.robots ?? undefined,
    openGraph: {
      title: seo.meta_title ?? data.heading,
      description: seo.meta_description ?? undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string; citySlug: string }> }) {
  const { slug, citySlug } = await params;
  const data = await getCachedServiceCityPage(slug, citySlug);

  if (!data) {
    return <ApiUnavailableFallback retryHref={`/layanan/${slug}/${citySlug}`} title="Tidak dapat memuat halaman layanan" description="Periksa koneksi internet Anda, lalu muat ulang halaman ini." />;
  }

  const company = await getCachedCompanyInformation().catch(() => null);
  const whatsapp = company?.contact.whatsapp?.trim() ?? "";

  const { service, city } = data;
  const categoryColor = service.category?.palette_color?.trim() || BRAND_BLUE;
  const faqsForSection = data.faq.map((faqItem, faqIndex) => ({ ...faqItem, sort_order: faqIndex }));
  const hasDescription = Boolean(data.introduction || data.content);

  return (
    <>
      <ServiceCityJsonLd seo={data.seo} />
      <ReadingProgress />
      <BackToTop />

      <DetailHero heading={data.heading} service={service} city={city} categoryColor={categoryColor} />

      <DetailBody
        hasDescription={hasDescription}
        introduction={data.introduction}
        content={data.content}
        cityName={city.name}
        serviceName={service.name}
        whatsapp={whatsapp}
        packages={data.packages}
        processSteps={data.process_steps}
        requirementCategories={data.requirement_categories}
        legalBases={data.legal_bases}
        faqCount={data.faq.length}
      />

      {data.packages.length > 0 && <PackagesSection packages={data.packages} whatsapp={whatsapp} />}
      {data.process_steps.length > 0 && <ProcessSection steps={data.process_steps} />}
      {data.requirement_categories.length > 0 && <RequirementsSection categories={data.requirement_categories} />}
      {data.legal_bases.length > 0 && <LegalBasesSection bases={data.legal_bases} />}
      {faqsForSection.length > 0 && <FaqSection faqs={faqsForSection} />}

      <BottomCta name={data.heading} whatsapp={whatsapp} />
    </>
  );
}
