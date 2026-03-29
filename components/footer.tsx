import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Mail, Phone, MapPin, Instagram, Youtube, Facebook, Linkedin, Twitter, MessageCircle, Globe, Link2 } from "lucide-react";
import Image from "next/image";
import navLogo from "@/public/nav-logo.svg";
import type { NavigationData, NavigationSocialMedia } from "@/lib/types/navigation";

const SOCIAL_ORDER: (keyof NavigationSocialMedia)[] = ["instagram", "facebook", "youtube", "linkedin", "tiktok", "twitter", "threads", "whatsapp"];

const SOCIAL_META: Record<keyof NavigationSocialMedia, { icon: LucideIcon; label: string }> = {
  instagram: { icon: Instagram, label: "Instagram" },
  facebook: { icon: Facebook, label: "Facebook" },
  youtube: { icon: Youtube, label: "YouTube" },
  linkedin: { icon: Linkedin, label: "LinkedIn" },
  tiktok: { icon: Link2, label: "TikTok" },
  twitter: { icon: Twitter, label: "X (Twitter)" },
  threads: { icon: Link2, label: "Threads" },
  whatsapp: { icon: MessageCircle, label: "WhatsApp" },
};

function telHref(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("0")) return `tel:+62${d.slice(1)}`;
  if (d.startsWith("62")) return `tel:+${d}`;
  return `tel:+${d}`;
}

function mapsHref(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

interface FooterProps {
  navigation: NavigationData;
}

export function Footer({ navigation }: FooterProps) {
  const serviceCategories = navigation.service_categories ?? [];
  const company = navigation.company;
  const social = navigation.social_media ?? {};
  const wa = navigation.whatsapp;

  const socialLinks = SOCIAL_ORDER.flatMap((key) => {
    const url = social[key];
    if (!url?.trim()) return [];
    const meta = SOCIAL_META[key];
    return [{ key, url: url.trim(), ...meta }];
  });

  const brandName = company?.name ?? "Mitra Jasa Legalitas";
  const tagline = company?.tagline ?? "Solusi legalitas bisnis terpercaya di Indonesia. Kami mendampingi ribuan pengusaha dari pendirian badan usaha hingga perlindungan kekayaan intelektual.";

  const contactRows: {
    icon: LucideIcon;
    text: string;
    href: string;
  }[] = [];

  if (company?.email) {
    contactRows.push({
      icon: Mail,
      text: company.email,
      href: `mailto:${company.email}`,
    });
  }

  if (company?.phone) {
    const phoneHref = wa?.wa_me ?? social.whatsapp ?? telHref(company.phone);
    contactRows.push({
      icon: Phone,
      text: company.phone,
      href: phoneHref,
    });
  }

  if (company?.address) {
    contactRows.push({
      icon: MapPin,
      text: company.address,
      href: mapsHref(company.address),
    });
  }

  if (company?.website) {
    contactRows.push({
      icon: Globe,
      text: company.website.replace(/^https?:\/\//, ""),
      href: company.website.startsWith("http") ? company.website : `https://${company.website}`,
    });
  }

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: "oklch(0.13 0.02 260)" }}>
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, oklch(0.3811 0.1315 260.22 / 0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* ── CTA Banner ── */}
      {/* <div className="relative z-10 border-b border-white/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                Siap memulai?
              </p>
              <h3 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                Urus legalitas bisnis Anda{' '}
                <span style={{ color: 'oklch(0.7319 0.1856 52.89)' }}>
                  sekarang.
                </span>
              </h3>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/daftar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'oklch(0.7319 0.1856 52.89)' }}
              >
                Mulai Konsultasi Gratis
              </Link>
              <Link
                href="/layanan"
                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full text-sm font-semibold text-white/70 border border-white/15 hover:border-white/30 hover:text-white transition-colors"
              >
                Lihat Semua Layanan
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div> */}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 ">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-10">
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image src={navLogo} alt="Logo Mitra Jasa Legalitas" height={40} />
            </Link>

            <p className="text-sm text-white/45 leading-relaxed max-w-xs">{tagline}</p>

            {contactRows.length > 0 && (
              <div className="space-y-3">
                {contactRows.map((c) => (
                  <a
                    key={c.text}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-2.5 group"
                  >
                    <c.icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "oklch(0.7319 0.1856 52.89)" }} />
                    <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors leading-relaxed wrap-break-word max-w-[300px]">{c.text}</span>
                  </a>
                ))}
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/25 transition-colors"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/35">Layanan</p>
            <ul className="space-y-3">
              {serviceCategories.length === 0 ? (
                <li>
                  <Link href="/layanan" className="text-sm text-white/50 hover:text-white transition-colors">
                    Semua layanan
                  </Link>
                </li>
              ) : (
                serviceCategories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/layanan?kategori=${encodeURIComponent(cat.slug)}`} className="text-sm text-white/50 hover:text-white transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} {brandName}. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: "Kebijakan Privasi", href: "#" },
              { label: "Syarat & Ketentuan", href: "#" },
              { label: "Peta Situs", href: "/sitemap" },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="text-xs text-white/30 hover:text-white/60 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
