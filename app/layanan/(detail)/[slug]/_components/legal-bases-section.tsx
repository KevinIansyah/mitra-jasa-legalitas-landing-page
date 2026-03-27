'use client';

import { ArrowUpRight } from 'lucide-react';
import type { ServiceLegalBasis as LegalBase } from '@/lib/types/service';
import { SectionHeading } from '@/components/section-heading';

export function LegalBasesSection({ bases }: { bases: LegalBase[] }) {
  if (!bases.length) return null;

  const TYPE_COLORS: Record<string, string> = {
    'Undang-Undang (UU)': 'oklch(0.3811 0.1315 260.22)',
    'Peraturan Pemerintah (PP)': 'oklch(0.55 0.13 160)',
    'Peraturan Menteri (Permen)': 'oklch(0.7319 0.1856 52.89)',
  };

  return (
    <section id="dasar-hukum" className="py-16 bg-surface-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <SectionHeading
            badge="Referensi Hukum"
            title={
              <>
                Dokumen Hukum{' '}
                <span style={{ color: 'oklch(0.3811 0.1315 260.22)' }}>
                  yang Relevan
                </span>
              </>
            }
            description="Dokumen hukum yang relevan untuk layanan yang Anda pilih."
          />
        </div>

        <div className="space-y-3">
          {bases
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((base) => {
              const color =
                TYPE_COLORS[base.document_type] ?? 'oklch(0.45 0.1 270)';
              const year = base.issued_date
                ? new Date(base.issued_date).getFullYear()
                : '';

              return (
                <div
                  key={base.document_number}
                  className="blog-card group/legal flex items-start gap-4 p-5 rounded-xl border border-gray-200 dark:border-white/10 bg-surface-page"
                >
                  <div
                    className="shrink-0 px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-white text-center leading-tight min-w-[52px]"
                    style={{ backgroundColor: color }}
                  >
                    {base.document_type.split(' ').pop()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-0.5">
                          {base.document_type} {base.document_number}{' '}
                          {year && `• ${year}`}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug transition-colors group-hover/legal:text-brand-blue">
                          {base.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                          {base.description}
                        </p>
                      </div>
                      {base.url && (
                        <a
                          href={base.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Buka dokumen: ${base.title}`}
                          className="shrink-0 flex items-center justify-center transition-transform duration-300 hover:scale-105"
                        >
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: `color-mix(in oklch, ${color} 14%, transparent)`,
                            }}
                          >
                            <ArrowUpRight
                              className="w-3.5 h-3.5"
                              style={{ color }}
                            />
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
