import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getBlogDetail } from "@/lib/api/endpoints/blog.server";
import { ApiUnavailableFallback } from "@/components/api-unavailable-fallback";
import { getApiErrorStatus } from "@/lib/types/api";
import { addHeadingIdsToHtml } from "@/lib/blog-heading-html";
import type { BlogSeo } from "@/lib/types/blog";
import { ReadingProgress, BackToTop } from "./_components/reading-progress";
import { DetailBody } from "./_components/detail-body";
import { DetailHero } from "./_components/detail-hero";
import { RelatedPostsSection } from "./_components/related-posts";

const getCachedBlogDetail = cache(async (slug: string) => {
  try {
    return await getBlogDetail(slug);
  } catch (e: unknown) {
    if (getApiErrorStatus(e) === 404) notFound();
    return null;
  }
});

function defaultSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://mitrajasalegalitas.co.id";
}

function BlogJsonLd({ schemaMarkup }: { schemaMarkup: BlogSeo["schema_markup"] }) {
  if (!schemaMarkup) return null;

  const graph = [schemaMarkup.article, schemaMarkup.breadcrumb].filter(Boolean).map((schema) => {
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
  const post = await getCachedBlogDetail(slug);
  if (!post) return { title: "Artikel - Mitra Jasa Legalitas" };

  const seo = post.seo;
  const title = seo?.meta_title ?? seo?.og_title ?? `${post.title} - Mitra Jasa Legalitas`;
  const desc = seo?.meta_description ?? seo?.og_description ?? post.short_description ?? undefined;

  const breadcrumbList = (seo?.schema_markup?.breadcrumb as { itemListElement?: unknown } | undefined)?.itemListElement;
  const fromBreadcrumb =
    Array.isArray(breadcrumbList) && breadcrumbList.length > 0
      ? (breadcrumbList[breadcrumbList.length - 1] as { item?: string }).item
      : undefined;
  const canonical = seo?.canonical_url ?? fromBreadcrumb ?? `${defaultSiteUrl()}/blog/${post.slug}`;

  const keywords = [seo?.focus_keyword, ...(seo?.secondary_keywords ?? [])].filter(Boolean) as string[];

  const ogImage = seo?.og_image ?? post.featured_image ?? undefined;
  const twitterImage = seo?.twitter_image ?? seo?.og_image ?? post.featured_image ?? undefined;

  return {
    title,
    description: desc,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical },
    robots: seo?.robots ?? undefined,
    openGraph: {
      title: seo?.og_title ?? seo?.meta_title ?? post.title,
      description: seo?.og_description ?? seo?.meta_description ?? desc,
      images: ogImage ? [{ url: ogImage }] : undefined,
      url: canonical,
    },
    twitter: {
      card: (seo?.twitter_card as "summary_large_image" | "summary") ?? "summary_large_image",
      title: seo?.twitter_title ?? seo?.og_title ?? seo?.meta_title ?? undefined,
      description: seo?.twitter_description ?? seo?.og_description ?? seo?.meta_description ?? undefined,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getCachedBlogDetail(slug);

  if (!post) {
    return (
      <ApiUnavailableFallback
        retryHref={`/blog/${slug}`}
        title="Tidak dapat memuat artikel"
        description="Periksa koneksi internet Anda, lalu muat ulang halaman ini."
      />
    );
  }

  const related = post.related ?? [];
  const { html: articleHtml, toc } = addHeadingIdsToHtml(post.content ?? "");
  const shareBreadcrumbList = (post.seo?.schema_markup?.breadcrumb as { itemListElement?: unknown } | undefined)?.itemListElement;
  const shareFromBreadcrumb =
    Array.isArray(shareBreadcrumbList) && shareBreadcrumbList.length > 0
      ? (shareBreadcrumbList[shareBreadcrumbList.length - 1] as { item?: string }).item
      : undefined;
  const shareUrl = post.seo?.canonical_url ?? shareFromBreadcrumb ?? `${defaultSiteUrl()}/blog/${post.slug}`;
  const categoryLabel = post.category?.name ?? "Blog";
  const author = post.author;

  return (
    <>
      {post.seo?.schema_markup && <BlogJsonLd schemaMarkup={post.seo.schema_markup} />}

      <ReadingProgress />
      <BackToTop />

      <DetailHero post={post} categoryLabel={categoryLabel} shareUrl={shareUrl} author={author} />

      <DetailBody articleHtml={articleHtml} toc={toc} tags={post.tags} author={author} />

      <RelatedPostsSection posts={related} />
    </>
  );
}
