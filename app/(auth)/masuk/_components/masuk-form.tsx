"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAuthSubmitCooldown } from "@/hooks/use-auth-submit-cooldown";
import { ApiError } from "@/lib/types/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND_BLUE } from "@/lib/types/constants";
import { cn } from "@/lib/utils";
import { authInputClass } from "@/app/(auth)/_components/auth-input-class";
import {
  getFieldError,
  getTurnstileErrorMessage,
  isTurnstileValidationError,
} from "@/app/(auth)/_components/auth-api-error";
import { TurnstileWidget, TurnstileRef } from "@/components/common/turnstile-widget";

const LOGIN_CAPTCHA_FAIL_THRESHOLD = 1;

export function MasukForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { cooldown, handleRateLimit } = useAuthSubmitCooldown();
  const { resolvedTheme } = useTheme();
  const turnstileRef = useRef<TurnstileRef>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [requireCaptcha, setRequireCaptcha] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const failedCountRef = useRef(0);

  const turnstileTheme = resolvedTheme === "dark" ? "dark" : "light";

  function resetTurnstile() {
    turnstileRef.current?.reset();
    setTurnstileToken("");
  }

  function resetCaptchaState() {
    failedCountRef.current = 0;
    setRequireCaptcha(false);
    setTurnstileToken("");
    turnstileRef.current?.reset();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    if (requireCaptcha && !turnstileToken) {
      toast.error("Selesaikan verifikasi CAPTCHA terlebih dahulu.");
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, password, rememberMe, requireCaptcha ? turnstileToken : undefined);
      if (result) {
        resetCaptchaState();
        router.refresh();
        router.push("/portal");
      }
    } catch (err) {
      resetTurnstile();
      if (handleRateLimit(err)) {
        setRequireCaptcha(true);
        setLoading(false);
        return;
      }
      if (isTurnstileValidationError(err)) {
        toast.error(getTurnstileErrorMessage(err) ?? "Verifikasi CAPTCHA gagal. Silakan coba lagi.");
        setLoading(false);
        return;
      }
      if (err instanceof ApiError) {
        toast.error(err.message);
        setFieldErrors({
          email: getFieldError(err, "email"),
          password: getFieldError(err, "password"),
        });
        if (err.status === 401) {
          failedCountRef.current += 1;
          if (failedCountRef.current >= LOGIN_CAPTCHA_FAIL_THRESHOLD) {
            setRequireCaptcha(true);
          }
        }
      } else {
        toast.error("Tidak dapat terhubung. Periksa koneksi internet Anda.");
      }
    } finally {
      setLoading(false);
    }
  }

  const submitDisabled = loading || cooldown > 0 || (requireCaptcha && !turnstileToken);

  return (
    <div className="w-full max-w-[400px] mx-auto flex flex-col items-stretch">
      <Image src="/auth-logo.png" alt="" width={100} height={100} className="mx-auto mb-6 max-h-12 w-auto max-w-12 object-contain" priority />

      <h1 className="text-center text-xl sm:text-2xl font-bold text-foreground tracking-tight">Selamat datang di Mitra Jasa Legalitas</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="masuk-email" className="text-xs text-muted-foreground">
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
            className={cn(authInputClass, fieldErrors.email && "border-destructive")}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email ? <p className="text-xs text-destructive">{fieldErrors.email}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="masuk-password" className="text-xs text-muted-foreground">
            Password
          </Label>
          <div className="relative">
            <Input
              id="masuk-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={cn(authInputClass, "pr-11", fieldErrors.password && "border-destructive")}
              aria-invalid={Boolean(fieldErrors.password)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
            </button>
          </div>
          {fieldErrors.password ? <p className="text-xs text-destructive">{fieldErrors.password}</p> : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted-foreground select-none group">
            <input type="checkbox" name="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="peer sr-only" />
            <div
              className={cn(
                "min-w-4 min-h-4 rounded-[4px] border flex items-center justify-center transition-all",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-ring/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
                rememberMe ? "border-transparent" : "border-gray-300 dark:border-white/20",
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
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12" aria-hidden>
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="group-hover:text-foreground transition-colors">Ingat saya</span>
          </label>
          <Link href="/lupa-password" className="text-sm font-medium text-foreground/90 underline underline-offset-4 hover:text-foreground">
            Lupa password?
          </Link>
        </div>

        {requireCaptcha ? (
          <div className="flex justify-center">
            <TurnstileWidget
              ref={turnstileRef}
              theme={turnstileTheme}
              onVerify={setTurnstileToken}
              onExpire={() => setTurnstileToken("")}
              onError={() => setTurnstileToken("")}
            />
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitDisabled}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 mt-1"
          style={{ backgroundColor: BRAND_BLUE }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden />
              Memproses...
            </>
          ) : cooldown > 0 ? (
            `Coba lagi dalam ${cooldown}s`
          ) : (
            "Masuk"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-medium text-foreground underline underline-offset-4 hover:opacity-90">
          Daftar
        </Link>
      </p>

      <p className="mt-8 text-center text-[11px] font-medium leading-relaxed text-muted-foreground">
        Dengan melanjutkan, Anda menyetujui{" "}
        <Link href="/syarat-ketentuan-layanan" className="underline underline-offset-2 hover:text-foreground">
          Syarat dan Ketentuan Layanan
        </Link>{" "}
        dan{" "}
        <Link href="/kebijakan-privasi" className="underline underline-offset-2 hover:text-foreground">
          Kebijakan Privasi
        </Link>{" "}
        kami.
      </p>

      <p className="mt-6 text-center">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" aria-hidden /> Kembali ke beranda
        </Link>
      </p>
    </div>
  );
}
