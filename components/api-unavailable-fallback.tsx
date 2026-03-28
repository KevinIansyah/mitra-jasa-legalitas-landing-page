import Link from 'next/link';
import { Home, RefreshCw, WifiOff } from 'lucide-react';

type ApiUnavailableFallbackProps = {
  retryHref: string;
  title?: string;
  description?: string;
};

export function ApiUnavailableFallback({
  retryHref,
  title = 'Tidak dapat memuat konten',
  description = 'Periksa koneksi internet Anda, lalu muat ulang halaman ini.',
}: ApiUnavailableFallbackProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 bg-surface-page">
      <div className="max-w-md w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-surface-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/40">
          <WifiOff
            className="h-6 w-6 text-amber-700 dark:text-amber-400"
            aria-hidden
          />
        </div>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={retryHref}
            className="inline-flex flex-1 items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-brand-blue hover:opacity-95 transition-opacity"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Muat ulang
          </Link>
          <Link
            href="/"
            className="inline-flex flex-1 items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-gray-200 dark:border-white/15 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <Home className="h-4 w-4" aria-hidden />
            Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
