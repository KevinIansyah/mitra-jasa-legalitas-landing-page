import type { ImageLoaderProps } from "next/image";

const R2_PUBLIC_PREFIX = "https://pub-8c1ce0172c6d4135bf5db8344f0bbb65.r2.dev/";

/** Mengarahkan gambar R2 publik lewat proxy same-origin; selain itu kembalikan src apa adanya. */
export function r2Loader({ src }: ImageLoaderProps) {
  if (typeof src === "string" && src.startsWith(R2_PUBLIC_PREFIX)) {
    return `/api/image-proxy?url=${encodeURIComponent(src)}`;
  }
  return src;
}
