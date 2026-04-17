"use client";

import Link from "next/link";
import Image from "next/image";
import { toR2ProxySrc } from "@/lib/r2-loader";
import { Clock, Tag, Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import type { BlogCard as BlogCardModel } from "@/lib/types/blog";
import { BRAND_BLUE, BRAND_ORANGE, EASE } from "@/lib/types/constants";

const CATEGORY_BADGE_COLORS = [BRAND_BLUE, BRAND_ORANGE, "oklch(0.5 0.13 270)", "oklch(0.55 0.13 160)", "oklch(0.62 0.16 30)", "oklch(0.45 0.12 200)"];

function badgeColorForCategory(categoryId: number | null | undefined): string {
  if (categoryId == null) return BRAND_BLUE;
  return CATEGORY_BADGE_COLORS[Math.abs(categoryId) % CATEGORY_BADGE_COLORS.length];
}

function formatPublished(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function CategoryBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-white leading-none" style={{ backgroundColor: color }}>
      <Tag className="w-3 h-3 shrink-0" />
      {label}
    </span>
  );
}

export function BlogCard({ post, index }: { post: BlogCardModel; index: number }) {
  const cat = post.category;
  const color = badgeColorForCategory(cat?.id);
  const readLabel = post.reading_time != null ? `${post.reading_time} mnt` : "-";

  return (
    <motion.div layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16, scale: 0.97 }} transition={{ duration: 0.45, delay: index * 0.05, ease: EASE }}>
      <Link href={`/blog/${post.slug}`} className="blog-card group flex flex-col rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-card overflow-hidden h-full">
        <div className="relative h-[200px] w-full overflow-hidden shrink-0 bg-gray-100 dark:bg-white/5">
          {post.featured_image ? (
            <Image
              src={toR2ProxySrc(post.featured_image)}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl bg-gray-100 dark:bg-white/5">
              <div className="w-16 h-16 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                <Newspaper className="size-8" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            {cat && <CategoryBadge label={cat.name} color={color} />}
            {post.is_featured && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-white leading-none shrink-0" style={{ backgroundColor: BRAND_ORANGE }}>
                Unggulan
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 p-5 gap-3">
          <div className="flex-1 space-y-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">{post.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">{post.short_description ?? "-"}</p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/8">
            <span className="text-xs text-gray-400 dark:text-gray-500">{formatPublished(post.published_at)}</span>
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
