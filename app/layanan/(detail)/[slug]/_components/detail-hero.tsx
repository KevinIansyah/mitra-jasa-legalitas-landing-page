import Link from "next/link";
import Image from "next/image";
import { toR2ProxySrc } from "@/lib/r2-loader";
import { ChevronRight, Sparkles, Star, Tag, Toolbox } from "lucide-react";
import type { ServiceDetail } from "@/lib/types/service";

export type ServiceDetailHeroProps = {
  service: ServiceDetail;
  categoryColor: string;
};

export function DetailHero({ service, categoryColor }: ServiceDetailHeroProps) {
  return (
    <div className="bg-surface-page pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/layanan" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
            Layanan
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-600 dark:text-gray-300 line-clamp-1">{service.name}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {service.category ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: categoryColor }}>
              <Tag className="w-3 h-3" />
              <span className="sm:mb-0.5">{service.category.name}</span>
            </div>
          ) : null}
          {service.is_popular ? (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: "oklch(0.7319 0.1856 52.89)" }}>
              <Star className="w-3 h-3 fill-white" />
              <span className="sm:mb-0.5">Populer</span>
            </div>
          ) : null}
          {service.is_featured ? (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              <Sparkles className="w-3 h-3 fill-purple-700 dark:fill-purple-300" />
              <span className="sm:mb-0.5">Unggulan</span>
            </div>
          ) : null}
        </div>

        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-4 max-w-3xl">{service.name}</h1>

        <div className="flex flex-wrap items-end justify-between gap-5">
          <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">{service.short_description}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="relative w-full h-[260px] sm:h-[340px] lg:h-[420px] rounded-t-3xl overflow-hidden bg-gray-100 dark:bg-white/5">
          {service.featured_image ? (
            <Image src={toR2ProxySrc(service.featured_image)} alt={service.name} fill priority unoptimized className="object-cover" sizes="(max-width: 1200px) 100vw, 1152px" />
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
