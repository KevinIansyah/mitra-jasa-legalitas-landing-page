import { ServiceSidebar } from '../../_components/service-sidebar';
import type {
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
  serviceName: string;
  whatsapp: string;
  packages: ServicePackage[];
  processSteps: ServiceProcessStep[];
  requirementCategories: ServiceRequirementCategory[];
  legalBases: ServiceLegalBasis[];
  faqCount: number;
};

export function DetailBody({
  hasDescription,
  introduction,
  content,
  cityName,
  serviceName,
  whatsapp,
  packages,
  processSteps,
  requirementCategories,
  legalBases,
  faqCount,
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
                  <div className="mb-14">
                    <div
                      className="service-prose"
                      dangerouslySetInnerHTML={{ __html: introduction }}
                    />
                  </div>
                ) : null}

                {content ? (
                  <div className="pt-6 border-t border-gray-100 dark:border-white/8">
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
              serviceName={serviceName}
              whatsapp={whatsapp}
              packages={packages}
              processSteps={processSteps}
              requirementCategories={requirementCategories}
              legalBases={legalBases}
              faqCount={faqCount}
              hasDescription={hasDescription}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
