import type { ReactNode } from 'react';

export const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const hero = {
  badge: 'Perusahaan',
  titleLead: 'Tentang',
  titleAccent: 'Mitra Jasa Legalitas',
  description:
    'Konsultan legalitas dan perizinan usaha yang mendampingi ribuan pengusaha Indonesia sejak 2014 — dengan integritas, kecepatan, dan layanan yang ramah.',
  chips: [
    { label: 'Surabaya, Jawa Timur', showPin: true as const },
    { label: 'Sejak 2014', showPin: false as const },
  ],
};

export const history = {
  sectionLabel: 'Sejarah Kami',
  title: (
    <>
      Dari <span style={{ color: 'oklch(0.3811 0.1315 260.22)' }}>AR Jasa</span>{' '}
      Hingga <br className="hidden sm:block" /> Mitra Legalitas Terpercaya
    </>
  ),
  paragraphs: [
    <>
      <strong className="text-gray-800 dark:text-gray-200">
        CV. Mitra Jasa Legalitas
      </strong>{' '}
      adalah perusahaan konsultan legalitas dan perizinan usaha yang berdiri
      sejak <strong className="text-gray-800 dark:text-gray-200">2014</strong>{' '}
      dengan nama{' '}
      <strong className="text-gray-800 dark:text-gray-200">AR Jasa</strong>.
      Kami resmi bertransformasi menjadi{' '}
      <strong className="text-gray-800 dark:text-gray-200">
        CV. Mitra Jasa Legalitas
      </strong>{' '}
      pada <strong className="text-gray-800 dark:text-gray-200">2020</strong>,
      dengan fokus memberikan layanan profesional untuk kebutuhan legalitas
      bisnis di seluruh Indonesia.
    </>,
    <>
      Berbasis di{' '}
      <strong className="text-gray-800 dark:text-gray-200">
        Surabaya, Jawa Timur
      </strong>
      , kami telah membantu lebih dari{' '}
      <strong className="text-gray-800 dark:text-gray-200">2.200+ klien</strong>{' '}
      dari berbagai skala usaha — mulai dari UMKM hingga perusahaan besar.
      Dengan total{' '}
      <strong className="text-gray-800 dark:text-gray-200">
        4.756+ dokumen legal
      </strong>{' '}
      yang telah kami proses, kami bangga menjadi mitra terpercaya dalam
      perjalanan bisnis klien kami.
    </>,
    <>
      Pengalaman bertahun-tahun membuat kami memahami tantangan pengusaha dalam
      mengurus legalitas. Karena itu, kami berkomitmen pada layanan yang{' '}
      <strong className="text-gray-800 dark:text-gray-200">
        profesional, transparan, dan anti ribet
      </strong>
      .
    </>,
  ] as ReactNode[],
};

export const timelineSteps = [
  {
    year: '2014',
    title: 'Berdiri sebagai AR Jasa',
    description:
      'Awal perjalanan fokus pada layanan legalitas dan konsultasi usaha.',
  },
  {
    year: '2020',
    title: 'Resmi menjadi CV. Mitra Jasa Legalitas',
    description:
      'Rebranding dan struktur badan hukum yang lebih kuat untuk layanan skala nasional.',
  },
  {
    year: 'Kini',
    title: '2.200+ klien & 4.756+ dokumen',
    description:
      'Terus berkembang bersama UMKM dan korporasi di berbagai sektor.',
  },
] as const;

export const stats = [
  {
    to: 2200,
    suffix: '+',
    label: 'Klien Terlayani',
    sub: 'UMKM hingga korporasi',
  },
  {
    to: 4756,
    suffix: '+',
    label: 'Dokumen Diproses',
    sub: 'Legal & perizinan',
  },
  { to: 10, suffix: '+', label: 'Tahun Pengalaman', sub: 'Sejak 2014' },
  {
    to: 100,
    suffix: '%',
    label: 'Komitmen Kualitas',
    sub: 'Proses transparan',
  },
] as const;

