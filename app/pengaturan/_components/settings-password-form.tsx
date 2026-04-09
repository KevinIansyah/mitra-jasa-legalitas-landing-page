"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { putSettingsPassword } from "@/lib/api/endpoints/settings";
import { ApiError } from "@/lib/types/api";
import { BRAND_BLUE } from "@/lib/types/constants";
import { firstApiValidationMessage } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const INPUT_CLASS =
  "max-w-md rounded-xl border border-input bg-white dark:bg-white/5 text-sm shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 pr-11";

function firstFieldError(
  errors: Record<string, string[] | boolean> | undefined,
  key: string,
): string | undefined {
  const v = errors?.[key];
  if (Array.isArray(v) && v[0]) return v[0];
  return undefined;
}

export function SettingsPasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Mengirim!", {
      description: "Memperbarui password Anda.",
    });
    setFieldErrors({});
    setLoading(true);
    try {
      await putSettingsPassword({
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
      toast.success("Berhasil!", {
        description: "Password berhasil diperbarui.",
      });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          const next: Record<string, string> = {};
          for (const key of [
            "current_password",
            "password",
            "password_confirmation",
          ] as const) {
            const msg = firstFieldError(err.errors, key);
            if (msg) next[key] = msg;
          }
          setFieldErrors(next);
        }
        const desc =
          firstApiValidationMessage(err.errors) ??
          err.message ??
          "Terjadi kesalahan saat memperbarui password.";
        toast.error("Gagal!", { description: desc });
      } else {
        toast.error("Gagal!", {
          description: "Tidak dapat memperbarui password. Silakan coba lagi.",
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
        <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
          Edit password
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          Pastikan akun Anda menggunakan password yang panjang dan acak untuk
          tetap aman
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="current_password" className="text-xs text-gray-500">
            Password saat ini
          </Label>
          <div className="relative max-w-md">
            <Input
              id="current_password"
              name="current_password"
              type={showCurrentPassword ? "text" : "password"}
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={cn(INPUT_CLASS, fieldErrors.current_password && "border-destructive")}
              aria-invalid={Boolean(fieldErrors.current_password)}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((v) => !v)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label={showCurrentPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showCurrentPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
          {fieldErrors.current_password && (
            <p className="text-xs text-destructive">
              {fieldErrors.current_password}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs text-gray-500">
            Password baru
          </Label>
          <div className="relative max-w-md">
            <Input
              id="password"
              name="password"
              type={showNewPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className={cn(INPUT_CLASS, fieldErrors.password && "border-destructive")}
              aria-invalid={Boolean(fieldErrors.password)}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((v) => !v)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label={showNewPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-xs text-destructive">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="password_confirmation"
            className="text-xs text-gray-500"
          >
            Konfirmasi password
          </Label>
          <div className="relative max-w-md">
            <Input
              id="password_confirmation"
              name="password_confirmation"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              className={cn(INPUT_CLASS, fieldErrors.password_confirmation && "border-destructive")}
              aria-invalid={Boolean(fieldErrors.password_confirmation)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
          {fieldErrors.password_confirmation && (
            <p className="text-xs text-destructive">
              {fieldErrors.password_confirmation}
            </p>
          )}
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
              "Simpan password"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
