'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calculator,
  Scale,
  Copyright,
  Building,
  Globe2,
  Crown,
  Users,
  ArrowUpRight,
} from 'lucide-react';
import { SectionHeading } from '../../../components/section-heading';
import { EASE } from '@/lib/types/constants';

interface NetworkPartnerCard {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  href: string;
  accent: string;
  bg: string;
}

const NETWORK_PARTNER: NetworkPartnerCard[] = [
  {
    id: 'pajak',
    name: 'Mitra Pajak',
    tagline: 'Pajak beres, bisnis lancar',
    description:
      'Layanan perpajakan dan pembukuan profesional - SPT Tahunan, laporan keuangan, hingga pendampingan pemeriksaan pajak.',
    icon: Calculator,
    href: '/layanan/mitra-pajak',
    accent: 'oklch(0.7319 0.1856 52.89)',
    bg: 'oklch(0.7319 0.1856 52.89 / 0.08)',
  },
  {
    id: 'hukum',
    name: 'Mitra Hukum',
    tagline: 'Solusi hukum yang terjangkau',
    description:
      'Pendampingan sengketa bisnis, penyusunan kontrak, dan konsultasi hukum korporat dengan biaya yang transparan.',
    icon: Scale,
    href: '/layanan/mitra-hukum',
    accent: 'oklch(0.3811 0.1315 260.22)',
    bg: 'oklch(0.3811 0.1315 260.22 / 0.08)',
  },
  {
    id: 'haki',
    name: 'Mitra HAKI',
    tagline: 'Lindungi karya & brand Anda',
    description:
      'Pendaftaran merek, hak cipta, dan paten. Kami pastikan aset intelektual bisnis Anda terlindungi secara hukum.',
    icon: Copyright,
    href: '/layanan/mitra-haki',
    accent: 'oklch(0.55 0.15 160)',
    bg: 'oklch(0.55 0.15 160 / 0.08)',
  },
  {
    id: 'properti',
    name: 'Mitra Properti',
    tagline: 'Tanah & aset bebas masalah',
    description:
      'Pengurusan sertifikat HGB, HM, IMB/PBG, serta pengecekan legalitas tanah dan properti sebelum transaksi.',
    icon: Building,
    href: '/layanan/mitra-properti',
    accent: 'oklch(0.62 0.16 30)',
    bg: 'oklch(0.62 0.16 30 / 0.08)',
  },
  {
    id: 'digital',
    name: 'Mitra Digital',
    tagline: 'Setup bisnis era digital',
    description:
      'Fasilitasi investasi, business setup untuk startup digital, serta pendampingan regulasi fintech dan e-commerce.',
    icon: Globe2,
    href: '/layanan/mitra-digital',
    accent: 'oklch(0.5 0.13 270)',
    bg: 'oklch(0.5 0.13 270 / 0.08)',
  },
  {
    id: 'privilege',
    name: 'Mitra Privilege',
    tagline: 'Layanan eksklusif tanpa batas',
    description:
      'Benefit prioritas untuk klien korporat - dedicated konsultan, SLA respon 2 jam, diskon semua layanan, dan akses member.',
    icon: Crown,
    href: '/layanan/mitra-privilege',
    accent: 'oklch(0.7319 0.1856 52.89)',
    bg: 'oklch(0.7319 0.1856 52.89 / 0.08)',
  },
  {
    id: 'hr',
    name: 'Mitra HR',
    tagline: 'SDM kuat, bisnis tumbuh',
    description:
      'Konsultasi ketenagakerjaan, penyusunan PKB & SOP HR, pendampingan BPJS, hingga rekrutmen tenaga profesional.',
    icon: Users,
    href: '/layanan/mitra-hr',
    accent: 'oklch(0.48 0.12 200)',
    bg: 'oklch(0.48 0.12 200 / 0.08)',
  },
];

function MitraCard({
  partner,
  cardIndex,
  wide,
}: {
  partner: NetworkPartnerCard;
  cardIndex: number;
  wide?: boolean;
}) {
  const Icon = partner.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: cardIndex * 0.08, ease: EASE }}
      className={wide ? 'lg:col-span-2' : ''}
    >
      <Link
        href={partner.href}
        className="blog-card group flex flex-col h-full gap-5 rounded-2xl border border-gray-200 bg-white p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: partner.bg }}
          >
            <Icon className="w-5 h-5" style={{ color: partner.accent }} />
          </div>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
            style={{ backgroundColor: partner.bg }}
          >
            <ArrowUpRight
              className="w-3.5 h-3.5"
              style={{ color: partner.accent }}
            />
          </div>
        </div>

        <div className="flex-1 space-y-1.5">
          {/* <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: partner.accent }}
          >
            {partner.tagline}
          </p> */}
          <h3 className="text-base font-extrabold text-gray-900 group-hover:text-brand-blue transition-colors">
            {partner.name}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            {partner.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export function NetworkSection() {
  const [firstPartner, secondPartner, ...remainingPartners] = NETWORK_PARTNER;

  return (
    <section className="py-20 lg:py-28 bg-surface-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
          className="mb-14"
        >
          <SectionHeading
            badge="Ekosistem Layanan"
            title={
              <>
                Jaringan Layanan Lengkap <br className="hidden sm:block" />
                <span style={{ color: 'oklch(0.7319 0.1856 52.89)' }}>
                  untuk Setiap Kebutuhan Bisnis
                </span>
              </>
            }
            description="Satu pintu untuk semua kebutuhan legal, keuangan, dan operasional bisnis Anda."
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MitraCard partner={firstPartner} cardIndex={0} wide />
          <MitraCard partner={secondPartner} cardIndex={1} />
          <MitraCard partner={remainingPartners[0]} cardIndex={2} />

          <MitraCard partner={remainingPartners[1]} cardIndex={3} />
          <MitraCard partner={remainingPartners[2]} cardIndex={4} />
          <MitraCard partner={remainingPartners[3]} cardIndex={5} />

          <MitraCard partner={remainingPartners[4]} cardIndex={6} />
        </div>
      </div>
    </section>
  );
}
