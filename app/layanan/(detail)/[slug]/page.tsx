import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getCompanyInformation } from "@/lib/api/endpoints/company-information.server";
import { getServiceDetail, getServicesList } from "@/lib/api/endpoints/service.server";
import { ApiUnavailableFallback } from "@/components/api-unavailable-fallback";
import { getApiErrorStatus } from "@/lib/types/api";
import { PackagesSection } from "./_components/packages-section";
import { ProcessSection } from "./_components/process-section";
import { RequirementsSection } from "./_components/requirements-section";
import { FaqSection } from "./_components/faq-section";
import { ReadingProgress, BackToTop } from "../../../blog/[slug]/_components/reading-progress";
import { LegalBasesSection } from "./_components/legal-bases-section";
import { BottomCta } from "./_components/bottom-cta";
import { DetailBody } from "./_components/detail-body";
import { DetailHero } from "./_components/detail-hero";
import { ServiceSeo } from "@/lib/types/service";

const BRAND_BLUE = "oklch(0.3811 0.1315 260.22)";

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
    const data = await getServicesList({ sort: "popular" });
    return data.services.map((relatedService) => ({ slug: relatedService.slug }));
  } catch {
    return [];
  }
}

function ServiceJsonLd({ seo }: { seo: ServiceSeo | null }) {
  if (!seo?.schema_markup) return null;

  const graph = [seo.schema_markup.service, seo.schema_markup.howto, seo.schema_markup.faq, seo.schema_markup.breadcrumb].filter(Boolean).map((schema) => {
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getCachedServiceDetail(slug);
  if (!service) return { title: "Layanan" };

  const seo = service.seo;

  const canonical = (seo?.schema_markup?.breadcrumb as { itemListElement: { item: string }[] } | undefined)?.itemListElement.at(-1)?.item ?? undefined;

  const keywords = seo?.focus_keyword ? [seo.focus_keyword] : undefined;

  return {
    title: seo?.meta_title ?? `${service.name} | Mitra Jasa Legalitas`,
    description: seo?.meta_description ?? service.short_description ?? undefined,
    keywords,
    alternates: canonical ? { canonical } : undefined,
    robots: seo?.robots ?? undefined,
    openGraph: {
      title: seo?.og_title ?? seo?.meta_title ?? service.name,
      description: seo?.og_description ?? seo?.meta_description ?? undefined,
      images: seo?.og_image ? [{ url: seo.og_image }] : undefined,
    },
    twitter: {
      card: (seo?.twitter_card as "summary_large_image" | "summary") ?? "summary_large_image",
      title: seo?.og_title ?? seo?.meta_title ?? undefined,
      description: seo?.og_description ?? seo?.meta_description ?? undefined,
      images: seo?.twitter_image ? [seo.twitter_image] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getCachedServiceDetail(slug);

  if (!service) {
    return <ApiUnavailableFallback retryHref={`/layanan/${slug}`} title="Tidak dapat memuat layanan" description="Periksa koneksi internet Anda, lalu muat ulang halaman ini." />;
  }

  const company = await getCachedCompanyInformation().catch(() => null);
  const whatsapp = company?.contact.whatsapp?.trim() ?? "";

  const categoryColor = service.category?.palette_color?.trim() || BRAND_BLUE;
  const hasDescription = Boolean(service.introduction || service.content);

  return (
    <>
      <ServiceJsonLd seo={service.seo} />
      <ReadingProgress />
      <BackToTop />

      <DetailHero service={service} categoryColor={categoryColor} />

      <DetailBody service={service} whatsapp={whatsapp} hasDescription={hasDescription} />

      {service.packages.length > 0 && <PackagesSection packages={service.packages} whatsapp={whatsapp} />}

      {service.process_steps.length > 0 && <ProcessSection steps={service.process_steps} />}

      {service.requirement_categories.length > 0 && <RequirementsSection categories={service.requirement_categories} />}

      {service.legal_bases.length > 0 && <LegalBasesSection bases={service.legal_bases} />}

      {service.faqs.length > 0 && <FaqSection faqs={service.faqs} />}

      <BottomCta name={service.name} whatsapp={whatsapp} />
    </>
  );
}
