/**
 * Query string halaman /blog — sinkron dengan filter & API (category[], tag[], q).
 */

export type BlogListUrlState = {
  category: string[];
  tag: string[];
  q: string;
};

export type SearchParamsLike = {
  get(name: string): string | null;
  getAll(name: string): string[];
};

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function toValArray(v: string | string[] | undefined): string[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

/** Untuk `searchParams` Server Component Next.js. */
export function parseBlogListQueryFromRecord(
  r: Record<string, string | string[] | undefined>,
): BlogListUrlState {
  const category: string[] = [];
  const tag: string[] = [];
  let q = '';

  for (const [key, val] of Object.entries(r)) {
    if (key === 'q') {
      q = typeof val === 'string' ? val : Array.isArray(val) ? val[0] ?? '' : '';
      continue;
    }
    if (key === 'category' || key === 'category[]') {
      category.push(...toValArray(val).filter(Boolean));
    }
    if (key === 'tag' || key === 'tag[]') {
      tag.push(...toValArray(val).filter(Boolean));
    }
  }

  return {
    category: uniqueStrings(category),
    tag: uniqueStrings(tag),
    q: q.trim(),
  };
}

/** Untuk `useSearchParams()` / URLSearchParams. */
export function parseBlogListQuery(sp: SearchParamsLike): BlogListUrlState {
  const category = uniqueStrings([
    ...sp.getAll('category[]'),
    ...sp.getAll('category'),
  ]);
  const tag = uniqueStrings([...sp.getAll('tag[]'), ...sp.getAll('tag')]);
  const q = sp.get('q') ?? '';
  return { category, tag, q: q.trim() };
}

/** Stabil untuk membandingkan state server vs client (hindari double fetch). */
export function serializeBlogListState(state: BlogListUrlState): string {
  return JSON.stringify({
    category: [...state.category].sort(),
    tag: [...state.tag].sort(),
    q: state.q.trim(),
  });
}

/** String query untuk `router.replace` (tanpa `?`). */
export function buildBlogListQuery(state: BlogListUrlState): string {
  const sp = new URLSearchParams();
  for (const c of state.category) {
    if (c.trim()) sp.append('category[]', c.trim());
  }
  for (const t of state.tag) {
    if (t.trim()) sp.append('tag[]', t.trim());
  }
  if (state.q.trim()) {
    sp.set('q', state.q.trim());
  }
  return sp.toString();
}
