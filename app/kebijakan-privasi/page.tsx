import type { Metadata } from "next";
import { cache } from "react";
import { getCompanyInformation } from "@/lib/api/endpoints/company-information.server";
import { PrivacyPolicyContent } from "./_components/privacy-policy-content";

const getCachedCompanyInformation = cache(getCompanyInformation);

const PAGE_TITLE = "Kebijakan Privasi";
const PAGE_DESCRIPTION =
  "Kebijakan privasi CV. Mitra Jasa Legalitas: pengumpulan data, penggunaan, keamanan, dan hak Anda terkait informasi pribadi.";
const PAGE_PATH = "/kebijakan-privasi";

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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PrivacyPolicyContent heroDescription={PAGE_DESCRIPTION} />
    </>
  );
}
