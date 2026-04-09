"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Input } from "@/components/ui/input";
import { EASE } from "@/lib/types/constants";
import { postBlogSubscriberSubscribe } from "@/lib/api/endpoints/blog";
import { hasPublicApiBaseUrl } from "@/lib/api/client";
import { ApiError } from "@/lib/types/api";

function firstFieldError(errors: Record<string, string[] | boolean> | undefined, key: string): string | undefined {
  const value = errors?.[key];
  if (Array.isArray(value) && value[0]) return value[0];
  return undefined;
}

export function BlogNewsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const apiAvailable = hasPublicApiBaseUrl();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    if (!apiAvailable) {
      setFormError("Layanan belum dikonfigurasi. Periksa NEXT_PUBLIC_API_URL pada environment.");
      return;
    }

    setLoading(true);
    setFormError(null);
    setFieldErrors({});
    try {
      await postBlogSubscriberSubscribe({ email: email.trim() });
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        const emailErr = firstFieldError(err.errors, "email");
        const nameErr = firstFieldError(err.errors, "name");
        const next: Record<string, string> = {};
        if (emailErr) next.email = emailErr;
        if (nameErr) next.name = nameErr;
        setFieldErrors(next);
      } else {
        setFormError("Gagal mendaftar. Silakan coba lagi.");
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
            <p
              className="mt-4 text-sm text-emerald-700 bg-emerald-500/10 border border-emerald-600/25 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-900/50 rounded-xl px-3 py-2.5 flex items-center gap-2"
              role="status"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden />
              Berhasil! Cek inbox Anda untuk link konfirmasi langganan.{" "}
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                className="text-sm underline underline-offset-2"
              >
                Daftarkan email lain?
              </button>
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-start">
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
                disabled={loading}
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
            </form>
          )}
        </motion.div>

        {formError && !submitted && (
          <p className="mt-4 text-sm text-destructive bg-destructive/10 border border-destructive/25 rounded-xl px-3 py-2.5 flex items-center gap-2" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
            {formError}
          </p>
        )}

        <p className="text-xs font-semibold text-gray-400">Gratis. Bisa unsubscribe kapan saja. Tidak ada spam.</p>
      </div>
    </section>
  );
}
