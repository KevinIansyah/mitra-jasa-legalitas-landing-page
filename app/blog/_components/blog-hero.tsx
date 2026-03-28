'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, TrendingUp, Users } from 'lucide-react';
import { CountUp } from '@/app/(home)/_components/count-up';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

type BlogHeroProps = {
  totalArticles?: number;
  categoryCount?: number;
};

export function BlogHero({
  totalArticles = 0,
  categoryCount = 0,
}: BlogHeroProps) {
  const stats = [
    {
      icon: BookOpen,
      countTo: totalArticles,
      suffix: '+',
      label: 'Artikel Tersedia',
    },
    { icon: Users, countTo: 50, suffix: 'K+', label: 'Pembaca Bulanan' },
    {
      icon: TrendingUp,
      countTo: Math.max(categoryCount, 1),
      suffix: '',
      label: 'Kategori Topik',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <section className="relative overflow-hidden bg-surface-page pt-16 pb-16 lg:pb-20">
      <motion.div
        aria-hidden
        className="absolute top-[-60px] right-[-40px] w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, oklch(0.3811 0.1315 260.22 / 0.28) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute top-[60px] right-[4%] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, oklch(0.7319 0.1856 52.89 / 0.35) 0%, transparent 60%)',
          filter: 'blur(38px)',
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-0 left-[4%] w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, oklch(0.7319 0.1856 52.89 / 0.2) 0%, transparent 62%)',
          filter: 'blur(45px)',
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight"
            >
              Insight & Panduan <br className="hidden sm:block" />
              <span style={{ color: 'oklch(0.3811 0.1315 260.22)' }}>
                Legalitas Bisnis
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-xl"
            >
              Artikel praktis dari tim konsultan kami — dari cara mendirikan
              perusahaan, mengurus perizinan, hingga strategi perlindungan
              kekayaan intelektual.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/daftar"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'oklch(0.3811 0.1315 260.22)' }}
              >
                Konsultasi Gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#newsletter"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/15 bg-white dark:bg-white/8 hover:border-gray-300 dark:hover:border-white/25 transition-colors"
              >
                Langganan Newsletter
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-row flex-wrap lg:flex-col gap-4 lg:gap-3 shrink-0"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={itemVariants}
                className="flex items-center gap-3 bg-white dark:bg-surface-card rounded-2xl border border-gray-100 dark:border-white/10 px-5 py-3"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: 'oklch(0.3811 0.1315 260.22 / 0.08)',
                  }}
                >
                  <s.icon
                    className="w-4 h-4"
                    style={{ color: 'oklch(0.3811 0.1315 260.22)' }}
                  />
                </div>
                <div>
                  <CountUp
                    to={s.countTo}
                    suffix={s.suffix}
                    duration={2}
                    className="text-lg font-extrabold text-gray-900 dark:text-white leading-none"
                  />
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {s.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
