import Link from 'next/link';

export default function PortalPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
        Portal
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Anda sudah masuk. Halaman ini dapat dikembangkan untuk dashboard klien.
      </p>
      <Link
        href="/"
        className="text-sm font-semibold text-brand-blue hover:underline"
      >
        ← Kembali ke beranda
      </Link>
    </div>
  );
}
