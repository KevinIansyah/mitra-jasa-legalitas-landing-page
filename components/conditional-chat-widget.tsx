"use client";

import { usePathname } from "next/navigation";
import { ChatWidget } from "@/components/chat-widget";
import { useChatSuppression } from "@/components/chat-suppression-provider";

function shouldHideChat(pathname: string): boolean {
  const authPrefixes = [
    "/masuk",
    "/daftar",
    "/verify-otp",
    "/lupa-password",
    "/reset-password",
    "/pengaturan/profil",
    "/pengaturan/password",
    "/portal",
    "/portal/proyek",
    "/portal/proposal",
    "/portal/estimasi",
    "/portal/permintaan-penawaran",
  ];
  if (authPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }
  if (pathname.startsWith("/blog/")) return true;
  if (pathname.startsWith("/layanan/")) return true;
  return false;
}

export function ConditionalChatWidget() {
  const { suppressed } = useChatSuppression();
  const pathname = usePathname();
  if (suppressed) return null;
  if (!pathname || shouldHideChat(pathname)) return null;
  return <ChatWidget />;
}
