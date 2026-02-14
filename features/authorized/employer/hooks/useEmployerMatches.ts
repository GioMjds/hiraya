import { useQuery } from '@tanstack/react-query';
import { employer } from '@/lib/api/authorized/employer';

export const employerMatchesQueryKeys = {
	all: ['authorized-employer', 'matches'],
	list: (roleId?: string) => [
		...employerMatchesQueryKeys.all,
		'list',
		roleId ?? 'all',
	],
};

export function useGetEmployerCandidateMatches(roleId?: string) {
	return useQuery({
		queryKey: employerMatchesQueryKeys.list(roleId),
		queryFn: async () => await employer.getRoleCandidateMatches(roleId),
		refetchOnMount: true,
		refetchOnWindowFocus: false,
	});
}
