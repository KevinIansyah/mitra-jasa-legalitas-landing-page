"use client";

import Image from "next/image";
import { toR2ProxySrc } from "@/lib/r2-loader";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { SectionHeading } from "@/components/section-heading";
import { EASE } from "@/lib/types/constants";
import type { ClientCompany } from "@/lib/types/home";
import { cn } from "@/lib/utils";

type ClientLogoItem = {
  id: string;
  name: string;
  sector?: string;
  logoUrl?: string | null;
};

const AUTO_SLIDE_INTERVAL_MS = 7500;

const LOGOS_PER_SLIDE = {
  default: 4,
  md: 8,
  lg: 12,
} as const;

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function useLogosPerSlide(): number {
  return useSyncExternalStore(
    (onChange) => {
      const mqMd = window.matchMedia("(min-width: 768px)");
      const mqLg = window.matchMedia("(min-width: 1024px)");
      mqMd.addEventListener("change", onChange);
      mqLg.addEventListener("change", onChange);
      return () => {
        mqMd.removeEventListener("change", onChange);
        mqLg.removeEventListener("change", onChange);
      };
    },
    () => {
      if (window.matchMedia("(min-width: 1024px)").matches) return LOGOS_PER_SLIDE.lg;
      if (window.matchMedia("(min-width: 768px)").matches) return LOGOS_PER_SLIDE.md;
      return LOGOS_PER_SLIDE.default;
    },
    () => LOGOS_PER_SLIDE.default,
  );
}

function chunkItems<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [];
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function companiesToLogoItems(companies: ClientCompany[]): ClientLogoItem[] {
  const seenId = new Set<number>();
  const seenLogo = new Set<string>();
  const seenName = new Set<string>();
  const out: ClientLogoItem[] = [];

  for (const c of [...companies].sort((a, b) => a.id - b.id)) {
    if (seenId.has(c.id)) continue;
    const logo = c.logo?.trim();
    const name = c.name?.trim().toLowerCase();
    if (logo && seenLogo.has(logo)) continue;
    if (name && seenName.has(name)) continue;

    seenId.add(c.id);
    if (logo) seenLogo.add(logo);
    if (name) seenName.add(name);
    out.push({ id: String(c.id), name: c.name, logoUrl: logo || null });
  }
  return out;
}

function ClientLogoCard({ client, index }: { client: ClientLogoItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: EASE }}
      className="flex flex-col items-center text-center"
    >
      <div className="blog-card group flex h-30 w-[140px] max-w-full shrink-0 flex-col items-center justify-center space-y-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5">
        {client.logoUrl ? (
          <Image
            src={toR2ProxySrc(client.logoUrl)}
            alt={client.name}
            width={112}
            height={56}
            unoptimized
            className="max-h-12 w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <span className="text-lg font-extrabold uppercase leading-tight line-clamp-2 text-brand-blue" aria-hidden>
            {client.name}
          </span>
        )}

        <div className="min-w-0 space-y-0.5 px-1">
          <p className="line-clamp-2 text-xs font-semibold leading-snug text-gray-900 dark:text-white">{client.name}</p>
          {client.sector ? <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">{client.sector}</p> : null}
        </div>
      </div>
    </motion.div>
  );
}

type ClientLogosSectionProps = {
  clientCompanies?: ClientCompany[] | null;
};

function LogosCarousel({ slides, reduceMotion }: { slides: ClientLogoItem[][]; reduceMotion: boolean }) {
  const [selected, setSelected] = useState(0);

  const plugins = useMemo(() => {
    if (reduceMotion || slides.length <= 1) return [];
    return [
      Autoplay({
        delay: AUTO_SLIDE_INTERVAL_MS,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
        stopOnLastSnap: false,
      }),
    ];
  }, [reduceMotion, slides.length]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: slides.length > 1,
      align: "start",
      containScroll: false,
    },
    plugins,
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, slides]);

  if (slides.length === 0) return null;

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label="Logo klien">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((slide, sIdx) => (
            <div key={sIdx} className="min-w-0 shrink-0 flex-[0_0_100%] px-1 sm:px-2" aria-hidden={selected !== sIdx}>
              <div className="mx-auto flex w-full justify-center">
                <div className="grid w-max max-w-full grid-cols-2 justify-items-center gap-5 md:grid-cols-4 lg:grid-cols-6">
                  {slide.map((client, index) => (
                    <ClientLogoCard key={`${sIdx}-${client.id}`} client={client} index={index} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="mt-8 flex justify-center gap-2" role="tablist" aria-label="Indikator slide logo">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === selected}
              aria-label={`Tampilkan grup logo ${i + 1} dari ${slides.length}`}
              className={cn("h-2 rounded-full transition-all duration-300", i === selected ? "w-8 bg-brand-blue" : "w-2 bg-gray-300 hover:bg-gray-400 dark:bg-white/25 dark:hover:bg-white/40")}
              onClick={() => emblaApi?.scrollTo(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ClientLogosSection({ clientCompanies }: ClientLogosSectionProps) {
  const items = useMemo(() => {
    if (!Array.isArray(clientCompanies) || clientCompanies.length === 0) return [] as ClientLogoItem[];
    return companiesToLogoItems(clientCompanies);
  }, [clientCompanies]);

  const perSlide = useLogosPerSlide();
  const slides = useMemo(() => chunkItems(items, perSlide), [items, perSlide]);
  const reduceMotion = useReducedMotion();

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-surface-page py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 lg:mb-14">
          <SectionHeading
            badge="Klien kami"
            title={
              <>
                Dipercaya Berbagai <br className="hidden sm:block" />
                <span className="text-brand-blue">Bisnis & Organisasi</span>
              </>
            }
            description="Bersama Mitra Jasa Legalitas, ratusan pelaku usaha telah menyelesaikan legalitas dengan tenang."
          />
        </div>

        <LogosCarousel key={`${slides.length}-${perSlide}-${items.length}`} slides={slides} reduceMotion={reduceMotion} />
      </div>
    </section>
  );
}
