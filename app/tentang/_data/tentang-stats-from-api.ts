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
  companyStats: CompanyInformationStats,
): TentangStatItem[] {
  return [
    {
      kind: 'count',
      key: 'clients',
      to: companyStats.total_clients,
      suffix: '+',
      label: 'Klien Terlayani',
      sub: 'UMKM hingga korporasi',
    },
    {
      kind: 'count',
      key: 'documents',
      to: companyStats.total_documents,
      suffix: '+',
      label: 'Dokumen Diproses',
      sub: 'Legal & perizinan',
    },
    {
      kind: 'count',
      key: 'years',
      to: companyStats.years_experience,
      suffix: ' thn',
      label: 'Pengalaman',
      sub: 'Mendampingi legalitas bisnis',
    },
    {
      kind: 'rating',
      key: 'rating',
      rating: companyStats.rating,
      reviews: companyStats.total_reviews,
      label: 'Rating',
      sub:
        companyStats.total_reviews > 0
          ? `Berdasarkan ${companyStats.total_reviews.toLocaleString('id-ID')} ulasan`
          : 'Kepuasan klien',
    },
  ];
}

export const FALLBACK_TENTANG_STAT_ITEMS: TentangStatItem[] = legacyStats.map(
  (legacyStat, index) => ({
    kind: 'count' as const,
    key: `legacy-${index}`,
    to: legacyStat.to,
    suffix: legacyStat.suffix,
    label: legacyStat.label,
    sub: legacyStat.sub,
  }),
);
