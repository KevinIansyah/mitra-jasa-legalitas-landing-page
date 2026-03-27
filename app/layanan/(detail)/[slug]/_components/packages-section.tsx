'use client';

import { motion } from 'framer-motion';
import { Check, X, Clock, MessageCircle, ArrowRight } from 'lucide-react';
import type { ServicePackage } from '@/lib/types/service';
import { formatServicePrice } from '@/lib/utils';
import { whatsappWaMeUrl, whatsappWaMeUrlWithText } from '@/lib/whatsapp-cta';
import { SectionHeading } from '@/components/section-heading';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function PackagesSection({
  packages,
  whatsapp,
}: {
  packages: ServicePackage[];
  /** Dari GET `/company-information` → `contact.whatsapp` */
  whatsapp: string;
}) {
  const wa = whatsapp.trim();
  const waPkgHref = (pkgName: string) =>
    wa
      ? whatsappWaMeUrlWithText(wa, `Halo, saya tertarik dengan ${pkgName}`)
      : '';
  const waCustomHref = wa ? whatsappWaMeUrl(wa) : '';
  return (
    <section id="paket" className="py-16 bg-surface-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <SectionHeading
            badge="Harga & Paket"
            title={
              <>
                Pilih Paket yang{' '}
                <span style={{ color: 'oklch(0.3811 0.1315 260.22)' }}>
                  Sesuai Kebutuhan
                </span>
              </>
            }
            description="Semua paket sudah termasuk biaya notaris, PNBP, dan pendampingan penuh tanpa biaya tersembunyi."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {packages
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((pkg, i) => (
              <motion.div
                key={`${pkg.sort_order}-${pkg.name}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                className={`group/pkg relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 blog-card ${
                  pkg.is_highlighted
                    ? 'shadow-xl border-transparent'
                    : 'border-gray-200 dark:border-white/10 bg-surface-card'
                }`}
                style={
                  pkg.is_highlighted
                    ? {
                        borderColor: 'oklch(0.3811 0.1315 260.22)',
                        boxShadow:
                          '0 12px 40px oklch(0.3811 0.1315 260.22 / 0.18)',
                        backgroundColor: 'var(--surface-card)',
                      }
                    : {}
                }
              >
                {/* Highlighted top bar */}
                {pkg.is_highlighted && (
                  <div
                    className="h-1.5 w-full"
                    style={{
                      background:
                        'linear-gradient(to right, oklch(0.3811 0.1315 260.22), oklch(0.7319 0.1856 52.89))',
                    }}
                  />
                )}

                {/* Badge */}
                {(pkg.badge || pkg.is_highlighted) && (
                  <div className="absolute top-4 right-4 z-10">
                    <div
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold text-white"
                      style={{ backgroundColor: 'oklch(0.7319 0.1856 52.89)' }}
                    >
                      <span className="sm:mb-0.5">
                        {pkg.badge ?? 'Rekomendasi'}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5 flex flex-col gap-5 flex-1">
                  {/* Header */}
                  <div>
                    <p
                      className={`text-xs font-bold uppercase tracking-widest mb-2 transition-colors group-hover/pkg:text-brand-blue ${
                        pkg.is_highlighted
                          ? 'text-brand-blue'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {pkg.name}
                    </p>
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">
                      {formatServicePrice(pkg.price)}
                    </p>
                    {pkg.original_price && (
                      <p className="text-sm text-gray-400 line-through mt-1">
                        {formatServicePrice(pkg.original_price)}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {pkg.duration}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                      {pkg.short_description}
                    </p>
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-2.5 flex-1">
                    {pkg.features
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((feat) => (
                        <li
                          key={feat.feature_name}
                          className={`flex items-start gap-2.5 text-sm ${
                            feat.is_included
                              ? 'text-gray-700 dark:text-gray-300'
                              : 'text-gray-300 dark:text-gray-600 line-through'
                          }`}
                        >
                          <span
                            className="shrink-0 w-4.5 h-4.5 mt-0.5 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: feat.is_included
                                ? pkg.is_highlighted
                                  ? 'oklch(0.3811 0.1315 260.22 / 0.12)'
                                  : 'oklch(0.55 0.13 160 / 0.12)'
                                : 'oklch(0 0 0 / 0.05)',
                            }}
                          >
                            {feat.is_included ? (
                              <Check
                                className="w-2.5 h-2.5"
                                style={{
                                  color: pkg.is_highlighted
                                    ? 'oklch(0.3811 0.1315 260.22)'
                                    : 'oklch(0.45 0.13 160)',
                                }}
                              />
                            ) : (
                              <X className="w-2.5 h-2.5 text-gray-300 dark:text-gray-600" />
                            )}
                          </span>
                          {feat.feature_name}
                        </li>
                      ))}
                  </ul>

                  {/* CTA */}
                  {waPkgHref(pkg.name) ? (
                    <a
                      href={waPkgHref(pkg.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                        pkg.is_highlighted
                          ? 'text-white hover:opacity-90'
                          : 'border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/25 bg-transparent'
                      }`}
                      style={
                        pkg.is_highlighted
                          ? { backgroundColor: 'oklch(0.3811 0.1315 260.22)' }
                          : {}
                      }
                    >
                      <MessageCircle className="w-4 h-4" />
                      Pesan Sekarang
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <a
                      href="/kontak"
                      className={`mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                        pkg.is_highlighted
                          ? 'text-white hover:opacity-90'
                          : 'border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/25 bg-transparent'
                      }`}
                      style={
                        pkg.is_highlighted
                          ? { backgroundColor: 'oklch(0.3811 0.1315 260.22)' }
                          : {}
                      }
                    >
                      <MessageCircle className="w-4 h-4" />
                      Pesan Sekarang
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          Butuh paket khusus?{' '}
          <a
            href={waCustomHref || '/kontak'}
            {...(waCustomHref
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            className="font-semibold hover:underline"
            style={{ color: 'oklch(0.3811 0.1315 260.22)' }}
          >
            Hubungi kami untuk penawaran kustom →
          </a>
        </p>
      </div>
    </section>
  );
}
