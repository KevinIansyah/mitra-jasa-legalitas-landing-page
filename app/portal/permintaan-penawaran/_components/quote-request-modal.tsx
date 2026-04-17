"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { postQuote, type CreateQuotePayload } from "@/lib/api/endpoints/quotes";
import { fetchServicePackages, fetchServicesCompact } from "@/lib/api/endpoints/services-compact";
import { CATEGORY_BUSINESS, STATUS_LEGAL } from "@/lib/constants/quote-business-context";
import { getQuoteBudgetLabel, getQuoteTimelineLabel } from "@/lib/constants/quote-request-labels";
import type { QuoteBudgetRange, QuoteTimeline } from "@/lib/types/quote-request";
import type { ServiceCompact, ServicePackageOption } from "@/lib/types/services-compact";
import { ApiError } from "@/lib/types/api";
import { firstApiValidationMessage, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";

const INPUT_CLASS = "w-full rounded-xl border border-input bg-white dark:bg-white/5 text-sm shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20";

const TIMELINES: QuoteTimeline[] = ["normal", "priority", "express"];
const BUDGETS: QuoteBudgetRange[] = ["under_5jt", "5_10jt", "10_25jt", "25_50jt", "above_50jt"];

function firstFieldError(errors: Record<string, string[] | boolean> | undefined, key: string): string | undefined {
  const v = errors?.[key];
  if (Array.isArray(v) && v[0]) return v[0];
  return undefined;
}

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void | Promise<void>;
};

