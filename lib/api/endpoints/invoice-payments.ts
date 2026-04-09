import { apiClient } from "@/lib/api/client";

export type InvoicePaymentFormPayload = {
  amount: string;
  payment_date: string;
  payment_method: string;
  reference_number?: string;
  notes?: string;
  proof_file?: File | null;
};

export type InvoicePaymentUpdatePayload = InvoicePaymentFormPayload & {
  remove_proof_file?: boolean;
  resubmit?: boolean;
};

function appendCommon(fd: FormData, body: InvoicePaymentFormPayload) {
  fd.set("amount", body.amount);
  fd.set("payment_date", body.payment_date);
  fd.set("payment_method", body.payment_method);
  if (body.reference_number?.trim()) fd.set("reference_number", body.reference_number.trim());
  if (body.notes?.trim()) fd.set("notes", body.notes.trim());
  if (body.proof_file) fd.set("proof_file", body.proof_file);
}

/** POST /invoices/{invoice}/payments */
export async function postInvoicePayment(invoiceId: number | string, body: InvoicePaymentFormPayload): Promise<unknown> {
  const fd = new FormData();
  appendCommon(fd, body);
  return apiClient.postFormData<unknown>(`/invoices/${encodeURIComponent(String(invoiceId))}/payments`, fd);
}

/** POST /invoices/{invoice}/payments/{payment} */
export async function updateInvoicePayment(
  invoiceId: number | string,
  paymentId: number | string,
  body: InvoicePaymentUpdatePayload,
): Promise<unknown> {
  const fd = new FormData();
  appendCommon(fd, body);
  if (body.remove_proof_file) fd.set("remove_proof_file", "1");
  if (body.resubmit) fd.set("resubmit", "1");
  return apiClient.postFormData<unknown>(
    `/invoices/${encodeURIComponent(String(invoiceId))}/payments/${encodeURIComponent(String(paymentId))}`,
    fd,
  );
}
