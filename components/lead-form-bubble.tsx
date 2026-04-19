"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, CheckCircle2, X, Loader2 } from "lucide-react";
import { EASE } from "@/lib/types/constants";

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
}

interface LeadFormBubbleProps {
  onSubmit: (data: LeadFormData) => Promise<void>;
  onSkip: () => void;
}

export function LeadFormBubble({ onSubmit, onSkip }: LeadFormBubbleProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Partial<LeadFormData>>({});

  function validate(): boolean {
    const e: Partial<LeadFormData> = {};
    if (!name.trim()) e.name = "Nama wajib diisi";
    if (!phone.trim()) e.phone = "No. HP wajib diisi";
    else if (!/^(?:\+62|62|0)8[1-9]\d{6,11}$/.test(phone.replace(/[\s-]/g, ""))) e.phone = "Format nomor tidak valid";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Format email tidak valid";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.35, ease: EASE }} className="flex items-end gap-2 justify-start">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 self-end" style={{ backgroundColor: "oklch(0.3811 0.1315 260.22)" }}>
        <User className="w-4 h-4 text-white" />
      </div>

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="bg-gray-100 dark:bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[75%]"
          >
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              <span>Terima kasih! Tim kami akan segera menghubungi Anda. 🙏</span>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-100 dark:bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3.5 max-w-[75%] w-full space-y-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-gray-800 dark:text-gray-100 leading-snug">Tinggalkan kontak Anda agar tim kami bisa follow-up 👇</p>
              <button type="button" onClick={onSkip} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0 mt-0.5" aria-label="Lewati">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              <FormField icon={<User className="w-3.5 h-3.5" />} placeholder="Nama *" value={name} onChange={setName} error={errors.name} type="text" />
              <FormField icon={<Phone className="w-3.5 h-3.5" />} placeholder="No. HP / WhatsApp *" value={phone} onChange={setPhone} error={errors.phone} type="tel" />
              <FormField icon={<Mail className="w-3.5 h-3.5" />} placeholder="Email (opsional)" value={email} onChange={setEmail} error={errors.email} type="email" />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                aria-label="Simpan kontak"
                aria-busy={loading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white transition-opacity disabled:opacity-60"
                style={{ backgroundColor: "oklch(0.3811 0.1315 260.22)" }}
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden /> : "Simpan Kontak"}
              </button>
              <button
                type="button"
                onClick={onSkip}
                disabled={loading}
                className="px-3 py-2 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                Lewati
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FormField({ icon, placeholder, value, onChange, error, type }: { icon: React.ReactNode; placeholder: string; value: string; onChange: (v: string) => void; error?: string; type: string }) {
  return (
    <div className="space-y-0.5">
      <div
        className={`flex items-center gap-2 bg-white dark:bg-white/10 rounded-lg px-2.5 py-2 border transition-colors ${
          error ? "border-destructive focus-within:ring-destructive/25" : "border-gray-200 dark:border-white/15 focus-within:border-blue-400"
        }`}
      >
        <span className="text-gray-400 shrink-0">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-xs bg-transparent text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none"
        />
      </div>
      {error && <p className="text-[10px] text-destructive px-1">{error}</p>}
    </div>
  );
}
