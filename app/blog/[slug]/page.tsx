import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Clock, Sparkles, Tag } from 'lucide-react';
import { getBlogDetail } from '@/lib/api/endpoints/blog.server';
import { ApiUnavailableFallback } from '@/components/api-unavailable-fallback';
import { getApiErrorStatus } from '@/lib/types/api';
import { addHeadingIdsToHtml } from '@/lib/blog-heading-html';
import { authorInitials, formatBlogDate } from '@/lib/blog-utils';
import type { BlogCard, BlogSeo } from '@/lib/types/blog';
import {
  TableOfContents,
  AuthorCard,
  SidebarCta,
} from './_components/blog-sidebar';
import { ReadingProgress, BackToTop } from './_components/reading-progress';
import { BlogShareButton } from './_components/blog-share-button';
import { SectionHeading } from '@/components/section-heading';
import { buildBlogListQuery } from '@/lib/blog-list-url';

const BRAND_BLUE = 'oklch(0.3811 0.1315 260.22)';

const getCachedBlogDetail = cache(async (slug: string) => {
  try {
    return await getBlogDetail(slug);
  } catch (e: unknown) {
    if (getApiErrorStatus(e) === 404) notFound();
    return null;
  }
});

function defaultSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mitrajasalegalitas.co.id';
}

function stripJsonLdContext(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const rest = { ...obj };
  delete rest['@context'];
  return rest;
}

