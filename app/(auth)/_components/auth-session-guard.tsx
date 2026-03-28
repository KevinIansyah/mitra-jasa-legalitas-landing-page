'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

/**
 * Cadangan: jika token hanya ada di client / cookie belum terbaca di server,
 * alihkan pengguna yang sudah login keluar dari rute `(auth)`.
 */
export function AuthSessionGuard() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    router.replace('/');
  }, [isAuthenticated, isLoading, router]);

  return null;
}
