'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ServiceListItem } from '@/lib/types/service';
import { ServiceCard } from './service-card';
import { BRAND_BLUE, sortOptions } from '@/lib/types/service';
import { Search, XCircle } from 'lucide-react';

export type ServiceResultsProps = {
  listError: string | null;
  onRetry: () => void;
  listLoading: boolean;
  displayed: ServiceListItem[];
  apiServices: ServiceListItem[];
  search: string;
  sort: string;
  onSortChange: (value: string) => void;
  onResetFilters: () => void;
  getServiceHref?: (service: ServiceListItem) => string;
};

export function ServiceResults({
  listError,
  onRetry,
  listLoading,
  displayed,
  apiServices,
  search,
  sort,
  onSortChange,
  onResetFilters,
  getServiceHref,
}: ServiceResultsProps) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {listLoading ? '…' : displayed.length}
          </span>{' '}
          layanan
          {!listLoading && search.trim() && apiServices.length > 0 && (
            <span className="text-gray-400">
              {' '}
              (difilter dari {apiServices.length} hasil)
            </span>
          )}
        </p>
        <SelectGroup className="sm:hidden">
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih urutan..." />
            </SelectTrigger>
            <SelectContent>
              <SelectLabel>Sortir Berdasarkan</SelectLabel>
              {sortOptions.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SelectGroup>
      </div>

      {listError && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 px-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/8 flex items-center justify-center">
            <XCircle className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-sm text-red-700 dark:text-red-300">
            {listError}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="text-sm font-semibold text-brand-blue hover:underline"
          >
            Coba lagi
          </button>
        </div>
      )}

      {!listError && listLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 dark:border-white/8 bg-white dark:bg-surface-card overflow-hidden animate-pulse"
            >
              <div className="h-36 bg-gray-200 dark:bg-white/10" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/3" />
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-4/5" />
                <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!listError && !listLoading && displayed.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/8 flex items-center justify-center">
            <Search className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Tidak ada layanan yang cocok dengan filter Anda.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="text-sm font-semibold hover:underline"
            style={{ color: BRAND_BLUE }}
          >
            Reset filter
          </button>
        </div>
      )}

      {!listError && !listLoading && displayed.length > 0 && (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {displayed.map((service, i) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={i}
                href={getServiceHref?.(service)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
