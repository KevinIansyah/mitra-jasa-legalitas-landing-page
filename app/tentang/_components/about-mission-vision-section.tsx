'use client';

import { motion } from 'framer-motion';
import { Target, Eye } from 'lucide-react';
import { missionVision } from '../_data/about';
import { EASE } from '@/lib/types/constants';

export function AboutMissionVisionSection() {
  return (
    <section className="py-16 lg:py-20 bg-surface-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
            className="blog-card rounded-2xl border border-gray-200 dark:border-white/10 p-8 lg:p-10 relative overflow-hidden"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: 'oklch(0.3811 0.1315 260.22 / 0.12)' }}
            >
              <Target
                className="w-6 h-6"
                style={{ color: 'oklch(0.3811 0.1315 260.22)' }}
              />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4">
              {missionVision.mission.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {missionVision.mission.body}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
            className="blog-card rounded-2xl border border-gray-200 dark:border-white/10 p-8 lg:p-10 relative overflow-hidden"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: 'oklch(0.7319 0.1856 52.89 / 0.12)' }}
            >
              <Eye
                className="w-6 h-6"
                style={{ color: 'oklch(0.7319 0.1856 52.89)' }}
              />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4">
              {missionVision.vision.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {missionVision.vision.body}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