export const missionVision = {
  mission: {
    title: 'Misi Kami',
    body: (
      <>
        Membantu UMKM dan perusahaan dalam pengurusan legalitas usaha dengan
        layanan yang{' '}
        <strong className="text-gray-800 dark:text-gray-200">
          profesional, transparan, dan tepat waktu
        </strong>
        . Kami berkomitmen menjadi solusi terpercaya untuk semua kebutuhan
        perizinan dan legalitas bisnis Anda.
      </>
    ),
  },
  vision: {
    title: 'Visi Kami',
    body: (
      <>
        Menjadi{' '}
        <strong className="text-gray-800 dark:text-gray-200">
          mitra terpercaya nomor satu
        </strong>{' '}
        dalam pertumbuhan bisnis melalui layanan legalitas terbaik di Indonesia.
        Kami ingin setiap pengusaha dapat fokus mengembangkan bisnis tanpa
        khawatir urusan legalitas.
      </>
    ),
  },
};

export type ValueIconKey =
  | 'Award'
  | 'Shield'
  | 'Sparkles'
  | 'Clock'
  | 'BadgePercent'
  | 'HeartHandshake';

export const valueItems: {
  iconKey: ValueIconKey;
  title: string;
  description: string;
  color: string;
  bg: string;
}[] = [
  {
    iconKey: 'Award',
    title: 'Profesionalisme Tinggi',
    description:
      'Setiap layanan ditangani dengan standar profesional tertinggi dan keahlian yang teruji.',
    color: 'oklch(0.3811 0.1315 260.22)',
    bg: 'oklch(0.3811 0.1315 260.22 / 0.1)',
  },
  {
    iconKey: 'Shield',
    title: 'Transparansi Penuh',
    description:
      'Tidak ada biaya tersembunyi. Semua proses dan biaya dijelaskan dengan jelas sejak awal.',
    color: 'oklch(0.55 0.13 160)',
    bg: 'oklch(0.55 0.13 160 / 0.12)',
  },
  {
    iconKey: 'Sparkles',
    title: 'Kualitas Terjamin',
    description:
      'Dokumen legal berkualitas dengan komitmen proses yang teliti dan garansi revisi gratis sesuai kebutuhan.',
    color: 'oklch(0.7319 0.1856 52.89)',
    bg: 'oklch(0.7319 0.1856 52.89 / 0.12)',
  },
  {
    iconKey: 'Clock',
    title: 'Tepat Waktu',
    description:
      'Kami menepati timeline yang disepakati dengan sistem pelacakan progres yang transparan.',
    color: 'oklch(0.62 0.16 30)',
    bg: 'oklch(0.62 0.16 30 / 0.1)',
  },
  {
    iconKey: 'BadgePercent',
    title: 'Harga Bersaing',
    description:
      'Harga fair dan kompetitif dengan kualitas layanan terbaik di kelasnya.',
    color: 'oklch(0.48 0.12 200)',
    bg: 'oklch(0.48 0.12 200 / 0.1)',
  },
  {
    iconKey: 'HeartHandshake',
    title: 'Customer First',
    description:
      'Kepuasan klien adalah prioritas utama dengan support responsif 24/7 melalui WhatsApp dan saluran resmi.',
    color: 'oklch(0.5 0.13 270)',
    bg: 'oklch(0.5 0.13 270 / 0.1)',
  },
];

export const valuesSection = {
  badge: 'Nilai-Nilai Kami',
  title: (
    <>
      Prinsip yang Menjadi{' '}<br className="hidden sm:block" />
      <span style={{ color: 'oklch(0.3811 0.1315 260.22)' }}>Landasan</span>{' '}
      Setiap Layanan
    </>
  ),
  description:
    'Enam pilar ini memandu cara kami bekerja setiap hari — dari konsultasi pertama hingga serah terima dokumen.',
};

export const cta = {
  title: 'Siap wujudkan legalitas bisnis Anda?',
  subtitle: 'Konsultasi gratis dengan tim kami — tanpa komitmen di awal.',
  primary: { href: '/layanan', label: 'Lihat Layanan' },
  secondary: { href: '/kontak', label: 'Hubungi Kami' },
};
