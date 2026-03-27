'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, FileCheck, FileWarning, Info } from 'lucide-react';
import type { ServiceRequirementCategory as RequirementCategory } from '@/lib/types/service';
import { SectionHeading } from '@/components/section-heading';

const FORMAT_COLORS: Record<string, string> = {
  JPG: 'oklch(0.55 0.13 160)',
  PDF: 'oklch(0.3811 0.1315 260.22)',
  DOC: 'oklch(0.7319 0.1856 52.89)',
  'JPG/PDF': 'oklch(0.55 0.13 160)',
  'DOC/PDF': 'oklch(0.5 0.13 270)',
  DEFAULT: 'oklch(0.5 0 0)',
};

function getFormatColor(fmt: string | null | undefined) {
  const key = fmt?.trim();
  if (!key) return FORMAT_COLORS.DEFAULT;
  return FORMAT_COLORS[key.toUpperCase()] ?? FORMAT_COLORS.DEFAULT;
}

export function RequirementsSection({
  categories,
}: {
  categories: RequirementCategory[];
}) {
  const [openCat, setOpenCat] = useState<number>(0);

  if (!categories.length) return null;

  return (
    <section id="persyaratan" className="py-16 bg-surface-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <SectionHeading
            badge="Persyaratan"
            title={
              <>
                Dokumen yang{' '}
                <span style={{ color: 'oklch(0.3811 0.1315 260.22)' }}>
                  Perlu Disiapkan
                </span>
              </>
            }
            description="Siapkan dokumen berikut sebelum konsultasi agar proses pengurusan berjalan lebih cepat."
          />
        </div>

        <div className="space-y-3">
          {categories
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((cat, ci) => {
              const isOpen = openCat === ci;
              const requiredCount = cat.requirements.filter(
                (r) => r.is_required,
              ).length;

              return (
                <div
                  key={cat.name}
                  className="blog-card group/cat rounded-2xl border border-gray-200 dark:border-white/10 bg-surface-card overflow-hidden"
                  style={
                    isOpen
                      ? {
                          borderColor: 'oklch(0.3811 0.1315 260.22)',
                          boxShadow:
                            '0 12px 40px oklch(0.3811 0.1315 260.22 / 0.18)',
                          backgroundColor: 'var(--surface-card)',
                        }
                      : undefined
                  }
                >
                  {/* Category header */}
                  <button
                    onClick={() => setOpenCat(isOpen ? -1 : ci)}
                    className="flex items-center justify-between w-full p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: isOpen
                            ? 'oklch(0.3811 0.1315 260.22 / 0.12)'
                            : 'oklch(0.3811 0.1315 260.22 / 0.08)',
                        }}
                      >
                        <FileCheck
                          className="w-4 h-4"
                          style={{
                            color: isOpen
                              ? 'oklch(0.3811 0.1315 260.22)'
                              : 'oklch(0.3811 0.1315 260.22)',
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug group-hover/cat:text-brand-blue transition-colors">
                          {cat.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {cat.requirements.length} dokumen &bull;{' '}
                          {requiredCount} wajib
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Requirements list */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="px-5 pb-5 border-t border-gray-100 dark:border-white/8 pt-4 space-y-3">
                          {/* Category description */}
                          {cat.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                              {cat.description}
                            </p>
                          )}

                          {cat.requirements
                            .sort((a, b) => a.sort_order - b.sort_order)
                            .map((req) => (
                              <div
                                key={req.name}
                                className="bg-surface-card group/req flex items-start gap-3 p-5 rounded-xl  border border-gray-100 dark:border-white/8"
                              >
                                {req.is_required ? (
                                  <FileCheck
                                    className="w-4 h-4 shrink-0 mt-0.5"
                                    style={{
                                      color: 'oklch(0.3811 0.1315 260.22)',
                                    }}
                                  />
                                ) : (
                                  <FileWarning className="w-4 h-4 shrink-0 mt-0.5 text-gray-300 dark:text-gray-600" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug transition-colors group-hover/req:text-brand-blue">
                                      {req.name}
                                    </p>
                                    {req.is_required ? (
                                      <span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap bg-red-50 dark:bg-red-900/20 text-red-500">
                                        Wajib
                                      </span>
                                    ) : (
                                      <span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap bg-gray-100 dark:bg-white/10 text-gray-400">
                                        Opsional
                                      </span>
                                    )}
                                    {req.document_format?.trim() ? (
                                      <span
                                        className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap text-white uppercase"
                                        style={{
                                          backgroundColor: getFormatColor(
                                            req.document_format,
                                          ),
                                        }}
                                      >
                                        {req.document_format}
                                      </span>
                                    ) : null}
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                    {req.description}
                                  </p>
                                  {req.notes && (
                                    <div
                                      className="flex items-start gap-2.5 rounded-xl p-3 mt-4"
                                      style={{
                                        backgroundColor: `${getFormatColor(req.document_format).replace(')', ' / 0.06)')}`,
                                      }}
                                    >
                                      <Info
                                        className="w-3.5 h-3.5 shrink-0 mt-0.5"
                                        style={{
                                          color: getFormatColor(
                                            req.document_format,
                                          ) as string,
                                        }}
                                      />
                                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {req.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
