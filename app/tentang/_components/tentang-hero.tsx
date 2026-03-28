'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { EASE, hero } from '../_data/about';

export function TentangHero() {
  return (
    <section className="relative overflow-hidden bg-surface-page pt-16 pb-16 lg:pb-20">
      {/* Blobs */}
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
            Tentang <br className="hidden sm:block" />
            <span style={{ color: 'oklch(0.3811 0.1315 260.22)' }}>
              Mitra Jasa Legalitas
            </span>
          </h1>

          <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-xl">
            Konsultan legalitas dan perizinan usaha yang mendampingi ribuan
            pengusaha Indonesia sejak 2014 — dengan integritas, kecepatan, dan
            layanan yang ramah.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            {hero.chips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/8"
              >
                {chip.showPin && (
                  <MapPin
                    className="w-3.5 h-3.5"
                    style={{ color: 'oklch(0.7319 0.1856 52.89)' }}
                  />
                )}
                {chip.label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
