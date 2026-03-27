import { apiServer } from '@/lib/api/server';
import { EMPTY_NAVIGATION, type NavigationData } from '@/lib/types/navigation';

export async function getNavigation(): Promise<NavigationData> {
  try {
    return await apiServer.get<NavigationData>('/navigation');
  } catch {
    return EMPTY_NAVIGATION;
  }
}
