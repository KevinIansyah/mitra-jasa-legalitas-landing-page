"use client";

import { FileImage, Receipt } from "lucide-react";
import type { InvoicePayment } from "@/lib/types/invoice";
import { resolvePublicFileUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Props = {
  pay: InvoicePayment;
};

export function PaymentDocumentLinks({ pay }: Props) {
  const hasReceipt = Boolean(pay.receipt_url || pay.file_path);
  const hasProof = Boolean(pay.proof_file_url);
  const receiptHref = pay.receipt_url?.trim() || resolvePublicFileUrl(pay.file_path);
  const proofHref = pay.proof_file_url?.trim();

  if (!hasReceipt && !hasProof) {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <div className="flex items-center gap-1">
      {hasReceipt && receiptHref ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild size="icon" className="bg-brand-blue text-white hover:bg-brand-blue/90 rounded-md">
              <a href={receiptHref} target="_blank" rel="noopener noreferrer" aria-label="Buka kuitansi">
                <Receipt className="size-3.5" aria-hidden />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Kuitansi</TooltipContent>
        </Tooltip>
      ) : null}
      {hasProof && proofHref ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="secondary" size="icon" className="rounded-md">
              <a href={proofHref} target="_blank" rel="noopener noreferrer" aria-label="Buka bukti transfer">
                <FileImage className="size-3.5" aria-hidden />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Bukti transfer</TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  );
}
