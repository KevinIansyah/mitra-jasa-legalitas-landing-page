"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, ArrowRight, Star } from "lucide-react";
import { SectionHeading } from "../../../components/section-heading";
import { motion } from "framer-motion";
import type { HomeFeaturedService } from "@/lib/types/home";
import { formatIdrFromApi } from "@/lib/utils";
import { EASE } from "@/lib/types/constants";

const FALLBACK_ACCENT = "oklch(0.3811 0.1315 260.22)";

function paletteToMutedBg(palette: string | null | undefined): string {
  if (!palette) return `${FALLBACK_ACCENT} / 0.08`;
  return palette.replace(/\)\s*$/, " / 0.08)");
}

function ServiceCard({ service }: { service: HomeFeaturedService }) {
  const accent = service.category?.palette_color?.trim() || FALLBACK_ACCENT;
  const bgColor = paletteToMutedBg(service.category?.palette_color);
  const features =
    service.included_features
      ?.filter((feature) => feature.is_included)
      .sort((left, right) => left.sort_order - right.sort_order)
      .slice(0, 3)
      .map((feature) => ({ text: feature.feature_name })) ?? [];
  const priceLabel = service.cheapest_package ? formatIdrFromApi(service.cheapest_package.price) : "Konsultasi harga";
  const durationLabel = service.cheapest_package?.duration ?? "-";

  return (
    <Link href={`/layanan/${service.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
        className="blog-card group relative flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden"
      >
        {service.is_popular && (
          <div
            className="absolute top-4 right-4 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: "oklch(0.7319 0.1856 52.89)" }}
          >
            <Star className="size-3 fill-white" />
            Terpopuler
          </div>
        )}

        {service.featured_image ? (
          <div className="relative h-36 w-full shrink-0 overflow-hidden bg-gray-100">
            <Image
              src={service.featured_image}
              alt={service.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        ) : null}

        <div className="flex flex-col flex-1 p-6 gap-5">
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-gray-900 leading-snug group-hover:text-brand-blue transition-colors">{service.name}</h3>
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{service.short_description ?? ""}</p>
          </div>

          {features.length > 0 ? (
            <ul className="space-y-2.5">
              {features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: bgColor }}>
                    <Check className="w-2.5 h-2.5" style={{ color: accent }} strokeWidth={3} />
                  </div>
                  <span className="text-xs text-gray-600 leading-relaxed">{feature.text}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-auto pt-5 border-t border-gray-100 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Mulai dari</p>
              <p className="text-lg font-extrabold text-gray-900">{priceLabel}</p>
              <p className="text-xs text-gray-400 mt-0.5">{durationLabel}</p>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-1" style={{ backgroundColor: bgColor }}>
              <ArrowRight className="size-4" style={{ color: accent }} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export function ServicesSection({ featuredServices }: { featuredServices: HomeFeaturedService[] }) {
  return (
    <section className="py-20 lg:py-28 bg-surface-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.08, ease: EASE }} className="mb-14">
          <SectionHeading
            badge="Layanan"
            title={
              <>
                Layanan Populer <br className="hidden sm:block" />
                <span style={{ color: "oklch(0.3811 0.1315 260.22)" }}>untuk Bisnis Anda</span>
              </>
            }
            description="Solusi legalitas lengkap untuk berbagai kebutuhan bisnis Anda, ditangani oleh tim profesional berpengalaman."
          />
        </motion.div>

        {featuredServices.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-8">
            Belum ada layanan unggulan.{" "}
            <Link href="/layanan" className="font-semibold text-brand-blue">
              Lihat semua layanan
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/layanan"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-brand-blue hover:text-brand-blue transition-colors group"
          >
            Lihat Semua Layanan
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
