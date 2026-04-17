import { ServiceSidebar } from '../../_components/service-sidebar';
import type {
  ServiceDetailCityPage,
  ServiceLegalBasis,
  ServicePackage,
  ServiceProcessStep,
  ServiceRequirementCategory,
} from '@/lib/types/service';

export type DetailBodyProps = {
  hasDescription: boolean;
  introduction: string | null;
  content: string | null;
  cityName: string;
  serviceSlug: string;
  serviceName: string;
  whatsapp: string;
  packages: ServicePackage[];
  processSteps: ServiceProcessStep[];
  requirementCategories: ServiceRequirementCategory[];
  legalBases: ServiceLegalBasis[];
  faqCount: number;
  cityPages?: ServiceDetailCityPage[];
};

export function DetailBody({
  hasDescription,
  introduction,
  content,
  cityName,
  serviceSlug,
  serviceName,
  whatsapp,
  packages,
  processSteps,
  requirementCategories,
  legalBases,
  faqCount,
  cityPages = [],
}: DetailBodyProps) {
  return (
    <div className="bg-surface-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-10">
          <section
            id={hasDescription ? 'deskripsi' : undefined}
            className={
              hasDescription
                ? 'flex-1 min-w-0 min-h-0 space-y-8 scroll-mt-28'
                : 'flex-1 min-w-0 min-h-0 space-y-8'
            }
          >
            {introduction || content ? (
              <>
                {introduction ? (
                  <div className="mb-10">
                    <div
                      className="service-prose -mt-2"
                      dangerouslySetInnerHTML={{ __html: introduction }}
                    />
                  </div>
                ) : null}

                {content ? (
                  <div className="pt-2 border-t border-gray-100 dark:border-white/8">
                    <div
                      className="service-prose"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                Konten untuk layanan di {cityName} sedang disiapkan. Hubungi
                tim kami untuk informasi lebih lengkap.
              </p>
            )}
          </section>

          <div className="w-full shrink-0 lg:w-[280px] xl:w-[300px] flex flex-col min-h-0 lg:self-stretch">
            <ServiceSidebar
              serviceSlug={serviceSlug}
              serviceName={serviceName}
              whatsapp={whatsapp}
              packages={packages}
              processSteps={processSteps}
              requirementCategories={requirementCategories}
              legalBases={legalBases}
              faqCount={faqCount}
              hasDescription={hasDescription}
              cityPages={cityPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
