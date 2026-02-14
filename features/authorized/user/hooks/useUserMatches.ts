import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { user } from '@/lib/api/authorized/user';
import { match } from '@/lib/api/match';
import type { ComputeUserMatchesData } from '@/lib/api/authorized/user';

export const userMatchQueryKeys = {
	all: ['authorized-user', 'matches'],
	list: () => [...userMatchQueryKeys.all, 'list'],
	detail: (matchId: string) => [...userMatchQueryKeys.all, 'detail', matchId],
	recommendations: () => ['authorized-user', 'recommendations'],
	health: () => ['match', 'health'],
};

export function useGetUserMatches() {
	return useQuery({
		queryKey: userMatchQueryKeys.list(),
		queryFn: async () => await user.getUserMatches(),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}

export function useGetUserMatchById(matchId: string) {
	return useQuery({
		queryKey: userMatchQueryKeys.detail(matchId),
		queryFn: async () => await user.getUserMatchById(matchId),
		enabled: Boolean(matchId),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}

export function useComputeUserMatches() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ComputeUserMatchesData) => {
      const health = await match.getHealth();
      const algorithmVersion =
        data.algorithmVersion?.trim() || health.algorithm_version;

      return await user.computeUserMatches({
        ...data,
        algorithmVersion,
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userMatchQueryKeys.list() }),
				queryClient.invalidateQueries({ queryKey: userMatchQueryKeys.recommendations() }),
				queryClient.invalidateQueries({ queryKey: ['authorized-user', 'dashboard'] }),
			]);
		},
	});
}

export function useGetUserRecommendations() {
	return useQuery({
		queryKey: userMatchQueryKeys.recommendations(),
		queryFn: async () => await user.getUserRecommendations(),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}

export function useGetMatchHealth() {
	return useQuery({
		queryKey: userMatchQueryKeys.health(),
		queryFn: async () => await match.getHealth(),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}
