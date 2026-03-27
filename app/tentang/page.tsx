import { cache } from 'react';
import { getCompanyInformation } from '@/lib/api/endpoints/company-information.server';
import { TentangHero } from './_components/tentang-hero';
import { TentangHistorySection } from './_components/tentang-history-section';
import { TentangStatsSection } from './_components/tentang-stats-section';
import { TentangMissionVisionSection } from './_components/tentang-mission-vision-section';
import { TentangValuesSection } from './_components/tentang-values-section';
import { TentangCtaSection } from './_components/tentang-cta-section';

export const metadata = {
  title: 'Tentang Kami – Mitra Jasa Legalitas',
  description:
    'Sejarah, misi, visi, dan nilai-nilai CV. Mitra Jasa Legalitas — konsultan legalitas & perizinan usaha sejak 2014, berbasis di Surabaya.',
};

const getCachedCompanyInformation = cache(getCompanyInformation);

export default async function TentangPage() {
  const company = await getCachedCompanyInformation().catch(() => null);
  const companyStats = company?.stats ?? null;
  const whatsapp = company?.contact.whatsapp?.trim() ?? '';

  return (
    <div className="bg-surface-page">
      <TentangHero />
      <TentangHistorySection />
      <TentangStatsSection stats={companyStats} />
      <TentangMissionVisionSection />
      <TentangValuesSection />
      <TentangCtaSection whatsapp={whatsapp} />
    </div>
  );
}
