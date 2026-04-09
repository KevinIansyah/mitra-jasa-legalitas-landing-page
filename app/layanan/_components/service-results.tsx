"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ServiceListItem } from "@/lib/types/service";
import { ServiceCard } from "./service-card";
import { SORT_OPTIONS } from "@/lib/types/service";
import { Search, XCircle } from "lucide-react";

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

export function ServiceResults({ listError, onRetry, listLoading, displayed, apiServices, search, sort, onSortChange, onResetFilters, getServiceHref }: ServiceResultsProps) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan <span className="font-semibold text-gray-900 dark:text-white">{listLoading ? "..." : displayed.length}</span> layanan
          {!listLoading && search.trim() && apiServices.length > 0 && <span className="text-gray-400"> (difilter dari {apiServices.length} hasil)</span>}
        </p>
        <SelectGroup className="sm:hidden">
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih urutan..." />
            </SelectTrigger>
            <SelectContent>
              <SelectLabel>Sortir Berdasarkan</SelectLabel>
              {SORT_OPTIONS.map((sortOption) => (
                <SelectItem key={sortOption.id} value={sortOption.id}>
                  {sortOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SelectGroup>
      </div>

      {listError && (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <XCircle className="size-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Terjadi kesalahan</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              {listError} Coba lagi, atau{" "}
              <button type="button" onClick={onRetry} className="underline underline-offset-2">
                muat ulang
              </button>
              .
            </p>
          </div>
        </div>
      )}

      {!listError && listLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, skeletonIndex) => (
            <div key={skeletonIndex} className="rounded-2xl border border-gray-200 dark:border-white/8 bg-white dark:bg-surface-card overflow-hidden animate-pulse">
              <div className="h-36 bg-gray-200 dark:bg-white/10" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/3" />
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-4/5" />
                <div className="h-12 py-4 bg-gray-200 dark:bg-white/10 rounded w-full" />

                <div className="flex items-center gap-2">
                  <div className="h-3 w-3.5 bg-gray-200 dark:bg-white/10 rounded" />
                  <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-full" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3.5 bg-gray-200 dark:bg-white/10 rounded" />
                  <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-full" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3.5 bg-gray-200 dark:bg-white/10 rounded" />
                  <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-full" />
                </div>

                <hr className="border-gray-100 dark:border-white/8" />

                <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-full" />
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3.5 bg-gray-200 dark:bg-white/10 rounded" />
                  <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!listError && !listLoading && displayed.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
            <Search className="size-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Layanan tidak ditemukan</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Tidak ada layanan yang sesuai dengan filter yang dipilih. Coba ubah filter, atau{" "}
              <button type="button" onClick={onResetFilters} className="underline underline-offset-2">
                lihat semua layanan
              </button>
              .
            </p>
          </div>
        </div>
      )}

      {!listError && !listLoading && displayed.length > 0 && (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {displayed.map((service, cardIndex) => (
              <ServiceCard key={service.id} service={service} index={cardIndex} href={getServiceHref?.(service)} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
