"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProofUploadZone } from "@/app/portal/faktur/_components/proof-upload-zone";
import { getProjectDocumentFormatLabel } from "@/lib/constants/project-document-format";
import { uploadProjectDocument } from "@/lib/api/endpoints/projects";
import type { ProjectDetail, ProjectDocument } from "@/lib/types/project";
import { ApiError } from "@/lib/types/api";
import { cn, firstApiValidationMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const MAX_FILE_BYTES = 5120 * 1024;

function getDocumentUploadAccept(documentFormat: string | null | undefined): { accept: string; hint: string; emptyHint: string } {
  const f = (documentFormat ?? "").toLowerCase().trim();
  if (f === "jpg" || f === "jpeg") {
    return {
      accept: "image/jpeg,image/png,.jpg,.jpeg,.png",
      hint: "Unggah file sesuai format: JPG atau PNG.",
      emptyHint: "JPG atau PNG · maks. 5 MB",
    };
  }
  if (f === "pdf") {
    return {
      accept: "application/pdf,.pdf",
      hint: "Unggah file PDF.",
      emptyHint: "PDF · maks. 5 MB",
    };
  }
  if (f === "doc" || f === "docx") {
    return {
      accept: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      hint: "Unggah file Word (DOC/DOCX).",
      emptyHint: "DOC atau DOCX · maks. 5 MB",
    };
  }
  if (f === "xls" || f === "xlsx") {
    return {
      accept: ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      hint: "Unggah file Excel (XLS/XLSX).",
      emptyHint: "XLS atau XLSX · maks. 5 MB",
    };
  }
  return {
    accept:
      "image/jpeg,image/png,image/webp,image/svg+xml,application/pdf,.pdf,.doc,.docx,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    hint: "Unggah satu file sesuai ketentuan dokumen.",
    emptyHint: "Gambar, PDF, Word, atau Excel · maks. 5 MB",
  };
}

function validateFile(file: File | null, maxBytes: number): string | undefined {
  if (!file) return "Pilih file terlebih dahulu.";
  if (file.size > maxBytes) return "Ukuran file maksimal 5 MB.";
  return undefined;
}

function validateFileMatchesDocumentFormat(file: File, documentFormat: string | null | undefined): string | undefined {
  const f = (documentFormat ?? "").toLowerCase().trim();
  const name = file.name.toLowerCase();
  const mime = file.type.toLowerCase();

  if (f === "jpg" || f === "jpeg") {
    const extOk = /\.(jpe?g|png)$/i.test(file.name);
    const mimeOk = mime === "image/jpeg" || mime === "image/png";
    if (mime === "image/webp" || name.endsWith(".webp")) {
      return "Format harus JPG atau PNG (WEBP tidak diperbolehkan).";
    }
    if (!mimeOk && !extOk) {
      return "Format harus JPG atau PNG.";
    }
    return undefined;
  }

  if (f === "pdf") {
    const ok = mime === "application/pdf" || name.endsWith(".pdf");
    if (!ok) return "Format harus PDF.";
    return undefined;
  }

  if (f === "doc" || f === "docx") {
    const ok =
      mime === "application/msword" ||
      mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      /\.docx?$/i.test(name);
    if (!ok) return "Format harus Word (DOC atau DOCX).";
    return undefined;
  }

  if (f === "xls" || f === "xlsx") {
    const ok =
      mime === "application/vnd.ms-excel" ||
      mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      /\.xlsx?$/i.test(name);
    if (!ok) return "Format harus Excel (XLS atau XLSX).";
    return undefined;
  }

  return undefined;
}

type Props = {
  open: boolean;
  onClose: () => void;
  projectId: number;
  document: ProjectDocument | null;
  onUploaded: (project: ProjectDetail) => void;
};

export function ProjectDocumentUploadModal({ open, onClose, projectId, document, onUploaded }: Props) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);
  const submitLockRef = useRef(false);

  const reset = useCallback(() => {
    setFile(null);
    setFieldError(undefined);
  }, []);

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const handleFileChange = (next: File | null) => {
    setFile(next);
    if (!next) {
      setFieldError(undefined);
      return;
    }
    const sizeErr = validateFile(next, MAX_FILE_BYTES);
    if (sizeErr) {
      setFieldError(sizeErr);
      return;
    }
    const formatErr = document ? validateFileMatchesDocumentFormat(next, document.document_format) : undefined;
    setFieldError(formatErr);
  };

  const submit = async () => {
    if (!document) return;
    const sizeErr = validateFile(file, MAX_FILE_BYTES);
    if (sizeErr || !file) {
      setFieldError(sizeErr ?? "Pilih file terlebih dahulu.");
      return;
    }
    const formatErr = validateFileMatchesDocumentFormat(file, document.document_format);
    if (formatErr) {
      setFieldError(formatErr);
      return;
    }
    if (pending || submitLockRef.current) return;
    submitLockRef.current = true;
    setPending(true);
    const toastId = toast.loading("Mengunggah!", { description: "Mohon tunggu sebentar." });
    try {
      const next = await uploadProjectDocument({
        projectId,
        documentId: document.id,
        file,
      });
      onUploaded(next);
      toast.success("Berhasil!", {
        description: `Dokumen "${document.name}" berhasil diunggah.`,
      });
      onClose();
      router.refresh();
    } catch (e) {
      const fromApi = e instanceof ApiError ? firstApiValidationMessage(e.errors) : undefined;
      const message =
        fromApi ??
        (e instanceof ApiError ? e.message : undefined) ??
        (e instanceof Error ? e.message : undefined) ??
        "Gagal mengunggah dokumen.";
      setFieldError(message);
      toast.error("Gagal!", { description: message });
    } finally {
      submitLockRef.current = false;
      setPending(false);
      toast.dismiss(toastId);
    }
  };

  if (!document) return null;

  const formatLabel = getProjectDocumentFormatLabel(document.document_format);
  const { accept, hint, emptyHint } = getDocumentUploadAccept(document.document_format);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) return;
        if (pending) return;
        onClose();
      }}
    >
      <DialogContent
        showCloseButton={!pending}
        className="max-w-lg"
        style={{
          height: "80vh",
          maxHeight: "80vh",
          minHeight: 0,
          overflow: "hidden",
        }}
        onPointerDownOutside={(e) => {
          if (pending) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (pending) e.preventDefault();
        }}
      >
        <DialogHeader className="shrink-0 border-b border-border text-left pb-5">
          <DialogTitle className="text-xl font-semibold leading-snug tracking-tight">Unggah dokumen</DialogTitle>
          <DialogDescription asChild>
            <div className="text-pretty text-sm leading-relaxed text-foreground">
              <span className="block font-medium">{document.name}</span>
              {formatLabel ? (
                <span className="mt-1.5 block font-medium text-brand-blue">Format file wajib: {formatLabel}</span>
              ) : null}
              {document.notes?.trim() ? <span className="mt-1.5 block text-muted-foreground">{document.notes.trim()}</span> : null}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable]">
          <ProofUploadZone
            label="File dokumen"
            hint={`${hint} Maks. 5 MB.`}
            accept={accept}
            emptyHint={emptyHint}
            dropzoneAriaLabel="Unggah dokumen proyek. Klik atau seret file ke area ini."
            value={file}
            onChange={handleFileChange}
            error={fieldError}
            disabled={pending}
          />
        </div>

        <DialogFooter className="mt-0 pt-5 shrink-0 gap-2 border-t border-border sm:justify-end">
          <Button type="button" variant="secondary" className="rounded-xl" disabled={pending} onClick={onClose}>
            Batal
          </Button>
          <Button type="button" className={cn("rounded-xl bg-brand-blue text-white hover:opacity-90")} disabled={pending || !file || Boolean(fieldError)} onClick={submit}>
            {pending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Mengunggah...
              </>
            ) : (
              "Unggah"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
