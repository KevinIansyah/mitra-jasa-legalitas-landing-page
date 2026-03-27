'use client';

/**
 * Daftar layanan global — GET /services (tanpa filter kota).
 * Untuk daftar per kota gunakan `CityServiceList` di `kota/[slug]/`.
 * Filter disinkronkan dengan query string URL (?category=&price=&sort=&q=).
 */

import { useMemo, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  buildServicesListPath,
  fetchCities,
  fetchServiceCategories,
  fetchServicesList,
} from '@/lib/api/endpoints/service';
import { ApiError } from '@/lib/types/api';
import type {
  CityListItem,
  ServiceCategoryOption,
  ServiceListItem,
} from '@/lib/types/service';
import { useLayananListUrl } from '@/hooks/use-layanan-list-url';
import { ServiceFilter } from './service-filter';
import { ServiceResults } from './service-results';
import { ServiceToolbar } from './service-toolbar';

const priceRanges = [
  { id: '1', label: '< Rp 1 juta' },
  { id: '2', label: 'Rp 1.000.000 – Rp 2.999.999' },
  { id: '3', label: 'Rp 3.000.000 – Rp 4.999.999' },
  { id: '4', label: 'Rp 5.000.000 – Rp 9.999.999' },
  { id: '5', label: '≥ Rp 10 juta' },
];

export function ServiceList() {
  const {
    selectedCategories,
    selectedPrices,
    sort,
    search,
    setSearchQuery,
    toggleCategory,
    togglePrice,
    setSort,
    resetFilters,
  } = useLayananListUrl();

  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [categoryOptions, setCategoryOptions] = useState<
    ServiceCategoryOption[]
  >([]);
  const [cityOptions, setCityOptions] = useState<CityListItem[]>([]);
  const [apiServices, setApiServices] = useState<ServiceListItem[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [resolvedFetchKey, setResolvedFetchKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchServiceCategories(), fetchCities()])
      .then(([cats, cits]) => {
        if (!cancelled) {
          setCategoryOptions(
            [...cats].sort((a, b) => a.name.localeCompare(b.name, 'id')),
          );
          setCityOptions(
            [...cits].sort((a, b) => a.name.localeCompare(b.name, 'id')),
          );
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const listPath = useMemo(
    () =>
      buildServicesListPath({
        category: selectedCategories,
        price: selectedPrices,
        sort,
      }),
    [selectedCategories, selectedPrices, sort],
  );

  const fetchKey = `${listPath}::${retryKey}`;
  const listLoading = resolvedFetchKey !== fetchKey;

  useEffect(() => {
    const key = `${listPath}::${retryKey}`;
    let cancelled = false;
    fetchServicesList({
      category: selectedCategories,
      price: selectedPrices,
      sort,
    })
      .then((data) => {
        if (!cancelled) {
          setApiServices(data.services);
          setListError(null);
          setResolvedFetchKey(key);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setApiServices([]);
          setListError(
            err instanceof ApiError
              ? err.message
              : 'Gagal memuat daftar layanan.',
          );
          setResolvedFetchKey(key);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [listPath, retryKey]);

  const activeFilterCount =
    selectedCategories.length + selectedPrices.length;

  const categoryLabel = (slug: string) =>
    categoryOptions.find((c) => c.slug === slug)?.name ?? slug;

  const displayed = useMemo(() => {
    let list = apiServices;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.short_description?.toLowerCase().includes(q) ?? false) ||
          (s.category?.name.toLowerCase().includes(q) ?? false),
      );
    }
    return list;
  }, [apiServices, search]);

  const priceLabelById = (id: string) =>
    priceRanges.find((p) => p.id === id)?.label ?? id;

  return (
    <section
      id="layanan"
      className="bg-gray-50 dark:bg-surface-subtle min-h-screen"
    >
      <ServiceToolbar
        search={search}
        onSearchChange={setSearchQuery}
        sort={sort}
        onSortChange={setSort}
        onToggleMobileFilter={() => setShowMobileFilter((o) => !o)}
        activeFilterCount={activeFilterCount}
        listLoading={listLoading}
        displayedCount={displayed.length}
        selectedCategories={selectedCategories}
        selectedPrices={selectedPrices}
        categoryLabel={categoryLabel}
        priceLabelById={priceLabelById}
        onToggleCategory={toggleCategory}
        onTogglePrice={togglePrice}
        onResetFilters={resetFilters}
      />

      <AnimatePresence>
        {showMobileFilter && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden border-b border-gray-100 dark:border-white/8 bg-surface-card"
          >
            <div className="max-w-6xl mx-auto px-4 py-4">
              <ServiceFilter
                categories={categoryOptions}
                cities={cityOptions}
                selectedCategories={selectedCategories}
                onCategoryToggle={toggleCategory}
                selectedPrices={selectedPrices}
                onPriceToggle={togglePrice}
                selectedCities={[]}
                onCityToggle={() => {}}
                onReset={resetFilters}
                activeCount={activeFilterCount}
                cityFilterVariant="link"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-12 lg:pb-20 ">
        <div className="flex gap-5 items-start">
          <aside className="hidden lg:block w-64 shrink-0 sticky top-43">
            <ServiceFilter
              categories={categoryOptions}
              cities={cityOptions}
              selectedCategories={selectedCategories}
              onCategoryToggle={toggleCategory}
              selectedPrices={selectedPrices}
              onPriceToggle={togglePrice}
              selectedCities={[]}
              onCityToggle={() => {}}
              onReset={resetFilters}
              activeCount={activeFilterCount}
              cityFilterVariant="link"
            />
          </aside>

          <ServiceResults
            listError={listError}
            onRetry={() => setRetryKey((k) => k + 1)}
            listLoading={listLoading}
            displayed={displayed}
            apiServices={apiServices}
            search={search}
            sort={sort}
            onSortChange={setSort}
            onResetFilters={resetFilters}
          />
        </div>
      </div>
    </section>
  );
}
