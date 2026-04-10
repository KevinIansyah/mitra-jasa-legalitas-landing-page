"use client";

import { useState } from "react";
import { FileImage, Loader2, Receipt } from "lucide-react";
import type { InvoicePayment } from "@/lib/types/invoice";
import { resolvePublicFileUrl } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/types/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Props = {
  pay: InvoicePayment;
};

function safeFileStem(s: string | null | undefined, fallback: string): string {
  const t = (s ?? "").replace(/[/\\?%*:|"<>]/g, "-").trim();
  return t || fallback;
}

export function PaymentDocumentLinks({ pay }: Props) {
  const hasReceipt = Boolean(pay.receipt_url || pay.file_path);
  const hasProof = Boolean(pay.proof_file_url);
  const receiptHref = pay.receipt_url?.trim() || resolvePublicFileUrl(pay.file_path);
  const proofHref = pay.proof_file_url?.trim();

  const [loading, setLoading] = useState<"receipt" | "proof" | null>(null);

  async function handleDownload(kind: "receipt" | "proof", href: string, fallbackFilename: string) {
    setLoading(kind);
    try {
      await apiClient.downloadPortalAttachment(href, fallbackFilename);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Tidak dapat mengunduh berkas.");
    } finally {
      setLoading(null);
    }
  }

  if (!hasReceipt && !hasProof) {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <div className="flex items-center gap-1">
      {hasReceipt && receiptHref ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon"
              className="rounded-md bg-brand-blue text-white hover:bg-brand-blue/90"
              disabled={loading !== null}
              aria-label="Unduh kuitansi"
              onClick={() =>
                handleDownload(
                  "receipt",
                  receiptHref,
                  `Kuitansi-${safeFileStem(pay.receipt_number, String(pay.id))}.pdf`,
                )
              }
            >
              {loading === "receipt" ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <Receipt className="size-3.5" aria-hidden />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Kuitansi</TooltipContent>
        </Tooltip>
      ) : null}
      {hasProof && proofHref ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="rounded-md"
              disabled={loading !== null}
              aria-label="Unduh bukti transfer"
              onClick={() => {
                const fromUrl = proofHref.split("/").pop()?.split("?")[0]?.trim();
                const fallback =
                  fromUrl && fromUrl.includes(".")
                    ? fromUrl
                    : `Bukti-transfer-${safeFileStem(pay.reference_number, String(pay.id))}`;
                void handleDownload("proof", proofHref, fallback);
              }}
            >
              {loading === "proof" ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <FileImage className="size-3.5" aria-hidden />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Bukti transfer</TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  );
}
