'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { r2Loader } from '@/lib/r2-loader';
import { Clock, ArrowRight, MessageCircle, Newspaper } from 'lucide-react';
import type { BlogAuthor, BlogCard, BlogTocItem } from '@/lib/types/blog';
import { authorInitials } from '@/lib/blog-utils';

const BRAND_BLUE = 'oklch(0.3811 0.1315 260.22)';

export function TableOfContents({ items }: { items: BlogTocItem[] }) {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label="Daftar Isi">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
        Daftar Isi
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block text-sm py-1 pl-3 border-l-2 transition-colors leading-snug ${
                active === item.id
                  ? 'font-semibold border-brand-blue'
                  : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-white/30'
              } ${item.level === 3 ? 'ml-3 text-xs' : ''}`}
              style={active === item.id ? { color: BRAND_BLUE } : {}}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function AuthorCard({ author }: { author: BlogAuthor }) {
  const initials = authorInitials(author.name);
  return (
    <div className="flex items-center gap-3">
      <div
        className="relative w-11 h-11 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-sm font-bold text-white"
        style={{ backgroundColor: BRAND_BLUE }}
      >
        {author.avatar ? (
          <Image
            loader={r2Loader}
            src={author.avatar}
            alt=""
            fill
            className="object-cover"
            sizes="44px"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
          {author.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {author.position ?? '-'}
        </p>
      </div>
    </div>
  );
}

export function RelatedPostsSidebar({ posts }: { posts: BlogCard[] }) {
  if (!posts.length) return null;
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
        Artikel Terkait
      </p>
      <ul className="space-y-4">
        {posts.slice(0, 3).map((relatedPost) => (
          <li key={relatedPost.slug}>
            <Link
              href={`/blog/${relatedPost.slug}`}
              className="group flex gap-3 items-start"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-white/10">
                {relatedPost.featured_image ? (
                  <Image
                    loader={r2Loader}
                    src={relatedPost.featured_image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="56px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-white/10">
                    <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                      <Newspaper className="size-4" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors">
                  {relatedPost.title}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <Clock className="w-3 h-3" />
                  {relatedPost.reading_time != null ? `${relatedPost.reading_time} mnt` : '-'}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SidebarCta() {
  return (
    <div
      className="rounded-2xl p-5 text-white space-y-3"
      style={{ backgroundColor: BRAND_BLUE }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: 'oklch(1 0 0 / 0.15)' }}
      >
        <MessageCircle className="w-5 h-5 text-white" />
      </div>
      <p className="text-sm font-bold leading-snug">
        Butuh konsultasi legalitas bisnis?
      </p>
      <p className="text-xs text-white/70 leading-relaxed">
        Tim konsultan kami siap membantu proses legalitas bisnis Anda dari awal
        hingga selesai.
      </p>
      <Link
        href="/daftar"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white underline underline-offset-2 hover:no-underline group"
      >
        Konsultasi Gratis
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
