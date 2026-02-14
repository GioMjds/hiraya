import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employer } from '@/lib/api/authorized/employer';
import type { CreateEmployerRoleData, UpdateEmployerRoleData } from '@/lib/api/authorized/employer';
import { employerDashboardQueryKeys } from './useEmployerDashboard';

export const employerRolesQueryKeys = {
	all: ['authorized-employer', 'roles'],
	list: () => [...employerRolesQueryKeys.all, 'list'],
	detail: (roleId: string) => [...employerRolesQueryKeys.all, 'detail', roleId],
};

export function useGetEmployerRoles() {
	return useQuery({
		queryKey: employerRolesQueryKeys.list(),
		queryFn: async () => await employer.getRoles(),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}

export function useGetEmployerRoleById(roleId: string) {
	return useQuery({
		queryKey: employerRolesQueryKeys.detail(roleId),
		queryFn: async () => await employer.getRoleById(roleId),
		enabled: Boolean(roleId),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}

export function useCreateEmployerRole() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateEmployerRoleData) => await employer.createRole(data),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: employerRolesQueryKeys.list() }),
				queryClient.invalidateQueries({
					queryKey: employerDashboardQueryKeys.detail(),
				}),
			]);
		},
	});
}

export function useUpdateEmployerRole() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: { roleId: string; data: UpdateEmployerRoleData }) =>
			await employer.updateRole(params.roleId, params.data),
		onSuccess: async (_, variables) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: employerRolesQueryKeys.list() }),
				queryClient.invalidateQueries({
					queryKey: employerRolesQueryKeys.detail(variables.roleId),
				}),
			]);
		},
	});
}

export function useArchiveEmployerRole() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (roleId: string) => await employer.archiveRole(roleId),
		onSuccess: async (_, roleId) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: employerRolesQueryKeys.list() }),
				queryClient.invalidateQueries({
					queryKey: employerRolesQueryKeys.detail(roleId),
				}),
			]);
		},
	});
}
