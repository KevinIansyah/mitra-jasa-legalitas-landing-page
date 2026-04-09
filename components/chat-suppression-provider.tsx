"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ChatSuppressionContextValue = {
  suppressed: boolean;
  addSuppression: () => void;
  removeSuppression: () => void;
};

const ChatSuppressionContext = createContext<ChatSuppressionContextValue | null>(null);

export function ChatSuppressionProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const addSuppression = useCallback(() => setCount((c) => c + 1), []);
  const removeSuppression = useCallback(() => setCount((c) => Math.max(0, c - 1)), []);
  const suppressed = count > 0;

  const value = useMemo(
    () => ({ suppressed, addSuppression, removeSuppression }),
    [suppressed, addSuppression, removeSuppression],
  );

  return <ChatSuppressionContext.Provider value={value}>{children}</ChatSuppressionContext.Provider>;
}

export function useChatSuppression() {
  const ctx = useContext(ChatSuppressionContext);
  if (!ctx) {
    throw new Error("useChatSuppression must be used within ChatSuppressionProvider");
  }
  return ctx;
}

/** Sembunyikan bubble chat selama komponen ini terpasang (untuk halaman error / not-found). */
export function SuppressChatBubble() {
  const { addSuppression, removeSuppression } = useChatSuppression();
  useEffect(() => {
    addSuppression();
    return () => removeSuppression();
  }, [addSuppression, removeSuppression]);
  return null;
}
