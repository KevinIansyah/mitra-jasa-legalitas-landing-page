import type { Metadata } from 'next';
import { Suspense } from 'react';
import { cache } from 'react';
import { BlogHero } from './_components/blog-hero';
import { BlogList } from './_components/blog-list';
import { BlogNewsletter } from './_components/blog-newsletter';
import {
  getBlogsList,
  getBlogCategories,
} from '@/lib/api/endpoints/blog.server';
import {
  parseBlogListQueryFromRecord,
  serializeBlogListState,
} from '@/lib/blog-list-url';

const getCachedBlogsList = cache(() => getBlogsList({ page: 1 }));

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { seo } = await getCachedBlogsList();
    const og = seo.open_graph ?? {};
    const tw = seo.twitter ?? {};
    return {
      title: seo.meta_title ?? 'Blog - Mitra Jasa Legalitas',
      description: seo.meta_description ?? undefined,
      alternates: seo.canonical_url
        ? { canonical: seo.canonical_url }
        : undefined,
      robots: seo.robots ?? undefined,
      openGraph: {
        type: 'website',
        siteName: og['og:site_name'] ?? undefined,
        title: og['og:title'] ?? seo.meta_title ?? undefined,
        description: og['og:description'] ?? seo.meta_description ?? undefined,
        url: og['og:url'] ?? undefined,
        locale: og['og:locale'] ?? 'id_ID',
      },
      twitter: {
        card:
          (tw['twitter:card'] as 'summary_large_image') ??
          'summary_large_image',
        title: tw['twitter:title'] ?? seo.meta_title ?? undefined,
        description:
          tw['twitter:description'] ?? seo.meta_description ?? undefined,
      },
    };
  } catch {
    return {
      title: 'Blog & Artikel - Mitra Jasa Legalitas',
      description:
        'Insight, panduan, dan tips seputar legalitas bisnis di Indonesia.',
    };
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const urlState = parseBlogListQueryFromRecord(sp);
  const initialUrlKey = serializeBlogListState(urlState);

  const [listData, categories] = await Promise.allSettled([
    getBlogsList({
      page: 1,
      category: urlState.category.length > 0 ? urlState.category : undefined,
      tag: urlState.tag.length > 0 ? urlState.tag : undefined,
    }),
    getBlogCategories(),
  ]);

  const list = listData.status === 'fulfilled' ? listData.value : null;
  const cats = categories.status === 'fulfilled' ? categories.value : [];
  const jsonLd = list?.seo?.json_ld ?? null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      <BlogHero
        totalArticles={list?.meta.total ?? 0}
        categoryCount={cats.length}
      />
      <div className="bg-surface-subtle min-h-screen">
        <Suspense
          fallback={
            <div className="min-h-[50vh] bg-gray-50 dark:bg-surface-subtle animate-pulse" />
          }
        >
          <BlogList
            initialListData={list}
            categories={cats}
            initialUrlKey={initialUrlKey}
          />
        </Suspense>
      </div>
      <BlogNewsletter />
    </>
  );
}
