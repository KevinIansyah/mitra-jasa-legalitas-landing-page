import { cache } from 'react';
import { apiServer } from '@/lib/api/server';
import { EMPTY_HOME_DATA, type HomeData } from '@/lib/types/home';

export const getHomeData = cache(async (): Promise<HomeData> => {
  try {
    return await apiServer.get<HomeData>('/home');
  } catch {
    return EMPTY_HOME_DATA;
  }
});
