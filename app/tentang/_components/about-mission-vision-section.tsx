"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/section-heading";
import { missionVision } from "../_data/about";
import { EASE } from "@/lib/types/constants";

const BRAND_BLUE = "oklch(0.3811 0.1315 260.22)";
const BRAND_ORANGE = "oklch(0.7319 0.1856 52.89)";

export function AboutMissionVisionSection() {
  return (
    <section className="bg-surface-card py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative overflow-hidden rounded-2xl p-8 sm:p-10 lg:p-12"
          style={{ backgroundColor: BRAND_BLUE }}
        >
          <div className="absolute top-[-60px] right-[-60px] h-[220px] w-[220px] rounded-full opacity-10" style={{ backgroundColor: "white" }} />
          <div className="absolute bottom-[-40px] left-[-40px] h-[160px] w-[160px] rounded-full opacity-10" style={{ backgroundColor: BRAND_ORANGE }} />

          <div className="relative z-10">
            <SectionHeading
              badge="Arah Kami"
              title={
                <span className="text-white">
                  Visi & <span style={{ color: BRAND_ORANGE }}>Misi</span>
                </span>
              }
              description={<span className="text-white/90">Visi menggambarkan arah jangka panjang kami; misi menjelaskan bagaimana kami mewujudkannya setiap hari.</span>}
              className="mb-10"
            />

            <div className="grid gap-10 border-white/15 pt-10 md:grid-cols-2 md:gap-12 md:pt-10">
              <div className="text-left border-b border-white/15 pb-10 md:border-b-0 md:pb-0">
                <h3 className="mb-3 text-lg font-bold tracking-tight text-white">{missionVision.vision.title}</h3>
                <p className="text-sm leading-relaxed text-white/90">{missionVision.vision.body}</p>
              </div>

              <div className="text-left md:border-l md:border-white/15 md:pl-12">
                <h3 className="mb-3 text-lg font-bold tracking-tight text-white">{missionVision.mission.title}</h3>
                <p className="text-sm leading-relaxed text-white/90">{missionVision.mission.body}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
