'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { ApiError } from '@/lib/types/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BRAND_BLUE } from '@/lib/types/service';
import { cn } from '@/lib/utils';
import { authInputClass } from '@/app/(auth)/_components/auth-input-class';
import { getFieldError } from '@/app/(auth)/_components/auth-api-error';

export function LupaPasswordForm() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string }>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setLoading(true);
    try {
      await forgotPassword(email);
      router.push('/reset-password');
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        setFieldErrors({ email: getFieldError(err, 'email') });
      } else {
        setFormError(
          'Tidak dapat terhubung. Periksa koneksi internet Anda.',
        );
      }
    } finally {
      setLoading(false);
    }
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
        Lupa password
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Masukkan email akun Anda. Kami akan mengirimkan tautan atau kode untuk
        mengatur ulang password.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {formError ? (
          <p
            className="text-sm text-destructive bg-destructive/10 border border-destructive/25 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-400 rounded-xl px-3 py-2.5 flex items-center gap-2"
            role="alert"
          >
            <AlertCircle className="w-4 h-4" aria-hidden />
            {formError}
          </p>
        ) : null}

        <div className="space-y-1.5">
          <Label htmlFor="lupa-email" className="text-xs text-muted-foreground">
            Email
          </Label>
          <Input
            id="lupa-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className={cn(
              authInputClass,
              fieldErrors.email && 'border-destructive',
            )}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email ? (
            <p className="text-xs text-destructive">{fieldErrors.email}</p>
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
              Mengirim…
            </>
          ) : (
            'Kirim'
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Ingat password Anda?{' '}
        <Link
          href="/masuk"
          className="text-sm font-medium text-foreground/90 underline underline-offset-4 hover:text-foreground"
        >
          Masuk
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
