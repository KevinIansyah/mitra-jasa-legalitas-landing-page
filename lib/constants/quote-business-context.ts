export const CATEGORY_BUSINESS = [
  { value: "perdagangan", label: "Perdagangan", classes: "bg-blue-500 text-white" },
  { value: "retail", label: "Retail", classes: "bg-blue-600 text-white" },
  { value: "fnb", label: "Food & Beverage", classes: "bg-rose-500 text-white" },
  { value: "jasa", label: "Jasa", classes: "bg-emerald-500 text-white" },
  { value: "manufaktur", label: "Manufaktur", classes: "bg-slate-700 text-white" },
  { value: "konstruksi", label: "Konstruksi", classes: "bg-orange-500 text-white" },
  { value: "properti", label: "Properti & Real Estate", classes: "bg-indigo-500 text-white" },
  { value: "teknologi", label: "Teknologi Informasi", classes: "bg-sky-500 text-white" },
  { value: "telekomunikasi", label: "Telekomunikasi", classes: "bg-sky-700 text-white" },
  { value: "keuangan", label: "Keuangan", classes: "bg-amber-500 text-slate-900" },
  { value: "transportasi", label: "Transportasi & Logistik", classes: "bg-cyan-600 text-white" },
  { value: "pariwisata", label: "Pariwisata", classes: "bg-teal-500 text-white" },
  { value: "perhotelan", label: "Perhotelan", classes: "bg-teal-700 text-white" },
  { value: "kesehatan", label: "Kesehatan", classes: "bg-red-500 text-white" },
  { value: "pendidikan", label: "Pendidikan", classes: "bg-violet-500 text-white" },
  { value: "pertanian", label: "Pertanian & Perkebunan", classes: "bg-lime-600 text-white" },
  { value: "perikanan", label: "Perikanan", classes: "bg-blue-400 text-white" },
  { value: "peternakan", label: "Peternakan", classes: "bg-green-700 text-white" },
  { value: "pertambangan", label: "Pertambangan", classes: "bg-stone-700 text-white" },
  { value: "energi", label: "Energi", classes: "bg-yellow-500 text-black" },
  { value: "industri_kreatif", label: "Industri Kreatif", classes: "bg-pink-500 text-white" },
  { value: "lingkungan", label: "Lingkungan & Pengolahan Limbah", classes: "bg-green-600 text-white" },
  { value: "lainnya", label: "Lainnya", classes: "bg-muted text-muted-foreground" },
] as const;

export const CATEGORY_BUSINESS_MAP = Object.fromEntries(CATEGORY_BUSINESS.map((item) => [item.value, item])) as Record<string, (typeof CATEGORY_BUSINESS)[number]>;

export const STATUS_LEGAL = [
  { value: "belum_ada", label: "Belum Ada Legalitas", classes: "bg-gray-400 text-white" },
  { value: "pt", label: "Perseroan Terbatas (PT)", classes: "bg-indigo-500 text-white" },
  { value: "pt_perorangan", label: "PT Perorangan", classes: "bg-indigo-400 text-white" },
  { value: "pt_pma", label: "PT PMA (Penanaman Modal Asing)", classes: "bg-indigo-700 text-white" },
  { value: "cv", label: "Commanditaire Vennootschap (CV)", classes: "bg-sky-500 text-white" },
  { value: "firma", label: "Firma", classes: "bg-emerald-500 text-white" },
  { value: "persekutuan_perdata", label: "Persekutuan Perdata", classes: "bg-emerald-400 text-white" },
  { value: "ud", label: "Usaha Dagang (UD)", classes: "bg-amber-600 text-white" },
  { value: "perorangan", label: "Usaha Perorangan", classes: "bg-amber-500 text-slate-900" },
  { value: "koperasi", label: "Koperasi", classes: "bg-lime-500 text-slate-900" },
  { value: "yayasan", label: "Yayasan", classes: "bg-violet-500 text-white" },
  { value: "bumdes", label: "BUMDes", classes: "bg-green-600 text-white" },
  { value: "lainnya", label: "Lainnya", classes: "bg-muted text-muted-foreground" },
] as const;

export const STATUS_LEGAL_MAP = Object.fromEntries(STATUS_LEGAL.map((item) => [item.value, item])) as Record<string, (typeof STATUS_LEGAL)[number]>;

function fallbackLabel(raw: string): string {
  if (!raw.trim()) return "-";
  return raw
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function getBusinessCategoryMeta(value: string): { label: string; classes: string } {
  const found = CATEGORY_BUSINESS.find((x) => x.value === value);
  if (found) return { label: found.label, classes: found.classes };
  return { label: fallbackLabel(value), classes: "bg-slate-500 text-white dark:bg-slate-600" };
}

export function getLegalStatusMeta(value: string): { label: string; classes: string } {
  const found = STATUS_LEGAL.find((x) => x.value === value);
  if (found) return { label: found.label, classes: found.classes };
  return { label: fallbackLabel(value), classes: "bg-slate-500 text-white dark:bg-slate-600" };
}
