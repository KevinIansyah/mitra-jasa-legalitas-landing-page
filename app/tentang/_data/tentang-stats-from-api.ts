import type { CompanyInformationStats } from '@/lib/types/company-information';
import { stats as legacyStats } from './about';

export type TentangStatItem =
  | {
      kind: 'count';
      key: string;
      to: number;
      suffix: string;
      label: string;
      sub: string;
    }
  | {
      kind: 'rating';
      key: string;
      rating: number;
      reviews: number;
      label: string;
      sub: string;
    };

export function buildTentangStatItems(
  s: CompanyInformationStats,
): TentangStatItem[] {
  return [
    {
      kind: 'count',
      key: 'clients',
      to: s.total_clients,
      suffix: '+',
      label: 'Klien Terlayani',
      sub: 'UMKM hingga korporasi',
    },
    {
      kind: 'count',
      key: 'documents',
      to: s.total_documents,
      suffix: '+',
      label: 'Dokumen Diproses',
      sub: 'Legal & perizinan',
    },
    {
      kind: 'count',
      key: 'years',
      to: s.years_experience,
      suffix: ' thn',
      label: 'Pengalaman',
      sub: 'Mendampingi legalitas bisnis',
    },
    {
      kind: 'rating',
      key: 'rating',
      rating: s.rating,
      reviews: s.total_reviews,
      label: 'Rating',
      sub:
        s.total_reviews > 0
          ? `Berdasarkan ${s.total_reviews.toLocaleString('id-ID')} ulasan`
          : 'Kepuasan klien',
    },
  ];
}

export const FALLBACK_TENTANG_STAT_ITEMS: TentangStatItem[] = legacyStats.map(
  (s, i) => ({
    kind: 'count' as const,
    key: `legacy-${i}`,
    to: s.to,
    suffix: s.suffix,
    label: s.label,
    sub: s.sub,
  }),
);