export function QuoteRequestModal({ open, onClose, onSubmitted }: Props) {
  const router = useRouter();
  const [services, setServices] = useState<ServiceCompact[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [packages, setPackages] = useState<ServicePackageOption[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);

  const [serviceId, setServiceId] = useState<string>("");
  const [packageId, setPackageId] = useState<string>("");
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [businessLegalStatus, setBusinessLegalStatus] = useState("");
  const [timeline, setTimeline] = useState<QuoteTimeline>("normal");
  const [budgetRange, setBudgetRange] = useState<QuoteBudgetRange | "">("");
  const [notes, setNotes] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const submitLockRef = useRef(false);

  const resetForm = useCallback(() => {
    setFieldErrors({});
    setServiceId("");
    setPackageId("");
    setProjectName("");
    setDescription("");
    setBusinessType("");
    setBusinessLegalStatus("");
    setTimeline("normal");
    setBudgetRange("");
    setNotes("");
    setPackages([]);
  }, []);

  useEffect(() => {
    if (!open) return;
    resetForm();
    let cancelled = false;
    setServicesLoading(true);
    fetchServicesCompact()
      .then((d) => {
        if (!cancelled) setServices(d.services ?? []);
      })
      .catch(() => {
        if (!cancelled) toast.error("Gagal!", { description: "Tidak dapat memuat layanan." });
      })
      .finally(() => {
        if (!cancelled) setServicesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, resetForm]);

  const sid = serviceId ? Number.parseInt(serviceId, 10) : NaN;

  useEffect(() => {
    if (!open || !Number.isFinite(sid) || sid < 1) {
      setPackages([]);
      setPackageId("");
      return;
    }
    let cancelled = false;
    setPackagesLoading(true);
    fetchServicePackages(sid)
      .then((d) => {
        if (!cancelled) setPackages(d.packages ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setPackages([]);
          toast.error("Gagal!", { description: "Tidak dapat memuat paket layanan." });
        }
      })
      .finally(() => {
        if (!cancelled) setPackagesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, sid]);

  const submit = async () => {
    setFieldErrors({});
    const errors: Record<string, string> = {};
    if (!projectName.trim()) errors.project_name = "Nama proyek wajib diisi.";
    if (!description.trim()) errors.description = "Deskripsi wajib diisi.";
    if (!timeline) errors.timeline = "Timeline wajib dipilih.";
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (pending || submitLockRef.current) return;
    submitLockRef.current = true;

    const payload: CreateQuotePayload = {
      project_name: projectName.trim(),
      description: description.trim(),
      timeline,
      source: "portal",
    };
    if (serviceId) payload.service_id = Number.parseInt(serviceId, 10);
    if (packageId) payload.service_package_id = Number.parseInt(packageId, 10);
    if (businessType) payload.business_type = businessType;
    if (businessLegalStatus) payload.business_legal_status = businessLegalStatus;
    if (budgetRange) payload.budget_range = budgetRange;
    if (notes.trim()) payload.notes = notes.trim();

    setPending(true);
    const toastId = toast.loading("Mengirim!", { description: "Mohon tunggu sebentar." });
    try {
      await postQuote(payload);
      toast.success("Berhasil!", { description: "Permintaan penawaran dikirim. Tim kami akan meninjaunya." });
      onClose();
      try {
        await onSubmitted?.();
      } catch {
        toast.error("Gagal!", { description: "Daftar tidak diperbarui. Muat ulang halaman untuk melihat permintaan terbaru." });
      }
      router.refresh();
    } catch (e) {
      if (e instanceof ApiError) {
        const fe: Record<string, string> = {};
        for (const key of ["service_id", "service_package_id", "project_name", "description", "business_type", "business_legal_status", "timeline", "budget_range", "notes", "source"] as const) {
          const msg = firstFieldError(e.errors, key);
          if (msg) fe[key] = msg;
        }
        setFieldErrors(fe);
        toast.error("Gagal!", { description: firstApiValidationMessage(e.errors) ?? e.message ?? "Terjadi kesalahan." });
      } else {
        toast.error("Gagal!", { description: "Tidak dapat mengirim data. Coba lagi." });
      }
    } finally {
      submitLockRef.current = false;
      setPending(false);
      toast.dismiss(toastId);
    }
  };

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
        className="max-w-xl"
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
        <DialogHeader className="shrink-0 border-b border-border pb-5 text-left">
          <DialogTitle className="text-xl font-semibold leading-snug tracking-tight">Ajukan permintaan penawaran</DialogTitle>
          <DialogDescription className="text-pretty leading-relaxed">Pilih layanan dan paket, lalu jelaskan kebutuhan proyek Anda. Data dikirim ke tim Mitra Jasa Legalitas.</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable]">
          <div className="space-y-4 pr-1">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Layanan</Label>
              <Select
                value={serviceId || "none"}
                onValueChange={(v) => {
                  setServiceId(v === "none" ? "" : v);
                  setPackageId("");
                  setFieldErrors((prev) => {
                    const n = { ...prev };
                    delete n.service_id;
                    return n;
                  });
                }}
                disabled={pending || servicesLoading}
              >
                <SelectTrigger className="rounded-xl border border-input bg-white dark:bg-white/5 w-full shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20">
                  <SelectValue placeholder={servicesLoading ? "Memuat layanan..." : "Pilih layanan..."} />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectGroup>
                    <SelectLabel>Layanan</SelectLabel>
                    <SelectItem value="none">Layanan</SelectItem>
                    {services.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldErrors.service_id ? <p className="text-xs text-destructive">{fieldErrors.service_id}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Paket</Label>
              <Select
                value={packageId || "none"}
                onValueChange={(v) => {
                  setPackageId(v === "none" ? "" : v);
                  setFieldErrors((prev) => {
                    const n = { ...prev };
                    delete n.service_package_id;
                    return n;
                  });
                }}
                disabled={pending || !serviceId || packagesLoading}
              >
                <SelectTrigger className="rounded-xl border border-input bg-white dark:bg-white/5 w-full shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20">
                  <SelectValue placeholder={!serviceId ? "Pilih layanan dulu" : packagesLoading ? "Memuat paket..." : "Pilih paket..."} />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectGroup>
                    <SelectLabel>Paket</SelectLabel>
                    <SelectItem value="none">Paket</SelectItem>
                    {packages.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                        {p.badge ? ` (${p.badge})` : ""}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldErrors.service_package_id ? <p className="text-xs text-destructive">{fieldErrors.service_package_id}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="qr-project" className="text-xs text-muted-foreground">
                Nama proyek / kebutuhan <span className="text-destructive">*</span>
              </Label>
              <Input
                id="qr-project"
                className={cn(INPUT_CLASS, fieldErrors.project_name && "border-destructive")}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Contoh: Company Website Development"
                disabled={pending}
              />
              {fieldErrors.project_name ? <p className="text-xs text-destructive">{fieldErrors.project_name}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="qr-desc" className="text-xs text-muted-foreground">
                Deskripsi <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="qr-desc"
                rows={4}
                className={cn(INPUT_CLASS, "min-h-[100px]", fieldErrors.description && "border-destructive")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan scope, tujuan, dan konteks singkat."
                disabled={pending}
              />
              {fieldErrors.description ? <p className="text-xs text-destructive">{fieldErrors.description}</p> : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Jenis usaha</Label>
                <Select
                  value={businessType || "none"}
                  onValueChange={(v) => {
                    setBusinessType(v === "none" ? "" : v);
                    setFieldErrors((prev) => {
                      const n = { ...prev };
                      delete n.business_type;
                      return n;
                    });
                  }}
                  disabled={pending}
                >
                  <SelectTrigger className="rounded-xl border border-input bg-white dark:bg-white/5 w-full shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20">
                    <SelectValue placeholder="Pilih jenis usaha..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    <SelectItem value="none">Jenis usaha</SelectItem>
                    {CATEGORY_BUSINESS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.business_type ? <p className="text-xs text-destructive">{fieldErrors.business_type}</p> : null}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Status legalitas</Label>
                <Select
                  value={businessLegalStatus || "none"}
                  onValueChange={(v) => {
                    setBusinessLegalStatus(v === "none" ? "" : v);
                    setFieldErrors((prev) => {
                      const n = { ...prev };
                      delete n.business_legal_status;
                      return n;
                    });
                  }}
                  disabled={pending}
                >
                  <SelectTrigger className="rounded-xl border border-input bg-white dark:bg-white/5 w-full shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20">
                    <SelectValue placeholder="Pilih status legalitas..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    <SelectItem value="none">Status legalitas</SelectItem>
                    {STATUS_LEGAL.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.business_legal_status ? <p className="text-xs text-destructive">{fieldErrors.business_legal_status}</p> : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Timeline <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={timeline}
                  onValueChange={(v) => {
                    setTimeline(v as QuoteTimeline);
                    setFieldErrors((prev) => {
                      const n = { ...prev };
                      delete n.timeline;
                      return n;
                    });
                  }}
                  disabled={pending}
                >
                  <SelectTrigger className="rounded-xl border border-input bg-white dark:bg-white/5 w-full shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMELINES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {getQuoteTimelineLabel(t)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.timeline ? <p className="text-xs text-destructive">{fieldErrors.timeline}</p> : null}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Estimasi anggaran</Label>
                <Select
                  value={budgetRange || "none"}
                  onValueChange={(v) => setBudgetRange(v === "none" ? "" : (v as QuoteBudgetRange))}
                  disabled={pending}
                >
                  <SelectTrigger className="rounded-xl border border-input bg-white dark:bg-white/5 w-full shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20">
                    <SelectValue placeholder="Pilih estimasi anggaran..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Estimasi anggaran</SelectItem>
                    {BUDGETS.map((b) => (
                      <SelectItem key={b} value={b}>
                        {getQuoteBudgetLabel(b)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="qr-notes" className="text-xs text-muted-foreground">
                Catatan tambahan
              </Label>
              <Textarea
                id="qr-notes"
                rows={3}
                className={cn(INPUT_CLASS, "min-h-[80px]", fieldErrors.notes && "border-destructive")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Opsional"
                disabled={pending}
              />
              {fieldErrors.notes ? <p className="text-xs text-destructive">{fieldErrors.notes}</p> : null}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-0 shrink-0 border-t border-border gap-2 pt-5 sm:justify-end">
          <Button type="button" variant="secondary" className="rounded-xl" disabled={pending} onClick={onClose}>
            Batal
          </Button>
          <Button type="button" className="rounded-xl bg-brand-blue text-white hover:opacity-90" disabled={pending} onClick={submit}>
            {pending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              "Kirim permintaan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
