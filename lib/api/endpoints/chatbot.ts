import { apiClient } from "@/lib/api/client";

export const CHATBOT_SESSION_STORAGE_KEY = "mjl_chat_session_token";

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

export async function postChatbotMessage(sessionToken: string, message: string): Promise<ChatbotSendResponse> {
  const token = encodeURIComponent(sessionToken);
  return apiClient.post<ChatbotSendResponse>(`/chatbots/${token}/send`, {
    message,
  });
}

export async function patchChatbotLead(sessionToken: string, body: { name?: string | null; email?: string | null; phone?: string | null }): Promise<{ message: string }> {
  const token = encodeURIComponent(sessionToken);
  return apiClient.patch<{ message: string }>(`/chatbots/${token}/lead`, body);
}

export function isChatbotSendOffline(data: ChatbotSendResponse): data is ChatbotSendOffline {
  return "enabled" in data && data.enabled === false;
}
