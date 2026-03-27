import { apiClient } from '@/lib/api/client';
import { buildBlogsPath, type BlogsListParams } from '@/lib/api/blog-query';
import type { BlogCategory, BlogsListPageData } from '@/lib/types/blog';

export async function fetchBlogsList(
  params: BlogsListParams = {},
): Promise<BlogsListPageData> {
  return apiClient.get<BlogsListPageData>(buildBlogsPath(params));
}

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  return apiClient.get<BlogCategory[]>('/blog-categories');
}
