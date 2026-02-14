import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { user } from '@/lib/api/authorized/user';
import type {
	CreateUserEvidenceData,
	UpdateUserEvidenceData,
} from '@/lib/api/authorized/user';

export const userEvidenceQueryKeys = {
	all: ['authorized-user', 'evidence'],
	list: () => [...userEvidenceQueryKeys.all, 'list'],
	detail: (evidenceId: string) =>
		[...userEvidenceQueryKeys.all, 'detail', evidenceId],
};

export function useGetUserEvidence() {
	return useQuery({
		queryKey: userEvidenceQueryKeys.list(),
		queryFn: async () => await user.getUserEvidence(),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}

export function useGetUserEvidenceDetail(evidenceId: string) {
	return useQuery({
		queryKey: userEvidenceQueryKeys.detail(evidenceId),
		queryFn: async () => await user.getUserEvidenceDetail(evidenceId),
		enabled: Boolean(evidenceId),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}

export function useCreateUserEvidence() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateUserEvidenceData) =>
			await user.createUserEvidence(data),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: userEvidenceQueryKeys.list() }),
				queryClient.invalidateQueries({ queryKey: ['authorized-user', 'dashboard'] }),
			]);
		},
	});
}

export function useUpdateUserEvidence() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: {
			evidenceId: string;
			data: UpdateUserEvidenceData;
		}) => await user.updateUserEvidence(params.evidenceId, params.data),
		onSuccess: async (_, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: userEvidenceQueryKeys.list() }),
				queryClient.invalidateQueries({
					queryKey: userEvidenceQueryKeys.detail(variables.evidenceId),
				}),
				queryClient.invalidateQueries({ queryKey: ['authorized-user', 'dashboard'] }),
			]);
		},
	});
}

export function useDeleteUserEvidence() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (evidenceId: string) => await user.deleteUserEvidence(evidenceId),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: userEvidenceQueryKeys.list() }),
				queryClient.invalidateQueries({ queryKey: ['authorized-user', 'dashboard'] }),
			]);
		},
	});
}