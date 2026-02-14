import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { admin } from '@/lib/api/authorized/admin';
import type { CreateAdminSkillData, UpdateAdminSkillData } from '@/lib/api/authorized/admin';

export const adminSkillQueryKeys = {
	all: ['authorized-admin', 'skills'],
	list: () => [...adminSkillQueryKeys.all, 'list'],
};

export function useGetAdminSkills() {
	return useQuery({
		queryKey: adminSkillQueryKeys.list(),
		queryFn: async () => await admin.getSkills(),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}

export function useCreateAdminSkill() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateAdminSkillData) => await admin.createSkill(data),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: adminSkillQueryKeys.list() }),
				queryClient.invalidateQueries({ queryKey: ['authorized-admin', 'dashboard'] }),
			]);
		},
	});
}

export function useUpdateAdminSkill() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: { id: string; data: UpdateAdminSkillData }) =>
			await admin.updateSkill(params.id, params.data),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: adminSkillQueryKeys.list() }),
				queryClient.invalidateQueries({ queryKey: ['authorized-admin', 'dashboard'] }),
			]);
		},
	});
}

export function useArchiveAdminSkill() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => await admin.archiveSkill(id),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: adminSkillQueryKeys.list() }),
				queryClient.invalidateQueries({ queryKey: ['authorized-admin', 'dashboard'] }),
			]);
		},
	});
}
