import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { user } from '@/lib/api/authorized/user';
import type {
	AddUserSkillData,
	UpdateUserSkillData,
} from '@/lib/api/authorized/user';

export const userSkillQueryKeys = {
	all: ['authorized-user', 'skills'],
	list: () => [...userSkillQueryKeys.all, 'list'],
};

export function useGetUserSkills() {
	return useQuery({
		queryKey: userSkillQueryKeys.list(),
		queryFn: async () => await user.getUserSkills(),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}

export function useAddUserSkill() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: AddUserSkillData) => await user.addUserSkill(data),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: userSkillQueryKeys.list() }),
				queryClient.invalidateQueries({ queryKey: ['authorized-user', 'dashboard'] }),
				queryClient.invalidateQueries({ queryKey: ['authorized-user', 'recommendations'] }),
			]);
		},
	});
}

export function useUpdateUserSkill() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: { userSkillId: string; data: UpdateUserSkillData }) =>
			await user.updateUserSkill(params.userSkillId, params.data),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: userSkillQueryKeys.list() }),
				queryClient.invalidateQueries({ queryKey: ['authorized-user', 'dashboard'] }),
				queryClient.invalidateQueries({ queryKey: ['authorized-user', 'recommendations'] }),
			]);
		},
	});
}

export function useRemoveUserSkill() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (userSkillId: string) => await user.removeUserSkill(userSkillId),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: userSkillQueryKeys.list() }),
				queryClient.invalidateQueries({ queryKey: ['authorized-user', 'dashboard'] }),
				queryClient.invalidateQueries({ queryKey: ['authorized-user', 'recommendations'] }),
			]);
		},
	});
}