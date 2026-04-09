import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiServer } from "@/lib/api/server";
import type { User } from "@/lib/types/user";
import { getNavigation } from "@/lib/api/endpoints/navigation";
import { getInitialUserForNavbar } from "@/lib/auth/get-initial-user";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PortalLayoutShell } from "./_components/portal-layout-shell";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
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
        <PortalLayoutShell>{children}</PortalLayoutShell>
      </main>
      <Footer navigation={navigation} />
    </>
  );
}
