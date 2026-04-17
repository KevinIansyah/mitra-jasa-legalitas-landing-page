"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
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

const GENERIC_FORGOT_PASSWORD_MESSAGE = "Jika email terdaftar, kode OTP sudah dikirim. Cek inbox.";

export function LupaPasswordForm() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const { cooldown, handleRateLimit } = useAuthSubmitCooldown();
  const { resolvedTheme } = useTheme();
  const turnstileRef = useRef<TurnstileRef>(null);
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string }>({});
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
    if (!turnstileToken) {
      toast.error("Selesaikan verifikasi CAPTCHA terlebih dahulu.");
      return;
    }
    setLoading(true);
    try {
      const response = await forgotPassword(email, turnstileToken);
      const successMessage = response?.message?.trim() ? response.message : GENERIC_FORGOT_PASSWORD_MESSAGE;
      toast.success(successMessage);
      router.push("/reset-password");
    } catch (err) {
      resetTurnstile();
      if (handleRateLimit(err)) {
        setLoading(false);
        return;
      }
      if (isTurnstileValidationError(err)) {
        toast.error(getTurnstileErrorMessage(err) ?? "Verifikasi CAPTCHA gagal. Silakan coba lagi.");
      } else if (err instanceof ApiError) {
        if (err.status === 422) {
          setFieldErrors({ email: getFieldError(err, "email") });
        }
        toast.error(err.message);
      } else {
        toast.error("Tidak dapat terhubung. Periksa koneksi internet Anda.");
      }
    } finally {
      setLoading(false);
    }
  }

  const submitDisabled = loading || cooldown > 0 || !turnstileToken;

  return (
    <div className="w-full max-w-[400px] mx-auto flex flex-col items-stretch">
      <Image src="/auth-logo.png" alt="" width={100} height={100} className="mx-auto mb-6 max-h-12 w-auto max-w-12 object-contain" priority />

      <h1 className="text-center text-xl sm:text-2xl font-bold text-foreground tracking-tight">Lupa password</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">Masukkan email akun Anda. Kami akan mengirimkan kode OTP untuk mengatur ulang password.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
            className={cn(authInputClass, fieldErrors.email && "border-destructive")}
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email ? <p className="text-xs text-destructive">{fieldErrors.email}</p> : null}
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
              Mengirim...
            </>
          ) : cooldown > 0 ? (
            `Coba lagi dalam ${cooldown}s`
          ) : (
            "Kirim"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Ingat password Anda?{" "}
        <Link href="/masuk" className="text-sm font-medium text-foreground/90 underline underline-offset-4 hover:text-foreground">
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
