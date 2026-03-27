/**
 * Query builder untuk GET /services (list layanan).
 */

export type ServicesListParams = {
  category?: string[];
  price?: string[];
  sort?: string;
};

const SORT_TO_API: Record<string, string> = {
  popular: 'popular',
  name: 'name_asc',
  price_asc: 'price_asc',
  price_desc: 'price_desc',
  latest: 'latest',
};

export function buildServicesListPath(params: ServicesListParams): string {
  const sp = new URLSearchParams();

  for (const slug of params.category ?? []) {
    sp.append('category[]', slug);
  }
  for (const p of params.price ?? []) {
    sp.append('price[]', p);
  }

  const sortKey = params.sort;
  if (sortKey) {
    const apiSort = SORT_TO_API[sortKey] ?? sortKey;
    sp.set('sort', apiSort);
  }

  const q = sp.toString();
  return `/services${q ? `?${q}` : ''}`;
}

/** GET /services/cities/{citySlug} — query sama seperti list global */
export function buildServicesByCityPath(
  citySlug: string,
  params: ServicesListParams,
): string {
  const sp = new URLSearchParams();

  for (const slug of params.category ?? []) {
    sp.append('category[]', slug);
  }
  for (const p of params.price ?? []) {
    sp.append('price[]', p);
  }

  const sortKey = params.sort;
  if (sortKey) {
    const apiSort = SORT_TO_API[sortKey] ?? sortKey;
    sp.set('sort', apiSort);
  }

  const q = sp.toString();
  return `/services/cities/${encodeURIComponent(citySlug)}${q ? `?${q}` : ''}`;
}
