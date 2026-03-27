'use client';

import { Share2 } from 'lucide-react';

type Props = {
  url: string;
  title: string;
};

export function BlogShareButton({ url, title }: Props) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
      onClick={async () => {
        try {
          if (typeof navigator !== 'undefined' && navigator.share) {
            await navigator.share({ title, url });
          } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
            await navigator.clipboard.writeText(url);
          }
        } catch {
          /* user cancel / unsupported */
        }
      }}
    >
      <Share2 className="w-3.5 h-3.5" />
      Bagikan
    </button>
  );
}
