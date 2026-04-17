import Link from "next/link";
import Image from "next/image";
import { toR2ProxySrc } from "@/lib/r2-loader";
import { Clock, Newspaper, Tag } from "lucide-react";
import { formatBlogDate } from "@/lib/blog-utils";
import type { BlogRelatedCard } from "@/lib/types/blog";
import { BRAND_BLUE } from "@/lib/types/constants";
import { SectionHeading } from "@/components/section-heading";

function RelatedCard({ post }: { post: BlogRelatedCard }) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card group flex flex-col rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-card overflow-hidden">
      <div className="relative h-[180px] overflow-hidden bg-gray-100 dark:bg-white/5">
        {post.featured_image ? (
          <Image src={toR2ProxySrc(post.featured_image)} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
              <Newspaper className="size-8" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/15" />
        {post.category ? (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-white" style={{ backgroundColor: BRAND_BLUE }}>
              <Tag className="w-3 h-3" />
              {post.category.name}
            </span>
          </div>
        ) : null}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1 space-y-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-brand-blue transition-colors line-clamp-2">{post.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">{post.short_description ?? "-"}</p>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-white/8">
          <span className="text-xs text-gray-400">{formatBlogDate(post.published_at)}</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {post.reading_time != null ? `${post.reading_time} mnt` : "-"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function RelatedPostsSection({ posts }: { posts: BlogRelatedCard[] }) {
  if (!posts.length) return null;

  return (
    <section className="bg-surface-page py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <SectionHeading
            badge="Baca Juga"
            title={
              <>
                Artikel <span style={{ color: BRAND_BLUE }}>Terkait</span>
              </>
            }
            description="Artikel terkait yang mungkin Anda sukai untuk Anda baca lebih lanjut."
          />
          {/* <Link
            href="/blog"
            className="items-center gap-1.5 text-sm font-semibold hover:underline transition-colors hidden sm:flex group"
            style={{ color: BRAND_BLUE }}
          >
            Lihat Semua <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.slice(0, 3).map((post) => (
            <RelatedCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
