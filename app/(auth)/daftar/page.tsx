import type { Metadata } from 'next';
import { DaftarForm } from './_components/daftar-form';

export const metadata: Metadata = {
  title: 'Daftar',
  description: 'Buat akun portal klien Mitra Jasa Legalitas.',
};

export default function DaftarPage() {
  return <DaftarForm />;
}
