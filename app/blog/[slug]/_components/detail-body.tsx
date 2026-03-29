import Link from 'next/link';
import type { BlogAuthor, BlogTag, BlogTocItem } from '@/lib/types/blog';
import { buildBlogListQuery } from '@/lib/blog-list-url';
import {
  TableOfContents,
  AuthorCard,
  SidebarCta,
} from './blog-sidebar';

export type BlogDetailBodyProps = {
  articleHtml: string;
  toc: BlogTocItem[];
  tags: BlogTag[];
  author: BlogAuthor | null;
};

export function DetailBody({
  articleHtml,
  toc,
  tags,
  author,
}: BlogDetailBodyProps) {
  return (
    <div className="bg-surface-card border-b border-gray-100 dark:border-white/8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:hidden shrink-0">
            <TableOfContents items={toc} />
          </div>

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

            {tags.length > 0 ? (
              <div className="mt-10 pt-10 border-t border-gray-100 dark:border-white/8 flex flex-wrap gap-2">
                {tags.map((tag) => (
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
            ) : null}

            {author ? (
              <div className="mt-10 p-6 rounded-2xl bg-gray-50 dark:bg-surface-subtle border border-gray-100 dark:border-white/8">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                  Tentang Penulis
                </p>
                <AuthorCard author={author} />
                {author.bio ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-3">
                    {author.bio}
                  </p>
                ) : null}
              </div>
            ) : null}
          </article>

          <aside className="hidden lg:block w-full lg:w-[280px] xl:w-[300px] shrink-0">
            <div className="sticky top-24 space-y-10">
              <TableOfContents items={toc} />
              {toc.length > 0 ? (
                <div className="h-px bg-gray-100 dark:bg-white/10" />
              ) : null}

              <SidebarCta />
            </div>
          </aside>

          <div className="lg:hidden shrink-0">
            <SidebarCta />
          </div>
        </div>
      </div>
    </div>
  );
}
