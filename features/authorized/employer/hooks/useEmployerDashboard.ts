import { useQuery } from '@tanstack/react-query';
import { employer } from '@/lib/api/authorized/employer';

export const employerDashboardQueryKeys = {
	all: ['authorized-employer', 'dashboard'],
	detail: () => [...employerDashboardQueryKeys.all, 'detail'],
};

export function useGetEmployerDashboard() {
	return useQuery({
		queryKey: employerDashboardQueryKeys.detail(),
		queryFn: async () => await employer.getDashboard(),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}
