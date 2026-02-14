import { createEndpoint } from '@/configs';
import type { MatchHealthResponse } from './types';

const http = createEndpoint('match');

export const match = {
  getHealth: async (): Promise<MatchHealthResponse> =>
    await http.get<MatchHealthResponse>('/health', {
      cache: 'no-store',
    }),
};
