'use client';

import { useEffect } from 'react';
import './globals.css';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

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
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-gray-50 text-gray-900">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" aria-hidden />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Aplikasi bermasalah</h1>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              Terjadi kesalahan fatal saat memuat halaman. Muat ulang atau kembali ke beranda.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex flex-1 items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-brand-blue hover:opacity-95 transition-opacity"
              >
               
                Muat ulang
              </button>
              <Link 
                href="/"
                className="inline-flex flex-1 items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                
                Beranda
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
