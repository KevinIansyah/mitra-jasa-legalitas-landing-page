/* eslint-disable react-hooks/purity */
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, RotateCcw, ChevronDown, Loader2 } from "lucide-react";
import { ApiError } from "@/lib/types/api";
import { CHATBOT_SESSION_STORAGE_KEY, postChatbotSession, postChatbotMessage, patchChatbotLead, isChatbotSendOffline } from "@/lib/api/endpoints/chatbot";
import { whatsappWaMeUrl } from "@/lib/whatsapp-cta";
import { hasPublicApiBaseUrl } from "@/lib/api/client";
import { ChatBotMessageContent, ChatUserMessageContent } from "@/components/chat-bot-message-content";
import {
  type ChatThreadMessage as Message,
  loadThreadMessages,
  saveThreadMessages,
  clearChatWidgetStorage,
  pruneExpiredChatStorageIfNeeded,
  MOCK_THREAD_TOKEN,
} from "@/lib/chat-widget-storage";
import { LeadFormBubble } from "@/components/lead-form-bubble";
import { EASE } from "@/lib/types/constants";

type ChatMode = "loading" | "mock" | "api" | "offline";

const quickReplies = ["Berapa biaya pendirian PT?", "Berapa lama prosesnya?", "Dokumen apa yang diperlukan?", "Apakah konsultasi gratis?"];

const botResponses: Record<string, string> = {
  default: "Terima kasih sudah menghubungi Mitra Jasa Legalitas! Tim kami akan segera membantu. Untuk respons lebih cepat, silakan hubungi WhatsApp kami di +62 812-3456-7890.",
  biaya: "Biaya pendirian PT mulai dari Rp 3.500.000 tergantung jenis dan lokasi. Termasuk akta notaris, AHU, NPWP badan, dan NIB. Konsultasi gratis untuk estimasi biaya yang lebih akurat!",
  lama: "Proses pendirian PT umumnya 7-14 hari kerja jika dokumen lengkap. Kami akan memandu setiap langkahnya dan memberi update status secara berkala.",
  dokumen: "Dokumen yang perlu disiapkan: KTP & NPWP seluruh pendiri, fotokopi KK direktur utama, bukti domisili usaha (sewa/milik), dan modal yang akan dicantumkan dalam akta.",
  gratis: "Ya! Konsultasi awal kami sepenuhnya gratis dan tanpa komitmen. Anda bisa tanya soal jenis badan usaha, estimasi biaya, atau alur pengurusan sebelum memutuskan.",
};

function getBotReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("biaya") || lower.includes("harga") || lower.includes("tarif")) return botResponses.biaya;
  if (lower.includes("lama") || lower.includes("proses") || lower.includes("berapa hari")) return botResponses.lama;
  if (lower.includes("dokumen") || lower.includes("syarat") || lower.includes("berkas")) return botResponses.dokumen;
  if (lower.includes("gratis") || lower.includes("konsultasi") || lower.includes("free")) return botResponses.gratis;
  return botResponses.default;
}

