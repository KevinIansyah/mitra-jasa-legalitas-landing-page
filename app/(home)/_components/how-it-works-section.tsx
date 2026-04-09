'use client';

import { motion } from 'framer-motion';
import {
  MessageCircle,
  FileStack,
  Cog,
  PackageCheck,
  CheckCircle2,
} from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { EASE } from '@/lib/types/constants';

const STEPS = [
  {
    number: '01',
    icon: MessageCircle,
    title: 'Konsultasi Gratis',
    description:
      'Diskusikan kebutuhan legalitas Anda dengan tim ahli kami. Kami akan memberikan solusi terbaik sesuai kebutuhan bisnis Anda.',
    highlights: [
      'Konsultasi via WhatsApp / Zoom',
      'Analisis kebutuhan bisnis',
      'Rekomendasi layanan tepat',
    ],
    color: 'oklch(0.3811 0.1315 260.22)',
    bgColor: 'oklch(0.3811 0.1315 260.22 / 0.07)',
  },
  {
    number: '02',
    icon: FileStack,
    title: 'Siapkan Dokumen',
    description:
      'Tim kami akan membantu Anda menyiapkan seluruh dokumen yang diperlukan dengan panduan lengkap step-by-step.',
    highlights: [
      'Checklist dokumen lengkap',
      'Pendampingan pengisian',
      'Verifikasi dokumen otomatis',
    ],
    color: 'oklch(0.7319 0.1856 52.89)',
    bgColor: 'oklch(0.7319 0.1856 52.89 / 0.07)',
  },
  {
    number: '03',
    icon: Cog,
    title: 'Proses Pengurusan',
    description:
      'Kami mengurus semua proses administrasi dan legalitas untuk Anda. Anda cukup duduk santai dan pantau progress.',
    highlights: [
      'Tracking status real-time',
      'Update berkala via WhatsApp',
      'Tanpa antri ke instansi',
    ],
    color: 'oklch(0.3811 0.1315 260.22)',
    bgColor: 'oklch(0.3811 0.1315 260.22 / 0.07)',
  },
  {
    number: '04',
    icon: PackageCheck,
    title: 'Serah Terima',
    description:
      'Dokumen legal Anda siap dan diserahkan lengkap dengan panduan penggunaan. Bisnis Anda resmi dan legal!',
    highlights: [
      'Dokumen dikirim ke alamat Anda',
      'Panduan penggunaan dokumen',
      'After-sales support 30 hari',
    ],
    color: 'oklch(0.7319 0.1856 52.89)',
    bgColor: 'oklch(0.7319 0.1856 52.89 / 0.07)',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-28 bg-surface-card overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-14 flex flex-col gap-3"
        >
          <SectionHeading
            badge="Proses"
            title={
              <>
                Cara Kerja Kami yang{' '}
                <br className="hidden sm:block" />
                <span style={{ color: 'oklch(0.3811 0.1315 260.22)' }}>
                  Simpel & Efisien
                </span>
              </>
            }
            description="Proses legalitas yang biasanya rumit, kami sederhanakan menjadi 4 langkah mudah. Anda tidak perlu keluar kantor - semuanya bisa dikerjakan dari mana saja."
          />
        </motion.div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
            {STEPS.map((step, stepIndex) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: stepIndex * 0.1, ease: EASE }}
                className="relative flex flex-col gap-5 group"
              >
                <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                  <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                    <div className="relative">
                      <div
                        className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                        style={{ background: step.bgColor }}
                      >
                        <step.icon
                          className="w-6 h-6"
                          style={{ color: step.color }}
                          strokeWidth={1.8}
                        />

                        <span
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center leading-none"
                          style={{ backgroundColor: step.color }}
                        >
                          {stepIndex + 1}
                        </span>
                      </div>

                      {stepIndex < STEPS.length - 1 && (
                        <div
                          aria-hidden
                          className="hidden lg:block absolute border-t-2 border-dashed border-gray-300 dark:border-white/15"
                          style={{
                            top: '50%',
                            left: '60px',
                            right: 'calc(-1 * (var(--gap, 20px) + 180px))',
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <span
                    className="text-5xl font-extrabold lg:hidden leading-none select-none"
                    style={{ color: `${step.color.replace(')', ' / 0.08)')}` }}
                  >
                    {step.number}
                  </span>
                </div>

                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: stepIndex * 0.08, ease: EASE }}
                  className="blog-card group flex flex-col gap-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-surface-card p-5"
                >
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 transition-colors group-hover:text-inherit">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>

                  <ul className="space-y-1.5 pt-1">
                    {step.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-2">
                        <CheckCircle2
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: step.color }}
                          strokeWidth={2.5}
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {stepIndex < STEPS.length - 1 && (
                  <div
                    className="lg:hidden flex justify-center -my-1"
                    aria-hidden
                  >
                    <div className="border-l-2 border-dashed border-gray-300 dark:border-white/15 h-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
