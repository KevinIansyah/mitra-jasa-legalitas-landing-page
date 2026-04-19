"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BRAND_BLUE, BRAND_ORANGE } from "@/lib/types/constants";
import { SORT_OPTIONS } from "@/lib/types/service";

export type ServiceToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  onToggleMobileFilter: () => void;
  activeFilterCount: number;
  listLoading: boolean;
  displayedCount: number;
  selectedCategories: string[];
  selectedPrices: string[];
  categoryLabel: (slug: string) => string;
  priceLabelById: (id: string) => string;
  onToggleCategory: (slug: string) => void;
  onTogglePrice: (id: string) => void;
  onResetFilters: () => void;
};

export function ServiceToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  onToggleMobileFilter,
  activeFilterCount,
  selectedCategories,
  selectedPrices,
  categoryLabel,
  priceLabelById,
  onToggleCategory,
  onTogglePrice,
  onResetFilters,
}: ServiceToolbarProps) {
  return (
    <div className="sticky top-16 z-30 bg-white/90 dark:bg-[oklch(0.17_0.02_260)]/95 backdrop-blur-md border-b border-gray-100 dark:border-white/8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari layanan..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm rounded-full border border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/8 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-brand-blue focus:bg-white dark:focus:bg-white/12 transition-colors placeholder:text-gray-400"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Hapus teks pencarian"
              >
                <X className="w-3.5 h-3.5" aria-hidden />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleMobileFilter}
            className="lg:hidden relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 dark:border-white/15 bg-white dark:bg-white/8 text-gray-700 dark:text-gray-300 hover:border-gray-300 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ backgroundColor: BRAND_BLUE }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 ml-auto">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">Urutkan:</span>
            <SelectGroup>
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
        </div>

        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 pb-2.5 overflow-x-auto scrollbar-none">
            {selectedCategories.map((slug) => (
              <button
                key={`c-${slug}`}
                type="button"
                onClick={() => onToggleCategory(slug)}
                className="shrink-0 flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: BRAND_BLUE }}
              >
                <span className="sm:mb-0.5">{categoryLabel(slug)}</span> <X className="w-3 h-3" />
              </button>
            ))}
            {selectedPrices.map((id) => (
              <button
                key={`p-${id}`}
                type="button"
                onClick={() => onTogglePrice(id)}
                className="shrink-0 flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: BRAND_ORANGE }}
              >
                <span className="sm:mb-0.5">{priceLabelById(id)}</span> <X className="w-3 h-3" />
              </button>
            ))}
            <button type="button" onClick={onResetFilters} className="shrink-0 text-xs font-semibold text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline ml-1 transition-colors">
              Hapus semua
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
