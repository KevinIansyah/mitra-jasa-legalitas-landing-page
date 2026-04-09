import { CHATBOT_SESSION_STORAGE_KEY } from "@/lib/api/endpoints/chatbot";

const STORAGE_VERSION = 2 as const;
const THREAD_KEY = "mjl_chat_thread_messages";
const MAX_MESSAGES = 100;

export const CHAT_THREAD_RETENTION_MS = 12 * 60 * 60 * 1000;

export type ChatThreadMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
  time: string;
};

export const MOCK_THREAD_TOKEN = "__mock__";

type Persisted = {
  v: typeof STORAGE_VERSION;
  token: string;
  messages: ChatThreadMessage[];
  savedAt: number;
};

function isMessage(candidate: unknown): candidate is ChatThreadMessage {
  if (typeof candidate !== "object" || candidate === null) return false;
  const record = candidate as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    (record.role === "bot" || record.role === "user") &&
    typeof record.text === "string" &&
    typeof record.time === "string"
  );
}

function isPersisted(candidate: unknown): candidate is Persisted {
  if (typeof candidate !== "object" || candidate === null) return false;
  const record = candidate as Record<string, unknown>;
  return (
    record.v === STORAGE_VERSION &&
    typeof record.token === "string" &&
    Array.isArray(record.messages) &&
    typeof record.savedAt === "number"
  );
}

function clearThreadStorageOnly(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(THREAD_KEY);
  } catch {
    /* ignore */
  }
}

export function loadThreadMessages(token: string): ChatThreadMessage[] | null {
  if (typeof window === "undefined" || !token) return null;
  try {
    const raw = localStorage.getItem(THREAD_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isPersisted(parsed) || parsed.token !== token) {
      clearThreadStorageOnly();
      return null;
    }
    if (Date.now() - parsed.savedAt > CHAT_THREAD_RETENTION_MS) {
      clearThreadStorageOnly();
      return null;
    }
    if (!Array.isArray(parsed.messages)) return null;
    const messages = parsed.messages.filter(isMessage);
    return messages.length > 0 ? messages : null;
  } catch {
    return null;
  }
}

export function saveThreadMessages(
  token: string,
  messages: ChatThreadMessage[],
): void {
  if (typeof window === "undefined" || !token) return;
  try {
    const sliced = messages.slice(-MAX_MESSAGES);
    const now = Date.now();
    const payload: Persisted = {
      v: STORAGE_VERSION,
      token,
      messages: sliced,
      savedAt: now,
    };
    localStorage.setItem(THREAD_KEY, JSON.stringify(payload));
  } catch {
    try {
      const smaller = messages.slice(-50);
      const now = Date.now();
      localStorage.setItem(
        THREAD_KEY,
        JSON.stringify({
          v: STORAGE_VERSION,
          token,
          messages: smaller,
          savedAt: now,
        } satisfies Persisted),
      );
    } catch {
      /* quota */
    }
  }
}

export function clearChatWidgetStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(THREAD_KEY);
    localStorage.removeItem(CHATBOT_SESSION_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function clearThreadMessages(): void {
  clearChatWidgetStorage();
}

export function pruneExpiredChatStorageIfNeeded(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(THREAD_KEY);
    if (!raw) return;
    const parsed: unknown = JSON.parse(raw);
    if (!isPersisted(parsed)) {
      clearChatWidgetStorage();
      return;
    }
    if (Date.now() - parsed.savedAt > CHAT_THREAD_RETENTION_MS) {
      clearChatWidgetStorage();
    }
  } catch {
    clearChatWidgetStorage();
  }
}
