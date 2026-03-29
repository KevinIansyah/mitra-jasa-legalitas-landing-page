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

function toValArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export function parseBlogListQueryFromRecord(
  queryRecord: Record<string, string | string[] | undefined>,
): BlogListUrlState {
  const category: string[] = [];
  const tag: string[] = [];
  let q = '';

  for (const [paramKey, paramValue] of Object.entries(queryRecord)) {
    if (paramKey === 'q') {
      q =
        typeof paramValue === 'string'
          ? paramValue
          : Array.isArray(paramValue)
            ? paramValue[0] ?? ''
            : '';
      continue;
    }
    if (paramKey === 'category' || paramKey === 'category[]') {
      category.push(...toValArray(paramValue).filter(Boolean));
    }
    if (paramKey === 'tag' || paramKey === 'tag[]') {
      tag.push(...toValArray(paramValue).filter(Boolean));
    }
  }

  return {
    category: uniqueStrings(category),
    tag: uniqueStrings(tag),
    q: q.trim(),
  };
}

export function parseBlogListQuery(sp: SearchParamsLike): BlogListUrlState {
  const category = uniqueStrings([
    ...sp.getAll('category[]'),
    ...sp.getAll('category'),
  ]);
  const tag = uniqueStrings([...sp.getAll('tag[]'), ...sp.getAll('tag')]);
  const q = sp.get('q') ?? '';
  return { category, tag, q: q.trim() };
}

export function serializeBlogListState(state: BlogListUrlState): string {
  return JSON.stringify({
    category: [...state.category].sort(),
    tag: [...state.tag].sort(),
    q: state.q.trim(),
  });
}

export function buildBlogListQuery(state: BlogListUrlState): string {
  const sp = new URLSearchParams();
  for (const categorySlug of state.category) {
    if (categorySlug.trim()) sp.append('category[]', categorySlug.trim());
  }
  for (const tagSlug of state.tag) {
    if (tagSlug.trim()) sp.append('tag[]', tagSlug.trim());
  }
  if (state.q.trim()) {
    sp.set('q', state.q.trim());
  }
  return sp.toString();
}
