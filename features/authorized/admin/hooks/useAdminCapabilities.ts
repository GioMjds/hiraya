import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { admin } from '@/lib/api/authorized/admin';
import type {
	CreateAdminCapabilityData,
	UpdateAdminCapabilityData,
} from '@/lib/api/authorized/admin';

export const adminCapabilityQueryKeys = {
	all: ['authorized-admin', 'capabilities'],
	list: () => [...adminCapabilityQueryKeys.all, 'list'],
};

export function useGetAdminCapabilities() {
	return useQuery({
		queryKey: adminCapabilityQueryKeys.list(),
		queryFn: async () => await admin.getCapabilities(),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}

export function useCreateAdminCapability() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateAdminCapabilityData) =>
			await admin.createCapability(data),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: adminCapabilityQueryKeys.list() }),
				queryClient.invalidateQueries({ queryKey: ['authorized-admin', 'dashboard'] }),
			]);
		},
	});
}

export function useUpdateAdminCapability() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: { id: string; data: UpdateAdminCapabilityData }) =>
			await admin.updateCapability(params.id, params.data),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: adminCapabilityQueryKeys.list() }),
				queryClient.invalidateQueries({ queryKey: ['authorized-admin', 'dashboard'] }),
			]);
		},
	});
}

export function useArchiveAdminCapability() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => await admin.archiveCapability(id),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: adminCapabilityQueryKeys.list() }),
				queryClient.invalidateQueries({ queryKey: ['authorized-admin', 'dashboard'] }),
			]);
		},
	});
}
