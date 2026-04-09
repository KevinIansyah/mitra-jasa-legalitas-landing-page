import type { Estimate } from "@/lib/types/estimate";

/**
 * Ringkasan untuk daftar / kartu / metadata: nama proyek selalu dari objek relasi
 * (`proposal.project_name` atau `quote.project_name`), bukan field di root estimasi.
 */
export function getEstimateListContext(row: Estimate): string {
  if (row.proposal) {
    const num = row.proposal.proposal_number?.trim();
    const name = row.proposal.project_name?.trim();
    if (num && name) return `${num} · ${name}`;
    if (num) return num;
    if (name) return name;
  }

  const quoteLinkId = row.quote?.id ?? row.quote_id;
  if (quoteLinkId != null) {
    const ref = row.quote?.reference_number?.trim();
    const name = row.quote?.project_name?.trim();
    const numPart = ref || `Permintaan #${quoteLinkId}`;
    if (name) return `${numPart} · ${name}`;
    return numPart;
  }

  return "-";
}
