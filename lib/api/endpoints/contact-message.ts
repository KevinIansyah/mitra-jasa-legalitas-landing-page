import { apiClient } from '@/lib/api/client';
import type {
  ContactMessagePayload,
  ContactMessageResponse,
} from '@/lib/types/company-information';

export async function postContactMessage(
  payload: ContactMessagePayload,
): Promise<ContactMessageResponse> {
  return apiClient.post<ContactMessageResponse>('/contact-messages', payload);
}
