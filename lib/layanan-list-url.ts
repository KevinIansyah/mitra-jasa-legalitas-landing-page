/**
 * Query string untuk halaman daftar layanan (/layanan, /layanan/kota/[slug]).
 * Sinkron dengan state filter & API (category, price, sort).
 */

import { sortOptions } from '@/lib/types/service';

export type LayananListUrlState = {
  category: string[];
  price: string[];
  /** Nilai UI: popular | name | price_asc | price_desc | latest */
  sort: string;
  /** Pencarian client-side */
  q: string;
};

const DEFAULT_SORT = 'popular';

const VALID_SORT = new Set(sortOptions.map((o) => o.id));

export type SearchParamsLike = {
  get(name: string): string | null;
  getAll(name: string): string[];
};

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

/** Baca dari query string (Next `useSearchParams()` atau `URLSearchParams`). */
export function parseLayananListQuery(sp: SearchParamsLike): LayananListUrlState {
  const category = uniqueStrings([
    ...sp.getAll('category'),
    ...sp.getAll('category[]'),
  ]);
  const price = uniqueStrings([
    ...sp.getAll('price'),
    ...sp.getAll('price[]'),
  ]);
  const sortRaw = sp.get('sort') ?? DEFAULT_SORT;
  const sort = VALID_SORT.has(sortRaw) ? sortRaw : DEFAULT_SORT;
  const q = sp.get('q') ?? '';
  return { category, price, sort, q };
}

/** String query untuk `router.replace` (tanpa `?`). */
export function buildLayananListQuery(state: LayananListUrlState): string {
  const sp = new URLSearchParams();
  for (const c of state.category) {
    sp.append('category', c);
  }
  for (const p of state.price) {
    sp.append('price', p);
  }
  if (state.sort && state.sort !== DEFAULT_SORT) {
    sp.set('sort', state.sort);
  }
  if (state.q.trim()) {
    sp.set('q', state.q.trim());
  }
  return sp.toString();
}

export { DEFAULT_SORT as LAYANAN_LIST_DEFAULT_SORT };
