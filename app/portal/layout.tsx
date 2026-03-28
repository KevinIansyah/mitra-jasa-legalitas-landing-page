import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiServer } from '@/lib/api/server';
import { User } from '@/lib/types/user';

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/masuk');
  }

  let user: User | null = null;

  try {
    user = await apiServer.get<User>('/auth/me');
  } catch {
    redirect('/masuk');
  }

  return (
    <div className="min-h-screen">
      <main>{children}</main>
    </div>
  );
}
