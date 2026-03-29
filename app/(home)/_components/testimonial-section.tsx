"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeading } from "../../../components/section-heading";
import type { HomeStats, Testimonial as TestimonialApi } from "@/lib/types/home";
import { getInitials } from "@/lib/utils";
import { EASE } from "@/lib/types/constants";

interface HomepageTestimonialCard {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  text: string;
  service: string;
  featured?: boolean;
}

function mapApiTestimonialsToCards(apiRows: TestimonialApi[]): HomepageTestimonialCard[] {
  return apiRows.map((row, rowIndex) => ({
    id: String(row.id),
    name: row.client_name,
    role: row.client_position ?? "",
    company: row.client_company ?? "",
    avatar: getInitials(row.client_name),
    rating: row.rating,
    text: row.content,
    service: row.service?.name ?? "Layanan",
    featured: rowIndex === 0,
  }));
}

const avatarColors = ["oklch(0.3811 0.1315 260.22)", "oklch(0.7319 0.1856 52.89)", "oklch(0.55 0.13 160)", "oklch(0.62 0.16 30)", "oklch(0.5 0.13 270)", "oklch(0.45 0.15 20)", "oklch(0.48 0.12 200)"];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((starSlotIndex) => (
        <Star
          key={starSlotIndex}
          className="w-3.5 h-3.5"
          style={{
            color: starSlotIndex < rating ? "oklch(0.7319 0.1856 52.89)" : "oklch(0.85 0 0)",
            fill: starSlotIndex < rating ? "oklch(0.7319 0.1856 52.89)" : "none",
          }}
        />
      ))}
    </div>
  );
}

function Avatar({ initials, index, size = "md" }: { initials: string; index: number; size?: "sm" | "md" }) {
  const color = avatarColors[index % avatarColors.length];
  const sizeClass = size === "sm" ? "w-9 h-9 text-xs" : "w-11 h-11 text-sm";
  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center font-bold text-white shrink-0`} style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
}

function ServicePill({ label }: { label: string }) {
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full text-center"
      style={{
        backgroundColor: "oklch(0.3811 0.1315 260.22 / 0.08)",
        color: "oklch(0.3811 0.1315 260.22)",
      }}
    >
      {label}
    </span>
  );
}

function TestimonialCard({ testimonial, cardIndex, featured }: { testimonial: HomepageTestimonialCard; cardIndex: number; featured?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: cardIndex * 0.08,
        ease: EASE,
      }}
      className={`blog-card flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 ${featured ? "ring-1 ring-brand-blue/20" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <Stars rating={testimonial.rating} />
        <Quote className="w-6 h-6 shrink-0 opacity-15" style={{ color: "oklch(0.3811 0.1315 260.22)" }} />
      </div>

      <p className="text-sm text-gray-600 leading-relaxed flex-1">&ldquo;{testimonial.text}&rdquo;</p>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar initials={testimonial.avatar} index={cardIndex} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{testimonial.name}</p>
            <p className="text-xs text-gray-400 truncate">
              {testimonial.role} · {testimonial.company}
            </p>
          </div>
        </div>
        <ServicePill label={testimonial.service} />
      </div>
    </motion.div>
  );
}

function FeaturedTestimonialCard({ testimonial, cardIndex }: { testimonial: HomepageTestimonialCard; cardIndex: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: cardIndex * 0.08,
        ease: EASE,
      }}
      className="blog-card-image col-span-1 md:col-span-2 relative flex flex-col justify-between gap-6 rounded-2xl p-5 md:p-8 overflow-hidden"
      style={{ backgroundColor: "oklch(0.3811 0.1315 260.22)" }}
    >
      <div className="absolute top-[-60px] right-[-60px] w-[220px] h-[220px] rounded-full opacity-10" style={{ backgroundColor: "white" }} />
      <div className="absolute bottom-[-40px] left-[-40px] w-[160px] h-[160px] rounded-full opacity-10" style={{ backgroundColor: "oklch(0.7319 0.1856 52.89)" }} />

      <div className="relative z-10 space-y-4">
        <Stars rating={testimonial.rating} />
        <Quote className="w-8 h-8 text-white/30" />
        <p className="text-base md:text-lg text-white/90 leading-relaxed font-medium max-w-2xl">&ldquo;{testimonial.text}&rdquo;</p>
      </div>

      <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">{testimonial.avatar}</div>
          <div>
            <p className="text-sm font-semibold text-white">{testimonial.name}</p>
            <p className="text-xs text-white/60">
              {testimonial.role} · {testimonial.company}
            </p>
          </div>
        </div>
        <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/15 text-white text-center">{testimonial.service}</span>
      </div>
    </motion.div>
  );
}

export function TestimonialSection({ testimonials: testimonialsApi, stats }: { testimonials: TestimonialApi[]; stats: HomeStats }) {
  if (testimonialsApi.length === 0) {
    return null;
  }

  const testimonials = mapApiTestimonialsToCards(testimonialsApi);
  const featuredTestimonials = testimonials.filter((item) => item.featured);
  const regularTestimonials = testimonials.filter((item) => !item.featured);

  return (
    <section className="py-20 lg:py-28 bg-surface-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.08, ease: EASE }} className="mb-14">
          <SectionHeading
            badge="Testimoni"
            title={
              <>
                Dipercaya <br className="hidden sm:block" />
                <span style={{ color: "oklch(0.7319 0.1856 52.89)" }}>Ribuan Pelaku Usaha</span>
              </>
            }
            description="Apa kata klien kami setelah menggunakan layanan Mitra Jasa Legalitas."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-12"
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map((starSlotIndex) => (
                <Star
                  key={starSlotIndex}
                  className="w-5 h-5"
                  style={{
                    color: "oklch(0.7319 0.1856 52.89)",
                    fill: "oklch(0.7319 0.1856 52.89)",
                  }}
                />
              ))}
            </div>
            <span className="text-2xl font-extrabold text-gray-900">{stats.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-400">/ 5.0</span>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <p className="text-sm text-gray-500">
            Berdasarkan <span className="font-semibold text-gray-800">{stats.total_reviews.toLocaleString("id-ID")}+ ulasan</span> dari klien nyata
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredTestimonials.map((testimonial, cardIndex) => (
            <FeaturedTestimonialCard key={testimonial.id} testimonial={testimonial} cardIndex={cardIndex} />
          ))}

          {regularTestimonials.map((testimonial, cardIndex) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} cardIndex={cardIndex + featuredTestimonials.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
