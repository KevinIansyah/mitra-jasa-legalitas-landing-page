import { apiClient } from "@/lib/api/client";
import type { User } from "@/lib/types/user";

export async function postSettingsProfile(body: {
  name: string;
  avatar?: File | null;
  remove_avatar?: boolean;
}): Promise<User> {
  const formData = new FormData();
  formData.set("name", body.name.trim());
  
  if (body.avatar) {
    formData.set("avatar", body.avatar);
  }

  if (body.remove_avatar) {
    formData.set("remove_avatar", "1");
  }

  return apiClient.postFormData<User>("/settings/profile", formData);
}

export type SettingsPasswordBody = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

export async function putSettingsPassword(
  body: SettingsPasswordBody,
): Promise<{ message?: string } | void> {
  return apiClient.put<{ message?: string } | void>("/settings/password", {
    current_password: body.current_password,
    password: body.password,
    password_confirmation: body.password_confirmation,
  });
}
