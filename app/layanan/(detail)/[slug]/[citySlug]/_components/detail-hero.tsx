import Link from 'next/link';
import Image from 'next/image';
import { r2Loader } from '@/lib/r2-loader';
import { ChevronRight, MapPin, Tag, Toolbox } from 'lucide-react';
import type { ServiceCityPage } from '@/lib/types/service';

export type DetailHeroProps = {
  heading: string;
  service: ServiceCityPage['service'];
  city: ServiceCityPage['city'];
  categoryColor: string;
};

export function DetailHero({
  heading,
  service,
  city,
  categoryColor,
}: DetailHeroProps) {
  return (
    <div className="bg-surface-page pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 mb-6 flex-wrap">
          <Link
            href="/"
            className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link
            href="/layanan"
            className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            Layanan
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link
            href={`/layanan/${service.slug}`}
            className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors line-clamp-1"
          >
            {service.name}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-gray-600 dark:text-gray-300 line-clamp-1">
            {city.name}
          </span>
        </nav>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: categoryColor }}
          >
            <Tag className="w-3 h-3" />
            <span className="sm:mb-0.5">{service.name}</span>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-200">
            <MapPin className="w-3 h-3" />
            <span className="sm:mb-0.5">
              {city.name}
              {city.province ? ` · ${city.province}` : ''}
            </span>
          </div>
        </div>

        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-4 max-w-3xl">
          {heading}
        </h1>

        <div className="flex flex-wrap items-end justify-between gap-5">
          <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
            {service.short_description}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="relative w-full h-[260px] sm:h-[340px] lg:h-[420px] rounded-t-3xl overflow-hidden bg-gray-100 dark:bg-white/5">
          {service.featured_image ? (
            <Image
              loader={r2Loader}
              src={service.featured_image}
              alt={heading}
              fill
              priority
              unoptimized
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1152px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                <Toolbox className="size-8" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
