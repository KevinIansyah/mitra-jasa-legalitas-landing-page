'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

/**
 * Error boundary global (App Router).
 * Menangkap error runtime di subtree; Next memanggil ini secara otomatis.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isDev = process.env.NODE_ENV === 'development';

  const msg = error.message ?? '';
  const isLikelyNetworkFailure =
    /fetch failed|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|ECONNRESET|network\s*error/i.test(
      msg,
    );

  const title = isLikelyNetworkFailure
    ? 'Tidak dapat terhubung'
    : 'Terjadi kesalahan';
  const description = isLikelyNetworkFailure
    ? 'Periksa koneksi internet Anda, lalu coba lagi. Jika masalah berlanjut, hubungi administrator.'
    : 'Halaman tidak bisa ditampilkan. Anda bisa mencoba lagi atau kembali ke beranda.';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-gray-50 dark:bg-surface-subtle">
      <div className="max-w-md w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-surface-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/40">
          <AlertTriangle
            className="h-7 w-7 text-rose-600 dark:text-rose-400"
            aria-hidden
          />
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
          {description}
        </p>
        {isDev && (
          <pre className="mb-6 text-left text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg p-3 overflow-auto max-h-32 whitespace-pre-wrap wrap-break-word">
            {error.message}
            {error.digest ? `\n[digest: ${error.digest}]` : ''}
          </pre>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex flex-1 items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-brand-blue hover:opacity-95 transition-opacity"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Coba lagi
          </button>
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
