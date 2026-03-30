'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth, otpSession } from '@/hooks/use-auth';
import { ApiError } from '@/lib/types/api';
import { Label } from '@/components/ui/label';
import { BRAND_BLUE } from '@/lib/types/constants';
import { OtpInputSix } from '@/app/(auth)/_components/otp-input-six';
import {
  getFieldError,
  maskEmailForDisplay,
} from '@/app/(auth)/_components/auth-api-error';

export function VerifyOtpForm() {
  const router = useRouter();
  const { verifyOtp, resendOtp } = useAuth();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [otpFieldError, setOtpFieldError] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const e = otpSession.getEmail();
    if (!e) {
      router.replace('/daftar');
      return;
    }
    setEmail(e);
    setReady(true);
  }, [router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => {
      setResendCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setOtpFieldError(null);
    const code = otp.replace(/\D/g, '').slice(0, 6);
    if (code.length !== 6) {
      setFormError('Masukkan 6 digit kode OTP.');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(code);
      router.refresh();
      router.push('/portal');
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        setOtpFieldError(getFieldError(err, 'otp') ?? null);
      } else {
        setFormError('Terjadi kesalahan. Coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0 || resendLoading) return;
    setResendError(null);
    setResendSuccess(null);
    setResendLoading(true);
    try {
      const res = await resendOtp();
      setResendSuccess(
        res != null && typeof res.message === 'string'
          ? res.message
          : 'Kode baru telah dikirim. Periksa email Anda.',
      );
      setResendCooldown(60);
    } catch (err) {
      if (err instanceof ApiError) {
        setResendError(err.message);
      } else {
        setResendError('Gagal mengirim ulang. Coba lagi.');
      }
    } finally {
      setResendLoading(false);
    }
  }

  if (!ready || !email) {
    return (
      <div className="w-full max-w-[400px] mx-auto flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px] mx-auto flex flex-col items-stretch">
      <Image
        src="/auth-logo.png"
        alt=""
        width={100}
        height={100}
        className="mx-auto mb-6 max-h-12 w-auto max-w-12 object-contain"
        priority
      />

      <h1 className="text-center text-xl sm:text-2xl font-bold text-foreground tracking-tight">
        Verifikasi email
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Kode OTP telah dikirim ke{' '}
        <span className="font-medium text-foreground">
          {maskEmailForDisplay(email)}
        </span>
        . Periksa kotak masuk atau spam.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {formError ? (
          <p
            className="text-sm text-destructive bg-destructive/10 border border-destructive/25 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-400 rounded-xl px-3 py-2.5 flex items-center gap-2"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
            {formError}
          </p>
        ) : null}

        <div className="space-y-1.5">
          <Label htmlFor="verify-otp" className="text-xs text-muted-foreground">
            Kode OTP (6 digit)
          </Label>
          <OtpInputSix
            id="verify-otp"
            value={otp}
            onChange={(next) => setOtp(next.replace(/\D/g, '').slice(0, 6))}
            disabled={loading}
            hasError={Boolean(otpFieldError)}
          />
          {otpFieldError ? (
            <p className="text-xs text-destructive">{otpFieldError}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 mt-1"
          style={{ backgroundColor: BRAND_BLUE }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden />
              Memverifikasi…
            </>
          ) : (
            'Verifikasi'
          )}
        </button>
      </form>

      {resendSuccess ? (
        <p
          className="mt-4 text-sm text-emerald-700 bg-emerald-500/10 border border-emerald-600/25 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-900/50 rounded-xl px-3 py-2.5 flex items-center gap-2"
          role="status"
        >
          <CheckCircle className="w-4 h-4 shrink-0" aria-hidden />
          {resendSuccess}
        </p>
      ) : null}

      {resendError ? (
        <p
          className="mt-4 text-sm text-destructive bg-destructive/10 border border-destructive/25 rounded-xl px-3 py-2.5 flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
          {resendError}
        </p>
      ) : null}

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading || resendCooldown > 0}
          className="text-sm font-medium text-foreground/90 underline underline-offset-4 hover:text-foreground disabled:opacity-50 disabled:no-underline"
        >
          {resendLoading
            ? 'Mengirim…'
            : resendCooldown > 0
              ? `Kirim ulang (${resendCooldown}s)`
              : 'Kirim ulang kode'}
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Salah email?{' '}
        <Link
          href="/daftar"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Daftar ulang
        </Link>
      </p>

      <p className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden /> Kembali ke beranda
        </Link>
      </p>
    </div>
  );
}
