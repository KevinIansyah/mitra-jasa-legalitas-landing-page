"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth, otpSession } from "@/hooks/use-auth";
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

function looksLikeEmailAlreadyRegistered(err: ApiError): boolean {
  if (err.status !== 422) return false;
  const rawFieldError = err.errors?.email;
  const emailFieldMessages = Array.isArray(rawFieldError) ? rawFieldError.map((v) => String(v).toLowerCase()) : [];
  const allMessages = [err.message.toLowerCase(), ...emailFieldMessages];
  return allMessages.some((m) => m.includes("sudah terdaftar"));
}

export function DaftarForm() {
  const router = useRouter();
  const { register } = useAuth();
  const { cooldown, handleRateLimit } = useAuthSubmitCooldown();
  const { resolvedTheme } = useTheme();
  const turnstileRef = useRef<TurnstileRef>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    password_confirmation?: string;
  }>({});
  const [emailAlreadyRegistered, setEmailAlreadyRegistered] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [loading, setLoading] = useState(false);

  const turnstileTheme = resolvedTheme === "dark" ? "dark" : "light";

  function resetTurnstile() {
    turnstileRef.current?.reset();
    setTurnstileToken("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setEmailAlreadyRegistered(false);
    if (password !== passwordConfirmation) {
      toast.error("Konfirmasi password tidak sama.");
      return;
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      toast.error("Masukkan nomor ponsel yang valid (10-15 digit).");
      return;
    }
    if (!turnstileToken) {
      toast.error("Selesaikan verifikasi CAPTCHA terlebih dahulu.");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, phoneDigits, password, passwordConfirmation, turnstileToken);
      router.push("/verify-otp");
    } catch (err) {
      resetTurnstile();
      if (handleRateLimit(err)) {
        return;
      }
      if (isTurnstileValidationError(err)) {
        toast.error(getTurnstileErrorMessage(err) ?? "Verifikasi CAPTCHA gagal. Silakan coba lagi.");
        return;
      }
      if (err instanceof ApiError) {
        const alreadyRegistered = looksLikeEmailAlreadyRegistered(err);
        toast.error(err.message);
        setFieldErrors({
          name: getFieldError(err, "name"),
          email: getFieldError(err, "email") ?? (alreadyRegistered ? err.message : undefined),
          phone: getFieldError(err, "phone"),
          password: getFieldError(err, "password"),
          password_confirmation: getFieldError(err, "password_confirmation"),
        });
        setEmailAlreadyRegistered(alreadyRegistered);
      } else {
        toast.error("Pendaftaran gagal. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleGoToResendOtp() {
    const trimmed = email.trim();
    if (!trimmed) return;
    otpSession.setEmail(trimmed);
    router.push("/verify-otp");
  }

  const submitDisabled = loading || cooldown > 0 || !turnstileToken;

  return (
    <div className="w-full max-w-[400px] mx-auto flex flex-col items-stretch">
      <Image src="/auth-logo.png" alt="Logo Mitra Jasa Legalitas" width={100} height={100} className="mx-auto mb-6 max-h-12 w-auto max-w-12 object-contain" priority />

      <h1 className="text-center text-xl sm:text-2xl font-bold text-foreground tracking-tight">Buat akun</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Isi data berikut. Kami akan mengirim kode verifikasi ke email Anda.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="daftar-nama" className="text-xs text-muted-foreground">
            Nama lengkap
          </Label>
          <Input
            id="daftar-nama"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Anda"
            className={cn(authInputClass, fieldErrors.name && "border-destructive")}
            aria-invalid={Boolean(fieldErrors.name)}
          />
          {fieldErrors.name ? <p className="text-xs text-destructive">{fieldErrors.name}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="daftar-email" className="text-xs text-muted-foreground">
            Email
          </Label>
          <Input
            id="daftar-email"
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
          {emailAlreadyRegistered ? (
            <div className="mt-2 flex flex-col gap-1.5 rounded-xl border border-border/60 bg-muted/40 pt-2 pb-4 px-3 text-xs text-muted-foreground">
              <p>Sepertinya email ini sudah punya akun di sistem kami.</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <Link href="/masuk" className="font-medium text-foreground underline underline-offset-4 hover:opacity-90">
                  Sudah terdaftar? Masuk
                </Link>
                <span aria-hidden className="text-muted-foreground/60">
                  /
                </span>
                <button
                  type="button"
                  onClick={handleGoToResendOtp}
                  disabled={!email.trim()}
                  className="font-medium text-foreground underline underline-offset-4 hover:opacity-90 disabled:opacity-50 disabled:no-underline"
                >
                  Belum verifikasi? Kirim ulang kode OTP
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="daftar-phone" className="text-xs text-muted-foreground">
            Nomor ponsel
          </Label>
          <Input
            id="daftar-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            required
            value={phone}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 15);
              setPhone(v);
            }}
            placeholder="628xxxxxxxxxx"
            className={cn(authInputClass, fieldErrors.phone && "border-destructive")}
            aria-invalid={Boolean(fieldErrors.phone)}
          />
          {fieldErrors.phone ? <p className="text-xs text-destructive">{fieldErrors.phone}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="daftar-password" className="text-xs text-muted-foreground">
            Password
          </Label>
          <div className="relative">
            <Input
              id="daftar-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
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

        <div className="space-y-1.5">
          <Label htmlFor="daftar-password2" className="text-xs text-muted-foreground">
            Konfirmasi password
          </Label>
          <div className="relative">
            <Input
              id="daftar-password2"
              name="password_confirmation"
              type={showPassword2 ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Ulangi password"
              className={cn(authInputClass, "pr-11", fieldErrors.password_confirmation && "border-destructive")}
              aria-invalid={Boolean(fieldErrors.password_confirmation)}
            />
            <button
              type="button"
              onClick={() => setShowPassword2((v) => !v)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label={showPassword2 ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword2 ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
            </button>
          </div>
          {fieldErrors.password_confirmation ? <p className="text-xs text-destructive">{fieldErrors.password_confirmation}</p> : null}
        </div>

        <div className="flex justify-center">
          <TurnstileWidget
            ref={turnstileRef}
            theme={turnstileTheme}
            onVerify={setTurnstileToken}
            onExpire={() => setTurnstileToken("")}
            onError={() => setTurnstileToken("")}
          />
        </div>

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
            "Daftar"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-medium text-foreground underline underline-offset-4 hover:opacity-90">
          Masuk
        </Link>
      </p>

      <p className="mt-6 text-center">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" aria-hidden /> Kembali ke beranda
        </Link>
      </p>
    </div>
  );
}
