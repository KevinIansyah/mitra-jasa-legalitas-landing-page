import { SectionHeading } from "@/components/section-heading";
import type { WhatsappCta } from "@/lib/types/home";
import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

type CtaSectionProps = {
  whatsappCta: WhatsappCta | null;
};

export function CtaSection({ whatsappCta }: CtaSectionProps) {
  const waHref = whatsappCta?.wa_me_with_message?.trim() || whatsappCta?.wa_me?.trim() || "";

  return (
    <section className="bg-surface-card py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="relative overflow-hidden rounded-2xl p-8 sm:p-12" style={{ backgroundColor: "oklch(0.3811 0.1315 260.22)" }}>
          <div className="absolute top-[-60px] right-[-60px] h-[220px] w-[220px] rounded-full opacity-10" style={{ backgroundColor: "white" }} />
          <div className="absolute bottom-[-40px] left-[-40px] h-[160px] w-[160px] rounded-full opacity-10" style={{ backgroundColor: "oklch(0.7319 0.1856 52.89)" }} />

          <div className="relative z-10">
            <SectionHeading
              badge="Siap Memulai?"
              title={
                <span className="text-white">
                  Urus Legalitas Bisnis Sekarang <br className="hidden sm:block" />
                  Bersama <span style={{ color: "oklch(0.7319 0.1856 52.89)" }}>Mitra Jasa Legalitas</span>
                </span>
              }
              description={<span className="text-white">Konsultasi gratis, proses transparan, dan garansi kepatuhan hukum. Ribuan klien telah mempercayakan legalitas bisnis mereka kepada kami.</span>}
              className="mb-8"
            />
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              {waHref ? (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  <MessageCircle className="size-4" />
                  Chat WhatsApp Sekarang
                </a>
              ) : (
                <Link href="/kontak" className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10">
                  <MessageCircle className="size-4" />
                  Hubungi Kami
                </Link>
              )}
              <Link
                href="/kontak"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold transition-colors hover:bg-gray-50"
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
