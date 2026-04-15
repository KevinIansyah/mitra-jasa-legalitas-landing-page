"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Bell, ChevronRight, FileText, Loader2 } from "lucide-react";
import {
  fetchNotificationsPage,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/endpoints/notifications";
import type { NotificationItem, NotificationsListData } from "@/lib/types/notification";
import { ApiError } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { PortalEmptyState } from "@/app/portal/_components/portal-empty-state";

function actionPath(actionUrl: string): string {
  try {
    const u = new URL(actionUrl);
    return `${u.pathname}${u.search}`;
  } catch {
    return actionUrl.startsWith("/") ? actionUrl : `/${actionUrl}`;
  }
}

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function PayloadIcon({ icon }: { icon?: string }) {
  const key = icon?.toLowerCase() ?? "";
  if (key === "invoice") {
    return <FileText className="size-5 shrink-0 text-brand-blue" aria-hidden />;
  }
  return <Bell className="size-5 shrink-0 text-brand-blue" aria-hidden />;
}

function NotificationRow({
  item,
  onMarkedRead,
}: {
  item: NotificationItem;
  onMarkedRead: (id: NotificationItem["id"]) => void;
}) {
  const unread = item.read_at == null;
  const href = actionPath(item.data.action_url);

  return (
    <Link
      href={href}
      onClick={() => {
        if (!unread) return;
        void markNotificationRead(item.id)
          .then(() => onMarkedRead(item.id))
          .catch(() => {});
      }}
      className={cn(
        "group flex gap-4 rounded-2xl border p-4 transition-colors",
        unread
          ? "border-brand-blue/30 bg-brand-blue/6 dark:bg-brand-blue/10"
          : "border-gray-200 dark:border-white/10 bg-white dark:bg-surface-card hover:bg-gray-50/80 dark:hover:bg-white/5",
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 dark:bg-brand-blue/15">
        <PayloadIcon icon={item.data.icon} />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.data.title}</p>
          <time className="shrink-0 text-[11px] text-muted-foreground" dateTime={item.created_at}>
            {formatWhen(item.created_at)}
          </time>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.data.message}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue">
          Lihat detail
          <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

type Props = {
  initial: NotificationsListData;
};

export function NotificationsList({ initial }: Props) {
  const [items, setItems] = useState<NotificationItem[]>(initial.notifications);
  const [unreadCount, setUnreadCount] = useState(initial.unread_count);
  const [meta, setMeta] = useState(initial.meta);
  const [loading, setLoading] = useState(false);
  const [readAllLoading, setReadAllLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = meta.current_page < meta.last_page;

  const handleMarkedRead = useCallback((id: NotificationItem["id"]) => {
    const iso = new Date().toISOString();
    setItems((prev) =>
      prev.map((n) => (String(n.id) === String(id) ? { ...n, read_at: iso } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const handleReadAll = useCallback(async () => {
    if (unreadCount === 0 || readAllLoading) return;
    setReadAllLoading(true);
    setError(null);
    try {
      await markAllNotificationsRead();
      const iso = new Date().toISOString();
      setItems((prev) => prev.map((n) => (n.read_at == null ? { ...n, read_at: iso } : n)));
      setUnreadCount(0);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Gagal menandai semua sebagai dibaca.");
    } finally {
      setReadAllLoading(false);
    }
  }, [unreadCount, readAllLoading]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const next = await fetchNotificationsPage(meta.current_page + 1);
      setItems((prev) => [...prev, ...next.notifications]);
      setUnreadCount(next.unread_count);
      setMeta(next.meta);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Gagal memuat notifikasi.");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, meta.current_page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0 ? (
            <>
              <span className="font-semibold text-gray-900 dark:text-white">{unreadCount}</span> belum dibaca
            </>
          ) : (
            "Semua sudah dibaca"
          )}
          {meta.total > 0 && (
            <span className="text-muted-foreground">
              {" "}
              · {meta.total} total
            </span>
          )}
        </p>
        {meta.total > 0 && unreadCount > 0 ? (
          <button
            type="button"
            onClick={() => void handleReadAll()}
            disabled={readAllLoading}
            className="text-sm font-semibold text-brand-blue hover:underline disabled:opacity-50"
          >
            {readAllLoading ? "Memproses..." : "Tandai semua dibaca"}
          </button>
        ) : null}
      </div>

      {error && (
        <p className="rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {items.length === 0 ? (
        <PortalEmptyState
          icon={Bell}
          title="Belum ada notifikasi"
          description="Notifikasi pembayaran, faktur, dan lainnya akan muncul di sini."
        />
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id}>
              <NotificationRow item={item} onMarkedRead={handleMarkedRead} />
            </li>
          ))}
        </ul>
      )}

      {hasMore && items.length > 0 && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:border-brand-blue hover:text-brand-blue disabled:opacity-50 dark:border-white/15 dark:bg-surface-card dark:text-gray-200 dark:hover:border-brand-blue"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Memuat...
              </>
            ) : (
              "Muat lebih banyak"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
