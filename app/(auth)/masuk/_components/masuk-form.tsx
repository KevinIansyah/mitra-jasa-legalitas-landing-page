'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { r2Loader } from '@/lib/r2-loader';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { ApiError } from '@/lib/types/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BRAND_BLUE } from '@/lib/types/constants';
import { cn } from '@/lib/utils';
import { authInputClass } from '@/app/(auth)/_components/auth-input-class';
import { getFieldError } from '@/app/(auth)/_components/auth-api-error';

export function MasukForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setLoading(true);
    try {
      const result = await login(email, password, rememberMe);
      if (result) {
        router.refresh();
        router.push('/portal');
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        setFieldErrors({
          email: getFieldError(err, 'email'),
          password: getFieldError(err, 'password'),
        });
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
        loader={r2Loader}
        src="/auth-logo.png"
        alt=""
        width={100}
        height={100}
        className="mx-auto mb-6 max-h-12 w-auto max-w-12 object-contain"
        priority
      />

      <h1 className="text-center text-xl sm:text-2xl font-bold text-foreground tracking-tight">
        Selamat datang di Mitra Jasa Legalitas
      </h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {formError ? (
          <p
            className="text-sm text-destructive bg-destructive/10 border border-destructive/25 rounded-xl px-3 py-2.5 flex items-center gap-2"
            role="alert"
          >
            <AlertCircle className="w-4 h-4" aria-hidden />
            {formError}
          </p>
        ) : null}

        <div className="space-y-1.5">
          <Label
            htmlFor="masuk-email"
            className="text-xs text-muted-foreground"
          >
            Email
          </Label>
          <Input
            id="masuk-email"
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

        <div className="space-y-1.5">
          <Label
            htmlFor="masuk-password"
            className="text-xs text-muted-foreground"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="masuk-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={cn(
                authInputClass,
                'pr-11',
                fieldErrors.password && 'border-destructive',
              )}
              aria-invalid={Boolean(fieldErrors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label={
                showPassword ? 'Sembunyikan password' : 'Tampilkan password'
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
          {fieldErrors.password ? (
            <p className="text-xs text-destructive">{fieldErrors.password}</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground select-none group">
            <input
              type="checkbox"
              name="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="peer sr-only"
            />
            <div
              className={cn(
                'min-w-4 min-h-4 rounded-[4px] border flex items-center justify-center transition-all',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-ring/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
                rememberMe
                  ? 'border-transparent'
                  : 'border-gray-300 dark:border-white/20',
              )}
              style={
                rememberMe
                  ? {
                      backgroundColor: BRAND_BLUE,
                      borderColor: BRAND_BLUE,
                    }
                  : {}
              }
            >
              {rememberMe && (
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="none"
                  viewBox="0 0 12 12"
                  aria-hidden
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className="group-hover:text-foreground transition-colors">
              Ingat saya
            </span>
          </label>
          <Link
            href="/lupa-password"
            className="text-sm font-medium text-foreground/90 underline underline-offset-4 hover:text-foreground"
          >
            Lupa password?
          </Link>
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
              Memproses...
            </>
          ) : (
            'Masuk'
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Belum punya akun?{' '}
        <Link
          href="/daftar"
          className="font-medium text-foreground underline underline-offset-4 hover:opacity-90"
        >
          Daftar
        </Link>
      </p>

      <p className="mt-8 text-center text-[11px] font-medium leading-relaxed text-muted-foreground">
        Dengan melanjutkan, Anda menyetujui{' '}
        <Link
          href="/tentang"
          className="underline underline-offset-2 hover:text-foreground"
        >
          ketentuan layanan
        </Link>{' '}
        dan{' '}
        <Link
          href="/kontak"
          className="underline underline-offset-2 hover:text-foreground"
        >
          kebijakan privasi
        </Link>{' '}
        kami.
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
