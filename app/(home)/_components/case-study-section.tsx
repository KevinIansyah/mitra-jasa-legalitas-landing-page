"use client";

import { motion } from "framer-motion";
import { Clock, FileCheck, Trophy } from "lucide-react";
import { SectionHeading } from "../../../components/section-heading";
import type { ClientSuccessStory } from "@/lib/types/home";
import { EASE } from "@/lib/types/constants";

const CATEGORY_BUSINESS = [
  { value: "perdagangan", label: "Perdagangan" },
  { value: "retail", label: "Retail" },
  { value: "fnb", label: "Food & Beverage" },
  { value: "jasa", label: "Jasa" },
  { value: "manufaktur", label: "Manufaktur" },
  { value: "konstruksi", label: "Konstruksi" },
  { value: "properti", label: "Properti & Real Estate" },
  { value: "teknologi", label: "Teknologi Informasi" },
  { value: "telekomunikasi", label: "Telekomunikasi" },
  { value: "keuangan", label: "Keuangan" },
  { value: "transportasi", label: "Transportasi & Logistik" },
  { value: "pariwisata", label: "Pariwisata" },
  { value: "perhotelan", label: "Perhotelan" },
  { value: "kesehatan", label: "Kesehatan" },
  { value: "pendidikan", label: "Pendidikan" },
  { value: "pertanian", label: "Pertanian & Perkebunan" },
  { value: "perikanan", label: "Perikanan" },
  { value: "peternakan", label: "Peternakan" },
  { value: "pertambangan", label: "Pertambangan" },
  { value: "energi", label: "Energi" },
  { value: "industri_kreatif", label: "Industri Kreatif" },
  { value: "lingkungan", label: "Lingkungan & Pengolahan Limbah" },
  { value: "lainnya", label: "Lainnya" },
] as const;

function getIndustryLabelFromApiValue(raw: string | null): string {
  if (!raw?.trim()) return "Industri";
  const normalized = raw.trim().toLowerCase();
  const category = CATEGORY_BUSINESS.find((item) => item.value === normalized);
  return category?.label ?? raw.trim();
}

interface CaseStudyMetricRow {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface CaseStudyCardModel {
  id: string;
  industryLabel: string;
  company: string;
  heroStat: string;
  heroLabel: string;
  challenge: string;
  result: string;
  stats: CaseStudyMetricRow[];
}

function mapClientStoryToCardModel(story: ClientSuccessStory): CaseStudyCardModel {
  const statIcons = [Clock, Trophy, FileCheck] as const;
  const statSlots = [story.stat_1, story.stat_2, story.stat_3];
  const stats: CaseStudyMetricRow[] = statSlots.map((slot, slotIndex) =>
    slot
      ? {
          icon: statIcons[slotIndex] ?? Clock,
          label: slot.label,
          value: slot.value,
        }
      : {
          icon: statIcons[slotIndex] ?? Clock,
          label: "-",
          value: "-",
        },
  );

  return {
    id: String(story.id),
    industryLabel: getIndustryLabelFromApiValue(story.industry),
    company: story.client_name,
    heroStat: story.metric_value ?? "-",
    heroLabel: story.metric_label ?? "",
    challenge: story.challenge ?? "",
    result: story.solution ?? "",
    stats,
  };
}

function IndustryCategoryChip({ label, variant }: { label: string; variant: "featured" | "card" }) {
  if (variant === "featured") {
    return <span className="inline-block w-fit text-center text-xs font-medium px-3 py-1.5 rounded-full bg-white/15 text-white">{label}</span>;
  }
  return (
    <span
      className="inline-block w-fit text-center text-xs font-medium px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: "oklch(0.7319 0.1856 52.89 / 0.08)",
        color: "oklch(0.7319 0.1856 52.89)",
      }}
    >
      {label}
    </span>
  );
}

