"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, XCircle } from "lucide-react";
import type { BlogCard } from "@/lib/types/blog";
import type { PaginationMeta } from "@/lib/types/api";
import { BlogCard as BlogPostCard } from "./blog-card";

export type BlogResultsProps = {
  listError: string | null;
  onRetry: () => void;
  listLoading: boolean;
  blogs: BlogCard[];
  displayed: BlogCard[];
  search: string;
  meta: PaginationMeta | null;
  activeCategoryLabel: string;
  hasCategoryFilter: boolean;
  tagCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  hasMore: boolean;
  onLoadMore: () => void;
};

export function BlogResults({
  listError,
  onRetry,
  listLoading,
  blogs,
  displayed,
  search,
  meta,
  activeCategoryLabel,
  hasCategoryFilter,
  tagCount,
  hasActiveFilters,
  onResetFilters,
  hasMore,
  onLoadMore,
}: BlogResultsProps) {
  const showCount = search.trim() ? displayed.length : blogs.length;

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan <span className="font-semibold text-gray-900 dark:text-white">{listLoading && blogs.length === 0 ? "..." : showCount}</span> artikel
          {hasCategoryFilter && (
            <>
              {" · "}
              <span className="font-semibold text-gray-900 dark:text-white">{activeCategoryLabel}</span>
            </>
          )}
          {tagCount > 0 && (
            <>
              {" · "}
              <span className="font-semibold text-gray-900 dark:text-white">{tagCount} tag</span>
            </>
          )}
          {meta && !search.trim() && <span className="text-gray-400 dark:text-gray-500"> (total {meta.total})</span>}
        </p>
        {hasActiveFilters && (
          <button type="button" onClick={() => onResetFilters()} className="text-xs font-semibold text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline transition-colors">
            Reset filter
          </button>
        )}
      </div>

      {listError && (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <XCircle className="size-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Terjadi kesalahan</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              {listError} Coba lagi, atau{" "}
              <button type="button" onClick={onRetry} className="underline underline-offset-2">
                muat ulang
              </button>
              .
            </p>
          </div>
        </div>
      )}

      {!listError && listLoading && blogs.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, skeletonIndex) => (
            <div key={skeletonIndex} className="rounded-2xl border border-gray-200 dark:border-white/8 overflow-hidden animate-pulse">
              <div className="h-[200px] bg-gray-200 dark:bg-white/10" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-2/3" />
                <div className="h-10 bg-gray-200 dark:bg-white/10 rounded w-full" />

                <hr className="border-gray-100 dark:border-white/8" />

                <div className="flex items-center justify-between gap-2">
                  <div className="h-3 w-14 bg-gray-200 dark:bg-white/10 rounded" />
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3.5 bg-gray-200 dark:bg-white/10 rounded" />
                    <div className="h-3 w-10 bg-gray-200 dark:bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!listError && !listLoading && displayed.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
            <Search className="size-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Artikel tidak ditemukan</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Tidak ada artikel yang sesuai dengan filter yang dipilih. Coba ubah filter, atau{" "}
              <button type="button" onClick={() => onResetFilters()} className="underline underline-offset-2">
                lihat semua artikel
              </button>
              .
            </p>
          </div>
        </div>
      )}

      {displayed.length > 0 && (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {displayed.map((post, cardIndex) => (
              <BlogPostCard key={post.id} post={post} index={cardIndex} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {hasMore && !listLoading && displayed.length > 0 && (
        <div className="mt-12 flex justify-center">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            type="button"
            onClick={onLoadMore}
            disabled={listLoading}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-gray-200 dark:border-white/15 bg-white dark:bg-surface-card text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-brand-blue hover:text-brand-blue transition-colors group disabled:opacity-50"
          >
            {listLoading ? "Memuat..." : "Muat lebih banyak"}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>
      )}

      {listLoading && blogs.length > 0 && <p className="text-center text-sm text-gray-400 mt-8">Memuat...</p>}
    </div>
  );
}
