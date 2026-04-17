const R2_PUBLIC_PREFIX = "https://pub-8c1ce0172c6d4135bf5db8344f0bbb65.r2.dev/";

/** URL R2 publik → same-origin proxy. Selain itu (lokal, blob, host lain) tidak diubah. */
export function toR2ProxySrc(src: string): string {
  if (src.startsWith(R2_PUBLIC_PREFIX)) {
    return `/api/image-proxy?url=${encodeURIComponent(src)}`;
  }
  return src;
}
