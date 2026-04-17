const R2_LEGACY_PREFIX = "https://pub-8c1ce0172c6d4135bf5db8344f0bbb65.r2.dev/";
const R2_CDN_PREFIX = "https://cdn.mitrajasalegalitas.co.id/";

export function toR2ProxySrc(src: string): string {
  if (src.startsWith(R2_CDN_PREFIX)) {
    return src;
  }
  if (src.startsWith(R2_LEGACY_PREFIX)) {
    return R2_CDN_PREFIX + src.slice(R2_LEGACY_PREFIX.length);
  }
  return src;
}
