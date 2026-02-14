import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employer } from '@/lib/api/authorized/employer';
import type { CreateRolePostingData, UpdateRolePostingData } from '@/lib/api/authorized/employer';
import { employerDashboardQueryKeys } from './useEmployerDashboard';

export const employerPostingsQueryKeys = {
	all: ['authorized-employer', 'postings'],
	list: () => [...employerPostingsQueryKeys.all, 'list'],
	detail: (postingId: string) => [
		...employerPostingsQueryKeys.all,
		'detail',
		postingId,
	],
};

export function useGetEmployerPostings() {
	return useQuery({
		queryKey: employerPostingsQueryKeys.list(),
		queryFn: async () => await employer.getRolePostings(),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}

export function useGetEmployerPostingById(postingId: string) {
	return useQuery({
		queryKey: employerPostingsQueryKeys.detail(postingId),
		queryFn: async () => await employer.getRolePostingById(postingId),
		enabled: Boolean(postingId),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}

export function useCreateRolePosting() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateRolePostingData) =>
			await employer.createRolePosting(data),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: employerPostingsQueryKeys.list() }),
				queryClient.invalidateQueries({
					queryKey: employerDashboardQueryKeys.detail(),
				}),
			]);
		},
	});
}

export function useUpdateRolePosting() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: { postingId: string; data: UpdateRolePostingData }) =>
			await employer.updateRolePosting(params.postingId, params.data),
		onSuccess: async (_, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: employerPostingsQueryKeys.list() }),
				queryClient.invalidateQueries({
					queryKey: employerPostingsQueryKeys.detail(variables.postingId),
				}),
			]);
		},
	});
}

export function usePublishRolePosting() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (postingId: string) =>
			await employer.publishRolePosting(postingId),
		onSuccess: async (_, postingId) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: employerPostingsQueryKeys.list() }),
				queryClient.invalidateQueries({
					queryKey: employerPostingsQueryKeys.detail(postingId),
				}),
			]);
		},
	});
}

export function useCloseRolePosting() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (postingId: string) => await employer.closeRolePosting(postingId),
		onSuccess: async (_, postingId) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: employerPostingsQueryKeys.list() }),
				queryClient.invalidateQueries({
					queryKey: employerPostingsQueryKeys.detail(postingId),
				}),
			]);
		},
	});
}
