'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { Input } from '@/components/ui/input';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function BlogNewsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section
      id="newsletter"
      className="py-16 lg:py-20 bg-gray-50 dark:bg-surface-subtle"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="space-y-3"
        >
          <SectionHeading
            badge="Newsletter"
            title={
              <>
                Dapatkan Tips Legalitas Bisnis
                <br className="hidden sm:block" />
                <span style={{ color: 'oklch(0.7319 0.1856 52.89)' }}>
                  Langsung di Inbox Anda
                </span>
              </>
            }
            description="Bergabung dengan 10.000+ pengusaha yang sudah berlangganan. Kami kirim ringkasan artikel & update regulasi setiap minggu."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
        >
          {submitted ? (
            <div className="flex items-center justify-center gap-3 py-4">
              <CheckCircle2
                className="w-5 h-5 shrink-0"
                style={{ color: 'oklch(0.55 0.13 160)' }}
              />
              <p className="text-sm font-semibold text-gray-700">
                Berhasil! Cek inbox Anda untuk konfirmasi.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="alamat@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                 className="flex-1 py-3 px-4 h-11 rounded-full border border-input bg-white dark:bg-white/5 text-sm shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20"
              />
              <button
                type="submit"
                className="shrink-0 px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: 'oklch(0.3811 0.1315 260.22)' }}
              >
                Langganan Sekarang
              </button>
            </form>
          )}
        </motion.div>

        <p className="text-xs text-gray-400">
          Gratis. Bisa unsubscribe kapan saja. Tidak ada spam.
        </p>
      </div>
    </section>
  );
}
