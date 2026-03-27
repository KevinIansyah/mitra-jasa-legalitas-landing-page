import { getNavigation } from '@/lib/api/endpoints/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default async function LayananLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = await getNavigation();

  return (
    <>
      <Navbar navigation={navigation} />
      <main>{children}</main>
      <Footer navigation={navigation} />
    </>
  );
}
