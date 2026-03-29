'use client';

import { motion } from 'framer-motion';
import { Scale, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { EASE } from '@/lib/types/constants';

type ServiceHeroProps = {
  serviceCount?: number;
  categoryCount?: number;
};

export function ServiceHero({
  serviceCount = 0,
  categoryCount = 0,
}: ServiceHeroProps) {
  const hasStats = serviceCount > 0 && categoryCount > 0;

  return (
    <section className="relative overflow-hidden bg-surface-page pt-16 pb-16 lg:pb-20">
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
      <motion.div
        aria-hidden
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, oklch(0.7319 0.1856 52.89 / 0.1) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-5">
            Semua Layanan <br className="hidden sm:block" />
            <span style={{ color: 'oklch(0.3811 0.1315 260.22)' }}>
              Legalitas Bisnis
            </span>
          </h1>

          <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-xl">
            {hasStats ? (
              <>
                {serviceCount} layanan tersedia di {categoryCount} kategori. Dari
                pendirian badan usaha, perizinan, kekayaan intelektual, hingga
                konsultasi hukum - semuanya bisa diurus bersama kami.
              </>
            ) : (
              <>
                Berbagai layanan legalitas bisnis dalam berbagai kategori. Dari
                pendirian badan usaha, perizinan, kekayaan intelektual, hingga
                konsultasi hukum - semuanya bisa diurus bersama kami.
              </>
            )}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/daftar"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-opacity group"
              style={{ backgroundColor: 'oklch(0.3811 0.1315 260.22)' }}
            >
              Konsultasi Gratis
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#layanan"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/15 bg-white dark:bg-white/8 hover:border-gray-300 dark:hover:border-white/25 transition-colors"
            >
              <Scale className="size-4" />
              Lihat Semua Layanan
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
