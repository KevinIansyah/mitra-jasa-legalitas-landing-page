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
    <section id="persyaratan" className="py-16 lg:py-20 bg-surface-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            .sort((left, right) => left.sort_order - right.sort_order)
            .map((categoryGroup, categoryIndex) => {
              const isOpen = openCat === categoryIndex;
              const requiredCount = categoryGroup.requirements.filter(
                (requirement) => requirement.is_required,
              ).length;

              return (
                <div
                  key={categoryGroup.name}
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
                  <button
                    onClick={() => setOpenCat(isOpen ? -1 : categoryIndex)}
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
                          {categoryGroup.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {categoryGroup.requirements.length} dokumen &bull;{' '}
                          {requiredCount} wajib
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="px-5 pb-5 pt-4 space-y-3">
                          {categoryGroup.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                              {categoryGroup.description}
                            </p>
                          )}

                          {categoryGroup.requirements
                            .sort((left, right) => left.sort_order - right.sort_order)
                            .map((requirement) => (
                              <div
                                key={requirement.name}
                                className="bg-surface-card group/req flex items-start gap-3 p-5 rounded-xl  border border-gray-100 dark:border-white/8"
                              >
                                {requirement.is_required ? (
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
                                      {requirement.name}
                                    </p>
                                    {requirement.is_required ? (
                                      <span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap bg-destructive/10 text-destructive">
                                        Wajib
                                      </span>
                                    ) : (
                                      <span className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap bg-gray-100 dark:bg-white/10 text-gray-400">
                                        Opsional
                                      </span>
                                    )}
                                    {requirement.document_format?.trim() ? (
                                      <span
                                        className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap text-white uppercase"
                                        style={{
                                          backgroundColor: getFormatColor(
                                            requirement.document_format,
                                          ),
                                        }}
                                      >
                                        {requirement.document_format}
                                      </span>
                                    ) : null}
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                    {requirement.description}
                                  </p>
                                  {requirement.notes && (
                                    <div
                                      className="flex items-start gap-2.5 rounded-xl p-3 mt-4"
                                      style={{
                                        backgroundColor: `${getFormatColor(requirement.document_format).replace(')', ' / 0.06)')}`,
                                      }}
                                    >
                                      <Info
                                        className="w-3.5 h-3.5 shrink-0 mt-0.5"
                                        style={{
                                          color: getFormatColor(
                                            requirement.document_format,
                                          ) as string,
                                        }}
                                      />
                                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {requirement.notes}
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
