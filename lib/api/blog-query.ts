/**
 * Query string GET /blogs
 * API: ?category[]=slug&tag[]=slug&page=
 */

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
