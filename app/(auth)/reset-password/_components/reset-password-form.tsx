"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth, otpSession } from "@/hooks/use-auth";
import { useAuthSubmitCooldown } from "@/hooks/use-auth-submit-cooldown";
import { ApiError } from "@/lib/types/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND_BLUE } from "@/lib/types/constants";
import { cn } from "@/lib/utils";
import { authInputClass } from "@/app/(auth)/_components/auth-input-class";
import { getFieldError, maskEmailForDisplay } from "@/app/(auth)/_components/auth-api-error";
import { OtpInputSix } from "../../_components/otp-input-six";

export function ResetPasswordForm() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const { cooldown, handleRateLimit } = useAuthSubmitCooldown();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    otp?: string;
    password?: string;
    password_confirmation?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const e = otpSession.getEmail();
    if (!e) {
      router.replace("/lupa-password");
      return;
    }
    setEmail(e);
    setReady(true);
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    const code = otp.replace(/\D/g, "").slice(0, 8);
    if (code.length < 4) {
      toast.error("Masukkan kode OTP yang valid.");
      return;
    }
    if (password !== passwordConfirmation) {
      toast.error("Konfirmasi password tidak sama.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(code, password, passwordConfirmation);
      router.push("/masuk");
    } catch (err) {
      if (handleRateLimit(err)) {
        setLoading(false);
        return;
      }
      if (err instanceof ApiError) {
        toast.error(err.message);
        setFieldErrors({
          otp: getFieldError(err, "otp"),
          password: getFieldError(err, "password"),
          password_confirmation: getFieldError(err, "password_confirmation"),
        });
      } else {
        toast.error("Gagal mengatur ulang password. Coba lagi.");
      }
    } finally {
      setLoading(false);
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
      <Image src="/auth-logo.png" alt="" width={100} height={100} className="mx-auto mb-6 max-h-12 w-auto max-w-12 object-contain" priority />

      <h1 className="text-center text-xl sm:text-2xl font-bold text-foreground tracking-tight">Password baru</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Kode dikirim ke <span className="font-medium text-foreground">{maskEmailForDisplay(email)}</span>. Masukkan kode dan password baru Anda.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="verify-otp" className="text-xs text-muted-foreground">
            Kode OTP (6 digit)
          </Label>
          <OtpInputSix id="verify-otp" value={otp} onChange={(next) => setOtp(next.replace(/\D/g, "").slice(0, 6))} disabled={loading} hasError={Boolean(fieldErrors.otp)} />
          {fieldErrors.otp ? <p className="text-xs text-destructive">{fieldErrors.otp}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reset-password" className="text-xs text-muted-foreground">
            Password baru
          </Label>
          <div className="relative">
            <Input
              id="reset-password"
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
          <Label htmlFor="reset-password2" className="text-xs text-muted-foreground">
            Konfirmasi password
          </Label>
          <div className="relative">
            <Input
              id="reset-password2"
              name="password_confirmation"
              type={showPassword2 ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Ulangi password baru"
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

        <button
          type="submit"
          disabled={loading || cooldown > 0}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 mt-1"
          style={{ backgroundColor: BRAND_BLUE }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden />
              Menyimpan...
            </>
          ) : cooldown > 0 ? (
            `Coba lagi dalam ${cooldown}s`
          ) : (
            "Simpan password"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Ingat password?{" "}
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