function BlogJsonLd({
  schemaMarkup,
}: {
  schemaMarkup: BlogSeo['schema_markup'];
}) {
  if (!schemaMarkup) return null;
  const parts: Record<string, unknown>[] = [];
  if (schemaMarkup.article)
    parts.push(
      stripJsonLdContext(schemaMarkup.article as Record<string, unknown>),
    );
  if (schemaMarkup.breadcrumb)
    parts.push(
      stripJsonLdContext(schemaMarkup.breadcrumb as Record<string, unknown>),
    );
  if (!parts.length) return null;
  const payload = {
    '@context': 'https://schema.org',
    '@graph': parts,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCachedBlogDetail(slug);
  if (!post) return { title: 'Artikel – Mitra Jasa Legalitas' };

  const seo = post.seo;
  const titleBase =
    seo?.meta_title ?? seo?.og_title ?? `${post.title} – Mitra Jasa Legalitas`;
  const desc =
    seo?.meta_description ??
    seo?.og_description ??
    post.short_description ??
    undefined;

  return {
    title: titleBase,
    description: desc,
    alternates: seo?.canonical_url
      ? { canonical: seo.canonical_url }
      : undefined,
    robots: seo?.robots,
    openGraph: {
      title: seo?.og_title ?? seo?.meta_title ?? post.title,
      description: seo?.og_description ?? seo?.meta_description ?? desc,
      images: seo?.og_image ? [{ url: seo.og_image }] : undefined,
      url: seo?.canonical_url ?? undefined,
    },
    twitter: {
      card:
        (seo?.twitter_card as 'summary_large_image' | 'summary') ??
        'summary_large_image',
      title:
        seo?.twitter_title ?? seo?.og_title ?? seo?.meta_title ?? undefined,
      description:
        seo?.twitter_description ??
        seo?.og_description ??
        seo?.meta_description ??
        undefined,
      images: seo?.twitter_image ? [seo.twitter_image] : undefined,
    },
  };
}

function RelatedCard({ p }: { p: BlogCard }) {
  return (
    <Link
      href={`/blog/${p.slug}`}
      className="blog-card group flex flex-col rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-card overflow-hidden"
    >
      <div className="relative h-[180px] overflow-hidden bg-gray-100 dark:bg-white/5">
        {p.featured_image ? (
          <Image
            src={p.featured_image}
            alt=""
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            📄
          </div>
        )}
        <div className="absolute inset-0 bg-black/15" />
        {p.category && (
          <div className="absolute top-3 left-3">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-white"
              style={{ backgroundColor: BRAND_BLUE }}
            >
              <Tag className="w-3 h-3" />
              {p.category.name}
            </span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors flex-1">
          {p.title}
        </h3>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-white/8">
          <span className="text-xs text-gray-400">
            {formatBlogDate(p.published_at)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {p.reading_time != null ? `${p.reading_time} mnt` : '—'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
  const { html: articleHtml, toc } = addHeadingIdsToHtml(post.content ?? '');
  const shareUrl =
    post.seo?.canonical_url ?? `${defaultSiteUrl()}/blog/${post.slug}`;
  const categoryLabel = post.category?.name ?? 'Blog';
  const author = post.author;

  return (
    <>
      {post.seo?.schema_markup && (
        <BlogJsonLd schemaMarkup={post.seo.schema_markup} />
      )}

      <ReadingProgress />
      <BackToTop />

      {/* ── Hero ── */}
      <div className="bg-surface-page pt-16 pb-0">
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
              href="/blog"
              className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-600 dark:text-gray-300 line-clamp-1">
              {categoryLabel}
            </span>
          </nav>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {post.category && (
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: BRAND_BLUE }}
              >
                <Tag className="w-3 h-3" />
                <span className="sm:mb-0.5">{post.category.name}</span>
              </div>
            )}
            {post.is_featured && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                <Sparkles className="w-3 h-3 fill-purple-700 dark:fill-purple-300" />
                <span className="sm:mb-0.5">Unggulan</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight max-w-4xl mb-6">
            {post.title}
          </h1>

          {/* Short description */}
          <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
              {post.short_description}
            </p>
          </div>

          {/* Author */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {author && (
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full shrink-0 overflow-hidden bg-gray-200 dark:bg-white/10">
                  {author.avatar ? (
                    <Image
                      src={author.avatar}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ backgroundColor: BRAND_BLUE }}
                    >
                      {authorInitials(author.name)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {author.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {author.position ?? '—'}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 dark:text-gray-500">
              <span>{formatBlogDate(post.published_at)}</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.reading_time != null
                  ? `${post.reading_time} mnt`
                  : '—'}{' '}
                baca
              </span>
              <span className="text-gray-400 dark:text-gray-500">
                {post.views} tayangan
              </span>
              <BlogShareButton url={shareUrl} title={post.title} />
            </div>
          </div>
        </div>

        {/* Featured image */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="relative w-full h-[260px] sm:h-[340px] lg:h-[420px] rounded-t-3xl overflow-hidden bg-gray-100 dark:bg-white/5">
            {post.featured_image ? (
              <Image
                src={post.featured_image}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1152px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-6xl">
                📄
              </div>
            )}
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>
      </div>

      {/* ── Body  ── */}
      <div className="bg-surface-card border-b border-gray-100 dark:border-white/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Mobile: TOC */}
            <div className="lg:hidden shrink-0">
              <TableOfContents items={toc} />
            </div>

            {/* Main content */}
            <article className="flex-1 min-w-0">
              {articleHtml ? (
                <div
                  className="service-prose max-w-none -mt-2"
                  dangerouslySetInnerHTML={{ __html: articleHtml }}
                />
              ) : (
                <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                  Artikel ini sedang dalam proses penulisan. Silakan hubungi tim
                  kami untuk informasi lebih lengkap.
                </p>
              )}

              {post.tags.length > 0 && (
                <div className="mt-10 pt-10 border-t border-gray-100 dark:border-white/8 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/blog?${buildBlogListQuery({
                        category: [],
                        tag: [tag.slug],
                        q: '',
                      })}`}
                      className="px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 hover:text-brand-blue transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              )}

              {author && (
                <div className="mt-10 p-6 rounded-2xl bg-gray-50 dark:bg-surface-subtle border border-gray-100 dark:border-white/8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                    Tentang Penulis
                  </p>
                  <AuthorCard author={author} />
                  {author.bio && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-3">
                      {author.bio}
                    </p>
                  )}
                </div>
              )}
            </article>

            {/* Desktop: right sidebar (TOC + CTA) */}
            <aside className="hidden lg:block w-full lg:w-[280px] xl:w-[300px] shrink-0">
              <div className="sticky top-24 space-y-10">
                <TableOfContents items={toc} />
                {toc.length > 0 && (
                  <div className="h-px bg-gray-100 dark:bg-white/10" />
                )}

                <SidebarCta />
              </div>
            </aside>

            {/* Mobile: CTA */}
            <div className="lg:hidden shrink-0">
              <SidebarCta />
            </div>
          </div>
        </div>
      </div>

      {/* ── Related Posts ── */}
      {related.length > 0 && (
        <section className="bg-surface-page py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <SectionHeading
                badge="Baca Juga"
                title={
                  <>
                    Artikel <span style={{ color: BRAND_BLUE }}>Terkait</span>
                  </>
                }
                description="Artikel terkait yang mungkin Anda sukai untuk Anda baca lebih lanjut."
                align="left"
              />
              <Link
                href="/blog"
                className="text-sm font-semibold hover:underline transition-colors hidden sm:block"
                style={{ color: BRAND_BLUE }}
              >
                Lihat Semua →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.slice(0, 3).map((p) => (
                <RelatedCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
