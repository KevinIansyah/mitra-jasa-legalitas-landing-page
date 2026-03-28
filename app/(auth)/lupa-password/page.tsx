import type { Metadata } from 'next';
import { LupaPasswordForm } from './_components/lupa-password-form';

export const metadata: Metadata = {
  title: 'Lupa password',
  description: 'Atur ulang password akun Mitra Jasa Legalitas.',
};

export default function LupaPasswordPage() {
  return <LupaPasswordForm />;
}
