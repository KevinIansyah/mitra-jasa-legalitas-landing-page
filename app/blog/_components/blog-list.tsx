"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchBlogsList } from "@/lib/api/endpoints/blog";
import { ApiError } from "@/lib/types/api";
import type { BlogCard, BlogCategory, BlogsListPageData } from "@/lib/types/blog";
import { BRAND_ORANGE } from "@/lib/types/constants";
import { useBlogListUrl } from "@/hooks/use-blog-list-url";
import { serializeBlogListState, type BlogListUrlState } from "@/lib/blog-list-url";
import { BlogResults } from "./blog-results";

type Props = {
  initialListData: BlogsListPageData | null;
  categories: BlogCategory[];
  initialUrlKey: string;
};

export function BlogList({ initialListData, categories, initialUrlKey }: Props) {
  const { state, search, setSearchQuery, setCategorySlug, toggleTag, resetFilters } = useBlogListUrl();

  const [blogs, setBlogs] = useState<BlogCard[]>(initialListData?.blogs ?? []);
  const [meta, setMeta] = useState(initialListData?.meta ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stateKey = serializeBlogListState(state);

  const loadPage = useCallback(async (nextPage: number, filterState: BlogListUrlState, append: boolean) => {
    setLoading(true);
    setError(null);
    if (!append) {
      setBlogs([]);
    }
    try {
      const data = await fetchBlogsList({
        page: nextPage,
        category: filterState.category.length > 0 ? filterState.category : undefined,
        tag: filterState.tag.length > 0 ? filterState.tag : undefined,
      });
      if (append) {
        setBlogs((prev) => [...prev, ...data.blogs]);
      } else {
        setBlogs(data.blogs);
      }
      setMeta(data.meta);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Gagal memuat artikel.");
      if (!append) {
        setBlogs([]);
        setMeta(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

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
    return blogs.filter((p) => p.title.toLowerCase().includes(q) || (p.short_description?.toLowerCase().includes(q) ?? false) || (p.category?.name.toLowerCase().includes(q) ?? false));
  }, [blogs, search]);

  const hasMore = meta != null && meta.current_page < meta.last_page && !search.trim();

  function handleCategoryChange(slug: string) {
    setCategorySlug(slug === "all" ? null : slug);
  }

  function handleLoadMore() {
    if (!meta || loading || search.trim()) return;
    loadPage(meta.current_page + 1, state, true);
  }

  const categorySelectValue = state.category.length === 0 ? "all" : state.category[0];

  const activeCategoryLabel = state.category.length === 0 ? "Semua kategori" : (categories.find((c) => c.slug === state.category[0])?.name ?? "Kategori");

  const hasActiveFilters = state.category.length > 0 || state.tag.length > 0 || search.trim() !== "";

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
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Hapus teks pencarian"
                >
                  <X className="w-3.5 h-3.5" aria-hidden />
                </button>
              )}
            </div>

            <div className="items-center gap-2 sm:ml-auto flex">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap hidden sm:inline">Kategori:</span>
              <SelectGroup>
                <Select value={categorySelectValue} onValueChange={handleCategoryChange} disabled={loading}>
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
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Tag:</span>
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
        <BlogResults
          listError={error}
          onRetry={() => loadPage(1, state, false)}
          listLoading={loading}
          blogs={blogs}
          displayed={filtered}
          search={search}
          meta={meta}
          activeCategoryLabel={activeCategoryLabel}
          hasCategoryFilter={state.category.length > 0}
          tagCount={state.tag.length}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetFilters}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
        />
      </div>
    </>
  );
}
