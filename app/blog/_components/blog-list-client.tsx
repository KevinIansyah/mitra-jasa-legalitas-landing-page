'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Tag, Search, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchBlogsList } from '@/lib/api/endpoints/blog';
import { ApiError } from '@/lib/types/api';
import type {
  BlogCard,
  BlogCategory,
  BlogsListPageData,
} from '@/lib/types/blog';
import { BRAND_BLUE, BRAND_ORANGE } from '@/lib/types/service';
import { useBlogListUrl } from '@/hooks/use-blog-list-url';
import {
  serializeBlogListState,
  type BlogListUrlState,
} from '@/lib/blog-list-url';
import { EASE } from '@/lib/types/constants';

const CATEGORY_BADGE_COLORS = [
  BRAND_BLUE,
  BRAND_ORANGE,
  'oklch(0.5 0.13 270)',
  'oklch(0.55 0.13 160)',
  'oklch(0.62 0.16 30)',
  'oklch(0.45 0.12 200)',
];

function badgeColorForCategory(categoryId: number | null | undefined): string {
  if (categoryId == null) return BRAND_BLUE;
  return CATEGORY_BADGE_COLORS[
    Math.abs(categoryId) % CATEGORY_BADGE_COLORS.length
  ];
}

function formatPublished(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function CategoryBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-white leading-none"
      style={{ backgroundColor: color }}
    >
      <Tag className="w-3 h-3 shrink-0" />
      {label}
    </span>
  );
}