function now() {
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTimeLabel() {
  return now();
}

function buildWelcomeMessages(): Message[] {
  const t = formatTimeLabel();
  return [
    {
      id: "w1",
      role: "bot",
      text: "Halo! 👋 Selamat datang di **Mitra Jasa Legalitas**. Saya siap membantu pertanyaan seputar legalitas bisnis Anda.",
      time: t,
    },
    {
      id: "w2",
      role: "bot",
      text: "Apa yang bisa saya bantu hari ini?",
      time: t,
    },
  ];
}

function BotAvatar() {
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "oklch(0.3811 0.1315 260.22)" }}>
      <Bot className="w-4 h-4 text-white" />
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isBot = msg.role === "bot";

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }} className={`flex items-end gap-2 ${isBot ? "justify-start" : "justify-end"}`}>
      {isBot && <BotAvatar />}
      <div className={`max-w-[75%] min-w-0 space-y-1 ${isBot ? "" : "items-end flex flex-col"}`}>
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isBot ? "bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-bl-sm" : "text-white rounded-br-sm"}`}
          style={!isBot ? { backgroundColor: "oklch(0.3811 0.1315 260.22)" } : {}}
        >
          {isBot ? <ChatBotMessageContent text={msg.text} /> : <ChatUserMessageContent text={msg.text} />}
        </div>
        <p className="text-[10px] text-gray-400 px-1">{msg.time}</p>
      </div>
    </motion.div>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => buildWelcomeMessages());
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [mode, setMode] = useState<ChatMode>(() => (hasPublicApiBaseUrl() ? "loading" : "mock"));
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [offlineWhatsapp, setOfflineWhatsapp] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(!hasPublicApiBaseUrl());

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isConverted, setIsConverted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initSession = useCallback(async () => {
    if (typeof window !== "undefined") {
      pruneExpiredChatStorageIfNeeded();
    }
    if (!hasPublicApiBaseUrl()) {
      setMode("mock");
      setSessionReady(true);
      const mockRestored = loadThreadMessages(MOCK_THREAD_TOKEN);
      setMessages(mockRestored ?? buildWelcomeMessages());
      return;
    }

    setMode("loading");
    setSessionReady(false);

    try {
      const existing = typeof window !== "undefined" ? localStorage.getItem(CHATBOT_SESSION_STORAGE_KEY) : null;

      const res = await postChatbotSession({
        session_token: existing || undefined,
        page_url: typeof window !== "undefined" ? window.location.href : "",
      });

      if (!res.enabled) {
        setMode("offline");
        setSessionToken(null);
        setOfflineWhatsapp(res.whatsapp ?? null);
        setMessages([
          {
            id: "off-1",
            role: "bot",
            text: res.offline_message ?? "Asisten AI sedang tidak tersedia.",
            time: formatTimeLabel(),
          },
        ]);
        setSessionReady(true);
        return;
      }

      setMode("api");
      setOfflineWhatsapp(null);
      setIsConverted(res.is_converted ?? false);

      if (typeof window !== "undefined") {
        localStorage.setItem(CHATBOT_SESSION_STORAGE_KEY, res.session_token);
      }
      setSessionToken(res.session_token);
      const restored = loadThreadMessages(res.session_token);
      setMessages(restored ?? buildWelcomeMessages());
      setSessionReady(true);
    } catch {
      setMode("offline");
      setSessionToken(null);
      setOfflineWhatsapp(null);
      setMessages([
        {
          id: "err-1",
          role: "bot",
          text: "Tidak dapat terhubung ke asisten. Silakan coba lagi nanti atau hubungi kami via WhatsApp.",
          time: formatTimeLabel(),
        },
      ]);
      setSessionReady(true);
    }
  }, []);

  useEffect(() => {
    void initSession();
  }, [initSession]);

  useEffect(() => {
    if (mode === "offline" || mode === "loading") return;
    const token = mode === "mock" ? MOCK_THREAD_TOKEN : (sessionToken ?? null);
    if (!token) return;
    saveThreadMessages(token, messages);
  }, [messages, mode, sessionToken]);

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, showLeadForm]);

  useEffect(() => {
    if (isConverted) return;
    if (mode !== "api" && mode !== "mock") return;

    const userCount = messages.filter((m) => m.role === "user").length;
    if (userCount >= 3) {
      setShowLeadForm(true);
    }
  }, [messages, isConverted, mode]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    if (mode === "loading") return;

    const trimmed = text.trim().slice(0, 1000);
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
      time: formatTimeLabel(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    if (mode === "mock") {
      setTimeout(
        () => {
          const reply = getBotReply(trimmed);
          const botMsg: Message = {
            id: `b-${Date.now()}`,
            role: "bot",
            text: reply,
            time: formatTimeLabel(),
          };
          setMessages((m) => [...m, botMsg]);
          setIsTyping(false);
          if (!isOpen) setUnread((n) => n + 1);
        },
        1000 + Math.random() * 600,
      );
      return;
    }

    if (mode === "offline" || !sessionToken) {
      setIsTyping(false);
      return;
    }

    try {
      const res = await postChatbotMessage(sessionToken, trimmed);

      if (isChatbotSendOffline(res)) {
        setMode("offline");
        setOfflineWhatsapp(res.whatsapp ?? null);
        if (typeof window !== "undefined") {
          clearChatWidgetStorage();
        }
        setSessionToken(null);
        const botMsg: Message = {
          id: `b-${Date.now()}`,
          role: "bot",
          text: res.offline_message,
          time: formatTimeLabel(),
        };
        setMessages((m) => [...m, botMsg]);
        setIsTyping(false);
        if (!isOpen) setUnread((n) => n + 1);
        return;
      }

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: "bot",
        text: res.message,
        time: formatTimeLabel(),
      };
      setMessages((m) => [...m, botMsg]);
      setIsTyping(false);
      if (!isOpen) setUnread((n) => n + 1);
    } catch (e) {
      const msgText = e instanceof ApiError ? e.message : "Maaf, terjadi kesalahan. Silakan coba lagi.";
      if (e instanceof ApiError && e.status === 404) {
        if (typeof window !== "undefined") {
          clearChatWidgetStorage();
        }
        setSessionToken(null);
        const botMsg: Message = {
          id: `b-${Date.now()}`,
          role: "bot",
          text: `${msgText} Menghubungkan ulang...`,
          time: formatTimeLabel(),
        };
        setMessages((m) => [...m, botMsg]);
        try {
          const fresh = await postChatbotSession({
            page_url: window.location.href,
          });
          if (fresh.enabled) {
            if (typeof window !== "undefined") {
              localStorage.setItem(CHATBOT_SESSION_STORAGE_KEY, fresh.session_token);
            }
            setSessionToken(fresh.session_token);
            setMode("api");
            setOfflineWhatsapp(null);
            const okMsg: Message = {
              id: `b-${Date.now()}-ok`,
              role: "bot",
              text: "Koneksi diperbarui. Silakan kirim ulang pesan Anda.",
              time: formatTimeLabel(),
            };
            setMessages((m) => [...m, okMsg]);
          } else {
            setMode("offline");
            setOfflineWhatsapp(fresh.whatsapp ?? null);
          }
        } catch {
          const failMsg: Message = {
            id: `b-${Date.now()}-fail`,
            role: "bot",
            text: "Gagal membuat sesi baru. Muat ulang halaman atau hubungi WhatsApp.",
            time: formatTimeLabel(),
          };
          setMessages((m) => [...m, failMsg]);
        }
      } else {
        const botMsg: Message = {
          id: `b-${Date.now()}`,
          role: "bot",
          text: msgText,
          time: formatTimeLabel(),
        };
        setMessages((m) => [...m, botMsg]);
      }
      setIsTyping(false);
      if (!isOpen) setUnread((n) => n + 1);
    }
  };

  const handleLeadSubmit = async (data: { name: string; email: string; phone: string }) => {
    if (!sessionToken) return;
    await patchChatbotLead(sessionToken, data);
    setIsConverted(true);
    setShowLeadForm(false);

    const confirmMsg: Message = {
      id: `b-lead-${Date.now()}`,
      role: "bot",
      text: `Terima kasih **${data.name}**! Kontak Anda sudah kami catat. Tim kami akan segera menghubungi Anda. 😊`,
      time: formatTimeLabel(),
    };
    setMessages((m) => [...m, confirmMsg]);
  };

  const handleLeadSkip = () => {
    setShowLeadForm(false);
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  function handleReset() {
    setMessages(buildWelcomeMessages());
    setInput("");
    setIsConverted(false);
    setShowLeadForm(false);
    if (typeof window !== "undefined") {
      clearChatWidgetStorage();
    }
    setSessionToken(null);
    void initSession();
  }

  const inputDisabled = !sessionReady || mode === "loading" || mode === "offline" || (mode === "api" && !sessionToken);

  const showQuickReplies = mode === "mock" || (mode === "api" && sessionReady && !!sessionToken);

  const waHref = offlineWhatsapp ? whatsappWaMeUrl(offlineWhatsapp) : "";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="w-[340px] sm:w-[380px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col"
            style={{
              height: "480px",
              backgroundColor: "var(--surface-card)",
            }}
          >
            <div className="flex items-center gap-3 px-4 py-3.5 shrink-0" style={{ backgroundColor: "oklch(0.3811 0.1315 260.22)" }}>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-tight">Asisten MJL</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {mode === "offline" ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                      <p className="text-xs text-white/70">Tidak tersedia</p>
                    </>
                  ) : mode === "loading" ? (
                    <>
                      <Loader2 className="w-3 h-3 text-white/80 animate-spin" />
                      <p className="text-xs text-white/70">Menghubungkan...</p>
                    </>
                  ) : mode === "mock" ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                      <p className="text-xs text-white/80">Mode demo (bukan AI)</p>
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <p className="text-xs text-white/70">Terhubung asisten AI</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset chat"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup chat"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {mode === "mock" ? (
              <p className="px-3 py-2 text-[11px] leading-snug text-amber-900 dark:text-amber-100/90 bg-amber-100/90 dark:bg-amber-950/50 border-b border-amber-200/80 dark:border-amber-800/50 shrink-0">
                Respons saat ini hanya contoh lokal. Untuk jawaban dari backend, set <code className="rounded bg-amber-200/80 dark:bg-black/30 px-1">NEXT_PUBLIC_API_URL</code> di{" "}
                <code className="rounded bg-amber-200/80 dark:bg-black/30 px-1">.env.local</code> lalu restart server dev.
              </p>
            ) : null}

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-none">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}

              <AnimatePresence>{showLeadForm && !isConverted && <LeadFormBubble key="lead-form" onSubmit={handleLeadSubmit} onSkip={handleLeadSkip} />}</AnimatePresence>

              <AnimatePresence>
                {isTyping && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="flex items-end gap-2">
                    <BotAvatar />
                    <div className="bg-gray-100 dark:bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.7,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {mode === "offline" && waHref ? (
                <div className="pt-2">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm bg-emerald-600 font-medium text-white shadow-sm transition-colors hover:bg-emerald-500"
                  >
                    <MessageCircle className="size-3.5" aria-hidden />
                    Chat WhatsApp
                  </a>
                </div>
              ) : null}

              <div ref={bottomRef} />
            </div>

            {showQuickReplies ? (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    type="button"
                    disabled={inputDisabled}
                    onClick={() => void sendMessage(q)}
                    className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/15 text-gray-600 dark:text-gray-300 hover:border-brand-blue hover:text-brand-blue dark:hover:text-brand-blue transition-colors whitespace-nowrap bg-surface-card disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {q}
                  </button>
                ))}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 dark:border-white/8 shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={inputDisabled && mode !== "mock" ? (mode === "offline" ? "Asisten tidak tersedia" : "Menghubungkan...") : "Ketik pesan..."}
                disabled={inputDisabled}
                className="flex-1 text-sm px-3 py-2 rounded-full border border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/8 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || inputDisabled}
                aria-label="Kirim"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-opacity disabled:opacity-40 shrink-0"
                style={{ backgroundColor: "oklch(0.3811 0.1315 260.22)" }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Tutup chat" : "Buka chat"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
        style={{ backgroundColor: "oklch(0.3811 0.1315 260.22)" }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isOpen && unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white text-[10px] font-bold flex items-center justify-center"
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>

        {!isOpen && <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: "oklch(0.3811 0.1315 260.22)" }} />}
      </motion.button>
    </div>
  );
}
