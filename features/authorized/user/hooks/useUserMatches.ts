import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { user } from '@/lib/api/authorized/user';
import type { ComputeUserMatchesData } from '@/lib/api/authorized/user';

export const userMatchQueryKeys = {
	all: ['authorized-user', 'matches'],
	list: () => [...userMatchQueryKeys.all, 'list'],
	detail: (matchId: string) => [...userMatchQueryKeys.all, 'detail', matchId],
	recommendations: () => ['authorized-user', 'recommendations'],
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
		mutationFn: async (data: ComputeUserMatchesData) =>
			await user.computeUserMatches(data),
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