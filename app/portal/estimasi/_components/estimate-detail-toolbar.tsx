"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";
import { patchEstimateStatus } from "@/lib/api/endpoints/estimates";
import { getEstimateStatusMeta } from "@/lib/constants/estimate-status";
import type { EstimateStatus } from "@/lib/types/estimate";
import { ApiError } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  estimateId: number;
  status: EstimateStatus;
  pdfHref: string | null;
  pdfDownloadFilename: string;
};

export function EstimateDetailToolbar({ estimateId, status, pdfHref, pdfDownloadFilename }: Props) {
  const router = useRouter();
  const canRespond = status === "sent" || status === "draft";

  const [acceptOpen, setAcceptOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [pending, setPending] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  async function submitAccept() {
    setPending(true);
    const toastId = toast.loading("Mengirim!", { description: "Memperbarui status estimasi." });
    try {
      await patchEstimateStatus(estimateId, { status: "accepted" });
      toast.success("Berhasil!", { description: "Estimasi disetujui. Status telah diperbarui." });
      setAcceptOpen(false);
      router.refresh();
    } catch (e) {
      toast.error("Gagal!", {
        description: e instanceof ApiError ? e.message : "Tidak dapat memperbarui status.",
      });
    } finally {
      toast.dismiss(toastId);
      setPending(false);
    }
  }

  async function submitReject() {
    const reason = rejectReason.trim();
    if (!reason) {
      toast.error("Gagal!", { description: "Alasan penolakan wajib diisi." });
      return;
    }
    if (reason.length > 500) {
      toast.error("Gagal!", { description: "Alasan penolakan maksimal 500 karakter." });
      return;
    }
    setPending(true);
    const toastId = toast.loading("Mengirim!", { description: "Memperbarui status estimasi." });
    try {
      await patchEstimateStatus(estimateId, { status: "rejected", rejected_reason: reason });
      toast.success("Berhasil!", { description: "Estimasi ditolak. Status telah diperbarui." });
      setRejectReason("");
      setRejectOpen(false);
      router.refresh();
    } catch (e) {
      toast.error("Gagal!", {
        description: e instanceof ApiError ? e.message : "Tidak dapat memperbarui status.",
      });
    } finally {
      toast.dismiss(toastId);
      setPending(false);
    }
  }

  const acceptedBadge = getEstimateStatusMeta("accepted");
  const rejectedBadge = getEstimateStatusMeta("rejected");

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {pdfHref ? (
          <button
            type="button"
            disabled={pdfLoading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-70"
            onClick={async () => {
              setPdfLoading(true);
              try {
                await apiClient.downloadPortalAttachment(pdfHref, pdfDownloadFilename);
              } catch (e) {
                toast.error(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Tidak dapat mengunduh estimasi.");
              } finally {
                setPdfLoading(false);
              }
            }}
          >
            {pdfLoading ? (
              <>
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                Mengunduh…
              </>
            ) : (
              "Unduh estimasi"
            )}
          </button>
        ) : null}

        {canRespond ? (
          <>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              onClick={() => setAcceptOpen(true)}
            >
              Setujui
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-destructive px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-destructive/90"
              onClick={() => setRejectOpen(true)}
            >
              Tolak
            </button>
          </>
        ) : null}
      </div>

      <Dialog
        open={acceptOpen}
        onOpenChange={(o) => {
          if (!pending) setAcceptOpen(o);
        }}
      >
        <DialogContent
          className="max-w-lg"
          onPointerDownOutside={(e) => {
            if (pending) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (pending) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Ubah status estimasi</DialogTitle>
            <DialogDescription>Anda akan mengubah status estimasi menjadi:</DialogDescription>
          </DialogHeader>
          <div className="mt-1">
            <span className={cn("inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold", acceptedBadge.classes)}>{acceptedBadge.label}</span>
          </div>
          <DialogFooter className="gap-2 sm:gap-3">
            <Button type="button" variant="secondary" className="rounded-xl" disabled={pending} onClick={() => setAcceptOpen(false)}>
              Batal
            </Button>
            <Button type="button" className="rounded-xl bg-brand-blue text-white hover:opacity-90" disabled={pending} onClick={submitAccept}>
              {pending ? "Memproses..." : "Ya, ubah status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={rejectOpen}
        onOpenChange={(o) => {
          if (!pending) setRejectOpen(o);
        }}
      >
        <DialogContent
          className="max-w-lg"
          onPointerDownOutside={(e) => {
            if (pending) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (pending) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Ubah status estimasi</DialogTitle>
            <DialogDescription>Anda akan mengubah status estimasi menjadi:</DialogDescription>
          </DialogHeader>
          <div className="mt-1">
            <span className={cn("inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold", rejectedBadge.classes)}>{rejectedBadge.label}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimate-reject-reason" className="text-sm font-semibold text-gray-900 dark:text-white">
              Alasan penolakan <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="estimate-reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Jelaskan alasan estimasi ini ditolak..."
              rows={4}
              maxLength={500}
              disabled={pending}
              className="min-h-[120px] rounded-xl text-sm"
              aria-invalid={rejectReason.length > 500}
            />
            <p className="text-xs text-muted-foreground">Alasan ini dapat digunakan untuk komunikasi lebih lanjut mengenai estimasi.</p>
          </div>

          <DialogFooter className="gap-2 sm:gap-3">
            <Button type="button" variant="secondary" className="rounded-xl" disabled={pending} onClick={() => setRejectOpen(false)}>
              Batal
            </Button>
            <Button type="button" variant="destructive" className="rounded-xl" disabled={pending} onClick={submitReject}>
              {pending ? "Memproses..." : "Ya, ubah status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
