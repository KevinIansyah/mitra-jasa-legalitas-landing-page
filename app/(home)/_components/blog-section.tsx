"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { SectionHeading } from "../../../components/section-heading";
import { motion } from "framer-motion";
import type { BlogCard, BlogPost } from "@/lib/types/blog";
import { EASE } from "@/lib/types/constants";

const CATEGORY_COLORS = ["oklch(0.3811 0.1315 260.22)", "oklch(0.5 0.13 270)", "oklch(0.7319 0.1856 52.89)", "oklch(0.55 0.13 160)", "oklch(0.62 0.16 30)"];

function mapBlogCardToPost(
  card: BlogCard,
  colorIndex: number,
): BlogPost {
  return {
    slug: card.slug,
    category: card.category?.name ?? "Blog",
    categoryColor: CATEGORY_COLORS[colorIndex % CATEGORY_COLORS.length],
    title: card.title,
    excerpt: card.short_description ?? "",
    readTime: `${card.reading_time ?? 5} mnt`,
    imageUrl: card.featured_image,
  };
}

function CategoryBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-white" style={{ backgroundColor: color }}>
      <Tag className="w-3 h-3" />
      {label}
    </span>
  );
}

function ReadTime({ time }: { time: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
      <Clock className="w-3 h-3" />
      {time}
    </span>
  );
}

function BlogCoverImage({ src, sizes = "(max-width: 768px) 100vw, 33vw" }: { src: string | null; sizes?: string }) {
  const url = src && src.length > 0 ? src : "/human.jpeg";
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <Image src={url} alt="" fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" sizes={sizes} />
    </div>
  );
}

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
        className="blog-card-image group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-2xl lg:min-h-full"
      >
        <BlogCoverImage src={post.imageUrl} sizes="(max-width: 1024px) 100vw, 34vw" />

        <div className="absolute inset-0 z-10 bg-black/25" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-3/4 bg-linear-to-t from-black/80 to-transparent" />

        <div className="absolute top-4 left-4 z-20">
          <CategoryBadge label={post.category} color="rgba(255,255,255,0.25)" />
        </div>

        <div className="relative z-20 p-6 space-y-2">
          <h3 className="text-lg font-bold text-white leading-snug group-hover:underline underline-offset-2">{post.title}</h3>
          <p className="text-sm text-white/70 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center justify-between pt-2">
            <CategoryBadge label={post.category} color="rgba(255,255,255,0.2)" />
            <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function TextCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
        className="blog-card group relative flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden flex-1"
      >
        <div className="relative h-[120px] w-full overflow-hidden shrink-0">
          <Image
            src={post.imageUrl && post.imageUrl.length > 0 ? post.imageUrl : "/human.jpeg"}
            alt=""
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="400px"
          />
          <div className="absolute inset-0 bg-black/20" />
          {post.badge && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: "oklch(0.7319 0.1856 52.89)" }}>
              {post.badge}
            </span>
          )}
        </div>

        <div className="flex flex-col flex-1 justify-between p-5">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-brand-blue transition-colors">{post.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{post.excerpt}</p>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <CategoryBadge label={post.category} color={post.categoryColor} />
            <ReadTime time={post.readTime} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function TallImageCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
        className="blog-card-image group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-2xl lg:min-h-full"
      >
        <BlogCoverImage src={post.imageUrl} sizes="(max-width: 1024px) 100vw, 34vw" />

        <div className="absolute inset-0 z-10 bg-black/20" />
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black/75 to-transparent z-10" />
        
        <div className="absolute top-4 left-4 z-20">
          <CategoryBadge label={post.category} color="rgba(255,255,255,0.25)" />
        </div>

        <div className="relative z-20 p-6 space-y-2">
          <h3 className="text-base font-bold text-white leading-snug group-hover:underline underline-offset-2">{post.title}</h3>
          <p className="text-xs text-white/70 line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center justify-between pt-2">
            <CategoryBadge label={post.category} color="rgba(255,255,255,0.2)" />
            <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function GridCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
        className="blog-card group flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden"
      >
        <div className="relative h-[180px] w-full overflow-hidden shrink-0">
          <Image
            src={post.imageUrl && post.imageUrl.length > 0 ? post.imageUrl : "/human.jpeg"}
            alt=""
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 600px"
          />

          <div className="absolute inset-0 bg-black/10" />

          <div className="absolute top-3 left-3">
            <CategoryBadge label={post.category} color="rgba(0,0,0,0.4)" />
          </div>
        </div>

        <div className="flex flex-col flex-1 justify-between p-5">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">{post.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">{post.excerpt}</p>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <CategoryBadge label={post.category} color={post.categoryColor} />
            <ReadTime time={post.readTime} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export function BlogSection({ posts }: { posts: BlogCard[] }) {
  const postsNewestFirst = [...posts].sort(
    (left, right) =>
      new Date(right.published_at).getTime() -
      new Date(left.published_at).getTime(),
  );
  const topFourPosts = postsNewestFirst.slice(0, 4);
  const displayPosts = topFourPosts.map((card, colorIndex) =>
    mapBlogCardToPost(card, colorIndex),
  );

  if (displayPosts.length === 0) {
    return null;
  }

  const [featured, second, third, fourth] = displayPosts;

  return (
    <section className="py-20 lg:py-28 bg-surface-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.08, ease: EASE }} className="mb-14">
          <SectionHeading
            badge="Blog"
            title={
              <>
                Insight & Panduan <br className="hidden sm:block" />
                <span style={{ color: "oklch(0.3811 0.1315 260.22)" }}>Legalitas Bisnis</span>
              </>
            }
            description="Artikel terpilih dari tim konsultan kami untuk membantu Anda memahami dunia hukum bisnis."
          />
        </motion.div>

        {displayPosts.length < 4 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {displayPosts.map((post) => (
              <GridCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-4">
            <FeaturedCard post={featured} />

            <div className="flex flex-col gap-5">
              <TextCard post={second} />
              <TextCard post={third} />
            </div>

            <TallImageCard post={fourth} />
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-brand-blue hover:text-brand-blue transition-colors group"
          >
            Lihat Semua Artikel
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
