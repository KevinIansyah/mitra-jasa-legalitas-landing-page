const STORAGE_VERSION = 1 as const;
const THREAD_KEY = "mjl_chat_thread_messages";
const MAX_MESSAGES = 100;

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
};

function isMessage(x: unknown): x is ChatThreadMessage {
  if (typeof x !== "object" || x === null) return false;
  const m = x as Record<string, unknown>;
  return (
    typeof m.id === "string" &&
    (m.role === "bot" || m.role === "user") &&
    typeof m.text === "string" &&
    typeof m.time === "string"
  );
}

export function loadThreadMessages(token: string): ChatThreadMessage[] | null {
  if (typeof window === "undefined" || !token) return null;
  try {
    const raw = localStorage.getItem(THREAD_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Persisted;
    if (data.v !== STORAGE_VERSION || data.token !== token) return null;
    if (!Array.isArray(data.messages)) return null;
    const messages = data.messages.filter(isMessage);
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
    const payload: Persisted = {
      v: STORAGE_VERSION,
      token,
      messages: sliced,
    };
    localStorage.setItem(THREAD_KEY, JSON.stringify(payload));
  } catch {
    try {
      const smaller = messages.slice(-50);
      localStorage.setItem(
        THREAD_KEY,
        JSON.stringify({
          v: STORAGE_VERSION,
          token,
          messages: smaller,
        } satisfies Persisted),
      );
    } catch {
      /* quota */
    }
  }
}

export function clearThreadMessages(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(THREAD_KEY);
  } catch {
    /* ignore */
  }
}
