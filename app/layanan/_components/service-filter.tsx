"use client";

import type { CityListItem, ServiceCategoryOption } from "@/lib/types/service";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { BRAND_BLUE } from "@/lib/types/constants";
import { PRICE_RANGES } from "@/lib/types/service";
import { cn } from "@/lib/utils";

export function ServiceFilter({
  categories,
  cities,
  selectedCategories,
  onCategoryToggle,
  selectedPrices,
  onPriceToggle,
  selectedCities,
  onCityToggle,
  onReset,
  activeCount,
  cityFilterVariant = "link",
  activeCitySlug,
}: {
  categories: ServiceCategoryOption[];
  cities: CityListItem[];
  selectedCategories: string[];
  onCategoryToggle: (slug: string) => void;
  selectedPrices: string[];
  onPriceToggle: (id: string) => void;
  selectedCities: string[];
  onCityToggle: (cityName: string) => void;
  onReset: () => void;
  activeCount: number;
  cityFilterVariant?: "checkbox" | "link" | "hidden";
  activeCitySlug?: string | null;
}) {
  const [openCategory, setOpenCategory] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openCity, setOpenCity] = useState(true);

  const searchParams = useSearchParams();
  const cityListQuery = searchParams.toString();

  return (
    <div className="bg-surface-card rounded-2xl border border-gray-100 dark:border-white/8 p-5 space-y-1">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Filter</p>
        {activeCount > 0 && (
          <button type="button" onClick={onReset} className="text-xs font-semibold text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline transition-colors">
            Reset ({activeCount})
          </button>
        )}
      </div>

      <div className="pb-4 border-b border-gray-100 dark:border-white/8">
        <button type="button" onClick={() => setOpenCategory((isOpen) => !isOpen)} className="flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
          Kategori
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openCategory ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence initial={false}>
          {openCategory && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
              <div className="space-y-2 pt-1">
                {categories.map((cat) => (
                  <label key={cat.slug} className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={selectedCategories.includes(cat.slug)} onChange={() => onCategoryToggle(cat.slug)} className="sr-only" />
                    <div
                      className={`min-w-4 min-h-4 rounded-[4px] border flex items-center justify-center transition-all ${
                        selectedCategories.includes(cat.slug) ? "border-transparent" : "border-gray-300 dark:border-white/20"
                      }`}
                      style={
                        selectedCategories.includes(cat.slug)
                          ? {
                              backgroundColor: BRAND_BLUE,
                              borderColor: BRAND_BLUE,
                            }
                          : {}
                      }
                    >
                      {selectedCategories.includes(cat.slug) && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{cat.name}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pb-4 border-b border-gray-100 dark:border-white/8">
        <button type="button" onClick={() => setOpenPrice((isOpen) => !isOpen)} className="flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
          Rentang Harga
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openPrice ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence initial={false}>
          {openPrice && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
              <div className="space-y-2 pt-1">
                {PRICE_RANGES.map((priceRange) => (
                  <label key={priceRange.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={selectedPrices.includes(priceRange.id)} onChange={() => onPriceToggle(priceRange.id)} className="sr-only" />
                    <div
                      className={`min-w-4 min-h-4 rounded-[4px] border flex items-center justify-center transition-all ${
                        selectedPrices.includes(priceRange.id) ? "border-brand-blue bg-brand-blue" : "border-gray-300 dark:border-white/20"
                      }`}
                    >
                      {selectedPrices.includes(priceRange.id) && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{priceRange.label}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {cityFilterVariant !== "hidden" && (
        <div className="pb-4">
          <button type="button" onClick={() => setOpenCity((isOpen) => !isOpen)} className="flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
            Kota
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openCity ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence initial={false}>
            {openCity && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
                <div className="flex flex-wrap gap-2 pt-1 max-h-48 overflow-y-auto pr-1 content-start">
                  {cities.map((city) => {
                    const isActiveCity = Boolean(activeCitySlug) && activeCitySlug === city.slug;
                    return cityFilterVariant === "link" ? (
                      <Link
                        key={city.slug}
                        href={cityListQuery ? `/layanan/kota/${city.slug}?${cityListQuery}` : `/layanan/kota/${city.slug}`}
                        aria-current={isActiveCity ? "page" : undefined}
                        className={cn(
                          "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/25 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900",
                          isActiveCity
                            ? "border-none bg-brand-blue text-white shadow-sm "
                            : cn(
                                "border-gray-200 bg-white text-gray-700",
                                "hover:border-brand-blue/45 hover:bg-brand-blue/6 hover:text-gray-900",
                                "dark:border-white/15 dark:bg-white/6 dark:text-gray-200",
                                "dark:hover:border-brand-blue/50 dark:hover:bg-brand-blue/10 dark:hover:text-white",
                              ),
                        )}
                      >
                        {city.name}
                      </Link>
                    ) : (
                      <button
                        key={city.slug}
                        type="button"
                        onClick={() => onCityToggle(city.name)}
                        className={cn(
                          "inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors",
                          selectedCities.includes(city.name) || (Boolean(activeCitySlug) && activeCitySlug === city.slug)
                            ? "border-brand-blue bg-brand-blue text-white shadow-sm"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-white/15 dark:bg-white/6 dark:text-gray-200 dark:hover:border-white/30",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900",
                        )}
                      >
                        {city.name}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
