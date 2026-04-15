'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { SectionHeading } from '../../../components/section-heading';
import Link from 'next/link';
import type { Faq } from '@/lib/types/home';
import { EASE } from '@/lib/types/constants';

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(
    faqs[0] ? String(faqs[0].id) : null,
  );

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-28 bg-surface-card">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
          className="mb-14"
        >
          <SectionHeading
            badge="FAQ"
            title={
              <>
                Pertanyaan yang{' '}
                <br className="hidden sm:block" />
                <span style={{ color: 'oklch(0.7319 0.1856 52.89)' }}>
                  Sering Diajukan
                </span>
              </>
            }
            description={
              <>
                Tidak menemukan jawaban yang Anda cari?{' '}
                <Link
                  href="/kontak"
                  className="font-semibold text-gray-800 dark:text-gray-200 underline underline-offset-2 hover:text-brand-blue transition-colors"
                >
                  Hubungi kami
                </Link>
              </>
            }
          />
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq) => {
            const faqId = String(faq.id);
            const isOpen = openId === faqId;

            return (
              <motion.div
                key={faqId}
                layout
                className={`group/faq relative rounded-xl transition-all duration-300 blog-card ${
                  isOpen
                    ? 'shadow-xl border border-transparent bg-surface-card'
                    : 'border border-gray-200 dark:border-white/10 bg-surface-card'
                }`}
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
                transition={{ layout: { duration: 0.3 } }}
              >
                <div className="overflow-hidden rounded-xl">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : faqId)}
                    className="flex items-center gap-4 w-full p-5 text-left transition-colors active:bg-gray-50/90 dark:active:bg-white/5"
                  >
                    <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug transition-colors group-hover/faq:text-brand-blue">
                      {faq.question}
                    </span>
                    <span
                      className="shrink-0 w-7 h-7 rounded-full border border-gray-200 dark:border-white/20 flex items-center justify-center transition-all"
                      style={
                        isOpen
                          ? {
                              backgroundColor: 'oklch(0.3811 0.1315 260.22)',
                              borderColor: 'oklch(0.3811 0.1315 260.22)',
                            }
                          : {}
                      }
                    >
                      {isOpen ? (
                        <Minus className="w-3 h-3 text-white" />
                      ) : (
                        <Plus className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: EASE }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p className="p-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-white/8">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
