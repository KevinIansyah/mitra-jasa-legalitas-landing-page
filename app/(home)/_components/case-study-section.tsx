'use client';

import { motion } from 'framer-motion';
import { Clock, FileCheck, Trophy } from 'lucide-react';
import { SectionHeading } from '../../../components/section-heading';
import type { ClientSuccessStory } from '@/lib/types/home';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const INDUSTRY_LABEL: Record<string, string> = {
  retail: 'Retail & E-Commerce',
  konstruksi: 'Konstruksi & Developer',
  fnb: 'F&B Resto & Cafe',
  teknologi: 'Teknologi & Software',
};

function industryLabel(raw: string | null): string {
  if (!raw) return 'Industri';
  const key = raw.toLowerCase();
  return INDUSTRY_LABEL[key] ?? raw;
}

interface Stat {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface CaseStudy {
  id: string;
  industry: string;
  company: string;
  heroStat: string;
  heroLabel: string;
  challenge: string;
  result: string;
  stats: Stat[];
}

function mapStory(s: ClientSuccessStory): CaseStudy {
  const statIcons = [Clock, Trophy, FileCheck] as const;
  const raw = [s.stat_1, s.stat_2, s.stat_3];
  const stats: Stat[] = raw.map((st, i) =>
    st
      ? {
          icon: statIcons[i] ?? Clock,
          label: st.label,
          value: st.value,
        }
      : {
          icon: statIcons[i] ?? Clock,
          label: '—',
          value: '—',
        },
  );

  return {
    id: String(s.id),
    industry: industryLabel(s.industry),
    company: s.client_name,
    heroStat: s.metric_value ?? '—',
    heroLabel: s.metric_label ?? '',
    challenge: s.challenge ?? '',
    result: s.solution ?? '',
    stats,
  };
}

function FeaturedCard({ c, index }: { c: CaseStudy; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: EASE }}
      className="group relative flex flex-col justify-between rounded-2xl p-5 md:p-8 overflow-hidden h-full"
      style={{ backgroundColor: 'oklch(0.3811 0.1315 260.22)' }}
    >
      {/* Background decoration */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10"
        style={{ backgroundColor: 'white' }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-10"
        style={{ backgroundColor: 'oklch(0.7319 0.1856 52.89)' }}
      />

      <div className="relative z-10 space-y-6">
        {/* Industry chip */}
        <span className="inline-block text-xs font-medium text-white/60 border border-white/20 rounded-full px-3 py-1">
          {c.industry}
        </span>

        {/* Hero stat */}
        <div>
          <p className="text-6xl font-extrabold text-white leading-none tracking-tight">
            {c.heroStat}
          </p>
          <p className="text-sm text-white/60 mt-1.5">{c.heroLabel}</p>
        </div>

        {/* Company */}
        <div>
          <p className="text-xs text-white/50 uppercase tracking-widest mb-1">
            Klien
          </p>
          <p className="text-lg font-bold text-white leading-snug">
            {c.company}
          </p>
        </div>

        {/* Challenge */}
        <div className="space-y-1">
          <p className="text-xs text-white/40 uppercase tracking-widest">
            Tantangan
          </p>
          <p className="text-sm text-white/75 leading-relaxed">{c.challenge}</p>
        </div>

        {/* Result */}
        <div className="space-y-1">
          <p className="text-xs text-white/40 uppercase tracking-widest">
            Solusi
          </p>
          <p className="text-sm text-white/75 leading-relaxed">{c.result}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 mt-8 pt-6 border-t border-white/15 grid grid-cols-3 gap-3">
        {c.stats.map((s) => (
          <div key={s.label}>
            <p className="text-base font-extrabold text-white">{s.value}</p>
            <p className="text-[10px] text-white/50 mt-0.5 leading-snug">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RegularCard({ c, index }: { c: CaseStudy; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      className="blog-card group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5"
    >
      <div className="space-y-4">
        {/* Top row: chip + arrow */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-3 py-1">
            {c.industry}
          </span>
        </div>

        {/* Hero stat */}
        <div>
          <p
            className="text-5xl font-extrabold leading-none tracking-tight"
            style={{ color: 'oklch(0.3811 0.1315 260.22)' }}
          >
            {c.heroStat}
          </p>
          <p className="text-xs text-gray-400 mt-1">{c.heroLabel}</p>
        </div>

        {/* Company */}
        <p className="text-base font-bold text-gray-900 leading-snug group-hover:text-brand-blue transition-colors">
          {c.company}
        </p>

        {/* Challenge + result */}
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
              Tantangan
            </p>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
              {c.challenge}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
              Solusi
            </p>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
              {c.result}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-3 gap-2">
        {c.stats.map((s) => (
          <div key={s.label}>
            <p className="text-sm font-extrabold text-gray-900">{s.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function WideCard({ c, index }: { c: CaseStudy; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      className="blog-card group flex flex-col sm:flex-row gap-6 rounded-2xl border border-gray-200 bg-white p-5 h-full"
    >
      {/* Left: hero stat + company */}
      <div className="sm:w-48 shrink-0 flex flex-col justify-between gap-4">
        <span className="text-xs text-gray-400 border border-gray-200 rounded-full px-3 py-1 w-fit">
          {c.industry}
        </span>
        <div>
          <p
            className="text-5xl font-extrabold leading-none tracking-tight"
            style={{ color: 'oklch(0.3811 0.1315 260.22)' }}
          >
            {c.heroStat}
          </p>
          <p className="text-xs text-gray-400 mt-1">{c.heroLabel}</p>
        </div>
        <p className="text-sm font-bold text-gray-900 leading-snug group-hover:text-brand-blue transition-colors">
          {c.company}
        </p>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px bg-gray-100 shrink-0" />
      <div className="sm:hidden h-px bg-gray-100 w-full" />

      {/* Right: challenge + result + stats */}
      <div className="flex flex-col justify-between gap-4 flex-1 min-w-0">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
              Tantangan
            </p>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
              {c.challenge}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
              Solusi
            </p>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
              {c.result}
            </p>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-3">
          {c.stats.map((s) => (
            <div key={s.label}>
              <p className="text-sm font-extrabold text-gray-900">{s.value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function CaseStudySection({
  stories,
}: {
  stories: ClientSuccessStory[];
}) {
  const cases = stories.map(mapStory);
  if (cases.length < 4) {
    return null;
  }
  const [featured, card2, card3, card4] = cases;

  return (
    <section className="py-20 lg:py-28 bg-surface-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
          className="mb-14"
        >
          <SectionHeading
            badge="Kisah Sukses"
            title={
              <>
                Klien Kami Berhasil, {' '}
                <br className="hidden sm:block" />
                <span style={{ color: 'oklch(0.3811 0.1315 260.22)' }}>
                  Bisnis Anda Bisa Juga
                </span>
              </>
            }
            description="Studi kasus nyata dari klien yang berhasil menavigasi tantangan legalitas bisnis bersama kami."
          />
        </motion.div>

        {/* ── Desktop layout (lg:grid-cols-3) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Featured */}
          <div className="md:row-span-2 lg:row-span-2 flex">
            <FeaturedCard c={featured} index={0} />
          </div>

          {/* Card 2 */}
          <RegularCard c={card2} index={1} />

          {/* Card 3 */}
          <RegularCard c={card3} index={2} />

          {/* Card 4 – wide */}
          <div className="md:col-span-1 lg:col-span-2 flex">
            <WideCard c={card4} index={3} />
          </div>
        </div>

        {/* ── CTA ── */}
        {/* <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/case-study"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-brand-blue hover:text-brand-blue transition-colors group"
          >
            Lihat Semua Kisah Sukses
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div> */}
      </div>
    </section>
  );
}