function FeaturedCard({ caseStudy, cardIndex }: { caseStudy: CaseStudyCardModel; cardIndex: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: cardIndex * 0.08, ease: EASE }}
      className="group relative flex flex-col justify-between rounded-2xl p-5 md:p-8 overflow-hidden h-full bg-brand-blue"
    >
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10 bg-white" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-10 bg-brand-orange" />

      <div className="relative z-10 space-y-6">
        <IndustryCategoryChip label={caseStudy.industryLabel} variant="featured" />

        <div>
          <p className="text-6xl font-extrabold text-white leading-none tracking-tight">{caseStudy.heroStat}</p>
          <p className="text-sm text-white/60 mt-1.5">{caseStudy.heroLabel}</p>
        </div>

        <div>
          <p className="text-xs text-white/50 uppercase font-medium tracking-widest mb-1">Klien</p>
          <p className="text-lg font-bold text-white leading-snug">{caseStudy.company}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-white/40 uppercase font-medium tracking-widest">Tantangan</p>
          <p className="text-sm text-white/75 leading-relaxed">{caseStudy.challenge}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-white/40 uppercase font-medium tracking-widest">Solusi</p>
          <p className="text-sm text-white/75 leading-relaxed">{caseStudy.result}</p>
        </div>
      </div>

      <div className="relative z-10 mt-8 pt-6 border-t border-white/15 grid grid-cols-3 gap-3">
        {caseStudy.stats.map((metric) => (
          <div key={metric.label}>
            <p className="text-base font-bold text-white">{metric.value}</p>
            <p className="text-[10px] text-white/50 mt-0.5 leading-snug">{metric.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RegularCard({ caseStudy, cardIndex }: { caseStudy: CaseStudyCardModel; cardIndex: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: cardIndex * 0.08, ease: EASE }}
      className="blog-card group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <IndustryCategoryChip label={caseStudy.industryLabel} variant="card" />
        </div>

        <div>
          <p className="text-5xl font-extrabold leading-none tracking-tight text-brand-blue">{caseStudy.heroStat}</p>
          <p className="text-xs text-gray-400 mt-1">{caseStudy.heroLabel}</p>
        </div>

        <p className="text-base font-bold text-gray-900 leading-snug group-hover:text-brand-blue transition-colors">{caseStudy.company}</p>

        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-widest mb-1">Tantangan</p>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{caseStudy.challenge}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-widest mb-1">Solusi</p>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{caseStudy.result}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-3 gap-2">
        {caseStudy.stats.map((metric) => (
          <div key={metric.label}>
            <p className="text-sm font-bold text-gray-900">{metric.value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{metric.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function WideCard({ caseStudy, cardIndex }: { caseStudy: CaseStudyCardModel; cardIndex: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: cardIndex * 0.08, ease: EASE }}
      className="blog-card group flex flex-col sm:flex-row gap-6 rounded-2xl border border-gray-200 bg-white p-5 h-full"
    >
      {/* ───────────────── Left ───────────────── */}
      <div className="sm:w-48 shrink-0 flex flex-col justify-between gap-4">
        <IndustryCategoryChip label={caseStudy.industryLabel} variant="card" />
        <div>
          <p className="text-5xl font-extrabold leading-none tracking-tight text-brand-blue">{caseStudy.heroStat}</p>
          <p className="text-xs text-gray-400 mt-1">{caseStudy.heroLabel}</p>
        </div>
        <p className="text-sm font-bold text-gray-900 leading-snug group-hover:text-brand-blue transition-colors">{caseStudy.company}</p>
      </div>

      <div className="hidden sm:block w-px bg-gray-100 shrink-0" />
      <div className="sm:hidden h-px bg-gray-100 w-full" />

      {/* ───────────────── Right ───────────────── */}
      <div className="flex flex-col justify-between gap-4 flex-1 min-w-0">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-widest mb-1">Tantangan</p>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{caseStudy.challenge}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-widest mb-1">Solusi</p>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{caseStudy.result}</p>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-3">
          {caseStudy.stats.map((metric) => (
            <div key={metric.label}>
              <p className="text-sm font-bold text-gray-900">{metric.value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function CaseStudySection({ stories }: { stories: ClientSuccessStory[] }) {
  const cases = stories.map(mapClientStoryToCardModel);
  if (cases.length < 4) {
    return null;
  }
  const [featured, card2, card3, card4] = cases;

  return (
    <section className="py-20 lg:py-28 bg-surface-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.08, ease: EASE }} className="mb-14">
          <SectionHeading
            badge="Kisah Sukses"
            title={
              <>
                Klien Kami Berhasil, <br className="hidden sm:block" />
                <span className="text-brand-blue">Bisnis Anda Bisa Juga</span>
              </>
            }
            description="Studi kasus nyata dari klien yang berhasil menavigasi tantangan legalitas bisnis bersama kami."
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="md:row-span-2 lg:row-span-2 flex">
            <FeaturedCard caseStudy={featured} cardIndex={0} />
          </div>

          <RegularCard caseStudy={card2} cardIndex={1} />

          <RegularCard caseStudy={card3} cardIndex={2} />

          <div className="md:col-span-1 lg:col-span-2 flex">
            <WideCard caseStudy={card4} cardIndex={3} />
          </div>
        </div>
      </div>
    </section>
  );
}
