'use client';

import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { whatsappWaMeUrlWithText } from '@/lib/whatsapp-cta';
import type {
  ServiceLegalBasis,
  ServicePackage,
  ServiceProcessStep,
  ServiceRequirementCategory,
} from '@/lib/types/service';
import { formatServicePrice } from '@/lib/utils';

export type ServiceSidebarProps = {
  serviceName: string;
  whatsapp: string;
  packages: ServicePackage[];
  processSteps: ServiceProcessStep[];
  requirementCategories: ServiceRequirementCategory[];
  legalBases: ServiceLegalBasis[];
  faqCount: number;
};

export function ServiceSidebar({
  serviceName,
  whatsapp,
  packages,
  processSteps,
  requirementCategories,
  legalBases,
  faqCount,
}: ServiceSidebarProps) {
  const waConsultHref = whatsapp.trim()
    ? whatsappWaMeUrlWithText(
        whatsapp,
        `Halo, saya tertarik dengan layanan ${serviceName}`,
      )
    : '';
  const highlighted =
    packages.length > 0
      ? (packages.find((p) => p.is_highlighted) ?? packages[0])
      : null;

  const navLinks = [
    ...(packages.length ? [{ href: '#paket', label: 'Harga & Paket' }] : []),
    ...(processSteps.length ? [{ href: '#proses', label: 'Alur Proses' }] : []),
    ...(requirementCategories.length
      ? [{ href: '#persyaratan', label: 'Persyaratan' }]
      : []),
    ...(legalBases.length
      ? [{ href: '#dasar-hukum', label: 'Dasar Hukum' }]
      : []),
    ...(faqCount > 0 ? [{ href: '#faq', label: 'FAQ' }] : []),
  ];

  return (
    <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0">
      <div className="sticky top-24 space-y-4">
        {highlighted && (
          <div
            className="rounded-2xl border p-5 space-y-4"
            style={{
              borderColor: 'oklch(0.3811 0.1315 260.22)',
              boxShadow: '0 12px 40px oklch(0.3811 0.1315 260.22 / 0.18)',
              backgroundColor: 'var(--surface-card)',
            }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
                Paket Rekomendasi
              </p>
              <p className="text-xl font-extrabold text-gray-900 dark:text-white leading-none">
                {formatServicePrice(highlighted.price)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {highlighted.name} · {highlighted.duration}
              </p>
            </div>

            <ul className="space-y-2">
              {highlighted.features
                .filter((f) => f.is_included)
                .slice(0, 4)
                .map((f) => (
                  <li
                    key={f.feature_name}
                    className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: 'oklch(0.3811 0.1315 260.22)' }}
                    />
                    {f.feature_name}
                  </li>
                ))}
              {highlighted.features.filter((f) => f.is_included).length > 4 && (
                <li className="text-xs text-gray-400 dark:text-gray-500 pl-3.5">
                  +
                  {highlighted.features.filter((f) => f.is_included).length - 4}{' '}
                  fitur lainnya
                </li>
              )}
            </ul>

            <div className="space-y-2.5">
              {waConsultHref ? (
                <a
                  href={waConsultHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: 'oklch(0.3811 0.1315 260.22)' }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Konsultasi via WhatsApp
                </a>
              ) : (
                <Link
                  href="/kontak"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: 'oklch(0.3811 0.1315 260.22)' }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Hubungi kami
                </Link>
              )}
              <a
                href="#paket"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/25 transition-colors"
              >
                Lihat Semua Paket
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-gray-100 dark:border-white/8 bg-surface-card p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
            Pada Halaman Ini
          </p>
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block text-sm py-1 pl-3 border-l-2 transition-colors leading-snug text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-white/30"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
