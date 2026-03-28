'use client';

import type { ReactNode } from 'react';
import { ExternalLink, MessageCircle } from 'lucide-react';
import {
  normalizeIndonesiaWhatsappDigits,
  whatsappWaMeUrlWithText,
} from '@/lib/whatsapp-cta';

const URL_RE = /https?:\/\/[^\s<]+/g;

/** 08… / +62… / 62… — nomor dimulai 8 setelah kode negara atau 0 */
const PHONE_RE = /(?:\+62\s*|62\s*|0)8[1-9]\d{0,2}(?:[-\s]?\d{3,4}){1,3}/g;

function trimTrailingUrlPunctuation(url: string): string {
  return url.replace(/[.,;:!?)'»\]]+$/u, '');
}

/**
 * Normalisasi sebelum split URL:
 * - Markdown `[label](url)` → hanya `url` (tombol tetap pakai hostname)
 * - `[` menggantung sebelum `https://` (model sering salah format) → buang `[`
 */
function prepareTextForUrlSplit(text: string): string {
  let s = text;
  s = s.replace(/\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g, '$2');
  s = s.replace(/\[\s*(?=https?:\/\/)/g, '');
  return s;
}

function urlButtonLabel(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname === '/' ? '' : u.pathname;
    const short = `${u.hostname}${path}`;
    if (short.length > 42) {
      return `${u.hostname}${path.slice(0, 18)}…`;
    }
    return short || u.hostname || 'Buka tautan';
  } catch {
    return 'Buka tautan';
  }
}

type UrlPart = { kind: 'text'; value: string } | { kind: 'url'; value: string };

function splitUrls(text: string): UrlPart[] {
  const parts: UrlPart[] = [];
  let last = 0;
  for (const m of text.matchAll(URL_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) {
      parts.push({ kind: 'text', value: text.slice(last, idx) });
    }
    const raw = m[0];
    parts.push({ kind: 'url', value: trimTrailingUrlPunctuation(raw) });
    last = idx + raw.length;
  }
  if (last < text.length) {
    parts.push({ kind: 'text', value: text.slice(last) });
  }
  return parts.length ? parts : [{ kind: 'text', value: text }];
}

type BoldPart = { bold: boolean; value: string };

function splitBold(text: string): BoldPart[] {
  const parts: BoldPart[] = [];
  let last = 0;
  const re = /\*\*([\s\S]+?)\*\*/g;
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) {
      parts.push({ bold: false, value: text.slice(last, idx) });
    }
    parts.push({ bold: true, value: m[1] });
    last = idx + m[0].length;
  }
  if (last < text.length) {
    parts.push({ bold: false, value: text.slice(last) });
  }
  return parts.length ? parts : [{ bold: false, value: text }];
}

type PhonePart =
  | { kind: 'text'; value: string }
  | { kind: 'phone'; value: string };

function splitPhones(text: string): PhonePart[] {
  const parts: PhonePart[] = [];
  let last = 0;
  for (const m of text.matchAll(PHONE_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) {
      parts.push({ kind: 'text', value: text.slice(last, idx) });
    }
    parts.push({ kind: 'phone', value: m[0].trim() });
    last = idx + m[0].length;
  }
  if (last < text.length) {
    parts.push({ kind: 'text', value: text.slice(last) });
  }
  return parts.length ? parts : [{ kind: 'text', value: text }];
}

function UrlButton({ url }: { url: string }) {
  const label = urlButtonLabel(url);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-2 flex w-full min-w-0 max-w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-blue/90"
    >
      <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
      <span className="min-w-0 truncate text-center">{label}</span>
    </a>
  );
}

function PhoneWithWaButton({ display }: { display: string }) {
  const digits = normalizeIndonesiaWhatsappDigits(display);
  const wa =
    digits.length >= 10
      ? whatsappWaMeUrlWithText(
          display,
          'Halo, saya ingin berkonsultasi dengan Mitra Jasa Legalitas.',
        )
      : '';

  return (
    <span className="my-2 inline-flex w-full min-w-0 max-w-full flex-col gap-2 sm:inline-flex sm:flex-row sm:flex-wrap sm:items-center">
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {display}
      </span>
      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-500"
        >
          <MessageCircle className="h-3 w-3" aria-hidden />
          WhatsApp
        </a>
      ) : null}
    </span>
  );
}

function renderPhonesInPlainText(text: string): ReactNode[] {
  return splitPhones(text).map((p, pi) => {
    if (p.kind === 'text') {
      return (
        <span key={`t-${pi}`} className="wrap-break-word">
          {p.value}
        </span>
      );
    }
    return <PhoneWithWaButton key={`p-${pi}`} display={p.value} />;
  });
}

function renderBoldAndPhones(text: string): ReactNode {
  return splitBold(text).map((bp, bi) => {
    if (bp.bold) {
      return (
        <strong key={`b-${bi}`} className="font-semibold">
          {renderPhonesInPlainText(bp.value)}
        </strong>
      );
    }
    return (
      <span key={`b-${bi}`} className="wrap-break-word">
        {renderPhonesInPlainText(bp.value)}
      </span>
    );
  });
}

/**
 * Pesan bot: **bold**, URL → tombol (teks panjang tidak ditampilkan mentah),
 * nomor WA → nomor tetap tampil + tombol WhatsApp.
 */
export function ChatBotMessageContent({ text }: { text: string }) {
  const urlParts = splitUrls(prepareTextForUrlSplit(text));

  return (
    <div className="min-w-0 max-w-full space-y-2 wrap-break-word text-sm leading-relaxed">
      {urlParts.map((part, i) => {
        if (part.kind === 'url') {
          return <UrlButton key={`url-${i}`} url={part.value} />;
        }
        return (
          <div key={`txt-${i}`} className="min-w-0">
            {renderBoldAndPhones(part.value)}
          </div>
        );
      })}
    </div>
  );
}

export function ChatUserMessageContent({ text }: { text: string }) {
  return (
    <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
      {text}
    </p>
  );
}
