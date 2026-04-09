import { apiServer } from "@/lib/api/server";
import { normalizeUnreadCount, type NotificationsListData } from "@/lib/types/notification";

export async function getNotificationsPage(page = 1): Promise<NotificationsListData> {
  const search = new URLSearchParams({ page: String(page) });
  return apiServer.get<NotificationsListData>(`/notifications?${search.toString()}`);
}

/** GET /notifications/unread-count (server / RSC) */
export async function getUnreadCount(): Promise<number> {
  const raw = await apiServer.get<unknown>("/notifications/unread-count");
  return normalizeUnreadCount(raw);
}
