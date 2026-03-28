'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { whatsappWaMeUrlWithText } from '@/lib/whatsapp-cta';
import type {
  ServiceLegalBasis,
  ServicePackage,
  ServiceProcessStep,
  ServiceRequirementCategory,
} from '@/lib/types/service';
import { formatServicePrice } from '@/lib/utils';

const BRAND_BLUE = 'oklch(0.3811 0.1315 260.22)';

export type ServiceSidebarProps = {
  serviceName: string;
  whatsapp: string;
  packages: ServicePackage[];
  processSteps: ServiceProcessStep[];
  requirementCategories: ServiceRequirementCategory[];
  legalBases: ServiceLegalBasis[];
  faqCount: number;
  hasDescription: boolean;
};

type TocItem = { id: string; label: string };

function ServiceTableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label="Daftar Isi">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">
        Daftar Isi
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block text-sm py-1 pl-3 border-l-2 transition-colors leading-snug ${
                active === item.id
                  ? 'font-semibold border-brand-blue'
                  : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-white/30'
              }`}
              style={active === item.id ? { color: BRAND_BLUE } : {}}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function RecommendedPackageCta({
  serviceName,
  whatsapp,
  pkg,
}: {
  serviceName: string;
  whatsapp: string;
  pkg: ServicePackage;
}) {
  const waConsultHref = whatsapp.trim()
    ? whatsappWaMeUrlWithText(
        whatsapp,
        `Halo, saya tertarik dengan layanan ${serviceName}`,
      )
    : '';
  const included = pkg.features.filter((f) => f.is_included);

  return (
    <div
      className="rounded-2xl p-5 text-white space-y-3"
      style={{ backgroundColor: BRAND_BLUE }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: 'oklch(1 0 0 / 0.15)' }}
      >
        <Sparkles className="w-5 h-5 text-white" aria-hidden />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-white/70">
        Paket Rekomendasi
      </p>
      <p className="text-2xl font-extrabold leading-none tracking-tight">
        {formatServicePrice(pkg.price)}
      </p>
      <p className="text-xs text-white/80 leading-snug">
        {pkg.name} · {pkg.duration}
      </p>
      {included.length > 0 ? (
        <ul className="space-y-1.5 pt-1">
          {included.slice(0, 4).map((f) => (
            <li
              key={f.feature_name}
              className="flex items-start gap-2 text-xs text-white/85 leading-snug"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/80" />
              <span>{f.feature_name}</span>
            </li>
          ))}
          {included.length > 4 ? (
            <li className="text-xs text-white/60 pl-3">
              +{included.length - 4} fitur lainnya
            </li>
          ) : null}
        </ul>
      ) : null}
      <div className="pt-1 space-y-2">
        {waConsultHref ? (
          <a
            href={waConsultHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-white text-gray-900 hover:bg-white/90 transition-colors"
          >
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden />
            Konsultasi via WhatsApp
          </a>
        ) : (
          <Link
            href="/kontak"
            className="flex justify-center items-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-white text-gray-900 hover:bg-white/90 transition-colors"
          >
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden />
            Hubungi kami
          </Link>
        )}
        <a
          href="#paket"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white underline underline-offset-2 hover:no-underline group"
        >
          Lihat semua paket
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}

export function ServiceSidebar({
  serviceName,
  whatsapp,
  packages,
  processSteps,
  requirementCategories,
  legalBases,
  faqCount,
  hasDescription,
}: ServiceSidebarProps) {
  const highlighted =
    packages.length > 0
      ? (packages.find((p) => p.is_highlighted) ?? packages[0])
      : null;

  const tocItems = useMemo((): TocItem[] => {
    const items: TocItem[] = [];
    if (hasDescription) {
      items.push({ id: 'deskripsi', label: 'Deskripsi' });
    }
    if (packages.length) {
      items.push({ id: 'paket', label: 'Harga & Paket' });
    }
    if (processSteps.length) {
      items.push({ id: 'proses', label: 'Alur Proses' });
    }
    if (requirementCategories.length) {
      items.push({ id: 'persyaratan', label: 'Persyaratan' });
    }
    if (legalBases.length) {
      items.push({ id: 'dasar-hukum', label: 'Dasar Hukum' });
    }
    if (faqCount > 0) {
      items.push({ id: 'faq', label: 'FAQ' });
    }
    return items;
  }, [
    hasDescription,
    packages.length,
    processSteps.length,
    requirementCategories.length,
    legalBases.length,
    faqCount,
  ]);

  return (
    <aside className="w-full lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <div className="space-y-10 lg:flex-1 lg:min-h-0 sticky top-24">
        {tocItems.length > 0 ? (
          <>
            <ServiceTableOfContents items={tocItems} />
            {highlighted ? (
              <div className="h-px bg-gray-100 dark:bg-white/10" />
            ) : null}
          </>
        ) : null}

        {highlighted ? (
          <RecommendedPackageCta
            serviceName={serviceName}
            whatsapp={whatsapp}
            pkg={highlighted}
          />
        ) : null}
      </div>
    </aside>
  );
}
