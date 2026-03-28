import type { Metadata } from 'next';
import { VerifyOtpForm } from './_components/verify-otp-form';

export const metadata: Metadata = {
  title: 'Verifikasi email',
  description: 'Masukkan kode OTP yang dikirim ke email Anda.',
};

export default function VerifyOtpPage() {
  return <VerifyOtpForm />;
}
