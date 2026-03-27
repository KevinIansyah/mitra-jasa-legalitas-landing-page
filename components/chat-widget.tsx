/* eslint-disable react-hooks/purity */
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
  time: string;
}

const quickReplies = [
  "Berapa biaya pendirian PT?",
  "Berapa lama prosesnya?",
  "Dokumen apa yang diperlukan?",
  "Apakah konsultasi gratis?",
];

const botResponses: Record<string, string> = {
  default:
    "Terima kasih sudah menghubungi Mitra Jasa Legalitas! Tim kami akan segera membantu. Untuk respons lebih cepat, silakan hubungi WhatsApp kami di +62 812-3456-7890.",
  biaya:
    "Biaya pendirian PT mulai dari Rp 3.500.000 tergantung jenis dan lokasi. Termasuk akta notaris, AHU, NPWP badan, dan NIB. Konsultasi gratis untuk estimasi biaya yang lebih akurat!",
  lama: "Proses pendirian PT umumnya 7–14 hari kerja jika dokumen lengkap. Kami akan memandu setiap langkahnya dan memberi update status secara berkala.",
  dokumen:
    "Dokumen yang perlu disiapkan: KTP & NPWP seluruh pendiri, fotokopi KK direktur utama, bukti domisili usaha (sewa/milik), dan modal yang akan dicantumkan dalam akta.",
  gratis:
    "Ya! Konsultasi awal kami sepenuhnya gratis dan tanpa komitmen. Anda bisa tanya soal jenis badan usaha, estimasi biaya, atau alur pengurusan sebelum memutuskan.",
};

function getBotReply(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("biaya") || lower.includes("harga") || lower.includes("tarif"))
    return botResponses.biaya;
  if (lower.includes("lama") || lower.includes("proses") || lower.includes("berapa hari"))
    return botResponses.lama;
  if (lower.includes("dokumen") || lower.includes("syarat") || lower.includes("berkas"))
    return botResponses.dokumen;
  if (lower.includes("gratis") || lower.includes("konsultasi") || lower.includes("free"))
    return botResponses.gratis;
  return botResponses.default;
}

function now() {
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const welcomeMessages: Message[] = [
  {
    id: "w1",
    role: "bot",
    text: "Halo! 👋 Selamat datang di **Mitra Jasa Legalitas**. Saya siap membantu pertanyaan seputar legalitas bisnis Anda.",
    time: now(),
  },
  {
    id: "w2",
    role: "bot",
    text: "Apa yang bisa saya bantu hari ini?",
    time: now(),
  },
];

function BotAvatar() {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: "oklch(0.3811 0.1315 260.22)" }}
    >
      <Bot className="w-4 h-4 text-white" />
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isBot = msg.role === "bot";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className={`flex items-end gap-2 ${isBot ? "justify-start" : "justify-end"}`}
    >
      {isBot && <BotAvatar />}
      <div className={`max-w-[75%] space-y-1 ${isBot ? "" : "items-end flex flex-col"}`}>
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isBot
              ? "bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-bl-sm"
              : "text-white rounded-br-sm"
          }`}
          style={!isBot ? { backgroundColor: "oklch(0.3811 0.1315 260.22)" } : {}}
          dangerouslySetInnerHTML={{
            __html: msg.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
          }}
        />
        <p className="text-[10px] text-gray-400 px-1">{msg.time}</p>
      </div>
    </motion.div>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(welcomeMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: text.trim(),
      time: now(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotReply(text);
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: "bot",
        text: reply,
        time: now(),
      };
      setMessages((m) => [...m, botMsg]);
      setIsTyping(false);
      if (!isOpen) setUnread((n) => n + 1);
    }, 1000 + Math.random() * 600);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleReset() {
    setMessages(welcomeMessages);
    setInput("");
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
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
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3.5 shrink-0"
              style={{ backgroundColor: "oklch(0.3811 0.1315 260.22)" }}
            >
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-tight">
                  Asisten MJL
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-xs text-white/70">Online sekarang</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  aria-label="Reset chat"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup chat"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-none">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="flex items-end gap-2"
                  >
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

              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/15 text-gray-600 dark:text-gray-300 hover:border-brand-blue hover:text-brand-blue dark:hover:text-brand-blue transition-colors whitespace-nowrap bg-surface-card"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 dark:border-white/8 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 text-sm px-3 py-2 rounded-full border border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/8 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-brand-blue transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim()}
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

      {/* FAB toggle button */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Tutup chat" : "Buka chat"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
        style={{ backgroundColor: "oklch(0.3811 0.1315 260.22)" }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {!isOpen && unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {!isOpen && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ backgroundColor: "oklch(0.3811 0.1315 260.22)" }}
          />
        )}
      </motion.button>
    </div>
  );
}
