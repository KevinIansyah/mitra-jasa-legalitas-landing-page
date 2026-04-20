import { apiClient } from "@/lib/api/client";

export const CHATBOT_SESSION_STORAGE_KEY = "mjl_chat_session_token";

/** URL halaman saat ini untuk konteks chatbot (hanya browser). */
export function getChatbotClientPageUrl(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.location.href;
  } catch {
    return "";
  }
}

export type ChatbotSessionOk = {
  enabled: true;
  session_token: string;
  is_converted: boolean;
  lead: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
};

export type ChatbotSessionOffline = {
  enabled: false;
  offline_message: string;
  whatsapp: string | null;
};

export type ChatbotSessionResponse = ChatbotSessionOk | ChatbotSessionOffline;

export type ChatbotSendOk = {
  message: string;
  tokens_used: number;
};

export type ChatbotSendOffline = {
  enabled: false;
  offline_message: string;
  whatsapp?: string | null;
};

export type ChatbotSendResponse = ChatbotSendOk | ChatbotSendOffline;

export async function postChatbotSession(body: { session_token?: string | null; page_url?: string }): Promise<ChatbotSessionResponse> {
  return apiClient.post<ChatbotSessionResponse>("/chatbots/session", body);
}

export async function postChatbotMessage(sessionToken: string, message: string, pageUrl?: string): Promise<ChatbotSendResponse> {
  const token = encodeURIComponent(sessionToken);
  const page_url = pageUrl ?? getChatbotClientPageUrl();
  return apiClient.post<ChatbotSendResponse>(`/chatbots/${token}/send`, {
    message,
    page_url,
  });
}

export type ChatbotLeadPatchBody = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  page_url?: string;
};

export async function patchChatbotLead(sessionToken: string, body: ChatbotLeadPatchBody): Promise<{ message: string }> {
  const token = encodeURIComponent(sessionToken);
  const page_url = body.page_url ?? getChatbotClientPageUrl();
  return apiClient.patch<{ message: string }>(`/chatbots/${token}/lead`, {
    ...body,
    page_url,
  });
}

export function isChatbotSendOffline(data: ChatbotSendResponse): data is ChatbotSendOffline {
  return "enabled" in data && data.enabled === false;
}
