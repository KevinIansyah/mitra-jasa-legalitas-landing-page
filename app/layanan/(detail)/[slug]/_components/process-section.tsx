'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, FileText, Info, ChevronDown } from 'lucide-react';
import type { ServiceProcessStep as ProcessStep } from '@/lib/types/service';
import { SectionHeading } from '@/components/section-heading';
import { EASE } from '@/lib/types/constants';

const STEP_COLORS = [
  'oklch(0.3811 0.1315 260.22)',
  'oklch(0.55 0.13 160)',
  'oklch(0.7319 0.1856 52.89)',
  'oklch(0.5 0.13 270)',
  'oklch(0.62 0.16 30)',
];

export function ProcessSection({ steps }: { steps: ProcessStep[] }) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <section id="proses" className="py-16 lg:py-20 bg-surface-card">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <SectionHeading
            badge="Alur Layanan"
            title={
              <>
                Proses yang{' '}
                <span style={{ color: 'oklch(0.3811 0.1315 260.22)' }}>
                  Transparan & Terstruktur
                </span>
              </>
            }
            description="Setiap tahapan berjalan sistematis sehingga Anda tahu persis posisi proses dan estimasi selesai kapan."
          />
        </div>

        <div className="relative">
          <div className="space-y-4">
            {steps
              .sort((left, right) => left.sort_order - right.sort_order)
              .map((step, stepIndex) => {
                const color = STEP_COLORS[stepIndex % STEP_COLORS.length];
                const isExpanded = expandedStep === stepIndex;
                const hasExtra = step.required_documents || step.notes;

                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: stepIndex * 0.07, ease: EASE }}
                    className="relative sm:pl-16"
                  >
                    <div
                      className="hidden sm:flex absolute left-0 top-5 w-12 h-12 rounded-2xl items-center justify-center shrink-0 z-10 transition-transform duration-300 group-hover/proc:scale-110"
                      style={{
                        backgroundColor: `${color.replace(')', ' / 0.12)')}`,
                      }}
                    >
                      <span
                        className="text-sm font-bold"
                        style={{ color }}
                      >
                        {String(stepIndex + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {stepIndex < steps.length - 1 && (
                      <div
                        aria-hidden
                        className="hidden sm:block absolute z-0 border-l-2 border-dashed border-gray-300 dark:border-white/15 h-[calc(100%-44px)]"
                        style={{
                          left: '23px',
                          top: 'calc(1.25rem + 48px + 4px)',
                        }}
                      />
                    )}

                    <div
                      className={`blog-card group/proc relative rounded-2xl border bg-surface-card transition-all duration-300 overflow-hidden ${
                        isExpanded
                          ? 'shadow-xl border-transparent'
                          : 'border-gray-200 dark:border-white/10'
                      }`}
                      style={
                        isExpanded
                          ? {
                              borderColor: 'oklch(0.3811 0.1315 260.22)',
                              boxShadow:
                                '0 12px 40px oklch(0.3811 0.1315 260.22 / 0.18)',
                              backgroundColor: 'var(--surface-card)',
                            }
                          : undefined
                      }
                    >
                      <div className="flex items-start gap-4 p-5">
                        <div
                          className="sm:hidden flex w-9 h-9 rounded-xl items-center justify-center shrink-0 mt-0.5"
                          style={{
                            backgroundColor: `${color.replace(')', ' / 0.12)')}`,
                          }}
                        >
                          <span
                            className="text-xs font-bold"
                            style={{ color }}
                          >
                            {String(stepIndex + 1).padStart(2, '0')}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug transition-colors group-hover/proc:text-brand-blue">
                                {step.title}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                            <span
                              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap"
                              style={{
                                backgroundColor: `${color.replace(')', ' / 0.1)')}`,
                                color,
                              }}
                            >
                              <Clock className="w-3 h-3" />
                              {step.duration}
                            </span>
                          </div>

                          {hasExtra && (
                            <button
                              onClick={() =>
                                setExpandedStep(isExpanded ? null : stepIndex)
                              }
                              className="mt-3 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                              style={{ color }}
                            >
                              {isExpanded
                                ? 'Sembunyikan detail'
                                : 'Lihat dokumen & catatan'}
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </button>
                          )}
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {isExpanded && hasExtra && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div
                              className="px-5 pb-5 space-y-4 border-t"
                              style={{
                                borderColor: `${color.replace(')', ' / 0.15)')}`,
                                paddingTop: '1rem',
                              }}
                            >
                              {step.required_documents && (
                                <div>
                                  <p className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    <FileText
                                      className="w-3.5 h-3.5"
                                      style={{ color }}
                                    />
                                    Dokumen yang Dibutuhkan
                                  </p>
                                  <ul className="space-y-1">
                                    {step.required_documents.map((documentName) => (
                                      <li
                                        key={documentName}
                                        className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
                                      >
                                        <span
                                          className="w-1.5 h-1.5 rounded-full shrink-0"
                                          style={{ backgroundColor: color }}
                                        />
                                        {documentName}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {step.notes && (
                                <div
                                  className="flex items-start gap-2.5 rounded-xl p-3"
                                  style={{
                                    backgroundColor: `${color.replace(')', ' / 0.06)')}`,
                                  }}
                                >
                                  <Info
                                    className="w-3.5 h-3.5 shrink-0 mt-0.5"
                                    style={{ color }}
                                  />
                                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {step.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
