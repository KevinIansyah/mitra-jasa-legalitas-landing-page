import { PortalHero } from "@/app/portal/_components/portal-hero";

/** Tanggal terakhir revisi teks halaman (ubah saat dokumen diperbarui). */
const LAST_UPDATED = new Date("2026-04-18T12:00:00+07:00");

export type TermsOfServiceContentProps = {
  heroDescription: string;
};

export function TermsOfServiceContent({ heroDescription }: TermsOfServiceContentProps) {
  const updatedLabel = new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(LAST_UPDATED);

  return (
    <>
      <PortalHero title="Syarat dan Ketentuan Layanan" description={heroDescription} />

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <article>
          <p className="text-sm text-muted-foreground border-b border-gray-100 dark:border-white/10 pb-8 mb-8">Terakhir diperbarui: {updatedLabel}</p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">1. Penerimaan Syarat</h2>
              <p className="leading-relaxed text-sm">
                Dengan mengakses dan menggunakan layanan CV. Mitra Jasa Legalitas (&quot;Layanan&quot;), Anda setuju untuk terikat oleh Syarat dan Ketentuan Layanan ini. Jika Anda tidak setuju dengan
                syarat ini, mohon untuk tidak menggunakan layanan kami.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">2. Deskripsi Layanan</h2>
              <p className="leading-relaxed text-sm">Kami menyediakan layanan konsultasi dan pengurusan legalitas usaha, termasuk namun tidak terbatas pada:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Pendirian dan penutupan badan usaha (PT, CV, UD)</li>
                <li>Pengurusan perizinan bisnis dan operasional</li>
                <li>Sertifikasi ISO dan standar kualitas lainnya</li>
                <li>Perizinan konstruksi (SBU, SKA, SIUJK)</li>
                <li>Pembuatan dan peninjauan dokumen legal</li>
                <li>Layanan virtual office dan digital marketing</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">3. Kewajiban Klien</h2>
              <p className="leading-relaxed text-sm">Sebagai klien, Anda berkewajiban untuk:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Memberikan informasi dan dokumen yang akurat dan lengkap</li>
                <li>Menanggapi permintaan informasi tambahan dengan segera</li>
                <li>Melakukan pembayaran sesuai dengan kesepakatan</li>
                <li>Mematuhi semua hukum dan regulasi yang berlaku</li>
                <li>Tidak menggunakan layanan untuk tujuan ilegal atau penipuan</li>
                <li>Bertanggung jawab atas keakuratan dokumen yang diserahkan</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">4. Pembayaran dan Pengembalian Dana</h2>
              <p className="leading-relaxed text-sm">Ketentuan pembayaran:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Pembayaran harus dilakukan sesuai dengan invoice yang diterbitkan</li>
                <li>Biaya layanan dapat berbeda tergantung kompleksitas kasus</li>
                <li>Pembayaran dapat dilakukan melalui transfer bank atau metode yang disepakati</li>
                <li>Pengembalian dana hanya berlaku jika layanan tidak dapat diselesaikan karena kesalahan kami</li>
                <li>Biaya yang sudah dibayarkan tidak dapat dikembalikan jika pembatalan dilakukan oleh klien setelah proses dimulai</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">5. Waktu Penyelesaian</h2>
              <p className="leading-relaxed text-sm">
                Estimasi waktu penyelesaian yang diberikan adalah perkiraan dan dapat berubah tergantung pada berbagai faktor, termasuk kelengkapan dokumen, respons dari instansi terkait, dan
                kompleksitas kasus. Kami berkomitmen untuk menyelesaikan layanan sesuai waktu yang disepakati, namun penundaan yang disebabkan oleh pihak ketiga atau kondisi di luar kendali kami tidak
                menjadi tanggung jawab kami.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">6. Kerahasiaan</h2>
              <p className="leading-relaxed text-sm">
                Kami menjaga kerahasiaan semua informasi dan dokumen klien. Informasi hanya akan dibagikan dengan pihak ketiga yang diperlukan untuk menyelesaikan layanan (seperti instansi pemerintah)
                atau dengan persetujuan eksplisit dari Anda. Kami tidak akan menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga untuk tujuan pemasaran.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">7. Batasan Tanggung Jawab</h2>
              <p className="leading-relaxed text-sm">Kami tidak bertanggung jawab atas:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm ">
                <li>Penolakan aplikasi atau perizinan oleh instansi pemerintah</li>
                <li>Keterlambatan yang disebabkan oleh kelengkapan dokumen dari klien</li>
                <li>Perubahan regulasi atau kebijakan pemerintah setelah layanan dimulai</li>
                <li>Kerugian tidak langsung atau konsekuensial yang timbul dari penggunaan layanan</li>
                <li>Kesalahan informasi yang diberikan oleh klien</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">8. Hak Kekayaan Intelektual</h2>
              <p className="leading-relaxed text-sm">
                Semua konten, merek dagang, dan materi yang terdapat dalam website dan layanan kami adalah milik CV. Mitra Jasa Legalitas atau pemberi lisensi kami. Anda tidak diperkenankan untuk
                menggunakan, mereproduksi, atau mendistribusikan konten kami tanpa izin tertulis.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">9. Perubahan Layanan</h2>
              <p className="leading-relaxed text-sm">
                Kami berhak untuk memodifikasi, menangguhkan, atau menghentikan layanan atau bagian dari layanan kapan saja dengan atau tanpa pemberitahuan. Kami tidak bertanggung jawab kepada Anda
                atau pihak ketiga atas modifikasi, penangguhan, atau penghentian layanan.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">10. Hukum yang Berlaku</h2>
              <p className="leading-relaxed text-sm">
                Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia. Setiap perselisihan yang timbul dari atau berkaitan dengan layanan kami akan diselesaikan
                melalui musyawarah. Jika tidak tercapai kesepakatan, perselisihan akan diselesaikan melalui pengadilan yang berwenang di Surabaya, Indonesia.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">11. Perubahan Syarat dan Ketentuan</h2>
              <p className="leading-relaxed text-sm">
                Kami dapat memperbarui Syarat dan Ketentuan ini dari waktu ke waktu. Perubahan akan efektif segera setelah diposting di website kami. Penggunaan layanan kami setelah perubahan tersebut
                menunjukkan penerimaan Anda terhadap syarat yang diperbarui.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">12. Kontak</h2>
              <p className="leading-relaxed text-sm">Untuk pertanyaan mengenai Syarat dan Ketentuan ini, silakan hubungi kami di:</p>
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
