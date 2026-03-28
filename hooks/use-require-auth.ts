'use client';

import { useAuth } from './use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useRequireAuth() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/masuk');
    }
  }, [isLoading, isAuthenticated, router]);

  return { user, isLoading };
}
