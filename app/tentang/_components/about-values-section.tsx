"use client";

import { motion } from "framer-motion";
import { Award, Shield, Sparkles, Clock, BadgePercent, HeartHandshake, type LucideIcon } from "lucide-react";
import { valueItems, valuesSection, type ValueIconKey } from "../_data/about";
import { SectionHeading } from "@/components/section-heading";
import { EASE } from "@/lib/types/constants";

const VALUE_ICONS: Record<ValueIconKey, LucideIcon> = {
  Award,
  Shield,
  Sparkles,
  Clock,
  BadgePercent,
  HeartHandshake,
};

export function AboutValuesSection() {
  return (
    <section className="py-16 lg:py-20 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }} className="mb-14">
          <SectionHeading badge={valuesSection.badge} title={valuesSection.title} description={valuesSection.description} />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {valueItems.map((valueItem, itemIndex) => {
            const Icon = VALUE_ICONS[valueItem.iconKey];
            return (
              <motion.div
                key={valueItem.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: itemIndex * 0.08, ease: EASE }}
                className="blog-card group flex flex-col gap-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-surface-card p-5"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: valueItem.bg }}>
                  <Icon className="w-5 h-5" style={{ color: valueItem.color }} />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-blue transition-colors">{valueItem.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{valueItem.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
