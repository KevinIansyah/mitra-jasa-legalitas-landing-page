/** Label singkat untuk ditampilkan ke klien (selaras dengan validasi unggah). */
export function getProjectDocumentFormatLabel(documentFormat: string | null | undefined): string | null {
  const f = (documentFormat ?? "").toLowerCase().trim();
  if (!f) return null;
  if (f === "jpg" || f === "jpeg") return "JPG atau PNG";
  if (f === "pdf") return "PDF";
  if (f === "doc" || f === "docx") return "DOC atau DOCX";
  if (f === "xls" || f === "xlsx") return "XLS atau XLSX";
  return f.toUpperCase();
}
