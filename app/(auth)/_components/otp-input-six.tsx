'use client';

import { useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
const LENGTH = 6;

const otpCellShellClass =
  'relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-input ' +
  'bg-white/25 dark:bg-white/5 backdrop-blur-sm ' +
  'transition-[border-color] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20';

export type OtpInputSixProps = {
  value: string;
  onChange: (digits: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  id?: string;
};

export function OtpInputSix({
  value,
  onChange,
  disabled,
  hasError,
  id = 'otp-six',
}: OtpInputSixProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setRefs = useCallback((el: HTMLInputElement | null, i: number) => {
    inputRefs.current[i] = el;
  }, []);

  const digits = value.replace(/\D/g, '').slice(0, LENGTH);

  const handleChange = useCallback(
    (index: number, raw: string) => {
      if (disabled) return;
      const incoming = raw.replace(/\D/g, '');

      if (incoming.length === 0) {
        const before = digits.slice(0, index);
        const after = digits.slice(index + 1);
        onChange(before + after);
        return;
      }

      if (incoming.length > 1) {
        const merged = (digits.slice(0, index) + incoming).slice(0, LENGTH);
        onChange(merged);
        const nextIdx = Math.min(index + incoming.length - 1, LENGTH - 1);
        queueMicrotask(() => inputRefs.current[nextIdx]?.focus());
        return;
      }

      const digit = incoming;

      if (index > digits.length) {
        queueMicrotask(() => inputRefs.current[digits.length]?.focus());
        return;
      }
      if (index < digits.length) {
        const next = digits.slice(0, index) + digit + digits.slice(index + 1);
        onChange(next.slice(0, LENGTH));
        queueMicrotask(() =>
          inputRefs.current[Math.min(index + 1, LENGTH - 1)]?.focus(),
        );
        return;
      }
      onChange((digits + digit).slice(0, LENGTH));
      if (digit && index < LENGTH - 1) {
        queueMicrotask(() => inputRefs.current[index + 1]?.focus());
      }
    },
    [digits, disabled, onChange],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (e.key === 'Backspace') {
        if (!digits[index] && index > 0) {
          e.preventDefault();
          const before = digits.slice(0, index - 1);
          const after = digits.slice(index);
          onChange(before + after);
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowRight' && index < LENGTH - 1) {
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits, disabled, onChange],
  );

  const handlePaste = useCallback(
    (index: number, e: React.ClipboardEvent) => {
      if (disabled) return;
      const pasted = e.clipboardData
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, LENGTH);
      if (!pasted) return;
      e.preventDefault();
      const merged = (digits.slice(0, index) + pasted).slice(0, LENGTH);
      onChange(merged);
      const focusIdx = Math.min(Math.max(0, merged.length - 1), LENGTH - 1);
      queueMicrotask(() => inputRefs.current[focusIdx]?.focus());
    },
    [digits, disabled, onChange],
  );

  return (
    <div
      role="group"
      aria-label="Kode OTP 6 digit"
      className="flex justify-center gap-1 sm:gap-2"
    >
      {Array.from({ length: LENGTH }, (_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={cn(
              otpCellShellClass,
              hasError && 'border-destructive focus-within:ring-destructive/25',
              disabled && 'opacity-60',
            )}
          >
            <input
              id={i === 0 ? id : `${id}-${i}`}
              ref={(el) => setRefs(el, i)}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              name={i === 0 ? 'otp' : undefined}
              maxLength={LENGTH}
              disabled={disabled}
              onPaste={(e) => handlePaste(i, e)}
              value={digits[i] ?? ''}
              onChange={(e) => handleChange(i, e.target.value)}
              onFocus={() => {
                if (i > digits.length) {
                  queueMicrotask(() =>
                    inputRefs.current[digits.length]?.focus(),
                  );
                }
              }}
              onKeyDown={(e) => handleKeyDown(i, e)}
              aria-invalid={hasError}
              aria-label={`Digit ${i + 1} dari ${LENGTH}`}
              className={cn(
                'absolute inset-0 h-full w-full border-0 bg-transparent p-0 text-center text-lg font-mono font-semibold tabular-nums text-foreground outline-none',
                'placeholder:text-muted-foreground',
                'focus-visible:ring-0',
                'disabled:cursor-not-allowed',
              )}
            />
          </div>
          <span className="ml-1 sm:ml-2 text-muted-foreground/50">
            {i < LENGTH - 1 ? '-' : ''}
          </span>
        </div>
      ))}
    </div>
  );
}
