"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { postContactMessage } from "@/lib/api/endpoints/contact-message";
import { ApiError } from "@/lib/types/api";
import type { CompanyInformationData } from "@/lib/types/company-information";
import { zoomOutGoogleMapsEmbedUrl } from "@/lib/google-maps-embed";
import { whatsappWaMeUrl } from "@/lib/whatsapp-cta";
import { EASE } from "@/lib/types/constants";
import { TurnstileWidget, TurnstileRef } from "@/components/common/turnstile-widget";
import { getTurnstileErrorMessage, isTurnstileValidationError } from "@/lib/api/turnstile-error";

const subjectOptions = ["Pendirian PT / CV", "Pendaftaran Merek", "NIB & Perizinan", "Akta Perubahan", "Konsultasi Hukum", "Lainnya"];

function formatPhoneDisplay(digits: string): string {
  const d = digits.replace(/\D/g, "");
  if (d.startsWith("62") && d.length > 2) {
    return `+62 ${d.slice(2)}`;
  }
  return digits;
}

function mapsSearchUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function telHrefFromPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("0")) return `tel:+62${d.slice(1)}`;
  if (d.startsWith("62")) return `tel:+${d}`;
  return `tel:+${d}`;
}

function firstFieldError(errors: Record<string, string[] | boolean> | undefined, key: string): string | undefined {
  const v = errors?.[key];
  if (Array.isArray(v) && v[0]) return v[0];
  return undefined;
}

interface FormState {
  name: string;
  whatsapp_number: string;
  email: string;
  topic: string;
  message: string;
}

const emptyForm: FormState = {
  name: "",
  whatsapp_number: "",
  email: "",
  topic: "",
  message: "",
};

type Props = {
  data: CompanyInformationData;
};

