import { cache } from "react";
import type { Metadata } from "next";
import { getCompanyInformation } from "@/lib/api/endpoints/company-information.server";
import { AboutHero } from "./_components/about-hero";
import { AboutHistorySection } from "./_components/about-history-section";
import { AboutStatsSection } from "./_components/about-stats-section";
import { AboutMissionVisionSection } from "./_components/about-mission-vision-section";
import { AboutValuesSection } from "./_components/about-values-section";
import { AboutCtaSection } from "./_components/about-cta-section";

const getCachedCompanyInformation = cache(getCompanyInformation);

const PAGE_TITLE = "Tentang Kami";
const PAGE_DESCRIPTION = "Sejarah, misi, visi, dan nilai-nilai CV. Mitra Jasa Legalitas - konsultan legalitas & perizinan usaha sejak 2014, berbasis di Surabaya.";
const PAGE_PATH = "/tentang-kami";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getCachedCompanyInformation();
    const seo = data.seo_defaults;
    const title = seo.title_template.replace("{page_title}", PAGE_TITLE);
    const canonical = `${seo.canonical_base}${PAGE_PATH}`;

    return {
      title,
      description: PAGE_DESCRIPTION,
      alternates: { canonical },
      robots: seo.robots,
      openGraph: {
        type: "website",
        url: canonical,
        title,
        description: PAGE_DESCRIPTION,
        siteName: seo.open_graph_defaults["og:site_name"],
        locale: seo.open_graph_defaults["og:locale"] ?? "id_ID",
        ...(seo.default_og_image ? { images: [{ url: seo.default_og_image }] } : {}),
      },
      twitter: {
        card: seo.twitter_defaults["twitter:card"] as "summary_large_image",
        title,
        description: PAGE_DESCRIPTION,
        ...(seo.default_og_image ? { images: [seo.default_og_image] } : {}),
      },
    };
  } catch {
    return {
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
    };
  }
}

export default async function Page() {
  const data = await getCachedCompanyInformation();
  const seo = data.seo_defaults;
  const canonical = `${seo.canonical_base}${PAGE_PATH}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      ...seo.json_ld_base["@graph"],
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: seo.title_template.replace("{page_title}", PAGE_TITLE),
        description: PAGE_DESCRIPTION,
        isPartOf: { "@id": seo.json_ld_base._ids.website },
        about: { "@id": seo.json_ld_base._ids.organization },
        inLanguage: "id-ID",
      },
    ],
  };

  const companyStats = data.stats;
  const whatsapp = data.contact.whatsapp?.trim() ?? "";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bg-surface-page">
        <AboutHero />
        <AboutHistorySection />
        <AboutStatsSection stats={companyStats} />
        <AboutMissionVisionSection />
        <AboutValuesSection />
        <AboutCtaSection whatsapp={whatsapp} />
      </div>
    </>
  );
}
