'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tag, Clock, MapPin, CheckCheck } from 'lucide-react';
import type { ServiceListItem } from '@/lib/types/service';
import { formatIdrFromApi } from '@/lib/utils';
import { BRAND_BLUE, BRAND_ORANGE } from '@/lib/types/service';
import { EASE } from '@/lib/types/service';

function packageFeatureNames(
  pkg: ServiceListItem['cheapest_package'],
  max = 3,
): string[] {
  if (!pkg?.features?.length) return [];
  const sorted = [...pkg.features].sort((a, b) => a.sort_order - b.sort_order);
  const included = sorted
    .filter((f) => f.is_included)
    .map((f) => f.feature_name);
  if (included.length >= max) return included.slice(0, max);
  const out = [...included];
  for (const f of sorted) {
    if (!f.is_included && out.length < max) out.push(f.feature_name);
  }
  return out.slice(0, max);
}

export function ServiceCard({
  service,
  index,
  href,
}: {
  service: ServiceListItem;
  index: number;
  href?: string;
}) {
  const catColor = service.category?.palette_color?.trim() || BRAND_BLUE;
  const priceLabel = service.cheapest_package
    ? formatIdrFromApi(service.cheapest_package.price)
    : '—';
  const duration = service.cheapest_package?.duration ?? '—';
  const desc = service.short_description?.trim() || '—';
  const features = packageFeatureNames(service.cheapest_package);
  const cities =
    service.city_pages.length > 0
      ? service.city_pages.map((c) => c.name)
      : null;

  const cardHref = href ?? `/layanan/${service.slug}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.04, 0.24),
        ease: EASE,
      }}
    >
      <Link
        href={cardHref}
        className="blog-card group flex flex-col h-full rounded-2xl border border-gray-200 bg-white dark:bg-surface-card overflow-hidden"
      >
        <div className="relative h-36 w-full shrink-0 bg-gray-100 dark:bg-white/5">
          {service.featured_image ? (
            <Image
              src={service.featured_image}
              alt={service.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl">
              📋
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-5 gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                {service.category && (
                  <div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold text-white leading-none"
                    style={{ backgroundColor: catColor }}
                  >
                    <Tag className="w-2.5 h-2.5" />
                    <p className="sm:mb-0.5">{service.category.name}</p>
                  </div>
                )}
                {service.is_popular && (
                  <div
                    className="px-2 py-[2px] rounded-full text-[10px] font-bold text-white leading-none"
                    style={{ backgroundColor: BRAND_ORANGE }}
                  >
                    <p className="sm:mb-0.5">Populer</p>
                  </div>
                )}
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-2 leading-snug group-hover:text-brand-blue transition-colors">
                {service.name}
              </h3>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 min-h-0">
            {desc}
          </p>

          <ul className="space-y-1.5">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-[11px] text-gray-600 dark:text-gray-400"
              >
                <CheckCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <span className="leading-snug">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/8 space-y-2">
            <p className="font-semibold text-gray-900 dark:text-white text-xs">
              {priceLabel ? `Mulai ${priceLabel}` : '—'}
            </p>

            <div className="space-y-1">
              <div className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{duration}</span>
              </div>
              {cities && (
                <div className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{cities.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
