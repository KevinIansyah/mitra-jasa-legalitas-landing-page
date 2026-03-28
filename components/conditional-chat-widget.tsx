'use client';

import { usePathname } from 'next/navigation';
import { ChatWidget } from '@/components/chat-widget';

function shouldHideChat(pathname: string): boolean {
  const authPrefixes = [
    '/masuk',
    '/daftar',
    '/verify-otp',
    '/lupa-password',
    '/reset-password',
  ];
  if (
    authPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    return true;
  }
  if (pathname.startsWith('/blog/')) return true;
  if (pathname.startsWith('/layanan/')) return true;
  return false;
}

export function ConditionalChatWidget() {
  const pathname = usePathname();
  if (!pathname || shouldHideChat(pathname)) return null;
  return <ChatWidget />;
}
