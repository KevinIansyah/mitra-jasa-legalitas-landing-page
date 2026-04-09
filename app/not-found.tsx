import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { SuppressChatBubble } from "@/components/chat-suppression-provider";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-gray-50 dark:bg-surface-subtle">
      <SuppressChatBubble />
      <div className="max-w-md w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-surface-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/10">
          <FileQuestion className="h-7 w-7 text-brand-blue" aria-hidden />
        </div>
        <p className="text-5xl sm:text-6xl font-extrabold text-brand-blue mb-2 tabular-nums tracking-tight">404</p>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Halaman tidak ditemukan</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Alamat yang Anda buka tidak ada atau sudah dipindahkan. Periksa URL atau kembali ke beranda.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="inline-flex flex-1 items-center justify-center py-3 rounded-xl text-sm font-semibold text-white bg-brand-blue hover:opacity-95 transition-opacity"
          >
            Beranda
          </Link>
          <Link
            href="/layanan"
            className="inline-flex flex-1 items-center justify-center py-3 rounded-xl text-sm font-semibold border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Layanan
          </Link>
        </div>
      </div>
    </div>
  );
}
