/**
 * Fallback logo/nama klien jika `client_companies` dari API kosong atau tidak ada.
 */
export type ClientLogoItem = {
  id: string;
  name: string;
  sector?: string;
  logoUrl?: string | null;
};

export const DUMMY_CLIENT_LOGOS: ClientLogoItem[] = [
  { id: "1", name: "PT Global Niaga Sejahtera", sector: "Perdagangan" },
  { id: "2", name: "CV Berkah Abadi Mandiri", sector: "Jasa & konsultan" },
  { id: "3", name: "PT Andalan Teknologi Digital", sector: "Teknologi" },
  { id: "4", name: "UD Sumber Rejeki Farm", sector: "Agrobisnis" },
  { id: "5", name: "PT Karya Bangun Properti", sector: "Properti" },
  { id: "6", name: "PT Mitra Logistik Nusantara", sector: "Logistik" },
  { id: "7", name: "CV Kreasi Kuliner Nusantara", sector: "F&B" },
  { id: "8", name: "PT Energi Hijau Indonesia", sector: "Energi" },
];
