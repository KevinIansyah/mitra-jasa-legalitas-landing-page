import type { Metadata } from 'next';
import { cache } from 'react';
import { getCompanyInformation } from '@/lib/api/endpoints/company-information.server';
import { formatBusinessHoursLine } from '@/lib/format-business-hours';
import { ContactHero } from './_components/contact-hero';
import { ContactSection } from './_components/contact-section';
import { kontakHero } from './_data/kontak';

const getCachedCompanyInfo = cache(getCompanyInformation);

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getCachedCompanyInfo();
    const name = data.company_identity.name;
    const desc =
      data.company_identity.tagline ??
      'Hubungi tim kami untuk konsultasi legalitas bisnis, perizinan, dan pendirian badan usaha.';
    return {
      title: `Kontak – ${name}`,
      description: desc,
    };
  } catch {
    return {
      title: 'Kontak – CV. Mitra Jasa Legalitas',
      description:
        'Hubungi tim kami untuk konsultasi legalitas bisnis, perizinan, dan pendirian badan usaha.',
    };
  }
}

export default async function KontakPage() {
  const data = await getCachedCompanyInfo().catch(() => null);

  if (!data) {
    return (
      <div className="min-h-screen bg-surface-page pt-32 pb-20 px-4 text-center text-sm text-gray-500">
        Tidak dapat memuat informasi kontak. Silakan muat ulang halaman atau coba
        lagi nanti.
      </div>
    );
  }

  const ci = data.company_identity;
  const heroChips = [
    {
      label: `${data.address.city}, ${data.address.province}`,
      showPin: true as const,
    },
    {
      label: formatBusinessHoursLine(data.business_hours),
      showPin: false as const,
    },
  ];

  return (
    <>
      {data.schema_org && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data.schema_org),
          }}
        />
      )}

      <div className="min-h-screen bg-surface-page">
        <ContactHero
          companyNameAccent={ci.name}
          description={ci.tagline ?? kontakHero.description}
          chips={heroChips}
        />
        <ContactSection data={data} />
      </div>
    </>
  );
}
