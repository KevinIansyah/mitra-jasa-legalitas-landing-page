import type { Metadata } from "next";
import { getNotificationsPage } from "@/lib/api/endpoints/notifications.server";
import { NotificationsList } from "./_components/notifications-list";

export const metadata: Metadata = {
  title: "Notifikasi",
};

export default async function PortalNotificationsPage() {
  const initial = await getNotificationsPage(1);

  return (
    <section className="w-full">
      <header className="mb-8">
        <h1 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Notifikasi</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Pembayaran, faktur, dan pembaruan penting dari akun portal Anda.
        </p>
      </header>

      <NotificationsList initial={initial} />
    </section>
  );
}
