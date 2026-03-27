'use client';

import { motion } from 'framer-motion';
import { CountUp } from '@/app/(home)/_components/count-up';
import { EASE } from '../_data/about';
import type { CompanyInformationStats } from '@/lib/types/company-information';
import {
  buildTentangStatItems,
  FALLBACK_TENTANG_STAT_ITEMS,
} from '../_data/tentang-stats-from-api';

type TentangStatsSectionProps = {
  /** Dari GET `/company-information` → `stats`. Jika `null`, pakai angka cadangan lokal. */
  stats: CompanyInformationStats | null;
};

export function TentangStatsSection({ stats }: TentangStatsSectionProps) {
  const items =
    stats != null
      ? buildTentangStatItems(stats)
      : FALLBACK_TENTANG_STAT_ITEMS;

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              className="blog-card group flex flex-col gap-4 rounded-2xl border border-gray-200 dark:border-white/10 p-5 text-center"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tabular-nums group-hover:text-brand-blue transition-colors">
                {s.kind === 'count' ? (
                  <CountUp to={s.to} suffix={s.suffix} duration={2.2} />
                ) : (
                  <span>
                    {s.rating.toFixed(1)}
                    <span className="text-lg font-bold text-gray-500 dark:text-gray-400">
                      /5
                    </span>
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-blue transition-colors">
                  {s.label}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {s.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
