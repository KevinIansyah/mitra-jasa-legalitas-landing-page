'use client';

import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { City } from '@/lib/types/service';
import { EASE } from '@/lib/types/constants';

type CityHeroProps = {
  city: Pick<City, 'name' | 'slug' | 'province'>;
};

export function CityHero({ city }: CityHeroProps) {
  return (
    <section className="relative overflow-hidden bg-surface-page pt-28 pb-12 lg:pb-16">
      <motion.div
        aria-hidden
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, oklch(0.3811 0.1315 260.22 / 0.12) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
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
            <span className="text-gray-600 dark:text-gray-300 line-clamp-1">
              {city.name}
            </span>
          </nav>

          {city.province && (
            <div className="mb-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-200">
              <MapPin className="w-3 h-3" />
              <span className="sm:mb-0.5">{city.province}</span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-4">
            Layanan di{' '}
            <span style={{ color: 'oklch(0.3811 0.1315 260.22)' }}>
              {city.name}
            </span>
          </h1>

          <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
            Temukan layanan legalitas yang tersedia untuk wilayah ini. Filter
            kategori, rentang harga, dan urutan sesuai kebutuhan Anda.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
