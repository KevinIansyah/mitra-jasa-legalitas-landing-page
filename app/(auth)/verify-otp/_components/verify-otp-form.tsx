"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuth, otpSession } from "@/hooks/use-auth";
import { useAuthSubmitCooldown } from "@/hooks/use-auth-submit-cooldown";
import { ApiError } from "@/lib/types/api";
import { Label } from "@/components/ui/label";
import { BRAND_BLUE } from "@/lib/types/constants";
import { OtpInputSix } from "@/app/(auth)/_components/otp-input-six";
import {
  getFieldError,
  getTurnstileErrorMessage,
  isTurnstileValidationError,
  maskEmailForDisplay,
} from "@/app/(auth)/_components/auth-api-error";
import { TurnstileWidget, TurnstileRef } from "@/components/common/turnstile-widget";

const RESEND_COOLDOWN_SECONDS = 30;
const GENERIC_RESEND_MESSAGE = "Kode OTP baru telah dikirim jika email terdaftar dan belum terverifikasi.";

export function VerifyOtpForm() {
  const router = useRouter();
  const { verifyOtp, resendOtp } = useAuth();
  const { cooldown: submitCooldown, handleRateLimit: handleSubmitRateLimit } = useAuthSubmitCooldown();
  const { cooldown: resendCooldown, startCooldown: startResendCooldown, handleRateLimit: handleResendRateLimit } = useAuthSubmitCooldown();
  const { resolvedTheme } = useTheme();
  const turnstileRef = useRef<TurnstileRef>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [otpFieldError, setOtpFieldError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const turnstileTheme = resolvedTheme === "dark" ? "dark" : "light";

  function resetTurnstile() {
    turnstileRef.current?.reset();
    setTurnstileToken("");
  }

  useEffect(() => {
    const e = otpSession.getEmail();
    if (!e) {
      router.replace("/daftar");
      return;
    }
    setEmail(e);
    setReady(true);
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOtpFieldError(null);
    const code = otp.replace(/\D/g, "").slice(0, 6);
    if (code.length !== 6) {
      toast.error("Masukkan 6 digit kode OTP.");
      return;
    }
    setLoading(true);
    try {
      await verifyOtp(code);
      router.refresh();
      router.push("/portal");
    } catch (err) {
      if (handleSubmitRateLimit(err)) {
        setLoading(false);
        return;
      }
      if (err instanceof ApiError) {
        toast.error(err.message);
        setOtpFieldError(getFieldError(err, "otp") ?? null);
      } else {
        toast.error("Terjadi kesalahan. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCooldown > 0 || resendLoading) return;
    if (!turnstileToken) {
      toast.error("Selesaikan verifikasi CAPTCHA terlebih dahulu.");
      return;
    }
    setResendLoading(true);
    try {
      await resendOtp(undefined, turnstileToken);
      resetTurnstile();
      toast.success(GENERIC_RESEND_MESSAGE);
      startResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      resetTurnstile();
      if (handleResendRateLimit(err)) {
        setResendLoading(false);
        return;
      }
      if (isTurnstileValidationError(err)) {
        toast.error(getTurnstileErrorMessage(err) ?? "Verifikasi CAPTCHA gagal. Silakan coba lagi.");
      } else if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Gagal mengirim ulang. Coba lagi.");
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

  const submitDisabled = loading || submitCooldown > 0;
  const resendDisabled = resendLoading || resendCooldown > 0 || !turnstileToken;

  return (
    <div className="w-full max-w-[400px] mx-auto flex flex-col items-stretch">
      <Image src="/auth-logo.png" alt="Logo Mitra Jasa Legalitas" width={100} height={100} className="mx-auto mb-6 max-h-12 w-auto max-w-12 object-contain" priority />

      <h1 className="text-center text-xl sm:text-2xl font-bold text-foreground tracking-tight">Verifikasi email</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Kode OTP telah dikirim ke <span className="font-medium text-foreground">{maskEmailForDisplay(email)}</span>. Periksa kotak masuk atau spam.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="verify-otp" className="text-xs text-muted-foreground">
            Kode OTP (6 digit)
          </Label>
          <OtpInputSix id="verify-otp" value={otp} onChange={(next) => setOtp(next.replace(/\D/g, "").slice(0, 6))} disabled={loading} hasError={Boolean(otpFieldError)} />
          {otpFieldError ? <p className="text-xs text-destructive">{otpFieldError}</p> : null}
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
              Memverifikasi...
            </>
          ) : submitCooldown > 0 ? (
            `Coba lagi dalam ${submitCooldown}s`
          ) : (
            "Verifikasi"
          )}
        </button>
      </form>

      <div className="mt-8 border-t border-border/60 pt-6 flex flex-col items-center gap-3 text-center">
        <p className="text-xs text-muted-foreground">Belum menerima kode? Verifikasi CAPTCHA lalu klik kirim ulang.</p>
        <TurnstileWidget
          ref={turnstileRef}
          theme={turnstileTheme}
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
          onError={() => setTurnstileToken("")}
        />
        <button
          type="button"
          onClick={handleResend}
          disabled={resendDisabled}
          className="text-sm font-medium text-foreground/90 underline underline-offset-4 hover:text-foreground disabled:opacity-50 disabled:no-underline"
        >
          {resendLoading ? "Mengirim..." : resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : "Kirim ulang kode"}
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Salah email?{" "}
        <Link href="/daftar" className="font-medium text-foreground underline underline-offset-4">
          Daftar ulang
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
