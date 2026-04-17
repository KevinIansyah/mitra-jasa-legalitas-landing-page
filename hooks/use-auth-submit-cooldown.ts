'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/lib/types/api';

/**
 * Cooldown state untuk tombol submit pada form auth.
 *
 * Dipakai untuk:
 * 1. Menangani response 429 (rate limit) dengan memakai `Retry-After` header.
 * 2. Memberi cooldown minimum setelah aksi pengiriman OTP/email sukses, agar user tidak spam klik.
 */
export function useAuthSubmitCooldown() {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const startCooldown = useCallback((seconds: number) => {
    const normalized = Math.max(0, Math.floor(seconds));
    if (normalized <= 0) return;
    setCooldown((prev) => (normalized > prev ? normalized : prev));
  }, []);

  /**
   * Kalau error adalah 429, aktifkan cooldown sesuai `retryAfter` (fallback 60 detik).
   * Mengembalikan `true` kalau error berhasil ditangani sebagai rate limit.
   */
  const handleRateLimit = useCallback(
    (err: unknown): boolean => {
      if (err instanceof ApiError && err.status === 429) {
        startCooldown(err.retryAfter ?? 60);
        return true;
      }
      return false;
    },
    [startCooldown],
  );

  return { cooldown, startCooldown, handleRateLimit };
}
