/**
 * Blog — path builder & fetch klien (`apiClient`), dipakai komponen `'use client'`.
 * Untuk RSC / Server Actions gunakan `blog.server.ts`.
 * API: ?category[]=slug&tag[]=slug&page=
 */

import { apiClient } from '@/lib/api/client';
import type { BlogCategory, BlogsListPageData } from '@/lib/types/blog';

export type BlogsListParams = {
  page?: number;
  category?: string[];
  tag?: string[];
};

export function buildBlogsPath(params: BlogsListParams = {}): string {
  const sp = new URLSearchParams();
  const page = params.page ?? 1;
  if (page > 1) {
    sp.set('page', String(page));
  }
  for (const c of params.category ?? []) {
    const s = c.trim();
    if (s) sp.append('category[]', s);
  }
  for (const t of params.tag ?? []) {
    const s = t.trim();
    if (s) sp.append('tag[]', s);
  }
  const q = sp.toString();
  return `/blogs${q ? `?${q}` : ''}`;
}

export async function fetchBlogsList(
  params: BlogsListParams = {},
): Promise<BlogsListPageData> {
  return apiClient.get<BlogsListPageData>(buildBlogsPath(params));
}

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  return apiClient.get<BlogCategory[]>('/blog-categories');
}
