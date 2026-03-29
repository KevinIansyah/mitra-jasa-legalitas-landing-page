'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Award, BadgeCheck, GraduationCap } from 'lucide-react';
import { EASE } from '@/lib/types/constants';

const BADGES = [
  {
    icon: ShieldCheck,
    title: 'Kemenkumham',
    subtitle: 'Terdaftar Resmi',
    color: 'oklch(0.3811 0.1315 260.22)',
    bg: 'oklch(0.3811 0.1315 260.22 / 0.07)',
  },
  {
    icon: Award,
    title: 'ISO Certified',
    subtitle: 'Standar Internasional',
    color: 'oklch(0.7319 0.1856 52.89)',
    bg: 'oklch(0.7319 0.1856 52.89 / 0.08)',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Partner',
    subtitle: 'Government Verified',
    color: 'oklch(0.3811 0.1315 260.22)',
    bg: 'oklch(0.3811 0.1315 260.22 / 0.07)',
  },
  {
    icon: GraduationCap,
    title: 'Legal Expert',
    subtitle: 'Ahli Bersertifikat',
    color: 'oklch(0.7319 0.1856 52.89)',
    bg: 'oklch(0.7319 0.1856 52.89 / 0.08)',
  },
];

export function TrustBadges() {
  return (
    <section className="relative bg-surface-page overflow-hidden py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200/60 dark:bg-white/8 rounded-2xl overflow-hidden">
          {BADGES.map((badge, badgeIndex) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: badgeIndex * 0.08, ease: EASE }}
              className="relative flex items-center gap-4 bg-surface-page px-6 py-5 group hover:bg-surface-card transition-colors"
            >
              <div
                className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: badge.bg }}
              >
                <badge.icon
                  className="w-5 h-5"
                  style={{ color: badge.color }}
                  strokeWidth={2}
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {badge.title}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">
                  {badge.subtitle}
                </p>
              </div>

              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-none"
                style={{
                  background: `radial-gradient(ellipse at 0% 50%, ${badge.bg} 0%, transparent 70%)`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
