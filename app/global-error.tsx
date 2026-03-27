'use client';

import { useEffect } from 'react';
import './globals.css';

/**
 * Hanya dipakai jika error terjadi di `app/layout.tsx` (root).
 * Wajib punya `<html>` + `<body>` karena root layout tidak ikut di-render.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/global-error
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="id">
      <body className="antialiased min-h-screen flex items-center justify-center p-6 bg-gray-50 text-gray-900">
        <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-bold mb-2">Terjadi kesalahan fatal</h1>
          <p className="text-sm text-gray-600 mb-6">
            Muat ulang halaman atau coba lagi nanti.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-brand-blue hover:opacity-95"
          >
            Coba lagi
          </button>
        </div>
      </body>
    </html>
  );
}
