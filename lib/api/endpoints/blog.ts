import { apiClient } from "@/lib/api/client";
import type { BlogCategory, BlogsListPageData } from "@/lib/types/blog";

export type BlogsListParams = {
  page?: number;
  category?: string[];
  tag?: string[];
};

export function buildBlogsPath(params: BlogsListParams = {}): string {
  const sp = new URLSearchParams();
  const page = params.page ?? 1;
  if (page > 1) {
    sp.set("page", String(page));
  }
  for (const categorySlug of params.category ?? []) {
    const trimmed = categorySlug.trim();
    if (trimmed) sp.append("category[]", trimmed);
  }
  for (const tagSlug of params.tag ?? []) {
    const trimmed = tagSlug.trim();
    if (trimmed) sp.append("tag[]", trimmed);
  }
  const q = sp.toString();
  return `/blogs${q ? `?${q}` : ""}`;
}

export async function fetchBlogsList(params: BlogsListParams = {}): Promise<BlogsListPageData> {
  return apiClient.get<BlogsListPageData>(buildBlogsPath(params));
}

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  return apiClient.get<BlogCategory[]>("/blog-categories");
}

// ============================================================================
// BLOG SUBSCRIBERS (POST /blogs/subscribers)
// ============================================================================

export type BlogSubscriberSubscribeBody = {
  email: string;
  name?: string | null;
};

export async function postBlogSubscriberSubscribe(body: BlogSubscriberSubscribeBody): Promise<void> {
  const payload: Record<string, string> = {
    email: body.email.trim(),
  };
  const name = body.name?.trim();
  if (name) payload.name = name;

  await apiClient.post<unknown>("/blogs/subscribers", payload);
}
