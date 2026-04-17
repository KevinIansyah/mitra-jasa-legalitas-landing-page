"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Input } from "@/components/ui/input";
import { EASE } from "@/lib/types/constants";
import { postBlogSubscriberSubscribe } from "@/lib/api/endpoints/blog";
import { hasPublicApiBaseUrl } from "@/lib/api/client";
import { ApiError } from "@/lib/types/api";
import { TurnstileWidget, TurnstileRef } from "@/components/common/turnstile-widget";
import { getTurnstileErrorMessage, isTurnstileValidationError } from "@/lib/api/turnstile-error";

function firstFieldError(errors: Record<string, string[] | boolean> | undefined, key: string): string | undefined {
  const value = errors?.[key];
  if (Array.isArray(value) && value[0]) return value[0];
  return undefined;
}

const DEFAULT_SUCCESS_MESSAGE = "Terima kasih! Jika email Anda valid, silakan cek inbox untuk konfirmasi langganan.";

export function BlogNewsletter() {
  const { resolvedTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>(DEFAULT_SUCCESS_MESSAGE);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileRef>(null);

  const apiAvailable = hasPublicApiBaseUrl();
  const turnstileTheme = resolvedTheme === "dark" ? "dark" : "light";

  function resetTurnstile() {
    turnstileRef.current?.reset();
    setTurnstileToken("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    if (!apiAvailable) {
      toast.error("Layanan belum dikonfigurasi. Periksa NEXT_PUBLIC_API_URL pada environment.");
      return;
    }
    if (!turnstileToken) {
      toast.error("Selesaikan verifikasi CAPTCHA terlebih dahulu.");
      return;
    }

    setLoading(true);
    setFieldErrors({});
    try {
      const response = await postBlogSubscriberSubscribe({
        email: email.trim(),
        website: honeypot,
        cf_turnstile_token: turnstileToken,
      });
      setSuccessMessage(response?.message?.trim() || DEFAULT_SUCCESS_MESSAGE);
      setSubmitted(true);
      resetTurnstile();
    } catch (err) {
      resetTurnstile();
      if (err instanceof ApiError) {
        if (isTurnstileValidationError(err)) {
          toast.error(getTurnstileErrorMessage(err) ?? "Verifikasi keamanan gagal. Silakan coba lagi.");
        } else {
          toast.error(err.message);
          const emailErr = firstFieldError(err.errors, "email");
          const nameErr = firstFieldError(err.errors, "name");
          const next: Record<string, string> = {};
          if (emailErr) next.email = emailErr;
          if (nameErr) next.name = nameErr;
          setFieldErrors(next);
        }
      } else {
        toast.error("Gagal mendaftar. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="newsletter" className="py-16 lg:py-20 bg-gray-50 dark:bg-surface-subtle">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, ease: EASE }} className="space-y-3">
          <SectionHeading
            badge="Newsletter"
            title={
              <>
                Dapatkan Tips Legalitas Bisnis
                <br className="hidden sm:block" />
                <span style={{ color: "oklch(0.7319 0.1856 52.89)" }}>Langsung di Inbox Anda</span>
              </>
            }
            description="Bergabung dengan 10.000+ pengusaha yang sudah berlangganan. Kami kirim ringkasan artikel & update regulasi setiap minggu."
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, delay: 0.15, ease: EASE }}>
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-5 h-full py-16 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "oklch(0.55 0.15 160 / 0.1)" }}>
                <CheckCircle2 className="size-8" style={{ color: "oklch(0.55 0.15 160)" }} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Email terdaftar!</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                  {successMessage}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setEmail("");
                      setSuccessMessage(DEFAULT_SUCCESS_MESSAGE);
                    }}
                    className="underline underline-offset-2"
                  >
                    Daftarkan email lain?
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex flex-1 flex-col gap-1.5 text-left">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={loading}
                    placeholder="alamat@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? "newsletter-email-error" : undefined}
                    className="flex-1 py-3 px-4 h-11 rounded-full border border-input bg-white dark:bg-white/5 text-sm shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20"
                  />
                  {fieldErrors.email && (
                    <p id="newsletter-email-error" className="px-3 text-xs text-destructive">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading || !turnstileToken}
                  className="inline-flex shrink-0 items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-60"
                  style={{ backgroundColor: "oklch(0.3811 0.1315 260.22)" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    "Langganan Sekarang"
                  )}
                </button>
              </div>

              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: "1px",
                  height: "1px",
                  opacity: 0,
                  pointerEvents: "none",
                }}
                aria-hidden="true"
              />

              <div className="flex justify-center">
                <TurnstileWidget ref={turnstileRef} theme={turnstileTheme} onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} onError={() => setTurnstileToken("")} />
              </div>
            </form>
          )}
        </motion.div>

        <p className="text-xs font-semibold text-gray-400">Gratis. Bisa unsubscribe kapan saja. Tidak ada spam.</p>
      </div>
    </section>
  );
}
