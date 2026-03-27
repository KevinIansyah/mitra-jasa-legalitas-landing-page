import type { BusinessHours } from '@/lib/types/company-information';

const DAY_SHORT: Record<string, string> = {
  mon: 'Sen',
  tue: 'Sel',
  wed: 'Rab',
  thu: 'Kam',
  fri: 'Jum',
  sat: 'Sab',
  sun: 'Min',
};

/**
 * Ringkas untuk UI (satu baris jika pola Sen–Jum sama).
 */
export function formatBusinessHoursLine(bh: BusinessHours): string {
  const monFri = ['mon', 'tue', 'wed', 'thu', 'fri'] as const;
  const first = bh.mon;
  const sameWeekdays =
    !!first &&
    monFri.every((d) => bh[d] != null) &&
    monFri.every((d) => bh[d] === first);

  const parts: string[] = [];

  if (sameWeekdays && first) {
    parts.push(`Sen–Jum ${first}`);
  } else {
    for (const d of monFri) {
      const v = bh[d];
      if (v) parts.push(`${DAY_SHORT[d]} ${v}`);
    }
  }

  if (bh.sat) parts.push(`Sab ${bh.sat}`);
  if (bh.sun) parts.push(`Min ${bh.sun}`);
  else if (bh.sat && !bh.sun) parts.push('Min tutup');

  return parts.join(' · ') || '—';
}
