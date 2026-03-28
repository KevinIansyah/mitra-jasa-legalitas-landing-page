import type { Metadata } from 'next';
import { ResetPasswordForm } from './_components/reset-password-form';

export const metadata: Metadata = {
  title: 'Atur ulang password',
  description: 'Masukkan kode dari email dan password baru.',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
