import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { whatsappWaMeUrlWithText } from "@/lib/whatsapp-cta";

type AboutCtaSectionProps = {
  whatsapp: string;
};

export function AboutCtaSection({ whatsapp }: AboutCtaSectionProps) {
  const wa = whatsapp.trim();
  const waHref = wa ? whatsappWaMeUrlWithText(wa, "Halo, saya tertarik dengan legalitas bisnis saya") : "";

  return (
    <section className="py-16 lg:py-20 bg-surface-card">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="rounded-2xl p-8 sm:p-12 overflow-hidden relative" style={{ backgroundColor: "oklch(0.3811 0.1315 260.22)" }}>
          <div className="absolute top-[-60px] right-[-60px] w-[220px] h-[220px] rounded-full opacity-10" style={{ backgroundColor: "white" }} />
          <div className="absolute bottom-[-40px] left-[-40px] w-[160px] h-[160px] rounded-full opacity-10" style={{ backgroundColor: "oklch(0.7319 0.1856 52.89)" }} />

          <div className="relative z-10">
            <SectionHeading
              badge="Siap Memulai?"
              title={
                <span className="text-white">
                  Urus Legalitas Sekarang <br className="hidden sm:block" />
                  Bersama <span style={{ color: "oklch(0.7319 0.1856 52.89)" }}>Mitra Jasa Legalitas</span>
                </span>
              }
              description={<span className="text-white">Konsultasi gratis, proses transparan, dan garansi kepatuhan hukum. Ribuan klien telah mempercayakan legalitas bisnis mereka kepada kami.</span>}
              className="mb-8"
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {waHref ? (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white border-2 border-white/30 hover:bg-white/10 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat WhatsApp Sekarang
                </a>
              ) : (
                <Link href="/kontak" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white border-2 border-white/30 hover:bg-white/10 transition-colors">
                  <MessageCircle className="size-4" />
                  Hubungi Kami
                </Link>
              )}
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold bg-white hover:bg-gray-50 transition-colors group"
                style={{ color: "oklch(0.3811 0.1315 260.22)" }}
              >
                Kirim Pesan
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
