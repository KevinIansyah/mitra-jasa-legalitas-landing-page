import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiServer } from '@/lib/api/server';
import { User } from '@/lib/types/user';
import { AuthBlobs } from './_components/auth-blobs';
import { AuthSessionGuard } from './_components/auth-session-guard';

/**
 * Layout route group `(auth)` — URL tidak berubah (mis. tetap `/masuk`).
 * Tampilan gelap terpusat seperti halaman login modern + blob seperti hero home.
 *
 * Pengguna yang sudah login (token valid + `/auth/me` OK) tidak boleh mengakses
 * halaman auth — dialihkan ke beranda.
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (token) {
    try {
      await apiServer.get<User>('/auth/me');
      redirect('/');
    } catch {
      // Token tidak valid — biarkan lanjut (form auth / refresh token di client).
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface-page text-foreground flex flex-col items-center justify-center px-4 py-10 sm:py-14">
      <AuthSessionGuard />
      <AuthBlobs />
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
