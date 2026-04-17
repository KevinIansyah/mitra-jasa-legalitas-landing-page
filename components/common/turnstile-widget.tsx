'use client';

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface TurnstileRef {
  getToken: () => string;
  reset: () => void;
}

interface Props {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

export const TurnstileWidget = forwardRef<TurnstileRef, Props>(function TurnstileWidget(
  { onVerify, onExpire, onError, theme = 'auto', className },
  ref,
) {
  const widgetRef = useRef<TurnstileInstance>(null);
  const tokenRef = useRef<string>('');

  useImperativeHandle(ref, () => ({
    getToken: () => tokenRef.current,
    reset: () => {
      widgetRef.current?.reset();
      tokenRef.current = '';
    },
  }));

  if (!SITE_KEY) {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <div className={className}>
          <p className="text-xs text-destructive">
            NEXT_PUBLIC_TURNSTILE_SITE_KEY belum di-set. Widget CAPTCHA tidak dapat ditampilkan.
          </p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={className}>
      <Turnstile
        ref={widgetRef}
        siteKey={SITE_KEY}
        options={{ theme, size: 'normal', appearance: 'always' }}
        onSuccess={(token) => {
          tokenRef.current = token;
          onVerify(token);
        }}
        onExpire={() => {
          tokenRef.current = '';
          onExpire?.();
        }}
        onError={() => {
          tokenRef.current = '';
          onError?.();
        }}
      />
    </div>
  );
});
