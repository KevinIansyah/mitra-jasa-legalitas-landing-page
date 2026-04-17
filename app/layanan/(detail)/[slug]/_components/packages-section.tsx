"use client";

import { motion } from "framer-motion";
import { Check, X, Clock, MessageCircle, ArrowRight } from "lucide-react";
import type { ServicePackage } from "@/lib/types/service";
import { formatServicePrice } from "@/lib/utils";
import { whatsappWaMeUrl, whatsappWaMeUrlWithText } from "@/lib/whatsapp-cta";
import { SectionHeading } from "@/components/section-heading";
import { EASE } from "@/lib/types/constants";

export function PackagesSection({ packages, whatsapp }: { packages: ServicePackage[]; whatsapp: string }) {
  const wa = whatsapp.trim();
  const waPkgHref = (pkgName: string) => (wa ? whatsappWaMeUrlWithText(wa, `Halo, saya tertarik dengan ${pkgName}`) : "");
  const waCustomHref = wa ? whatsappWaMeUrl(wa) : "";
  return (
    <section id="paket" className="py-16 lg:py-20 bg-surface-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <SectionHeading
            badge="Harga & Paket"
            title={
              <>
                Pilih Paket yang <span style={{ color: "oklch(0.3811 0.1315 260.22)" }}>Sesuai Kebutuhan</span>
              </>
            }
            description="Semua paket sudah termasuk biaya notaris, PNBP, dan pendampingan penuh tanpa biaya tersembunyi."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {packages
            .sort((left, right) => left.sort_order - right.sort_order)
            .map((pkg, packageIndex) => (
              <motion.div
                key={`${pkg.sort_order}-${pkg.name}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: packageIndex * 0.08, ease: EASE }}
                className={`group/pkg relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 blog-card ${
                  pkg.is_highlighted ? "shadow-xl border-transparent" : "border-gray-200 dark:border-white/10 bg-surface-card"
                }`}
                style={
                  pkg.is_highlighted
                    ? {
                        borderColor: "oklch(0.3811 0.1315 260.22)",
                        boxShadow: "0 12px 40px oklch(0.3811 0.1315 260.22 / 0.18)",
                        backgroundColor: "var(--surface-card)",
                      }
                    : {}
                }
              >
                {pkg.is_highlighted && (
                  <div
                    className="h-1.5 w-full"
                    style={{
                      background: "linear-gradient(to right, oklch(0.3811 0.1315 260.22), oklch(0.7319 0.1856 52.89))",
                    }}
                  />
                )}

                {(pkg.badge || pkg.is_highlighted) && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-2.5 py-1 rounded-full text-[10px] font-semibold text-white" style={{ backgroundColor: "oklch(0.7319 0.1856 52.89)" }}>
                      <span className="sm:mb-0.5">{pkg.badge ?? "Rekomendasi"}</span>
                    </div>
                  </div>
                )}

                <div className="p-5 flex flex-col gap-5 flex-1">
                  <div>
                    <p
                      className={`text-xs font-semibold uppercase tracking-widest transition-colors group-hover/pkg:text-brand-blue ${
                        pkg.is_highlighted ? "text-brand-blue" : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {pkg.name}
                    </p>
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none mt-4">{formatServicePrice(pkg.price)}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-4">
                      <Clock className="w-3.5 h-3.5" />
                      {pkg.duration}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">{pkg.short_description}</p>
                  </div>

                  <ul className="space-y-2.5 flex-1">
                    {pkg.features
                      .sort((left, right) => left.sort_order - right.sort_order)
                      .map((packageFeature) => (
                        <li
                          key={packageFeature.feature_name}
                          className={`flex items-start gap-2.5 text-sm ${packageFeature.is_included ? "text-gray-700 dark:text-gray-300" : "text-gray-300 dark:text-gray-600 line-through"}`}
                        >
                          <span
                            className="shrink-0 w-4.5 h-4.5 mt-0.5 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: packageFeature.is_included ? (pkg.is_highlighted ? "oklch(0.3811 0.1315 260.22 / 0.12)" : "oklch(0.55 0.13 160 / 0.12)") : "oklch(0 0 0 / 0.05)",
                            }}
                          >
                            {packageFeature.is_included ? (
                              <Check
                                className="w-2.5 h-2.5"
                                style={{
                                  color: pkg.is_highlighted ? "oklch(0.3811 0.1315 260.22)" : "oklch(0.45 0.13 160)",
                                }}
                              />
                            ) : (
                              <X className="w-2.5 h-2.5 text-gray-300 dark:text-gray-600" />
                            )}
                          </span>
                          {packageFeature.feature_name}
                        </li>
                      ))}
                  </ul>

                  {waPkgHref(pkg.name) ? (
                    <a
                      href={waPkgHref(pkg.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all group ${
                        pkg.is_highlighted
                          ? "text-white hover:opacity-90"
                          : "border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/25 bg-transparent"
                      }`}
                      style={pkg.is_highlighted ? { backgroundColor: "oklch(0.3811 0.1315 260.22)" } : {}}
                    >
                      <MessageCircle className="size-4" />
                      Pesan Sekarang
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </a>
                  ) : (
                    <a
                      href="/kontak"
                      className={`mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all group ${
                        pkg.is_highlighted
                          ? "text-white hover:opacity-90"
                          : "border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/25 bg-transparent"
                      }`}
                      style={pkg.is_highlighted ? { backgroundColor: "oklch(0.3811 0.1315 260.22)" } : {}}
                    >
                      <MessageCircle className="size-4" />
                      Pesan Sekarang
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
        </div>

        <p className="text-center text-xs font-semibold text-gray-400 dark:text-gray-500 mt-6">
          Butuh paket khusus?{" "}
          <a
            href={waCustomHref || "/kontak"}
            {...(waCustomHref ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="inline-flex items-center gap-1 hover:underline group"
            style={{ color: "oklch(0.3811 0.1315 260.22)" }}
          >
            Hubungi kami untuk penawaran kustom <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
          </a>
        </p>
      </div>
    </section>
  );
}
