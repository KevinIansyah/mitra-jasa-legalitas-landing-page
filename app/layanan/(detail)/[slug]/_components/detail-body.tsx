import type { ServiceDetail } from '@/lib/types/service';
import { ServiceSidebar } from './service-sidebar';

export type ServiceDetailBodyProps = {
  service: ServiceDetail;
  whatsapp: string;
  hasDescription: boolean;
};

export function DetailBody({
  service,
  whatsapp,
  hasDescription,
}: ServiceDetailBodyProps) {
  return (
    <div className="bg-surface-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-10">
          <div className="block lg:hidden shrink-0">
            <ServiceSidebar
              serviceSlug={service.slug}
              serviceName={service.name}
              whatsapp={whatsapp}
              packages={service.packages}
              processSteps={service.process_steps}
              requirementCategories={service.requirement_categories}
              legalBases={service.legal_bases}
              faqCount={service.faqs.length}
              hasDescription={hasDescription}
              cityPages={service.city_pages ?? []}
            />
          </div>

          <section
            id={hasDescription ? 'deskripsi' : undefined}
            className={
              hasDescription
                ? 'flex-1 min-w-0 min-h-0 space-y-8 scroll-mt-28'
                : 'flex-1 min-w-0 min-h-0 space-y-8'
            }
          >
            {service.introduction || service.content ? (
              <>
                {service.introduction ? (
                  <div className="mb-10">
                    <div
                      className="service-prose -mt-2"
                      dangerouslySetInnerHTML={{
                        __html: service.introduction,
                      }}
                    />
                  </div>
                ) : null}

                {service.content ? (
                  <div className="border-t pt-2 border-gray-100 dark:border-white/8">
                    <div
                      className="service-prose"
                      dangerouslySetInnerHTML={{ __html: service.content }}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                Layanan ini sedang dalam proses penulisan. Silakan hubungi tim
                kami untuk informasi lebih lengkap.
              </p>
            )}
          </section>

          <div className="hidden lg:flex lg:w-[280px] xl:w-[300px] shrink-0 flex-col min-h-0 self-stretch">
            <div className="sticky top-24">
              <ServiceSidebar
                serviceSlug={service.slug}
                serviceName={service.name}
                whatsapp={whatsapp}
                packages={service.packages}
                processSteps={service.process_steps}
                requirementCategories={service.requirement_categories}
                legalBases={service.legal_bases}
                faqCount={service.faqs.length}
                hasDescription={hasDescription}
                cityPages={service.city_pages ?? []}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
