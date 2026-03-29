import { SORT_OPTIONS } from "@/lib/types/service";

export type ServiceListUrlState = {
  category: string[];
  price: string[];
  sort: string;
  q: string;
};

const DEFAULT_SORT = "popular";

const VALID_SORT = new Set(SORT_OPTIONS.map((sortOption) => sortOption.id));

export type SearchParamsLike = {
  get(name: string): string | null;
  getAll(name: string): string[];
};

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function parseServiceListQuery(sp: SearchParamsLike): ServiceListUrlState {
  const category = uniqueStrings([...sp.getAll("category"), ...sp.getAll("category[]")]);
  const price = uniqueStrings([...sp.getAll("price"), ...sp.getAll("price[]")]);
  const sortRaw = sp.get("sort") ?? DEFAULT_SORT;
  const sort = VALID_SORT.has(sortRaw) ? sortRaw : DEFAULT_SORT;
  const q = sp.get("q") ?? "";
  return { category, price, sort, q };
}

export function buildServiceListQuery(state: ServiceListUrlState): string {
  const sp = new URLSearchParams();
  for (const categorySlug of state.category) {
    sp.append("category", categorySlug);
  }
  for (const priceRangeId of state.price) {
    sp.append("price", priceRangeId);
  }
  if (state.sort && state.sort !== DEFAULT_SORT) {
    sp.set("sort", state.sort);
  }
  if (state.q.trim()) {
    sp.set("q", state.q.trim());
  }
  return sp.toString();
}

export { DEFAULT_SORT as SERVICE_LIST_DEFAULT_SORT };
