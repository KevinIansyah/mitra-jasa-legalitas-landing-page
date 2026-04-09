import { apiClient } from "@/lib/api/client";
import { normalizeUnreadCount, type NotificationsListData } from "@/lib/types/notification";

export async function fetchNotificationsPage(page = 1): Promise<NotificationsListData> {
  const search = new URLSearchParams({ page: String(page) });
  return apiClient.get<NotificationsListData>(`/notifications?${search.toString()}`);
}

/** GET /notifications/unread-count */
export async function fetchUnreadCount(): Promise<number> {
  const raw = await apiClient.get<unknown>("/notifications/unread-count");
  return normalizeUnreadCount(raw);
}

/** POST /notifications/{id}/read */
export async function markNotificationRead(notificationId: string | number): Promise<void> {
  const id = encodeURIComponent(String(notificationId));
  await apiClient.post<unknown>(`/notifications/${id}/read`);
}

/** POST /notifications/read-all */
export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.post<unknown>("/notifications/read-all");
}
