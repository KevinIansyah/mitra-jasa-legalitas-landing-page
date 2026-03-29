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

export function formatBusinessHoursLine(bh: BusinessHours): string {
  const monFri = ['mon', 'tue', 'wed', 'thu', 'fri'] as const;
  const first = bh.mon;
  const sameWeekdays =
    !!first &&
    monFri.every((weekdayKey) => bh[weekdayKey] != null) &&
    monFri.every((weekdayKey) => bh[weekdayKey] === first);

  const parts: string[] = [];

  if (sameWeekdays && first) {
    parts.push(`Sen-Jum ${first}`);
  } else {
    for (const weekdayKey of monFri) {
      const hoursText = bh[weekdayKey];
      if (hoursText) parts.push(`${DAY_SHORT[weekdayKey]} ${hoursText}`);
    }
  }

  if (bh.sat) parts.push(`Sab ${bh.sat}`);
  if (bh.sun) parts.push(`Min ${bh.sun}`);
  else if (bh.sat && !bh.sun) parts.push('Min tutup');

  return parts.join(' · ') || '-';
}
