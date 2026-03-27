'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap,
  BadgeDollarSign,
  UsersRound,
  MessageCircleHeart,
  ShieldCheck,
  Headphones,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { CountUp } from './count-up';
import { SectionHeading } from '../../../components/section-heading';
import type { HomeStats } from '@/lib/types/home';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

function buildWhyUsStats(s: HomeStats) {
  return [
    {
      key: 'clients',
      label: 'Klien dilayani',
      suffix: '+',
      value: s.total_clients,
      kind: 'count' as const,
    },
    {
      key: 'documents',
      label: 'Dokumen diproses',
      suffix: '+',
      value: s.total_documents,
      kind: 'count' as const,
    },
    {
      key: 'years',
      label: 'Pengalaman',
      suffix: ' thn',
      value: s.years_experience,
      kind: 'count' as const,
    },
    {
      key: 'rating',
      label: 'Rating',
      kind: 'rating' as const,
      rating: s.rating,
      reviews: s.total_reviews,
    },
  ];
}

const reasons = [
  {
    icon: Zap,
    title: 'Proses Cepat & Efisien',
    description:
      'Selesaikan legalitas dalam 7–14 hari kerja dengan alur yang terstruktur dan tim yang berdedikasi.',
    color: 'oklch(0.7319 0.1856 52.89)',
    bg: 'oklch(0.7319 0.1856 52.89 / 0.1)',
  },
  {
    icon: BadgeDollarSign,
    title: 'Harga Transparan',
    description:
      'Tidak ada biaya tersembunyi. Semua biaya dikomunikasikan sejak konsultasi awal sebelum Anda memutuskan.',
    color: 'oklch(0.55 0.15 160)',
    bg: 'oklch(0.55 0.15 160 / 0.1)',
  },
  {
    icon: UsersRound,
    title: 'Tim Berpengalaman',
    description:
      'Didampingi konsultan hukum profesional dengan pengalaman lebih dari 10 tahun di bidang legalitas bisnis.',
    color: 'oklch(0.3811 0.1315 260.22)',
    bg: 'oklch(0.3811 0.1315 260.22 / 0.08)',
  },
  {
    icon: MessageCircleHeart,
    title: 'Konsultasi Gratis',
    description:
      'Konsultasi awal tanpa biaya untuk memahami kebutuhan legalitas Anda sebelum proses dimulai.',
    color: 'oklch(0.62 0.16 30)',
    bg: 'oklch(0.62 0.16 30 / 0.1)',
  },
  {
    icon: ShieldCheck,
    title: 'Garansi Kepuasan',
    description:
      'Jaminan kepuasan penuh dengan revisi gratis hingga dokumen benar-benar sesuai kebutuhan Anda.',
    color: 'oklch(0.48 0.12 200)',
    bg: 'oklch(0.48 0.12 200 / 0.1)',
  },
  {
    icon: Headphones,
    title: 'Layanan Responsif',
    description:
      'Tim siap mendampingi Anda kapan pun dibutuhkan dengan respons cepat via WhatsApp dan email.',
    color: 'oklch(0.5 0.13 270)',
    bg: 'oklch(0.5 0.13 270 / 0.1)',
  },
];

const highlights = [
  'Dokumen 100% sah secara hukum',
  'Pendampingan end-to-end',
  'Update status real-time',
  'Arsip digital seumur hidup',
];

type WhyUsProps = {
  stats: HomeStats;
};

export function WhyUsSection({ stats }: WhyUsProps) {
  const statItems = buildWhyUsStats(stats);

  return (
    <section className="py-20 lg:py-28 bg-surface-card overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-5 items-stretch">
          {/* ── Left panel (brand blue) ── */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="lg:col-span-2 relative rounded-2xl overflow-hidden flex flex-col justify-between p-5 md:p-8 lg:p-10 min-h-[440px]"
            style={{ backgroundColor: 'oklch(0.3811 0.1315 260.22)' }}
          >
            {/* Blobs */}
            <div
              className="absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-10 pointer-events-none"
              style={{ backgroundColor: 'white' }}
            />
            <div
              className="absolute -bottom-14 -left-14 w-44 h-44 rounded-full opacity-15 pointer-events-none"
              style={{ backgroundColor: 'oklch(0.7319 0.1856 52.89)' }}
            />

            {/* Top content */}
            <SectionHeading
              badge="Mengapa Kami"
              title={
                <>
                  <span className="text-white">Lebih Dari Sekadar Jasa, </span>
                  <br className="hidden sm:block" />
                  <span style={{ color: 'oklch(0.7319 0.1856 52.89)' }}>
                    Kami Adalah Mitra Anda.
                  </span>
                </>
              }
              description={
                <span className="text-white">
                  Kami hadir bukan hanya untuk mengurus dokumen, tapi memastikan
                  bisnis Anda berdiri di fondasi hukum yang kokoh.
                </span>
              }
              align="left"
            />

            {/* Stats (dari API /home) */}
            <div className="relative z-10 grid grid-cols-2 gap-5 my-8">
              {statItems.map((item) => (
                <div key={item.key}>
                  {item.kind === 'count' ? (
                    <p className="text-3xl font-extrabold text-white leading-none tabular-nums">
                      <CountUp
                        to={item.value}
                        suffix={item.suffix}
                        duration={2}
                      />
                    </p>
                  ) : (
                    <p className="text-3xl font-extrabold text-white leading-none tabular-nums">
                      <span>{item.rating.toFixed(1)}</span>
                      <span className="text-lg font-bold text-white/70">/5</span>
                    </p>
                  )}
                  <p className="text-xs text-white/50 mt-1">{item.label}</p>
                  {/* {item.kind === 'rating' && item.reviews > 0 && (
                    <p className="text-[10px] text-white/35 mt-0.5">
                      Berdasarkan {item.reviews.toLocaleString('id-ID')} ulasan
                    </p>
                  )} */}
                </div>
              ))}
            </div>

            {/* Highlight list */}
            <div className="relative z-10 space-y-2.5">
              {highlights.map((h) => (
                <div key={h} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-white/40 shrink-0" />
                  <span className="text-xs text-white/70">{h}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/daftar"
              className="relative z-10 mt-8 inline-flex items-center gap-2 self-start px-6 py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'oklch(0.7319 0.1856 52.89)',
                color: 'white',
              }}
            >
              Mulai Konsultasi Gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* ── Right: reason cards grid 2×3 ── */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 content-start">
            {reasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                  className="blog-card group flex flex-col gap-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-surface-card p-5"
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: r.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: r.color }} />
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-blue transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {r.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
