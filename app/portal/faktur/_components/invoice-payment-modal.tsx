"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { postInvoicePayment, updateInvoicePayment } from "@/lib/api/endpoints/invoice-payments";
import { PAYMENT_METHODS } from "@/lib/constants/payment";
import type { InvoiceDetail, InvoicePayment } from "@/lib/types/invoice";
import { ApiError } from "@/lib/types/api";
import { firstApiValidationMessage, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProofUploadZone } from "./proof-upload-zone";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent, SelectLabel, SelectGroup } from "@/components/ui/select";

const MAX_PROOF_BYTES = 5120 * 1024;

function firstFieldError(errors: Record<string, string[] | boolean> | undefined, key: string): string | undefined {
  const v = errors?.[key];
  if (Array.isArray(v) && v[0]) return v[0];
  return undefined;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseAmountInput(s: string): number {
  const n = Number.parseFloat(s.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}

function validateProof(file: File | null): string | undefined {
  if (!file) return undefined;
  if (file.size > MAX_PROOF_BYTES) return "Ukuran bukti maksimal 5 MB.";
  const ok = file.type.startsWith("image/") || file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!ok) return "Gunakan gambar (PNG, JPG, WEBP, SVG) atau PDF.";
  return undefined;
}

type ModalMode = "create" | "revise";

type Props = {
  open: boolean;
  onClose: () => void;
  mode: ModalMode;
  invoice: InvoiceDetail;
  revisePayment?: InvoicePayment | null;
};

const INPUT_CLASS = "w-full rounded-xl border border-input bg-white dark:bg-white/5 text-sm shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20";

export function InvoicePaymentModal({ open, onClose, mode, invoice, revisePayment }: Props) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(todayIsoDate());
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const submitLockRef = useRef(false);

  const resetFromProps = useCallback(() => {
    setFieldErrors({});
    setProofFile(null);
    if (mode === "create") {
      const rem = invoice.remaining_amount ?? 0;
      const n = typeof rem === "number" ? rem : Number.parseFloat(String(rem));
      setAmount(String(Number.isFinite(n) && n > 0 ? Math.floor(n) : ""));
      setPaymentDate(todayIsoDate());
      setPaymentMethod("transfer");
      setReferenceNumber("");
      setNotes("");
    } else if (revisePayment) {
      setAmount(String(parseFloat(revisePayment.amount).toString()));
      setPaymentDate(revisePayment.payment_date?.slice(0, 10) ?? todayIsoDate());
      setPaymentMethod(revisePayment.payment_method || "transfer");
      setReferenceNumber(revisePayment.reference_number ?? "");
      setNotes(revisePayment.notes ?? "");
    }
  }, [mode, invoice.remaining_amount, revisePayment]);

  useEffect(() => {
    if (open) resetFromProps();
  }, [open, resetFromProps]);

  const handleProofChange = (file: File | null) => {
    setProofFile(file);
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.proof_file;
      return next;
    });
    if (file) {
      const err = validateProof(file);
      if (err) setFieldErrors((prev) => ({ ...prev, proof_file: err }));
    }
  };

  const submit = async () => {
    setFieldErrors({});
    const amt = parseAmountInput(amount);
    const errors: Record<string, string> = {};
    if (!Number.isFinite(amt) || amt < 1) errors.amount = "Jumlah minimal 1.";
    if (!paymentDate) errors.payment_date = "Tanggal wajib diisi.";
    if (!paymentMethod) errors.payment_method = "Metode wajib dipilih.";
    const proofErr = validateProof(proofFile);
    if (proofErr) errors.proof_file = proofErr;
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (pending || submitLockRef.current) return;
    submitLockRef.current = true;

    const payload = {
      amount: String(amt),
      payment_date: paymentDate,
      payment_method: paymentMethod,
      reference_number: referenceNumber.trim() || undefined,
      notes: notes.trim() || undefined,
      proof_file: proofFile ?? undefined,
    };

    setPending(true);
    const toastId = toast.loading("Mengirim!", {
      description: "Mohon tunggu sebentar.",
    });
    try {
      if (mode === "create") {
        await postInvoicePayment(invoice.id, payload);
        toast.success("Berhasil!", { description: "Pembayaran dikirim. Tim kami akan memverifikasi bukti Anda." });
      } else if (revisePayment) {
        await updateInvoicePayment(invoice.id, revisePayment.id, {
          ...payload,
          resubmit: true,
        });
        toast.success("Berhasil!", { description: "Revisi pembayaran dikirim. Menunggu verifikasi ulang." });
      }
      onClose();
      router.refresh();
    } catch (e) {
      if (e instanceof ApiError) {
        const fe: Record<string, string> = {};
        for (const key of ["amount", "payment_date", "payment_method", "reference_number", "notes", "proof_file"] as const) {
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

  const title = mode === "create" ? "Catat pembayaran" : "Revisi pembayaran";
  const desc =
    mode === "create" ? "Isi nominal, tanggal, metode, dan unggah bukti transfer (opsional jika diizinkan sistem)." : "Perbarui data dan unggah bukti pembayaran yang baru sesuai arahan verifikasi.";

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
        <DialogHeader className="shrink-0 border-b border-border pb-5 text-left">
          <DialogTitle className="text-xl font-semibold leading-snug tracking-tight">{title}</DialogTitle>
          <DialogDescription className="text-pretty leading-relaxed">{desc}</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable]">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="pay-amount" className="text-xs text-muted-foreground">
                Jumlah (Rp) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pay-amount"
                type="number"
                min={1}
                step={1}
                className={cn(INPUT_CLASS, fieldErrors.amount && "border-destructive")}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={pending}
              />
              {fieldErrors.amount ? <p className="text-xs text-destructive">{fieldErrors.amount}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pay-date" className="text-xs text-muted-foreground">
                Tanggal pembayaran <span className="text-destructive">*</span>
              </Label>
              <Input
                id="pay-date"
                type="date"
                className={cn(INPUT_CLASS, fieldErrors.payment_date && "border-destructive")}
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                disabled={pending}
              />
              {fieldErrors.payment_date ? <p className="text-xs text-destructive">{fieldErrors.payment_date}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pay-method" className="text-xs text-muted-foreground">
                Metode <span className="text-destructive">*</span>
              </Label>
              <SelectGroup>
                <Select value={paymentMethod || "none"} onValueChange={(value) => setPaymentMethod(value)}>
                  <SelectTrigger
                    id="topic"
                    className="rounded-xl border border-input bg-white dark:bg-white/5 text-sm w-full shadow-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20"
                  >
                    <SelectValue placeholder="Pilih topik..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectLabel>Metode Pembayaran</SelectLabel>
                    <SelectItem value="none">Opsional</SelectItem>
                    {PAYMENT_METHODS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SelectGroup>
              {fieldErrors.payment_method ? <p className="text-xs text-destructive">{fieldErrors.payment_method}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pay-ref" className="text-xs text-muted-foreground">
                Nomor referensi
              </Label>
              <Input
                id="pay-ref"
                className={cn(INPUT_CLASS, fieldErrors.reference_number && "border-destructive")}
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Contoh: kode transfer"
                disabled={pending}
              />
              {fieldErrors.reference_number ? <p className="text-xs text-destructive">{fieldErrors.reference_number}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pay-notes" className="text-xs text-muted-foreground">
                Catatan
              </Label>
              <Textarea
                id="pay-notes"
                rows={3}
                className={cn(INPUT_CLASS, "min-h-[88px]", fieldErrors.notes && "border-destructive")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Opsional"
                disabled={pending}
              />
              {fieldErrors.notes ? <p className="text-xs text-destructive">{fieldErrors.notes}</p> : null}
            </div>

            <ProofUploadZone
              label="Bukti pembayaran"
              hint="Opsional untuk pengiriman pertama jika diperbolehkan; disarankan unggah untuk verifikasi cepat. PNG, JPG, WEBP, SVG, PDF · maks. 5 MB"
              value={proofFile}
              onChange={handleProofChange}
              error={fieldErrors.proof_file}
              disabled={pending}
            />
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
            ) : mode === "create" ? (
              "Kirim"
            ) : (
              "Kirim revisi"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
