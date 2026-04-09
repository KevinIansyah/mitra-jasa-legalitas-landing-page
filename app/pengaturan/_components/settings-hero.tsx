"use client";

import { motion } from "framer-motion";
import { BRAND_BLUE, BRAND_ORANGE, EASE } from "@/lib/types/constants";

export function SettingsHero() {
  return (
    <section className="relative w-full overflow-hidden py-14 lg:py-16" style={{ backgroundColor: BRAND_BLUE }}>
      <div className="pointer-events-none absolute top-[-60px] right-[-60px] h-[220px] w-[220px] rounded-full opacity-10" style={{ backgroundColor: "white" }} aria-hidden />
      <div className="pointer-events-none absolute bottom-[-40px] left-[-40px] h-[160px] w-[160px] rounded-full opacity-10" style={{ backgroundColor: BRAND_ORANGE }} aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="max-w-2xl">
          <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-4xl">Pengaturan</h1>

          <p className="max-w-xl text-base leading-relaxed text-white/90">Kelola nama, foto profil, dan kata sandi untuk akun portal klien Mitra Jasa Legalitas - semua dari satu halaman.</p>
        </motion.div>
      </div>
    </section>
  );
}
