import type { PaginationMeta } from "@/lib/types/api";

export function normalizeUnreadCount(payload: unknown): number {
  if (typeof payload === "number" && Number.isFinite(payload)) {
    return Math.max(0, Math.floor(payload));
  }
  if (payload && typeof payload === "object") {
    const o = payload as Record<string, unknown>;
    for (const key of ["unread_count", "count", "unread"] as const) {
      const v = o[key];
      if (typeof v === "number" && Number.isFinite(v)) {
        return Math.max(0, Math.floor(v));
      }
    }
  }
  return 0;
}

export type NotificationPayload = {
  title: string;
  message: string;
  action_url: string;
  icon?: string;
  type?: string;
  meta?: Record<string, unknown>;
};

export type NotificationItem = {
  id: string;
  type: string;
  data: NotificationPayload;
  read_at: string | null;
  created_at: string;
};

export type NotificationsListData = {
  notifications: NotificationItem[];
  unread_count: number;
  meta: PaginationMeta;
};
