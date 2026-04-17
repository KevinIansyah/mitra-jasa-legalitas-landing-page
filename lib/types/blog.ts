import type { PaginationMeta } from "@/lib/types/api";
import type { ServicesListSeo } from "@/lib/types/service";

// ============================================================================
// SHARED
// ============================================================================

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

export interface BlogAuthor {
  id: number;
  name: string;
  avatar: string | null;
  position: string | null;
  bio: string | null;
}

export interface BlogPost {
  slug: string;
  category: string;
  categoryColor: string;
  title: string;
  excerpt: string;
  readTime: string;
  badge?: string;
  imageUrl: string | null;
}

// ============================================================================
// BLOG CARD (list / latest)
// ============================================================================

export interface BlogCard {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  featured_image: string | null;
  is_featured: boolean;
  views: number;
  reading_time?: number;
  published_at: string;
  category: BlogCategory | null;
  author: BlogAuthor | null;
  tags: BlogTag[];
}

export type BlogRelatedCard = Pick<BlogCard, "id" | "title" | "slug" | "featured_image" | "published_at" | "reading_time" | "category" | "short_description">;

// ============================================================================
// BLOG LIST (GET /blogs)
// ============================================================================

export interface BlogsListPageData {
  seo: ServicesListSeo;
  blogs: BlogCard[];
  meta: PaginationMeta;
}

// ============================================================================
// BLOG DETAIL
// ============================================================================

export interface BlogTocItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export interface BlogDetail extends BlogCard {
  content: string | null;
  seo: BlogSeo | null;
  related?: BlogRelatedCard[];
}

export interface BlogSeo {
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  focus_keyword: string | null;
  secondary_keywords: string[] | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_card: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  robots: string;
  in_sitemap: boolean;
  sitemap_priority: string;
  sitemap_changefreq?: string | null;
  schema_markup: BlogSchemaMarkup | null;
}

export interface BlogSchemaMarkup {
  article?: Record<string, unknown>;
  breadcrumb?: Record<string, unknown>;
}
