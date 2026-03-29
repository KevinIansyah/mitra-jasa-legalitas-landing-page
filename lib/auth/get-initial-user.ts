import { cookies } from 'next/headers';
import { apiServer } from '@/lib/api/server';
import { User } from '@/lib/types/user';

export async function getInitialUserForNavbar(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    return await apiServer.get<User>('/auth/me');
  } catch {
    return null;
  }
}
