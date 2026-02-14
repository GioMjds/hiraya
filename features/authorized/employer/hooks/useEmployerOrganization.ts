import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employer } from '@/lib/api/authorized/employer';
import type {
	InviteOrganizationMemberData,
	UpdateEmployerOrganizationData,
	UpdateOrganizationMemberRoleData,
} from '@/lib/api/authorized/employer';
import { employerDashboardQueryKeys } from './useEmployerDashboard';

export const employerOrganizationQueryKeys = {
	all: ['authorized-employer', 'organization'],
	detail: () => [...employerOrganizationQueryKeys.all, 'detail'],
	members: () => [...employerOrganizationQueryKeys.all, 'members'],
};

export function useGetEmployerOrganization() {
	return useQuery({
		queryKey: employerOrganizationQueryKeys.detail(),
		queryFn: async () => await employer.getOrganization(),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}

export function useGetEmployerMembers() {
	return useQuery({
		queryKey: employerOrganizationQueryKeys.members(),
		queryFn: async () => await employer.getOrganizationMembers(),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}

export function useUpdateEmployerOrganization() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: {
			organizationId: string;
			data: UpdateEmployerOrganizationData;
		}) => await employer.updateOrganization(params.organizationId, params.data),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: employerOrganizationQueryKeys.detail(),
				}),
				queryClient.invalidateQueries({
					queryKey: employerDashboardQueryKeys.detail(),
				}),
			]);
		},
	});
}

export function useInviteOrganizationMember() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: InviteOrganizationMemberData) =>
			await employer.inviteOrganizationMember(data),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: employerOrganizationQueryKeys.members(),
				}),
				queryClient.invalidateQueries({
					queryKey: employerDashboardQueryKeys.detail(),
				}),
			]);
		},
	});
}

export function useUpdateOrganizationMemberRole() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: {
			memberId: string;
			data: UpdateOrganizationMemberRoleData;
		}) => await employer.updateOrganizationMemberRole(params.memberId, params.data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: employerOrganizationQueryKeys.members(),
			});
		},
	});
}

export function useRemoveOrganizationMember() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (memberId: string) =>
			await employer.removeOrganizationMember(memberId),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: employerOrganizationQueryKeys.members(),
				}),
				queryClient.invalidateQueries({
					queryKey: employerDashboardQueryKeys.detail(),
				}),
			]);
		},
	});
}
