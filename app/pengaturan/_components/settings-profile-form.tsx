"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Pencil, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { postSettingsProfile } from "@/lib/api/endpoints/settings";
import { getPublicApiBaseUrl } from "@/lib/api/client";
import { ApiError } from "@/lib/types/api";
import type { User } from "@/lib/types/user";
import { BRAND_BLUE } from "@/lib/types/constants";
import { cn, firstApiValidationMessage } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { r2Loader } from "@/lib/r2-loader";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

const INPUT_CLASS = "w-full max-w-md rounded-xl border border-input bg-white dark:bg-white/5 text-sm shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20";

function firstFieldError(errors: Record<string, string[] | boolean> | undefined, key: string): string | undefined {
  const v = errors?.[key];
  if (Array.isArray(v) && v[0]) return v[0];
  return undefined;
}

function resolveAvatarUrl(avatar: string | null): string | null {
  if (!avatar?.trim()) return null;
  const t = avatar.trim();
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  const base = getPublicApiBaseUrl().replace(/\/$/, "");
  return t.startsWith("/") ? `${base}${t}` : `${base}/${t}`;
}

type Props = {
  initialUser: User;
};

export function SettingsProfileForm({ initialUser }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRevokeRef = useRef<string | null>(null);
  const avatarInputId = useId();

  const [name, setName] = useState(initialUser.name);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => resolveAvatarUrl(initialUser.avatar));

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (previewRevokeRef.current) {
        URL.revokeObjectURL(previewRevokeRef.current);
      }
    };
  }, []);

  const applyAvatarFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setFieldErrors((prev) => ({
        ...prev,
        avatar: "Gunakan file gambar (PNG, JPG, WEBP, SVG).",
      }));
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setFieldErrors((prev) => ({
        ...prev,
        avatar: "Ukuran file maksimal 5 MB.",
      }));
      return;
    }
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.avatar;
      return next;
    });
    if (previewRevokeRef.current) {
      URL.revokeObjectURL(previewRevokeRef.current);
      previewRevokeRef.current = null;
    }
    const url = URL.createObjectURL(file);
    previewRevokeRef.current = url;
    setPreviewUrl(url);
    setAvatarFile(file);
    setRemoveAvatar(false);
  }, []);

  const onPickFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    applyAvatarFile(file);
  };

  const onDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDropZoneDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDropZoneDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const onDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyAvatarFile(file);
  };

  const onRemoveAvatar = () => {
    if (previewRevokeRef.current) {
      URL.revokeObjectURL(previewRevokeRef.current);
      previewRevokeRef.current = null;
    }
    setAvatarFile(null);
    setRemoveAvatar(true);
    setPreviewUrl(null);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const toastId = toast.loading("Mengirim!", {
      description: "Menyimpan perubahan profil Anda.",
    });

    setFieldErrors({});
    setLoading(true);

    try {
      const updated = await postSettingsProfile({
        name,
        avatar: avatarFile ?? undefined,
        remove_avatar: removeAvatar || undefined,
      });

      if (previewRevokeRef.current) {
        URL.revokeObjectURL(previewRevokeRef.current);
        previewRevokeRef.current = null;
      }

      setName(updated.name);
      setAvatarFile(null);
      setRemoveAvatar(false);
      setPreviewUrl(resolveAvatarUrl(updated.avatar));
      toast.success("Berhasil!", {
        description: "Profil berhasil diperbarui.",
      });
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          const next: Record<string, string> = {};
          for (const key of ["name", "avatar", "email"] as const) {
            const msg = firstFieldError(err.errors, key);
            if (msg) next[key] = msg;
          }
          setFieldErrors(next);
        }

        const desc = firstApiValidationMessage(err.errors) ?? err.message ?? "Terjadi kesalahan saat menyimpan profil.";
        toast.error("Gagal!", { description: desc });
      } else {
        toast.error("Gagal!", {
          description: "Tidak dapat menyimpan profil. Silakan coba lagi.",
        });
      }
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <section className="max-w-lg">
      <header className="mb-8">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">Informasi profil</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">Perbarui nama, email, dan avatar Anda</p>
      </header>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <div>
            <Label htmlFor={avatarInputId} className="text-xs text-gray-500">
              Avatar
            </Label>
            <p className="text-xs text-gray-400">Rekomendasi: foto persegi, maks. 5 MB (PNG, JPG, WEBP)</p>
          </div>

          <div className="w-full max-w-md">
            <input ref={fileInputRef} id={avatarInputId} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" onChange={onFileChange} />
            <div
              tabIndex={0}
              aria-label="Unggah foto profil. Klik atau seret file gambar ke area ini."
              onClick={onPickFile}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPickFile();
                }
              }}
              onDragEnter={onDropZoneDragEnter}
              onDragOver={onDropZoneDragOver}
              onDragLeave={onDropZoneDragLeave}
              onDrop={onDropZoneDrop}
              className={cn(
                "relative flex h-56 w-full cursor-pointer overflow-hidden rounded-xl border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                previewUrl ? "border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-white/5" : "border-dashed border-gray-300 bg-gray-50 dark:border-white/25 dark:bg-white/5",
                isDragging && "border-brand-blue bg-brand-blue/5 dark:bg-brand-blue/10",
              )}
            >
              {previewUrl ? (
                <>
                  <Image loader={r2Loader} src={previewUrl} alt="Foto profil" className="h-full w-full object-cover" width={100} height={100} unoptimized />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPickFile();
                      }}
                      className="h-9 px-3 text-xs shadow-sm"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveAvatar();
                      }}
                      className="h-9 w-9 shrink-0"
                      aria-label="Hapus foto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex h-full w-full min-w-0 flex-col items-center justify-center gap-2 px-4 py-8 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-brand-blue/10 rounded-full">
                    <ImagePlus className="size-4.5 text-brand-blue" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Klik atau seret foto ke sini</span>
                  <span className="text-xs text-gray-400">PNG, JPG, WEBP, SVG · maks. 5 MB</span>
                </div>
              )}
            </div>
            {avatarFile && (
              <p className="mt-2 truncate text-xs text-gray-500" title={avatarFile.name}>
                {avatarFile.name}
              </p>
            )}
          </div>
          {fieldErrors.avatar && <p className="text-xs text-destructive">{fieldErrors.avatar}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="settings-email" className="text-xs text-gray-500">
            Alamat Email
          </Label>
          <Input id="settings-email" name="email" type="email" readOnly value={initialUser.email} className={`${INPUT_CLASS} cursor-not-allowed opacity-90`} autoComplete="email" />
          <p className="text-xs text-gray-400">Email tidak dapat diubah di sini.</p>
          {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="settings-name" className="text-xs text-gray-500">
            Nama
          </Label>
          <Input id="settings-name" name="name" value={name} onChange={(e) => setName(e.target.value)} required className={INPUT_CLASS} autoComplete="name" />
          {fieldErrors.name && <p className="text-xs text-destructive">{fieldErrors.name}</p>}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan profil"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
