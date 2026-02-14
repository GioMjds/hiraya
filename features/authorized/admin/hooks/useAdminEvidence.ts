import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { admin } from '@/lib/api/authorized/admin';

export const adminEvidenceQueryKeys = {
	all: ['authorized-admin', 'evidence-reviews'],
	queue: () => [...adminEvidenceQueryKeys.all, 'queue'],
	detail: (id: string) => [...adminEvidenceQueryKeys.all, 'detail', id],
};

export function useGetAdminEvidenceQueue() {
	return useQuery({
		queryKey: adminEvidenceQueryKeys.queue(),
		queryFn: async () => await admin.getEvidenceReviewQueue(),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}

export function useGetAdminEvidenceReviewById(id: string) {
	return useQuery({
		queryKey: adminEvidenceQueryKeys.detail(id),
		queryFn: async () => await admin.getEvidenceReviewById(id),
		enabled: Boolean(id),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}

export function useApproveAdminEvidenceReview() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => await admin.approveEvidenceReview(id),
		onSuccess: async (_, id) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: adminEvidenceQueryKeys.queue() }),
				queryClient.invalidateQueries({ queryKey: adminEvidenceQueryKeys.detail(id) }),
			]);
		},
	});
}

export function useRejectAdminEvidenceReview() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: { id: string; reason: string }) =>
			await admin.rejectEvidenceReview(params.id, { reason: params.reason }),
		onSuccess: async (_, params) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: adminEvidenceQueryKeys.queue() }),
				queryClient.invalidateQueries({ queryKey: adminEvidenceQueryKeys.detail(params.id) }),
			]);
		},
	});
}