function BlogPostCard({ post, index }: { post: BlogCard; index: number }) {
  const cat = post.category;
  const color = badgeColorForCategory(cat?.id);
  const readLabel =
    post.reading_time != null ? `${post.reading_time} mnt` : '-';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: EASE }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="blog-card group flex flex-col rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-card overflow-hidden h-full"
      >
        <div className="relative h-[200px] w-full overflow-hidden shrink-0 bg-gray-100 dark:bg-white/5">
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl bg-gray-100 dark:bg-white/5">
              📄
            </div>
          )}
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            {cat && <CategoryBadge label={cat.name} color={color} />}
            {post.is_featured && (
              <span
                className="px-2.5 py-1 rounded-full text-xs font-semibold text-white leading-none shrink-0"
                style={{ backgroundColor: BRAND_ORANGE }}
              >
                Unggulan
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 p-5 gap-3">
          <div className="flex-1 space-y-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
              {post.short_description ?? '-'}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/8">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatPublished(post.published_at)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <Clock className="w-3 h-3" />
              {readLabel}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

type Props = {
  initialListData: BlogsListPageData | null;
  categories: BlogCategory[];
  initialUrlKey: string;
};

export function BlogListClient({
  initialListData,
  categories,
  initialUrlKey,
}: Props) {
  const {
    state,
    search,
    setSearchQuery,
    setCategorySlug,
    toggleTag,
    resetFilters,
  } = useBlogListUrl();

  const [blogs, setBlogs] = useState<BlogCard[]>(initialListData?.blogs ?? []);
  const [meta, setMeta] = useState(initialListData?.meta ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stateKey = serializeBlogListState(state);

  const loadPage = useCallback(
    async (
      nextPage: number,
      filterState: BlogListUrlState,
      append: boolean,
    ) => {
      setLoading(true);
      setError(null);
      if (!append) {
        setBlogs([]);
      }
      try {
        const data = await fetchBlogsList({
          page: nextPage,
          category:
            filterState.category.length > 0 ? filterState.category : undefined,
          tag: filterState.tag.length > 0 ? filterState.tag : undefined,
        });
        if (append) {
          setBlogs((prev) => [...prev, ...data.blogs]);
        } else {
          setBlogs(data.blogs);
        }
        setMeta(data.meta);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : 'Gagal memuat artikel.');
        if (!append) {
          setBlogs([]);
          setMeta(null);
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (stateKey === initialUrlKey && initialListData) {
      setBlogs(initialListData.blogs);
      setMeta(initialListData.meta);
      setError(null);
      return;
    }
    loadPage(1, state, false);
  }, [stateKey, initialUrlKey, initialListData, loadPage, state]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.short_description?.toLowerCase().includes(q) ?? false) ||
        (p.category?.name.toLowerCase().includes(q) ?? false),
    );
  }, [blogs, search]);

  const hasMore =
    meta != null && meta.current_page < meta.last_page && !search.trim();

  function handleCategoryChange(slug: string) {
    setCategorySlug(slug === 'all' ? null : slug);
  }

  function handleLoadMore() {
    if (!meta || loading || search.trim()) return;
    loadPage(meta.current_page + 1, state, true);
  }

  const categorySelectValue =
    state.category.length === 0 ? 'all' : state.category[0];

  const activeCategoryLabel =
    state.category.length === 0
      ? 'Semua kategori'
      : (categories.find((c) => c.slug === state.category[0])?.name ??
        'Kategori');

  const hasActiveFilters =
    state.category.length > 0 || state.tag.length > 0 || search.trim() !== '';

  return (
    <>
      <div className="sticky top-16 z-30 bg-white/90 dark:bg-[oklch(0.17_0.02_260)]/95 backdrop-blur-md border-b border-gray-100 dark:border-white/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 py-3">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={search}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm rounded-full border border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/8 focus:outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-white/12 transition-colors placeholder:text-gray-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="items-center gap-2 sm:ml-auto flex">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap hidden sm:inline">
                Kategori:
              </span>
              <SelectGroup>
                <Select
                  value={categorySelectValue}
                  onValueChange={handleCategoryChange}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectLabel>Filter kategori</SelectLabel>
                    <SelectItem value="all">Semua kategori</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SelectGroup>
            </div>
          </div>

          {state.tag.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pb-3">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Tag:
              </span>
              {state.tag.map((slug) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => toggleTag(slug)}
                  className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-medium text-white transition-colors"
                  style={{ backgroundColor: BRAND_ORANGE }}
                >
                  <span className="sm:mb-0.5">#{slug}</span>
                  <X className="w-3 h-3 shrink-0 opacity-70" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pb-20">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {search.trim() ? filtered.length : blogs.length}
            </span>{' '}
            artikel
            {state.category.length > 0 && (
              <>
                {' · '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {activeCategoryLabel}
                </span>
              </>
            )}
            {state.tag.length > 0 && (
              <>
                {' · '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {state.tag.length} tag
                </span>
              </>
            )}
            {meta && !search.trim() && (
              <span className="text-gray-400 dark:text-gray-500">
                {' '}
                (total {meta.total})
              </span>
            )}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => resetFilters()}
              className="text-xs font-semibold text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline transition-colors"
            >
              Reset filter
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 px-4 py-6 text-center mb-8">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <button
              type="button"
              onClick={() => loadPage(1, state, false)}
              className="mt-3 text-sm font-semibold text-brand-blue hover:underline"
            >
              Coba lagi
            </button>
          </div>
        )}

        {loading && blogs.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, skeletonIndex) => (
              <div
                key={skeletonIndex}
                className="rounded-2xl border border-gray-200 dark:border-white/8 overflow-hidden animate-pulse"
              >
                <div className="h-[200px] bg-gray-200 dark:bg-white/10" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/8 flex items-center justify-center">
              <Search className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Tidak ada artikel yang cocok.
            </p>
            <button
              type="button"
              onClick={() => resetFilters()}
              className="text-sm font-semibold text-brand-blue hover:underline"
            >
              Lihat semua artikel
            </button>
          </div>
        )}

        {filtered.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((post, cardIndex) => (
                <BlogPostCard key={post.id} post={post} index={cardIndex} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {hasMore && !loading && filtered.length > 0 && (
          <div className="mt-12 flex justify-center">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              type="button"
              onClick={handleLoadMore}
              disabled={loading}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-gray-200 dark:border-white/15 bg-white dark:bg-surface-card text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-brand-blue hover:text-brand-blue transition-colors group disabled:opacity-50"
            >
              {loading ? 'Memuat…' : 'Muat lebih banyak'}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>
        )}

        {loading && blogs.length > 0 && (
          <p className="text-center text-sm text-gray-400 mt-8">Memuat…</p>
        )}
      </div>
    </>
  );
}
