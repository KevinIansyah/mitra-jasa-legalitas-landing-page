import { getNavigation } from '@/lib/api/endpoints/navigation';
import { getInitialUserForNavbar } from '@/lib/auth/get-initial-user';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navigation, initialUser] = await Promise.all([
    getNavigation(),
    getInitialUserForNavbar(),
  ]);

  return (
    <>
      <Navbar navigation={navigation} initialUser={initialUser} />
      <main>{children}</main>
      <Footer navigation={navigation} />
    </>
  );
}
