'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Star,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { CountUp } from './count-up';
import type { HomeStats, WhatsappCta } from '@/lib/types/home';

const documents = [
  { label: 'Akta Pendirian CV', done: true },
  { label: 'NIB & Izin Usaha', done: true },
  { label: 'NPWP Perusahaan', done: true },
  { label: 'Sertifikat Merek', done: false },
];

const barHeights = [38, 55, 42, 72, 60, 88, 65];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function HeroSection({
  stats,
  whatsappCta,
}: {
  stats: HomeStats;
  whatsappCta: WhatsappCta | null;
}) {
  const consultHref = whatsappCta?.wa_me_with_message ?? '/daftar';
  const consultExternal = Boolean(whatsappCta);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-surface-page">
      {/* ── Background blobs ── */}

      {/* BLUE — top right, dominan tapi ga terlalu besar */}
      <motion.div
        aria-hidden
        className="absolute top-[-60px] right-[-40px] w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, oklch(0.3811 0.1315 260.22 / 0.35) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* ORANGE — top right, overlap sama blue biar ada transisi warna */}
      <motion.div
        aria-hidden
        className="absolute top-[60px] right-[4%] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, oklch(0.7319 0.1856 52.89 / 0.45) 0%, transparent 60%)',
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

      {/* PURPLE — tengah, jadi jembatan visual antara blue & orange */}
      <motion.div
        aria-hidden
        className="absolute top-[80px] right-[22%] w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, oklch(0.65 0.14 300 / 0.22) 0%, transparent 65%)',
          filter: 'blur(55px)',
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* ORANGE SECONDARY — bottom left, biar halaman seimbang */}
      <motion.div
        aria-hidden
        className="absolute bottom-[8%] left-[4%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, oklch(0.7319 0.1856 52.89 / 0.32) 0%, transparent 62%)',
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

      {/* BLUE SECONDARY — bottom right, subtle depth */}
      <motion.div
        aria-hidden
        className="absolute bottom-0 right-[10%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, oklch(0.3811 0.1315 260.22 / 0.18) 0%, transparent 68%)',
          filter: 'blur(50px)',
        }}
        animate={{ scale: [1, 1.07, 1] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* ── Left Content ── */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium "
                style={{
                  background:
                    'linear-gradient(135deg, oklch(0.3811 0.1315 260.22 / 0.12), oklch(0.7319 0.1856 52.89 / 0.12))',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: 'oklch(0.7319 0.1856 52.89)' }}
                />
                Layanan Legalitas Bisnis Terpercaya
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div variants={itemVariants} className="space-y-1">
              <h1 className="text-[2.4rem] md:text-[3.3rem] font-extrabold leading-[1.1] tracking-tight">
                Konsultan Legalitas
                <br />
                Perizinan Terpercaya
              </h1>
              <p
                className="text-[2.4rem] md:text-[3.3rem] font-extrabold italic leading-[1.2] tracking-tight"
                style={{
                  color: 'oklch(0.7319 0.1856 52.89)',
                  fontFamily: 'var(--font-serif)',
                }}
              >
                No. 1 di Indonesia
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-base lg:text-lg text-gray-500 dark:text-gray-400 max-w-md leading-relaxed"
            >
              Mitra Jasa Legalitas membantu pendirian PT, CV, dan pengurusan
              izin usaha dengan proses yang cepat, transparan, dan dijamin
              legal.
            </motion.p>

            {/* Stats Row */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 lg:gap-10"
            >
              <div>
                <p className="text-3xl font-extrabold">
                  <CountUp
                    to={stats.total_clients}
                    suffix="+"
                    duration={2.2}
                  />
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Klien Terlayani
                </p>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-white/15" />
              <div>
                <p className="text-3xl font-extrabold">
                  <CountUp
                    to={stats.years_experience}
                    suffix=" Thn"
                    duration={1.8}
                  />
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Pengalaman
                </p>
              </div>
              <div className="w-px h-10 bg-gray-200 dark:bg-white/15" />
              <div>
                <p className="text-3xl font-extrabold">
                  <CountUp to={stats.total_reviews} duration={2} />
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Ulasan
                </p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <Link
                href={consultHref}
                {...(consultExternal
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold text-sm transition-opacity hover:opacity-90 shadow-md"
                style={{ backgroundColor: 'oklch(0.3811 0.1315 260.22)' }}
              >
                {whatsappCta?.label ?? 'Mulai Konsultasi'}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/layanan"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-gray-700 dark:text-gray-200 font-semibold text-sm border border-gray-300 dark:border-white/20 bg-white/70 dark:bg-white/8 hover:bg-white dark:hover:bg-white/15 transition-colors"
              >
                Lihat Layanan
              </Link>
            </motion.div>
          </motion.div>

          {/* ── Right Visual ── */}
          <div className="relative h-[540px] flex items-center justify-center">
            {/* Stats card – behind, rotated */}
            <motion.div
              className="absolute right-4 top-[70px] w-[192px] bg-white dark:bg-surface-card rounded-2xl border border-gray-100 dark:border-white/10 shadow-xl p-4 z-10"
              style={{ transformOrigin: 'center' }}
              initial={{ opacity: 0, rotate: 8, scale: 0.85, x: 30 }}
              animate={{ opacity: 1, rotate: 4, scale: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.7, ease: EASE }}
            >
              <p className="text-xs text-gray-400 mb-1">Dokumen Selesai</p>
              <p
                className="text-3xl font-extrabold"
                style={{ color: 'oklch(0.3811 0.1315 260.22)' }}
              >
                <CountUp to={stats.total_documents} duration={2.5} />
              </p>
              <p className="text-xs text-gray-400 mt-0.5 mb-4">Total dokumen</p>
              <div className="flex items-end gap-1 h-[48px]">
                {barHeights.map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      backgroundColor:
                        i === 5
                          ? 'oklch(0.3811 0.1315 260.22)'
                          : 'oklch(0.3811 0.1315 260.22 / 0.18)',
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{
                      delay: 0.9 + i * 0.07,
                      duration: 0.5,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                <TrendingUp
                  className="w-3.5 h-3.5"
                  style={{ color: 'oklch(0.7319 0.1856 52.89)' }}
                />
                <span
                  className="text-xs font-semibold"
                  style={{ color: 'oklch(0.7319 0.1856 52.89)' }}
                >
                  +12% dari bulan lalu
                </span>
              </div>
            </motion.div>

            {/* Main tall card */}
            <motion.div
              className="relative z-20 w-[220px] rounded-2xl bg-white dark:bg-surface-card overflow-hidden border border-gray-100 dark:border-white/10"
              style={{
                boxShadow:
                  '0 20px 60px oklch(0.3811 0.1315 260.22 / 0.22), 0 8px 20px rgba(0,0,0,0.07)',
              }}
              initial={{ opacity: 0, y: 50, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.8, ease: EASE }}
            >
              {/* Header */}
              <div
                className="px-5 pt-6 pb-5"
                style={{ backgroundColor: 'oklch(0.3811 0.1315 260.22)' }}
              >
                <p className="text-white/70 text-xs tracking-wide uppercase mb-1.5">
                  Status Pengurusan
                </p>
                <p className="text-white font-bold text-lg leading-tight">
                  CV. Mitra Jasa Legalitas
                </p>
                <p className="text-white/60 text-xs mt-0.5">Surabaya, 2024</p>
                <div className="mt-4 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-white text-xs font-medium">
                    Dalam Proses
                  </span>
                </div>
              </div>

              {/* Checklist */}
              <div className="px-5 py-4 space-y-3">
                {documents.map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                  >
                    <CheckCircle2
                      className="w-4 h-4 shrink-0"
                      style={{
                        color: item.done
                          ? 'oklch(0.3811 0.1315 260.22)'
                          : 'oklch(0.82 0 0)',
                      }}
                    />
                    <span
                      className="text-xs"
                      style={{
                        color: item.done ? '' : 'oklch(0.68 0 0)',
                      }}
                    >
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Progress */}
              <div className="px-5 pb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Progress</span>
                  <span className="font-semibold text-gray-600">75%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: 'oklch(0.3811 0.1315 260.22)' }}
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ delay: 1.1, duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Floating: rating */}
            <motion.div
              className="absolute bottom-16 left-2 z-30 flex items-center gap-3 bg-white dark:bg-surface-card rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 px-4 py-3"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6, ease: EASE }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'oklch(0.7319 0.1856 52.89 / 0.12)' }}
              >
                <Star
                  className="w-5 h-5"
                  style={{ color: 'oklch(0.7319 0.1856 52.89)' }}
                  fill="oklch(0.7319 0.1856 52.89)"
                />
              </div>
              <div>
                <p className="text-xs text-gray-400">Rating Klien</p>
                <p className="text-sm font-bold">
                  {stats.rating.toFixed(1)} / 5.0
                </p>
              </div>
            </motion.div>

            {/* Floating: verified badge */}
            <motion.div
              className="absolute top-14 left-6 z-30 flex items-center gap-2.5 bg-white dark:bg-surface-card rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 px-3.5 py-2.5"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6, ease: EASE }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'oklch(0.3811 0.1315 260.22 / 0.1)' }}
              >
                <Shield
                  className="w-4 h-4"
                  style={{ color: 'oklch(0.3811 0.1315 260.22)' }}
                />
              </div>
              <div>
                <p className="text-xs text-gray-400">Terverifikasi</p>
                <p className="text-xs font-bold">Resmi & Legal</p>
              </div>
            </motion.div>

            {/* Floating: daily doc count */}
            <motion.div
              className="absolute bottom-24 right-0 z-30 flex items-center gap-2.5 bg-white dark:bg-surface-card rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 px-3.5 py-2.5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.6, ease: EASE }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'oklch(0.7319 0.1856 52.89 / 0.12)' }}
              >
                <FileCheck
                  className="w-4 h-4"
                  style={{ color: 'oklch(0.7319 0.1856 52.89)' }}
                />
              </div>
              <div>
                <p className="text-xs text-gray-400">Layanan aktif</p>
                <p className="text-xs font-bold">
                  <CountUp to={stats.total_services} suffix=" layanan" duration={2} />
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
