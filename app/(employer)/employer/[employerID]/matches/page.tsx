import type { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { EmployerMatchesClient } from '@/features/authorized/employer/components';
import { employerMatchesQueryKeys } from '@/features/authorized/employer/hooks';
import { employer } from '@/lib/api/authorized/employer';

export const metadata: Metadata = {
  title: 'Matches',
  description:
    'Discover potential candidates for your job postings with our Employer Matches feature.',
};

export default async function Page({
  params,
}: PageProps<'/employer/[employerID]/matches'>) {
  const { employerID } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: employerMatchesQueryKeys.list(),
    queryFn: async () => await employer.getRoleCandidateMatches(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmployerMatchesClient employerId={employerID} />
    </HydrationBoundary>
  );
}
