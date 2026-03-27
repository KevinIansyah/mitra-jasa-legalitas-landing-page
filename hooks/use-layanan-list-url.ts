'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  buildLayananListQuery,
  parseLayananListQuery,
  type LayananListUrlState,
} from '@/lib/layanan-list-url';

const Q_DEBOUNCE_MS = 320;

/**
 * Filter daftar layanan (kategori, harga, sort, q) ↔ query string URL.
 * Perubahan dari filter memakai `router.replace`; edit URL / back-forward ikut sinkron.
 */
export function useLayananListUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = useMemo(
    () => parseLayananListQuery(searchParams),
    [searchParams],
  );

  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const replaceWithState = useCallback(
    (next: LayananListUrlState) => {
      const qs = buildLayananListQuery(next);
      const url = qs ? `${pathname}?${qs}` : pathname;
      router.replace(url, { scroll: false });
    },
    [pathname, router],
  );

  const replaceState = useCallback(
    (
      patch:
        | Partial<LayananListUrlState>
        | ((prev: LayananListUrlState) => LayananListUrlState),
    ) => {
      const current = parseLayananListQuery(searchParamsRef.current);
      const resolved =
        typeof patch === 'function' ? patch(current) : { ...current, ...patch };
      replaceWithState(resolved);
    },
    [replaceWithState],
  );

  const [searchInput, setSearchInput] = useState(state.q);
  useEffect(() => {
    setSearchInput(state.q);
  }, [state.q]);

  const qDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (qDebounceRef.current) clearTimeout(qDebounceRef.current);
    };
  }, []);

  const setSearchQuery = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (qDebounceRef.current) clearTimeout(qDebounceRef.current);
      if (value === '') {
        const current = parseLayananListQuery(searchParamsRef.current);
        replaceWithState({ ...current, q: '' });
        return;
      }
      qDebounceRef.current = setTimeout(() => {
        const current = parseLayananListQuery(searchParamsRef.current);
        replaceWithState({ ...current, q: value });
      }, Q_DEBOUNCE_MS);
    },
    [replaceWithState],
  );

  const toggleCategory = useCallback(
    (slug: string) => {
      replaceState((prev) => {
        const next = new Set(prev.category);
        if (next.has(slug)) next.delete(slug);
        else next.add(slug);
        return { ...prev, category: [...next] };
      });
    },
    [replaceState],
  );

  const togglePrice = useCallback(
    (id: string) => {
      replaceState((prev) => {
        const next = new Set(prev.price);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return { ...prev, price: [...next] };
      });
    },
    [replaceState],
  );

  const setSort = useCallback(
    (sort: string) => {
      replaceState({ sort });
    },
    [replaceState],
  );

  const resetFilters = useCallback(() => {
    if (qDebounceRef.current) clearTimeout(qDebounceRef.current);
    setSearchInput('');
    replaceWithState({
      category: [],
      price: [],
      sort: 'popular',
      q: '',
    });
  }, [replaceWithState]);

  return {
    selectedCategories: state.category,
    selectedPrices: state.price,
    sort: state.sort,
    search: searchInput,
    setSearchQuery,
    toggleCategory,
    togglePrice,
    setSort,
    resetFilters,
  };
}
