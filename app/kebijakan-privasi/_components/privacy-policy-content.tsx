import { PortalHero } from "@/app/portal/_components/portal-hero";

/** Tanggal terakhir revisi teks halaman (ubah saat dokumen diperbarui). */
const LAST_UPDATED = new Date("2026-04-18T12:00:00+07:00");

export type PrivacyPolicyContentProps = {
  heroDescription: string;
};

export function PrivacyPolicyContent({ heroDescription }: PrivacyPolicyContentProps) {
  const updatedLabel = new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(LAST_UPDATED);

  return (
    <>
      <PortalHero title="Kebijakan Privasi" description={heroDescription} />

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <article>
          <p className="text-sm text-muted-foreground border-b border-gray-100 dark:border-white/10 pb-8 mb-8">Terakhir diperbarui: {updatedLabel}</p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Pendahuluan</h2>
              <p className="leading-relaxed text-sm">
                CV. Mitra Jasa Legalitas (&quot;kami&quot;, &quot;kita&quot;, atau &quot;Perusahaan&quot;) berkomitmen untuk melindungi privasi dan keamanan informasi pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi Anda ketika Anda menggunakan layanan kami.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">2. Informasi yang Kami Kumpulkan</h2>
              <p className="leading-relaxed text-sm">Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk namun tidak terbatas pada:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Nama lengkap dan informasi identitas</li>
                <li>Alamat email dan nomor telepon</li>
                <li>Alamat bisnis atau tempat tinggal</li>
                <li>Informasi perusahaan (untuk klien korporat)</li>
                <li>Dokumen legal dan perizinan yang diperlukan</li>
                <li>Informasi pembayaran dan transaksi</li>
                <li>Komunikasi dengan tim kami</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">3. Penggunaan Informasi</h2>
              <p className="leading-relaxed text-sm">Kami menggunakan informasi yang dikumpulkan untuk:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Menyediakan layanan legalitas dan perizinan yang Anda minta</li>
                <li>Memproses dokumen dan aplikasi legal</li>
                <li>Berkomunikasi dengan Anda mengenai layanan kami</li>
                <li>Memproses pembayaran dan transaksi</li>
                <li>Meningkatkan kualitas layanan kami</li>
                <li>Memenuhi kewajiban hukum dan regulasi</li>
                <li>Mencegah penipuan dan penyalahgunaan</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">4. Pembagian Informasi</h2>
              <p className="leading-relaxed text-sm">Kami hanya membagikan informasi Anda dalam situasi berikut:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Dengan instansi pemerintah terkait untuk proses perizinan</li>
                <li>Dengan mitra bisnis yang diperlukan untuk menyelesaikan layanan Anda</li>
                <li>Dengan persetujuan eksplisit dari Anda</li>
                <li>Untuk mematuhi kewajiban hukum atau perintah pengadilan</li>
                <li>Untuk melindungi hak, properti, atau keamanan Perusahaan dan pengguna lain</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">5. Keamanan Data</h2>
              <p className="leading-relaxed text-sm">
                Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Namun, tidak ada metode transmisi melalui internet atau penyimpanan elektronik yang 100% aman.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">6. Hak Anda</h2>
              <p className="leading-relaxed text-sm">Anda memiliki hak untuk:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Mengakses informasi pribadi yang kami miliki tentang Anda</li>
                <li>Meminta koreksi informasi yang tidak akurat</li>
                <li>Meminta penghapusan informasi Anda (dengan ketentuan tertentu)</li>
                <li>Menolak atau membatasi pemrosesan data Anda</li>
                <li>Menerima salinan data Anda dalam format yang dapat dibaca</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">7. Retensi Data</h2>
              <p className="leading-relaxed text-sm">
                Kami menyimpan informasi pribadi Anda selama diperlukan untuk tujuan yang dijelaskan dalam kebijakan ini, atau sesuai dengan kewajiban hukum dan regulasi yang berlaku. Dokumen legal dapat disimpan lebih lama sesuai dengan persyaratan hukum.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">8. Perubahan Kebijakan</h2>
              <p className="leading-relaxed text-sm">
                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberitahu Anda tentang perubahan material dengan memposting kebijakan baru di situs web kami. Penggunaan layanan kami setelah perubahan tersebut menunjukkan penerimaan Anda terhadap kebijakan yang diperbarui.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">9. Hubungi Kami</h2>
              <p className="leading-relaxed text-sm">Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau praktik privasi kami, silakan hubungi kami di:</p>
              <p className="mt-2 leading-relaxed text-sm">
                Email:{" "}
                <a href="mailto:mitrajasalegalitas@gmail.com" className="text-brand-blue hover:underline">
                  mitrajasalegalitas@gmail.com
                </a>
                <br />
                Telepon:{" "}
                <a href="tel:+6282143525559" className="text-brand-blue hover:underline">
                  082143525559
                </a>
                <br />
                Alamat: JL. Medayu Selatan XVIII No.11 Surabaya, Jawa Timur 60291
              </p>
            </section>
          </div>
        </article>
      </div>
    </>
  );
}
