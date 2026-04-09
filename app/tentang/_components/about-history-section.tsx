'use client';

import { motion } from 'framer-motion';
import { history, timelineSteps } from '../_data/about';
import { SectionHeading } from '@/components/section-heading';
import { EASE } from '@/lib/types/constants';

export function AboutHistorySection() {
  return (
    <section className="py-16 lg:py-20 bg-surface-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-14"
        >
          <SectionHeading badge={history.sectionLabel} title={history.title} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="space-y-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              {history.paragraphs.map((paragraphText, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraphText}</p>
              ))}
            </div>

            <div
              className="relative rounded-2xl overflow-hidden flex flex-col justify-between p-8 lg:p-10"
              style={{ backgroundColor: 'oklch(0.3811 0.1315 260.22)' }}
            >
              <div
                className="absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-10 pointer-events-none"
                style={{ backgroundColor: 'white' }}
              />
              <div
                className="absolute -bottom-14 -left-14 w-44 h-44 rounded-full opacity-15 pointer-events-none"
                style={{ backgroundColor: 'oklch(0.7319 0.1856 52.89)' }}
              />

              <div className="space-y-4">
                {timelineSteps.map((step, stepIndex) => (
                  <div key={step.year} className="flex gap-4">
                    <div className="flex flex-col items-center shrink-0">
                      <span
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold text-white"
                        style={{
                          backgroundColor: 'oklch(0.7319 0.1856 52.89)',
                        }}
                      >
                        {step.year}
                      </span>
                      {stepIndex < timelineSteps.length - 1 && (
                        <div className="w-px flex-1 min-h-[24px] bg-linear-to-b from-gray-200 to-transparent dark:from-white/15 mt-2" />
                      )}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-bold text-white">
                        {step.title}
                      </p>
                      <p className="text-sm text-white mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
