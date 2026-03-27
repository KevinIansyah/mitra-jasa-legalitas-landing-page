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
  buildBlogListQuery,
  parseBlogListQuery,
  type BlogListUrlState,
} from '@/lib/blog-list-url';

const Q_DEBOUNCE_MS = 320;

export function useBlogListUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = useMemo(
    () => parseBlogListQuery(searchParams),
    [searchParams],
  );

  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const replaceWithState = useCallback(
    (next: BlogListUrlState) => {
      const qs = buildBlogListQuery(next);
      const url = qs ? `${pathname}?${qs}` : pathname;
      router.replace(url, { scroll: false });
    },
    [pathname, router],
  );

  const replaceState = useCallback(
    (
      patch:
        | Partial<BlogListUrlState>
        | ((prev: BlogListUrlState) => BlogListUrlState),
    ) => {
      const current = parseBlogListQuery(searchParamsRef.current);
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
        const current = parseBlogListQuery(searchParamsRef.current);
        replaceWithState({ ...current, q: '' });
        return;
      }
      qDebounceRef.current = setTimeout(() => {
        const current = parseBlogListQuery(searchParamsRef.current);
        replaceWithState({ ...current, q: value });
      }, Q_DEBOUNCE_MS);
    },
    [replaceWithState],
  );

  /** Select kategori: satu slug atau kosong (semua). */
  const setCategorySlug = useCallback(
    (slug: string | null) => {
      replaceState({
        category: slug ? [slug] : [],
      });
    },
    [replaceState],
  );

  const toggleTag = useCallback(
    (slug: string) => {
      replaceState((prev) => {
        const next = new Set(prev.tag);
        if (next.has(slug)) next.delete(slug);
        else next.add(slug);
        return { ...prev, tag: [...next] };
      });
    },
    [replaceState],
  );

  const resetFilters = useCallback(() => {
    if (qDebounceRef.current) clearTimeout(qDebounceRef.current);
    setSearchInput('');
    replaceWithState({
      category: [],
      tag: [],
      q: '',
    });
  }, [replaceWithState]);

  return {
    state,
    search: searchInput,
    setSearchQuery,
    setCategorySlug,
    toggleTag,
    resetFilters,
    replaceState,
  };
}
