import { apiClient } from '@/lib/api/client';
import type { ContactMessagePayload } from '@/lib/types/company-information';

export async function postContactMessage(
  payload: ContactMessagePayload,
): Promise<unknown> {
  return apiClient.post<unknown>('/contact-messages', payload);
}
