"use client";

import { startTransition, useCallback, useEffect, useId, useRef, useState } from "react";
import { FileText, ImagePlus } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEFAULT_ACCEPT = "image/jpeg,image/png,image/webp,image/svg+xml,application/pdf,.pdf";

function isPdf(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

type Props = {
  id?: string;
  label?: string;
  hint?: string;
  accept?: string;
  emptyHint?: string;
  dropzoneAriaLabel?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
};

export function ProofUploadZone({
  id: idProp,
  label = "Bukti pembayaran",
  hint = "PNG, JPG, WEBP, SVG, atau PDF · maks. 5 MB",
  accept = DEFAULT_ACCEPT,
  emptyHint = "PNG, JPG, WEBP, SVG, PDF · maks. 5 MB",
  dropzoneAriaLabel = "Unggah bukti pembayaran. Klik atau seret file ke area ini.",
  value,
  onChange,
  error,
  disabled,
}: Props) {
  const autoId = useId();
  const inputId = idProp ?? `proof-${autoId}`;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRevokeRef = useRef<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRevokeRef.current) URL.revokeObjectURL(previewRevokeRef.current);
    };
  }, []);

  useEffect(() => {
    if (!value) {
      if (previewRevokeRef.current) {
        URL.revokeObjectURL(previewRevokeRef.current);
        previewRevokeRef.current = null;
      }
      startTransition(() => {
        setPreviewUrl(null);
      });
      return;
    }
    if (isPdf(value) || !isImageFile(value)) {
      if (previewRevokeRef.current) {
        URL.revokeObjectURL(previewRevokeRef.current);
        previewRevokeRef.current = null;
      }
      startTransition(() => {
        setPreviewUrl(null);
      });
      return;
    }
    if (previewRevokeRef.current) URL.revokeObjectURL(previewRevokeRef.current);
    const url = URL.createObjectURL(value);
    previewRevokeRef.current = url;
    startTransition(() => {
      setPreviewUrl(url);
    });
  }, [value]);

  const applyFile = useCallback(
    (file: File) => {
      onChange(file);
    },
    [onChange],
  );

  const onPick = () => fileInputRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    applyFile(file);
  };

  const onDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyFile(file);
  };

  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor={inputId} className="text-xs text-gray-500">
          {label}
        </Label>
        <p className="text-xs text-gray-400">{hint}</p>
      </div>

      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled}
        onChange={onFileChange}
      />

      <div
        tabIndex={0}
        aria-label={dropzoneAriaLabel}
        onClick={disabled ? undefined : onPick}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPick();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
        }}
        onDrop={disabled ? undefined : onDropZoneDrop}
        className={cn(
          "relative flex h-48 w-full cursor-pointer overflow-hidden rounded-xl border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          previewUrl ? "border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-white/5" : "border-dashed border-gray-300 bg-gray-50 dark:border-white/25 dark:bg-white/5",
          isDragging && "border-brand-blue bg-brand-blue/5 dark:bg-brand-blue/10",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        {value && isPdf(value) ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10">
              <FileText className="size-6 text-brand-blue" aria-hidden />
            </div>
            <span className="truncate px-2 text-sm font-medium text-gray-800 dark:text-gray-200" title={value.name}>
              {value.name}
            </span>
            <span className="text-xs text-muted-foreground">PDF</span>
            {!disabled ? (
              <Button type="button" variant="secondary" size="sm" className="mt-1" onClick={(e) => { e.stopPropagation(); onPick(); }}>
                Ganti file
              </Button>
            ) : null}
          </div>
        ) : value && !isImageFile(value) ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10">
              <FileText className="size-6 text-brand-blue" aria-hidden />
            </div>
            <span className="truncate px-2 text-sm font-medium text-gray-800 dark:text-gray-200" title={value.name}>
              {value.name}
            </span>
            {!disabled ? (
              <Button type="button" variant="secondary" size="sm" className="mt-1" onClick={(e) => { e.stopPropagation(); onPick(); }}>
                Ganti file
              </Button>
            ) : null}
          </div>
        ) : previewUrl ? (
          <>
            <Image src={previewUrl} alt="Pratinjau bukti" className="h-full w-full object-contain" width={400} height={300} unoptimized />
            {!disabled ? (
              <div className="absolute right-2 top-2">
                <Button type="button" variant="secondary" size="sm" className="text-xs shadow-sm" onClick={(e) => { e.stopPropagation(); onPick(); }}>
                  Ganti
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="flex h-full w-full min-w-0 flex-col items-center justify-center gap-2 px-4 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10">
              <ImagePlus className="size-5 text-brand-blue" aria-hidden />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Klik atau seret file ke sini</span>
            <span className="text-xs text-gray-400">{emptyHint}</span>
          </div>
        )}
      </div>

      {value ? (
        <p className="truncate text-xs text-gray-500" title={value.name}>
          {value.name}
        </p>
      ) : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
