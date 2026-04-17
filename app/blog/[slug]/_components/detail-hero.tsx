import Link from "next/link";
import Image from "next/image";
import { r2Loader } from "@/lib/r2-loader";
import { ChevronRight, Clock, Newspaper, Sparkles, Tag } from "lucide-react";
import type { BlogAuthor, BlogDetail } from "@/lib/types/blog";
import { authorInitials, formatBlogDate } from "@/lib/blog-utils";
import { BRAND_BLUE } from "@/lib/types/constants";
import { BlogShareButton } from "./blog-share-button";

export type BlogDetailHeroProps = {
  post: Pick<BlogDetail, "title" | "short_description" | "category" | "is_featured" | "featured_image" | "published_at" | "reading_time" | "views">;
  categoryLabel: string;
  shareUrl: string;
  author: BlogAuthor | null;
};

export function DetailHero({ post, categoryLabel, shareUrl, author }: BlogDetailHeroProps) {
  return (
    <div className="bg-surface-page pt-16 pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/blog" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            Blog
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-600 dark:text-gray-300 line-clamp-1">{categoryLabel}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.category ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: BRAND_BLUE }}>
              <Tag className="w-3 h-3" />
              <span className="sm:mb-0.5">{post.category.name}</span>
            </div>
          ) : null}
          {post.is_featured ? (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              <Sparkles className="w-3 h-3 fill-purple-700 dark:fill-purple-300" />
              <span className="sm:mb-0.5">Unggulan</span>
            </div>
          ) : null}
        </div>

        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight leading-tight max-w-4xl mb-6">{post.title}</h1>

        <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
          <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">{post.short_description}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          {author ? (
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full shrink-0 overflow-hidden bg-gray-200 dark:bg-white/10">
                {author.avatar ? (
                  <Image loader={r2Loader} src={author.avatar} alt="" fill className="object-cover" sizes="36px" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: BRAND_BLUE }}>
                    {authorInitials(author.name)}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{author.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{author.position ?? "-"}</p>
              </div>
            </div>
          ) : null}
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 dark:text-gray-500">
            <span>{formatBlogDate(post.published_at)}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.reading_time != null ? `${post.reading_time} mnt` : "-"} baca
            </span>
            <span className="text-gray-400 dark:text-gray-500">{post.views} tayangan</span>
            <BlogShareButton url={shareUrl} title={post.title} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="relative w-full aspect-video lg:aspect-16/6 rounded-t-3xl overflow-hidden bg-gray-100 dark:bg-white/5">
          {post.featured_image ? (
            <Image loader={r2Loader} src={post.featured_image} alt="" fill priority className="object-cover" sizes="(max-width: 1200px) 100vw, 1152px" unoptimized />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                <Newspaper className="size-8" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
