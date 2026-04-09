import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiServer } from "@/lib/api/server";
import type { User } from "@/lib/types/user";
import { getNavigation } from "@/lib/api/endpoints/navigation";
import { getInitialUserForNavbar } from "@/lib/auth/get-initial-user";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SettingsLayoutShell } from "./_components/settings-layout-shell";

export default async function PengaturanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/masuk");
  }

  try {
    await apiServer.get<User>("/auth/me");
  } catch {
    redirect("/masuk");
  }

  const [navigation, initialUser] = await Promise.all([
    getNavigation(),
    getInitialUserForNavbar(),
  ]);

  return (
    <>
      <Navbar navigation={navigation} initialUser={initialUser} />
      <main className="min-h-screen bg-surface-page">
        <SettingsLayoutShell>{children}</SettingsLayoutShell>
      </main>
      <Footer navigation={navigation} />
    </>
  );
}