export function ContactSection({ data }: Props) {
  const { contact, address } = data;
  const { resolvedTheme } = useTheme();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const [honeypotWebsite, setHoneypotWebsite] = useState("");
  const [honeypotCompanyWebsite, setHoneypotCompanyWebsite] = useState("");
  const turnstileRef = useRef<TurnstileRef>(null);

  const turnstileTheme = resolvedTheme === "dark" ? "dark" : "light";

  function resetTurnstile() {
    turnstileRef.current?.reset();
    setTurnstileToken("");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubjectChange = (value: string) => setForm((p) => ({ ...p, topic: value === "none" ? "" : value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      toast.error("Selesaikan verifikasi CAPTCHA terlebih dahulu.");
      return;
    }
    setLoading(true);
    setFieldErrors({});
    try {
      await postContactMessage({
        name: form.name.trim(),
        whatsapp_number: form.whatsapp_number.trim(),
        email: form.email.trim() || null,
        topic: form.topic.trim() || null,
        message: form.message.trim(),
        cf_turnstile_token: turnstileToken,
        website: honeypotWebsite,
        company_website: honeypotCompanyWebsite,
      });
      setSubmitted(true);
      resetTurnstile();
    } catch (err) {
      resetTurnstile();
      if (err instanceof ApiError) {
        if (isTurnstileValidationError(err)) {
          toast.error(getTurnstileErrorMessage(err) ?? "Verifikasi keamanan gagal. Silakan coba lagi.");
        } else {
          toast.error(err.message);
          if (err.errors) {
            const next: Record<string, string> = {};
            for (const key of ["name", "whatsapp_number", "email", "topic", "message"] as const) {
              const msg = firstFieldError(err.errors, key);
              if (msg) next[key] = msg;
            }
            setFieldErrors(next);
          }
        }
      } else {
        toast.error("Gagal mengirim pesan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const embedSrc = address.maps_embed_url ? zoomOutGoogleMapsEmbedUrl(address.maps_embed_url, 4.5) : null;

  return (
    <section className="py-16 lg:py-20 bg-surface-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-5">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE }} className="flex flex-col gap-5">
            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 flex-1 min-h-[280px] bg-gray-100 dark:bg-white/5">
              {embedSrc ? (
                <iframe
                  src={embedSrc}
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi mitrajasalegalitas"
                  className="w-full h-full min-h-[280px]"
                />
              ) : (
                <div className="flex items-center justify-center h-[280px] text-sm text-gray-500">Peta belum tersedia.</div>
              )}
            </div>

            <div className="grid sm:grid-cols-3 gap-5 lg:gap-3">
              <a href={`mailto:${contact.email}`} className="blog-card group flex flex-col gap-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-card p-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: "oklch(0.3811 0.1315 260.22 / 0.08)",
                  }}
                >
                  <Mail className="w-4 h-4" style={{ color: "oklch(0.3811 0.1315 260.22)" }} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-400">Email</p>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 group-hover:text-brand-blue transition-colors wrap-break-word leading-snug">{contact.email}</p>
                  {contact.email_support && <p className="text-[10px] text-gray-400">Dukungan: {contact.email_support}</p>}
                </div>
              </a>

              <div className="blog-card flex flex-col gap-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-card p-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "oklch(0.55 0.15 160 / 0.1)" }}>
                  <Phone className="w-4 h-4" style={{ color: "oklch(0.55 0.15 160)" }} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-400">WhatsApp</p>
                  <a
                    href={whatsappWaMeUrl(contact.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-gray-800 dark:text-gray-100 hover:text-brand-blue transition-colors block"
                  >
                    {formatPhoneDisplay(contact.whatsapp)}
                  </a>
                  <a href={telHrefFromPhone(contact.phone)} className="text-xs font-semibold text-gray-400 mt-1 block hover:text-brand-blue">
                    Telp: {contact.phone}
                  </a>
                </div>
              </div>

              <a
                href={mapsSearchUrl(address.full)}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-card group flex flex-col gap-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-surface-card p-4"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: "oklch(0.7319 0.1856 52.89 / 0.1)",
                  }}
                >
                  <MapPin className="w-4 h-4" style={{ color: "oklch(0.7319 0.1856 52.89)" }} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-400">Alamat</p>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 group-hover:text-brand-blue transition-colors leading-snug line-clamp-4">{address.street || address.full}</p>
                </div>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="rounded-2xl border border-gray-200 dark:border-white/10 p-6 bg-white dark:bg-surface-card"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex flex-col items-center justify-center gap-5 h-full py-16 text-center"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "oklch(0.55 0.15 160 / 0.1)" }}>
                  <CheckCircle2 className="size-8" style={{ color: "oklch(0.55 0.15 160)" }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Pesan terkirim!</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                    Terima kasih. Tim kami akan menghubungi Anda melalui WhatsApp atau email sesuai data yang Anda kirim.{" "}
                    <button type="button" onClick={() => setSubmitted(false)} className="underline underline-offset-2">
                      Kirim pesan lain?
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Kirim pesan ke tim kami</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs text-gray-500">
                      Nama lengkap
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Budi Santoso"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="rounded-xl border border-input bg-white dark:bg-white/5 text-sm shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20"
                    />
                    {fieldErrors.name && <p className="text-xs text-destructive">{fieldErrors.name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="whatsapp_number" className="text-xs text-gray-500">
                      Nomor WhatsApp
                    </Label>
                    <Input
                      id="whatsapp_number"
                      name="whatsapp_number"
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={form.whatsapp_number}
                      onChange={handleChange}
                      required
                      className="rounded-xl border border-input bg-white dark:bg-white/5 text-sm shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20"
                    />
                    {fieldErrors.whatsapp_number && <p className="text-xs text-destructive">{fieldErrors.whatsapp_number}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-gray-500">
                    Email <span className="text-gray-400 font-semibold">(opsional)</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="anda@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className="rounded-xl border border-input bg-white dark:bg-white/5 text-sm shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20"
                  />
                  {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="topic" className="text-xs text-gray-500">
                    Topik <span className="text-gray-400 font-semibold">(opsional)</span>
                  </Label>
                  <SelectGroup>
                    <Select value={form.topic || "none"} onValueChange={handleSubjectChange}>
                      <SelectTrigger
                        id="topic"
                        className="rounded-xl border border-input bg-white dark:bg-white/5 text-sm w-full shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20"
                      >
                        <SelectValue placeholder="Pilih topik..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectLabel>Topik</SelectLabel>
                        <SelectItem value="none">Opsional</SelectItem>
                        {subjectOptions.map((subjectLabel) => (
                          <SelectItem key={subjectLabel} value={subjectLabel}>
                            {subjectLabel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </SelectGroup>
                  {fieldErrors.topic && <p className="text-xs text-destructive">{fieldErrors.topic}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs text-gray-500">
                    Pesan
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Ceritakan kebutuhan legalitas bisnis Anda secara singkat..."
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    maxLength={2000}
                    className="rounded-xl border border-input bg-white dark:bg-white/5 text-sm resize-none shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20"
                  />
                  <p className="text-[10px] font-semibold text-gray-400 text-right">{form.message.length}/2000</p>
                  {fieldErrors.message && <p className="text-xs text-destructive">{fieldErrors.message}</p>}
                </div>

                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypotWebsite}
                  onChange={(e) => setHoneypotWebsite(e.target.value)}
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
                <input
                  type="text"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypotCompanyWebsite}
                  onChange={(e) => setHoneypotCompanyWebsite(e.target.value)}
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

                <div className="flex justify-center pt-1">
                  <TurnstileWidget ref={turnstileRef} theme={turnstileTheme} onVerify={setTurnstileToken} onExpire={() => setTurnstileToken("")} onError={() => setTurnstileToken("")} />
                </div>

                <button
                  type="submit"
                  disabled={loading || !turnstileToken}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 mt-2"
                  style={{ backgroundColor: "oklch(0.3811 0.1315 260.22)" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim Pesan
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
