'use client';

import type { HomeServiceSummary } from '@/lib/types/home';
import { MarqueeRow, type MarqueeItem } from './marque-row';

const FALLBACK_ROW_ONE: MarqueeItem[] = [
  { icon: '⚖️', label: 'Pendirian PT' },
  { icon: '📋', label: 'Pendirian CV' },
  { icon: '🏢', label: 'PT Perorangan' },
  { icon: '📄', label: 'NIB & OSS' },
  { icon: '🔖', label: 'SIUP & TDP' },
  { icon: '™️', label: 'Daftar Merek' },
  { icon: '🌿', label: 'Sertifikasi Halal' },
  { icon: '💊', label: 'Izin BPOM' },
  { icon: '🏗️', label: 'IMB & PBG' },
  { icon: '📑', label: 'NPWP Badan' },
];

const FALLBACK_ROW_TWO: MarqueeItem[] = [
  { icon: '📜', label: 'Akta Notaris' },
  { icon: '🔐', label: 'Hak Cipta' },
  { icon: '🏦', label: 'Rekening Perusahaan' },
  { icon: '📊', label: 'Laporan Keuangan' },
  { icon: '🤝', label: 'Perjanjian Bisnis' },
  { icon: '🌐', label: 'Izin Ekspor Impor' },
  { icon: '🏥', label: 'Izin Klinik' },
  { icon: '🎓', label: 'Izin Lembaga Pendidikan' },
  { icon: '🚗', label: 'Izin Transportasi' },
  { icon: '🏪', label: 'Izin Retail' },
];

function marqueeItemsFromAllServices(
  allServices: HomeServiceSummary[],
): MarqueeItem[] {
  return allServices.map((s) => ({
    icon: s.icon?.trim() || '📋',
    label: s.name,
    href: `/layanan/${s.slug}`,
  }));
}

/** Membagi dua baris marquee (kiri/kanan) agar animasi tetap seimbang. */
function splitIntoTwoRows(
  items: MarqueeItem[],
): { rowOne: MarqueeItem[]; rowTwo: MarqueeItem[] } {
  if (items.length === 0) {
    return { rowOne: [], rowTwo: [] };
  }
  const mid = Math.ceil(items.length / 2);
  const rowOne = items.slice(0, mid);
  let rowTwo = items.slice(mid);
  if (rowTwo.length === 0) {
    rowTwo = rowOne;
  }
  return { rowOne, rowTwo };
}

type ClientMarqueeProps = {
  /** Dari GET `/home` → `all_services` */
  allServices?: HomeServiceSummary[] | null;
};

export function ClientMarquee({ allServices }: ClientMarqueeProps) {
  const fromApi =
    Array.isArray(allServices) && allServices.length > 0
      ? marqueeItemsFromAllServices(allServices)
      : null;

  const { rowOne, rowTwo } = fromApi
    ? splitIntoTwoRows(fromApi)
    : { rowOne: FALLBACK_ROW_ONE, rowTwo: FALLBACK_ROW_TWO };

  return (
    <section className="relative overflow-hidden bg-surface-page">
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div
        style={{
          transform: 'skewY(-1deg)',
          margin: '0 -40px',
        }}
      >
        <div className="flex flex-col gap-2">
          <MarqueeRow items={rowOne} direction="left" speed={40} />
          <MarqueeRow items={rowTwo} direction="right" speed={33} />
        </div>
      </div>
    </section>
  );
}
