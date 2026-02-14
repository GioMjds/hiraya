import { ApiError, createEndpoint } from '@/configs';
import type { MatchHealthResponse } from './types';

const http = createEndpoint('match');

function assertHealthContract(data: MatchHealthResponse): MatchHealthResponse {
  if (!data.status || !data.service) {
    throw new ApiError('Match health payload is invalid.', 502, null);
  }
  if (!data.algorithm_version || !data.matching_source || !data.canonical_source) {
    throw new ApiError('Match health metadata is incomplete.', 502, null);
  }
  return data;
}

export const match = {
  getHealth: async (): Promise<MatchHealthResponse> =>
    assertHealthContract(
      await http.get<MatchHealthResponse>('/health', {
        cache: 'no-store',
      }),
    ),
};
