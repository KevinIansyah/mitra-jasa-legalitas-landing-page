import { apiServer } from '@/lib/api/server';
import { buildBlogsPath, type BlogsListParams } from '@/lib/api/blog-query';
import type { BlogCategory, BlogDetail, BlogsListPageData } from '@/lib/types/blog';

export async function getBlogsList(
  params: BlogsListParams = {},
): Promise<BlogsListPageData> {
  return apiServer.get<BlogsListPageData>(buildBlogsPath(params));
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  return apiServer.get<BlogCategory[]>('/blog-categories');
}

export async function getBlogDetail(slug: string): Promise<BlogDetail> {
  return apiServer.get<BlogDetail>(`/blogs/${slug}`);
}
