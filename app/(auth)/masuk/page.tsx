import type { Metadata } from 'next';
import { MasukForm } from './_components/masuk-form';

export const metadata: Metadata = {
  title: 'Masuk',
  description: 'Masuk ke portal klien Mitra Jasa Legalitas.',
};

export default function MasukPage() {
  return <MasukForm />;
}
