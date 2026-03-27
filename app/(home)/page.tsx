import type { Metadata } from 'next';
import { getHomeData } from '@/lib/api/endpoints/home';
import { HeroSection } from './_components/hero-section';
import { ClientMarquee } from './_components/client-marque-section';
import { TrustBadges } from './_components/trust-badges';
import { HowItWorksSection } from './_components/how-it-works-section';
import { ServicesSection } from './_components/services-section';
import { WhyUsSection } from './_components/why-us-section';
import { NetworkSection } from './_components/network-section';
import { CaseStudySection } from './_components/case-study-section';
import { TestimonialSection } from './_components/testimonial-section';
import { BlogSection } from './_components/blog-section';
import { FaqSection } from './_components/faq-section';
import { cache } from 'react';

const getCachedHomeData = cache(getHomeData);

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { seo } = await getCachedHomeData();
    const og = seo.open_graph ?? {};
    const tw = seo.twitter ?? {};

    return {
      title: seo.meta_title ?? 'Mitra Jasa Legalitas',
      description: seo.meta_description ?? undefined,
      keywords: seo.keywords
        ?.split(',')
        .map((k) => k.trim())
        .filter(Boolean),
      alternates: seo.canonical_url
        ? { canonical: seo.canonical_url }
        : undefined,
      robots: seo.robots ?? undefined,
      openGraph: {
        type: 'website',
        url: og['og:url'] ?? undefined,
        title: og['og:title'] ?? seo.meta_title ?? undefined,
        description: og['og:description'] ?? seo.meta_description ?? undefined,
        siteName: og['og:site_name'] ?? undefined,
        locale: og['og:locale'] ?? 'id_ID',
        ...(og['og:image']
          ? { images: [{ url: og['og:image'] as string }] }
          : {}),
      },
      twitter: {
        card:
          (tw['twitter:card'] as 'summary_large_image') ??
          'summary_large_image',
        title: tw['twitter:title'] ?? seo.meta_title ?? undefined,
        description:
          tw['twitter:description'] ?? seo.meta_description ?? undefined,
        ...(tw['twitter:image']
          ? { images: [tw['twitter:image'] as string] }
          : {}),
      },
    };
  } catch {
    return {
      title: 'Mitra Jasa Legalitas',
      description: 'Konsultan legalitas bisnis profesional.',
    };
  }
}

export default async function Home() {
  const home = await getCachedHomeData();

  return (
    <>
      {home.seo.json_ld && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(home.seo.json_ld) }}
        />
      )}

      <HeroSection stats={home.stats} whatsappCta={home.whatsapp_cta} />
      <ClientMarquee allServices={home.all_services} />
      <TrustBadges />
      <ServicesSection featuredServices={home.featured_services} />
      <WhyUsSection stats={home.stats} />
      <HowItWorksSection />
      <NetworkSection />
      <CaseStudySection stories={home.client_success_stories} />
      <TestimonialSection testimonials={home.testimonials} stats={home.stats} />
      <BlogSection posts={home.latest_blogs} />
      <FaqSection faqs={home.faqs} />
    </>
  );
}
