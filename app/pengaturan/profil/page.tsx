import { apiServer } from "@/lib/api/server";
import type { User } from "@/lib/types/user";
import { SettingsProfileForm } from "../_components/settings-profile-form";

export default async function ProfilPengaturanPage() {
  const user = await apiServer.get<User>("/auth/me");
  
  return <SettingsProfileForm initialUser={user} />;
}
